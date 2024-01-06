import { Brain } from "../src/brain.class.js"
import { Genome } from "../src/genome.class.js"

describe('brain', () => {
  test('simple heavly biased brain', () => {
    /**
     *   l0     l1     l2     l3
     *  ──┴──────┴──────┴──────┴──
     *   s0 ─── n0 ─┬──────── a0
     *           ┌──┘
     *   s1 ─┬─ n1
     *       │   └──┐
     *       └─ n2 ─┴─ n3 ─── a1
     */
    const brain = new Brain({
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

    const tick = brain.tick()
    // console.log(tick)

    if (Object.values(tick).includes('a#0')) {
      expect(tick['a#0']).toEqual('✓')
    }

    if (Object.values(tick).includes('a#1')) {
      expect(tick['a#1']).toEqual('✗')
    }
  })
})
