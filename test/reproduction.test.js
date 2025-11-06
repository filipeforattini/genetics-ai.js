import { Genome } from "../src/genome.class"
import { Reproduction, ReproductionGenomeHandler } from "../src/reproduction.class"

describe('reproduction', () => {
  const genome = Genome.fromString('528DBA')

  describe('genome handler', () => {
    test('handler functions', () => {
      const handler = ReproductionGenomeHandler.from({ genome, mutationRate: 0 }).mutate()
      expect(handler.get().encoded).toEqual(genome.encoded)
        
      handler.fusion(genome)
      expect(handler.get().encoded).toEqual(genome.encoded + genome.encoded)
  
      const [g1, g2] = handler.fissure(2)
      expect(g1.get().encoded).toEqual(genome.encoded)
      expect(g2.get().encoded).toEqual(genome.encoded)
    })
  })

  describe('reproduction', () => {
    test('crossover', () => {
      const parent1 = Genome.fromString('528DBA')
      const parent2 = Genome.fromString('ABCDEF')

      // New crossover implementation uses base-aware random selection
      const [childA1, childA2] = Reproduction.genomeCrossover(parent1, parent2, { mutationRate: 0 })

      // Children should exist and be Genome instances
      expect(childA1).toBeDefined()
      expect(childA2).toBeDefined()
      expect(childA1.encoded).toBeDefined()
      expect(childA2.encoded).toBeDefined()

      // Children should have some genetic material (non-empty)
      expect(childA1.encoded.length).toBeGreaterThan(0)
      expect(childA2.encoded.length).toBeGreaterThan(0)

      // With mutation, children should be different from parents
      const [childB1, childB2] = Reproduction.genomeCrossover(parent1, parent2, { mutationRate: 1 })
      expect(childB1.encoded).not.toEqual(parent1.encoded)
      expect(childB1.encoded).not.toEqual(parent2.encoded)
      expect(childB2.encoded).not.toEqual(parent1.encoded)
      expect(childB2.encoded).not.toEqual(parent2.encoded)
    })
  })

  test('mutate 100%', () => {
    const mutated = Reproduction.genomeMutate(genome, { mutationRate: 1 })
    expect(mutated).not.toEqual(genome.encoded)
  })

  test('duplicate', () => {
    const duplicated = Reproduction.genomeFusion(genome, genome, { mutationRate: 0 })
    expect(duplicated.encoded).toEqual(genome.encoded + genome.encoded)
  })

  test('fissuere in 2', () => {
    const mutated = Reproduction.genomeMutate(genome, { mutationRate: 1 })
  })
})
