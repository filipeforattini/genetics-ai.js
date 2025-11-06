/**
 * Novelty Search - Reward novel behaviors instead of optimizing fitness
 *
 * Instead of selecting for high fitness, select for behavioral novelty.
 * This encourages exploration and can discover solutions that
 * gradient-based search would miss.
 *
 * Based on:
 * - Lehman & Stanley (2011) - "Abandoning Objectives"
 * - Behavior characterization via descriptor vectors
 * - k-nearest neighbors novelty metric
 */

import { validatePositiveInteger, validateRatio } from './utils/validation.js'

export class NoveltySearch {
  constructor(options = {}) {
    const {
      k = 15,                      // k-nearest neighbors for novelty calculation
      archiveThreshold = 0.9,      // Minimum novelty to add to archive (percentile)
      maxArchiveSize = 1000,       // Maximum archive size
      behaviorDistance = null,      // Custom distance function
    } = options

    validatePositiveInteger(k, 'k')
    validateRatio(archiveThreshold, 'archiveThreshold')
    validatePositiveInteger(maxArchiveSize, 'maxArchiveSize')

    this.k = k
    this.archiveThreshold = archiveThreshold
    this.maxArchiveSize = maxArchiveSize
    this.behaviorDistance = behaviorDistance || this.defaultBehaviorDistance

    this.archive = []           // Archive of novel behaviors
    this.currentGeneration = []  // Current generation behaviors
  }

  /**
   * Default behavior distance function (Euclidean distance)
   * Override with custom function for domain-specific behaviors
   *
   * @param {Array} behavior1 - Behavior descriptor vector
   * @param {Array} behavior2 - Behavior descriptor vector
   * @returns {number} - Distance between behaviors
   */
  defaultBehaviorDistance(behavior1, behavior2) {
    if (!Array.isArray(behavior1) || !Array.isArray(behavior2)) {
      throw new Error('Behaviors must be arrays')
    }

    if (behavior1.length !== behavior2.length) {
      throw new Error('Behavior vectors must have same length')
    }

    // Euclidean distance
    let sum = 0
    for (let i = 0; i < behavior1.length; i++) {
      const diff = behavior1[i] - behavior2[i]
      sum += diff * diff
    }

    return Math.sqrt(sum)
  }

  /**
   * Calculate novelty score for a behavior
   *
   * Novelty = average distance to k-nearest neighbors
   * Higher score = more novel behavior
   *
   * @param {Array} behavior - Behavior descriptor
   * @param {Array} population - Population to compare against
   * @returns {number} - Novelty score
   */
  calculateNovelty(behavior, population = null) {
    const compareSet = population || [...this.archive, ...this.currentGeneration]

    if (compareSet.length === 0) {
      return 1.0  // First behavior is maximally novel
    }

    // Calculate distances to all behaviors
    const distances = compareSet.map(other => ({
      distance: this.behaviorDistance(behavior, other.behavior || other)
    }))

    // Sort by distance
    distances.sort((a, b) => a.distance - b.distance)

    // Average distance to k-nearest neighbors
    const kNearest = Math.min(this.k, distances.length)
    const sum = distances.slice(0, kNearest).reduce((acc, d) => acc + d.distance, 0)

    return sum / kNearest
  }

  /**
   * Evaluate population and assign novelty scores
   *
   * @param {Array} population - Population of individuals
   * @param {Function} behaviorExtractor - Function to extract behavior from individual
   * @returns {Array} - Novelty scores for each individual
   */
  evaluatePopulation(population, behaviorExtractor) {
    // Extract behaviors
    this.currentGeneration = population.map(ind => ({
      individual: ind,
      behavior: behaviorExtractor(ind)
    }))

    // Calculate novelty for each individual
    const noveltyScores = this.currentGeneration.map(({ behavior }) => {
      return this.calculateNovelty(behavior, this.currentGeneration)
    })

    // Store novelty scores on individuals
    population.forEach((ind, i) => {
      ind._noveltyScore = noveltyScores[i]
    })

    // Update archive with novel behaviors
    this.updateArchive()

    return noveltyScores
  }

  /**
   * Update archive with sufficiently novel behaviors
   */
  updateArchive() {
    if (this.currentGeneration.length === 0) return

    // Calculate all novelty scores
    const withScores = this.currentGeneration.map(item => ({
      ...item,
      novelty: this.calculateNovelty(item.behavior)
    }))

    // Sort by novelty (descending)
    withScores.sort((a, b) => b.novelty - a.novelty)

    // Determine threshold (top archiveThreshold percentile)
    const thresholdIndex = Math.floor(withScores.length * (1 - this.archiveThreshold))
    const thresholdScore = withScores[thresholdIndex]?.novelty || 0

    // Add behaviors above threshold to archive
    for (const item of withScores) {
      if (item.novelty >= thresholdScore) {
        this.archive.push({
          behavior: item.behavior,
          novelty: item.novelty,
          generation: this.generation
        })
      }
    }

    // Limit archive size (keep most novel)
    if (this.archive.length > this.maxArchiveSize) {
      this.archive.sort((a, b) => b.novelty - a.novelty)
      this.archive = this.archive.slice(0, this.maxArchiveSize)
    }
  }

  /**
   * Get individuals sorted by novelty
   *
   * @param {Array} population - Population
   * @returns {Array} - Sorted population (most novel first)
   */
  sortByNovelty(population) {
    return [...population].sort((a, b) => {
      const noveltyA = a._noveltyScore !== undefined ? a._noveltyScore : 0
      const noveltyB = b._noveltyScore !== undefined ? b._noveltyScore : 0
      return noveltyB - noveltyA
    })
  }

  /**
   * Get archive statistics
   *
   * @returns {Object} - Archive metadata
   */
  getStats() {
    return {
      archiveSize: this.archive.length,
      maxArchiveSize: this.maxArchiveSize,
      currentGenerationSize: this.currentGeneration.length,
      averageNovelty: this.archive.length > 0
        ? this.archive.reduce((sum, item) => sum + item.novelty, 0) / this.archive.length
        : 0
    }
  }

  /**
   * Clear current generation (call between generations)
   */
  nextGeneration() {
    this.currentGeneration = []
    this.generation = (this.generation || 0) + 1
  }
}

/**
 * Hybrid Fitness + Novelty selection
 *
 * Combines traditional fitness with novelty search
 * Useful for maintaining both quality and diversity
 */
export class HybridNoveltyFitness {
  constructor(noveltySearch, options = {}) {
    const {
      noveltyWeight = 0.5,   // Weight for novelty (0 = pure fitness, 1 = pure novelty)
      fitnessWeight = 0.5,   // Weight for fitness
    } = options

    validateRatio(noveltyWeight, 'noveltyWeight')
    validateRatio(fitnessWeight, 'fitnessWeight')

    this.noveltySearch = noveltySearch
    this.noveltyWeight = noveltyWeight
    this.fitnessWeight = fitnessWeight
  }

  /**
   * Calculate combined score
   *
   * @param {Individual} individual - Individual to score
   * @returns {number} - Combined score
   */
  calculateScore(individual) {
    const fitness = typeof individual.fitness === 'function'
      ? individual.fitness()
      : individual.fitness

    const novelty = individual._noveltyScore || 0

    // Normalize both to [0, 1] if needed
    // (assumes fitness and novelty are already on similar scales)

    return (this.fitnessWeight * fitness) + (this.noveltyWeight * novelty)
  }

  /**
   * Evaluate population with hybrid scoring
   *
   * @param {Array} population - Population
   * @param {Function} behaviorExtractor - Function to extract behavior
   * @returns {Array} - Combined scores
   */
  evaluatePopulation(population, behaviorExtractor) {
    // Calculate novelty scores
    this.noveltySearch.evaluatePopulation(population, behaviorExtractor)

    // Calculate combined scores
    const scores = population.map(ind => this.calculateScore(ind))

    // Store on individuals
    population.forEach((ind, i) => {
      ind._hybridScore = scores[i]
    })

    return scores
  }

  /**
   * Sort by hybrid score
   */
  sortByScore(population) {
    return [...population].sort((a, b) => {
      const scoreA = a._hybridScore !== undefined ? a._hybridScore : 0
      const scoreB = b._hybridScore !== undefined ? b._hybridScore : 0
      return scoreB - scoreA
    })
  }
}
