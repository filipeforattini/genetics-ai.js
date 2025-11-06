#!/usr/bin/env node

/**
 * PROGRESS TRACKING TEST - Phase 3A.4
 *
 * Demonstrates progress tracking for visualization
 */

import { Generation, Individual } from '../src/index.js'
import { formatDuration, formatProgressBar } from '../src/utils/progress.js'

class SlowCreature extends Individual {
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

  // Slow async fitness to demonstrate progress
  async fitness() {
    return new Promise((resolve) => {
      setTimeout(() => {
        const sum = this.genome.getBases().reduce((acc, base) => {
          if (base.type === 'bias' && base.data !== undefined) {
            return acc + Math.abs(base.data)
          } else if (base.type === 'connection' && base.weight !== undefined) {
            return acc + base.weight
          }
          return acc
        }, 0)
        resolve(sum)
      }, 50) // 50ms delay per fitness evaluation
    })
  }
}

async function test1_tickAsyncWithProgress() {
  console.log('\n🧪 TEST 1: tickAsync() with progress tracking')
  console.log('='.repeat(50))

  const generation = new Generation({
    size: 20,
    individualClass: SlowCreature,
    individualGenomeSize: 10,
    individualNeurons: 2,
  })

  generation.fillRandom()

  let lastUpdate = 0

  try {
    const results = await generation.tickAsync({
      onProgress: (progress) => {
        const bar = formatProgressBar(progress.percentage)
        const elapsed = formatDuration(progress.elapsed)
        const eta = formatDuration(progress.eta)

        // Only log every 5 updates to avoid spam
        if (progress.current - lastUpdate >= 5 || progress.completed) {
          console.log(`  ${bar} ${progress.current}/${progress.total} (${progress.percentage.toFixed(1)}%) | Elapsed: ${elapsed} | ETA: ${eta}`)
          lastUpdate = progress.current
        }
      }
    })

    console.log('✅ Progress tracking completed')
    console.log('   Results:', results.length, 'individuals')
    return true
  } catch (err) {
    console.error('❌ Error:', err.message)
    return false
  }
}

async function test2_tickAsyncWithProgressCallback() {
  console.log('\n🧪 TEST 2: tickAsync() with progress + callback API')
  console.log('='.repeat(50))

  const generation = new Generation({
    size: 15,
    individualClass: SlowCreature,
    individualGenomeSize: 10,
    individualNeurons: 2,
  })

  generation.fillRandom()

  let progressUpdates = 0

  return new Promise((resolve) => {
    generation.tickAsync({
      onProgress: (progress) => {
        progressUpdates++
        if (progress.completed) {
          console.log(`  ✅ Completed! (${progressUpdates} progress updates)`)
        }
      }
    }, (err, results) => {
      if (err) {
        console.error('❌ Callback error:', err.message)
        resolve(false)
        return
      }

      console.log('✅ Callback called')
      console.log('   Results:', results.length, 'individuals')
      console.log('   Progress updates:', progressUpdates)
      resolve(true)
    })
  })
}

async function test3_evolutionWithProgress() {
  console.log('\n🧪 TEST 3: Full evolution cycle with progress')
  console.log('='.repeat(50))

  let generation = new Generation({
    size: 30,
    individualClass: SlowCreature,
    individualGenomeSize: 20,
    individualNeurons: 4,
    eliteRatio: 0.05,
  })

  generation.fillRandom()

  const generations = 3

  for (let gen = 0; gen < generations; gen++) {
    console.log(`\n  Generation ${gen}:`)

    // Tick with progress
    await generation.tickAsync({
      onProgress: (progress) => {
        if (progress.percentage === 100) {
          console.log(`    Fitness evaluation: 100%`)
        }
      }
    })

    const fitnesses = await Promise.all(generation.population.map(ind => ind.fitness()))
    const best = Math.max(...fitnesses)
    const avg = fitnesses.reduce((a, b) => a + b) / fitnesses.length

    console.log(`    Best: ${best.toFixed(0)}, Avg: ${avg.toFixed(0)}`)

    if (gen < generations - 1) {
      // Kill bottom 40%
      const sorted = generation.population
        .map((ind, i) => ({ ind, fitness: fitnesses[i] }))
        .sort((a, b) => b.fitness - a.fitness)

      sorted.slice(-12).forEach(({ ind }) => ind.dead = true)

      generation = await generation.nextAsync()
    }
  }

  console.log('\n✅ Evolution with progress completed')
  return true
}

async function test4_customProgressVisualization() {
  console.log('\n🧪 TEST 4: Custom progress visualization')
  console.log('='.repeat(50))

  const generation = new Generation({
    size: 25,
    individualClass: SlowCreature,
    individualGenomeSize: 10,
    individualNeurons: 2,
  })

  generation.fillRandom()

  const startTime = Date.now()
  let maxPercentage = 0

  try {
    await generation.tickAsync({
      onProgress: (progress) => {
        maxPercentage = Math.max(maxPercentage, progress.percentage)

        // Custom visualization: show emoji progress
        const emojiBar = Math.floor(progress.percentage / 10)
        const emojis = '🧬'.repeat(emojiBar) + '⬜'.repeat(10 - emojiBar)

        // Clear line and rewrite (simple terminal animation)
        if (progress.current < progress.total) {
          process.stdout.write(`\r  ${emojis} ${progress.percentage.toFixed(1)}%`)
        } else {
          console.log(`\r  ${emojis} ${progress.percentage.toFixed(1)}% ✅`)
        }
      }
    })

    const elapsed = Date.now() - startTime
    console.log(`  Elapsed: ${formatDuration(elapsed)}`)
    console.log(`✅ Custom visualization completed`)
    console.log(`   Max percentage reached: ${maxPercentage.toFixed(1)}%`)
    return maxPercentage === 100
  } catch (err) {
    console.error('❌ Error:', err.message)
    return false
  }
}

async function main() {
  console.log('\n🧬 PROGRESS TRACKING TEST - Phase 3A.4')
  console.log('='.repeat(70))

  const tests = [
    test1_tickAsyncWithProgress,
    test2_tickAsyncWithProgressCallback,
    test3_evolutionWithProgress,
    test4_customProgressVisualization,
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
