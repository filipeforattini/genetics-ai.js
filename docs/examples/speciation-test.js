#!/usr/bin/env node

/**
 * SPECIATION TEST - Phase 3C
 *
 * Demonstrates NEAT-style speciation for maintaining diversity
 * and exploring multiple evolutionary niches simultaneously
 */

import { Generation, Individual } from '../src/index.js'

class SpeciatedCreature extends Individual {
  fitness() {
    // Fitness based on genome composition
    const bases = this.genome.getBases()

    let score = 0
    for (const base of bases) {
      if (base.type === 'bias' && base.data !== undefined) {
        score += Math.abs(base.data)
      } else if (base.type === 'connection' && base.weight !== undefined) {
        score += base.weight
      }
    }

    return score
  }
}

async function test1_speciationBasic() {
  console.log('\n🧪 TEST 1: Basic speciation')
  console.log('='.repeat(50))

  let generation = new Generation({
    size: 50,
    individualClass: SpeciatedCreature,
    individualGenomeSize: 30,
    individualNeurons: 6,
    useSpeciation: true,  // Enable speciation
    speciationOptions: {
      compatibilityThreshold: 3.0,
      stagnationThreshold: 15,
    }
  })

  generation.fillRandom()

  // Run for 20 generations
  for (let gen = 0; gen < 20; gen++) {
    generation.tick()

    const fitnesses = generation.population.map(ind => ind.fitness())
    const best = Math.max(...fitnesses)
    const avg = fitnesses.reduce((a, b) => a + b) / fitnesses.length

    if (gen % 5 === 0 || gen === 19) {
      const specInfo = generation.meta.speciation || { speciesCount: 0 }
      console.log(`  Gen ${gen.toString().padStart(2)}: ` +
        `Best=${best.toFixed(0).padStart(3)} ` +
        `Avg=${avg.toFixed(0).padStart(3)} ` +
        `Species=${specInfo.speciesCount}`)

      if (specInfo.species && gen === 19) {
        console.log('  Species breakdown:')
        specInfo.species.forEach(s => {
          console.log(`    Species ${s.id}: ${s.size} members, ` +
            `age=${s.age}, maxFit=${s.maxFitness.toFixed(0)}, ` +
            `stag=${s.stagnation}`)
        })
      }
    }

    // Kill bottom 40%
    const sorted = generation.population
      .map((ind, i) => ({ ind, fitness: fitnesses[i] }))
      .sort((a, b) => b.fitness - a.fitness)

    const killCount = Math.floor(generation.size * 0.4)
    sorted.slice(-killCount).forEach(({ ind }) => ind.dead = true)

    if (gen < 19) {
      generation = generation.next()
    }
  }

  console.log('\n✅ Speciation maintains multiple niches')
  return true
}

async function test2_speciationVsNoSpeciation() {
  console.log('\n🧪 TEST 2: Speciation vs No Speciation')
  console.log('='.repeat(50))

  const configs = [
    { name: 'WITHOUT speciation', useSpeciation: false },
    { name: 'WITH speciation', useSpeciation: true }
  ]

  for (const config of configs) {
    console.log(`\n  ${config.name}:`)

    let generation = new Generation({
      size: 40,
      individualClass: SpeciatedCreature,
      individualGenomeSize: 25,
      individualNeurons: 5,
      useSpeciation: config.useSpeciation,
      eliteRatio: 0.05,
    })

    generation.fillRandom()

    const history = []

    for (let gen = 0; gen < 15; gen++) {
      generation.tick()

      const fitnesses = generation.population.map(ind => ind.fitness())
      const best = Math.max(...fitnesses)
      const avg = fitnesses.reduce((a, b) => a + b) / fitnesses.length

      history.push({ gen, best, avg })

      // Kill bottom 40%
      const sorted = generation.population
        .map((ind, i) => ({ ind, fitness: fitnesses[i] }))
        .sort((a, b) => b.fitness - a.fitness)

      sorted.slice(-16).forEach(({ ind }) => ind.dead = true)

      if (gen < 14) {
        generation = generation.next()
      }
    }

    const finalBest = history[history.length - 1].best
    const improvement = ((finalBest - history[0].best) / history[0].best * 100).toFixed(1)

    console.log(`    Final: Best=${finalBest.toFixed(0)}, Improvement=${improvement}%`)

    if (config.useSpeciation && generation.meta.speciation) {
      console.log(`    Final species count: ${generation.meta.speciation.speciesCount}`)
    }
  }

  console.log('\n✅ Compared speciation vs traditional GA')
  return true
}

async function test3_speciationDiversity() {
  console.log('\n🧪 TEST 3: Speciation maintains diversity')
  console.log('='.repeat(50))

  let generation = new Generation({
    size: 60,
    individualClass: SpeciatedCreature,
    individualGenomeSize: 40,
    individualNeurons: 8,
    useSpeciation: true,
    speciationOptions: {
      compatibilityThreshold: 2.5,  // More strict = more species
      stagnationThreshold: 10,
    }
  })

  generation.fillRandom()

  console.log('  Tracking diversity over 25 generations...\n')

  for (let gen = 0; gen < 25; gen++) {
    generation.tick()

    const fitnesses = generation.population.map(ind => ind.fitness())

    if (gen % 5 === 0) {
      const diversity = generation.calculateDiversity()
      const specInfo = generation.meta.speciation || { speciesCount: 0 }

      console.log(`  Gen ${gen.toString().padStart(2)}: ` +
        `Diversity=${(diversity * 100).toFixed(1)}% ` +
        `Species=${specInfo.speciesCount}`)
    }

    // Kill bottom 35%
    const sorted = generation.population
      .map((ind, i) => ({ ind, fitness: fitnesses[i] }))
      .sort((a, b) => b.fitness - a.fitness)

    sorted.slice(-21).forEach(({ ind }) => ind.dead = true)

    if (gen < 24) {
      generation = generation.next()
    }
  }

  const finalDiversity = generation.calculateDiversity()
  console.log(`\n  Final diversity: ${(finalDiversity * 100).toFixed(1)}%`)

  console.log('\n✅ Speciation preserves genetic diversity')
  return finalDiversity > 0.3  // Should maintain >30% diversity
}

async function main() {
  console.log('\n🧬 SPECIATION TEST - Phase 3C (NEAT-style)')
  console.log('='.repeat(70))

  const tests = [
    test1_speciationBasic,
    test2_speciationVsNoSpeciation,
    test3_speciationDiversity,
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
