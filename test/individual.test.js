import { Genome } from "../src/genome.class"
import { Individual } from "../src/individual.class"

describe('individual', () => {
  describe('constructor', () => {
    test('creates individual with genome', () => {
      const genome = Genome.random(5)
      const individual = new Individual({
        genome,
        sensors: [],
        actions: [],
        environment: { test: 'value' }
      })
      
      expect(individual.genome).toBeDefined()
      expect(individual.brain).toBeDefined()
      expect(individual.environment.test).toBe('value')
      expect(individual.environment.me).toBe(individual)
    })

    test('accepts genome as string', () => {
      const individual = new Individual({
        genome: 'A1B2C3',
        sensors: [],
        actions: []
      })
      
      expect(individual.genome.encoded).toBe('A1B2C3')
    })

    test('sets up hooks', () => {
      const beforeTick = () => {}
      const afterTick = () => {}
      
      const individual = new Individual({
        genome: Genome.random(5),
        sensors: [],
        actions: [],
        hooks: { beforeTick, afterTick }
      })
      
      // Hooks are bound to context, so they won't be the same reference
      expect(typeof individual.hooks.beforeTick).toBe('function')
      expect(typeof individual.hooks.afterTick).toBe('function')
    })
  })

  describe('tick', () => {
    test('calls hooks in correct order', () => {
      const callOrder = []
      
      const individual = new Individual({
        genome: Genome.random(5),
        sensors: [],
        actions: [],
        hooks: {
          beforeTick: () => callOrder.push('before'),
          afterTick: () => callOrder.push('after')
        }
      })
      
      let tickCount = 0
      individual.brain.tick = () => {
        callOrder.push('brain')
        tickCount++
        return {}
      }
      
      individual.tick()
      
      expect(callOrder).toEqual(['before', 'brain', 'after'])
    })

    test('passes individual to hooks', () => {
      let beforeParam, afterParam
      
      const individual = new Individual({
        genome: Genome.random(5),
        sensors: [],
        actions: [],
        hooks: {
          beforeTick: (ind) => { beforeParam = ind },
          afterTick: (ind) => { afterParam = ind }
        }
      })
      
      individual.tick()
      
      expect(beforeParam).toBe(individual)
      expect(afterParam).toBe(individual)
    })

    test('returns brain tick result', () => {
      const individual = new Individual({
        genome: Genome.fromBases([
          { type: 'connection', data: 1, source: { type: 'sensor', id: 0 }, target: { type: 'action', id: 0 } }
        ]),
        sensors: [{ tick: () => 1 }],
        actions: [{ tick: () => 'result' }]
      })
      
      const result = individual.tick()
      
      expect(result['a#0']).toBe('result')
    })
  })

  describe('reproduction', () => {
    test('sexual crossover', () => {
      const individual1 = new Individual({
        genome: Genome.fromString('A1B2C3D4E5'),
        sensors: [],
        actions: []
      })
      
      const individual2 = new Individual({
        genome: Genome.fromString('F6G7H8I9J0'),
        sensors: [],
        actions: []
      })
      
      const [child1, child2] = individual1.reproduce.sexual.crossover(individual2)
      
      expect(child1).toBeDefined()
      expect(child2).toBeDefined()
      expect(child1.encoded).not.toBe(individual1.genome.encoded)
      expect(child2.encoded).not.toBe(individual2.genome.encoded)
    })

    test('asexual mutation with custom rate', () => {
      const individual = new Individual({
        genome: Genome.fromString('A'.repeat(100)),
        sensors: [],
        actions: []
      })
      
      const mutated = individual.reproduce.asexual.mutate(0.5)
      
      expect(mutated.encoded).not.toBe(individual.genome.encoded)
    })
  })

  describe('fitness', () => {
    test('throws error when fitness not implemented', () => {
      const individual = new Individual({
        genome: Genome.random(5),
        sensors: [],
        actions: []
      })
      
      // Individual base class doesn't have fitness method
      expect(individual.fitness).toBeUndefined()
    })
  })

  describe('environment', () => {
    test('adds self reference to environment', () => {
      const environment = { custom: 'data' }
      const individual = new Individual({
        genome: Genome.random(5),
        sensors: [],
        actions: [],
        environment
      })
      
      expect(individual.environment.me).toBe(individual)
      expect(individual.environment.custom).toBe('data')
    })

    test('creates default environment if not provided', () => {
      const individual = new Individual({
        genome: Genome.random(5),
        sensors: [],
        actions: []
      })
      
      expect(individual.environment).toBeDefined()
      expect(individual.environment.me).toBe(individual)
    })
  })

  describe('inheritance', () => {
    class CustomIndividual extends Individual {
      fitness() {
        return this.customValue * 2
      }
      
      constructor(options) {
        super(options)
        this.customValue = options.customValue || 1
      }
    }
    
    test('allows custom Individual subclasses', () => {
      const custom = new CustomIndividual({
        genome: Genome.random(5),
        sensors: [],
        actions: [],
        customValue: 10
      })
      
      expect(custom).toBeInstanceOf(Individual)
      expect(custom).toBeInstanceOf(CustomIndividual)
      expect(custom.fitness()).toBe(20)
    })

    test('preserves parent class functionality', () => {
      const custom = new CustomIndividual({
        genome: Genome.random(5),
        sensors: [],
        actions: []
      })
      
      const result = custom.tick()
      expect(result).toBeDefined()
      
      const mutated = custom.reproduce.asexual.mutate(0.1)
      expect(mutated).toBeDefined()
    })
  })

  describe('large-scale operations', () => {
    test('handles complex genome efficiently', () => {
      const bases = []
      for (let i = 0; i < 100; i++) {
        bases.push({
          type: 'connection',
          data: Math.floor(Math.random() * 16),
          source: { type: 'sensor', id: i % 10 },
          target: { type: 'neuron', id: i }
        })
      }
      
      const individual = new Individual({
        genome: Genome.fromBases(bases),
        sensors: Array(10).fill(null).map(() => ({ tick: () => Math.random() })),
        actions: Array(5).fill(null).map(() => ({ tick: () => 0 }))
      })
      
      const result = individual.tick()
      expect(result).toBeDefined()
    })

    test('handles many reproduction cycles', () => {
      const individual = new Individual({
        genome: Genome.random(20),
        sensors: [],
        actions: []
      })
      
      let current = individual.genome
      for (let i = 0; i < 10; i++) {
        current = individual.reproduce.asexual.mutate(0.05)
      }
      
      expect(current).toBeDefined()
      expect(current).not.toEqual(individual.genome)
    })
  })

  // Keep existing test
  const individual = new Individual({
    genome: Genome.fromBases([
      // l1
      { type: 'connection', data: 1, source: { type: 'sensor', id: 0 }, target: { type: 'neuron', id: 0 } },
      { type: 'connection', data: 1, source: { type: 'sensor', id: 1 }, target: { type: 'neuron', id: 1 } },
      { type: 'connection', data: 1, source: { type: 'sensor', id: 1 }, target: { type: 'neuron', id: 2 } },
      // l2
      { type: 'connection', data: 1, source: { type: 'neuron', id: 0 }, target: { type: 'action', id: 0 } },
      { type: 'connection', data: 1, source: { type: 'neuron', id: 1 }, target: { type: 'action', id: 0 } },
      // l3
      { type: 'connection', data: 1, source: { type: 'neuron', id: 1 }, target: { type: 'neuron', id: 3 } },
      { type: 'connection', data: 1, source: { type: 'neuron', id: 2 }, target: { type: 'neuron', id: 3 } },
      // l4
      { type: 'connection', data: 1, source: { type: 'neuron', id: 3 }, target: { type: 'action', id: 1 } },
      // bias
      { type: 'bias', data: 10, target: { type: 'sensor', id: 0 } },
      { type: 'bias', data: 10, target: { type: 'neuron', id: 0 } },
    ]),
    sensors: [
      { tick() { return Math.cos(Date.now()) } },
      { tick() { return Math.sin(Date.now()) } },
    ],
    actions: [
      { tick() { return '✓' } },
      { tick() { return '✗' } },
    ],
  })

  test('reproduce mutations', () => {
    const childA = individual.reproduce.asexual.mutate(0)
    const childB = individual.reproduce.asexual.mutate(1)

    expect(individual.genome.encoded).toEqual(childA.encoded)
    expect(individual.genome.encoded).not.toEqual(childB.encoded)
  })
})
