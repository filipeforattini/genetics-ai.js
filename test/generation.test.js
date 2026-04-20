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

  describe('history / recordStats', () => {
    const buildPop = (fitnesses) => {
      const gen = new Generation({ size: fitnesses.length, individualClass: TestIndividual })
      for (const f of fitnesses) {
        const ind = new TestIndividual({ genome: Genome.random(10) })
        ind.fitness = f
        ind.dead = false
        gen.population.push(ind)
      }
      return gen
    }

    test('history is initialized empty', () => {
      expect(new Generation().history).toEqual([])
    })

    test('recordStats captures best/worst/mean/median/stdDev', () => {
      const gen = buildPop([10, 20, 30, 40, 50])
      const snap = gen.recordStats()
      expect(snap).toMatchObject({
        generation: 0,
        populationSize: 5,
        best: 50,
        worst: 10,
        mean: 30,
        median: 30
      })
      expect(snap.stdDev).toBeCloseTo(Math.sqrt(200), 2)
      expect(gen.history).toHaveLength(1)
    })

    test('recordStats returns null when no finite fitnesses exist', () => {
      const gen = buildPop([NaN, Infinity, -Infinity])
      expect(gen.recordStats()).toBeNull()
      expect(gen.history).toEqual([])
    })

    test('next() appends a snapshot and propagates history', () => {
      const gen = buildPop([1, 2, 3])
      const nextGen = gen.next()
      expect(gen.history).toHaveLength(1)
      expect(gen.history[0].generation).toBe(0)
      expect(nextGen.history).toBe(gen.history)
    })

    test('historyToCSV produces header + one row per snapshot', () => {
      const gen = buildPop([1, 5, 9])
      gen.recordStats()
      gen.recordStats()
      const csv = gen.historyToCSV()
      const lines = csv.split('\n')
      expect(lines[0]).toBe('generation,populationSize,best,worst,mean,median,stdDev,timestamp')
      expect(lines).toHaveLength(3)
    })
  })
})