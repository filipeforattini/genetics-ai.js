import { Brain } from '../src/brain.class.js'
import { Genome } from '../src/genome.class.js'
import { Vertex } from '../src/vertex.class.js'

describe('DAG Validation', () => {
  // Helper to create a simple brain with manually constructed graph
  function createBrainWithGraph() {
    // Create vertices manually
    const sensor0 = new Vertex('s#0', { type: 'sensor', id: 0 })
    const neuron0 = new Vertex('n#0', { type: 'neuron', id: 0 })
    const neuron1 = new Vertex('n#1', { type: 'neuron', id: 1 })
    const action0 = new Vertex('a#0', { type: 'action', id: 0 })

    // Create a minimal brain
    const brain = new Brain({
      genome: new Genome(),
      sensors: [{ id: 0, tick: () => 1 }],
      actions: [{ id: 0, tick: () => {} }],
    })

    // Replace definitions with our manual vertices
    brain.definitions = {
      all: { 's#0': sensor0, 'n#0': neuron0, 'n#1': neuron1, 'a#0': action0 },
      sensors: { 0: sensor0 },
      neurons: { 0: neuron0, 1: neuron1 },
      actions: { 0: action0 },
    }

    return { brain, sensor0, neuron0, neuron1, action0 }
  }

  describe('validateDAG()', () => {
    it('should return isDAG=true for a simple feed-forward network', () => {
      const { brain, sensor0, neuron0, neuron1, action0 } = createBrainWithGraph()

      // Create feed-forward connections: s0 -> n0 -> n1 -> a0
      sensor0.addOut(neuron0, 8)
      neuron0.addIn(sensor0, 8)

      neuron0.addOut(neuron1, 8)
      neuron1.addIn(neuron0, 8)

      neuron1.addOut(action0, 8)
      action0.addIn(neuron1, 8)

      const validation = brain.validateDAG()
      expect(validation.isDAG).toBe(true)
      expect(validation.cycles).toHaveLength(0)
    })

    it('should detect a simple cycle between two neurons', () => {
      const { brain, sensor0, neuron0, neuron1, action0 } = createBrainWithGraph()

      // Create feed-forward: s0 -> n0 -> n1 -> a0
      sensor0.addOut(neuron0, 8)
      neuron0.addIn(sensor0, 8)

      neuron0.addOut(neuron1, 8)
      neuron1.addIn(neuron0, 8)

      neuron1.addOut(action0, 8)
      action0.addIn(neuron1, 8)

      // Add back edge to create cycle: n1 -> n0
      neuron1.addOut(neuron0, 5)
      neuron0.addIn(neuron1, 5)

      const validation = brain.validateDAG()
      expect(validation.isDAG).toBe(false)
      expect(validation.cycles.length).toBeGreaterThan(0)
    })

    it('should detect self-loop', () => {
      const { brain, sensor0, neuron0, action0 } = createBrainWithGraph()

      // Create feed-forward: s0 -> n0 -> a0
      sensor0.addOut(neuron0, 8)
      neuron0.addIn(sensor0, 8)

      neuron0.addOut(action0, 8)
      action0.addIn(neuron0, 8)

      // Add self-loop on n0
      neuron0.addOut(neuron0, 5)
      neuron0.addIn(neuron0, 5)

      const validation = brain.validateDAG()
      expect(validation.isDAG).toBe(false)
    })
  })

  describe('fixCycles()', () => {
    it('should remove cyclic connections and return count', () => {
      const { brain, sensor0, neuron0, neuron1, action0 } = createBrainWithGraph()

      // Create feed-forward with cycle
      sensor0.addOut(neuron0, 8)
      neuron0.addIn(sensor0, 8)

      neuron0.addOut(neuron1, 8)
      neuron1.addIn(neuron0, 8)

      neuron1.addOut(action0, 8)
      action0.addIn(neuron1, 8)

      // Add cycle: n1 -> n0
      neuron1.addOut(neuron0, 5)
      neuron0.addIn(neuron1, 5)

      // Verify cycle exists
      let validation = brain.validateDAG()
      expect(validation.isDAG).toBe(false)

      // Fix cycles
      const fixed = brain.fixCycles()
      expect(fixed).toBeGreaterThan(0)

      // Verify cycle is gone
      validation = brain.validateDAG()
      expect(validation.isDAG).toBe(true)
    })

    it('should handle multiple cycles', () => {
      const { brain, sensor0, neuron0, neuron1, action0 } = createBrainWithGraph()

      // Add neuron2
      const neuron2 = new Vertex('n#2', { type: 'neuron', id: 2 })
      brain.definitions.all['n#2'] = neuron2
      brain.definitions.neurons[2] = neuron2

      // Create feed-forward: s0 -> n0 -> n1 -> n2 -> a0
      sensor0.addOut(neuron0, 8)
      neuron0.addIn(sensor0, 8)

      neuron0.addOut(neuron1, 8)
      neuron1.addIn(neuron0, 8)

      neuron1.addOut(neuron2, 8)
      neuron2.addIn(neuron1, 8)

      neuron2.addOut(action0, 8)
      action0.addIn(neuron2, 8)

      // Add cycles: n1 -> n0 and n2 -> n1
      neuron1.addOut(neuron0, 5)
      neuron0.addIn(neuron1, 5)

      neuron2.addOut(neuron1, 5)
      neuron1.addIn(neuron2, 5)

      // Fix all cycles
      const fixed = brain.fixCycles()
      expect(fixed).toBeGreaterThanOrEqual(1)  // At least one cycle fixed

      // Verify all cycles are gone
      const validation = brain.validateDAG()
      expect(validation.isDAG).toBe(true)
    })

    it('should not modify a valid DAG', () => {
      const { brain, sensor0, neuron0, action0 } = createBrainWithGraph()

      // Create simple feed-forward: s0 -> n0 -> a0
      sensor0.addOut(neuron0, 8)
      neuron0.addIn(sensor0, 8)

      neuron0.addOut(action0, 8)
      action0.addIn(neuron0, 8)

      const fixed = brain.fixCycles()
      expect(fixed).toBe(0)

      const validation = brain.validateDAG()
      expect(validation.isDAG).toBe(true)
    })
  })

  describe('Integration with setup()', () => {
    it('should auto-fix cycles during Brain construction', () => {
      // Create a brain with random genome
      const genome = Genome.randomWith(5, { sensors: 2, neurons: 3, actions: 2 })

      const brain = new Brain({
        genome,
        sensors: [{ id: 0, tick: () => 1 }, { id: 1, tick: () => 2 }],
        actions: [{ id: 0, tick: () => {} }, { id: 1, tick: () => {} }],
      })

      // Brain should always be a valid DAG after construction
      const validation = brain.validateDAG()
      expect(validation.isDAG).toBe(true)
    })

    it('should still work after fixing cycles', () => {
      const genome = Genome.randomWith(5, { sensors: 2, neurons: 3, actions: 2 })

      const brain = new Brain({
        genome,
        sensors: [{ id: 0, tick: () => 5 }, { id: 1, tick: () => 3 }],
        actions: [{ id: 0, tick: (input) => input }, { id: 1, tick: (input) => input }],
      })

      // Brain should still function correctly
      const result = brain.tick()
      expect(typeof result).toBe('object')
    })
  })
})
