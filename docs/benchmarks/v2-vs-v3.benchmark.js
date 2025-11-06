/**
 * Performance Benchmark: v2 vs v3
 *
 * Compares performance between v2 (default mode) and v3 (optimized mode)
 *
 * Run with: node benchmarks/v2-vs-v3.benchmark.js
 */

import { Genome } from '../src/genome.class.js'
import { Brain } from '../src/brain.class.js'
import { Individual } from '../src/individual.class.js'
import { Generation } from '../src/generation.class.js'
import { AttributeBase } from '../src/bases/attribute.base.js'
import { globalArrayPool } from '../src/pools/typed-array-pool.class.js'

// Benchmark configuration
const CONFIG = {
  genomeSize: 100,  // Number of connections
  populationSize: 100,
  generations: 10,
  ticksPerIndividual: 100
}

// Helper: Format time
function formatTime(ms) {
  if (ms < 1) return `${(ms * 1000).toFixed(2)}µs`
  if (ms < 1000) return `${ms.toFixed(2)}ms`
  return `${(ms / 1000).toFixed(2)}s`
}

// Helper: Format bytes
function formatBytes(bytes) {
  if (bytes < 1024) return `${bytes}B`
  if (bytes < 1024 * 1024) return `${(bytes / 1024).toFixed(2)}KB`
  return `${(bytes / (1024 * 1024)).toFixed(2)}MB`
}

// Helper: Get memory usage (Node.js specific)
function getMemoryUsage() {
  if (typeof process !== 'undefined' && process.memoryUsage) {
    return process.memoryUsage().heapUsed
  }
  return 0
}

// Helper: Force garbage collection (if available)
function forceGC() {
  if (typeof global !== 'undefined' && global.gc) {
    global.gc()
  }
}

// Benchmark: Genome Parsing
function benchmarkGenomeParsing(iterations = 1000) {
  console.log('\n📊 Benchmark: Genome Parsing')
  console.log('─'.repeat(60))

  const genome = Genome.random(CONFIG.genomeSize)
  const genomeString = genome.toString()

  // v2 Mode: Parse all bases eagerly
  forceGC()
  const v2Start = performance.now()
  for (let i = 0; i < iterations; i++) {
    const g = Genome.from(genomeString)
    const bases = g.bases  // Eager parsing
  }
  const v2Time = performance.now() - v2Start

  // v3 Mode: Lazy parsing with iterBases
  forceGC()
  const v3Start = performance.now()
  for (let i = 0; i < iterations; i++) {
    const g = Genome.from(genomeString)
    // Lazy - only parse when iterating
    for (const base of g.iterBases()) {
      // Iterate but don't do anything
    }
  }
  const v3Time = performance.now() - v3Start

  const speedup = ((v2Time / v3Time) - 1) * 100

  console.log(`v2 (eager):  ${formatTime(v2Time)} total, ${formatTime(v2Time/iterations)} per genome`)
  console.log(`v3 (lazy):   ${formatTime(v3Time)} total, ${formatTime(v3Time/iterations)} per genome`)
  console.log(`Speedup:     ${speedup > 0 ? '+' : ''}${speedup.toFixed(1)}% faster`)

  return { v2Time, v3Time, speedup }
}

// Benchmark: Brain Ticking
function benchmarkBrainTicking(iterations = 1000) {
  console.log('\n📊 Benchmark: Brain Ticking')
  console.log('─'.repeat(60))

  const genome = Genome.random(CONFIG.genomeSize)

  const sensors = [
    { name: 's0', tick: () => 0.5 },
    { name: 's1', tick: () => 0.75 },
    { name: 's2', tick: () => 1.0 }
  ]

  const actions = [
    { name: 'a0', tick: () => {} },
    { name: 'a1', tick: () => {} },
    { name: 'a2', tick: () => {} }
  ]

  // v2 Mode
  const brainV2 = new Brain({
    genome,
    sensors,
    actions,
    useV3Optimization: false
  })

  forceGC()
  const v2Start = performance.now()
  for (let i = 0; i < iterations; i++) {
    brainV2.tick()
  }
  const v2Time = performance.now() - v2Start

  // v3 Mode
  const brainV3 = new Brain({
    genome,
    sensors,
    actions,
    useV3Optimization: true
  })

  forceGC()
  const v3Start = performance.now()
  for (let i = 0; i < iterations; i++) {
    brainV3.tick()
  }
  const v3Time = performance.now() - v3Start

  const speedup = ((v2Time / v3Time) - 1) * 100

  console.log(`v2 mode:     ${formatTime(v2Time)} total, ${formatTime(v2Time/iterations)} per tick`)
  console.log(`v3 mode:     ${formatTime(v3Time)} total, ${formatTime(v3Time/iterations)} per tick`)
  console.log(`Speedup:     ${speedup > 0 ? '+' : ''}${speedup.toFixed(1)}% faster`)

  // Cleanup v3 resources
  brainV3.destroy()

  return { v2Time, v3Time, speedup }
}

// Benchmark: Memory Allocation
function benchmarkMemoryAllocation(iterations = 100) {
  console.log('\n📊 Benchmark: Memory Allocation')
  console.log('─'.repeat(60))

  const genome = Genome.random(CONFIG.genomeSize)

  const sensors = [
    { name: 's0', tick: () => 0.5 },
    { name: 's1', tick: () => 0.75 }
  ]

  const actions = [
    { name: 'a0', tick: () => {} },
    { name: 'a1', tick: () => {} }
  ]

  // v2 Mode: Many allocations
  forceGC()
  const v2MemStart = getMemoryUsage()
  const brainsV2 = []
  for (let i = 0; i < iterations; i++) {
    brainsV2.push(new Brain({
      genome,
      sensors,
      actions,
      useV3Optimization: false
    }))
  }
  const v2MemEnd = getMemoryUsage()
  const v2MemUsed = v2MemEnd - v2MemStart

  // Cleanup
  brainsV2.length = 0
  forceGC()

  // v3 Mode: Pooled allocations
  forceGC()
  const v3MemStart = getMemoryUsage()
  const brainsV3 = []
  for (let i = 0; i < iterations; i++) {
    brainsV3.push(new Brain({
      genome,
      sensors,
      actions,
      useV3Optimization: true
    }))
  }
  const v3MemEnd = getMemoryUsage()
  const v3MemUsed = v3MemEnd - v3MemStart

  const memorySaved = ((v2MemUsed - v3MemUsed) / v2MemUsed) * 100

  console.log(`v2 mode:     ${formatBytes(v2MemUsed)} for ${iterations} brains`)
  console.log(`v3 mode:     ${formatBytes(v3MemUsed)} for ${iterations} brains`)
  console.log(`Savings:     ${memorySaved.toFixed(1)}% less memory`)

  // Cleanup v3 resources
  for (const brain of brainsV3) {
    brain.destroy()
  }

  return { v2MemUsed, v3MemUsed, memorySaved }
}

// Benchmark: Array Pool Efficiency
function benchmarkArrayPooling(iterations = 10000) {
  console.log('\n📊 Benchmark: Array Pooling')
  console.log('─'.repeat(60))

  const size = 100

  // Without pooling: constant allocation
  forceGC()
  const nopoolStart = performance.now()
  for (let i = 0; i < iterations; i++) {
    const arr = new Float32Array(size)
    arr.fill(Math.random())
  }
  const nopoolTime = performance.now() - nopoolStart

  // With pooling: reuse
  forceGC()
  globalArrayPool.reset()  // Clear pool
  const poolStart = performance.now()
  for (let i = 0; i < iterations; i++) {
    const arr = globalArrayPool.allocFloat32(size)
    arr.fill(Math.random())
    globalArrayPool.free(arr)
  }
  const poolTime = performance.now() - poolStart

  const speedup = ((nopoolTime / poolTime) - 1) * 100
  const stats = globalArrayPool.getStats()

  console.log(`No pooling:  ${formatTime(nopoolTime)} total, ${formatTime(nopoolTime/iterations)} per alloc`)
  console.log(`Pooling:     ${formatTime(poolTime)} total, ${formatTime(poolTime/iterations)} per alloc`)
  console.log(`Speedup:     ${speedup > 0 ? '+' : ''}${speedup.toFixed(1)}% faster`)
  console.log(`Reuse rate:  ${stats.reuseRate}`)
  console.log(`Pool hits:   ${stats.float32Reused}/${iterations} (${(stats.float32Reused/iterations*100).toFixed(1)}%)`)

  return { nopoolTime, poolTime, speedup, reuseRate: stats.reuseRate }
}

// Benchmark: Selective Genome Parsing
function benchmarkSelectiveParsing(iterations = 1000) {
  console.log('\n📊 Benchmark: Selective Parsing')
  console.log('─'.repeat(60))

  const genome = Genome.random(60)  // ~51 connections + ~9 biases

  // v2: Parse all, then filter
  forceGC()
  const v2Start = performance.now()
  for (let i = 0; i < iterations; i++) {
    const connections = genome.bases.filter(b => b.type === 'connection')
  }
  const v2Time = performance.now() - v2Start

  // v3: Selective parsing
  forceGC()
  const v3Start = performance.now()
  for (let i = 0; i < iterations; i++) {
    const connections = genome.getConnections()
  }
  const v3Time = performance.now() - v3Start

  const speedup = ((v2Time / v3Time) - 1) * 100

  console.log(`v2 (filter): ${formatTime(v2Time)} total, ${formatTime(v2Time/iterations)} per query`)
  console.log(`v3 (select): ${formatTime(v3Time)} total, ${formatTime(v3Time/iterations)} per query`)
  console.log(`Speedup:     ${speedup > 0 ? '+' : ''}${speedup.toFixed(1)}% faster`)

  return { v2Time, v3Time, speedup }
}

// Benchmark: Full Evolution Cycle
function benchmarkEvolution() {
  console.log('\n📊 Benchmark: Full Evolution Cycle')
  console.log('─'.repeat(60))

  // Test Individual class
  class TestIndividual extends Individual {
    fitness() {
      // Simple fitness based on tick count
      let sum = 0
      for (let i = 0; i < 10; i++) {
        const result = this.tick()
        sum += Object.values(result).reduce((a, b) => a + b, 0)
      }
      return sum
    }
  }

  const sensors = [
    { name: 's0', tick: () => Math.random() },
    { name: 's1', tick: () => Math.random() }
  ]

  const actions = [
    { name: 'a0', tick: () => {} },
    { name: 'a1', tick: () => {} }
  ]

  // v2 Mode
  forceGC()
  const genV2 = new Generation({
    individualsCount: CONFIG.populationSize,
    individualClass: TestIndividual,
    sensors,
    actions,
    brainOptions: { useV3Optimization: false }
  })

  const v2Start = performance.now()
  for (let i = 0; i < CONFIG.generations; i++) {
    genV2.next()
  }
  const v2Time = performance.now() - v2Start

  // v3 Mode
  forceGC()
  const genV3 = new Generation({
    individualsCount: CONFIG.populationSize,
    individualClass: TestIndividual,
    sensors,
    actions,
    brainOptions: { useV3Optimization: true }
  })

  const v3Start = performance.now()
  for (let i = 0; i < CONFIG.generations; i++) {
    genV3.next()
  }
  const v3Time = performance.now() - v3Start

  const speedup = ((v2Time / v3Time) - 1) * 100

  console.log(`v2 mode:     ${formatTime(v2Time)} for ${CONFIG.generations} generations`)
  console.log(`v3 mode:     ${formatTime(v3Time)} for ${CONFIG.generations} generations`)
  console.log(`Speedup:     ${speedup > 0 ? '+' : ''}${speedup.toFixed(1)}% faster`)

  return { v2Time, v3Time, speedup }
}

// Main benchmark runner
function runAllBenchmarks() {
  console.log('\n' + '═'.repeat(60))
  console.log('  🚀 GENETICS-AI.JS v2 vs v3 Performance Benchmark')
  console.log('═'.repeat(60))
  console.log(`\nConfiguration:`)
  console.log(`  Genome size:       ${CONFIG.genomeSize} connections`)
  console.log(`  Population:        ${CONFIG.populationSize} individuals`)
  console.log(`  Generations:       ${CONFIG.generations}`)

  const results = {}

  try {
    results.parsing = benchmarkGenomeParsing()
  } catch (error) {
    console.error('\nError in parsing benchmark:', error.message)
  }

  try {
    results.ticking = benchmarkBrainTicking()
  } catch (error) {
    console.error('\nError in ticking benchmark:', error.message)
  }

  try {
    results.memory = benchmarkMemoryAllocation()
  } catch (error) {
    console.error('\nError in memory benchmark:', error.message)
  }

  try {
    results.pooling = benchmarkArrayPooling()
  } catch (error) {
    console.error('\nError in pooling benchmark:', error.message)
  }

  try {
    results.selective = benchmarkSelectiveParsing()
  } catch (error) {
    console.error('\nError in selective parsing benchmark:', error.message)
  }

  try {
    results.evolution = benchmarkEvolution()
  } catch (error) {
    console.error('\nError in evolution benchmark:', error.message)
  }

  // Summary
  console.log('\n' + '═'.repeat(60))
  console.log('  📊 SUMMARY')
  console.log('═'.repeat(60))

  const avgSpeedup = Object.values(results)
    .filter(r => r && r.speedup !== undefined)
    .reduce((sum, r) => sum + r.speedup, 0) / Object.keys(results).length

  console.log(`\nOverall v3 Performance Improvement: ${avgSpeedup > 0 ? '+' : ''}${avgSpeedup.toFixed(1)}%`)

  if (results.parsing) {
    console.log(`  ├─ Parsing:          ${results.parsing.speedup > 0 ? '+' : ''}${results.parsing.speedup.toFixed(1)}%`)
  }
  if (results.ticking) {
    console.log(`  ├─ Ticking:          ${results.ticking.speedup > 0 ? '+' : ''}${results.ticking.speedup.toFixed(1)}%`)
  }
  if (results.pooling) {
    console.log(`  ├─ Pooling:          ${results.pooling.speedup > 0 ? '+' : ''}${results.pooling.speedup.toFixed(1)}%`)
  }
  if (results.selective) {
    console.log(`  ├─ Selective Parse:  ${results.selective.speedup > 0 ? '+' : ''}${results.selective.speedup.toFixed(1)}%`)
  }
  if (results.evolution) {
    console.log(`  └─ Full Evolution:   ${results.evolution.speedup > 0 ? '+' : ''}${results.evolution.speedup.toFixed(1)}%`)
  }

  if (results.memory) {
    console.log(`\nMemory Savings: ${results.memory.memorySaved.toFixed(1)}%`)
  }

  console.log('\n' + '═'.repeat(60))
  console.log('  ✅ Benchmarks Complete!')
  console.log('═'.repeat(60) + '\n')

  return results
}

// Run if executed directly
if (import.meta.url === `file://${process.argv[1]}`) {
  runAllBenchmarks()
}

export { runAllBenchmarks }
