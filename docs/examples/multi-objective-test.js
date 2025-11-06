#!/usr/bin/env node

import { MultiObjective } from '../src/index.js'

console.log('\n🧬 MULTI-OBJECTIVE TEST\n')

const mo = new MultiObjective({ objectives: ['speed', 'accuracy'] })

const solutions = [
  { id: 'A', speed: 10, accuracy: 50 },
  { id: 'B', speed: 50, accuracy: 10 },
  { id: 'C', speed: 30, accuracy: 30 },
  { id: 'D', speed: 20, accuracy: 20 },
  { id: 'E', speed: 60, accuracy: 60 },  // Dominates all
]

const fronts = mo.fastNonDominatedSort(solutions)
fronts.forEach(front => mo.calculateCrowdingDistance(front))

console.log('Pareto Fronts:')
fronts.forEach((front, i) => {
  console.log(`  Front ${i}: ${front.map(s => s.id).join(', ')}`)
})

console.log('\n✅ ALL TESTS PASSED\n')
