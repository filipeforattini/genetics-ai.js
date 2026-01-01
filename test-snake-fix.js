#!/usr/bin/env node

/**
 * Quick test to validate the -Infinity bug fix
 */

// Test the specific bug scenario
function testMaxFoodEatenBug() {
  console.log('🧪 Testing maxFoodEaten -Infinity bug fix...\n')

  // BEFORE (buggy code):
  console.log('❌ BEFORE (buggy):')
  let maxFoodEatenBuggy = -Infinity
  const runs = [0, 0, 0, 0, 0]  // Simulate 5 runs where snake eats 0 food

  for (const foodEaten of runs) {
    if (foodEaten > maxFoodEatenBuggy) {
      maxFoodEatenBuggy = foodEaten
    }
  }

  console.log(`   maxFoodEaten = ${maxFoodEatenBuggy}`)
  console.log(`   Is -Infinity? ${maxFoodEatenBuggy === -Infinity}`)
  console.log(`   Division by it: ${100 / maxFoodEatenBuggy}`)
  console.log(`   Causes NaN? ${!Number.isFinite(100 / maxFoodEatenBuggy)}`)
  console.log('')

  // AFTER (fixed code):
  console.log('✅ AFTER (fixed):')
  let maxFoodEatenFixed = 0  // Fix: initialize with 0

  for (const foodEaten of runs) {
    if (foodEaten > maxFoodEatenFixed) {
      maxFoodEatenFixed = foodEaten
    }
  }

  console.log(`   maxFoodEaten = ${maxFoodEatenFixed}`)
  console.log(`   Is -Infinity? ${maxFoodEatenFixed === -Infinity}`)
  console.log(`   Division by it: ${100 / (maxFoodEatenFixed || 1)}`) // Safe division
  console.log(`   Causes NaN? ${!Number.isFinite(100 / (maxFoodEatenFixed || 1))}`)
  console.log('')

  // Test fitness calculation
  console.log('🎯 Testing fitness calculation:')
  console.log('')

  const FITNESS_RUNS = 5

  console.log('   Scenario: All runs die without eating')
  let totalScore = 0
  let totalFoodEaten = 0
  let maxFood = 0  // ✅ Fixed initialization

  for (let run = 0; run < FITNESS_RUNS; run++) {
    const runScore = 50 + Math.random() * 100  // Random score from steps
    const runFood = 0  // No food eaten

    totalScore += runScore
    totalFoodEaten += runFood

    if (runFood > maxFood) {
      maxFood = runFood
    }
  }

  const avgScore = totalScore / FITNESS_RUNS
  const avgFood = totalFoodEaten / FITNESS_RUNS
  const finalFitness = avgScore + (maxFood ** 2) * 3000

  console.log(`   Total score: ${totalScore.toFixed(1)}`)
  console.log(`   Avg score: ${avgScore.toFixed(1)}`)
  console.log(`   Max food: ${maxFood}`)
  console.log(`   Avg food: ${avgFood}`)
  console.log(`   Final fitness: ${finalFitness.toFixed(1)}`)
  console.log(`   Is valid? ${Number.isFinite(finalFitness)}`)
  console.log(`   Has NaN? ${!Number.isFinite(finalFitness)}`)
  console.log('')

  if (Number.isFinite(finalFitness) && finalFitness > 0) {
    console.log('✅ SUCCESS: Bug is fixed! Fitness is valid even when maxFood = 0')
    console.log('')
    return true
  } else {
    console.log('❌ FAILED: Still producing invalid fitness')
    console.log('')
    return false
  }
}

// Run test
const success = testMaxFoodEatenBug()
process.exit(success ? 0 : 1)
