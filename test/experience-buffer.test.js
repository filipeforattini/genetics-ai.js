import { describe, it, expect, beforeEach } from '@jest/globals'
import { ExperienceBuffer } from '../src/rl/experience-buffer.class.js'

describe('ExperienceBuffer', () => {
  let buffer

  beforeEach(() => {
    buffer = new ExperienceBuffer(5)
  })

  describe('constructor', () => {
    it('should initialize with correct capacity', () => {
      expect(buffer.capacity).toBe(5)
      expect(buffer.buffer).toEqual([])
      expect(buffer.position).toBe(0)
    })

    it('should have default parameters', () => {
      expect(buffer.epsilon).toBe(0.01)
      expect(buffer.alpha).toBe(0.6)
      expect(buffer.beta).toBe(0.4)
      expect(buffer.betaIncrement).toBe(0.001)
    })
  })

  describe('add', () => {
    it('should add experience to buffer', () => {
      const exp = { state: [0, 1], action: 1, reward: 10, nextState: [1, 0], done: false }
      buffer.add(exp)

      expect(buffer.size()).toBe(1)
      expect(buffer.buffer[0]).toEqual(exp)
    })

    it('should overwrite old experiences when full', () => {
      for (let i = 0; i < 7; i++) {
        buffer.add({ state: i, action: i, reward: i, nextState: i + 1, done: false })
      }

      expect(buffer.size()).toBe(5)
      expect(buffer.buffer[0].state).toBe(5) // First two were overwritten
      expect(buffer.buffer[1].state).toBe(6)
    })

    it('should handle priority values', () => {
      buffer.add({ state: 1, action: 1, reward: 1, nextState: 2, done: false }, 10)
      expect(buffer.priorities[0]).toBe(10)

      buffer.add({ state: 2, action: 2, reward: 2, nextState: 3, done: false })
      expect(buffer.priorities[1]).toBe(10) // Uses max priority by default
    })
  })

  describe('sample', () => {
    beforeEach(() => {
      for (let i = 0; i < 5; i++) {
        buffer.add({
          state: i,
          action: i,
          reward: i * 10,
          nextState: i + 1,
          done: i === 4
        })
      }
    })

    it('should sample experiences uniformly', () => {
      const samples = buffer.sample(3, false)

      expect(samples.length).toBe(3)
      samples.forEach(s => {
        expect(s).toHaveProperty('state')
        expect(s).toHaveProperty('action')
        expect(s).toHaveProperty('reward')
        expect(s).toHaveProperty('nextState')
        expect(s).toHaveProperty('done')
      })
    })

    it('should return all experiences when batch size exceeds buffer', () => {
      const samples = buffer.sample(10, false)
      expect(samples.length).toBe(5)
    })

    it('should sample with priorities when requested', () => {
      // Set different priorities
      buffer.priorities = [0.1, 0.2, 0.3, 0.4, 0.5]

      const samples = buffer.sample(3, true)

      expect(samples.length).toBe(3)
      samples.forEach(s => {
        expect(s).toHaveProperty('weight')
        expect(s).toHaveProperty('index')
        expect(s.weight).toBeGreaterThanOrEqual(0)
        expect(s.weight).toBeLessThanOrEqual(1)
      })
    })

    it('should increase beta after prioritized sampling', () => {
      const initialBeta = buffer.beta
      buffer.sample(3, true)
      expect(buffer.beta).toBeGreaterThan(initialBeta)
    })
  })

  describe('updatePriorities', () => {
    it('should update priorities based on TD errors', () => {
      for (let i = 0; i < 3; i++) {
        buffer.add({ state: i, action: i, reward: i, nextState: i + 1, done: false })
      }

      const indices = [0, 1, 2]
      const tdErrors = [0.5, 1.0, 0.2]

      buffer.updatePriorities(indices, tdErrors)

      expect(buffer.priorities[0]).toBeCloseTo(Math.pow(0.5 + 0.01, 0.6))
      expect(buffer.priorities[1]).toBeCloseTo(Math.pow(1.0 + 0.01, 0.6))
      expect(buffer.priorities[2]).toBeCloseTo(Math.pow(0.2 + 0.01, 0.6))
    })
  })

  describe('getStats', () => {
    it('should return empty stats for empty buffer', () => {
      const stats = buffer.getStats()
      expect(stats).toEqual({ size: 0, avgReward: 0, avgPriority: 0 })
    })

    it('should calculate statistics correctly', () => {
      buffer.add({ state: 1, action: 1, reward: 10, nextState: 2, done: false }, 1)
      buffer.add({ state: 2, action: 2, reward: 20, nextState: 3, done: false }, 2)
      buffer.add({ state: 3, action: 3, reward: 30, nextState: 4, done: true }, 3)

      const stats = buffer.getStats()

      expect(stats.size).toBe(3)
      expect(stats.avgReward).toBe(20)
      expect(stats.minReward).toBe(10)
      expect(stats.maxReward).toBe(30)
      expect(stats.avgPriority).toBe(2)
    })
  })

  describe('clear', () => {
    it('should clear all data', () => {
      buffer.add({ state: 1, action: 1, reward: 1, nextState: 2, done: false })
      buffer.add({ state: 2, action: 2, reward: 2, nextState: 3, done: false })

      buffer.clear()

      expect(buffer.size()).toBe(0)
      expect(buffer.buffer).toEqual([])
      expect(buffer.priorities).toEqual([])
      expect(buffer.position).toBe(0)
    })
  })

  describe('serialization', () => {
    it('should export to JSON', () => {
      buffer.add({ state: 1, action: 1, reward: 10, nextState: 2, done: false })
      buffer.add({ state: 2, action: 2, reward: 20, nextState: 3, done: true })

      const json = buffer.toJSON()

      expect(json.buffer.length).toBe(2)
      expect(json.capacity).toBe(5)
      expect(json.position).toBe(2)
      expect(json.alpha).toBe(0.6)
      expect(json.beta).toBe(0.4)
    })

    it('should import from JSON', () => {
      const json = {
        buffer: [
          { state: 1, action: 1, reward: 10, nextState: 2, done: false },
          { state: 2, action: 2, reward: 20, nextState: 3, done: true }
        ],
        priorities: [1, 2],
        position: 2,
        capacity: 10,
        alpha: 0.5,
        beta: 0.3
      }

      const imported = ExperienceBuffer.fromJSON(json)

      expect(imported.capacity).toBe(10)
      expect(imported.buffer.length).toBe(2)
      expect(imported.position).toBe(2)
      expect(imported.alpha).toBe(0.5)
      expect(imported.beta).toBe(0.3)
    })
  })

  describe('edge cases', () => {
    it('should handle single experience', () => {
      buffer.add({ state: 1, action: 1, reward: 1, nextState: 2, done: false })
      const samples = buffer.sample(1, false)
      expect(samples.length).toBe(1)
    })

    it('should handle empty buffer sampling', () => {
      const samples = buffer.sample(5, false)
      expect(samples).toEqual([])
    })

    it('should handle zero capacity', () => {
      const zeroBuffer = new ExperienceBuffer(0)
      zeroBuffer.add({ state: 1, action: 1, reward: 1, nextState: 2, done: false })
      expect(zeroBuffer.size()).toBe(1) // Buffer still adds even with 0 capacity
    })

    it('should handle circular overwrite correctly', () => {
      const smallBuffer = new ExperienceBuffer(2)
      smallBuffer.add({ state: 1, action: 1, reward: 1, nextState: 2, done: false })
      smallBuffer.add({ state: 2, action: 2, reward: 2, nextState: 3, done: false })
      smallBuffer.add({ state: 3, action: 3, reward: 3, nextState: 4, done: false })

      expect(smallBuffer.size()).toBe(2)
      expect(smallBuffer.buffer[0].state).toBe(3)
      expect(smallBuffer.buffer[1].state).toBe(2)
    })
  })
})