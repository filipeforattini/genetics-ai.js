import { jest } from '@jest/globals'
import { Brain } from '../src/brain.class.js'
import { Genome } from '../src/genome.class.js'
import { Vertex } from '../src/vertex.class.js'

describe('Brain advanced behaviors', () => {
  test('layered processing executes with feature hooks', () => {
    const brain = new Brain({
      genome: Genome.fromBases([]),
      sensors: [],
      actions: []
    })

    // Build custom vertices
    const sensor = new Vertex('s#0', { type: 'sensor' })
    sensor.tick = () => 0.5

    const neuron = new Vertex('n#0', { type: 'neuron', bias: 0 })
    neuron.in.push({ vertex: sensor, weight: 2 })

    const action = new Vertex('a#0', { type: 'action', bias: 0 })
    action.in.push({ vertex: neuron, weight: 1 })

    // Prepare caches
    sensor.cache = { generation: -1, value: 0 }
    neuron.cache = { generation: -1, value: 0 }
    action.cache = { generation: -1, value: 0 }

    // Define layer connections mirroring the inputs above
    const connections = {
      vertexRanges: [
        { start: 0, count: 0 }, // sensor
        { start: 0, count: 1 }, // neuron depends on sensor
        { start: 1, count: 1 }  // action depends on neuron
      ],
      sourceIndices: [sensor, neuron],
      weightsTyped: new Float32Array([2, 1]),
      outputs: new Float32Array(3),
      biases: new Float32Array([0, 0, 0])
    }

    brain.layers = [{
      depth: 0,
      vertices: [sensor, neuron, action],
      vertexIndices: new Map(),
      connections
    }]

    brain.useLayeredProcessing = true
    brain.tickGeneration = 0
    brain.activationFunction = x => x

    brain.definitions = {
      all: { 's#0': sensor, 'n#0': neuron, 'a#0': action },
      sensors: { 0: sensor },
      neurons: { 0: neuron },
      actions: { 0: action }
    }

    brain.actions = {
      'a#0': { tick: jest.fn((value) => value + 1) }
    }

    brain._features = {
      hasAttributes: false,
      hasSensorAttributes: false,
      hasActionAttributes: true,
      hasLearning: true,
      hasMemory: true,
      hasPlasticity: false,
      hasProgrammableNeurons: false
    }

    brain.applyActionAttributes = jest.fn()
    brain.applyLearningRules = jest.fn()
    brain.updateMemoryCells = jest.fn()

    const result = brain.tick()

    expect(result).toHaveProperty('a#0')
    expect(result['a#0']).toBeGreaterThan(0)
    expect(brain.applyActionAttributes).toHaveBeenCalled()
    expect(brain.applyLearningRules).toHaveBeenCalled()
    expect(brain.updateMemoryCells).toHaveBeenCalled()
  })
})
