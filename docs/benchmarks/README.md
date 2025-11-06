# 🏁 Benchmarks Suite

Conjunto completo de benchmarks para medir performance do genetics-ai.js através das versões.

## 📊 Benchmarks Disponíveis

### 1. `comprehensive.benchmark.js` - Comparação Completa v1 vs v2 vs v3

Benchmark abrangente que testa todas as versões em cenário realista:

**Testes Incluídos**:
- ✅ **Genome Parsing** - Velocidade de parse de genomas
- ✅ **Brain Ticking** - Performance de execução neural
- ✅ **Full Evolution** - Ciclo evolutivo completo
- ✅ **Memory Pressure** - Pressão de alocação e GC

**Como Executar**:
```bash
# Básico
node benchmarks/comprehensive.benchmark.js

# Com GC manual (recomendado!)
node --expose-gc benchmarks/comprehensive.benchmark.js
```

**Saída Esperada**:
```
═══════════════════════════════════════════════════════════
  🏁 COMPREHENSIVE BENCHMARK: v1 vs v2 vs v3
═══════════════════════════════════════════════════════════

📊 Test 1: Genome Parsing Speed
  🚀 v3 (lazy parse)       2.45ms       +187.2%
  🚀 v2 (eager parse)      5.20ms       +72.5%
  🐌 v1 (base32)          18.95ms       +0.0%

📊 Test 2: Brain Ticking Speed
  🚀 v3 (pooled + inline)  45.2ms       +35.1%
  🚀 v2 (inline functions) 62.8ms       +9.9%
  🐌 v1 (no optimization)  69.7ms       +0.0%

📈 OVERALL SUMMARY
  🚀 v3 Overall Performance Improvement: +68.3%
  💾 Memory Savings: 73.5%
```

### 2. `v2-vs-v3.benchmark.js` - Foco v2 → v3

Benchmark focado nas melhorias específicas da v3:

**Testes Incluídos**:
- Genome parsing (lazy vs eager)
- Brain ticking (pooling)
- Array pooling efficiency
- Selective parsing

**Como Executar**:
```bash
node benchmarks/v2-vs-v3.benchmark.js
```

## 🎯 Cenário de Teste

Os benchmarks usam um **cenário realista** de criaturas evoluindo em grid 2D:

**Características**:
- Grid 128x128
- Criaturas com energia, posição, idade
- 5 sensores (x, y, energy, age, nearFood)
- 5 ações (move N/S/E/W, eat)
- Fitness = sobrevivência + comida coletada
- 50 gerações de evolução

Este cenário simula:
- ✅ Parse de genomas (variados)
- ✅ Brain ticking (múltiplos por geração)
- ✅ Seleção natural (fitness evaluation)
- ✅ Reprodução (mutação + crossover)
- ✅ Alocações de memória (population growth)

## 📈 Resultados Esperados

### Performance (v3 vs v1)

| Métrica | v1 | v3 | Melhoria |
|---------|----|----|----------|
| **Parsing** | 100% | **300%** | 🚀 3x mais rápido |
| **Ticking** | 100% | **135%** | 🚀 35% mais rápido |
| **Evolution** | 100% | **125%** | 🚀 25% mais rápido |
| **GC Pressure** | 100% | **200%** | 🚀 50% menos pausas |

### Memória (v3 vs v1)

| Tipo | v1 | v3 | Economia |
|------|----|----|----------|
| **Heap Usage** | 100% | **27%** | 💾 73% menos memória |
| **Allocations** | 100% | **10%** | 💾 90% menos alocações |
| **Per Connection** | 40 bytes | 10 bytes | 💾 75% menor |

## 🔧 Configuração Avançada

### Ajustar Parâmetros

Edite `comprehensive.benchmark.js`:

```javascript
const BENCHMARK_CONFIG = {
  populationSizes: [50, 100, 200],  // Tamanhos de população
  genomeSizes: [20, 50, 100],       // Complexidade do genoma
  generations: 50,                   // Gerações para evoluir
  ticksPerFitness: 100,             // Ticks por fitness
  repetitions: 3                     // Repetições para média
}
```

### Benchmark de Longa Duração

Para benchmark mais confiável:

```javascript
const BENCHMARK_CONFIG = {
  populationSizes: [100, 500, 1000],
  genomeSizes: [50, 100, 200],
  generations: 100,
  repetitions: 10
}
```

## 🐛 Troubleshooting

### "Maximum call stack exceeded"

Reduza os tamanhos:
```javascript
populationSizes: [10, 20, 50]
genomeSizes: [10, 20, 50]
```

### "Out of memory"

Ative GC manual e reduza repetitions:
```bash
node --expose-gc --max-old-space-size=4096 benchmarks/comprehensive.benchmark.js
```

### Resultados Inconsistentes

1. Feche outros programas
2. Execute múltiplas vezes e tire média
3. Use `nice` no Linux:
```bash
nice -n -20 node --expose-gc benchmarks/comprehensive.benchmark.js
```

## 📊 Interpretar Resultados

### Tempo de Execução

- **< 10% variação**: Resultados confiáveis
- **10-20% variação**: Normal, repita com mais repetitions
- **> 20% variação**: Sistema instável, minimize background tasks

### Uso de Memória

- Números absolutos variam por plataforma
- **Foque em percentuais relativos** entre versões
- GC pode causar picos temporários

### Speedup

```
Speedup = (Tempo_v1 / Tempo_v3) - 1

Exemplo:
v1: 100ms
v3: 50ms
Speedup = (100 / 50) - 1 = 1.0 = +100% faster
```

## 🎓 Benchmarks Customizados

### Criar Seu Próprio Benchmark

```javascript
import { Genome, Brain, Generation } from 'genetics-ai.js'

async function myBenchmark() {
  // 1. Setup
  const genome = Genome.random(50)

  // 2. v2 test
  const brainV2 = new Brain({
    genome,
    sensors: SENSORS,
    actions: ACTIONS,
    useV3Optimization: false
  })

  const v2Start = performance.now()
  for (let i = 0; i < 10000; i++) {
    brainV2.tick()
  }
  const v2Time = performance.now() - v2Start

  // 3. v3 test
  const brainV3 = new Brain({
    genome,
    sensors: SENSORS,
    actions: ACTIONS,
    useV3Optimization: true
  })

  const v3Start = performance.now()
  for (let i = 0; i < 10000; i++) {
    brainV3.tick()
  }
  const v3Time = performance.now() - v3Start

  // 4. Cleanup
  brainV3.destroy()

  // 5. Report
  const improvement = ((v2Time - v3Time) / v2Time * 100).toFixed(1)
  console.log(`v2: ${v2Time.toFixed(2)}ms`)
  console.log(`v3: ${v3Time.toFixed(2)}ms`)
  console.log(`Improvement: +${improvement}%`)
}

myBenchmark()
```

## 📚 Mais Informações

- [V3-ARCHITECTURE.md](../docs/V3-ARCHITECTURE.md) - Detalhes técnicos
- [MIGRATION-GUIDE-V3.md](../docs/MIGRATION-GUIDE-V3.md) - Guia de migração
- [V3-PROGRESS.md](../docs/V3-PROGRESS.md) - Progresso de implementação

## 🤝 Contribuir

Para adicionar novos benchmarks:

1. Crie arquivo `benchmarks/my-benchmark.js`
2. Exporte função `runMyBenchmark()`
3. Documente aqui no README
4. Envie PR!

---

**Dúvidas?** Abra uma issue no GitHub!
