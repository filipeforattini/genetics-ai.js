import { Genome } from "../src/genome.class.js"

const genomes = [
  [ 2, '528DBA' ],
  [ 2, '05H5302K59' ],
  [ 4, '14M58E5C883D2V' ],
  [ 4, '83J0F85P5501T2L2491Q' ],
  [ 8, 'HBQH5P5CA41V5O90H60Q336170TH6O' ],
  [ 8, '80H3J63H2162N4SDBA01R1KD2M02C5023E0T' ],
  [ 16, '81I3D17063B3V45M5P5260650B45D2MD7D42T2D2655J9289A05C18465F4494J82Q5D' ],
  [ 16, '54A52425T3G81T18DC065H2N0330V25J37H2M02B3F6415R82T6901U5324P0B99T62Q2H' ],
]

describe('genome', () => {
  test('from simple string', () => {
    const genomeStr = [
      '101',
      '00000',
      '102',
    ].join('')

    const genome = Genome.fromString(genomeStr)

    expect(genome.bases.length).toEqual(3)
    expect(genome.bases[0].type).toEqual('bias')
    expect(genome.bases[1].type).toEqual('connection')
    expect(genome.bases[2].type).toEqual('bias')
  })

  test('random',  () => {
    const count = 10
    const genome = Genome.random(count)
    expect(genome.bases.length).toEqual(count)
  })

  test('random generated', () => {
    for (const [count, genome] of genomes) {
      const g = Genome.from(genome)
      expect(g.bases.length).toEqual(count)
    }
  })
})
