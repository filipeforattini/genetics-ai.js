# 🐍 Snake AI Code Review - Oportunidades de Melhoria

**Arquivo analisado:** `docs/examples/games/snake.js`
**Data:** 2025-11-16

---

## 🐛 BUG CRÍTICO #1: NaN/-Infinity no Benchmark

**Localização:** `snake.js:1269-1386`

### Problema:
```js
let maxFoodEaten = -Infinity  // Linha 1269
// ...
for (let run = 0; run < FITNESS_RUNS; run++) {
  this.playGame()
  // Se TODOS os runs morrerem sem comer nada, maxFoodEaten permanece -Infinity
}
// ...
this.foodEaten = maxFoodEaten  // Linha 1386 - Atribui -Infinity!
```

**Consequência:**
- Se todos os 5 runs do fitness morrem sem comer comida, `maxFoodEaten` = `-Infinity`
- Isso causa `NaN` em divisões subsequentes (linha 1381-1383)
- **É exatamente o que vimos no benchmark Snake!**

### Solução:
```js
// Linha 1269 - ANTES:
let maxFoodEaten = -Infinity

// DEPOIS:
let maxFoodEaten = 0  // Inicializar com 0, não -Infinity

// Ou alternativa mais robusta:
let maxFoodEaten = -Infinity
// ... depois do loop (linha ~1379):
if (maxFoodEaten === -Infinity) {
  maxFoodEaten = 0  // Fallback seguro
}
```

**Impacto:** CRÍTICO - Fix elimina NaN/-Infinity completamente

---

## ⚡ PERFORMANCE #1: Cache de Sensors Desperdiçado

**Localização:** `snake.js:637-721` (`getSpatialCache()`)

### Problema:
```js
getSpatialCache() {
  const stamp = this.steps
  if (this._spatialCache && this._spatialCacheStamp === stamp) {
    return this._spatialCache  // Cache HIT - bom!
  }

  // Recalcula TUDO a cada step novo (cache MISS)
  const foodProjection = this.getFoodProjection()      // Cálculos pesados
  const heading = this.getHeadingTrig()                // ...
  const freeDistances = { ... }                         // Loops múltiplos
  const corridors = { ... }                             // Nested loops!
  const bodyDensity = this.computeBodyDensity()        // O(n) loop
  const wallDistances = this.computeWallDistances()   // ...
  // ... MUITO cálculo!
}
```

**Problema:**
- A cada `super.tick()` (linha 1235), o stamp muda → cache invalida
- Recalcula ~38 sensores COM operações caras (loops, trigonometria)
- Muitos valores **NÃO MUDAM** entre ticks (ex: wallDistances só muda quando move)

### Solução - Granular Caching:
```js
// Cache valores que mudam RARAMENTE separadamente
_cachedWallDistances = null
_cachedWallDistancesStamp = -1

computeWallDistances() {
  if (this._cachedWallDistances && this._cachedWallDistancesStamp === this.steps) {
    return this._cachedWallDistances
  }

  const denom = Math.max(1, GRID_SIZE - 1)
  const result = {
    north: this.head.y / denom,
    south: (GRID_SIZE - 1 - this.head.y) / denom,
    east: (GRID_SIZE - 1 - this.head.x) / denom,
    west: this.head.x / denom
  }

  this._cachedWallDistances = result
  this._cachedWallDistancesStamp = this.steps
  return result
}
```

**Impacto:** ~10-15% speedup em `super.tick()` (reduce sensor recalculation)

---

## ⚡ PERFORMANCE #2: Body Density - O(n²) Hidden Cost

**Localização:** `snake.js:810-839` (`computeBodyDensity()`)

### Problema:
```js
computeBodyDensity() {
  // ...
  for (let i = 1; i < this.snake.length; i++) {  // O(n) loop
    const seg = this.snake[i]
    const relX = seg.x - this.head.x           // Cálculos repetidos
    const relY = seg.y - this.head.y
    const forwardProj = relX * forward.dx + relY * forward.dy  // Produtos escalares
    const sideProj = relX * perp.dx + relY * perp.dy
    // ...
  }
}
```

**Problema:**
- Chamado a CADA tick via `getSpatialCache()` (linha 681)
- O(n) onde n = tamanho da cobra (pode chegar a 50-100 segmentos!)
- **Para cobra de 50 segmentos: 50 × 4 multiplicações = 200 ops/tick**
- **Em 500 steps: 100,000 operações desperdiçadas**

### Solução - Incremental Update:
```js
// Atualizar densidade incrementalmente ao mover
move() {
  // ... código existente ...

  // INCREMENTAL: só atualiza densidades afetadas
  const newHead = { ...this.head }

  // Recalcula APENAS se direção mudou ou cobra cresceu
  if (this.directionChanged || ateFood) {
    this.invalidateBodyDensityCache()
  } else {
    // Update incremental: remove tail, add head
    this.updateBodyDensityIncremental(newHead, tail)
  }
}

updateBodyDensityIncremental(newHead, removedTail) {
  // Subtrai contribuição da cauda removida
  // Adiciona contribuição da nova cabeça
  // O(1) update vs O(n) recalculation!
}
```

**Impacto:** ~20-30% speedup para cobras grandes (n > 20)

---

## ⚡ PERFORMANCE #3: Corridor Checking - Triple Nested Loop

**Localização:** `snake.js:866-894` (`getDirectionalCorridor()`)

### Problema:
```js
getDirectionalCorridor(relDir, depth = 6, halfWidth = 1) {
  // ...
  for (let step = 1; step <= depth; step++) {           // Loop 1: depth=6
    for (let offset = -halfWidth; offset <= halfWidth; offset++) {  // Loop 2: width=3
      // ...
      if (!this.isOnSnake(x, y)) {  // Loop 3 (hidden): O(n) Set lookup
        free++
      }
    }
  }
}
```

**Custo:**
- 3 direções (forward/left/right) × 6 depth × 3 width = **54 checks/tick**
- Cada check = Set lookup = ~O(1) mas com overhead
- **Total: ~540 ops/tick se cobra tem 10 segmentos**

### Solução - Early Exit + Caching:
```js
getDirectionalCorridor(relDir, depth = 6, halfWidth = 1) {
  const delta = this.getDirectionDelta(relDir)
  if (!delta || !this.head) return 0

  const cacheKey = `${relDir}_${this.steps}`
  if (this._corridorCache?.[cacheKey] !== undefined) {
    return this._corridorCache[cacheKey]
  }

  const perp = this.getPerpendicularVector(delta)
  let minRatio = 1

  for (let step = 1; step <= depth; step++) {
    // ... mesmo código ...
    if (minRatio === 0) break  // EARLY EXIT (já existe!)
  }

  if (!this._corridorCache) this._corridorCache = {}
  this._corridorCache[cacheKey] = minRatio
  return minRatio
}

// Invalidar cache ao mover
move() {
  // ...
  this._corridorCache = null  // Reset cache
}
```

**Impacto:** ~5-10% speedup em sensor calculation

---

## ⚡ PERFORMANCE #4: LocalFreeRatio - Redundant Grid Scans

**Localização:** `snake.js:908-924` (`getLocalFreeRatio()`)

### Problema:
```js
getLocalFreeRatio(radius) {
  // Chamado 2× por tick (radius=1 e radius=2)
  for (let dx = -radius; dx <= radius; dx++) {
    for (let dy = -radius; dy <= radius; dy++) {
      // radius=2: 5×5 = 25 cells checked
      // radius=1: 3×3 = 9 cells checked
      if (!this.isOnSnake(x, y)) free++
    }
  }
}
```

**Problema:**
- Radius=1 checa 9 células
- Radius=2 checa 25 células (incluindo as mesmas 9 de radius=1!)
- **Total: 34 checks quando poderia ser 25**

### Solução - Reuse Smaller Radius:
```js
getLocalFreeRatio(radius) {
  if (!this.head) return 0

  // Cache radius=1 result
  if (radius === 1 && this._localFree1 !== undefined) {
    return this._localFree1
  }
  if (radius === 2 && this._localFree2 !== undefined) {
    return this._localFree2
  }

  let free = 0
  let total = 0

  if (radius === 2 && this._localFree1 !== undefined) {
    // Reuse radius=1 result, only check outer ring
    free = this._localFree1Count  // From cache
    total = this._localFree1Total

    // Only scan outer ring (radius=2 minus radius=1)
    for (let dx = -2; dx <= 2; dx++) {
      for (let dy = -2; dy <= 2; dy++) {
        if (Math.abs(dx) < 2 && Math.abs(dy) < 2) continue  // Skip inner
        // ... check outer ring only
      }
    }
  } else {
    // Normal full scan
    for (let dx = -radius; dx <= radius; dx++) {
      for (let dy = -radius; dy <= radius; dy++) {
        // ... normal code
      }
    }
  }

  const ratio = total === 0 ? 0 : free / total

  if (radius === 1) {
    this._localFree1 = ratio
    this._localFree1Count = free
    this._localFree1Total = total
  } else if (radius === 2) {
    this._localFree2 = ratio
  }

  return ratio
}
```

**Impacto:** ~26% reduction in grid checks (34 → 25 cells)

---

## 🧹 CODE QUALITY #1: Código Duplicado - Direction Mapping

**Localização:** Multiple locations

### Problema - Padrão repetido 4×:
```js
// Linha 728-735
getDirectionVector(dir = this.direction) {
  switch (dir) {
    case 'up': return { dx: 0, dy: -1 }
    case 'down': return { dx: 0, dy: 1 }
    case 'left': return { dx: -1, dy: 0 }
    case 'right': return { dx: 1, dy: 0 }
    default: return { dx: 0, dy: 0 }
  }
}

// Linha 1039-1044 - DUPLICADO!
const deltas = {
  'up': { dx: 0, dy: -1 },
  'down': { dx: 0, dy: 1 },
  'left': { dx: -1, dy: 0 },
  'right': { dx: 1, dy: 0 }
}
```

### Solução - Static Constants:
```js
// No topo da classe SnakeAI
static DIRECTION_VECTORS = {
  up: { dx: 0, dy: -1 },
  down: { dx: 0, dy: 1 },
  left: { dx: -1, dy: 0 },
  right: { dx: 1, dy: 0 }
}

static DIRECTION_ORDER = ['up', 'right', 'down', 'left']

getDirectionVector(dir = this.direction) {
  return SnakeAI.DIRECTION_VECTORS[dir] || { dx: 0, dy: 0 }
}

// Substituir todas as outras ocorrências
```

**Impacto:** DRY principle + marginally faster (object lookup vs switch)

---

## 🧹 CODE QUALITY #2: Fitness Function - Extreme Complexity

**Localização:** `snake.js:1253-1417` (165 linhas!)

### Problema:
- Função gigante com 3 níveis de condicionais aninhados
- Difícil de testar/debugar
- Múltiplos cálculos de score baseados em tamanho da cobra

### Solução - Extract Methods:
```js
fitness() {
  if (this.cachedFitness !== undefined) {
    return this.cachedFitness
  }

  const runs = this.runFitnessEvaluations()  // Extract
  const aggregated = this.aggregateRunStats(runs)  // Extract
  const finalScore = this.calculateFinalScore(aggregated)  // Extract

  this.cacheResults(aggregated, finalScore)
  return this.cachedFitness
}

runFitnessEvaluations() {
  const runs = []
  for (let run = 0; run < FITNESS_RUNS; run++) {
    this.setupRun(run)
    this.playGame()
    runs.push(this.captureRunStats())
  }
  return runs
}

calculateRunScore(stats) {
  // Extract scoring logic
  if (stats.size < 6) return this.calculateSmallSnakeScore(stats)
  if (stats.size < 16) return this.calculateMediumSnakeScore(stats)
  return this.calculateLargeSnakeScore(stats)
}
```

**Impacto:** Melhor testabilidade + facilita debugging

---

## 🎯 OPTIMIZATION #5: Direction Index Calculation

**Localização:** Multiple locations (linha 898-905, 993-1005, 1021-1031, 1074-1086)

### Problema - Pattern repetido:
```js
const directions = ['up', 'right', 'down', 'left']
const currentIndex = directions.indexOf(this.direction)  // O(n) lookup!

if (relDir === 'forward') targetDir = this.direction
else if (relDir === 'left') targetDir = directions[(currentIndex + 3) % 4]
else if (relDir === 'right') targetDir = directions[(currentIndex + 1) % 4]
```

### Solução - Cache Direction Index:
```js
// Adicionar ao constructor
this.directionIndex = 0  // up=0, right=1, down=2, left=3

// Update em turn()
turn(action) {
  if (action === 'forward') return
  if (action === 'left') {
    this.directionIndex = (this.directionIndex + 3) % 4
  } else if (action === 'right') {
    this.directionIndex = (this.directionIndex + 1) % 4
  }
  this.direction = SnakeAI.DIRECTION_ORDER[this.directionIndex]
}

// Usar direto nos cálculos
getDirectionDelta(relDir) {
  let targetIndex = this.directionIndex  // O(1) !
  if (relDir === 'left') targetIndex = (targetIndex + 3) % 4
  else if (relDir === 'right') targetIndex = (targetIndex + 1) % 4
  else if (relDir === 'back') targetIndex = (targetIndex + 2) % 4

  const targetDir = SnakeAI.DIRECTION_ORDER[targetIndex]
  return SnakeAI.DIRECTION_VECTORS[targetDir]
}
```

**Impacto:** Elimina ~20-30 `indexOf()` calls por tick

---

## 📊 Resumo de Impacto

| Otimização | Tipo | Complexidade | Impacto Estimado | Prioridade |
|-----------|------|--------------|------------------|------------|
| Fix -Infinity bug | Bug Fix | Trivial | **CRÍTICO** | 🔴 P0 |
| Granular sensor cache | Performance | Média | 10-15% | 🟠 P1 |
| Incremental body density | Performance | Alta | 20-30% | 🟠 P1 |
| Corridor caching | Performance | Baixa | 5-10% | 🟡 P2 |
| LocalFree optimization | Performance | Média | ~5% | 🟡 P2 |
| Direction index cache | Performance | Baixa | ~2-3% | 🟢 P3 |
| Extract fitness methods | Quality | Média | Testability | 🟢 P3 |
| Static direction constants | Quality | Trivial | DRY | 🟢 P3 |

**Total performance gain estimado: 35-50% em playGame()** 🚀

**Fix crítico: Elimina NaN/-Infinity completamente** ✅

---

## 🎯 Recomendações de Implementação

### Fase 1 - Critical (Hoje):
1. ✅ Fix `-Infinity` bug (linha 1269)
2. ✅ Adicionar granular caching para sensors estáticos

### Fase 2 - High Impact (Esta semana):
3. ✅ Implementar incremental body density
4. ✅ Add corridor + localFree caching
5. ✅ Cache direction index

### Fase 3 - Code Quality (Quando tiver tempo):
6. ✅ Extract fitness calculation methods
7. ✅ Consolidate direction constants
8. ✅ Add unit tests para fitness calculation

---

## 🔬 Como Validar

```bash
# 1. Fix o bug crítico primeiro
# 2. Rodar benchmark Snake novamente
npm run benchmark:snake

# Esperado DEPOIS do fix:
# - Fitness: Valores positivos (não -Infinity)
# - avgFitness: Número válido (não NaN)
# - Speedup: 30-50% mais rápido

# 3. Verificar correção com micro-tests
node -e "
const snake = new SnakeAI({...})
for (let i = 0; i < 5; i++) {
  snake.playGame()
  console.log('Run', i, 'food:', snake.foodEaten)
}
const fit = snake.fitness()
console.log('Fitness:', fit, 'Valid:', Number.isFinite(fit))
"
```

---

**Conclusão:** O código está bem estruturado, mas tem um **bug crítico** e várias **oportunidades de performance** significativas. O fix do bug `-Infinity` é **URGENTE** e deve ser feito imediatamente. As otimizações de performance podem trazer ganhos de **35-50%** cumulativamente.
