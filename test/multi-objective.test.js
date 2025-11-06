import { MultiObjective } from '../src/multi-objective.class.js'
import { Individual } from '../src/individual.class.js'
import { Genome } from '../src/genome.class.js'

describe('MultiObjective', () => {
  describe('constructor', () => {
    test('creates with objectives', () => {
      const mo = new MultiObjective({
        objectives: ['speed', 'accuracy', 'cost']
      })

      expect(mo.objectives).toEqual(['speed', 'accuracy', 'cost'])
    })

    test('creates with empty objectives by default', () => {
      const mo = new MultiObjective()

      expect(mo.objectives).toEqual([])
    })
  })

  describe('dominates', () => {
    test('identifies domination correctly', () => {
      const mo = new MultiObjective({
        objectives: ['obj1', 'obj2']
      })

      const solutionA = { obj1: 10, obj2: 20 }
      const solutionB = { obj1: 5, obj2: 15 }

      expect(mo.dominates(solutionA, solutionB)).toBe(true)
      expect(mo.dominates(solutionB, solutionA)).toBe(false)
    })

    test('identical solutions do not dominate', () => {
      const mo = new MultiObjective({
        objectives: ['obj1', 'obj2']
      })

      const solutionA = { obj1: 10, obj2: 20 }
      const solutionB = { obj1: 10, obj2: 20 }

      expect(mo.dominates(solutionA, solutionB)).toBe(false)
      expect(mo.dominates(solutionB, solutionA)).toBe(false)
    })

    test('better in one but worse in another does not dominate', () => {
      const mo = new MultiObjective({
        objectives: ['obj1', 'obj2']
      })

      const solutionA = { obj1: 10, obj2: 5 }
      const solutionB = { obj1: 5, obj2: 10 }

      expect(mo.dominates(solutionA, solutionB)).toBe(false)
      expect(mo.dominates(solutionB, solutionA)).toBe(false)
    })

    test('better in all objectives dominates', () => {
      const mo = new MultiObjective({
        objectives: ['obj1', 'obj2', 'obj3']
      })

      const solutionA = { obj1: 10, obj2: 10, obj3: 10 }
      const solutionB = { obj1: 5, obj2: 5, obj3: 5 }

      expect(mo.dominates(solutionA, solutionB)).toBe(true)
    })
  })

  describe('fastNonDominatedSort', () => {
    test('sorts population into Pareto fronts', () => {
      const mo = new MultiObjective({
        objectives: ['obj1', 'obj2']
      })

      const population = [
        { obj1: 10, obj2: 10 }, // Front 0
        { obj1: 5, obj2: 15 },  // Front 0
        { obj1: 15, obj2: 5 },  // Front 0
        { obj1: 5, obj2: 5 },   // Front 1
        { obj1: 3, obj2: 3 },   // Front 2
      ]

      const fronts = mo.fastNonDominatedSort(population)

      expect(fronts.length).toBeGreaterThan(0)
      expect(fronts[0].length).toBeGreaterThan(0)

      // First front should contain non-dominated solutions
      fronts[0].forEach(solution => {
        expect(solution._rank).toBe(0)
      })
    })

    test('handles single solution', () => {
      const mo = new MultiObjective({
        objectives: ['obj1', 'obj2']
      })

      const population = [
        { obj1: 10, obj2: 10 },
      ]

      const fronts = mo.fastNonDominatedSort(population)

      expect(fronts.length).toBe(1)
      expect(fronts[0].length).toBe(1)
      expect(fronts[0][0]._rank).toBe(0)
    })

    test('assigns correct ranks', () => {
      const mo = new MultiObjective({
        objectives: ['obj1', 'obj2']
      })

      const population = [
        { obj1: 10, obj2: 10 },
        { obj1: 5, obj2: 5 },
        { obj1: 2, obj2: 2 },
      ]

      const fronts = mo.fastNonDominatedSort(population)

      // Each solution should be in a different front
      expect(fronts[0][0]._rank).toBe(0)
      if (fronts[1]) expect(fronts[1][0]._rank).toBe(1)
    })
  })

  describe('calculateCrowdingDistance', () => {
    test('calculates crowding distance', () => {
      const mo = new MultiObjective({
        objectives: ['obj1', 'obj2']
      })

      const front = [
        { obj1: 0, obj2: 10 },
        { obj1: 5, obj2: 5 },
        { obj1: 10, obj2: 0 },
      ]

      mo.calculateCrowdingDistance(front)

      // Boundary solutions should have infinite distance
      expect(front[0]._crowdingDistance).toBe(Infinity)
      expect(front[front.length - 1]._crowdingDistance).toBe(Infinity)

      // Middle solution should have finite distance
      expect(front[1]._crowdingDistance).toBeGreaterThanOrEqual(0)
      expect(front[1]._crowdingDistance).toBeLessThan(Infinity)
    })

    test('handles empty front', () => {
      const mo = new MultiObjective({
        objectives: ['obj1', 'obj2']
      })

      const front = []

      expect(() => mo.calculateCrowdingDistance(front)).not.toThrow()
    })

    test('handles single solution in front', () => {
      const mo = new MultiObjective({
        objectives: ['obj1', 'obj2']
      })

      const front = [
        { obj1: 5, obj2: 5 },
      ]

      mo.calculateCrowdingDistance(front)

      expect(front[0]._crowdingDistance).toBe(Infinity)
    })

    test('handles zero range', () => {
      const mo = new MultiObjective({
        objectives: ['obj1', 'obj2']
      })

      const front = [
        { obj1: 5, obj2: 5 },
        { obj1: 5, obj2: 5 },
        { obj1: 5, obj2: 5 },
      ]

      expect(() => mo.calculateCrowdingDistance(front)).not.toThrow()
    })
  })

  describe('evaluatePopulation', () => {
    test('evaluates population with multiple objectives', () => {
      const mo = new MultiObjective({
        objectives: ['fitness', 'efficiency']
      })

      const population = []
      for (let i = 0; i < 10; i++) {
        const ind = new Individual({ genome: Genome.randomWith(50) })
        ind.value = i * 10
        population.push(ind)
      }

      const result = mo.evaluatePopulation(population, {
        fitness: (ind) => ind.value,
        efficiency: (ind) => 100 - ind.value,
      })

      expect(result.fronts).toBeDefined()
      expect(result.paretoFront).toBeDefined()
      expect(Array.isArray(result.fronts)).toBe(true)
      expect(result.fronts.length).toBeGreaterThan(0)

      // All individuals should have objective values
      population.forEach(ind => {
        expect(ind.fitness).toBeDefined()
        expect(ind.efficiency).toBeDefined()
      })
    })

    test('throws error for missing objective function', () => {
      const mo = new MultiObjective({
        objectives: ['fitness', 'efficiency']
      })

      const population = [
        new Individual({ genome: Genome.randomWith(50) }),
      ]

      expect(() => {
        mo.evaluatePopulation(population, {
          fitness: (ind) => 100,
          // efficiency is missing
        })
      }).toThrow("Objective function 'efficiency' not provided")
    })

    test('assigns ranks and crowding distances', () => {
      const mo = new MultiObjective({
        objectives: ['obj1', 'obj2']
      })

      const population = []
      for (let i = 0; i < 5; i++) {
        const ind = new Individual({ genome: Genome.randomWith(50) })
        population.push(ind)
      }

      mo.evaluatePopulation(population, {
        obj1: (ind, i) => i * 10,
        obj2: (ind, i) => 50 - i * 10,
      })

      // All individuals should have rank and crowding distance
      population.forEach(ind => {
        expect(ind._rank).toBeDefined()
        expect(ind._crowdingDistance).toBeDefined()
      })
    })
  })

  describe('select', () => {
    test('selects best individuals by rank and crowding distance', () => {
      const mo = new MultiObjective({
        objectives: ['obj1', 'obj2']
      })

      const population = []
      for (let i = 0; i < 10; i++) {
        const ind = new Individual({ genome: Genome.randomWith(50) })
        ind._rank = i < 5 ? 0 : 1
        ind._crowdingDistance = i * 10
        population.push(ind)
      }

      const selected = mo.select(population, 5)

      expect(selected.length).toBe(5)

      // Selected should be sorted by rank first
      for (let i = 1; i < selected.length; i++) {
        expect(selected[i]._rank).toBeGreaterThanOrEqual(selected[i - 1]._rank)
      }
    })

    test('prefers higher crowding distance within same rank', () => {
      const mo = new MultiObjective({
        objectives: ['obj1', 'obj2']
      })

      const population = [
        Object.assign(new Individual({ genome: Genome.randomWith(50) }), { _rank: 0, _crowdingDistance: 10 }),
        Object.assign(new Individual({ genome: Genome.randomWith(50) }), { _rank: 0, _crowdingDistance: 100 }),
        Object.assign(new Individual({ genome: Genome.randomWith(50) }), { _rank: 0, _crowdingDistance: 50 }),
      ]

      const selected = mo.select(population, 3)

      expect(selected[0]._crowdingDistance).toBe(100)
      expect(selected[1]._crowdingDistance).toBe(50)
      expect(selected[2]._crowdingDistance).toBe(10)
    })

    test('selects fewer than requested if population is small', () => {
      const mo = new MultiObjective({
        objectives: ['obj1', 'obj2']
      })

      const population = [
        Object.assign(new Individual({ genome: Genome.randomWith(50) }), { _rank: 0, _crowdingDistance: 10 }),
        Object.assign(new Individual({ genome: Genome.randomWith(50) }), { _rank: 0, _crowdingDistance: 20 }),
      ]

      const selected = mo.select(population, 10)

      expect(selected.length).toBe(2)
    })
  })

  describe('getParetoFront', () => {
    test('returns Pareto front', () => {
      const mo = new MultiObjective({
        objectives: ['obj1', 'obj2']
      })

      const population = [
        { obj1: 10, obj2: 10 },
        { obj1: 5, obj2: 15 },
        { obj1: 15, obj2: 5 },
        { obj1: 3, obj2: 3 },
      ]

      const front = mo.getParetoFront(population)

      expect(Array.isArray(front)).toBe(true)
      expect(front.length).toBeGreaterThan(0)

      // All in Pareto front should be non-dominated
      front.forEach(solution => {
        expect(solution._rank).toBe(0)
      })
    })

    test('returns empty array for empty population', () => {
      const mo = new MultiObjective({
        objectives: ['obj1', 'obj2']
      })

      const front = mo.getParetoFront([])

      expect(front).toEqual([])
    })
  })

  describe('integration with Individual', () => {
    test('works with real individuals and fitness', () => {
      const mo = new MultiObjective({
        objectives: ['fitness', 'complexity']
      })

      const population = []
      for (let i = 0; i < 20; i++) {
        const ind = new Individual({ genome: Genome.randomWith(50) })
        ind.fitness = () => Math.random() * 100
        ind.complexity = () => Math.random() * 50
        population.push(ind)
      }

      const { fronts, paretoFront } = mo.evaluatePopulation(population, {
        fitness: (ind) => ind.fitness(),
        complexity: (ind) => -ind.complexity(), // Minimize complexity
      })

      expect(fronts.length).toBeGreaterThan(0)
      expect(paretoFront.length).toBeGreaterThan(0)

      // Select top 10
      const selected = mo.select(population, 10)
      expect(selected.length).toBe(10)

      // Verify all selected have ranks assigned
      selected.forEach(ind => {
        expect(ind._rank).toBeDefined()
        expect(ind._crowdingDistance).toBeDefined()
      })

      // Verify sorting: each should have rank <= next
      for (let i = 1; i < selected.length; i++) {
        if (selected[i]._rank === selected[i-1]._rank) {
          // Same rank: higher crowding distance comes first
          expect(selected[i]._crowdingDistance).toBeLessThanOrEqual(selected[i-1]._crowdingDistance)
        } else {
          // Different rank: rank should be >= previous
          expect(selected[i]._rank).toBeGreaterThanOrEqual(selected[i-1]._rank)
        }
      }
    })
  })
})
