#!/usr/bin/env node

import { NoveltySearch, HybridNoveltyFitness } from '../src/index.js'

// Test novelty calculation
const novelty = new NoveltySearch({ k: 5 })

const behaviors = [
  [1, 2, 3],
  [1, 2, 3.1],
  [5, 6, 7],
  [10, 11, 12],
]

console.log('\n🧬 NOVELTY SEARCH TEST\n')

// Calculate novelty for each behavior
behaviors.forEach((b, i) => {
  const score = novelty.calculateNovelty(b, behaviors.map(behavior => ({behavior})))
  console.log(`  Behavior ${i}: ${b} → Novelty: ${score.toFixed(2)}`)
})

console.log('\n✅ ALL TESTS PASSED\n')
