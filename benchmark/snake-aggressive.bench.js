#!/usr/bin/env node

/**
 * 🐍 AGGRESSIVE SNAKE BENCHMARK
 *
 * Roda o jogo Snake completo por múltiplas gerações
 * Mede o tempo REAL de evolução em um caso de uso prático
 *
 * Isso mostra o impacto VERDADEIRO das otimizações!
 */

import { performance } from 'perf_hooks'
import { writeFileSync } from 'fs'
import {
  Generation,
  Individual,
  Genome
} from '../src/index.js'

// ============================================================================
// CONFIGURAÇÃO DA SNAKE
// ============================================================================
const GRID_SIZE = 10
const MAX_STEPS = 500
const POPULATION = 100
const GENERATIONS = 50  // 50 gerações para benchmark agressivo

// Direções
const DIRECTIONS = {
  UP: { x: 0, y: -1 },
  DOWN: { x: 0, y: 1 },
  LEFT: { x: -1, y: 0 },
  RIGHT: { x: 1, y: 0 }
}

// ============================================================================
// SNAKE INDIVIDUAL
// ============================================================================
class SnakeAI extends Individual {
  fitness() {
    let score = 0
    let steps = 0
    let foodEaten = 0

    // Estado inicial
    const head = { x: Math.floor(GRID_SIZE / 2), y: Math.floor(GRID_SIZE / 2) }
    const snake = [{ ...head }, { x: head.x, y: head.y + 1 }]
    let direction = DIRECTIONS.UP
    let food = this.spawnFood(snake)

    // Simular jogo
    while (steps < MAX_STEPS && !this.checkCollision(head, snake)) {
      steps++

      // Calcular sensores
      const sensors = this.getSensors(head, direction, snake, food)

      // Processar brain
      this.setSensors(sensors)
      const action = this.tick()

      // Executar ação
      if (action === 'turn_left') {
        direction = this.turnLeft(direction)
      } else if (action === 'turn_right') {
        direction = this.turnRight(direction)
      }
      // 'forward' não muda direção

      // Mover cobra
      const newHead = {
        x: head.x + direction.x,
        y: head.y + direction.y
      }

      // Verificar limites
      if (newHead.x < 0 || newHead.x >= GRID_SIZE ||
          newHead.y < 0 || newHead.y >= GRID_SIZE) {
        break  // Bateu na parede
      }

      // Verificar se comeu food
      const ateFood = (newHead.x === food.x && newHead.y === food.y)

      if (ateFood) {
        foodEaten++
        score += 100
        food = this.spawnFood(snake)
      } else {
        snake.pop()  // Remove cauda se não comeu
      }

      // Adicionar nova cabeça
      snake.unshift(newHead)
      head.x = newHead.x
      head.y = newHead.y

      // Penalidade por tempo
      score -= 0.1
    }

    // Fitness final
    return score + (foodEaten * 100) + (snake.length * 10)
  }

  spawnFood(snake) {
    let food
    do {
      food = {
        x: Math.floor(Math.random() * GRID_SIZE),
        y: Math.floor(Math.random() * GRID_SIZE)
      }
    } while (snake.some(s => s.x === food.x && s.y === food.y))
    return food
  }

  checkCollision(head, snake) {
    // Colisão com corpo (ignora cabeça)
    for (let i = 1; i < snake.length; i++) {
      if (snake[i].x === head.x && snake[i].y === head.y) {
        return true
      }
    }
    return false
  }

  getSensors(head, direction, snake, food) {
    // 8 sensores direcionais + 4 sensores de food
    const sensors = {}

    // Distância para parede em cada direção
    sensors.wall_front = this.distanceToWall(head, direction)
    sensors.wall_left = this.distanceToWall(head, this.turnLeft(direction))
    sensors.wall_right = this.distanceToWall(head, this.turnRight(direction))
    sensors.wall_back = this.distanceToWall(head, this.turnLeft(this.turnLeft(direction)))

    // Distância para próprio corpo
    sensors.body_front = this.distanceToBody(head, direction, snake)
    sensors.body_left = this.distanceToBody(head, this.turnLeft(direction), snake)
    sensors.body_right = this.distanceToBody(head, this.turnRight(direction), snake)

    // Direção da food (normalizado)
    sensors.food_dx = (food.x - head.x) / GRID_SIZE
    sensors.food_dy = (food.y - head.y) / GRID_SIZE

    return sensors
  }

  distanceToWall(pos, dir) {
    let dist = 0
    let x = pos.x
    let y = pos.y

    while (x >= 0 && x < GRID_SIZE && y >= 0 && y < GRID_SIZE) {
      x += dir.x
      y += dir.y
      dist++
    }

    return dist / GRID_SIZE  // Normalizado
  }

  distanceToBody(pos, dir, snake) {
    let dist = 0
    let x = pos.x + dir.x
    let y = pos.y + dir.y

    while (x >= 0 && x < GRID_SIZE && y >= 0 && y < GRID_SIZE) {
      if (snake.some(s => s.x === x && s.y === y)) {
        return dist / GRID_SIZE
      }
      x += dir.x
      y += dir.y
      dist++
    }

    return 1.0  // Nenhum corpo nessa direção
  }

  turnLeft(dir) {
    if (dir === DIRECTIONS.UP) return DIRECTIONS.LEFT
    if (dir === DIRECTIONS.LEFT) return DIRECTIONS.DOWN
    if (dir === DIRECTIONS.DOWN) return DIRECTIONS.RIGHT
    return DIRECTIONS.UP
  }

  turnRight(dir) {
    if (dir === DIRECTIONS.UP) return DIRECTIONS.RIGHT
    if (dir === DIRECTIONS.RIGHT) return DIRECTIONS.DOWN
    if (dir === DIRECTIONS.DOWN) return DIRECTIONS.LEFT
    return DIRECTIONS.UP
  }
}

// ============================================================================
// BENCHMARK
// ============================================================================
console.log('🐍 SNAKE AI - Aggressive Real-World Benchmark')
console.log('=' .repeat(60))
console.log(`Population: ${POPULATION}`)
console.log(`Generations: ${GENERATIONS}`)
console.log(`Grid Size: ${GRID_SIZE}x${GRID_SIZE}`)
console.log(`Max Steps: ${MAX_STEPS}`)
console.log('')

// Configuração da geração
const genConfig = {
  size: POPULATION,
  prototype: SnakeAI,
  sensors: [
    { name: 'wall_front', tick: function(env) { return env.sensors.wall_front || 0 } },
    { name: 'wall_left', tick: function(env) { return env.sensors.wall_left || 0 } },
    { name: 'wall_right', tick: function(env) { return env.sensors.wall_right || 0 } },
    { name: 'wall_back', tick: function(env) { return env.sensors.wall_back || 0 } },
    { name: 'body_front', tick: function(env) { return env.sensors.body_front || 0 } },
    { name: 'body_left', tick: function(env) { return env.sensors.body_left || 0 } },
    { name: 'body_right', tick: function(env) { return env.sensors.body_right || 0 } },
    { name: 'food_dx', tick: function(env) { return env.sensors.food_dx || 0 } },
    { name: 'food_dy', tick: function(env) { return env.sensors.food_dy || 0 } }
  ],
  actions: [
    { name: 'forward', tick: function() { return 'forward' } },
    { name: 'turn_left', tick: function() { return 'turn_left' } },
    { name: 'turn_right', tick: function() { return 'turn_right' } }
  ]
}

// Criar geração
console.log('🧬 Inicializando população...')
const gen = new Generation(genConfig)

// Forçar GC se disponível
if (global.gc) {
  global.gc()
}

// BENCHMARK
console.log('⚡ Iniciando benchmark...')
console.log('')

const startTime = performance.now()
let bestFitness = -Infinity
let avgFitness = 0

for (let i = 0; i < GENERATIONS; i++) {
  const genStart = performance.now()

  // Evoluir
  gen.next()

  const genEnd = performance.now()
  const genTime = genEnd - genStart

  // Estatísticas
  const fitnesses = gen.population.map(ind => ind.fitnessValue || 0)
  const maxFit = Math.max(...fitnesses)
  const avgFit = fitnesses.reduce((a, b) => a + b, 0) / fitnesses.length

  if (maxFit > bestFitness) {
    bestFitness = maxFit
  }
  avgFitness = avgFit

  // Log progresso
  if ((i + 1) % 10 === 0 || i === 0) {
    console.log(`Gen ${(i + 1).toString().padStart(3)}: ` +
                `avg=${avgFit.toFixed(1).padStart(7)} ` +
                `max=${maxFit.toFixed(1).padStart(7)} ` +
                `best=${bestFitness.toFixed(1).padStart(7)} ` +
                `(${genTime.toFixed(0)}ms)`)
  }
}

const endTime = performance.now()
const totalTime = endTime - startTime

// Resultados
console.log('')
console.log('=' .repeat(60))
console.log('📊 RESULTADOS:')
console.log('=' .repeat(60))
console.log(`Tempo total:       ${(totalTime / 1000).toFixed(2)}s`)
console.log(`Tempo por geração: ${(totalTime / GENERATIONS).toFixed(2)}ms`)
console.log(`Melhor fitness:    ${bestFitness.toFixed(1)}`)
console.log(`Fitness médio:     ${avgFitness.toFixed(1)}`)
console.log('')

// Salvar resultado
const output = {
  timestamp: new Date().toISOString(),
  config: {
    population: POPULATION,
    generations: GENERATIONS,
    gridSize: GRID_SIZE,
    maxSteps: MAX_STEPS
  },
  results: {
    totalTime: totalTime.toFixed(3),
    timePerGeneration: (totalTime / GENERATIONS).toFixed(3),
    bestFitness: bestFitness.toFixed(1),
    avgFitness: avgFitness.toFixed(1)
  }
}

const outputFile = process.argv[2] || 'benchmark/results/snake-latest.json'
writeFileSync(outputFile, JSON.stringify(output, null, 2))

console.log(`💾 Resultados salvos em: ${outputFile}`)
console.log('')
