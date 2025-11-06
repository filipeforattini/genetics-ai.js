import { NoveltySearch, HybridNoveltyFitness } from '../src/novelty-search.class.js'
import { Individual } from '../src/individual.class.js'
import { Genome } from '../src/genome.class.js'

describe('NoveltySearch', () => {
  describe('constructor', () => {
    test('creates with default options', () => {
      const novelty = new NoveltySearch()

      expect(novelty.k).toBe(15)
      expect(novelty.archiveThreshold).toBe(0.9)
      expect(novelty.maxArchiveSize).toBe(1000)
      expect(novelty.archive).toEqual([])
    })

    test('creates with custom options', () => {
      const novelty = new NoveltySearch({
        k: 10,
        archiveThreshold: 0.8,
        maxArchiveSize: 500
      })

      expect(novelty.k).toBe(10)
      expect(novelty.archiveThreshold).toBe(0.8)
      expect(novelty.maxArchiveSize).toBe(500)
    })

    test('accepts custom distance function', () => {
      const customDistance = (a, b) => Math.abs(a[0] - b[0])
      const novelty = new NoveltySearch({ behaviorDistance: customDistance })

      expect(novelty.behaviorDistance).toBe(customDistance)
    })
  })

  describe('behaviorDistance', () => {
    test('calculates euclidean distance', () => {
      const novelty = new NoveltySearch()

      const behavior1 = [0, 0, 0]
      const behavior2 = [3, 4, 0]

      const distance = novelty.behaviorDistance(behavior1, behavior2)

      expect(distance).toBe(5) // sqrt(3^2 + 4^2) = 5
    })

    test('uses custom distance function', () => {
      const customDistance = (a, b) => {
        return Math.abs(a[0] - b[0]) + Math.abs(a[1] - b[1])
      }

      const novelty = new NoveltySearch({ behaviorDistance: customDistance })

      const behavior1 = [0, 0]
      const behavior2 = [3, 4]

      const distance = novelty.behaviorDistance(behavior1, behavior2)

      expect(distance).toBe(7) // |3-0| + |4-0| = 7
    })
  })

  describe('calculateNovelty', () => {
    test('calculates novelty score', () => {
      const novelty = new NoveltySearch({ k: 3 })

      novelty.archive = [
        { behavior: [0, 0] },
        { behavior: [1, 1] },
        { behavior: [2, 2] },
        { behavior: [10, 10] },
      ]

      novelty.currentGeneration = [
        { behavior: [0.5, 0.5] },
        { behavior: [1.5, 1.5] },
      ]

      const behavior = [0, 0]
      const noveltyScore = novelty.calculateNovelty(behavior)

      expect(noveltyScore).toBeGreaterThan(0)
      expect(typeof noveltyScore).toBe('number')
    })

    test('higher novelty for distant behaviors', () => {
      const novelty = new NoveltySearch({ k: 2 })

      novelty.archive = [
        { behavior: [0, 0] },
        { behavior: [1, 0] },
      ]

      const closeScore = novelty.calculateNovelty([0.5, 0])
      const farScore = novelty.calculateNovelty([100, 100])

      expect(farScore).toBeGreaterThan(closeScore)
    })
  })

  describe('evaluatePopulation', () => {
    test('evaluates population novelty', () => {
      const novelty = new NoveltySearch({ k: 3 })

      const population = []
      for (let i = 0; i < 10; i++) {
        const ind = new Individual({ genome: Genome.randomWith(50) })
        ind.x = i * 10
        ind.y = i * 10
        population.push(ind)
      }

      const behaviorExtractor = (ind) => [ind.x, ind.y]

      const scores = novelty.evaluatePopulation(population, behaviorExtractor)

      expect(scores.length).toBe(10)
      expect(population[0]._noveltyScore).toBeDefined()
      expect(typeof population[0]._noveltyScore).toBe('number')
    })

    test('archives novel behaviors', () => {
      const novelty = new NoveltySearch({
        k: 2,
        archiveThreshold: 0.5
      })

      const population = []
      for (let i = 0; i < 5; i++) {
        const ind = new Individual({ genome: Genome.randomWith(50) })
        ind.x = i * 100
        ind.y = i * 100
        population.push(ind)
      }

      novelty.evaluatePopulation(population, (ind) => [ind.x, ind.y])

      expect(novelty.archive.length).toBeGreaterThan(0)
    })
  })

  describe('sortByNovelty', () => {
    test('sorts population by novelty score', () => {
      const novelty = new NoveltySearch()

      const population = []
      for (let i = 0; i < 5; i++) {
        const ind = new Individual({ genome: Genome.randomWith(50) })
        ind._noveltyScore = Math.random() * 100
        population.push(ind)
      }

      const sorted = novelty.sortByNovelty(population)

      expect(sorted.length).toBe(5)

      // Verify descending order
      for (let i = 1; i < sorted.length; i++) {
        expect(sorted[i - 1]._noveltyScore).toBeGreaterThanOrEqual(sorted[i]._noveltyScore)
      }
    })
  })

  describe('nextGeneration', () => {
    test('clears current generation', () => {
      const novelty = new NoveltySearch()

      novelty.currentGeneration = [
        { behavior: [1, 2] },
        { behavior: [3, 4] },
      ]

      novelty.nextGeneration()

      expect(novelty.currentGeneration).toEqual([])
    })
  })

  describe('nextGeneration', () => {
    test('clears current generation', () => {
      const novelty = new NoveltySearch()

      novelty.currentGeneration = [
        { behavior: [1, 2] },
        { behavior: [3, 4] },
      ]

      novelty.nextGeneration()

      expect(novelty.currentGeneration).toEqual([])
    })
  })

  describe('getStats', () => {
    test('returns statistics', () => {
      const novelty = new NoveltySearch()

      novelty.archive = [
        { behavior: [1, 2], novelty: 10 },
        { behavior: [3, 4], novelty: 20 },
        { behavior: [5, 6], novelty: 30 },
      ]

      const stats = novelty.getStats()

      expect(stats.archiveSize).toBe(3)
      expect(stats.maxArchiveSize).toBe(1000)
      expect(stats.currentGenerationSize).toBe(0)
      expect(stats.averageNovelty).toBe(20)
    })
  })
})

describe('HybridNoveltyFitness', () => {
  test('creates with novelty search and weights', () => {
    const novelty = new NoveltySearch()
    const hybrid = new HybridNoveltyFitness(novelty, {
      noveltyWeight: 0.6,
      fitnessWeight: 0.4
    })

    expect(hybrid.noveltySearch).toBe(novelty)
    expect(hybrid.noveltyWeight).toBe(0.6)
    expect(hybrid.fitnessWeight).toBe(0.4)
  })

  test('evaluates hybrid fitness', () => {
    const novelty = new NoveltySearch({ k: 2 })
    const hybrid = new HybridNoveltyFitness(novelty)

    const population = []
    for (let i = 0; i < 5; i++) {
      const ind = new Individual({ genome: Genome.randomWith(50) })
      ind.fitness = () => 100 + i * 10
      ind.x = i * 10
      population.push(ind)
    }

    const scores = hybrid.evaluatePopulation(
      population,
      (ind) => [ind.x, 0]
    )

    expect(scores.length).toBe(5)
    expect(population[0]._hybridScore).toBeDefined()
    expect(typeof population[0]._hybridScore).toBe('number')
  })

  test('combines fitness and novelty correctly', () => {
    const novelty = new NoveltySearch({ k: 2 })
    const hybrid = new HybridNoveltyFitness(novelty, {
      noveltyWeight: 0.5,
      fitnessWeight: 0.5
    })

    const population = [
      Object.assign(new Individual({ genome: Genome.randomWith(50) }), { fitness: () => 100, x: 0 }),
      Object.assign(new Individual({ genome: Genome.randomWith(50) }), { fitness: () => 50, x: 100 }),
    ]

    hybrid.evaluatePopulation(population, (ind) => [ind.x, 0])

    // Both should have hybrid scores
    expect(population[0]._hybridScore).toBeDefined()
    expect(population[1]._hybridScore).toBeDefined()
  })
})
