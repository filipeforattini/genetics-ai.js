#!/usr/bin/env node

/**
 * ASYNC API TEST - Phase 3A.1
 *
 * Validates Promise/Callback dual API support for:
 * - tickAsync()
 * - nextAsync()
 * - Async fitness functions
 * - Async hooks
 */

import { Generation, Individual } from '../src/index.js'

class AsyncCreature extends Individual {
  constructor(options) {
    super({
      ...options,
      sensors: [
        { tick: () => Math.random() },
        { tick: () => Math.random() },
      ],
      actions: [
        { tick: (v) => v },
      ]
    })

    this.fitnessValue = 0
  }

  // Async fitness function (simulates async computation)
  async fitness() {
    return new Promise((resolve) => {
      setTimeout(() => {
        // Sum of all genome values
        // Note: only 'attribute' bases have a value property
        // For other bases, we'll use their 'data' or weight property
        const sum = this.genome.getBases().reduce((acc, base) => {
          if (base.type === 'attribute' && base.value !== undefined) {
            return acc + base.value
          } else if (base.type === 'bias' && base.data !== undefined) {
            return acc + Math.abs(base.data)
          } else if (base.type === 'connection' && base.weight !== undefined) {
            return acc + base.weight
          }
          return acc
        }, 0)
        this.fitnessValue = sum
        resolve(sum)
      }, 10) // 10ms simulated async work
    })
  }
}

async function test1_tickAsync_promise() {
  console.log('\n🧪 TEST 1: tickAsync() with Promise')
  console.log('='.repeat(50))

  const generation = new Generation({
    size: 10,
    individualClass: AsyncCreature,
    individualGenomeSize: 20,
    individualNeurons: 4,
  })

  generation.fillRandom()

  try {
    const results = await generation.tickAsync()

    console.log('✅ Promise returned:', results.length, 'results')

    // Debug: check first result
    console.log('   First result:', results[0])
    console.log('   First ind fitness type:', typeof generation.population[0].fitness)

    // Try calling fitness directly
    const directFitness = await generation.population[0].fitness()
    console.log('   Direct fitness call:', directFitness)

    // Verify all fitness values were computed (check the result array)
    const allHaveFitness = results.every(([_, fitness]) =>
      typeof fitness === 'number' && !isNaN(fitness) && fitness > 0
    )
    console.log('   All fitness computed:', allHaveFitness ? '✅' : '❌')

    // Also verify individuals have their fitnessValue set
    const allIndividualsHaveFitness = generation.population.every(ind =>
      ind.fitnessValue > 0
    )
    console.log('   Individuals updated:', allIndividualsHaveFitness ? '✅' : '❌')

    return allHaveFitness && allIndividualsHaveFitness
  } catch (err) {
    console.error('❌ Error:', err.message)
    console.error(err.stack)
    return false
  }
}

async function test2_tickAsync_callback() {
  console.log('\n🧪 TEST 2: tickAsync() with Callback')
  console.log('='.repeat(50))

  const generation = new Generation({
    size: 10,
    individualClass: AsyncCreature,
    individualGenomeSize: 20,
    individualNeurons: 4,
  })

  generation.fillRandom()

  return new Promise((resolve) => {
    const returnValue = generation.tickAsync((err, results) => {
      if (err) {
        console.error('❌ Callback error:', err.message)
        resolve(false)
        return
      }

      console.log('✅ Callback called with:', results.length, 'results')
      resolve(true)
    })

    // Check return value outside the callback
    console.log('   Return value:', returnValue)
    console.log('   Return value type:', typeof returnValue)
    console.log('   Return value is undefined:', returnValue === undefined ? '✅' : '❌')
  })
}

async function test3_nextAsync_promise() {
  console.log('\n🧪 TEST 3: nextAsync() with Promise')
  console.log('='.repeat(50))

  let generation = new Generation({
    size: 20,
    individualClass: AsyncCreature,
    individualGenomeSize: 20,
    individualNeurons: 4,
    eliteRatio: 0.10,
  })

  generation.fillRandom()
  await generation.tickAsync()

  // Kill bottom 50%
  const fitnesses = await Promise.all(generation.population.map(ind => ind.fitness()))
  const sorted = generation.population
    .map((ind, i) => ({ ind, fitness: fitnesses[i] }))
    .sort((a, b) => b.fitness - a.fitness)

  const killCount = Math.floor(generation.size * 0.5)
  sorted.slice(-killCount).forEach(({ ind }) => ind.dead = true)

  try {
    const nextGen = await generation.nextAsync()

    console.log('✅ Next generation created')
    console.log('   Population size:', nextGen.population.length)
    console.log('   Metadata:', JSON.stringify(nextGen.meta, null, 2))

    // Verify elite were preserved
    const eliteCount = Math.ceil(generation.size * 0.10)
    console.log('   Elite preserved:', nextGen.meta.elite === eliteCount ? '✅' : '❌')

    return true
  } catch (err) {
    console.error('❌ Error:', err.message)
    return false
  }
}

async function test4_nextAsync_callback() {
  console.log('\n🧪 TEST 4: nextAsync() with Callback')
  console.log('='.repeat(50))

  let generation = new Generation({
    size: 20,
    individualClass: AsyncCreature,
    individualGenomeSize: 20,
    individualNeurons: 4,
  })

  generation.fillRandom()
  await generation.tickAsync()

  // Kill bottom 50%
  const fitnesses = await Promise.all(generation.population.map(ind => ind.fitness()))
  const sorted = generation.population
    .map((ind, i) => ({ ind, fitness: fitnesses[i] }))
    .sort((a, b) => b.fitness - a.fitness)

  const killCount = Math.floor(generation.size * 0.5)
  sorted.slice(-killCount).forEach(({ ind }) => ind.dead = true)

  return new Promise((resolve) => {
    const returnValue = generation.nextAsync((err, nextGen) => {
      if (err) {
        console.error('❌ Callback error:', err.message)
        resolve(false)
        return
      }

      console.log('✅ Callback called with next generation')
      console.log('   Population size:', nextGen.population.length)
      resolve(true)
    })

    // Check return value outside the callback
    console.log('   Return value is undefined:', returnValue === undefined ? '✅' : '❌')
  })
}

async function test5_async_hooks() {
  console.log('\n🧪 TEST 5: Async Hooks')
  console.log('='.repeat(50))

  let hookCalled = false
  let hookAsyncWorkDone = false

  const generation = new Generation({
    size: 10,
    individualClass: AsyncCreature,
    individualGenomeSize: 20,
    individualNeurons: 4,
    hooks: {
      beforeTick: async function(gen) {
        hookCalled = true
        // Simulate async work
        await new Promise(resolve => setTimeout(resolve, 20))
        hookAsyncWorkDone = true
      }
    }
  })

  generation.fillRandom()

  try {
    await generation.tickAsync()

    console.log('✅ Hook was called:', hookCalled ? '✅' : '❌')
    console.log('   Async work completed:', hookAsyncWorkDone ? '✅' : '❌')

    return hookCalled && hookAsyncWorkDone
  } catch (err) {
    console.error('❌ Error:', err.message)
    return false
  }
}

async function test6_full_evolution_cycle() {
  console.log('\n🧪 TEST 6: Full Evolution Cycle (Async)')
  console.log('='.repeat(50))

  let generation = new Generation({
    size: 30,
    individualClass: AsyncCreature,
    individualGenomeSize: 40,
    individualNeurons: 6,
    eliteRatio: 0.05,
    randomFillRatio: 0.10,
    tournamentSize: 3,
    adaptiveMutation: true,
    baseMutationRate: 0.01,
  })

  generation.fillRandom()

  const generations = 10
  const bestScores = []

  for (let gen = 0; gen < generations; gen++) {
    await generation.tickAsync()

    const fitnesses = await Promise.all(generation.population.map(ind => ind.fitness()))
    const best = Math.max(...fitnesses)
    const avg = fitnesses.reduce((a, b) => a + b) / fitnesses.length

    bestScores.push(best)

    if (gen % 5 === 0 || gen === generations - 1) {
      console.log(`  Gen ${gen.toString().padStart(2)}: Best=${best.toFixed(0).padStart(5)} Avg=${avg.toFixed(0).padStart(5)}`)
    }

    // Kill bottom 40%
    const sorted = generation.population
      .map((ind, i) => ({ ind, fitness: fitnesses[i] }))
      .sort((a, b) => b.fitness - a.fitness)

    const killCount = Math.floor(generation.size * 0.4)
    sorted.slice(-killCount).forEach(({ ind }) => ind.dead = true)

    if (gen < generations - 1) {
      generation = await generation.nextAsync()
    }
  }

  // Verify improvement
  const firstBest = bestScores[0]
  const lastBest = bestScores[bestScores.length - 1]
  const improvement = ((lastBest - firstBest) / firstBest * 100).toFixed(1)

  console.log(`\n  📊 Improvement: ${improvement}% (${firstBest.toFixed(0)} → ${lastBest.toFixed(0)})`)

  // Check for monotonic improvement (no regressions)
  let regressions = 0
  for (let i = 1; i < bestScores.length; i++) {
    if (bestScores[i] < bestScores[i - 1]) {
      regressions++
    }
  }

  console.log('   Regressions:', regressions === 0 ? '0 ✅' : `${regressions} ❌`)

  return regressions === 0 && lastBest > firstBest
}

async function main() {
  console.log('\n🧬 ASYNC API TESTS - Phase 3A.1')
  console.log('='.repeat(70))

  const tests = [
    test1_tickAsync_promise,
    test2_tickAsync_callback,
    test3_nextAsync_promise,
    test4_nextAsync_callback,
    test5_async_hooks,
    test6_full_evolution_cycle,
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
