import { describe, it, expect, beforeEach, jest } from '@jest/globals'
import { PolicyGradientIndividual } from '../src/rl/policy-gradient-individual.class.js'

describe('PolicyGradientIndividual', () => {
  let individual

  beforeEach(() => {
    individual = new PolicyGradientIndividual({
      sensors: [
        { tick: () => 0 },
        { tick: () => 1 }
      ],
      actions: [
        { tick: (v) => v },
        { tick: (v) => v },
        { tick: (v) => v }
      ],
      rlConfig: {
        learningRate: 0.01,
        discountFactor: 0.99,
        baselineAlpha: 0.01,
        entropyCoeff: 0.01,
        useBaseline: true
      }
    })
  })

  describe('constructor', () => {
    it('should initialize with correct parameters', () => {
      expect(individual.learningRate).toBe(0.01)
      expect(individual.discountFactor).toBe(0.99)
      expect(individual.baselineAlpha).toBe(0.01)
      expect(individual.entropyCoeff).toBe(0.01)
      expect(individual.useBaseline).toBe(true)
    })

    it('should use default parameters when not provided', () => {
      const defaultIndividual = new PolicyGradientIndividual({})
      expect(defaultIndividual.learningRate).toBe(0.01)
      expect(defaultIndividual.discountFactor).toBe(0.99)
      expect(defaultIndividual.useBaseline).toBe(true)
    })

    it('should initialize episode buffers', () => {
      expect(individual.states).toEqual([])
      expect(individual.actions).toEqual([])
      expect(individual.rewards).toEqual([])
      expect(individual.logProbs).toEqual([])
    })

    it('should initialize baseline and statistics', () => {
      expect(individual.baseline).toBe(0)
      expect(individual.episodeCount).toBe(0)
      expect(individual.totalReward).toBe(0)
      expect(individual.avgReward).toBe(0)
    })
  })

  describe('getActionProbabilities', () => {
    it('should return uniform probabilities for new state', () => {
      const probs = individual.getActionProbabilities('newState')

      expect(probs.length).toBe(3) // 3 actions
      probs.forEach(p => {
        expect(p).toBeCloseTo(1/3, 5)
      })
    })

    it('should return softmax of parameters', () => {
      const state = 'testState'
      individual.policyParams.set(state, [2, 1, 0])

      const probs = individual.getActionProbabilities(state)

      expect(probs.length).toBe(3)
      expect(probs[0]).toBeGreaterThan(probs[1])
      expect(probs[1]).toBeGreaterThan(probs[2])
      expect(Math.abs(probs.reduce((a, b) => a + b) - 1)).toBeLessThan(0.001)
    })

    it('should handle array states', () => {
      const state = [1, 0, 1]
      individual.policyParams.set(JSON.stringify(state), [1, 2, 3])

      const probs = individual.getActionProbabilities(state)

      expect(probs.length).toBe(3)
      expect(probs[2]).toBeGreaterThan(probs[0])
    })
  })

  describe('sampleAction', () => {
    beforeEach(() => {
      // Set up biased probabilities
      individual.policyParams.set('test', [10, 0, 0])
    })

    it('should sample according to probabilities', () => {
      const actions = []
      for (let i = 0; i < 100; i++) {
        actions.push(individual.sampleAction('test'))
      }

      // Action 0 should be chosen most often
      const action0Count = actions.filter(a => a === 0).length
      expect(action0Count).toBeGreaterThan(90)
    })

    it('should respect available actions', () => {
      const actions = []
      for (let i = 0; i < 100; i++) {
        actions.push(individual.sampleAction('test', [1, 2])) // Exclude best action 0
      }

      // Should never choose action 0
      expect(actions.includes(0)).toBe(false)
      expect(actions.includes(1)).toBe(true)
      expect(actions.includes(2)).toBe(true)
    })

    it('should handle edge case of no available actions', () => {
      const action = individual.sampleAction('test', [])
      expect(action).toBe(2) // Falls back to last action
    })
  })

  describe('storeTransition', () => {
    it('should store experience', () => {
      individual.storeTransition([1, 0], 1, 10)

      expect(individual.states).toEqual([[1, 0]])
      expect(individual.actions).toEqual([1])
      expect(individual.rewards).toEqual([10])
      expect(individual.logProbs.length).toBe(1)
      expect(individual.totalReward).toBe(10)
    })

    it('should calculate log probability if not provided', () => {
      individual.storeTransition('state', 0, 5)

      expect(individual.logProbs[0]).toBeLessThan(0) // Log prob should be negative
    })

    it('should use provided log probability', () => {
      individual.storeTransition('state', 0, 5, -2.5)

      expect(individual.logProbs[0]).toBe(-2.5)
    })
  })

  describe('_calculateReturns', () => {
    it('should calculate discounted returns correctly', () => {
      individual.rewards = [1, 2, 3]
      individual.discountFactor = 0.9

      const returns = individual._calculateReturns()

      // Return[2] = 3
      // Return[1] = 2 + 0.9 * 3 = 4.7
      // Return[0] = 1 + 0.9 * 4.7 = 5.23
      expect(returns[2]).toBeCloseTo(3)
      expect(returns[1]).toBeCloseTo(4.7)
      expect(returns[0]).toBeCloseTo(5.23)
    })

    it('should handle single reward', () => {
      individual.rewards = [100]

      const returns = individual._calculateReturns()

      expect(returns).toEqual([100])
    })

    it('should handle empty rewards', () => {
      individual.rewards = []

      const returns = individual._calculateReturns()

      expect(returns).toEqual([])
    })
  })

  describe('updatePolicy', () => {
    beforeEach(() => {
      // Set up an episode
      individual.states = ['s1', 's2', 's3']
      individual.actions = [0, 1, 0]
      individual.rewards = [1, 2, 10]
      individual.logProbs = [-1, -1, -1]
    })

    it('should update policy parameters', () => {
      const state = 's1'
      individual.policyParams.set(state, [0, 0, 0])

      individual.updatePolicy()

      const params = individual.policyParams.get(state)
      expect(params[0]).not.toBe(0) // Should be updated
    })

    it('should update baseline when enabled', () => {
      individual.baseline = 5
      individual.updatePolicy()

      expect(individual.baseline).not.toBe(5)
    })

    it('should not update baseline when disabled', () => {
      individual.useBaseline = false
      individual.baseline = 5

      individual.updatePolicy()

      expect(individual.baseline).toBe(5)
    })

    it('should update statistics', () => {
      individual.updatePolicy()

      expect(individual.episodeCount).toBe(1)
      expect(individual.avgReward).toBeGreaterThan(0)
    })

    it('should clear episode buffers', () => {
      individual.updatePolicy()

      expect(individual.states).toEqual([])
      expect(individual.actions).toEqual([])
      expect(individual.rewards).toEqual([])
      expect(individual.logProbs).toEqual([])
    })

    it('should not update when learning disabled', () => {
      individual.learningEnabled = false
      const state = 's1'
      individual.policyParams.set(state, [0, 0, 0])

      individual.updatePolicy()

      const params = individual.policyParams.get(state)
      expect(params).toEqual([0, 0, 0])
    })

    it('should handle empty episode', () => {
      individual.states = []
      individual.actions = []
      individual.rewards = []

      expect(() => individual.updatePolicy()).not.toThrow()
    })
  })

  describe('_softmax', () => {
    it('should compute softmax correctly', () => {
      const values = [1, 2, 3]
      const probs = individual._softmax(values)

      expect(probs.length).toBe(3)
      expect(Math.abs(probs.reduce((a, b) => a + b) - 1)).toBeLessThan(0.001)
      expect(probs[2]).toBeGreaterThan(probs[1])
      expect(probs[1]).toBeGreaterThan(probs[0])
    })

    it('should handle numerical stability', () => {
      const values = [1000, 1001, 1002]
      const probs = individual._softmax(values)

      expect(probs.every(p => !isNaN(p))).toBe(true)
      expect(probs.every(p => p >= 0 && p <= 1)).toBe(true)
    })

    it('should handle uniform values', () => {
      const values = [5, 5, 5]
      const probs = individual._softmax(values)

      probs.forEach(p => {
        expect(p).toBeCloseTo(1/3)
      })
    })
  })

  describe('calculateEntropy', () => {
    it('should calculate entropy correctly', () => {
      const state = 'uniform'
      individual.policyParams.set(state, [0, 0, 0])

      const entropy = individual.calculateEntropy(state)

      // Maximum entropy for 3 actions
      expect(entropy).toBeCloseTo(Math.log(3), 2)
    })

    it('should return low entropy for deterministic policy', () => {
      const state = 'deterministic'
      individual.policyParams.set(state, [100, 0, 0])

      const entropy = individual.calculateEntropy(state)

      expect(entropy).toBeLessThan(0.1)
    })
  })

  describe('clearEpisode', () => {
    it('should clear all episode data', () => {
      individual.states = [1, 2, 3]
      individual.actions = [0, 1, 2]
      individual.rewards = [10, 20, 30]
      individual.logProbs = [-1, -2, -3]

      individual.clearEpisode()

      expect(individual.states).toEqual([])
      expect(individual.actions).toEqual([])
      expect(individual.rewards).toEqual([])
      expect(individual.logProbs).toEqual([])
    })
  })

  describe('getStats', () => {
    it('should return correct statistics', () => {
      individual.episodeCount = 10
      individual.totalReward = 100
      individual.avgReward = 10
      individual.baseline = 5
      individual.rewards = [1, 2, 3]
      individual.policyParams.set('s1', [0, 0])
      individual.policyParams.set('s2', [1, 1])

      const stats = individual.getStats()

      expect(stats.episodeCount).toBe(10)
      expect(stats.totalReward).toBe(100)
      expect(stats.avgReward).toBe(10)
      expect(stats.baseline).toBe(5)
      expect(stats.policySize).toBe(2)
      expect(stats.episodeLength).toBe(3)
    })
  })

  describe('policy import/export', () => {
    it('should export policy', () => {
      individual.policyParams.set('s1', [1, 2, 3])
      individual.policyParams.set('s2', [4, 5, 6])
      individual.baseline = 10

      const exported = individual.exportPolicy()

      expect(exported.policy['s1']).toEqual([1, 2, 3])
      expect(exported.policy['s2']).toEqual([4, 5, 6])
      expect(exported.baseline).toBe(10)
      expect(exported.stats).toBeDefined()
    })

    it('should import policy', () => {
      const data = {
        policy: {
          's1': [1, 2, 3],
          's2': [4, 5, 6]
        },
        baseline: 15
      }

      individual.importPolicy(data)

      expect(individual.policyParams.get('s1')).toEqual([1, 2, 3])
      expect(individual.policyParams.get('s2')).toEqual([4, 5, 6])
      expect(individual.baseline).toBe(15)
    })

    it('should clear existing policy before import', () => {
      individual.policyParams.set('old', [99, 99])

      individual.importPolicy({
        policy: { 'new': [1, 2] }
      })

      expect(individual.policyParams.has('old')).toBe(false)
      expect(individual.policyParams.get('new')).toEqual([1, 2])
    })
  })

  describe('learning mode', () => {
    it('should enable/disable learning', () => {
      individual.setLearning(false)
      expect(individual.learningEnabled).toBe(false)

      individual.setLearning(true)
      expect(individual.learningEnabled).toBe(true)
    })
  })

  describe('integration with brain', () => {
    it('should get current state from sensors', () => {
      // Mock brain vertices
      if (individual.brain && Array.isArray(individual.brain.vertices)) {
        individual.brain.vertices
          .filter(v => v.type === 'sensor')
          .forEach((s, i) => {
            s.fn = () => i * 10
          })

        const state = individual._getCurrentState()
        expect(state).toEqual([0, 10])
      } else {
        // Test fallback behavior
        const state = individual._getCurrentState()
        expect(state).toEqual([])
      }
    })

    it('should get number of actions', () => {
      const numActions = individual._getNumActions()
      expect(numActions).toBe(3) // 3 actions defined in beforeEach
    })

    it('should get available actions', () => {
      const actions = individual._getAvailableActions()
      expect(actions).toEqual([0, 1, 2])
    })
  })

  describe('edge cases', () => {
    it('should handle undefined rlConfig', () => {
      const ind = new PolicyGradientIndividual({ rlConfig: undefined })
      expect(ind.learningRate).toBe(0.01)
    })

    it('should handle no brain', () => {
      const ind = new PolicyGradientIndividual({})
      expect(ind._getNumActions()).toBe(3) // Default to 3 actions
    })

    it('should handle state key conversion', () => {
      expect(individual._getStateKey('string')).toBe('string')
      expect(individual._getStateKey(42)).toBe('42')
      expect(individual._getStateKey([1, 2])).toBe('[1,2]')
    })

    it('should handle entropy calculation with zero probabilities', () => {
      const state = 'test'
      individual.policyParams.set(state, [-1000, 1000, 0])

      const entropy = individual.calculateEntropy(state)

      expect(isNaN(entropy)).toBe(false)
      expect(entropy).toBeGreaterThanOrEqual(0)
    })

    it('should sample from distribution edge cases', () => {
      // All zero probabilities should return last index
      const action = individual._sampleFromDistribution([0, 0, 0])
      expect(action).toBe(2)
    })
  })
})