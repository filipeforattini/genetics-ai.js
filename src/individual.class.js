import { merge } from "lodash-es"

import { Brain } from "./brain.class.js"
import { Genome } from "./genome.class.js"
import { Reproduction } from "./reproduction.class.js"

export class Individual {
  constructor({
    genome = null,
    sensors = [],
    actions = [],
    environment = {},

    hooks = {},
  }) {
    this.hooks = hooks
    this.genome = Genome.from(genome)
    this.attributes = new Map()
    this.parseAttributes()

    const env = merge({ me: this }, environment)
    this.environment = env

    // Store original arrays for cloning
    this._sensors = sensors || []
    this._actions = actions || []

    this.brain = new Brain({
      sensors,
      actions,
      environment: env,
      genome: this.genome,
    })

    // Calculate max IDs based on actual sensors/neurons/actions
    const sensorCount = this.brain?.definitions?.sensors
      ? Object.keys(this.brain.definitions.sensors).length
      : (this.sensors?.length || 0)
    const actionCount = this.brain?.definitions?.actions
      ? Object.keys(this.brain.definitions.actions).length
      : (this.actions?.length || 0)
    const neuronCount = this.brain?.definitions?.neurons
      ? Object.keys(this.brain.definitions.neurons).length
      : 0

    const maxSensorId = Math.max(0, sensorCount - 1)
    const maxNeuronId = Math.max(0, neuronCount - 1)
    const maxActionId = Math.max(0, actionCount - 1)
    
    this.reproduce = {
      asexual: {
        mutate: (rate = null) => Reproduction.genomeMutate(this.genome, {
          mutationRate: rate !== null ? rate : undefined,
          maxSensorId,
          maxNeuronId,
          maxActionId
        }),
      },
      sexual: {
        crossover: (partner, options = {}) => Reproduction.genomeCrossover(this.genome, partner.genome, {
          ...options,
          maxSensorId,
          maxNeuronId,
          maxActionId
        }),
      },
    }

    this.setupHooks()
  }

  setupHooks () {
    for (const name of Object.keys(this.hooks)) {
      const fn = this.hooks[name]
      this.hooks[name] = fn.bind(this.environment.me ?? this)
    }
  }

  parseAttributes() {
    // Extract attribute bases from genome and populate the attributes map
    for (const base of this.genome.bases) {
      if (base.type === 'attribute') {
        this.attributes.set(base.id, base.value)
      }
    }
  }

  tick() {
    if (this.hooks.beforeTick) {
      const beforeTickHook = this.hooks.beforeTick.bind(this)
      beforeTickHook(this)
    }

    const result = this.brain.tick()

    if (this.hooks.afterTick) {
      const afterTickHook = this.hooks.afterTick.bind(this)
      afterTickHook(this)
    }
    
    return result
  }
  
  /**
   * Export individual data in both string and binary formats
   */
  export() {
    return {
      // String format (developer-friendly)
      genome: this.genome.encoded,  // Base32 string
      
      // Binary format (performance)
      binary: this.genome.toBinary(), // Uint8Array
      
      // Attributes extracted from genome
      attributes: Object.fromEntries(this.attributes),
      
      // Fitness and other metadata
      fitness: this.fitness || 0,
      id: this.id,
      dead: this.dead || false
    }
  }
  
  /**
   * Export as JSON-serializable object
   */
  toJSON() {
    return {
      genome: this.genome.encoded,
      attributes: Object.fromEntries(this.attributes),
      fitness: this.fitness || 0,
      id: this.id,
      dead: this.dead || false
    }
  }
  
  /**
   * Export genome as string (convenience method)
   */
  exportGenome() {
    return this.genome.encoded
  }
  
  /**
   * Export genome as binary (convenience method)
   */
  exportGenomeBinary() {
    return this.genome.toBinary()
  }
}
