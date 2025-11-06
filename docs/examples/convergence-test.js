#!/usr/bin/env node

/**
 * CONVERGENCE TEST - Validates Phase 1 improvements
 *
 * Tests:
 * 1. Elitism - Best fitness never decreases
 * 2. Tournament Selection - Better selection pressure
 * 3. Limited Random Fill - Less genetic dilution
 *
 * Expected improvements:
 * - Faster convergence (50% fewer generations)
 * - More consistent results (less variance)
 * - No fitness regression between generations
 */

import { Generation, Individual } from '../src/index.js'

// Simple fitness function: maximize sum of genome characters
class SimpleCreature extends Individual {
  fitness() {
    // Simple problem: maximize the number of '1' bits in genome
    const encoded = this.genome.encoded
    let score = 0

    for (let char of encoded) {
      const val = parseInt(char, 32)
      // Count set bits
      score += val.toString(2).split('1').length - 1
    }

    return score
  }
}

async function testConvergence(config) {
  console.log(`\n🧪 Testing: ${config.name}`)
  console.log('='.repeat(50))

  const generation = new Generation({
    size: config.populationSize,
    individualClass: SimpleCreature,
    individualGenomeSize: config.genomeSize,
    individualNeurons: 5,
    eliteRatio: config.eliteRatio,
    randomFillRatio: config.randomFillRatio,
    tournamentSize: config.tournamentSize,
  })

  generation.fillRandom()

  const stats = {
    bestFitness: [],
    avgFitness: [],
    diversity: [],
    regressions: 0,
    generations: config.maxGenerations,
    convergedAt: null,
  }

  let previousBest = 0

  for (let gen = 0; gen < config.maxGenerations; gen++) {
    // Tick (not needed for this simple test but keep consistency)
    generation.tick()

    // Calculate stats
    const fitnesses = generation.population.map(i => i.fitness())
    const best = Math.max(...fitnesses)
    const avg = fitnesses.reduce((a, b) => a + b, 0) / fitnesses.length
    const unique = new Set(generation.population.map(i => i.genome.encoded)).size
    const diversity = unique / generation.size

    stats.bestFitness.push(best)
    stats.avgFitness.push(avg)
    stats.diversity.push(diversity)

    // Check for regression (should NEVER happen with elitism)
    if (best < previousBest) {
      stats.regressions++
      console.log(`  ⚠️  Regression at gen ${gen}: ${previousBest} → ${best}`)
    }

    previousBest = best

    // Report every 10 generations
    if (gen % 10 === 0 || gen === config.maxGenerations - 1) {
      console.log(`  Gen ${gen.toString().padStart(3)}: Best=${best.toFixed(0).padStart(4)} Avg=${avg.toFixed(1).padStart(5)} Diversity=${(diversity * 100).toFixed(1)}%` +
        (generation.meta.elite ? ` Elite=${generation.meta.elite} Random=${generation.meta.randoms || 0}` : ''))
    }

    // Check convergence (best hasn't improved in 20 generations)
    if (gen > 20 && !stats.convergedAt) {
      const recent = stats.bestFitness.slice(-20)
      const allSame = recent.every(f => f === recent[0])
      if (allSame) {
        stats.convergedAt = gen - 19
        console.log(`  ✅ Converged at generation ${stats.convergedAt}`)
      }
    }

    // Kill bottom 30% for next generation
    const sorted = generation.population
      .map((ind, i) => ({ ind, fitness: fitnesses[i] }))
      .sort((a, b) => b.fitness - a.fitness)

    const killCount = Math.floor(generation.size * 0.3)
    for (let i = generation.size - killCount; i < generation.size; i++) {
      sorted[i].ind.dead = true
    }

    // Next generation
    if (gen < config.maxGenerations - 1) {
      const nextGen = generation.next()
      generation.population = nextGen.population
      generation.meta = nextGen.meta
    }
  }

  // Final report
  const finalBest = stats.bestFitness[stats.bestFitness.length - 1]
  const improvement = ((finalBest - stats.bestFitness[0]) / stats.bestFitness[0] * 100).toFixed(1)

  console.log('\n📊 Results:')
  console.log(`  Final Best Fitness: ${finalBest.toFixed(0)}`)
  console.log(`  Improvement: ${improvement}%`)
  console.log(`  Converged at: Gen ${stats.convergedAt || 'Never'}`)
  console.log(`  Regressions: ${stats.regressions} ${stats.regressions === 0 ? '✅' : '❌'}`)
  console.log(`  Final Diversity: ${(stats.diversity[stats.diversity.length - 1] * 100).toFixed(1)}%`)

  return stats
}

async function main() {
  console.log('\n🧬 CONVERGENCE COMPARISON TEST')
  console.log('='.repeat(70))

  // Test 1: OLD behavior (no elitism, 50% random fill)
  const oldStats = await testConvergence({
    name: 'OLD Algorithm (no fixes)',
    populationSize: 50,
    genomeSize: 40,
    maxGenerations: 100,
    eliteRatio: 0,           // NO elitism
    randomFillRatio: 0.5,    // 50% randoms (old behavior)
    tournamentSize: 1,       // Random selection (no tournament)
  })

  // Test 2: NEW behavior (elitism + tournament + limited randoms)
  const newStats = await testConvergence({
    name: 'NEW Algorithm (with Phase 1 fixes)',
    populationSize: 50,
    genomeSize: 40,
    maxGenerations: 100,
    eliteRatio: 0.05,        // 5% elitism
    randomFillRatio: 0.10,   // 10% randoms
    tournamentSize: 3,       // Tournament selection
  })

  // Comparison
  console.log('\n' + '='.repeat(70))
  console.log('📈 COMPARISON')
  console.log('='.repeat(70))

  const oldConverged = oldStats.convergedAt || oldStats.generations
  const newConverged = newStats.convergedAt || newStats.generations
  const speedup = ((oldConverged - newConverged) / oldConverged * 100).toFixed(1)

  console.log(`\n🏁 Convergence Speed:`)
  console.log(`  OLD: ${oldConverged} generations`)
  console.log(`  NEW: ${newConverged} generations`)
  console.log(`  Improvement: ${speedup}% faster ${speedup > 0 ? '✅' : '❌'}`)

  const oldFinal = oldStats.bestFitness[oldStats.bestFitness.length - 1]
  const newFinal = newStats.bestFitness[newStats.bestFitness.length - 1]
  const qualityGain = ((newFinal - oldFinal) / oldFinal * 100).toFixed(1)

  console.log(`\n🎯 Final Quality:`)
  console.log(`  OLD: ${oldFinal.toFixed(0)}`)
  console.log(`  NEW: ${newFinal.toFixed(0)}`)
  console.log(`  Improvement: ${qualityGain}% better ${qualityGain > 0 ? '✅' : '❌'}`)

  console.log(`\n🔒 Elitism Test:`)
  console.log(`  OLD regressions: ${oldStats.regressions} ${oldStats.regressions > 0 ? '⚠️  (fitness can decrease!)' : ''}`)
  console.log(`  NEW regressions: ${newStats.regressions} ${newStats.regressions === 0 ? '✅ (never decreases!)' : '❌'}`)

  console.log(`\n🌈 Diversity:`)
  console.log(`  OLD final: ${(oldStats.diversity[oldStats.diversity.length - 1] * 100).toFixed(1)}%`)
  console.log(`  NEW final: ${(newStats.diversity[newStats.diversity.length - 1] * 100).toFixed(1)}%`)

  console.log('\n' + '='.repeat(70))

  if (newStats.regressions === 0 && newConverged < oldConverged && newFinal > oldFinal) {
    console.log('✅ ALL TESTS PASSED! Phase 1 fixes are working correctly.')
  } else {
    console.log('⚠️  Some tests failed. Check the results above.')
  }
}

main().catch(console.error)
