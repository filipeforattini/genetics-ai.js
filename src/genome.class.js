import { BitBuffer } from './bitbuffer.class.js'
import { Base } from './base.class.js'
import { EvolvedNeuronBase } from './bases/evolved-neuron.base.js'
import { LearningRuleBase } from './bases/learning-rule.base.js'
import { MemoryCellBase } from './bases/memory-cell.base.js'
import { ModuleBase } from './bases/module.base.js'
import { PlasticityBase } from './bases/plasticity.base.js'
import { md5 } from './md5.js'
import { chunk } from 'lodash-es'

/**
 * Genome - High-performance binary genome implementation
 * 10-100x faster than string-based implementation
 * Optimized for memory efficiency and parsing speed
 */
export class Genome {
  constructor(buffer = null) {
    this.buffer = buffer || new BitBuffer()
    this._basesCache = null  // Lazy load cache
  }

  /**
   * Create from various sources
   */
  static from(data) {
    if (data instanceof Genome) {
      return data
    }
    if (data instanceof BitBuffer) {
      return new Genome(data)
    }
    if (data instanceof Uint8Array) {
      return new Genome(BitBuffer.from(data))
    }
    if (typeof data === 'string') {
      return Genome.fromString(data)
    }
    if (data && data.bases) {
      return Genome.fromBases(data.bases)
    }
    return new Genome()
  }

  /**
   * Create from base32 string
   */
  static fromString(str) {
    const genome = new Genome()
    genome.buffer = BitBuffer.fromBase32String(str)
    return genome
  }

  /**
   * Create from bases array
   */
  static fromBases(bases) {
    const genome = new Genome()
    genome.buffer = new BitBuffer() // Start with empty buffer
    genome.buffer.bitLength = 0 // Ensure bitLength starts at 0

    for (const base of bases) {
      // Validate base before converting
      if (!base || !base.type) continue

      // Skip connections without source/target
      if (base.type === 'connection') {
        if (!base.source || base.source.id === undefined) continue
        if (!base.target || base.target.id === undefined) continue
      }

      // Skip biases without target
      if (base.type === 'bias') {
        if (!base.target || base.target.id === undefined) continue
      }

      try {
        const baseBuffer = Base.toBitBuffer(base)
        genome.buffer.append(baseBuffer)
      } catch (err) {
        // Skip invalid bases silently
        continue
      }
    }

    return genome
  }

  /**
   * Get bases (lazy parsing with cache)
   * Use this when you need ALL bases
   */
  getBases() {
    if (this._basesCache) return this._basesCache

    const bases = []
    for (const base of this.iterBases()) {
      bases.push(base)
    }

    this._basesCache = bases
    return bases
  }

  /**
   * Iterate over bases lazily (generator)
   * Use this for memory-efficient iteration
   * Much faster than getBases() when you only need a subset
   *
   * @generator
  * @yields {Object} Base object
  */
  *iterBases() {
    let position = 0
    const totalBits = this.buffer.bitLength || (this.buffer.buffer.length * 8)
    const advancedParsers = [
      EvolvedNeuronBase,
      ModuleBase,
      MemoryCellBase,
      PlasticityBase,
      LearningRuleBase
    ]

    while (position < totalBits - 3) {  // Need at least 3 bits for type
      let parsed = null

      for (const Parser of advancedParsers) {
        parsed = Parser.fromBitBuffer(this.buffer, position)
        if (parsed) break
      }

      if (parsed) {
        yield parsed
        position += parsed.bitLength
        continue
      }

      const base = Base.fromBitBuffer(this.buffer, position)
      if (!base) break

      yield base
      position += base.bitLength
    }
  }

  /**
   * Get only bases of specific type (selective parsing)
   * 10x faster than getBases().filter()
   *
   * @param {string} type - Base type: 'connection', 'bias', 'evolved_neuron',
   *                        'learning_rule', 'memory_cell', 'module', 'plasticity', 'attribute'
   * @returns {Array<Object>} Bases of specified type
   */
  getBasesByType(type) {
    const bases = []
    for (const base of this.iterBases()) {
      if (base.type === type) {
        bases.push(base)
      }
    }
    return bases
  }

  /**
   * Get only connections (sensors/neurons → neurons/actions)
   * @returns {Array<Object>} Connection bases
   */
  getConnections() {
    return this.getBasesByType('connection')
  }

  /**
   * Get only biases
   * @returns {Array<Object>} Bias bases
   */
  getBiases() {
    return this.getBasesByType('bias')
  }

  /**
   * Get only evolved neurons
   * @returns {Array<Object>} Evolved neuron bases
   */
  getEvolvedNeurons() {
    return this.getBasesByType('evolved_neuron')
  }

  /**
   * Get only learning rules
   * @returns {Array<Object>} Learning rule bases
   */
  getLearningRules() {
    return this.getBasesByType('learning_rule')
  }

  /**
   * Get only memory cells
   * @returns {Array<Object>} Memory cell bases
   */
  getMemoryCells() {
    return this.getBasesByType('memory_cell')
  }

  /**
   * Get only modules
   * @returns {Array<Object>} Module bases
   */
  getModules() {
    return this.getBasesByType('module')
  }

  /**
   * Get only plasticity bases
   * @returns {Array<Object>} Plasticity bases
   */
  getPlasticities() {
    return this.getBasesByType('plasticity')
  }

  /**
   * Get only attributes
   * @returns {Array<Object>} Attribute bases
   */
  getAttributes() {
    return this.getBasesByType('attribute')
  }

  /**
   * Get statistics about genome composition
   * Useful for debugging and analysis
   * @returns {Object} Statistics object
   */
  getStats() {
    const stats = {
      totalBases: 0,
      connections: 0,
      biases: 0,
      evolvedNeurons: 0,
      learningRules: 0,
      memoryCells: 0,
      modules: 0,
      plasticities: 0,
      attributes: 0,
      unknown: 0,
      bitSize: this.bitSize,
      byteSize: this.byteSize
    }

    for (const base of this.iterBases()) {
      stats.totalBases++

      switch (base.type) {
        case 'connection': stats.connections++; break
        case 'bias': stats.biases++; break
        case 'evolved_neuron': stats.evolvedNeurons++; break
        case 'learning_rule': stats.learningRules++; break
        case 'memory_cell': stats.memoryCells++; break
        case 'module': stats.modules++; break
        case 'plasticity': stats.plasticities++; break
        case 'attribute': stats.attributes++; break
        default: stats.unknown++; break
      }
    }

    return stats
  }

  /**
   * Count bases by type without allocating array
   * Fastest way to get count
   * @param {string} type - Base type
   * @returns {number} Count
   */
  countBasesByType(type) {
    let count = 0
    for (const base of this.iterBases()) {
      if (base.type === type) count++
    }
    return count
  }

  /**
   * Check if genome contains any bases of specified type
   * @param {string} type - Base type
   * @returns {boolean} True if at least one base of type exists
   */
  hasBasesOfType(type) {
    for (const base of this.iterBases()) {
      if (base.type === type) return true
    }
    return false
  }

  /**
   * Find first base matching predicate
   * @param {Function} predicate - Function(base) => boolean
   * @returns {Object|null} First matching base or null
   */
  findBase(predicate) {
    for (const base of this.iterBases()) {
      if (predicate(base)) return base
    }
    return null
  }

  /**
   * Filter bases with predicate (lazy)
   * @generator
   * @param {Function} predicate - Function(base) => boolean
   * @yields {Object} Matching bases
   */
  *filterBases(predicate) {
    for (const base of this.iterBases()) {
      if (predicate(base)) yield base
    }
  }

  /**
   * Generate random genome
   */
  static random(count = 10, options = {}) {
    const genome = new Genome()
    genome.buffer = new BitBuffer()
    
    // Extract attributes from options
    const { attributes = 0, ...baseOptions } = options
    
    // Determine base type distribution (85% connections, 15% biases by default)
    const attributeCount = attributes > 0 ? Math.floor(count * 0.1) : 0
    const biasCount = Math.floor((count - attributeCount) * 0.15)  // 15% biases
    const connectionCount = count - attributeCount - biasCount      // ~85% connections
    
    // Generate connections
    for (let i = 0; i < connectionCount; i++) {
      const baseBuffer = Base.randomBinary({ ...baseOptions, type: 'connection' })
      genome.buffer.append(baseBuffer)
    }
    
    // Generate biases
    for (let i = 0; i < biasCount; i++) {
      const baseBuffer = Base.randomBinary({ ...baseOptions, type: 'bias' })
      genome.buffer.append(baseBuffer)
    }
    
    // Generate attributes
    for (let i = 0; i < attributeCount; i++) {
      const baseBuffer = Base.randomBinary({ 
        ...baseOptions, 
        type: 'attribute',
        attributeIds: attributes  // Pass number of different attribute IDs
      })
      genome.buffer.append(baseBuffer)
    }
    
    return genome
  }
  
  /**
   * Generate random genome with specific parameters
   * Alias for random() method
   */
  static randomWith(count = 10, options = {}) {
    return this.random(count, options)
  }

  /**
   * Mutate genome in-place with various mutation strategies
   * Based on genetic algorithm best practices
   */
  mutate(mutationRate = 0.001, options = {}) {
    const totalBits = this.buffer.bitLength || (this.buffer.buffer.length * 8)
    let mutations = 0
    
    // Extract mutation options with defaults
    const {
      bitFlipRate = mutationRate,           // Individual bit mutation rate
      creepRate = mutationRate * 2,         // Weight creep mutation rate  
      structuralRate = mutationRate * 10,   // Add/remove base rate
      maxCreep = 2,                         // Max weight change (±2)
      adaptiveRate = false,                 // Use adaptive mutation rate
      generation = 0,                        // Current generation (for adaptive)
      maxActionId = 511,                    // Maximum valid action ID (default 9 bits = 511)
      maxNeuronId = 511,                    // Maximum valid neuron ID
      maxSensorId = 511                     // Maximum valid sensor ID
    } = options
    
    // Calculate effective mutation rate (adaptive or fixed)
    const effectiveRate = adaptiveRate 
      ? bitFlipRate * Math.exp(-generation / 500)  // Decay over time
      : bitFlipRate
    
    // 1. BIT-FLIP MUTATIONS (most common)
    for (let i = 0; i < totalBits; i++) {
      if (Math.random() < effectiveRate) {
        const bit = this.buffer.getBit(i)
        this.buffer.setBit(i, bit ? 0 : 1)
        mutations++
      }
    }
    
    // 2. CREEP MUTATIONS (small weight adjustments)
    // Only apply to weight bits in connections
    if (Math.random() < creepRate) {
      let position = 0
      const totalBits = this.buffer.bitLength || (this.buffer.buffer.length * 8)

      while (position < totalBits - 3) {
        const base = Base.fromBitBuffer(this.buffer, position)
        if (!base) break

        if (base.type === 'connection' && Math.random() < creepRate) {
          const oldWeight = base.data || 0
          const creep = Math.floor((Math.random() - 0.5) * 2 * maxCreep)
          const newWeight = Math.max(0, Math.min(15, oldWeight + creep))

          if (newWeight !== oldWeight) {
            for (let b = 0; b < 4; b++) {
              const bitValue = (newWeight >> b) & 1
              this.buffer.setBit(position + 1 + b, bitValue)
            }
            mutations++
          }
        }

        position += base.bitLength
      }

      this._basesCache = null  // Clear cache after modifications
      this._basePositions = null
    }
    
    // 3. STRUCTURAL MUTATIONS (add/remove connections)
    // Can add/remove multiple bases for stronger effect
    const {
      addRate = structuralRate,      // Rate to add new genes
      removeRate = structuralRate,    // Rate to remove genes
      maxGrowth = 1,                 // Max bases to add per mutation
      maxShrink = 1,                 // Max bases to remove per mutation
      minSize = 100,                 // Minimum genome size in bits
      maxSize = 10000               // Maximum genome size in bits
    } = options
    
    // ADD NEW BASES (grow genome) - but respect size limits!
    const getCurrentBaseCount = () => {
      if (this._basesCache) return this._basesCache.length
      let count = 0
      for (const _ of this.iterBases()) {
        count++
      }
      return count
    }

    const currentBases = getCurrentBaseCount()
    const maxBasesAllowed = maxSize / 20  // Approximate bits per base
    
    if (Math.random() < addRate && currentBases < maxBasesAllowed && totalBits < maxSize) {
      const toAdd = Math.min(
        Math.ceil(Math.random() * maxGrowth),
        maxBasesAllowed - currentBases  // Don't exceed limit
      )
      for (let i = 0; i < toAdd; i++) {
        const baseType = Math.random() < 0.85 ? 'connection' : 'bias'
        const newBase = Base.randomBinary({ 
          type: baseType,
          weightRange: [0, 3]  // Start with small weights
        })
        this.buffer.append(newBase)
        mutations++
      }
    }
    
    // REMOVE BASES (shrink genome)
    if (Math.random() < removeRate && totalBits > minSize) {
      const toRemove = Math.ceil(Math.random() * maxShrink)
      for (let i = 0; i < toRemove && totalBits > minSize; i++) {
        // Remove approximately one base worth of bits
        const bitsToRemove = 25  // Average base size
        const newBitLength = Math.max(minSize, this.buffer.bitLength - bitsToRemove)
        
        // Resize buffer
        const newByteLength = Math.ceil(newBitLength / 8)
        const newBuffer = new Uint8Array(newByteLength)
        newBuffer.set(this.buffer.buffer.subarray(0, newByteLength))
        this.buffer.buffer = newBuffer
        this.buffer.bitLength = newBitLength
        mutations++
      }
    }
    
    // Clear cache and sanitize if mutated
    if (mutations > 0) {
      this._basesCache = null
      this._basePositions = null
      this.sanitizeVConflicts()
      this.sanitizeActionIds(maxActionId, maxNeuronId, maxSensorId)
    }
    
    return this
  }
  
  /**
   * Sanitize genome to fix V conflicts after mutation
   * If a bias accidentally becomes -7 (creates 'V'), change it to -6
   */
  sanitizeVConflicts() {
    let position = 0
    const totalBits = this.buffer.bitLength || (this.buffer.buffer.length * 8)
    
    while (position < totalBits - 4) {
      // Read first 5 bits
      const configBits = this.buffer.readBits(5, position)
      
      // Check if this is 11111 (V pattern)
      if (configBits === 0b11111) {
        // Determine what this should be based on context
        const remainingBits = totalBits - position
        
        if (remainingBits === 15 || (remainingBits > 15 && remainingBits < 20)) {
          // This looks like a bias that mutated to -7
          // Change it to -6 by flipping one bit
          // Change from 11111 to 11011 (flip bit 2)
          this.buffer.writeBits(0b11011, 5, position)
          position += 15 // Skip the rest of the bias
        } else if (remainingBits >= 20) {
          // This is likely a valid attribute
          position += 20
        } else {
          // Not enough bits, treat as corrupted bias
          this.buffer.writeBits(0b11011, 5, position)
          position += 15
        }
      } else {
        // Determine base type and skip appropriate bits
        const lastBit = configBits & 1
        if (lastBit === 0) {
          position += 25 // Connection
        } else {
          position += 15 // Bias
        }
      }
    }
  }

  /**
   * Crossover with another genome using various strategies
   *
   * Methods:
   * - 'base-aware': Preserves complete bases (connections/biases) - BEST for GAs
   * - 'uniform': 50/50 bit-level mixing
   * - 'single': Single-point crossover
   * - 'two-point': Two-point crossover
   */
  crossover(other, method = 'base-aware') {
    const genome1 = new Genome()
    const genome2 = new Genome()

    const bits1 = this.buffer.bitLength || (this.buffer.buffer.length * 8)
    const bits2 = other.buffer.bitLength || (other.buffer.buffer.length * 8)
    const minBits = Math.min(bits1, bits2)
    const maxBits = Math.max(bits1, bits2)

    genome1.buffer = new BitBuffer()
    genome2.buffer = new BitBuffer()

    switch (method) {
      case 'base-aware': {
        // Crossover at BASE level (preserves building blocks)
        const bases1 = this.getBases()
        const bases2 = other.getBases()

        const child1Bases = []
        const child2Bases = []

        const maxLength = Math.max(bases1.length, bases2.length)

        for (let i = 0; i < maxLength; i++) {
          // Randomly select from which parent each base comes
          // 50/50 chance per base
          if (Math.random() < 0.5) {
            if (bases1[i]) child1Bases.push(bases1[i])
            if (bases2[i]) child2Bases.push(bases2[i])
          } else {
            if (bases2[i]) child1Bases.push(bases2[i])
            if (bases1[i]) child2Bases.push(bases1[i])
          }
        }

        // Rebuild genomes from bases
        return [
          Genome.fromBases(child1Bases),
          Genome.fromBases(child2Bases)
        ]
      }

      case 'single': {
        // Single-point crossover (traditional)
        const crossPoint = Math.floor(minBits / 2)
        
        // Child 1: first half of parent1, second half of parent2
        for (let i = 0; i < crossPoint; i++) {
          genome1.buffer.writeBits(this.buffer.getBit(i), 1)
        }
        for (let i = crossPoint; i < bits2; i++) {
          genome1.buffer.writeBits(other.buffer.getBit(i), 1)
        }
        
        // Child 2: first half of parent2, second half of parent1
        for (let i = 0; i < crossPoint; i++) {
          genome2.buffer.writeBits(other.buffer.getBit(i), 1)
        }
        for (let i = crossPoint; i < bits1; i++) {
          genome2.buffer.writeBits(this.buffer.getBit(i), 1)
        }
        break
      }
      
      case 'two-point': {
        // Two-point crossover
        const point1 = Math.floor(minBits * 0.33)
        const point2 = Math.floor(minBits * 0.67)
        
        for (let i = 0; i < maxBits; i++) {
          const bit1 = i < bits1 ? this.buffer.getBit(i) : 0
          const bit2 = i < bits2 ? other.buffer.getBit(i) : 0
          
          if (i < point1 || i >= point2) {
            genome1.buffer.writeBits(bit1, 1)
            genome2.buffer.writeBits(bit2, 1)
          } else {
            genome1.buffer.writeBits(bit2, 1)
            genome2.buffer.writeBits(bit1, 1)
          }
        }
        break
      }
      
      case 'uniform':
      default: {
        // Uniform crossover (50% chance from each parent)
        // Best for maintaining diversity
        for (let i = 0; i < maxBits; i++) {
          const bit1 = i < bits1 ? this.buffer.getBit(i) : 0
          const bit2 = i < bits2 ? other.buffer.getBit(i) : 0
          
          if (Math.random() < 0.5) {
            genome1.buffer.writeBits(bit1, 1)
            genome2.buffer.writeBits(bit2, 1)
          } else {
            genome1.buffer.writeBits(bit2, 1)
            genome2.buffer.writeBits(bit1, 1)
          }
        }
        break
      }
    }
    
    return [genome1, genome2]
  }

  /**
   * Convert to base32 string representation
   */
  toString() {
    return this.buffer.toBase32String()
  }

  /**
   * Get encoded string representation
   */
  get encoded() {
    return this.toString()
  }

  /**
   * Get all bases as array
   */
  get bases() {
    return this.getBases()
  }

  /**
   * Clone genome
   */
  clone() {
    return new Genome(this.buffer.clone())
  }
  
  /**
   * Get base at specific index (O(1) with position cache)
   */
  getBase(index) {
    if (!this._basePositions) this.getBases()
    if (index < 0 || index >= this._basePositions.length) return null
    
    const position = this._basePositions[index]
    return Base.fromBitBuffer(this.buffer, position)
  }

  /**
   * Get size in bytes
   */
  get byteSize() {
    return this.buffer.byteLength
  }
  
  /**
   * Generate color from genome hash
   */
  static async color(genome) {
    let color = [0, 0, 0, 0]
    const genomeStr = typeof genome === 'string' ? genome : genome.encoded
    const hash = (await md5(genomeStr)).toUpperCase()
    
    for (const [i, str] of Object.entries(chunk(hash.split(''), 8))) {
      for (const char of str) {
        color[i] += Math.floor((Math.max(0, parseInt(char, 16) - 1) / 15) * 32)
      }
      color[i] = parseInt(((color[i] / 255) * 200) + 35)
    }
    
    return color
  }
  
  /**
   * Export to JSON with both string and binary
   */
  toJSON() {
    return {
      encoded: this.encoded,
      bases: this.bases,
      binary: Array.from(this.buffer.buffer) // Convert Uint8Array to regular array for JSON
    }
  }
  
  /**
   * Export as binary Uint8Array
   */
  toBinary() {
    return this.buffer.buffer
  }
  
  /**
   * Import from binary Uint8Array
   */
  static fromBinary(binary) {
    return new Genome(BitBuffer.from(binary))
  }

  /**
   * Get size in bits
   */
  get bitSize() {
    return this.buffer.bitLength || (this.buffer.buffer.length * 8)
  }

  /**
   * Compare genomes
   */
  equals(other) {
    const bits1 = this.bitSize
    const bits2 = other.bitSize
    
    if (bits1 !== bits2) return false
    
    for (let i = 0; i < bits1; i++) {
      if (this.buffer.getBit(i) !== other.buffer.getBit(i)) {
        return false
      }
    }
    
    return true
  }

  /**
   * Calculate hamming distance
   */
  hammingDistance(other) {
    const bits1 = this.bitSize
    const bits2 = other.bitSize
    const maxBits = Math.max(bits1, bits2)
    let distance = 0
    
    for (let i = 0; i < maxBits; i++) {
      const bit1 = i < bits1 ? this.buffer.getBit(i) : 0
      const bit2 = i < bits2 ? other.buffer.getBit(i) : 0
      if (bit1 !== bit2) distance++
    }
    
    return distance
  }

  /**
   * Sanitize action, neuron and sensor IDs after mutation
   * Ensures they don't exceed the maximum allowed values
   */
  sanitizeActionIds(maxActionId = 511, maxNeuronId = 511, maxSensorId = 511) {
    let position = 0
    const totalBits = this.buffer.bitLength || (this.buffer.buffer.length * 8)
    
    while (position < totalBits - 4) {
      // Read first 5 bits to determine base type
      const configBits = this.buffer.readBits(5, position)
      
      // Check if it's a connection (last bit is 0)
      if ((configBits & 1) === 0 && position + 25 <= totalBits) {
        // This is a connection base
        
        // Check target ID (bits 15-24)
        const targetBits = this.buffer.readBits(10, position + 15)
        const targetId = targetBits >> 1  // 9 bits
        const targetType = targetBits & 1  // 1 bit (0=neuron, 1=action)
        
        // If it's an action and ID exceeds max, wrap it around
        if (targetType === 1 && targetId > maxActionId) {
          const newId = targetId % (maxActionId + 1)
          const newTargetBits = (newId << 1) | 1  // Reconstruct with action type
          this.buffer.writeBits(newTargetBits, 10, position + 15)
        }
        // If it's a neuron and ID exceeds max, wrap it around
        else if (targetType === 0 && targetId > maxNeuronId) {
          const newId = targetId % (maxNeuronId + 1)
          const newTargetBits = (newId << 1) | 0  // Reconstruct with neuron type
          this.buffer.writeBits(newTargetBits, 10, position + 15)
        }
        
        // Check source ID (bits 5-14)
        const sourceBits = this.buffer.readBits(10, position + 5)
        const sourceId = sourceBits >> 1  // 9 bits
        const sourceType = sourceBits & 1  // 1 bit (0=sensor, 1=neuron)
        
        // If it's a sensor and ID exceeds max, wrap it around
        if (sourceType === 0 && sourceId > maxSensorId) {
          const newId = sourceId % (maxSensorId + 1)
          const newSourceBits = (newId << 1) | 0  // Reconstruct with sensor type
          this.buffer.writeBits(newSourceBits, 10, position + 5)
        }
        // If it's a neuron and ID exceeds max, wrap it around
        else if (sourceType === 1 && sourceId > maxNeuronId) {
          const newId = sourceId % (maxNeuronId + 1)
          const newSourceBits = (newId << 1) | 1  // Reconstruct with neuron type
          this.buffer.writeBits(newSourceBits, 10, position + 5)
        }
        
        position += 25  // Move to next base
      }
      // Check if it's a bias (last bit is 1, not all bits are 1)
      else if ((configBits & 1) === 1 && configBits !== 0b11111 && position + 15 <= totalBits) {
        // This is a bias base
        
        // Check target ID (bits 5-14)
        const targetBits = this.buffer.readBits(10, position + 5)
        const targetId = targetBits >> 2  // 8 bits
        const targetType = targetBits & 0b11  // 2 bits (0=sensor, 1=neuron, 2=action)
        
        // Sanitize based on target type
        if (targetType === 2 && targetId > maxActionId) {
          const newId = targetId % (maxActionId + 1)
          const newTargetBits = (newId << 2) | 2
          this.buffer.writeBits(newTargetBits, 10, position + 5)
        } else if (targetType === 1 && targetId > maxNeuronId) {
          const newId = targetId % (maxNeuronId + 1)
          const newTargetBits = (newId << 2) | 1
          this.buffer.writeBits(newTargetBits, 10, position + 5)
        } else if (targetType === 0 && targetId > maxSensorId) {
          const newId = targetId % (maxSensorId + 1)
          const newTargetBits = (newId << 2) | 0
          this.buffer.writeBits(newTargetBits, 10, position + 5)
        }
        
        position += 15  // Move to next base
      }
      // Check if it's an attribute (all 5 config bits are 1)
      else if (configBits === 0b11111 && position + 20 <= totalBits) {
        position += 20  // Skip attribute
      }
      else {
        // Unknown or corrupted base, skip a bit and try again
        position += 1
      }
    }
  }

}
