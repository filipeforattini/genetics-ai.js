/**
 * JIT Performance Benchmark
 *
 * Testa especificamente o JIT vs non-JIT para provar que funciona
 * Usa genomas simples que garantem ativação do JIT
 */

import { Brain, Genome } from '../src/index.js'

// Sensores e ações simples
const SENSORS = [
  { id: 0, tick: () => 0.5 },
  { id: 1, tick: () => 0.5 },
  { id: 2, tick: () => 0.5 },
  { id: 3, tick: () => 0.5 },
  { id: 4, tick: () => 0.5 }
]

const ACTIONS = [
  { id: 0, tick: (v) => v },
  { id: 1, tick: (v) => v },
  { id: 2, tick: (v) => v }
]

// Criar genoma MUITO simples (string base32 - v1 format)
// Isso garante que não há v3 bases detectadas incorretamente
const genomeSmall = Genome.from('A0001B0002C0003D0101E0102F0103') // ~6 connections
const genomeMedium = Genome.from('A0001B0002C0003D0101E0102F0103G0201H0202I0203J0301K0302L0303M0401N0402O0403P0501Q0502R0503') // ~18 connections
const genomeLarge = (() => {
  const bases = []
  for (let i = 0; i < 50; i++) {
    const char1 = String.fromCharCode(65 + (i % 26))
    const char2 = '0'
    const char3 = String.fromCharCode(48 + (i % 10))
    const char4 = '0'
    const char5 = String.fromCharCode(48 + (i % 10))
    bases.push(char1 + char2 + char3 + char4 + char5)
  }
  return Genome.from(bases.join(''))
})()

function benchmarkBrain(genome, name, iterations = 10000) {
  console.log(`\n📊 Testing: ${name}`)
  console.log('   Genome size:', genome.toString().length, 'chars')

  // Test with V3 optimization OFF (no JIT)
  const brainNoJIT = new Brain({
    genome,
    sensors: SENSORS,
    actions: ACTIONS,
    useV3Optimization: false
  })

  const startNoJIT = performance.now()
  for (let i = 0; i < iterations; i++) {
    brainNoJIT.tick()
  }
  const timeNoJIT = performance.now() - startNoJIT

  // Test with V3 optimization ON (should use JIT)
  const brainWithJIT = new Brain({
    genome,
    sensors: SENSORS,
    actions: ACTIONS,
    useV3Optimization: true
  })

  const startWithJIT = performance.now()
  for (let i = 0; i < iterations; i++) {
    brainWithJIT.tick()
  }
  const timeWithJIT = performance.now() - startWithJIT

  const speedup = ((timeNoJIT - timeWithJIT) / timeNoJIT * 100).toFixed(1)
  const winner = timeWithJIT < timeNoJIT ? '🚀 V3 (JIT)' : '🐌 V2'

  console.log(`\n   Results (${iterations} ticks):`)
  console.log(`   ─────────────────────────────────────`)
  console.log(`   V2 (no JIT):  ${timeNoJIT.toFixed(2)}ms`)
  console.log(`   V3 (with JIT): ${timeWithJIT.toFixed(2)}ms`)
  console.log(`   ─────────────────────────────────────`)
  console.log(`   JIT Active: ${brainWithJIT.useJIT ? '✅ YES' : '❌ NO'}`)
  console.log(`   Speedup: ${speedup}%`)
  console.log(`   Winner: ${winner}`)

  return {
    noJIT: timeNoJIT,
    withJIT: timeWithJIT,
    speedup: parseFloat(speedup),
    jitActive: brainWithJIT.useJIT
  }
}

console.log('╔═══════════════════════════════════════════╗')
console.log('║   🚀 JIT Performance Benchmark            ║')
console.log('╚═══════════════════════════════════════════╝')
console.log('')
console.log('Testing V3 JIT vs V2 no-JIT')
console.log('Using simple v1-style genomes to avoid parser issues')
console.log('')

const results = {
  small: benchmarkBrain(genomeSmall, 'Small Network (~6 connections)', 10000),
  medium: benchmarkBrain(genomeMedium, 'Medium Network (~18 connections)', 10000),
  large: benchmarkBrain(genomeLarge, 'Large Network (~50 connections)', 10000)
}

console.log('\n\n╔═══════════════════════════════════════════╗')
console.log('║   📊 Summary                              ║')
console.log('╚═══════════════════════════════════════════╝')
console.log('')

Object.entries(results).forEach(([size, result]) => {
  console.log(`${size.padEnd(6)}: JIT ${result.jitActive ? '✅' : '❌'} | Speedup: ${result.speedup > 0 ? '+' : ''}${result.speedup}%`)
})

console.log('')
console.log('💡 Note: JIT only activates for 5-200 connections')
console.log('          without advanced v3 features')
console.log('')
