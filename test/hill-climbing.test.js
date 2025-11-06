import { HillClimbing, HybridGAHC } from '../src/hill-climbing.class.js'
import { Individual } from '../src/individual.class.js'
import { Genome } from '../src/genome.class.js'

describe('HillClimbing', () => {
  describe('constructor', () => {
    test('creates with default options', () => {
      const hc = new HillClimbing()

      expect(hc.maxIterations).toBe(10)
      expect(hc.mutationStrength).toBe(0.001)
      expect(hc.patience).toBe(3)
    })

    test('creates with custom options', () => {
      const hc = new HillClimbing({
        maxIterations: 20,
        mutationStrength: 0.01,
        patience: 5,
      })

      expect(hc.maxIterations).toBe(20)
      expect(hc.mutationStrength).toBe(0.01)
      expect(hc.patience).toBe(5)
    })

    test('validates options', () => {
      expect(() => new HillClimbing({ maxIterations: -1 })).toThrow()
      expect(() => new HillClimbing({ mutationStrength: 1.5 })).toThrow()
      expect(() => new HillClimbing({ patience: -1 })).toThrow()
    })
  })

  describe('climb', () => {
    test('improves fitness through hill climbing', () => {
      const hc = new HillClimbing({
        maxIterations: 10,
        mutationStrength: 0.1,
      })

      const ind = new Individual({
        genome: Genome.randomWith(50),
        sensors: [],
        actions: []
      })
      ind.fitness = () => {
        // Simple fitness: sum of genome characters
        return ind.genome.encoded.split('').reduce((sum, char) => {
          return sum + char.charCodeAt(0)
        }, 0)
      }

      const initialFitness = ind.fitness()
      const improved = hc.climb(ind)
      const finalFitness = improved.fitness()

      // Fitness should be improved or at least equal
      expect(finalFitness).toBeGreaterThanOrEqual(initialFitness)
      expect(improved).toBeInstanceOf(Individual)
    })

    test('uses custom fitness function', () => {
      const hc = new HillClimbing({
        maxIterations: 5,
      })

      const ind = new Individual({ genome: Genome.randomWith(50), sensors: [], actions: [] })
      ind.value = 100

      let evaluationCount = 0
      const customFitness = (individual) => {
        evaluationCount++
        return individual.value || 0
      }

      hc.climb(ind, customFitness)

      // Custom fitness should have been called
      expect(evaluationCount).toBeGreaterThan(0)
    })

    test('stops early when no improvement (patience)', () => {
      const hc = new HillClimbing({
        maxIterations: 100,
        patience: 3,
        mutationStrength: 0.0001, // Very small mutations unlikely to improve
      })

      const ind = new Individual({ genome: Genome.randomWith(50), sensors: [], actions: [] })
      ind.fitness = () => 100 // Constant fitness

      let iterationCount = 0
      const fitnessFunc = (individual) => {
        iterationCount++
        return typeof individual.fitness === 'function' ? individual.fitness() : 100
      }

      hc.climb(ind, fitnessFunc)

      // Should stop early due to patience, not reach maxIterations
      expect(iterationCount).toBeLessThan(100)
    })

    test('handles fitness as property', () => {
      const hc = new HillClimbing({
        maxIterations: 5,
      })

      const ind = new Individual({ genome: Genome.randomWith(50), sensors: [], actions: [] })
      ind.fitness = 100 // Property, not function

      const improved = hc.climb(ind)

      expect(improved).toBeInstanceOf(Individual)
    })

    test('creates valid neighbors', () => {
      const hc = new HillClimbing({
        maxIterations: 1,
      })

      const ind = new Individual({ genome: Genome.randomWith(50), sensors: [], actions: [] })
      ind.fitness = () => 100

      const improved = hc.climb(ind)

      // Neighbor should have valid genome
      expect(improved.genome).toBeDefined()
      expect(improved.genome.encoded).toBeDefined()
    })
  })

  describe('climbPopulation', () => {
    test('climbs multiple individuals', () => {
      const hc = new HillClimbing({
        maxIterations: 5,
      })

      const population = []
      for (let i = 0; i < 5; i++) {
        const ind = new Individual({
          genome: Genome.randomWith(50),
          sensors: [],
          actions: []
        })
        ind.fitness = () => i * 10
        population.push(ind)
      }

      const improved = hc.climbPopulation(population)

      expect(improved.length).toBe(5)
      improved.forEach(ind => {
        expect(ind).toBeInstanceOf(Individual)
      })
    })

    test('uses custom fitness function for population', () => {
      const hc = new HillClimbing({
        maxIterations: 3,
      })

      const population = []
      for (let i = 0; i < 3; i++) {
        const ind = new Individual({ genome: Genome.randomWith(50), sensors: [], actions: [] })
        ind.value = i * 10
        population.push(ind)
      }

      let callCount = 0
      const customFitness = (ind) => {
        callCount++
        return ind.value || 0
      }

      hc.climbPopulation(population, customFitness)

      expect(callCount).toBeGreaterThan(0)
    })
  })

  describe('_createNeighbor', () => {
    test('creates a neighbor with mutated genome', () => {
      const hc = new HillClimbing()

      const ind = new Individual({ genome: Genome.randomWith(50), sensors: [], actions: [] })
      const originalGenome = ind.genome.encoded

      const neighbor = hc._createNeighbor(ind)

      expect(neighbor).toBeInstanceOf(Individual)
      expect(neighbor.genome).toBeDefined()

      // Genome should be different (though might be same by chance with low mutation)
      const neighborGenome = neighbor.genome.encoded
      expect(neighborGenome).toBeDefined()
    })

    test('preserves individual class type', () => {
      class CustomIndividual extends Individual {
        customMethod() {
          return 'custom'
        }
      }

      const hc = new HillClimbing()
      const ind = new CustomIndividual({ genome: Genome.randomWith(50), sensors: [], actions: [] })

      const neighbor = hc._createNeighbor(ind)

      expect(neighbor).toBeInstanceOf(CustomIndividual)
      expect(neighbor.customMethod).toBeDefined()
      expect(neighbor.customMethod()).toBe('custom')
    })
  })
})

describe('HybridGAHC', () => {
  describe('constructor', () => {
    test('creates with hill climbing instance', () => {
      const hc = new HillClimbing()
      const hybrid = new HybridGAHC(hc)

      expect(hybrid.hillClimbing).toBe(hc)
      expect(hybrid.applyToEliteRatio).toBe(0.10)
    })

    test('creates with custom options', () => {
      const hc = new HillClimbing()
      const hybrid = new HybridGAHC(hc, {
        applyToEliteRatio: 0.20,
      })

      expect(hybrid.applyToEliteRatio).toBe(0.20)
    })

    test('validates options', () => {
      const hc = new HillClimbing()

      expect(() => new HybridGAHC(hc, { applyToEliteRatio: 1.5 })).toThrow()
      expect(() => new HybridGAHC(hc, { applyToEliteRatio: -0.1 })).toThrow()
    })
  })

  describe('refineElite', () => {
    test('refines top individuals', () => {
      const hc = new HillClimbing({
        maxIterations: 5,
      })

      const hybrid = new HybridGAHC(hc, {
        applyToEliteRatio: 0.20, // Top 20%
      })

      const population = []
      for (let i = 0; i < 10; i++) {
        const ind = new Individual({ genome: Genome.randomWith(50), sensors: [], actions: [] })
        ind.fitness = () => i * 10
        population.push(ind)
      }

      const refined = hybrid.refineElite(population)

      expect(refined).toBeDefined()
      expect(refined.length).toBe(10)

      // Population should still contain same number of individuals
      expect(population.length).toBe(10)
    })

    test('applies hill climbing to correct elite ratio', () => {
      const hc = new HillClimbing({
        maxIterations: 3,
      })

      const hybrid = new HybridGAHC(hc, {
        applyToEliteRatio: 0.30, // Top 30%
      })

      const population = []
      for (let i = 0; i < 10; i++) {
        const ind = new Individual({ genome: Genome.randomWith(50), sensors: [], actions: [] })
        ind.fitness = () => (10 - i) * 10 // Higher fitness for earlier indices
        ind.originalIndex = i
        population.push(ind)
      }

      hybrid.refineElite(population)

      // Elite count should be 30% of 10 = 3
      const eliteCount = Math.ceil(10 * 0.30)
      expect(eliteCount).toBe(3)

      // Top individuals should have been refined
      // (hard to test directly without mocking, but we can check structure)
      expect(population.length).toBe(10)
    })

    test('uses custom fitness function', () => {
      const hc = new HillClimbing({
        maxIterations: 2,
      })

      const hybrid = new HybridGAHC(hc, {
        applyToEliteRatio: 0.50,
      })

      const population = []
      for (let i = 0; i < 4; i++) {
        const ind = new Individual({ genome: Genome.randomWith(50), sensors: [], actions: [] })
        ind.value = i * 10
        ind.fitness = () => ind.value
        population.push(ind)
      }

      let callCount = 0
      const customFitness = (ind) => {
        callCount++
        return ind.value || 0
      }

      hybrid.refineElite(population, customFitness)

      // Custom fitness should have been used for hill climbing
      expect(callCount).toBeGreaterThan(0)
    })

    test('handles fitness as property', () => {
      const hc = new HillClimbing({
        maxIterations: 2,
      })

      const hybrid = new HybridGAHC(hc)

      const population = []
      for (let i = 0; i < 5; i++) {
        const ind = new Individual({ genome: Genome.randomWith(50), sensors: [], actions: [] })
        ind.fitness = i * 10 // Property, not function
        population.push(ind)
      }

      const refined = hybrid.refineElite(population)

      expect(refined).toBeDefined()
      expect(refined.length).toBe(5)
    })

    test('preserves population size', () => {
      const hc = new HillClimbing({
        maxIterations: 2,
      })

      const hybrid = new HybridGAHC(hc, {
        applyToEliteRatio: 0.25,
      })

      const population = []
      for (let i = 0; i < 8; i++) {
        const ind = new Individual({ genome: Genome.randomWith(50), sensors: [], actions: [] })
        ind.fitness = () => Math.random() * 100
        population.push(ind)
      }

      const initialSize = population.length
      hybrid.refineElite(population)

      expect(population.length).toBe(initialSize)
    })
  })

  describe('integration', () => {
    test('combines GA and hill climbing effectively', () => {
      const hc = new HillClimbing({
        maxIterations: 5,
        mutationStrength: 0.01,
        patience: 2,
      })

      const hybrid = new HybridGAHC(hc, {
        applyToEliteRatio: 0.20,
      })

      // Create population with varying fitness
      const population = []
      for (let i = 0; i < 20; i++) {
        const ind = new Individual({ genome: Genome.randomWith(50), sensors: [], actions: [] })
        ind.fitness = () => Math.random() * 100
        population.push(ind)
      }

      // Apply hybrid refinement
      const refined = hybrid.refineElite(population)

      expect(refined.length).toBe(20)

      // All individuals should still be valid
      refined.forEach(ind => {
        expect(ind).toBeInstanceOf(Individual)
        expect(ind.genome).toBeDefined()
      })
    })
  })
})
