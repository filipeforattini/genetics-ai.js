import { Generation } from "../src/generation.class.js"

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

describe('generation creation', () => {
  test('from class', () => {
    const gen = new Generation({
      size: 10,
      individualOptions: {
        genomeSize: 4,
        brain: {
          sensors,
          actions,
          neuronsCount: 2,
        }
      }
    })

    gen.fill()

    expect(gen.size).toEqual(10)
    expect(gen.individuals.length).toEqual(10)
    expect(gen.demographics.total).toEqual(10)
  })

  test('from static first', () => {
    const gen = Generation.first({
      size: 10,
      individualOptions: {
        genomeSize: 4,
        brain: {
          sensors,
          actions,
          neuronsCount: 2,
        }
      }
    })

    expect(gen.size).toEqual(10)
    expect(gen.individuals.length).toEqual(10)
    expect(gen.demographics.total).toEqual(10)
  })
})
