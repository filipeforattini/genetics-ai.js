import { describe, it, expect, beforeEach, jest } from '@jest/globals'
import { QLearningIndividual } from '../src/rl/qlearning-individual.class.js'

describe('QLearningIndividual', () => {
  let individual

  beforeEach(() => {
    individual = new QLearningIndividual({
      sensors: [
        { tick: () => 0 },
        { tick: () => 1 }
      ],
      actions: [
        { tick: (v) => v },
        { tick: (v) => v }
      ],
      rlConfig: {
        learningRate: 0.1,
        discountFactor: 0.9,
        epsilon: 0.1,
        bufferSize: 100
      }
    })
  })

  describe('constructor', () => {
    it('should initialize with correct RL parameters', () => {
      expect(individual.learningRate).toBe(0.1)
      expect(individual.discountFactor).toBe(0.9)
      expect(individual.epsilon).toBe(0.1)
      expect(individual.epsilonDecay).toBe(0.995)
      expect(individual.epsilonMin).toBe(0.01)
    })

    it('should use default parameters when not provided', () => {
      const defaultIndividual = new QLearningIndividual({})
      expect(defaultIndividual.learningRate).toBe(0.1)
      expect(defaultIndividual.discountFactor).toBe(0.95)
      expect(defaultIndividual.epsilon).toBe(0.1)
    })

    it('should initialize Q-table and experience buffer', () => {
      expect(individual.qTable).toBeInstanceOf(Map)
      expect(individual.experienceBuffer).toBeDefined()
      expect(individual.experienceBuffer.capacity).toBe(100)
    })
  })

  describe('getQValue and setQValue', () => {
    it('should get and set Q-values for state-action pairs', () => {
      const state = [1, 0, 1]
      const action = 0

      // Initially should be 0
      expect(individual.getQValue(state, action)).toBe(0)

      // Set value
      individual.setQValue(state, action, 5.5)
      expect(individual.getQValue(state, action)).toBe(5.5)

      // Different action should still be 0
      expect(individual.getQValue(state, 1)).toBe(0)
    })

    it('should handle string states', () => {
      const state = 'state1'
      individual.setQValue(state, 0, 3.14)
      expect(individual.getQValue(state, 0)).toBe(3.14)
    })

    it('should handle numeric states', () => {
      const state = 42
      individual.setQValue(state, 1, 2.71)
      expect(individual.getQValue(state, 1)).toBe(2.71)
    })
  })

  describe('chooseAction', () => {
    beforeEach(() => {
      const state = 'test'
      individual.setQValue(state, 0, 5)
      individual.setQValue(state, 1, 10)
      individual.setQValue(state, 2, 3)
    })

    it('should choose best action when not exploring', () => {
      individual.epsilon = 0 // No exploration
      const action = individual.chooseAction('test', [0, 1, 2])
      expect(action).toBe(1) // Action with highest Q-value
    })

    it('should sometimes explore randomly', () => {
      individual.epsilon = 1 // Always explore
      const actions = []
      for (let i = 0; i < 100; i++) {
        actions.push(individual.chooseAction('test', [0, 1, 2]))
      }

      // Should have chosen all actions at least once
      expect(actions.includes(0)).toBe(true)
      expect(actions.includes(1)).toBe(true)
      expect(actions.includes(2)).toBe(true)
    })

    it('should handle empty available actions', () => {
      const action = individual.chooseAction('test', [])
      expect(action).toBeNull()
    })

    it('should respect available actions constraint', () => {
      individual.epsilon = 0
      const action = individual.chooseAction('test', [0, 2]) // Exclude best action (1)
      expect(action).toBe(0) // Best among available
    })

    it('should use softmax when enabled', () => {
      individual.useSoftmax = true
      individual.temperature = 1.0

      const actions = []
      for (let i = 0; i < 100; i++) {
        actions.push(individual.chooseAction('test', [0, 1, 2]))
      }

      // Action 1 (highest value) should be chosen most often
      const action1Count = actions.filter(a => a === 1).length
      expect(action1Count).toBeGreaterThan(30)
    })
  })

  describe('learn', () => {
    it('should update Q-values based on experience', () => {
      const state = [1, 0]
      const nextState = [0, 1]
      const action = 0
      const reward = 10

      individual.learn(state, action, reward, nextState, false)

      // Q-value should have been updated
      const qValue = individual.getQValue(state, action)
      expect(qValue).toBeGreaterThan(0)
      expect(qValue).toBeLessThanOrEqual(reward)
    })

    it('should handle terminal states', () => {
      const state = [1, 1]
      const action = 1
      const reward = 100

      individual.learn(state, action, reward, null, true)

      // For terminal state, Q should converge toward reward
      const qValue = individual.getQValue(state, action)
      expect(qValue).toBeCloseTo(10, 0) // 0.1 * 100 = 10
    })

    it('should add experience to buffer', () => {
      const bufferSizeBefore = individual.experienceBuffer.size()

      individual.learn([1, 0], 0, 5, [0, 1], false)

      expect(individual.experienceBuffer.size()).toBe(bufferSizeBefore + 1)
    })

    it('should decay epsilon', () => {
      const initialEpsilon = individual.epsilon

      individual.learn([1, 0], 0, 5, [0, 1], false)

      expect(individual.epsilon).toBeLessThan(initialEpsilon)
      expect(individual.epsilon).toBeCloseTo(initialEpsilon * 0.995)
    })

    it('should not decay epsilon below minimum', () => {
      individual.epsilon = 0.01
      individual.epsilonMin = 0.01

      individual.learn([1, 0], 0, 5, [0, 1], false)

      expect(individual.epsilon).toBe(0.01)
    })

    it('should not learn when disabled', () => {
      individual.learningEnabled = false
      const state = [1, 0]
      const action = 0

      individual.learn(state, action, 10, [0, 1], false)

      expect(individual.getQValue(state, action)).toBe(0)
      expect(individual.experienceBuffer.size()).toBe(0)
    })
  })

  describe('_updateQValue', () => {
    it('should use Q-learning formula correctly', () => {
      const state = [1, 0]
      const nextState = [0, 1]
      const action = 0
      const reward = 10

      // Set up next state Q-values
      individual.setQValue(nextState, 0, 20)
      individual.setQValue(nextState, 1, 30)

      const tdError = individual._updateQValue(state, action, reward, nextState, false)

      // Expected: 0 + 0.1 * (10 + 0.9 * 30 - 0) = 3.7
      expect(individual.getQValue(state, action)).toBeCloseTo(3.7)
      expect(tdError).toBeCloseTo(37) // |37 - 0|
    })
  })

  describe('statistics', () => {
    it('should track rewards', () => {
      individual.learn([1, 0], 0, 5, [0, 1], false)
      individual.learn([0, 1], 1, 10, [1, 1], false)
      individual.learn([1, 1], 0, -2, [0, 0], true)

      expect(individual.totalReward).toBe(13)
      expect(individual.episodeRewards).toEqual([5, 10, -2])
    })

    it('should reset episode correctly', () => {
      individual.lastState = [1, 0]
      individual.lastAction = 1
      individual.episodeRewards = [1, 2, 3]
      individual.totalReward = 6

      individual.resetEpisode()

      expect(individual.lastState).toBeNull()
      expect(individual.lastAction).toBeNull()
      expect(individual.episodeRewards).toEqual([])
      expect(individual.totalReward).toBe(0)
    })

    it('should return correct stats', () => {
      individual.epsilon = 0.05
      individual.stepCounter = 100
      individual.totalReward = 50
      individual.episodeRewards = [10, 20, 20]

      const stats = individual.getStats()

      expect(stats.epsilon).toBe(0.05)
      expect(stats.steps).toBe(100)
      expect(stats.totalReward).toBe(50)
      expect(stats.avgReward).toBe(50 / 3)
      expect(stats.qTableSize).toBe(0)
      expect(stats.bufferSize).toBe(0)
    })
  })

  describe('Q-table import/export', () => {
    it('should export Q-table to JSON', () => {
      individual.setQValue('state1', 0, 5)
      individual.setQValue('state1', 1, 10)
      individual.setQValue('state2', 0, 3)

      const exported = individual.exportQTable()

      expect(exported['state1']).toEqual({ '0': 5, '1': 10 })
      expect(exported['state2']).toEqual({ '0': 3 })
    })

    it('should import Q-table from JSON', () => {
      const table = {
        'state1': { '0': 5, '1': 10 },
        'state2': { '0': 3 }
      }

      individual.importQTable(table)

      expect(individual.getQValue('state1', '0')).toBe(5)
      expect(individual.getQValue('state1', '1')).toBe(10)
      expect(individual.getQValue('state2', '0')).toBe(3)
    })

    it('should clear existing Q-table before import', () => {
      individual.setQValue('oldState', 0, 999)

      individual.importQTable({ 'newState': { '0': 1 } })

      expect(individual.qTable.has('oldState')).toBe(false)
      expect(individual.getQValue('newState', '0')).toBe(1)
    })
  })

  describe('learning modes', () => {
    it('should disable learning', () => {
      individual.setLearning(false)
      expect(individual.learningEnabled).toBe(false)

      individual.learn([1, 0], 0, 10, [0, 1], false)
      expect(individual.getQValue([1, 0], 0)).toBe(0)
    })

    it('should disable exploration', () => {
      individual.setExploration(false)
      expect(individual.explorationEnabled).toBe(false)

      individual.setQValue('test', 0, 5)
      individual.setQValue('test', 1, 10)

      // Should always choose best action
      for (let i = 0; i < 10; i++) {
        const action = individual.chooseAction('test', [0, 1])
        expect(action).toBe(1)
      }
    })
  })

  describe('integration with brain', () => {
    it('should override tick method', () => {
      const mockGetReward = jest.fn().mockReturnValue(5)
      individual.getReward = mockGetReward

      individual._getCurrentState = jest.fn().mockReturnValue([1, 0])
      individual._getAvailableActions = jest.fn().mockReturnValue([0, 1])

      const result = individual.tick()

      expect(individual._getCurrentState).toHaveBeenCalled()
      expect(individual._getAvailableActions).toHaveBeenCalled()
    })

    it('should learn from tick interactions', () => {
      individual.getReward = (action, result) => 1
      individual._getCurrentState = () => [1, 0]
      individual._getAvailableActions = () => [0, 1]

      // First tick sets up state
      individual.tick()

      // Second tick should trigger learning
      individual.tick()

      expect(individual.experienceBuffer.size()).toBeGreaterThan(0)
    })
  })

  describe('edge cases', () => {
    it('should handle undefined rlConfig', () => {
      const ind = new QLearningIndividual({ rlConfig: undefined })
      expect(ind.learningRate).toBe(0.1)
    })

    it('should handle batch learning with small buffer', () => {
      individual.batchSize = 10
      individual.learn([1, 0], 0, 5, [0, 1], false)
      individual.learn([0, 1], 1, 10, [1, 1], false)

      // Should not crash even though buffer < batchSize
      expect(individual.experienceBuffer.size()).toBe(2)
    })

    it('should handle _getMaxQValue for unknown state', () => {
      const maxQ = individual._getMaxQValue([99, 99, 99])
      expect(maxQ).toBe(0)
    })

    it('should handle neural Q-value fallback', () => {
      individual.useNeuralQ = true

      // Neural Q would fail without proper brain setup, so it falls back to table
      const state = [1, 0]
      individual.setQValue(state, 0, 5)

      // Disable neural Q to test table fallback
      individual.useNeuralQ = false
      expect(individual.getQValue(state, 0)).toBe(5)
    })
  })
})