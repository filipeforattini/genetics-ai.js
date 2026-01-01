#!/usr/bin/env node

/**
 * Performance Benchmark Suite
 * Testa os hot paths críticos do genetics-ai.js
 *
 * Funciona em AMBAS as versões (otimizada e original)
 */

import { performance } from 'perf_hooks'
import { writeFileSync } from 'fs'
import { ActivationLUT } from '../src/activation-lut.class.js'
import { Vertex } from '../src/vertex.class.js'
import { Brain } from '../src/brain.class.js'
import { Genome } from '../src/genome.class.js'
import { Base } from '../src/base.class.js'

// Configurações do benchmark
const ITERATIONS = {
  activationLUT: 1_000_000,  // 1M chamadas (função mais chamada)
  vertexInput: 500_000,       // 500k cálculos
  brainTick: 10_000,          // 10k ticks
  genomeMutate: 1_000,        // 1k mutações
  baseParsing: 100_000        // 100k parsings
}

const WARMUP_ITERATIONS = 1000  // Warm-up JIT

// Utilitário para medir performance
function benchmark(name, fn, iterations) {
  // Warm-up (deixa JIT otimizar)
  for (let i = 0; i < WARMUP_ITERATIONS; i++) {
    fn()
  }

  // Força garbage collection se disponível
  if (global.gc) {
    global.gc()
  }

  // Medição real
  const start = performance.now()
  for (let i = 0; i < iterations; i++) {
    fn()
  }
  const end = performance.now()

  const totalTime = end - start
  const avgTime = totalTime / iterations
  const opsPerSec = (iterations / totalTime) * 1000

  return {
    name,
    totalTime: totalTime.toFixed(3),
    avgTime: (avgTime * 1000).toFixed(6),  // em microsegundos
    opsPerSec: opsPerSec.toFixed(0),
    iterations
  }
}

console.log('🚀 Genetics AI - Performance Benchmark Suite')
console.log('=' .repeat(60))
console.log()

const results = {}

// ============================================================================
// 1. ACTIVATION LUT BENCHMARKS
// ============================================================================
console.log('📊 Benchmarking ActivationLUT...')

const lut = new ActivationLUT()

// Teste sigmoid com valores variados
results.activationLUT_sigmoid = benchmark(
  'ActivationLUT.sigmoid',
  () => {
    lut.sigmoid(Math.random() * 20 - 10)  // Range [-10, 10]
  },
  ITERATIONS.activationLUT
)

// Teste tanh
results.activationLUT_tanh = benchmark(
  'ActivationLUT.tanh',
  () => {
    lut.tanh(Math.random() * 20 - 10)
  },
  ITERATIONS.activationLUT
)

console.log(`  ✓ sigmoid: ${results.activationLUT_sigmoid.avgTime}μs/op`)
console.log(`  ✓ tanh:    ${results.activationLUT_tanh.avgTime}μs/op`)
console.log()

// ============================================================================
// 2. VERTEX CALCULATE INPUT BENCHMARK
// ============================================================================
console.log('📊 Benchmarking Vertex.calculateInput...')

// Criar rede com 10 inputs (representativo de redes reais)
const vertex = new Vertex('test', {})
const inputVertices = []

for (let i = 0; i < 10; i++) {
  const v = new Vertex(`input${i}`, { lastTick: Math.random() })
  v.cache.generation = 1
  v.cache.value = Math.random()
  inputVertices.push(v)
  vertex.addIn(v, Math.random() * 2 - 1)
}

results.vertex_calculateInput = benchmark(
  'Vertex.calculateInput (10 inputs)',
  () => {
    vertex.calculateInput(1)
  },
  ITERATIONS.vertexInput
)

console.log(`  ✓ calculateInput: ${results.vertex_calculateInput.avgTime}μs/op`)
console.log()

// ============================================================================
// 3. BRAIN TICK BENCHMARK
// ============================================================================
console.log('📊 Benchmarking Brain.tick...')

// Criar brain com rede realista
const brainGenome = Genome.fromBases([
  // Sensores para neurônios
  { type: 'connection', data: 10, source: { type: 'sensor', id: 0 }, target: { type: 'neuron', id: 0 } },
  { type: 'connection', data: 8, source: { type: 'sensor', id: 1 }, target: { type: 'neuron', id: 0 } },
  { type: 'connection', data: 12, source: { type: 'sensor', id: 0 }, target: { type: 'neuron', id: 1 } },

  // Neurônios para neurônios
  { type: 'connection', data: 9, source: { type: 'neuron', id: 0 }, target: { type: 'neuron', id: 1 } },
  { type: 'connection', data: 7, source: { type: 'neuron', id: 1 }, target: { type: 'neuron', id: 2 } },

  // Neurônios para ações
  { type: 'connection', data: 11, source: { type: 'neuron', id: 2 }, target: { type: 'action', id: 0 } },
  { type: 'connection', data: 6, source: { type: 'neuron', id: 1 }, target: { type: 'action', id: 1 } },
  { type: 'connection', data: 8, source: { type: 'neuron', id: 0 }, target: { type: 'action', id: 2 } },

  // Alguns biases
  { type: 'bias', data: 3, target: { type: 'neuron', id: 0 } },
  { type: 'bias', data: -2, target: { type: 'neuron', id: 1 } },
])

const brain = new Brain({
  genome: brainGenome,
  sensors: [
    { tick: () => Math.random() },
    { tick: () => Math.random() }
  ],
  actions: [
    { tick: (v) => v },
    { tick: (v) => v },
    { tick: (v) => v }
  ]
})

results.brain_tick = benchmark(
  'Brain.tick (realistic network)',
  () => {
    brain.tick()
  },
  ITERATIONS.brainTick
)

console.log(`  ✓ tick: ${results.brain_tick.avgTime}μs/op`)
console.log()

// ============================================================================
// 4. GENOME MUTATION BENCHMARK
// ============================================================================
console.log('📊 Benchmarking Genome.mutate...')

// Criar genoma médio (200 bases ≈ 4000 bits)
const mutationGenome = Genome.random(200)

results.genome_mutate = benchmark(
  'Genome.mutate (200 bases, rate=0.001)',
  () => {
    const clone = mutationGenome.clone()
    clone.mutate(0.001)
  },
  ITERATIONS.genomeMutate
)

console.log(`  ✓ mutate: ${results.genome_mutate.avgTime}μs/op`)
console.log()

// ============================================================================
// 5. BASE PARSING BENCHMARK
// ============================================================================
console.log('📊 Benchmarking Base.fromBitBuffer...')

// Criar base buffer para parsing
const testBase = {
  type: 'connection',
  data: 10,
  source: { type: 'sensor', id: 5 },
  target: { type: 'action', id: 3 }
}
const baseBuffer = Base.toBitBuffer(testBase)

results.base_parsing = benchmark(
  'Base.fromBitBuffer (connection)',
  () => {
    Base.fromBitBuffer(baseBuffer, 0)
  },
  ITERATIONS.baseParsing
)

console.log(`  ✓ fromBitBuffer: ${results.base_parsing.avgTime}μs/op`)
console.log()

// ============================================================================
// SALVAR RESULTADOS
// ============================================================================
console.log('💾 Salvando resultados...')

const output = {
  timestamp: new Date().toISOString(),
  node_version: process.version,
  platform: process.platform,
  arch: process.arch,
  results
}

// Nome do arquivo baseado em argumento ou default
const outputFile = process.argv[2] || 'benchmark/results/latest.json'
writeFileSync(outputFile, JSON.stringify(output, null, 2))

console.log(`  ✓ Resultados salvos em: ${outputFile}`)
console.log()

// ============================================================================
// SUMÁRIO
// ============================================================================
console.log('📈 Sumário:')
console.log('=' .repeat(60))

Object.values(results).forEach(r => {
  console.log(`  ${r.name}`)
  console.log(`    Tempo médio:  ${r.avgTime}μs`)
  console.log(`    Ops/segundo:  ${r.opsPerSec}`)
  console.log()
})

console.log('✅ Benchmark concluído!')
