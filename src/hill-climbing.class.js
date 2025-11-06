/**
 * Hill Climbing - Local search optimization
 *
 * Combines with GA for hybrid approach:
 * - GA provides global exploration
 * - Hill Climbing provides local exploitation
 *
 * Apply hill climbing to elite individuals for refinement
 */

import { Reproduction } from './reproduction.class.js'
import { validatePositiveInteger, validateRatio } from './utils/validation.js'

export class HillClimbing {
  constructor(options = {}) {
    const {
      maxIterations = 10,          // Max hill climbing iterations
      mutationStrength = 0.001,     // Small mutations for local search
      patience = 3,                 // Stop after N iterations without improvement
    } = options

    validatePositiveInteger(maxIterations, 'maxIterations')
    validateRatio(mutationStrength, 'mutationStrength')
    validatePositiveInteger(patience, 'patience')

    this.maxIterations = maxIterations
    this.mutationStrength = mutationStrength
    this.patience = patience
  }

  /**
   * Apply hill climbing to a single individual
   *
   * @param {Individual} individual - Individual to optimize
   * @param {Function} fitnessFunc - Fitness evaluation function
   * @returns {Individual} - Improved individual
   */
  climb(individual, fitnessFunc = null) {
    const evaluate = fitnessFunc || ((ind) =>
      typeof ind.fitness === 'function' ? ind.fitness() : ind.fitness
    )

    let current = individual
    let currentFitness = evaluate(current)
    let bestFitness = currentFitness
    let noImprovementCount = 0

    for (let i = 0; i < this.maxIterations; i++) {
      // Create neighbor by small mutation
      const neighbor = this._createNeighbor(current)
      const neighborFitness = evaluate(neighbor)

      // If neighbor is better, move to it
      if (neighborFitness > currentFitness) {
        current = neighbor
        currentFitness = neighborFitness

        if (currentFitness > bestFitness) {
          bestFitness = currentFitness
          noImprovementCount = 0
        }
      } else {
        noImprovementCount++
      }

      // Early stopping if no improvement
      if (noImprovementCount >= this.patience) {
        break
      }
    }

    return current
  }

  /**
   * Apply hill climbing to multiple individuals in parallel
   *
   * @param {Array} individuals - Individuals to optimize
   * @param {Function} fitnessFunc - Fitness evaluation function
   * @returns {Array} - Improved individuals
   */
  climbPopulation(individuals, fitnessFunc = null) {
    return individuals.map(ind => this.climb(ind, fitnessFunc))
  }

  /**
   * Create a neighbor by small mutation
   * @private
   */
  _createNeighbor(individual) {
    // Clone the individual
    const IndClass = individual.constructor
    const sensors = individual._sensors || []
    const actions = individual._actions || []
    const neuronCount = individual.brain?.definitions?.neurons
      ? Object.keys(individual.brain.definitions.neurons).length
      : 0

    const neighborGenome = Reproduction.genomeMutate(individual.genome, {
      mutationRate: this.mutationStrength,
      maxSensorId: Math.max(0, sensors.length - 1),
      maxActionId: Math.max(0, actions.length - 1),
      maxNeuronId: Math.max(0, neuronCount - 1)
    })

    // Create new individual with mutated genome
    const neighbor = new IndClass({
      genome: neighborGenome,
      sensors,
      actions,
      environment: individual.environment || {},
    })

    return neighbor
  }
}

/**
 * Hybrid GA + Hill Climbing optimizer
 *
 * Applies hill climbing to elite individuals after each generation
 */
export class HybridGAHC {
  constructor(hillClimbing, options = {}) {
    const {
      applyToEliteRatio = 0.10,  // Apply hill climbing to top 10%
    } = options

    validateRatio(applyToEliteRatio, 'applyToEliteRatio')

    this.hillClimbing = hillClimbing
    this.applyToEliteRatio = applyToEliteRatio
  }

  /**
   * Refine elite individuals using hill climbing
   *
   * @param {Array} population - Population
   * @param {Function} fitnessFunc - Fitness function
   * @returns {Array} - Population with refined elite
   */
  refineElite(population, fitnessFunc = null) {
    // Sort by fitness
    const sorted = [...population].sort((a, b) => {
      const fitA = typeof a.fitness === 'function' ? a.fitness() : a.fitness
      const fitB = typeof b.fitness === 'function' ? b.fitness() : b.fitness
      return fitB - fitA
    })

    // Select elite
    const eliteCount = Math.ceil(population.length * this.applyToEliteRatio)
    const elite = sorted.slice(0, eliteCount)

    // Apply hill climbing to elite
    const refined = this.hillClimbing.climbPopulation(elite, fitnessFunc)

    // Replace elite in population
    for (let i = 0; i < eliteCount; i++) {
      const idx = population.indexOf(sorted[i])
      if (idx !== -1) {
        population[idx] = refined[i]
      }
    }

    return population
  }
}
