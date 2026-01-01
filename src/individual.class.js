import { merge } from "lodash-es"

import { Brain } from "./brain.class.js"
import { Genome } from "./genome.class.js"
import { Reproduction } from "./reproduction.class.js"

const hookBindCache = typeof WeakMap !== 'undefined' ? new WeakMap() : null

function getBoundHook(fn, context) {
  if (typeof fn !== 'function') return fn
  if (!context || (typeof context !== 'object' && typeof context !== 'function') || !hookBindCache) {
    return fn.bind(context)
  }

  let contextMap = hookBindCache.get(fn)
  if (!contextMap) {
    contextMap = new WeakMap()
    hookBindCache.set(fn, contextMap)
  }

  let bound = contextMap.get(context)
  if (!bound) {
    bound = fn.bind(context)
    contextMap.set(context, bound)
  }

  return bound
}

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
    const context = this.environment.me ?? this
    for (const name of Object.keys(this.hooks)) {
      const fn = this.hooks[name]
      if (typeof fn !== 'function') continue
      this.hooks[name] = getBoundHook(fn, context)
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
    // Hooks are already bound in setupHooks() - call directly
    if (this.hooks.beforeTick) {
      this.hooks.beforeTick(this)
    }

    const result = this.brain.tick()

    if (this.hooks.afterTick) {
      this.hooks.afterTick(this)
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
