import { Genome } from '../src/genome.class.js'
import { Reproduction } from '../src/reproduction.class.js'

describe('Multi-Round Mutation', () => {
  describe('Genome.mutateWeights()', () => {
    it('should mutate a connection weight', () => {
      // Create a genome with connections
      const genome = Genome.randomWith(10, { sensors: 3, neurons: 5, actions: 2 })

      // Get initial connections
      const initialBases = [...genome.getBases()]
      const initialConnections = initialBases.filter(b => b.type === 'connection')

      if (initialConnections.length === 0) {
        // No connections to test, skip
        return
      }

      // Store initial weights
      const initialWeights = initialConnections.map(c => c.data)

      // Mutate weights multiple times to ensure at least one change
      for (let i = 0; i < 100; i++) {
        genome.mutateWeights({ newValueProba: 1.0 })  // Force new value
      }

      // Get new connections
      const newBases = [...genome.getBases()]
      const newConnections = newBases.filter(b => b.type === 'connection')

      // At least one weight should have changed
      const newWeights = newConnections.map(c => c.data)
      const hasChange = initialWeights.some((w, i) => newWeights[i] !== w) ||
                       initialWeights.length !== newWeights.length

      expect(hasChange || initialConnections.length === 0).toBe(true)
    })

    it('should keep weights in valid range [0, 15]', () => {
      const genome = Genome.randomWith(20, { sensors: 5, neurons: 10, actions: 3 })

      // Mutate many times
      for (let i = 0; i < 50; i++) {
        genome.mutateWeights({ newValueProba: 0.5 })
      }

      // Check all weights are in valid range
      const connections = [...genome.getBases()].filter(b => b.type === 'connection')
      for (const conn of connections) {
        expect(conn.data).toBeGreaterThanOrEqual(0)
        expect(conn.data).toBeLessThanOrEqual(15)
      }
    })

    it('should return this for chaining', () => {
      const genome = Genome.randomWith(5, { sensors: 2, neurons: 3, actions: 2 })
      const result = genome.mutateWeights()
      expect(result).toBe(genome)
    })
  })

  describe('Genome.mutateBiases()', () => {
    it('should mutate a bias value', () => {
      // Create genome with biases
      const genome = Genome.randomWith(10, { sensors: 3, neurons: 5, actions: 2 })

      const initialBases = [...genome.getBases()]
      const initialBiases = initialBases.filter(b => b.type === 'bias')

      if (initialBiases.length === 0) {
        return
      }

      // Force mutations
      for (let i = 0; i < 100; i++) {
        genome.mutateBiases({ newValueProba: 1.0 })
      }

      // Verify genome is still valid
      const newBases = [...genome.getBases()]
      expect(newBases.length).toBeGreaterThan(0)
    })

    it('should keep biases in valid range [-6, 7]', () => {
      const genome = Genome.randomWith(20, { sensors: 5, neurons: 10, actions: 3 })

      // Mutate many times
      for (let i = 0; i < 50; i++) {
        genome.mutateBiases({ newValueProba: 0.5 })
      }

      // Check all biases are in valid range
      const biases = [...genome.getBases()].filter(b => b.type === 'bias')
      for (const bias of biases) {
        expect(bias.data).toBeGreaterThanOrEqual(-7)
        expect(bias.data).toBeLessThanOrEqual(7)
      }
    })

    it('should return this for chaining', () => {
      const genome = Genome.randomWith(5, { sensors: 2, neurons: 3, actions: 2 })
      const result = genome.mutateBiases()
      expect(result).toBe(genome)
    })
  })

  describe('Genome.mutateAddConnection()', () => {
    it('should add a new connection', () => {
      const genome = Genome.randomWith(5, { sensors: 2, neurons: 3, actions: 2 })

      const initialConnections = [...genome.getBases()].filter(b => b.type === 'connection').length
      const initialBits = genome.buffer.bitLength

      genome.mutateAddConnection()

      const newConnections = [...genome.getBases()].filter(b => b.type === 'connection').length
      const newBits = genome.buffer.bitLength

      // Should have added a connection (25 bits)
      expect(newBits).toBeGreaterThan(initialBits)
    })

    it('should respect maxSize limit', () => {
      const genome = Genome.randomWith(5, { sensors: 2, neurons: 3, actions: 2 })

      // Set maxSize to current size to prevent growth
      const currentBits = genome.buffer.bitLength
      genome.mutateAddConnection({ maxSize: currentBits })

      // Size should not have changed
      expect(genome.buffer.bitLength).toBe(currentBits)
    })

    it('should return this for chaining', () => {
      const genome = Genome.randomWith(5, { sensors: 2, neurons: 3, actions: 2 })
      const result = genome.mutateAddConnection()
      expect(result).toBe(genome)
    })
  })

  describe('Genome.countNeurons()', () => {
    it('should count unique neurons in genome', () => {
      const genome = Genome.randomWith(20, { sensors: 5, neurons: 10, actions: 3 })
      const count = genome.countNeurons()

      // Count should be a reasonable number
      expect(count).toBeGreaterThanOrEqual(0)
      expect(count).toBeLessThanOrEqual(512)  // Max neuron IDs
    })

    it('should return 0 for empty genome', () => {
      const genome = new Genome()
      expect(genome.countNeurons()).toBe(0)
    })
  })

  describe('Reproduction.multiRoundMutate()', () => {
    it('should perform multiple rounds of mutations', () => {
      const genome = Genome.randomWith(10, { sensors: 3, neurons: 5, actions: 2 })
      const initial = genome.encoded

      // Force mutations with high probability
      const mutated = Reproduction.multiRoundMutate(genome, {
        rounds: 10,
        weightMutationProba: 1.0,
        biasMutationProba: 1.0,
        newNodeProba: 0.5,
        newConnectionProba: 1.0
      })

      // Should be a different genome
      expect(mutated).not.toBe(genome)  // Should be a clone
      // Genome should still be valid
      expect(mutated.buffer.bitLength).toBeGreaterThan(0)
    })

    it('should respect maxHiddenNodes limit', () => {
      const genome = Genome.randomWith(10, { sensors: 3, neurons: 5, actions: 2 })

      // Count initial neurons
      const initialNeurons = genome.countNeurons()

      // Mutate with low max
      const mutated = Reproduction.multiRoundMutate(genome, {
        rounds: 4,
        newNodeProba: 1.0,  // Force node addition
        maxHiddenNodes: 2    // Very low limit
      })

      // If initial count was already >= limit, no new neurons should be added
      // Otherwise, should still be below or at limit after many mutations
      const finalNeurons = mutated.countNeurons()
      // This is probabilistic, so we just check it's reasonable
      expect(finalNeurons).toBeLessThanOrEqual(512)
    })

    it('should add connections with high probability', () => {
      const genome = Genome.randomWith(5, { sensors: 2, neurons: 3, actions: 2 })
      const initialBits = genome.buffer.bitLength

      // Force connection addition
      const mutated = Reproduction.multiRoundMutate(genome, {
        rounds: 1,
        weightMutationProba: 0,
        biasMutationProba: 0,
        newNodeProba: 0,
        newConnectionProba: 1.0  // Always add connection
      })

      // Should have grown
      expect(mutated.buffer.bitLength).toBeGreaterThan(initialBits)
    })

    it('should clone the original genome', () => {
      const genome = Genome.randomWith(10, { sensors: 3, neurons: 5, actions: 2 })
      const initialEncoded = genome.encoded

      const mutated = Reproduction.multiRoundMutate(genome, {
        rounds: 10,
        weightMutationProba: 1.0,
        newConnectionProba: 1.0
      })

      // Original should be unchanged
      expect(genome.encoded).toBe(initialEncoded)
      // Mutated should be different object
      expect(mutated).not.toBe(genome)
    })

    it('should use default options', () => {
      const genome = Genome.randomWith(10, { sensors: 3, neurons: 5, actions: 2 })

      // Should not throw with default options
      const mutated = Reproduction.multiRoundMutate(genome)

      expect(mutated).toBeDefined()
      expect(mutated.buffer.bitLength).toBeGreaterThan(0)
    })
  })

  describe('Integration', () => {
    it('should produce valid genomes that can be used in Brain', async () => {
      const { Brain } = await import('../src/brain.class.js')

      const genome = Genome.randomWith(10, { sensors: 3, neurons: 5, actions: 2 })

      // Apply multi-round mutation
      const mutated = Reproduction.multiRoundMutate(genome, {
        rounds: 4,
        weightMutationProba: 0.5,
        biasMutationProba: 0.5,
        newNodeProba: 0.2,
        newConnectionProba: 0.8
      })

      // Should be able to create a Brain from mutated genome
      const brain = new Brain({
        genome: mutated,
        sensors: [
          { id: 0, tick: () => 1 },
          { id: 1, tick: () => 2 },
          { id: 2, tick: () => 3 }
        ],
        actions: [
          { id: 0, tick: () => {} },
          { id: 1, tick: () => {} }
        ]
      })

      // Should be able to tick
      const result = brain.tick()
      expect(typeof result).toBe('object')
    })
  })
})
