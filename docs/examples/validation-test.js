#!/usr/bin/env node

/**
 * VALIDATION TEST - Phase 3A.3
 *
 * Tests error messages and input validation
 */

import { Generation, Individual } from '../src/index.js'
import { ValidationError } from '../src/utils/validation.js'

class TestCreature extends Individual {
  fitness() {
    return 100
  }
}

async function test1_invalidSize() {
  console.log('\n🧪 TEST 1: Invalid size (0)')
  console.log('='.repeat(50))

  try {
    new Generation({
      size: 0,
      individualClass: TestCreature,
    })
    console.log('❌ Should have thrown error')
    return false
  } catch (err) {
    if (err instanceof ValidationError) {
      console.log('✅ Caught ValidationError')
      console.log('   Message:', err.message.split('\n')[0])
      return true
    }
    console.log('❌ Wrong error type:', err.name)
    return false
  }
}

async function test2_invalidSizeNegative() {
  console.log('\n🧪 TEST 2: Invalid size (-10)')
  console.log('='.repeat(50))

  try {
    new Generation({
      size: -10,
      individualClass: TestCreature,
    })
    console.log('❌ Should have thrown error')
    return false
  } catch (err) {
    if (err instanceof ValidationError) {
      console.log('✅ Caught ValidationError')
      console.log('   Message:', err.message.split('\n')[0])
      return true
    }
    console.log('❌ Wrong error type:', err.name)
    return false
  }
}

async function test3_invalidEliteRatio() {
  console.log('\n🧪 TEST 3: Invalid eliteRatio (1.5)')
  console.log('='.repeat(50))

  try {
    new Generation({
      size: 10,
      individualClass: TestCreature,
      eliteRatio: 1.5,
    })
    console.log('❌ Should have thrown error')
    return false
  } catch (err) {
    if (err instanceof ValidationError) {
      console.log('✅ Caught ValidationError')
      console.log('   Message:', err.message.split('\n')[0])
      return true
    }
    console.log('❌ Wrong error type:', err.name)
    return false
  }
}

async function test4_invalidRandomFillRatio() {
  console.log('\n🧪 TEST 4: Invalid randomFillRatio (-0.1)')
  console.log('='.repeat(50))

  try {
    new Generation({
      size: 10,
      individualClass: TestCreature,
      randomFillRatio: -0.1,
    })
    console.log('❌ Should have thrown error')
    return false
  } catch (err) {
    if (err instanceof ValidationError) {
      console.log('✅ Caught ValidationError')
      console.log('   Message:', err.message.split('\n')[0])
      return true
    }
    console.log('❌ Wrong error type:', err.name)
    return false
  }
}

async function test5_invalidTournamentSize() {
  console.log('\n🧪 TEST 5: Invalid tournamentSize (0)')
  console.log('='.repeat(50))

  try {
    new Generation({
      size: 10,
      individualClass: TestCreature,
      tournamentSize: 0,
    })
    console.log('❌ Should have thrown error')
    return false
  } catch (err) {
    if (err instanceof ValidationError) {
      console.log('✅ Caught ValidationError')
      console.log('   Message:', err.message.split('\n')[0])
      return true
    }
    console.log('❌ Wrong error type:', err.name)
    return false
  }
}

async function test6_invalidMutationRate() {
  console.log('\n🧪 TEST 6: Invalid baseMutationRate (2.0)')
  console.log('='.repeat(50))

  try {
    new Generation({
      size: 10,
      individualClass: TestCreature,
      baseMutationRate: 2.0,
    })
    console.log('❌ Should have thrown error')
    return false
  } catch (err) {
    if (err instanceof ValidationError) {
      console.log('✅ Caught ValidationError')
      console.log('   Message:', err.message.split('\n')[0])
      return true
    }
    console.log('❌ Wrong error type:', err.name)
    return false
  }
}

async function test7_invalidIndividualClass() {
  console.log('\n🧪 TEST 7: Invalid individualClass (not a class)')
  console.log('='.repeat(50))

  try {
    new Generation({
      size: 10,
      individualClass: 'NotAClass',
    })
    console.log('❌ Should have thrown error')
    return false
  } catch (err) {
    if (err instanceof ValidationError) {
      console.log('✅ Caught ValidationError')
      console.log('   Message:', err.message.split('\n')[0])
      return true
    }
    console.log('❌ Wrong error type:', err.name)
    return false
  }
}

async function test8_emptyPopulationTick() {
  console.log('\n🧪 TEST 8: tick() on empty population')
  console.log('='.repeat(50))

  try {
    const generation = new Generation({
      size: 10,
      individualClass: TestCreature,
    })
    // Don't call fillRandom()
    generation.tick()
    console.log('❌ Should have thrown error')
    return false
  } catch (err) {
    if (err instanceof ValidationError) {
      console.log('✅ Caught ValidationError')
      console.log('   Message:', err.message.split('\n')[0])
      return true
    }
    console.log('❌ Wrong error type:', err.name)
    return false
  }
}

async function test9_emptyPopulationTickAsync() {
  console.log('\n🧪 TEST 9: tickAsync() on empty population')
  console.log('='.repeat(50))

  try {
    const generation = new Generation({
      size: 10,
      individualClass: TestCreature,
    })
    // Don't call fillRandom()
    await generation.tickAsync()
    console.log('❌ Should have thrown error')
    return false
  } catch (err) {
    if (err instanceof ValidationError) {
      console.log('✅ Caught ValidationError')
      console.log('   Message:', err.message.split('\n')[0])
      return true
    }
    console.log('❌ Wrong error type:', err.name)
    return false
  }
}

async function test10_validConfiguration() {
  console.log('\n🧪 TEST 10: Valid configuration')
  console.log('='.repeat(50))

  try {
    const generation = new Generation({
      size: 20,
      individualClass: TestCreature,
      individualGenomeSize: 40,
      individualNeurons: 10,
      eliteRatio: 0.10,
      randomFillRatio: 0.15,
      tournamentSize: 5,
      baseMutationRate: 0.02,
      adaptiveMutation: true,
      mutationDecayRate: 300,
    })

    generation.fillRandom()
    generation.tick()

    console.log('✅ Valid configuration accepted')
    console.log('   Population:', generation.population.length)
    return true
  } catch (err) {
    console.log('❌ Should not have thrown error')
    console.log('   Error:', err.message)
    return false
  }
}

async function main() {
  console.log('\n🧬 VALIDATION TEST - Phase 3A.3')
  console.log('='.repeat(70))

  const tests = [
    test1_invalidSize,
    test2_invalidSizeNegative,
    test3_invalidEliteRatio,
    test4_invalidRandomFillRatio,
    test5_invalidTournamentSize,
    test6_invalidMutationRate,
    test7_invalidIndividualClass,
    test8_emptyPopulationTick,
    test9_emptyPopulationTickAsync,
    test10_validConfiguration,
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
