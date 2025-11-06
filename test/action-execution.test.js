/**
 * Critical regression test for action execution bug
 *
 * This test ensures that only ONE action executes per tick (the winner),
 * not all actions. This was a critical bug that prevented neural networks
 * from learning.
 *
 * Bug: inputsTree() included actions in tickOrder, causing ALL actions
 * to execute during tick processing (not just the winner).
 *
 * Fix: Filter out action vertices (names starting with 'a#') from tickOrder.
 */

import { Individual, Genome, Generation } from '../src/index.js'

describe('Action Execution - Critical Bug Tests', () => {
  class TestIndividual extends Individual {
    constructor(options) {
      super({
        ...options,
        sensors: [
          { id: 0, tick: () => this.sensorValue }
        ],
        actions: [
          { id: 0, tick: () => {
            this.action0Executed = true
            this.lastAction = 0
          }},
          { id: 1, tick: () => {
            this.action1Executed = true
            this.lastAction = 1
          }}
        ]
      })
      this.sensorValue = 0
      this.action0Executed = false
      this.action1Executed = false
      this.lastAction = null
    }

    resetFlags() {
      this.action0Executed = false
      this.action1Executed = false
    }
  }

  test('should execute only ONE action per tick, not all actions', () => {
    const genome = Genome.random(20, {
      sensors: 1,
      neurons: 3,
      actions: 2
    })

    const ind = new TestIndividual({ genome })

    ind.sensorValue = 0.5
    ind.tick()

    // CRITICAL: Only ONE action should have executed
    const executedCount = (ind.action0Executed ? 1 : 0) + (ind.action1Executed ? 1 : 0)

    expect(executedCount).toBe(1)
    expect(ind.lastAction).not.toBeNull()
  })

  test('should allow neural network to learn simple binary classification', () => {
    // This is the ultimate test - can the network learn at all?
    class BinaryTest extends Individual {
      constructor(options) {
        super({
          ...options,
          sensors: [
            { id: 0, tick: () => this.input }
          ],
          actions: [
            { id: 0, tick: () => this.choice = 0 },
            { id: 1, tick: () => this.choice = 1 }
          ]
        })
      }

      fitness() {
        let correct = 0

        this.input = 0
        this.tick()
        if (this.choice === 0) correct++

        this.input = 1
        this.tick()
        if (this.choice === 1) correct++

        return correct * 1000
      }
    }

    const gen = new Generation({
      size: 100,
      individualClass: BinaryTest,
      individualGenomeSize: 20,
      individualNeurons: 5,
      mutationRate: 0.1
    })

    gen.fillRandom()

    // After initial random population, SOME individuals should have
    // fitness > 1000 (better than random 50%)
    gen.tick()
    gen.population.sort((a, b) => b.fitness() - a.fitness())

    const best = gen.population[0]
    const perfectCount = gen.population.filter(ind => ind.fitness() === 2000).length

    // With 100 random individuals, at least a few should be perfect by chance
    // If ALL are stuck at 1000, the network is broken
    expect(perfectCount).toBeGreaterThan(0)
    expect(best.fitness()).toBe(2000)
  })

  test('sensors should be read during tick', () => {
    let sensorCallCount = 0

    class SensorTrackingInd extends Individual {
      constructor(options) {
        super({
          ...options,
          sensors: [
            { id: 0, tick: () => {
              sensorCallCount++
              return 0.5
            }}
          ],
          actions: [
            { id: 0, tick: () => {} },
            { id: 1, tick: () => {} }
          ]
        })
      }
    }

    const genome = Genome.random(20, {
      sensors: 1,
      neurons: 3,
      actions: 2
    })

    const ind = new SensorTrackingInd({ genome })

    sensorCallCount = 0
    ind.tick()

    // Sensor should be called at least once during tick
    expect(sensorCallCount).toBeGreaterThan(0)
  })
})
