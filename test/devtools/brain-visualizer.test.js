import { BrainVisualizer } from '../../src/devtools/brain-visualizer.class.js'

const createVertex = (name, type, value = 0, weight = 0) => ({
  name,
  metadata: { type },
  in: [],
  cache: { value },
  addIn(vertex, w) {
    this.in.push({ vertex, weight: w })
  }
})

const buildBrain = () => {
  const sensor = createVertex('s#0', 'sensor', 0.3)
  const neuron = createVertex('n#0', 'neuron', 0.5)
  const action = createVertex('a#0', 'action', 0.7)

  neuron.addIn(sensor, 1.2)
  action.addIn(neuron, 0.9)

  const definitions = {
    all: {
      [sensor.name]: sensor,
      [neuron.name]: neuron,
      [action.name]: action
    },
    sensors: { [sensor.name]: sensor },
    neurons: { [neuron.name]: neuron },
    actions: { [action.name]: action }
  }

  return { definitions }
}

describe('BrainVisualizer', () => {
  test('draw methods emit human-readable diagrams', () => {
    const brain = buildBrain()
    const visualizer = new BrainVisualizer(brain)

    const topology = visualizer.drawTopology()
    expect(topology).toContain('Sensors (1)')
    expect(topology).toContain('Actions (1)')

    const connections = visualizer.drawConnections()
    expect(connections).toContain('Strong Connections')

    const activations = visualizer.drawActivations()
    expect(activations).toContain('⚡ Current Activations')

    const full = visualizer.draw()
    expect(full).toContain('Brain Visualization')
    expect(full).toContain('🔗 Strong Connections')
  })
})
