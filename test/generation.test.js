import { Generation } from '../src/generation.class.js'
import { Individual } from '../src/individual.class.js'
import { Genome } from '../src/genome.class.js'

// Mock Individual class for testing
class TestIndividual extends Individual {
  constructor(options) {
    super(options)
    this.fitness = Math.random()
    this.dead = false
  }
}

describe('Generation', () => {
  describe('constructor', () => {
    test('creates generation with default options', () => {
      const gen = new Generation()
      expect(gen.size).toBe(1)
      expect(gen.population).toEqual([])
      expect(gen.individualClass).toBe(Individual)
    })

    test('creates generation with custom options', () => {
      const options = {
        size: 50,
        individualClass: TestIndividual,
        individualNeurons: 10,
        individualGenomeSize: 20,
        individualArgs: {
          sensors: [{ tick: () => 1 }],
          actions: [{ tick: () => 0 }]
        },
        hooks: {
          beforeTick: () => {},
          afterTick: () => {}
        }
      }
      
      const gen = new Generation(options)
      expect(gen.size).toBe(50)
      expect(gen.individualClass).toBe(TestIndividual)
      expect(gen.individualNeurons).toBe(10)
      expect(gen.individualGenomeSize).toBe(20)
      expect(gen.hooks.beforeTick).toBeDefined()
    })
  })

  describe('from', () => {
    test('creates generation using static from method', () => {
      const gen = Generation.from({ size: 10 })
      expect(gen).toBeInstanceOf(Generation)
      expect(gen.size).toBe(10)
    })
  })

  describe('add', () => {
    test('adds individual with genome to population', () => {
      const gen = new Generation({ individualClass: TestIndividual })
      const genome = Genome.random(10)
      
      gen.add(genome)
      expect(gen.population.length).toBe(1)
      expect(gen.population[0]).toBeInstanceOf(TestIndividual)
    })

    test('throws error when adding without genome', () => {
      const gen = new Generation()
      expect(() => gen.add()).toThrow('Genome is required')
    })
  })

  describe('fillRandom', () => {
    test('fills population with random individuals', () => {
      const gen = new Generation({
        size: 5,
        individualClass: TestIndividual,
        individualGenomeSize: 10,
        individualNeurons: 3,
        individualArgs: {
          sensors: [{ tick: () => 1 }],
          actions: [{ tick: () => 0 }]
        }
      })
      
      gen.fillRandom()
      expect(gen.population.length).toBe(5)
      expect(gen.meta.randoms).toBe(5)
    })

    test('fills remaining spots when population partially filled', () => {
      const gen = new Generation({
        size: 3,
        individualClass: TestIndividual,
        individualGenomeSize: 5
      })
      
      gen.add(Genome.random(5))
      gen.fillRandom()
      
      expect(gen.population.length).toBe(3)
      expect(gen.meta.randoms).toBe(2)
    })
  })

  describe('tick', () => {
    test('calls tick on all individuals', () => {
      const gen = new Generation({
        size: 3,
        individualClass: TestIndividual,
        individualGenomeSize: 5
      })
      
      gen.fillRandom()
      
      // Mock tick method
      const tickCalls = []
      gen.population.forEach((ind, i) => {
        ind.tick = () => {
          tickCalls.push(i)
          return { result: 'test' }
        }
      })
      
      gen.tick()
      
      // All individuals should have been ticked
      expect(tickCalls.length).toBe(gen.population.length)
    })

    test('calls beforeTick and afterTick hooks', () => {
      let beforeTickCalled = false
      let afterTickCalled = false
      const beforeTick = () => { beforeTickCalled = true }
      const afterTick = () => { afterTickCalled = true }
      
      const gen = new Generation({
        size: 2,
        individualClass: TestIndividual,
        individualGenomeSize: 5,
        hooks: { beforeTick, afterTick }
      })
      
      gen.fillRandom()
      gen.tick()
      
      expect(beforeTickCalled).toBe(true)
      expect(afterTickCalled).toBe(true)
    })
  })

  describe('next', () => {
    test('creates next generation with survivors', () => {
      const gen = new Generation({
        size: 4,
        individualClass: TestIndividual,
        individualGenomeSize: 5,
        individualNeurons: 2
      })
      
      gen.fillRandom()
      
      // Mark some as dead
      gen.population[0].dead = true
      gen.population[2].dead = true
      
      const nextGen = gen.next()
      
      expect(nextGen).toBeInstanceOf(Generation)
      expect(nextGen.size).toBe(4)
      expect(nextGen.meta.survivors).toBe(2)
      expect(gen.meta.survivalRate).toBe(0.5)
    })

    test('calls beforeNext and afterNext hooks', () => {
      let beforeNextCalled = false
      let afterNextCalled = false
      const beforeNext = () => { beforeNextCalled = true }
      const afterNext = () => { afterNextCalled = true }
      
      const gen = new Generation({
        size: 2,
        individualClass: TestIndividual,
        individualGenomeSize: 5,
        hooks: { beforeNext, afterNext }
      })
      
      gen.fillRandom()
      const nextGen = gen.next()
      
      expect(beforeNextCalled).toBe(true)
      expect(afterNextCalled).toBe(true)
    })

    test('handles reproduction correctly', () => {
      const gen = new Generation({
        size: 4,
        individualClass: TestIndividual,
        individualGenomeSize: 5
      })
      
      gen.fillRandom()
      
      const nextGen = gen.next()
      
      expect(nextGen.population.length).toBe(4)
      expect(nextGen.meta.offspring).toBeDefined()
      expect(nextGen.meta.randoms).toBeDefined()
    })

    test('cleans up old population', () => {
      const gen = new Generation({
        size: 2,
        individualClass: TestIndividual,
        individualGenomeSize: 5
      })
      
      gen.fillRandom()
      const originalPop = [...gen.population]
      
      gen.next()
      
      expect(gen.population.length).toBe(0)
    })
  })

  describe('export', () => {
    test('exports generation metadata', () => {
      const gen = new Generation({
        size: 5,
        individualClass: TestIndividual
      })
      
      gen.id = 'test-id'
      gen.meta.randoms = 5
      gen.meta.survivalRate = 0.8
      
      const exported = gen.export()
      
      expect(exported.id).toBe('test-id')
      expect(exported.randoms).toBe(5)
      expect(exported.survivalRate).toBe(0.8)
    })
  })
})