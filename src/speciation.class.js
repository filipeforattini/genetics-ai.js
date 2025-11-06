/**
 * Speciation - NEAT-style species management
 *
 * Maintains multiple evolutionary niches to preserve diversity
 * and prevent premature convergence to local optima.
 *
 * Based on:
 * - Stanley & Miikkulainen (2002) - NEAT paper
 * - Species are groups of similar individuals
 * - Each species evolves independently
 * - Resources shared within species
 */

import { validatePositiveInteger, validateRatio } from './utils/validation.js'

export class Species {
  constructor(id, representative) {
    this.id = id
    this.representative = representative  // Genome that defines this species
    this.members = []
    this.age = 0
    this.maxFitness = 0
    this.maxFitnessAge = 0  // Generations since improvement
    this.averageFitness = 0
  }

  /**
   * Add member to species
   */
  addMember(individual) {
    this.members.push(individual)
    individual.species = this.id
  }

  /**
   * Calculate adjusted fitness for this species
   * Fitness sharing: divide by species size to promote diversity
   */
  calculateAdjustedFitness() {
    if (this.members.length === 0) {
      this.averageFitness = 0
      return
    }

    // Sum of raw fitness
    const totalFitness = this.members.reduce((sum, ind) => {
      const fitness = typeof ind.fitness === 'function' ? ind.fitness() : ind.fitness
      return sum + fitness
    }, 0)

    // Fitness sharing: divide by species size
    this.averageFitness = totalFitness / this.members.length

    // Track max fitness
    const currentMax = Math.max(...this.members.map(ind =>
      typeof ind.fitness === 'function' ? ind.fitness() : ind.fitness
    ))

    if (currentMax > this.maxFitness) {
      this.maxFitness = currentMax
      this.maxFitnessAge = 0
    } else {
      this.maxFitnessAge++
    }
  }

  /**
   * Select random member from species
   */
  randomMember() {
    if (this.members.length === 0) return null
    return this.members[Math.floor(Math.random() * this.members.length)]
  }

  /**
   * Get champion (best individual)
   */
  champion() {
    if (this.members.length === 0) return null

    return this.members.reduce((best, ind) => {
      const fitness = typeof ind.fitness === 'function' ? ind.fitness() : ind.fitness
      const bestFitness = typeof best.fitness === 'function' ? best.fitness() : best.fitness
      return fitness > bestFitness ? ind : best
    })
  }

  /**
   * Update species for next generation
   */
  nextGeneration() {
    this.age++
    this.members = []
  }
}

export class Speciation {
  constructor(options = {}) {
    const {
      compatibilityThreshold = 3.0,  // Distance threshold for same species
      c1 = 1.0,  // Coefficient for excess genes
      c2 = 1.0,  // Coefficient for disjoint genes
      c3 = 0.4,  // Coefficient for weight differences
      stagnationThreshold = 15,  // Generations without improvement before extinction
      survivalThreshold = 0.2,   // Top 20% of each species reproduce
      minSpeciesSize = 5,         // Minimum species size to avoid extinction
    } = options

    validateRatio(compatibilityThreshold / 10, 'compatibilityThreshold (normalized)')
    validateRatio(survivalThreshold, 'survivalThreshold')
    validatePositiveInteger(stagnationThreshold, 'stagnationThreshold')
    validatePositiveInteger(minSpeciesSize, 'minSpeciesSize')

    this.compatibilityThreshold = compatibilityThreshold
    this.c1 = c1
    this.c2 = c2
    this.c3 = c3
    this.stagnationThreshold = stagnationThreshold
    this.survivalThreshold = survivalThreshold
    this.minSpeciesSize = minSpeciesSize

    this.species = []
    this.nextSpeciesId = 0
  }

  /**
   * Calculate genetic distance between two genomes
   *
   * Based on NEAT distance metric:
   * δ = (c1 * E / N) + (c2 * D / N) + c3 * W̄
   *
   * where:
   * - E = number of excess genes
   * - D = number of disjoint genes
   * - W̄ = average weight difference of matching genes
   * - N = number of genes in larger genome
   */
  distance(genome1, genome2) {
    const bases1 = genome1.getBases()
    const bases2 = genome2.getBases()

    if (bases1.length === 0 && bases2.length === 0) return 0

    const maxLength = Math.max(bases1.length, bases2.length)
    const minLength = Math.min(bases1.length, bases2.length)

    // Simple distance: compare base types and values
    let matching = 0
    let weightDiff = 0

    for (let i = 0; i < minLength; i++) {
      const b1 = bases1[i]
      const b2 = bases2[i]

      if (b1.type === b2.type) {
        matching++

        // Compare weights/data
        if (b1.type === 'connection') {
          weightDiff += Math.abs((b1.weight || 0) - (b2.weight || 0))
        } else if (b1.type === 'bias') {
          weightDiff += Math.abs((b1.data || 0) - (b2.data || 0))
        }
      }
    }

    // Excess genes (beyond shorter genome)
    const excess = maxLength - minLength

    // Disjoint genes (within shorter genome but don't match)
    const disjoint = minLength - matching

    // Average weight difference
    const avgWeightDiff = matching > 0 ? weightDiff / matching : 0

    // NEAT distance formula
    const N = maxLength || 1  // Avoid division by zero
    const distance = (this.c1 * excess / N) + (this.c2 * disjoint / N) + (this.c3 * avgWeightDiff)

    return distance
  }

  /**
   * Assign individual to species
   * Creates new species if no compatible species found
   */
  assignToSpecies(individual) {
    // Try to find compatible species
    for (const species of this.species) {
      const dist = this.distance(individual.genome, species.representative.genome)

      if (dist < this.compatibilityThreshold) {
        species.addMember(individual)
        return species
      }
    }

    // No compatible species found, create new one
    const newSpecies = new Species(this.nextSpeciesId++, individual)
    newSpecies.addMember(individual)
    this.species.push(newSpecies)
    return newSpecies
  }

  /**
   * Speciate entire population
   */
  speciate(population) {
    // Age species and clear current members
    for (const species of this.species) {
      species.age++
      species.members = []
    }

    // Assign each individual to a species
    for (const individual of population) {
      this.assignToSpecies(individual)
    }

    // Remove empty species
    this.species = this.species.filter(s => s.members.length > 0)

    // Update species fitness
    for (const species of this.species) {
      species.calculateAdjustedFitness()
    }

    // Remove stagnant species (except if only one species left)
    if (this.species.length > 1) {
      this.species = this.species.filter(species => {
        // Keep if recently improved
        if (species.maxFitnessAge < this.stagnationThreshold) return true

        // Keep if large enough and young
        if (species.members.length >= this.minSpeciesSize && species.age < 10) return true

        return false
      })
    }

    return this.species
  }

  /**
   * Calculate how many offspring each species should produce
   * Based on adjusted fitness (fitness sharing)
   */
  calculateOffspringAllocation(totalPopulation) {
    const totalAdjustedFitness = this.species.reduce((sum, s) => sum + s.averageFitness, 0)

    if (totalAdjustedFitness === 0) {
      // Equal allocation if all fitness is zero
      const perSpecies = Math.floor(totalPopulation / this.species.length)
      return this.species.map(() => perSpecies)
    }

    // Allocate proportional to adjusted fitness
    const allocation = this.species.map(species => {
      const proportion = species.averageFitness / totalAdjustedFitness
      return Math.max(1, Math.round(proportion * totalPopulation))
    })

    // Adjust to match exact population size
    let totalAllocated = allocation.reduce((a, b) => a + b, 0)
    let idx = 0

    while (totalAllocated < totalPopulation) {
      allocation[idx]++
      totalAllocated++
      idx = (idx + 1) % allocation.length
    }

    while (totalAllocated > totalPopulation) {
      if (allocation[idx] > 1) {
        allocation[idx]--
        totalAllocated--
      }
      idx = (idx + 1) % allocation.length
    }

    return allocation
  }

  /**
   * Get metadata about current speciation
   */
  getMetadata() {
    return {
      speciesCount: this.species.length,
      species: this.species.map(s => ({
        id: s.id,
        size: s.members.length,
        age: s.age,
        maxFitness: s.maxFitness,
        averageFitness: s.averageFitness,
        stagnation: s.maxFitnessAge
      }))
    }
  }
}
