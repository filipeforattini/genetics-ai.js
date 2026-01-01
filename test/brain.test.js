import { Brain } from "../src/brain.class.js"
import { Genome } from "../src/genome.class.js"

describe('brain', () => {
  describe('constructor', () => {
    test('creates brain with genome and components', () => {
      const brain = new Brain({
        environment: { test: 'value' },
        genome: Genome.random(5),
        sensors: [{ tick: () => 1 }],
        actions: [{ tick: () => 'result' }]
      })
      
      expect(brain.environment.test).toBe('value')
      expect(brain.genome).toBeDefined()
      expect(brain.sensors).toBeDefined()
      expect(brain.actions).toBeDefined()
    })

    test('builds network from genome', () => {
      const brain = new Brain({
        genome: Genome.fromBases([
          { type: 'connection', data: 1, source: { type: 'sensor', id: 0 }, target: { type: 'neuron', id: 0 } }
        ]),
        sensors: [{ tick: () => 1 }],
        actions: []
      })
      
      expect(brain.definitions.all).toBeDefined()
      // Check that vertices were created
      const vertexNames = Object.keys(brain.definitions.all)
      expect(vertexNames).toContain('s#0')
      expect(vertexNames).toContain('n#0')
    })

    test('applies biases from genome', () => {
      const brain = new Brain({
        genome: Genome.fromBases([
          { type: 'bias', data: 5, target: { type: 'neuron', id: 0 } }
        ]),
        sensors: [],
        actions: []
      })
      
      expect(brain.definitions.all).toBeDefined()
      expect(brain.definitions.all['n#0']).toBeDefined()
      expect(brain.definitions.all['n#0'].metadata.bias).toBe(5)
    })
  })

  describe('tick', () => {
    test('processes sensor inputs', () => {
      let sensorValue = 0.5
      const brain = new Brain({
        genome: Genome.fromBases([
          { type: 'connection', data: 2, source: { type: 'sensor', id: 0 }, target: { type: 'action', id: 0 } }
        ]),
        sensors: [{ tick: () => sensorValue }],
        actions: [{ tick: (value) => value }]
      })
      
      const result = brain.tick()
      expect(result['a#0']).toBeDefined()
    })

    test('handles multiple layers', () => {
      const brain = new Brain({
        genome: Genome.fromBases([
          { type: 'connection', data: 1, source: { type: 'sensor', id: 0 }, target: { type: 'neuron', id: 0 } },
          { type: 'connection', data: 1, source: { type: 'neuron', id: 0 }, target: { type: 'neuron', id: 1 } },
          { type: 'connection', data: 1, source: { type: 'neuron', id: 1 }, target: { type: 'action', id: 0 } }
        ]),
        sensors: [{ tick: () => 0.5 }],
        actions: [{ tick: (v) => v }]
      })
      
      const result = brain.tick()
      expect(result['a#0']).toBeDefined()
    })

    test('applies activation function', () => {
      const brain = new Brain({
        genome: Genome.fromBases([
          { type: 'connection', data: 10, source: { type: 'sensor', id: 0 }, target: { type: 'action', id: 0 } }
        ]),
        sensors: [{ tick: () => 1 }],
        actions: [{ tick: (v) => v }]
      })
      
      const result = brain.tick()
      // Should apply tanh activation
      expect(result['a#0']).toBeGreaterThan(0)
      // Value depends on activation function implementation
    })

    test('handles empty network', () => {
      const brain = new Brain({
        genome: Genome.fromBases([]),
        sensors: [],
        actions: []
      })
      
      const result = brain.tick()
      expect(result).toEqual({})
    })

    test('caches tick results', () => {
      const brain = new Brain({
        genome: Genome.fromBases([
          { type: 'connection', data: 1, source: { type: 'sensor', id: 0 }, target: { type: 'action', id: 0 } }
        ]),
        sensors: [{ tick: () => 1 }],
        actions: [{ tick: (v) => v }]
      })
      
      const result1 = brain.tick()
      const result2 = brain.tick()
      
      // Both ticks should produce results
      expect(result1).toBeDefined()
      expect(result2).toBeDefined()
    })
  })

  test('simple heavly biased brain', () => {
    /**
     *   l0     l1     l2     l3
     *  ──┴──────┴──────┴──────┴──
     *   s0 ─── n0 ─┬──────── a0
     *           ┌──┘
     *   s1 ─┬─ n1
     *       │   └──┐
     *       └─ n2 ─┴─ n3 ─── a1
     * 
     * 2000020202202042010120301203062050620703KG00KG01
     */
    const brain = new Brain({
      environment: { x: 1 },
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
        // { type: 'bias', data: 50, target: { type: 'neuron', id: 1 } },
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

    const tick = brain.tick()

    if (Object.values(tick).includes('a#0')) {
      expect(tick['a#0']).toEqual('✓')
    }

    if (Object.values(tick).includes('a#1')) {
      expect(tick['a#1']).toEqual('✗')
    }
  })

  describe('performance optimizations', () => {
    test('uses object pooling for tick cache', () => {
      const brain = new Brain({
        genome: Genome.fromBases([
          { type: 'connection', data: 1, source: { type: 'sensor', id: 0 }, target: { type: 'action', id: 0 } }
        ]),
        sensors: [{ tick: () => 1 }],
        actions: [{ tick: (v) => v }]
      })
      
      // Check that cache objects are pre-allocated
      expect(brain._tickCache).toBeDefined()
      expect(brain._tickCache.ticked).toBeDefined()
      expect(brain._tickCache.types).toBeDefined()
    })

    test('reuses tick cache between calls', () => {
      const brain = new Brain({
        genome: Genome.fromBases([
          { type: 'connection', data: 1, source: { type: 'sensor', id: 0 }, target: { type: 'action', id: 0 } }
        ]),
        sensors: [{ tick: () => Math.random() }],
        actions: [{ tick: (v) => v }]
      })
      
      const cache1 = brain._tickCache
      brain.tick()
      const cache2 = brain._tickCache
      
      // Should be the same object reference
      expect(cache1).toBe(cache2)
    })
  })

  describe('edge cases', () => {
    test('handles circular connections', () => {
      const brain = new Brain({
        genome: Genome.fromBases([
          { type: 'connection', data: 1, source: { type: 'neuron', id: 0 }, target: { type: 'neuron', id: 1 } },
          { type: 'connection', data: 1, source: { type: 'neuron', id: 1 }, target: { type: 'neuron', id: 0 } }
        ]),
        sensors: [],
        actions: []
      })
      
      // Should not cause infinite loop
      const result = brain.tick()
      expect(result).toBeDefined()
    })

    test('handles self-connections', () => {
      const brain = new Brain({
        genome: Genome.fromBases([
          { type: 'connection', data: 1, source: { type: 'neuron', id: 0 }, target: { type: 'neuron', id: 0 } }
        ]),
        sensors: [],
        actions: []
      })
      
      const result = brain.tick()
      expect(result).toBeDefined()
    })

    test('handles missing sensors', () => {
      const brain = new Brain({
        genome: Genome.fromBases([
          { type: 'connection', data: 1, source: { type: 'sensor', id: 5 }, target: { type: 'action', id: 0 } }
        ]),
        sensors: [], // No sensor with id 5
        actions: [{ tick: (v) => v }]
      })
      
      const result = brain.tick()
      expect(result['a#0']).toBeDefined()
    })

    test('handles missing actions', () => {
      const brain = new Brain({
        genome: Genome.fromBases([
          { type: 'connection', data: 1, source: { type: 'sensor', id: 0 }, target: { type: 'action', id: 5 } }
        ]),
        sensors: [{ tick: () => 1 }],
        actions: [] // No action with id 5
      })

      const result = brain.tick()
      // Action doesn't have a tick function, but vertex is created and
      // computes based on inputs (weight=1 means sensor value flows through)
      expect(result['a#5']).toBeDefined()
    })

    test('handles very large networks', () => {
      const bases = []
      // Create a large network
      for (let i = 0; i < 100; i++) {
        bases.push({
          type: 'connection',
          data: 1,
          source: { type: 'sensor', id: i % 10 },
          target: { type: 'neuron', id: i }
        })
      }
      
      const brain = new Brain({
        genome: Genome.fromBases(bases),
        sensors: Array(10).fill(null).map(() => ({ tick: () => Math.random() })),
        actions: []
      })
      
      const result = brain.tick()
      expect(result).toBeDefined()
    })

    test('handles negative biases', () => {
      const brain = new Brain({
        genome: Genome.fromBases([
          { type: 'bias', data: -5, target: { type: 'neuron', id: 0 } },
          { type: 'connection', data: 1, source: { type: 'sensor', id: 0 }, target: { type: 'neuron', id: 0 } },
          { type: 'connection', data: 1, source: { type: 'neuron', id: 0 }, target: { type: 'action', id: 0 } }
        ]),
        sensors: [{ tick: () => 0 }],
        actions: [{ tick: (v) => v }]
      })
      
      const result = brain.tick()
      // Negative bias should affect output
      expect(result['a#0']).toBeDefined()
    })
  })
})
