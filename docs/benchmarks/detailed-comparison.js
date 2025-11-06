/**
 * Detailed Performance Comparison
 * V2 (no v3 opt) vs V3 (no JIT) vs V3 (with JIT)
 */

import { Brain, Genome } from '../src/index.js'

const SENSORS = [
  { id: 0, tick: () => 0.5 },
  { id: 1, tick: () => 0.5 },
  { id: 2, tick: () => 0.5 }
]

const ACTIONS = [
  { id: 0, tick: (v) => v },
  { id: 1, tick: (v) => v }
]

// Medium genome (~15 connections)
const genome = Genome.from('A0001B0002C0003D0101E0102F0103G0201H0202I0203J0301K0302L0401M0402')

const iterations = 50000

console.log('╔═══════════════════════════════════════════╗')
console.log('║   🔬 Detailed Performance Comparison      ║')
console.log('╚═══════════════════════════════════════════╝')
console.log('')
console.log(`Iterations: ${iterations.toLocaleString()}`)
console.log(`Genome connections: ~15`)
console.log('')

// 1. V2 (no v3 optimization)
const brainV2 = new Brain({
  genome,
  sensors: SENSORS,
  actions: ACTIONS,
  useV3Optimization: false
})

console.log('1️⃣  V2 (useV3Optimization: false)')
console.log('   JIT active:', brainV2.useJIT)
console.log('   Warming up...')
for (let i = 0; i < 1000; i++) brainV2.tick()

const v2Start = performance.now()
for (let i = 0; i < iterations; i++) {
  brainV2.tick()
}
const v2Time = performance.now() - v2Start
console.log(`   Time: ${v2Time.toFixed(2)}ms`)
console.log(`   Per tick: ${(v2Time / iterations * 1000).toFixed(2)}µs`)
console.log('')

// 2. V3 WITHOUT JIT (force disable by using 201 connections threshold)
// Actually, let's just disable JIT properly
const brainV3NoJIT = new Brain({
  genome,
  sensors: SENSORS,
  actions: ACTIONS,
  useV3Optimization: true
})

// Force disable JIT
brainV3NoJIT.useJIT = false
brainV3NoJIT.jitTickFunction = null

console.log('2️⃣  V3 (useV3Optimization: true, JIT disabled)')
console.log('   JIT active:', brainV3NoJIT.useJIT)
console.log('   Warming up...')
for (let i = 0; i < 1000; i++) brainV3NoJIT.tick()

const v3NoJITStart = performance.now()
for (let i = 0; i < iterations; i++) {
  brainV3NoJIT.tick()
}
const v3NoJITTime = performance.now() - v3NoJITStart
console.log(`   Time: ${v3NoJITTime.toFixed(2)}ms`)
console.log(`   Per tick: ${(v3NoJITTime / iterations * 1000).toFixed(2)}µs`)
console.log(`   vs V2: ${((v2Time - v3NoJITTime) / v2Time * 100).toFixed(1)}%`)
console.log('')

// 3. V3 WITH JIT
const brainV3JIT = new Brain({
  genome,
  sensors: SENSORS,
  actions: ACTIONS,
  useV3Optimization: true
})

console.log('3️⃣  V3 (useV3Optimization: true, JIT enabled)')
console.log('   JIT active:', brainV3JIT.useJIT)
console.log('   Warming up...')
for (let i = 0; i < 1000; i++) brainV3JIT.tick()

const v3JITStart = performance.now()
for (let i = 0; i < iterations; i++) {
  brainV3JIT.tick()
}
const v3JITTime = performance.now() - v3JITStart
console.log(`   Time: ${v3JITTime.toFixed(2)}ms`)
console.log(`   Per tick: ${(v3JITTime / iterations * 1000).toFixed(2)}µs`)
console.log(`   vs V2: ${((v2Time - v3JITTime) / v2Time * 100).toFixed(1)}%`)
console.log(`   vs V3 no-JIT: ${((v3NoJITTime - v3JITTime) / v3NoJITTime * 100).toFixed(1)}%`)
console.log('')

console.log('╔═══════════════════════════════════════════╗')
console.log('║   📊 Summary                              ║')
console.log('╚═══════════════════════════════════════════╝')
console.log('')
console.log(`V2 baseline:    ${v2Time.toFixed(2)}ms`)
console.log(`V3 no-JIT:      ${v3NoJITTime.toFixed(2)}ms (${((v2Time - v3NoJITTime) / v2Time * 100).toFixed(1)}%)`)
console.log(`V3 with JIT:    ${v3JITTime.toFixed(2)}ms (${((v2Time - v3JITTime) / v2Time * 100).toFixed(1)}%)`)
console.log('')

if (v3JITTime < v3NoJITTime) {
  console.log(`✅ JIT is ${((v3NoJITTime - v3JITTime) / v3NoJITTime * 100).toFixed(1)}% faster than no-JIT`)
} else {
  console.log(`❌ JIT is ${((v3JITTime - v3NoJITTime) / v3NoJITTime * 100).toFixed(1)}% SLOWER than no-JIT`)
}

if (v3JITTime < v2Time) {
  console.log(`✅ V3 JIT is ${((v2Time - v3JITTime) / v2Time * 100).toFixed(1)}% faster than V2`)
} else {
  console.log(`❌ V3 JIT is ${((v3JITTime - v2Time) / v2Time * 100).toFixed(1)}% slower than V2`)
}
