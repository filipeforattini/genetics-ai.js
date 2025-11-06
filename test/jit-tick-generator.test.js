import { JITTickGenerator } from '../src/jit-tick-generator.class.js'

const createVertex = (name, type, bias = 0) => ({
  name,
  metadata: { type, bias },
  in: [],
  cache: { value: 0 }
})

const buildBrain = () => {
  const sensor = createVertex('s#0', 'sensor')
  const neuron = createVertex('n#0', 'neuron', 0.1)
  const action = createVertex('a#0', 'action', 0.2)

  neuron.in.push({ vertex: sensor, weight: 0.5 })
  action.in.push({ vertex: neuron, weight: 1 })

  const definitions = {
    all: {
      's#0': sensor,
      'n#0': neuron,
      'a#0': action
    },
    sensors: { 's#0': sensor },
    neurons: { 'n#0': neuron },
    actions: { 'a#0': action }
  }

  return {
    environment: { value: 1 },
    tickOrder: [
      { vertex: sensor },
      { vertex: neuron },
      { vertex: action }
    ],
    definitions
  }
}

describe('JITTickGenerator', () => {
  test('returns null for empty or oversized networks', () => {
    const brain = buildBrain()
    brain.tickOrder = []
    expect(JITTickGenerator.generateTickFunction(brain)).toBeNull()

    brain.tickOrder = new Array(201).fill({ vertex: createVertex('dummy', 'neuron') })
    expect(JITTickGenerator.generateTickFunction(brain)).toBeNull()
  })

  test('generates executable tick function for supported topology', () => {
    const brain = buildBrain()
    const tickFn = JITTickGenerator.generateTickFunction(brain)
    expect(typeof tickFn).toBe('function')

    const sensors = {
      's#0': {
        tick: () => 0.8
      }
    }
    const actionsMap = {
      'a#0': {
        tick: (value, env) => value + env.value
      }
    }

    const cache = {}
    const result = tickFn(brain, sensors, [], actionsMap, cache, x => x)

    expect(result).toHaveProperty('a#0')
    expect(result['a#0']).toBeCloseTo((0.8 * 0.5) + 0.1 + 0.2 + brain.environment.value, 5)
    expect(cache).toHaveProperty('a#0')
  })
})
