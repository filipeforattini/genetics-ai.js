import { Reproduction } from "../src/reproduction.class"

describe('reproduction', () => {
  test('100%', () => {
    const genome = '528DBA'
    const mutated = Reproduction.genomeMutate(genome, 1)
    expect(mutated).not.toEqual(genome)
  })
})
