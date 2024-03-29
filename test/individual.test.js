import { Genome } from "../src/genome.class"
import { Individual } from "../src/individual.class"

describe('individual', () => {
    const individual = new Individual({
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


  test('reproduce', () => {
    const child = individual.reproduce.asexual.fission(1)
    expect(individual.genome.encoded).not.toEqual(child.encoded)
  })
})
