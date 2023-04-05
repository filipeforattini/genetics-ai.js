import { Generation } from "../src/generation.class.js"

const sensors = [
  { id: 's#00', tick: () => Math.cos(Date.now()) },
  { id: 's#01', tick: () => Math.cos(Date.now()) },
]

const actions = [
  { id: 'a#00', tick(data) { console.log('a#00', data) }},
  { id: 'a#01', tick(data) { console.log('a#01', data) }},
]

const GEN_SIZE = 30

describe('generation creation', () => {
  test('from class', () => {
    const gen = new Generation({
      size: GEN_SIZE,
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

    expect(gen.size).toEqual(GEN_SIZE)
    expect(gen.individuals.length).toEqual(GEN_SIZE)
    expect(gen.demographics.total).toEqual(GEN_SIZE)
  })

  test('from static first', () => {
    const gen = Generation.first({
      size: GEN_SIZE,
      individualOptions: {
        genomeSize: 4,
        brain: {
          sensors,
          actions,
          neuronsCount: 2,
        }
      }
    })

    expect(gen.size).toEqual(GEN_SIZE)
    expect(gen.individuals.length).toEqual(GEN_SIZE)
    expect(gen.demographics.total).toEqual(GEN_SIZE)
  })
})

describe('evolution', () => {
  test('complete', () => {
    
    const gen = Generation.first({
      size: GEN_SIZE,
      fitnessFunction: (ind) => ind.health - Math.random(),

      individualOptions: {
        genomeSize: 4,
        brain: {
          sensors,
          actions,
          neuronsCount: 2,
        }
      },
    })

    expect(gen.individuals.length).toEqual(GEN_SIZE)
    expect(gen.fitness.length).toEqual(GEN_SIZE)
    
    gen.fit()
    expect(gen.fitness.length).toEqual(GEN_SIZE)

    gen.next()
    expect(gen.individuals.length).toEqual(GEN_SIZE)
  })
})