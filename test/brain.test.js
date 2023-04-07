import { Brain } from '../src/brain.class.js'
import { Genome } from '../src/genome.class.js'

const sensors = [
  {
    id: 's#00',
    tick: () => Math.cos(Date.now())
  },
  {
    id: 's#01',
    tick: () => Math.cos(Date.now())
  },
]

const actions = [
  {
    id: 'a#00',
    tick(data) {
      console.log('a#00', data)
    },
  },
  {
    id: 'a#01',
    tick(data) {
      console.log('a#01', data)
    },
  }
]

class Accumulator {
  constructor() { this.total = 0 }
  get() { return this.total }
  add(x) { this.total += x }
  reset() { this.total = 0 }
}

describe('brain creation', () => {
  test('from class', () => {
    const genome = new Genome({
      base32: ['00000a', '00010a', 'g0g00a', 'g1g10a']
    })

    const brain = new Brain({
      genome,
      actions,
      sensors,
      neuronsCount: 2,
    })

    expect(brain.sensors.length).toEqual(2)
    expect(brain.actions.length).toEqual(2)
    expect(brain.neurons.length).toEqual(2)
  })

  test('from static random', () => {
    const brain = Brain.random({
      actions,
      sensors,
      genomeSize: 2,
      neuronsCount: 2,
    })

    expect(brain.sensors.length).toEqual(2)
    expect(brain.actions.length).toEqual(2)
    expect(brain.neurons.length).toEqual(2)
  })
})

describe('brain tick', () => {
  let brain
  let acc = new Accumulator()

  beforeAll(() => {
    brain = Brain.random({
      neuronsCount: 1,
      sensors: [
        {
          id: 's#00',
          bindTo: acc,
          tick() { return Math.tanh(this.get()) }
        },
        {
          id: 's#01',
          tick() { return 1 }
        },
      ],
      actions: [
        {
          id: 'a#00',
          bindTo: acc,
          tick(d) {
            this.add(Math.ceil(d))
          },
        },
        {
          id: 'a#01',
          bindTo: acc,
          tick(d) {
            if (d > 0.99) this.reset()
          }
        },
      ],
      genome: new Genome({
        base32: [
          '00000j',
          '01000a',
          'g0g00a',
          '00g10a',
        ],
      })
    })
  })

  test('over complicated looper from 0 to 10', () => {
    for (let i = 0; i < 10; i++) {
      brain.run()      
  }

    expect(acc.get()).toEqual(10)
  })
})