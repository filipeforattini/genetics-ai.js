/**
 * Multi-Objective Optimization using Pareto dominance and crowding distance
 *
 * Based on NSGA-II (Deb et al., 2002)
 * - Non-dominated sorting
 * - Crowding distance
 * - Elitism
 *
 * Use when optimizing multiple conflicting objectives simultaneously
 * (e.g., speed vs accuracy, cost vs quality)
 */

export class MultiObjective {
  constructor(options = {}) {
    const {
      objectives = [],  // Array of objective names
    } = options

    this.objectives = objectives
  }

  /**
   * Check if solution A dominates solution B
   *
   * A dominates B if:
   * - A is better or equal in ALL objectives
   * - A is strictly better in AT LEAST ONE objective
   *
   * @param {Object} solutionA - First solution with objectives
   * @param {Object} solutionB - Second solution with objectives
   * @returns {boolean} - True if A dominates B
   */
  dominates(solutionA, solutionB) {
    let betterInAtLeastOne = false
    let worseInAny = false

    for (const obj of this.objectives) {
      const valueA = solutionA[obj]
      const valueB = solutionB[obj]

      if (valueA > valueB) {
        betterInAtLeastOne = true
      } else if (valueA < valueB) {
        worseInAny = true
      }
    }

    return betterInAtLeastOne && !worseInAny
  }

  /**
   * Fast non-dominated sorting (NSGA-II)
   *
   * Ranks population into Pareto fronts:
   * - Front 0: Non-dominated solutions (Pareto front)
   * - Front 1: Dominated only by front 0
   * - Front 2: Dominated only by fronts 0 and 1
   * - etc.
   *
   * @param {Array} population - Population with objective values
   * @returns {Array} - Array of fronts, each front is an array of solutions
   */
  fastNonDominatedSort(population) {
    const fronts = [[]]

    // For each solution, track:
    // - dominatedBy: count of solutions that dominate it
    // - dominates: set of solutions it dominates
    population.forEach(p => {
      p._dominatedBy = 0
      p._dominates = []
    })

    // Calculate domination relationships
    for (let i = 0; i < population.length; i++) {
      for (let j = i + 1; j < population.length; j++) {
        const p = population[i]
        const q = population[j]

        if (this.dominates(p, q)) {
          p._dominates.push(q)
          q._dominatedBy++
        } else if (this.dominates(q, p)) {
          q._dominates.push(p)
          p._dominatedBy++
        }
      }
    }

    // Front 0: non-dominated solutions
    population.forEach(p => {
      if (p._dominatedBy === 0) {
        p._rank = 0
        fronts[0].push(p)
      }
    })

    // Generate subsequent fronts
    let i = 0
    while (i < fronts.length && fronts[i].length > 0) {
      const nextFront = []

      for (const p of fronts[i]) {
        for (const q of p._dominates) {
          q._dominatedBy--

          if (q._dominatedBy === 0) {
            q._rank = i + 1
            nextFront.push(q)
          }
        }
      }

      if (nextFront.length > 0) {
        fronts.push(nextFront)
      }
      i++
    }

    return fronts.filter(f => f.length > 0)
  }

  /**
   * Calculate crowding distance for solutions in a front
   *
   * Crowding distance = sum of distances to nearest neighbors for each objective
   * Higher distance = more isolated = more valuable for diversity
   *
   * @param {Array} front - Solutions in the same Pareto front
   */
  calculateCrowdingDistance(front) {
    if (front.length === 0) return

    // Initialize distances
    front.forEach(p => p._crowdingDistance = 0)

    // For each objective
    for (const obj of this.objectives) {
      // Sort by objective value
      front.sort((a, b) => a[obj] - b[obj])

      // Boundary solutions get infinite distance
      front[0]._crowdingDistance = Infinity
      front[front.length - 1]._crowdingDistance = Infinity

      // Normalize objective range
      const minValue = front[0][obj]
      const maxValue = front[front.length - 1][obj]
      const range = maxValue - minValue

      if (range === 0) continue

      // Calculate crowding distance for middle solutions
      for (let i = 1; i < front.length - 1; i++) {
        const distance = (front[i + 1][obj] - front[i - 1][obj]) / range
        front[i]._crowdingDistance += distance
      }
    }
  }

  /**
   * Evaluate population with multiple objectives
   *
   * @param {Array} population - Population of individuals
   * @param {Object} objectiveFunctions - Map of objective name to function
   * @returns {Object} - { fronts, rankings }
   */
  evaluatePopulation(population, objectiveFunctions) {
    // Evaluate all objectives for each individual
    population.forEach(ind => {
      for (const objName of this.objectives) {
        const objFunc = objectiveFunctions[objName]
        if (!objFunc) {
          throw new Error(`Objective function '${objName}' not provided`)
        }

        ind[objName] = objFunc(ind)
      }
    })

    // Non-dominated sorting
    const fronts = this.fastNonDominatedSort(population)

    // Calculate crowding distance for each front
    fronts.forEach(front => this.calculateCrowdingDistance(front))

    return {
      fronts,
      paretoFront: fronts[0],  // Best solutions
    }
  }

  /**
   * Select best individuals using Pareto ranking and crowding distance
   *
   * @param {Array} population - Population
   * @param {number} count - Number to select
   * @returns {Array} - Selected individuals
   */
  select(population, count) {
    // Sort by rank, then by crowding distance
    const sorted = [...population].sort((a, b) => {
      // First compare rank (lower is better)
      if (a._rank !== b._rank) {
        return a._rank - b._rank
      }

      // Same rank: prefer higher crowding distance (more diverse)
      return b._crowdingDistance - a._crowdingDistance
    })

    return sorted.slice(0, count)
  }

  /**
   * Get Pareto front (non-dominated solutions)
   *
   * @param {Array} population - Population
   * @returns {Array} - Pareto front
   */
  getParetoFront(population) {
    const fronts = this.fastNonDominatedSort(population)
    return fronts[0] || []
  }
}
