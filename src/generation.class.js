import { chunk } from "lodash-es"

import { Genome } from "./genome.class.js"
import { Individual } from "./individual.class.js"
import { Reproduction } from "./reproduction.class.js"
import { Speciation } from "./speciation.class.js"
import { callCallback, isPromise } from "./utils/callback-promise.js"
import { parseMethodArgs } from "./utils/args-parser.js"
import {
  validatePositiveInteger,
  validateRatio,
  validateRange,
  validateClass,
  validateObject,
  createHelpfulError,
  ValidationError
} from "./utils/validation.js"
import { createProgressTracker } from "./utils/progress.js"

export class Generation {
  constructor(options = {}) {
    // Validate options object
    validateObject(options, 'options', { required: false })

    this.meta = {}
    this.options = options

    const {
      size = 1,
      hooks = {},
      individualArgs = {},
      individualNeurons = 0,
      individualGenomeSize = 1,
      individualClass = Individual,
      eliteRatio = 0.05,          // Top 5% preserved by default
      randomFillRatio = 0.10,      // Max 10% randoms by default
      tournamentSize = 3,          // Tournament selection with k=3
      baseMutationRate = 0.01,     // Base mutation rate (decays over time)
      adaptiveMutation = true,     // Enable adaptive mutation
      mutationDecayRate = 500,     // Generations to decay mutation by ~60%
      useSpeciation = false,       // Enable NEAT-style speciation
      speciationOptions = {},      // Options for Speciation class
    } = options

    // Validate parameters
    try {
      validatePositiveInteger(size, 'size')
      validateObject(hooks, 'hooks', { required: false })
      validateObject(individualArgs, 'individualArgs', { required: false })
      validateRange(individualNeurons, 'individualNeurons', 0, 512, { integer: true })
      validatePositiveInteger(individualGenomeSize, 'individualGenomeSize')
      validateClass(individualClass, 'individualClass', Individual)
      validateRatio(eliteRatio, 'eliteRatio')
      validateRatio(randomFillRatio, 'randomFillRatio')
      validatePositiveInteger(tournamentSize, 'tournamentSize')
      validateRatio(baseMutationRate, 'baseMutationRate')
      validatePositiveInteger(mutationDecayRate, 'mutationDecayRate')
    } catch (err) {
      if (err instanceof ValidationError) {
        // Add helpful context
        if (err.context.parameter === 'size') {
          throw new ValidationError(
            createHelpfulError('invalid-population-size', err.context),
            err.context
          )
        } else if (['eliteRatio', 'randomFillRatio', 'baseMutationRate'].includes(err.context.parameter)) {
          throw new ValidationError(
            createHelpfulError('invalid-ratio', err.context),
            err.context
          )
        }
      }
      throw err
    }

    this.size = size
    this.hooks = hooks
    this.population = []
    this.individualClass = individualClass
    this.individualNeurons = individualNeurons
    this.individualGenomeSize = individualGenomeSize
    this.eliteRatio = eliteRatio
    this.randomFillRatio = randomFillRatio
    this.tournamentSize = tournamentSize
    this.baseMutationRate = baseMutationRate
    this.adaptiveMutation = adaptiveMutation
    this.mutationDecayRate = mutationDecayRate
    this.generationNumber = 0     // Track current generation
    this.useSpeciation = useSpeciation
    this.speciation = useSpeciation ? new Speciation(speciationOptions) : null

    // Per-generation fitness stats, appended automatically in next()/nextAsync()
    // and inherited by the returned generation so a single long-running
    // loop can read the full history via gen.history.
    this.history = []

    this.individualArgs = {
      hooks: {},
      sensors: [],
      actions: [],
      environment: {},
      ...individualArgs,
    }
  }

  _getIdLimits() {
    const sensorCount = Array.isArray(this.individualArgs.sensors)
      ? this.individualArgs.sensors.length
      : 0
    const actionCount = Array.isArray(this.individualArgs.actions)
      ? this.individualArgs.actions.length
      : 0
    const neuronCount = Number.isFinite(this.individualNeurons)
      ? this.individualNeurons
      : 0

    return {
      sensorCount,
      actionCount,
      neuronCount,
      maxSensorId: sensorCount > 0 ? sensorCount - 1 : 0,
      maxActionId: actionCount > 0 ? actionCount - 1 : 0,
      maxNeuronId: neuronCount > 0 ? neuronCount - 1 : 0
    }
  }

  static from(...args) {
    return new Generation(...args)
  }

  add(genome) {
    if (!genome) throw new Error('Genome is required')

    const IndClass = this.individualClass

    this.population.push(new IndClass({
      ...this.individualArgs,
      genome,
    }))
  }

  fillRandom() {
    this.meta.randoms = 0

    while (this.population.length < this.size) {
      // Use sensible defaults if not provided
      const neurons = this.individualNeurons || 30
      const sensors = this.individualArgs.sensors?.length || 10
      const actions = this.individualArgs.actions?.length || 5
      const genomeSize = this.individualGenomeSize || Math.max(100, (sensors + actions + neurons) * 2)
      
      this.add(Genome.randomWith(genomeSize, {
        neurons: neurons,
        sensors: sensors,
        actions: actions,
      }))

      this.meta.randoms += 1
    }
  }

  /**
   * Tick all individuals (synchronous version)
   * For async version, use tickAsync()
   */
  tick() {
    // Validate population
    if (this.population.length === 0) {
      throw new ValidationError(
        createHelpfulError('no-individuals'),
        { method: 'tick', population: this.population.length }
      )
    }

    if (this.hooks.beforeTick) {
      this.hooks.beforeTick.call(this, this)
    }

    // Pre-allocate results array
    const results = new Array(this.population.length)

    // Use for loop instead of reduce for better performance
    for (let i = 0; i < this.population.length; i++) {
      const ind = this.population[i]
      try {
        const res = ind.tick()
        results[i] = [ind.id, ind.fitness, res]
      } catch (error) {
        console.error(`Individual ${ind.id} tick failed:`, error)
        results[i] = [ind.id, ind.fitness, {}]
      }
    }

    if (this.hooks.afterTick) {
      this.hooks.afterTick.call(this, results, this)
    }

    return results
  }

  /**
   * Tick all individuals (async version)
   * Supports async fitness functions and batch evaluation
   *
   * @param {Object|Function} optionsOrCallback - Options or callback
   * @param {Function} callback - Optional callback(error, results)
   * @returns {Promise<Array>|undefined} - Results array or undefined if callback provided
   *
   * @example
   * // Promise
   * const results = await generation.tickAsync()
   *
   * // Callback
   * generation.tickAsync((err, results) => {
   *   if (err) return console.error(err)
   *   console.log(results)
   * })
   *
   * // With options
   * const results = await generation.tickAsync({ parallel: true })
   *
   * // With options and callback
   * generation.tickAsync({ parallel: true }, (err, results) => {
   *   console.log(results)
   * })
   */
  tickAsync(optionsOrCallback, callback) {
    // Parse flexible arguments
    const parsed = parseMethodArgs(arguments, {
      parallel: true,      // default: evaluate fitness in parallel
      onProgress: null     // optional progress callback
    })

    return callCallback(parsed.callback, async () => {
      // Validate population
      if (this.population.length === 0) {
        throw new ValidationError(
          createHelpfulError('no-individuals'),
          { method: 'tickAsync', population: this.population.length }
        )
      }

      if (this.hooks.beforeTick) {
        const hookResult = this.hooks.beforeTick.call(this, this)
        if (isPromise(hookResult)) await hookResult
      }

      // Create progress tracker if onProgress callback provided
      const progressTracker = parsed.options.onProgress
        ? createProgressTracker({
            total: this.population.length,
            onProgress: parsed.options.onProgress,
            throttle: 50  // Update at most every 50ms
          })
        : null

      // Pre-allocate results array
      const results = new Array(this.population.length)

      // Evaluate all individuals (supports async fitness)
      const promises = this.population.map(async (ind, i) => {
        try {
          const res = ind.tick()

          // If fitness() is async, await it
          let fitness = ind.fitness
          if (typeof fitness === 'function') {
            fitness = fitness.call(ind)
          }
          if (isPromise(fitness)) {
            fitness = await fitness
          }

          results[i] = [ind.id, fitness, res]

          // Update progress
          if (progressTracker) {
            progressTracker.increment({
              step: 'fitness-evaluation',
              individual: i
            })
          }
        } catch (error) {
          console.error(`Individual ${ind.id} tick failed:`, error)
          results[i] = [ind.id, 0, {}]

          // Update progress even on error
          if (progressTracker) {
            progressTracker.increment({
              step: 'fitness-evaluation',
              individual: i,
              error: true
            })
          }
        }
      })

      await Promise.all(promises)

      // Mark progress as complete
      if (progressTracker) {
        progressTracker.complete({ step: 'fitness-evaluation' })
      }

      if (this.hooks.afterTick) {
        const hookResult = this.hooks.afterTick.call(this, results, this)
        if (isPromise(hookResult)) await hookResult
      }

      return results
    })
  }

  /**
   * Tournament selection - picks best from k random individuals
   * Uses normalized fitness if available for consistent selection pressure
   */
  tournamentSelect(population, k = null) {
    const tournamentSize = k || this.tournamentSize
    const contestants = []

    for (let i = 0; i < tournamentSize; i++) {
      const idx = Math.floor(Math.random() * population.length)
      contestants.push(population[idx])
    }

    // Helper to get fitness value
    const getFitness = (ind) => {
      if (ind._normalizedFitness !== undefined) return ind._normalizedFitness
      if (typeof ind.fitness === 'function') return ind.fitness()
      if (typeof ind.fitness === 'number') return ind.fitness
      return 0
    }

    // Sort by normalized fitness if available, otherwise use raw fitness
    return contestants.sort((a, b) => {
      const fitA = getFitness(a)
      const fitB = getFitness(b)
      return fitB - fitA
    })[0]
  }

  /**
   * Calculate current mutation rate based on generation number
   */
  getCurrentMutationRate() {
    if (!this.adaptiveMutation) {
      return this.baseMutationRate
    }

    // Exponential decay: rate = baseRate * exp(-generation / decayRate)
    // Gen 0: 1.00x base
    // Gen 100: 0.82x base
    // Gen 500: 0.37x base
    // Gen 1000: 0.14x base
    const rate = this.baseMutationRate * Math.exp(-this.generationNumber / this.mutationDecayRate)
    return Math.max(rate, this.baseMutationRate * 0.1) // Never go below 10% of base
  }

  /**
   * Calculate diversity (ratio of unique genomes)
   */
  calculateDiversity() {
    const uniqueGenomes = new Set(this.population.map(i => i.genome.encoded))
    return uniqueGenomes.size / this.size
  }

  /**
   * Snapshot per-generation fitness stats and append to this.history.
   * Called automatically by next()/nextAsync(); safe to call manually
   * after fitness evaluation if you use a custom loop.
   * Returns the snapshot (or null when the population has no finite fitnesses).
   */
  recordStats() {
    const fits = []
    for (const ind of this.population) {
      const f = typeof ind.fitness === 'function' ? ind.fitness() : ind.fitness
      if (Number.isFinite(f)) fits.push(f)
    }
    if (fits.length === 0) return null

    const sorted = [...fits].sort((a, b) => a - b)
    let sum = 0
    for (const v of fits) sum += v
    const mean = sum / fits.length
    let variance = 0
    for (const v of fits) variance += (v - mean) ** 2
    variance /= fits.length

    const snapshot = {
      generation: this.generationNumber,
      populationSize: fits.length,
      best: sorted[sorted.length - 1],
      worst: sorted[0],
      mean,
      median: sorted[Math.floor(sorted.length / 2)],
      stdDev: Math.sqrt(variance),
      timestamp: Date.now()
    }
    this.history.push(snapshot)
    return snapshot
  }

  /**
   * Serialize history to CSV.
   */
  historyToCSV() {
    const header = 'generation,populationSize,best,worst,mean,median,stdDev,timestamp'
    const rows = this.history.map(s =>
      `${s.generation},${s.populationSize},${s.best},${s.worst},${s.mean},${s.median},${s.stdDev},${s.timestamp}`
    )
    return [header, ...rows].join('\n')
  }

  /**
   * Normalize fitness scores to [0, 1] range
   * This ensures consistent selection pressure regardless of fitness scale
   */
  normalizeFitness(population) {
    const fitnesses = population.map(i => {
      // Handle both fitness as method and as property
      if (typeof i.fitness === 'function') {
        return i.fitness()
      } else if (typeof i.fitness === 'number') {
        return i.fitness
      }
      return 0
    })
    const min = Math.min(...fitnesses)
    const max = Math.max(...fitnesses)
    const range = max - min

    // If all fitnesses are the same, return uniform distribution
    if (range === 0) {
      return population.map(() => 1 / population.length)
    }

    // Normalize to [0, 1]
    const normalized = fitnesses.map(f => (f - min) / range)

    // Store normalized fitness on individuals for selection
    population.forEach((ind, i) => {
      ind._normalizedFitness = normalized[i]
    })

    return normalized
  }

  /**
   * Create next generation (synchronous version)
   * For async version, use nextAsync()
   */
  next() {
    if (this.hooks.beforeNext) {
      this.hooks.beforeNext.call(this, this)
    }

    // Snapshot stats for the current population before mutating things.
    this.recordStats()

    // Increment generation counter
    this.generationNumber++

    const nextGen = Generation.from({ ...this.options })
    nextGen.generationNumber = this.generationNumber
    nextGen.history = this.history

    // === STEP 0: Normalize fitness for consistent selection pressure ===
    this.normalizeFitness(this.population)

    // === SPECIATION: If enabled, use NEAT-style species-based reproduction ===
    if (this.useSpeciation && this.speciation) {
      return this._nextWithSpeciation(nextGen)
    }

    // === STEP 1: ELITISM - Always preserve the best ===
    const eliteCount = Math.ceil(this.size * this.eliteRatio)

    // Helper to get fitness value (handles both method and property)
    const getFitness = (ind) => {
      if (typeof ind.fitness === 'function') return ind.fitness()
      if (typeof ind.fitness === 'number') return ind.fitness
      return 0
    }

    const eliteHeap = []

    const siftUp = (idx) => {
      while (idx > 0) {
        const parent = (idx - 1) >> 1
        if (eliteHeap[parent].fitness <= eliteHeap[idx].fitness) break
        const tmp = eliteHeap[parent]
        eliteHeap[parent] = eliteHeap[idx]
        eliteHeap[idx] = tmp
        idx = parent
      }
    }

    const siftDown = (idx) => {
      const length = eliteHeap.length
      while (true) {
        let smallest = idx
        const left = (idx << 1) + 1
        const right = left + 1

        if (left < length && eliteHeap[left].fitness < eliteHeap[smallest].fitness) {
          smallest = left
        }
        if (right < length && eliteHeap[right].fitness < eliteHeap[smallest].fitness) {
          smallest = right
        }

        if (smallest === idx) break
        const tmp = eliteHeap[smallest]
        eliteHeap[smallest] = eliteHeap[idx]
        eliteHeap[idx] = tmp
        idx = smallest
      }
    }

    const considerElite = (fitness, individual) => {
      if (eliteCount === 0) return
      if (eliteHeap.length < eliteCount) {
        eliteHeap.push({ fitness, individual })
        siftUp(eliteHeap.length - 1)
        return
      }

      if (fitness > eliteHeap[0].fitness) {
        eliteHeap[0] = { fitness, individual }
        siftDown(0)
      }
    }

    for (const ind of this.population) {
      considerElite(getFitness(ind), ind)
    }

    const elite = eliteHeap
      .sort((a, b) => b.fitness - a.fitness)
      .map(entry => entry.individual)

    // Record survivor count before elitism forces revival
    const survivorsBeforeElitism = this.population.reduce((count, ind) => count + (ind.dead ? 0 : 1), 0)

    // Force elite to survive (they can't be marked dead)
    elite.forEach(e => e.dead = false)

    // Add elite to next generation (clone their genomes)
    for (const individual of elite) {
      nextGen.add(individual.genome.clone())
    }

    nextGen.meta.elite = eliteCount

    // === STEP 2: Collect survivors (non-dead individuals) ===
    const alives = []
    for (let i = 0; i < this.population.length; i++) {
      const ind = this.population[i]
      if (!ind.dead) {
        alives.push(ind)
      }
    }

    this.meta.survivalRate = survivorsBeforeElitism / this.population.length
    nextGen.meta.survivors = survivorsBeforeElitism

    // === STEP 3: REPRODUCTION via Tournament Selection ===
    // Fill remaining slots with offspring
    let offspringCount = 0

    // Get current mutation rate (adaptive or fixed)
    const currentMutationRate = this.getCurrentMutationRate()
    const { maxActionId, maxNeuronId, maxSensorId } = this._getIdLimits()

    while (nextGen.population.length < this.size) {
      // Ensure we have enough individuals for selection
      const breedingPool = alives.length > 0 ? alives : this.population

      if (breedingPool.length === 0) break // Safety check

      // Tournament selection for parents
      const parent1 = this.tournamentSelect(breedingPool)
      const parent2 = this.tournamentSelect(breedingPool)

      // Sexual reproduction (crossover) with adaptive mutation
      const [child1, child2] = Reproduction.genomeCrossover(
        parent1.genome,
        parent2.genome,
        {
          mutationRate: currentMutationRate,
          adaptiveRate: this.adaptiveMutation,
          generation: this.generationNumber,
          maxActionId,
          maxNeuronId,
          maxSensorId
        }
      )

      // Add children
      nextGen.add(child1)
      offspringCount++

      if (nextGen.population.length < this.size) {
        nextGen.add(child2)
        offspringCount++
      }
    }

    nextGen.meta.offspring = offspringCount
    nextGen.meta.mutationRate = currentMutationRate

    // === STEP 4: RANDOM FILL (limited to randomFillRatio) ===
    const maxRandoms = Math.ceil(this.size * this.randomFillRatio)
    let randomsAdded = 0

    while (nextGen.population.length < this.size && randomsAdded < maxRandoms) {
      const neurons = this.individualNeurons || 30
      const sensors = this.individualArgs.sensors?.length || 10
      const actions = this.individualArgs.actions?.length || 5
      const genomeSize = this.individualGenomeSize || Math.max(100, (sensors + actions + neurons) * 2)

      nextGen.add(Genome.randomWith(genomeSize, {
        neurons: neurons,
        sensors: sensors,
        actions: actions,
      }))

      randomsAdded++
    }

    nextGen.meta.randoms = randomsAdded

    // === STEP 5: Fill any remaining slots with mutations of best ===
    // If we still haven't filled the population and hit random limit,
    // fill with mutations of elite individuals
    while (nextGen.population.length < this.size) {
      // Safety: if elite is empty, generate random individual
      if (elite.length === 0) {
        nextGen.fillRandom()
        break
      }

      const parent = elite[Math.floor(Math.random() * elite.length)]
      const mutant = Reproduction.genomeMutate(parent.genome, {
        mutationRate: currentMutationRate,
        adaptiveRate: this.adaptiveMutation,
        generation: this.generationNumber,
        maxActionId,
        maxNeuronId,
        maxSensorId
      })
      nextGen.add(mutant)
    }

    // === STEP 6: Diversity monitoring and injection ===
    const diversity = this.calculateDiversity()
    nextGen.meta.diversity = diversity

    // If diversity is too low, add mutation burst to prevent premature convergence
    const diversityThreshold = 0.2
    if (diversity < diversityThreshold && this.adaptiveMutation) {
      const burstRate = currentMutationRate * 50 // 50x current rate for burst
      const burstCount = Math.floor(nextGen.size * 0.3) // 30% of population

      for (let i = 0; i < burstCount; i++) {
        const idx = Math.floor(Math.random() * nextGen.population.length)
        nextGen.population[idx].genome.mutate(burstRate, {
          adaptiveRate: false, // Disable adaptive for burst
          generation: this.generationNumber,
          maxActionId,
          maxNeuronId,
          maxSensorId
        })
      }

      nextGen.meta.diversityBurst = true
      nextGen.meta.burstCount = burstCount
    }

    // Clear population more efficiently
    this.population.length = 0

    if (this.hooks.afterNext) {
      this.hooks.afterNext.call(this, nextGen, this)
    }

    return nextGen
  }

  /**
   * Create next generation with NEAT-style speciation
   * @private
   */
  _nextWithSpeciation(nextGen) {
    const currentMutationRate = this.getCurrentMutationRate()

    // Speciate the population
    const species = this.speciation.speciate(this.population)

    // Store speciation info in metadata
    nextGen.meta.speciation = this.speciation.getMetadata()
    nextGen.meta.mutationRate = currentMutationRate

    // Calculate offspring allocation per species
    const offspringAllocation = this.speciation.calculateOffspringAllocation(this.size)

    // Reproduce within each species
    for (let s = 0; s < species.length; s++) {
      const spec = species[s]
      const targetOffspring = offspringAllocation[s]

      // Always preserve champion of each species (species elitism)
      const champion = spec.champion()
      if (champion) {
        nextGen.add(champion.genome.clone())
      }

      // Helper to get fitness value
      const getFitness = (ind) => {
        if (typeof ind.fitness === 'function') return ind.fitness()
        if (typeof ind.fitness === 'number') return ind.fitness
        return 0
      }

      // Sort species members by fitness
      const sorted = [...spec.members].sort((a, b) => getFitness(b) - getFitness(a))

      // Only top performers reproduce (survivalThreshold)
      const survivorCount = Math.max(1, Math.ceil(sorted.length * this.speciation.survivalThreshold))
      const parents = sorted.slice(0, survivorCount)

      // Skip if no parents available
      if (parents.length === 0) continue

      // Generate offspring for this species
      let offspring = 1 // Already added champion
      while (offspring < targetOffspring && nextGen.population.length < this.size) {
        // Select two random parents from survivors
        const parent1 = parents[Math.floor(Math.random() * parents.length)]
        const parent2 = parents[Math.floor(Math.random() * parents.length)]

        // Safety check
        if (!parent1 || !parent2) break

        if (Math.random() < 0.75) {
          // 75% chance of crossover
          const [child1, child2] = Reproduction.genomeCrossover(
            parent1.genome,
            parent2.genome,
            {
              method: 'base-aware',
              mutationRate: currentMutationRate,
              maxActionId,
              maxNeuronId,
              maxSensorId
            }
          )

          nextGen.add(child1)
          offspring++

          if (offspring < targetOffspring && nextGen.population.length < this.size) {
            nextGen.add(child2)
            offspring++
          }
        } else {
          // 25% chance of mutation only
          const mutant = Reproduction.genomeMutate(parent1.genome, {
            mutationRate: currentMutationRate,
            maxActionId,
            maxNeuronId,
            maxSensorId
          })
          nextGen.add(mutant)
          offspring++
        }
      }
    }

    // Fill remaining slots if needed (shouldn't happen normally)
    while (nextGen.population.length < this.size) {
      const randomSpecies = species[Math.floor(Math.random() * species.length)]
      const randomMember = randomSpecies.randomMember()
      if (randomMember) {
        const mutant = Reproduction.genomeMutate(randomMember.genome, {
          mutationRate: currentMutationRate * 2, // Higher mutation for fill
          maxActionId,
          maxNeuronId,
          maxSensorId
        })
        nextGen.add(mutant)
      } else {
        // Fallback: create random
        nextGen.add(Genome.randomWith(this.individualGenomeSize, {
          neurons: this.individualNeurons,
          sensors: this.individualArgs.sensors?.length || 10,
          actions: this.individualArgs.actions?.length || 5,
        }))
      }
    }

    // Transfer speciation state to next generation
    nextGen.speciation = this.speciation

    if (this.hooks.afterNext) {
      this.hooks.afterNext.call(this, nextGen, this)
    }

    return nextGen
  }

  /**
   * Create next generation (async version)
   * Supports async hooks
   *
   * @param {Object|Function} optionsOrCallback - Options or callback
   * @param {Function} callback - Optional callback(error, nextGeneration)
   * @returns {Promise<Generation>|undefined} - Next generation or undefined if callback provided
   *
   * @example
   * // Promise
   * const nextGen = await generation.nextAsync()
   *
   * // Callback
   * generation.nextAsync((err, nextGen) => {
   *   if (err) return console.error(err)
   *   // Use nextGen
   * })
   *
   * // With options (future expansion)
   * const nextGen = await generation.nextAsync({ preserveMetadata: true })
   *
   * // With options and callback
   * generation.nextAsync({ preserveMetadata: true }, (err, nextGen) => {
   *   console.log(nextGen)
   * })
   */
  nextAsync(optionsOrCallback, callback) {
    // Parse flexible arguments
    const parsed = parseMethodArgs(arguments, {
      preserveMetadata: false  // future expansion
    })

    return callCallback(parsed.callback, async () => {
      if (this.hooks.beforeNext) {
        const hookResult = this.hooks.beforeNext.call(this, this)
        if (isPromise(hookResult)) await hookResult
      }

      this.recordStats()

      // Increment generation counter
      this.generationNumber++

      const nextGen = Generation.from({ ...this.options })
      nextGen.generationNumber = this.generationNumber
      nextGen.history = this.history

      // === STEP 0: Normalize fitness (supports async fitness) ===
      await this.normalizeFitnessAsync(this.population)

      // === STEP 1: ELITISM - Always preserve the best ===
      const eliteCount = Math.ceil(this.size * this.eliteRatio)

      // Helper to get fitness value
      const getFitness = (ind) => {
        if (typeof ind.fitness === 'function') return ind.fitness()
        if (typeof ind.fitness === 'number') return ind.fitness
        return 0
      }

      // Sort by fitness (descending) and get elite
      const sortedByFitness = [...this.population].sort((a, b) => getFitness(b) - getFitness(a))
      const elite = sortedByFitness.slice(0, eliteCount)

      // Force elite to survive (they can't be marked dead)
      elite.forEach(e => e.dead = false)

      // Add elite to next generation (clone their genomes)
      for (const individual of elite) {
        nextGen.add(individual.genome.clone())
      }

      nextGen.meta.elite = eliteCount

      // === STEP 2: Collect survivors (non-dead individuals) ===
      const alives = []
      for (let i = 0; i < this.population.length; i++) {
        const ind = this.population[i]
        if (!ind.dead) {
          alives.push(ind)
        }
      }

      this.meta.survivalRate = alives.length / this.population.length
      nextGen.meta.survivors = alives.length

      // === STEP 3: REPRODUCTION via Tournament Selection ===
      let offspringCount = 0
      const currentMutationRate = this.getCurrentMutationRate()
      const { maxActionId, maxNeuronId, maxSensorId } = this._getIdLimits()

      while (nextGen.population.length < this.size) {
        const breedingPool = alives.length > 0 ? alives : this.population

        if (breedingPool.length === 0) break

        // Tournament selection for parents
        const parent1 = this.tournamentSelect(breedingPool)
        const parent2 = this.tournamentSelect(breedingPool)

        // Sexual reproduction (crossover) with adaptive mutation
        const [child1, child2] = Reproduction.genomeCrossover(
          parent1.genome,
          parent2.genome,
          {
            mutationRate: currentMutationRate,
            adaptiveRate: this.adaptiveMutation,
            generation: this.generationNumber,
            maxActionId,
            maxNeuronId,
            maxSensorId
          }
        )

        nextGen.add(child1)
        offspringCount++

        if (nextGen.population.length < this.size) {
          nextGen.add(child2)
          offspringCount++
        }
      }

      nextGen.meta.offspring = offspringCount
      nextGen.meta.mutationRate = currentMutationRate

      // === STEP 4: RANDOM FILL (limited to randomFillRatio) ===
      const maxRandoms = Math.ceil(this.size * this.randomFillRatio)
      let randomsAdded = 0

      while (nextGen.population.length < this.size && randomsAdded < maxRandoms) {
        const neurons = this.individualNeurons || 30
        const sensors = this.individualArgs.sensors?.length || 10
        const actions = this.individualArgs.actions?.length || 5
        const genomeSize = this.individualGenomeSize || Math.max(100, (sensors + actions + neurons) * 2)

        nextGen.add(Genome.randomWith(genomeSize, {
          neurons: neurons,
          sensors: sensors,
          actions: actions,
        }))

        randomsAdded++
      }

      nextGen.meta.randoms = randomsAdded

      // === STEP 5: Fill any remaining slots with mutations of best ===
      while (nextGen.population.length < this.size) {
        const parent = elite[Math.floor(Math.random() * elite.length)]
        const mutant = Reproduction.genomeMutate(parent.genome, {
          mutationRate: currentMutationRate,
          adaptiveRate: this.adaptiveMutation,
          generation: this.generationNumber,
          maxActionId,
          maxNeuronId,
          maxSensorId
        })
        nextGen.add(mutant)
      }

      // === STEP 6: Diversity monitoring and injection ===
      const diversity = this.calculateDiversity()
      nextGen.meta.diversity = diversity

      const diversityThreshold = 0.2
      if (diversity < diversityThreshold && this.adaptiveMutation) {
        const burstRate = currentMutationRate * 50
        const burstCount = Math.floor(nextGen.size * 0.3)

        for (let i = 0; i < burstCount; i++) {
          const idx = Math.floor(Math.random() * nextGen.population.length)
          nextGen.population[idx].genome.mutate(burstRate, {
            adaptiveRate: false,
            generation: this.generationNumber,
            maxActionId,
            maxNeuronId,
            maxSensorId
          })
        }

        nextGen.meta.diversityBurst = true
        nextGen.meta.burstCount = burstCount
      }

      // Clear population more efficiently
      this.population.length = 0

      if (this.hooks.afterNext) {
        const hookResult = this.hooks.afterNext.call(this, nextGen, this)
        if (isPromise(hookResult)) await hookResult
      }

      return nextGen
    })
  }

  /**
   * Async version of normalizeFitness (supports async fitness functions)
   */
  async normalizeFitnessAsync(population) {
    // Evaluate all fitness values (supports async)
    const fitnessPromises = population.map(async i => {
      let fitness = i.fitness
      if (typeof fitness === 'function') {
        fitness = fitness.call(i)
      }
      if (isPromise(fitness)) {
        return await fitness
      }
      return fitness
    })

    const fitnesses = await Promise.all(fitnessPromises)

    const min = Math.min(...fitnesses)
    const max = Math.max(...fitnesses)
    const range = max - min

    if (range === 0) {
      population.forEach(ind => {
        ind._normalizedFitness = 1 / population.length
      })
      return population.map(() => 1 / population.length)
    }

    const normalized = fitnesses.map(f => (f - min) / range)

    population.forEach((ind, i) => {
      ind._normalizedFitness = normalized[i]
    })

    return normalized
  }

  export() {
    return {
      id: this.id,
      ...this.meta,
    }
  }
}
