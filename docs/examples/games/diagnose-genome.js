import { Individual, Genome } from '../../../src/index.js'
import fs from 'fs'

/**
 * 🔍 DIAGNOSTIC SCRIPT - Verify genome loading issue
 */

// Load champion
const championData = JSON.parse(fs.readFileSync('docs/examples/games/snake-champion.json', 'utf-8'))

console.log('🔍 GENOME DIAGNOSTIC TOOL\n')
console.log('=' .repeat(60))
console.log('📦 Champion Data:')
console.log(`   Generation: ${championData.stats.generation}`)
console.log(`   Food Eaten: ${championData.stats.foodEaten}`)
console.log(`   Fitness: ${championData.stats.fitness}`)
console.log(`   Genome length: ${championData.genome.length} characters`)
console.log('=' .repeat(60))

// Test 1: Create Individual with WRONG parameter name (current bug)
console.log('\n🧪 TEST 1: Creating Individual with genomeEncoded (WRONG)')
const testWrong = new Individual({
  genomeEncoded: championData.genome,  // WRONG parameter name!
  sensors: [],
  actions: []
})
console.log(`   Genome loaded: ${testWrong.genome.encoded.substring(0, 50)}...`)
console.log(`   Genome size: ${testWrong.genome.encoded.length} chars`)
console.log(`   Bases count: ${testWrong.genome.bases.length}`)

// Test 2: Create Individual with CORRECT parameter name
console.log('\n🧪 TEST 2: Creating Individual with genome (CORRECT)')
const testCorrect = new Individual({
  genome: championData.genome,  // CORRECT parameter name!
  sensors: [],
  actions: []
})
console.log(`   Genome loaded: ${testCorrect.genome.encoded.substring(0, 50)}...`)
console.log(`   Genome size: ${testCorrect.genome.encoded.length} chars`)
console.log(`   Bases count: ${testCorrect.genome.bases.length}`)

// Test 3: Verify Genome.from() works
console.log('\n🧪 TEST 3: Direct Genome.from() test')
const directGenome = Genome.from(championData.genome)
console.log(`   Genome loaded: ${directGenome.encoded.substring(0, 50)}...`)
console.log(`   Genome size: ${directGenome.encoded.length} chars`)
console.log(`   Bases count: ${directGenome.bases.length}`)

// Test 4: Compare genomes
console.log('\n🧪 TEST 4: Comparison')
console.log(`   Wrong vs Correct match: ${testWrong.genome.encoded === testCorrect.genome.encoded}`)
console.log(`   Wrong vs Champion match: ${testWrong.genome.encoded === championData.genome}`)
console.log(`   Correct vs Champion match: ${testCorrect.genome.encoded === championData.genome}`)

console.log('\n' + '=' .repeat(60))
console.log('🎯 DIAGNOSIS COMPLETE!')

// Show the first few bases from each
console.log('\n📊 Base Comparison (first 5):')
console.log('\nWrong param (genomeEncoded):')
testWrong.genome.bases.slice(0, 5).forEach((base, i) => {
  console.log(`   ${i}: ${JSON.stringify(base)}`)
})

console.log('\nCorrect param (genome):')
testCorrect.genome.bases.slice(0, 5).forEach((base, i) => {
  console.log(`   ${i}: ${JSON.stringify(base)}`)
})
