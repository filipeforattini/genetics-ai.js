import { Base } from "../src/base.class.js"
import { Genome } from "../src/genome.class.js"

describe('genome creation', () => {
  test('from class', () => {
    const genome = new Genome({
      base32: ['02g20a'],
      baseBin: ['000000001110000000110000001010'],
      bases: [
        Base.fromBase32('01010a'),
        new Base({
          from: 's#00',
          to: 'n#00',
          weight: 1,
        }),
      ],
    })

    expect(genome.bases.length).toEqual(4)
    expect(genome.toArray().length).toEqual(4)
    expect(genome.nodes.length).toEqual(8)
  })

  test('from static random', () => {
    const genome = Genome.random(2)
    expect(genome.bases.length).toEqual(2)
    expect(genome.toArray().length).toEqual(2)
  })

  test('from static random with defined ids', () => {
    const genomeTest = new Genome({
      base32: ['000000', 'g0g000']
    })

    const genome = Genome.randomWithinIds({
      ids: [...genomeTest.nodes],
      size: 4,
    })

    expect(genome.bases.length).toEqual(4)
    expect(genome.toArray().length).toEqual(4)

    expect(genome.nodes.length >= 2).toBeTruthy()
    expect(genome.nodes.length <= 3).toBeTruthy()
  })
})
