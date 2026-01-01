import { random } from "lodash-es"

import { Genome } from "./genome.class.js"

export class Reproduction {

  static genomeMutate(genome, options = {}) {
    // Use binary mutation directly for better performance
    const genomeObj = Genome.from(genome)
    const cloned = genomeObj.clone()
    
    // Extract mutation parameters
    const {
      mutationRate = 0.001,
      generation = 0,
      adaptiveRate = false,
      creepRate,
      structuralRate,
      maxGenomeSize = 2000,  // Limit genome growth (in bits)
      maxActionId,            // Maximum valid action ID
      maxNeuronId,            // Maximum valid neuron ID
      maxSensorId             // Maximum valid sensor ID
    } = options
    
    // Apply mutations with size limit
    cloned.mutate(mutationRate, {
      adaptiveRate,
      generation,
      creepRate: creepRate || mutationRate * 2,
      structuralRate: structuralRate || mutationRate * 10,
      maxSize: maxGenomeSize,
      addRate: mutationRate * 5,     // Reduce add rate
      removeRate: mutationRate * 5,   // Balance with remove rate
      maxActionId,
      maxNeuronId,
      maxSensorId
    })
    
    return cloned
  }

  static genomeFusion(genA, genB, options = {}) {
    return ReproductionGenomeHandler.from({
      ...options,
      genome: genA,
    })
      .fusion(genB)
      .mutate()
      .get()
  }

  static genomeCrossover(genA, genB, options = {}) {
    // Use binary crossover for better performance
    const genomeA = Genome.from(genA)
    const genomeB = Genome.from(genB)

    // Perform crossover
    const [child1, child2] = genomeA.crossover(genomeB)

    // Apply mutations to children with ID limits
    const mutationRate = options.mutationRate || 0.001
    const mutationOptions = {
      ...options,
      maxActionId: options.maxActionId,
      maxNeuronId: options.maxNeuronId,
      maxSensorId: options.maxSensorId
    }
    child1.mutate(mutationRate, mutationOptions)
    child2.mutate(mutationRate, mutationOptions)

    return [child1, child2]
  }

  /**
   * NEAT-style multi-round mutation
   * Inspired by Pendulum-NEAT: multiple rounds of weight/bias mutations,
   * followed by structural mutations (add node, add connection)
   *
   * @param {Genome|string} genome - The genome to mutate
   * @param {Object} options - Mutation options
   * @returns {Genome} Mutated genome clone
   */
  static multiRoundMutate(genome, options = {}) {
    const {
      rounds = 4,                    // Number of weight/bias mutation rounds
      weightMutationProba = 0.25,    // 25% chance per round to mutate weights
      biasMutationProba = 0.25,      // 25% chance per round to mutate biases
      newNodeProba = 0.05,           // 5% chance to add new node (structural)
      newConnectionProba = 0.80,     // 80% chance to add new connection (structural)
      maxHiddenNodes = 30,           // Maximum hidden neurons allowed
      maxSensorId = 511,
      maxNeuronId = 511,
      maxActionId = 511,
      maxSize = 10000,               // Max genome size in bits
      // Weight/bias mutation sub-options
      newValueProba = 0.2,           // 20% chance of completely new value
      smallRange = 0.01,             // Small perturbation range
      largeRange = 1.0               // Large perturbation range
    } = options

    const genomeObj = Genome.from(genome).clone()

    // Phase 1: Multiple rounds of weight/bias mutations
    for (let round = 0; round < rounds; round++) {
      if (Math.random() < weightMutationProba) {
        if (Math.random() < 0.5) {
          // Mutate weights
          genomeObj.mutateWeights({ newValueProba, smallRange, largeRange })
        } else {
          // Mutate biases
          genomeObj.mutateBiases({ newValueProba, smallRange, largeRange })
        }
      }
    }

    // Phase 2: Structural mutations (once per generation)
    const currentNeuronCount = genomeObj.countNeurons()

    // Add new node (split connection) - only if below max neurons
    if (Math.random() < newNodeProba && currentNeuronCount < maxHiddenNodes) {
      genomeObj.mutateSplitConnection({ maxNeuronId })
    }

    // Add new connection
    if (Math.random() < newConnectionProba) {
      genomeObj.mutateAddConnection({
        maxSensorId,
        maxNeuronId,
        maxActionId,
        maxSize
      })
    }

    return genomeObj
  }
}

export class ReproductionGenomeHandler {
  constructor({
    genome,
    mutationRate = 1 / 1000,
  }) {
    this.genome = genome
    this.mutationRate = mutationRate
  }

  static from(...args) {
    return new ReproductionGenomeHandler(...args)
  }

  get() {
    return this.genome
  }

  mutate({ rate = null } = {}) {
    const mutationRate = rate ?? this.mutationRate
    if (mutationRate === 0) return this

    let mutations = 0
    let encodedStr = this.genome.encoded
    
    // Only split if we actually need to mutate
    let encoded = null

    // Check mutations first
    for (let i = 0; i < encodedStr.length; i++) {
      if (Math.random() <= mutationRate) {
        if (!encoded) encoded = encodedStr.split('')
        encoded[i] = random(0, 31).toString(32).toUpperCase()
        mutations++
      }
    }
    
    if (Math.random() <= mutationRate) {
      if (!encoded) encoded = encodedStr.split('')
      encoded.push(random(0, 31).toString(32).toUpperCase())
      mutations++
    }
    
    if (Math.random() <= mutationRate && encodedStr.length > 0) {
      if (!encoded) encoded = encodedStr.split('')
      encoded.pop()
      mutations++
    }

    if (mutations > 0 && encoded) {
      this.genome = Genome.fromString(encoded.join(''))
    }
    return this
  }

  fusion(genome) {
    const bases = [].concat(this.genome.bases).concat(genome.bases)
    this.genome = Genome.fromBases(bases)

    return this
  }

  fissure(partsNumber = 2) {
    let parts = []
    const partSize = Math.max(1, Math.floor(this.genome.bases.length / partsNumber))

    for (let i = 0; i < partsNumber; i++) {
      const start = i * partSize
      const end = start + partSize

      if (i === partsNumber - 1) {
        parts.push(this.genome.bases.slice(start))
      } else {
        parts.push(this.genome.bases.slice(start, end))
      }
    }

    return parts.map(p => new ReproductionGenomeHandler({
      genome: Genome.fromBases(p),
      mutationRate: this.mutationRate,
    }))
  }
} 