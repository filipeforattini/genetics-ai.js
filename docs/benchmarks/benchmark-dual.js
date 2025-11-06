import { Genome, Individual, Generation } from './src/index.js'

console.log('🚀 Benchmark: Dual Interface (String API, Binary Internals)\n')

// Test 1: Genome creation from string
console.log('Test 1: Create genome from string')
const genomeStr = 'A0B1C2D3E4F5G6H7I8J9K0L1M2N3O4P5Q6R7S8T9U0V1'
console.time('  Create from string')
for (let i = 0; i < 10000; i++) {
  const g = Genome.from(genomeStr)
}
console.timeEnd('  Create from string')

// Test 2: Genome mutation (binary operations)
console.log('\nTest 2: Genome mutation')
const genome = Genome.from(genomeStr)
console.time('  10000 mutations')
for (let i = 0; i < 10000; i++) {
  genome.mutate(0.01)
}
console.timeEnd('  10000 mutations')

// Test 3: Individual creation and tick
console.log('\nTest 3: Individual operations')
const individual = new Individual({
  genome: genomeStr,
  sensors: Array(10).fill(null).map((_, i) => ({ 
    name: `s${i}`,
    tick: () => Math.random()
  })),
  actions: Array(5).fill(null).map((_, i) => ({ 
    name: `a${i}`,
    tick: () => {}
  }))
})

console.time('  10000 ticks')
for (let i = 0; i < 10000; i++) {
  individual.tick()
}
console.timeEnd('  10000 ticks')

// Test 4: Export in both formats
console.log('\nTest 4: Export formats')
console.time('  Export string')
for (let i = 0; i < 10000; i++) {
  const str = individual.exportGenome()
}
console.timeEnd('  Export string')

console.time('  Export binary')
for (let i = 0; i < 10000; i++) {
  const bin = individual.exportGenomeBinary()
}
console.timeEnd('  Export binary')

// Test 5: Generation with evolution
console.log('\nTest 5: Generation evolution')
const generation = Generation.from({
  size: 100,
  individualGenomeSize: 50,
  individualNeurons: 20,
  individualArgs: {
    sensors: Array(5).fill(null).map((_, i) => ({ name: `s${i}` })),
    actions: Array(3).fill(null).map((_, i) => ({ name: `a${i}` }))
  }
})
generation.fillRandom()

console.time('  100 ticks')
for (let i = 0; i < 100; i++) {
  generation.tick()
}
console.timeEnd('  100 ticks')

console.time('  Evolution (next generation)')
const nextGen = generation.next()
console.timeEnd('  Evolution (next generation)')

// Test 6: Binary vs String size comparison
console.log('\nTest 6: Size comparison')
const testGenome = Genome.randomWith(100, {
  neurons: 50,
  sensors: 20,
  actions: 10,
  attributes: 10
})
const stringSize = testGenome.encoded.length
const binarySize = testGenome.toBinary().length
console.log(`  String size: ${stringSize} bytes`)
console.log(`  Binary size: ${binarySize} bytes`)
console.log(`  Compression ratio: ${(stringSize / binarySize).toFixed(2)}x`)

console.log('\n✅ Benchmark complete!')
console.log('The system now uses binary internally for performance')
console.log('while maintaining a string API for developer convenience.')