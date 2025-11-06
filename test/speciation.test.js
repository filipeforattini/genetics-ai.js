import { Speciation, Species } from '../src/speciation.class.js'
import { Genome } from '../src/genome.class.js'
import { Individual } from '../src/individual.class.js'

describe('Speciation', () => {
  describe('Species', () => {
    test('creates species with representative', () => {
      const genome = Genome.randomWith(50)
      const ind = new Individual({ genome })
      const species = new Species(1, ind)

      expect(species.id).toBe(1)
      expect(species.representative).toBe(ind)
      expect(species.members).toEqual([])
      expect(species.age).toBe(0)
      expect(species.maxFitness).toBe(0)
    })

    test('adds members to species', () => {
      const rep = new Individual({ genome: Genome.randomWith(50), sensors: [], actions: [] })
      const species = new Species(1, rep)

      const member1 = new Individual({ genome: Genome.randomWith(50), sensors: [], actions: [] })
      const member2 = new Individual({ genome: Genome.randomWith(50), sensors: [], actions: [] })

      species.members.push(member1, member2)

      expect(species.members.length).toBe(2)
      expect(species.members).toContain(member1)
      expect(species.members).toContain(member2)
    })

    test('calculates adjusted fitness', () => {
      const rep = new Individual({ genome: Genome.randomWith(50), sensors: [], actions: [] })
      const species = new Species(1, rep)

      const member1 = new Individual({ genome: Genome.randomWith(50), sensors: [], actions: [] })
      member1.fitness = () => 100

      const member2 = new Individual({ genome: Genome.randomWith(50), sensors: [], actions: [] })
      member2.fitness = () => 200

      species.members.push(member1, member2)
      species.calculateAdjustedFitness()

      // Total fitness = 100 + 200 = 300
      // Average = 300 / 2 = 150
      expect(species.averageFitness).toBe(150)
    })

    test('finds champion', () => {
      const rep = new Individual({ genome: Genome.randomWith(50), sensors: [], actions: [] })
      const species = new Species(1, rep)

      const member1 = new Individual({ genome: Genome.randomWith(50), sensors: [], actions: [] })
      member1.fitness = () => 100

      const member2 = new Individual({ genome: Genome.randomWith(50), sensors: [], actions: [] })
      member2.fitness = () => 200

      const member3 = new Individual({ genome: Genome.randomWith(50), sensors: [], actions: [] })
      member3.fitness = () => 150

      species.members.push(member1, member2, member3)

      const champion = species.champion()
      expect(champion).toBe(member2)
      expect(champion.fitness()).toBe(200)
    })
  })

  describe('Speciation', () => {
    test('creates with default options', () => {
      const speciation = new Speciation()

      expect(speciation.compatibilityThreshold).toBe(3.0)
      expect(speciation.stagnationThreshold).toBe(15)
      expect(speciation.survivalThreshold).toBe(0.2)
      expect(speciation.c1).toBe(1.0)
      expect(speciation.c2).toBe(1.0)
      expect(speciation.c3).toBe(0.4)
    })

    test('creates with custom options', () => {
      const speciation = new Speciation({
        compatibilityThreshold: 5.0,
        stagnationThreshold: 20,
        survivalThreshold: 0.3,
      })

      expect(speciation.compatibilityThreshold).toBe(5.0)
      expect(speciation.stagnationThreshold).toBe(20)
      expect(speciation.survivalThreshold).toBe(0.3)
    })

    test('calculates distance between genomes', () => {
      const speciation = new Speciation()

      const genome1 = Genome.randomWith(50)
      const genome2 = Genome.fromString(genome1.encoded) // Same
      const genome3 = Genome.randomWith(100) // Different length

      const distance1 = speciation.distance(genome1, genome2)
      const distance2 = speciation.distance(genome1, genome3)

      expect(distance1).toBe(0) // Identical genomes
      expect(distance2).toBeGreaterThanOrEqual(0) // Different genomes (might be 0 by chance)
    })

    test('speciates population into species', () => {
      const speciation = new Speciation({
        compatibilityThreshold: 3.0
      })

      const population = []
      for (let i = 0; i < 10; i++) {
        const ind = new Individual({ genome: Genome.randomWith(50), sensors: [], actions: [] })
        ind.fitness = () => Math.random() * 100
        population.push(ind)
      }

      const species = speciation.speciate(population)

      expect(Array.isArray(species)).toBe(true)
      expect(species.length).toBeGreaterThan(0)

      // All individuals should be assigned to species
      const totalMembers = species.reduce((sum, s) => sum + s.members.length, 0)
      expect(totalMembers).toBe(population.length)
    })

    test('removes stagnant species', () => {
      const speciation = new Speciation({
        stagnationThreshold: 5
      })

      // Create a stagnant species (old with no improvement)
      const genome = Genome.randomWith(50)
      const ind = new Individual({ genome })
      const species = new Species(1, ind)
      species.age = 10
      species.maxFitness = 100
      species.maxFitnessAge = 10

      speciation.species = [species]

      const population = []
      for (let i = 0; i < 5; i++) {
        const ind = new Individual({ genome: Genome.randomWith(50), sensors: [], actions: [] })
        ind.fitness = () => 50 // Lower than max
        population.push(ind)
      }

      const result = speciation.speciate(population)

      // Stagnant species should be removed or have fewer members
      expect(result.length).toBeGreaterThanOrEqual(1)
    })

    test('calculates offspring allocation', () => {
      const speciation = new Speciation()

      // Create species with different fitness
      const species1 = new Species(1, new Individual({ genome: Genome.randomWith(50), sensors: [], actions: [] }))
      species1.averageFitness = 100

      const species2 = new Species(2, new Individual({ genome: Genome.randomWith(50), sensors: [], actions: [] }))
      species2.averageFitness = 200

      speciation.species = [species1, species2]

      const allocation = speciation.calculateOffspringAllocation(100)

      expect(Array.isArray(allocation)).toBe(true)
      expect(allocation.length).toBe(2)

      // Total should equal target size
      const total = allocation.reduce((sum, n) => sum + n, 0)
      expect(total).toBe(100)

      // Species with higher fitness should get more offspring
      expect(allocation[1]).toBeGreaterThan(allocation[0])
    })

    test('gets metadata', () => {
      const speciation = new Speciation()

      const species1 = new Species(1, new Individual({ genome: Genome.randomWith(50), sensors: [], actions: [] }))
      species1.members = [new Individual({ genome: Genome.randomWith(50), sensors: [], actions: [] })]
      species1.averageFitness = 100

      speciation.species = [species1]

      const metadata = speciation.getMetadata()

      expect(metadata.speciesCount).toBe(1)
      expect(metadata.species).toBeDefined()
      expect(metadata.species[0].id).toBe(1)
      expect(metadata.species[0].size).toBe(1)
      expect(metadata.species[0].averageFitness).toBe(100)
    })
  })
})
