#!/usr/bin/env node

/**
 * FLEXIBLE ARGUMENTS TEST - Phase 3A.2
 *
 * Tests ml5.js-style flexible argument handling:
 * - method()
 * - method(callback)
 * - method(options)
 * - method(options, callback)
 */

import { Generation, Individual } from '../src/index.js'

class SimpleCreature extends Individual {
  constructor(options) {
    super({
      ...options,
      sensors: [
        { tick: () => Math.random() },
      ],
      actions: [
        { tick: (v) => v },
      ]
    })
  }

  async fitness() {
    // Simple fitness: sum of genome bases
    const sum = this.genome.getBases().reduce((acc, base) => {
      if (base.type === 'bias' && base.data !== undefined) {
        return acc + Math.abs(base.data)
      } else if (base.type === 'connection' && base.weight !== undefined) {
        return acc + base.weight
      }
      return acc
    }, 0)
    return sum
  }
}

async function test1_tickAsync_noArgs() {
  console.log('\n🧪 TEST 1: tickAsync() - No arguments')
  console.log('='.repeat(50))

  const generation = new Generation({
    size: 5,
    individualClass: SimpleCreature,
    individualGenomeSize: 10,
    individualNeurons: 2,
  })

  generation.fillRandom()

  try {
    const results = await generation.tickAsync()
    console.log('✅ Works with no arguments')
    console.log('   Results:', results.length, 'individuals')
    return true
  } catch (err) {
    console.error('❌ Error:', err.message)
    return false
  }
}

async function test2_tickAsync_callback() {
  console.log('\n🧪 TEST 2: tickAsync(callback)')
  console.log('='.repeat(50))

  const generation = new Generation({
    size: 5,
    individualClass: SimpleCreature,
    individualGenomeSize: 10,
    individualNeurons: 2,
  })

  generation.fillRandom()

  return new Promise((resolve) => {
    const returnValue = generation.tickAsync((err, results) => {
      if (err) {
        console.error('❌ Callback error:', err.message)
        resolve(false)
        return
      }

      console.log('✅ Works with callback')
      console.log('   Results:', results.length, 'individuals')
      console.log('   Return value is undefined:', returnValue === undefined ? '✅' : '❌')
      resolve(returnValue === undefined)
    })
  })
}

async function test3_tickAsync_options() {
  console.log('\n🧪 TEST 3: tickAsync(options)')
  console.log('='.repeat(50))

  const generation = new Generation({
    size: 5,
    individualClass: SimpleCreature,
    individualGenomeSize: 10,
    individualNeurons: 2,
  })

  generation.fillRandom()

  try {
    const results = await generation.tickAsync({ parallel: true })
    console.log('✅ Works with options object')
    console.log('   Results:', results.length, 'individuals')
    return true
  } catch (err) {
    console.error('❌ Error:', err.message)
    return false
  }
}

async function test4_tickAsync_optionsAndCallback() {
  console.log('\n🧪 TEST 4: tickAsync(options, callback)')
  console.log('='.repeat(50))

  const generation = new Generation({
    size: 5,
    individualClass: SimpleCreature,
    individualGenomeSize: 10,
    individualNeurons: 2,
  })

  generation.fillRandom()

  return new Promise((resolve) => {
    const returnValue = generation.tickAsync({ parallel: true }, (err, results) => {
      if (err) {
        console.error('❌ Callback error:', err.message)
        resolve(false)
        return
      }

      console.log('✅ Works with options and callback')
      console.log('   Results:', results.length, 'individuals')
      console.log('   Return value is undefined:', returnValue === undefined ? '✅' : '❌')
      resolve(returnValue === undefined)
    })
  })
}

async function test5_nextAsync_noArgs() {
  console.log('\n🧪 TEST 5: nextAsync() - No arguments')
  console.log('='.repeat(50))

  let generation = new Generation({
    size: 10,
    individualClass: SimpleCreature,
    individualGenomeSize: 10,
    individualNeurons: 2,
  })

  generation.fillRandom()
  await generation.tickAsync()

  // Kill bottom 50%
  const fitnesses = await Promise.all(generation.population.map(ind => ind.fitness()))
  const sorted = generation.population
    .map((ind, i) => ({ ind, fitness: fitnesses[i] }))
    .sort((a, b) => b.fitness - a.fitness)

  sorted.slice(-5).forEach(({ ind }) => ind.dead = true)

  try {
    const nextGen = await generation.nextAsync()
    console.log('✅ Works with no arguments')
    console.log('   Next gen size:', nextGen.population.length)
    return true
  } catch (err) {
    console.error('❌ Error:', err.message)
    return false
  }
}

async function test6_nextAsync_callback() {
  console.log('\n🧪 TEST 6: nextAsync(callback)')
  console.log('='.repeat(50))

  let generation = new Generation({
    size: 10,
    individualClass: SimpleCreature,
    individualGenomeSize: 10,
    individualNeurons: 2,
  })

  generation.fillRandom()
  await generation.tickAsync()

  // Kill bottom 50%
  const fitnesses = await Promise.all(generation.population.map(ind => ind.fitness()))
  const sorted = generation.population
    .map((ind, i) => ({ ind, fitness: fitnesses[i] }))
    .sort((a, b) => b.fitness - a.fitness)

  sorted.slice(-5).forEach(({ ind }) => ind.dead = true)

  return new Promise((resolve) => {
    const returnValue = generation.nextAsync((err, nextGen) => {
      if (err) {
        console.error('❌ Callback error:', err.message)
        resolve(false)
        return
      }

      console.log('✅ Works with callback')
      console.log('   Next gen size:', nextGen.population.length)
      console.log('   Return value is undefined:', returnValue === undefined ? '✅' : '❌')
      resolve(returnValue === undefined)
    })
  })
}

async function test7_nextAsync_options() {
  console.log('\n🧪 TEST 7: nextAsync(options)')
  console.log('='.repeat(50))

  let generation = new Generation({
    size: 10,
    individualClass: SimpleCreature,
    individualGenomeSize: 10,
    individualNeurons: 2,
  })

  generation.fillRandom()
  await generation.tickAsync()

  // Kill bottom 50%
  const fitnesses = await Promise.all(generation.population.map(ind => ind.fitness()))
  const sorted = generation.population
    .map((ind, i) => ({ ind, fitness: fitnesses[i] }))
    .sort((a, b) => b.fitness - a.fitness)

  sorted.slice(-5).forEach(({ ind }) => ind.dead = true)

  try {
    const nextGen = await generation.nextAsync({ preserveMetadata: false })
    console.log('✅ Works with options object')
    console.log('   Next gen size:', nextGen.population.length)
    return true
  } catch (err) {
    console.error('❌ Error:', err.message)
    return false
  }
}

async function test8_nextAsync_optionsAndCallback() {
  console.log('\n🧪 TEST 8: nextAsync(options, callback)')
  console.log('='.repeat(50))

  let generation = new Generation({
    size: 10,
    individualClass: SimpleCreature,
    individualGenomeSize: 10,
    individualNeurons: 2,
  })

  generation.fillRandom()
  await generation.tickAsync()

  // Kill bottom 50%
  const fitnesses = await Promise.all(generation.population.map(ind => ind.fitness()))
  const sorted = generation.population
    .map((ind, i) => ({ ind, fitness: fitnesses[i] }))
    .sort((a, b) => b.fitness - a.fitness)

  sorted.slice(-5).forEach(({ ind }) => ind.dead = true)

  return new Promise((resolve) => {
    const returnValue = generation.nextAsync({ preserveMetadata: false }, (err, nextGen) => {
      if (err) {
        console.error('❌ Callback error:', err.message)
        resolve(false)
        return
      }

      console.log('✅ Works with options and callback')
      console.log('   Next gen size:', nextGen.population.length)
      console.log('   Return value is undefined:', returnValue === undefined ? '✅' : '❌')
      resolve(returnValue === undefined)
    })
  })
}

async function main() {
  console.log('\n🧬 FLEXIBLE ARGUMENTS TEST - Phase 3A.2')
  console.log('='.repeat(70))

  const tests = [
    test1_tickAsync_noArgs,
    test2_tickAsync_callback,
    test3_tickAsync_options,
    test4_tickAsync_optionsAndCallback,
    test5_nextAsync_noArgs,
    test6_nextAsync_callback,
    test7_nextAsync_options,
    test8_nextAsync_optionsAndCallback,
  ]

  const results = []

  for (const test of tests) {
    const result = await test()
    results.push(result)
  }

  console.log('\n' + '='.repeat(70))
  console.log('📊 RESULTS')
  console.log('='.repeat(70))

  const passed = results.filter(r => r).length
  const total = results.length

  console.log(`\n  Passed: ${passed}/${total}`)

  if (passed === total) {
    console.log('\n  ✅ ALL TESTS PASSED')
  } else {
    console.log('\n  ❌ SOME TESTS FAILED')
  }
}

main().catch(console.error)
