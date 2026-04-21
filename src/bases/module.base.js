import { BitBuffer } from '../bitbuffer.class.js'

const ADVANCED_SENTINEL = 0b11110
const TYPE_ID = 0b100
const HEADER_BITS = 5 + 3 + 8 + 8  // sentinel + typeId + moduleId + length

/**
 * ModuleBase - Bit-level encoding for hierarchical sub-networks
 *
 * Format: [sentinel:5=11110][type:3='100'][moduleId:8][length:8][moduleGenome:length*8bits]
 *
 * Total: 24 + (length * 8) bits
 */
export class ModuleBase {
  static fromBitBuffer(buffer, position = 0) {
    const totalBits = buffer.bitLength || (buffer.buffer.length * 8)

    if (position + HEADER_BITS > totalBits) return null
    if (buffer.readBits(5, position) !== ADVANCED_SENTINEL) return null
    if (buffer.readBits(3, position + 5) !== TYPE_ID) return null

    const moduleId = buffer.readBits(8, position + 8)
    const length = buffer.readBits(8, position + 16)
    const bitLength = HEADER_BITS + (length * 8)

    if (position + bitLength > totalBits) return null

    const moduleGenome = buffer.slice(position + HEADER_BITS, position + bitLength)

    return {
      type: 'module',
      moduleId,
      length,
      moduleGenome,
      bitLength,
      data: moduleId
    }
  }

  static toBitBuffer(base) {
    const length = base.length || Math.ceil(base.moduleGenome.bitLength / 8)
    const bitLength = HEADER_BITS + (length * 8)
    const buffer = new BitBuffer(bitLength)

    buffer.writeBits(ADVANCED_SENTINEL, 5)
    buffer.writeBits(TYPE_ID, 3)
    buffer.writeBits(base.moduleId & 0xFF, 8)
    buffer.writeBits(length & 0xFF, 8)
    buffer.append(base.moduleGenome)

    return buffer
  }

  /**
   * Generate random module
   * @param {Object} options - Configuration options
   * @returns {BitBuffer} Random module buffer
   */
  static randomBinary(options = {}) {
    const {
      maxModuleTypes = 256,
      minGenomeBytes = 10,
      maxGenomeBytes = 50
    } = options

    // Random genome length
    const length = minGenomeBytes + Math.floor(Math.random() * (maxGenomeBytes - minGenomeBytes + 1))

    // Generate random genome
    const moduleGenome = new BitBuffer(length * 8)
    for (let i = 0; i < length; i++) {
      moduleGenome.writeBits(Math.floor(Math.random() * 256), 8)
    }

    return ModuleBase.toBitBuffer({
      type: 'module',
      moduleId: Math.floor(Math.random() * maxModuleTypes),
      length,
      moduleGenome
    })
  }

  /**
   * Create module from existing genome
   * @param {number} moduleId - Module type ID
   * @param {BitBuffer} genome - Complete genome for the module
   * @returns {BitBuffer} Module buffer
   */
  static fromGenome(moduleId, genome) {
    const length = Math.ceil(genome.bitLength / 8)

    return ModuleBase.toBitBuffer({
      type: 'module',
      moduleId,
      length,
      moduleGenome: genome
    })
  }

  /**
   * Extract module genome
   * @param {Object} base - Module base
   * @returns {BitBuffer} Module genome
   */
  static extractGenome(base) {
    return base.moduleGenome.clone()
  }

  /**
   * Calculate bit length for a module
   * @param {number} lengthBytes - Genome length in bytes
   * @returns {number} Total bit length
   */
  static calculateBitLength(lengthBytes) {
    return HEADER_BITS + (lengthBytes * 8)
  }

  /**
   * Mutate module in-place
   * @param {BitBuffer} buffer - Buffer containing module
   * @param {number} position - Module position in buffer
   * @param {number} mutationRate - Mutation rate per bit
   * @param {Object} options - Mutation options
   */
  static mutateBinary(buffer, position, mutationRate = 0.01, options = {}) {
    const {
      canChangeModuleId = true,
      canChangeLength = false  // Dangerous - can corrupt genome
    } = options

    // Header layout: sentinel(5) + typeId(3) + moduleId(8) + length(8)
    const MODULE_ID_OFFSET = 8   // after sentinel+typeId
    const LENGTH_OFFSET = 16     // after sentinel+typeId+moduleId
    const GENOME_OFFSET = 24     // after full header

    const length = buffer.readBits(8, position + LENGTH_OFFSET)
    const bitLength = ModuleBase.calculateBitLength(length)

    if (canChangeModuleId && Math.random() < 0.05) {
      const newModuleId = Math.floor(Math.random() * 256)
      buffer.writeBits(newModuleId, 8, position + MODULE_ID_OFFSET)
    }

    const genomeStart = position + GENOME_OFFSET
    const genomeLength = length * 8

    for (let i = 0; i < genomeLength; i++) {
      if (Math.random() < mutationRate) {
        const bitPos = genomeStart + i
        const currentBit = buffer.getBit(bitPos)
        buffer.setBit(bitPos, currentBit ? 0 : 1)
      }
    }

    // Type 3: Length mutations (DANGEROUS - can corrupt)
    // Only enable if explicitly allowed
    if (canChangeLength && Math.random() < 0.01) {
      const delta = Math.random() < 0.5 ? -1 : 1
      const newLength = Math.max(1, Math.min(255, length + delta))
      buffer.writeBits(newLength, 8, position + 11)
    }
  }

  /**
   * Compare two modules
   * @param {Object} base1 - First module
   * @param {Object} base2 - Second module
   * @returns {boolean} True if equal
   */
  static equals(base1, base2) {
    if (base1.type !== 'module' || base2.type !== 'module') {
      return false
    }

    if (base1.moduleId !== base2.moduleId) return false
    if (base1.length !== base2.length) return false

    // Compare genomes byte by byte
    const genome1 = base1.moduleGenome.buffer
    const genome2 = base2.moduleGenome.buffer

    if (genome1.length !== genome2.length) return false

    for (let i = 0; i < genome1.length; i++) {
      if (genome1[i] !== genome2[i]) return false
    }

    return true
  }

  /**
   * Get module complexity (number of bases in genome)
   * @param {Object} base - Module base
   * @returns {number} Estimated number of bases
   */
  static getComplexity(base) {
    // Rough estimate: average base is ~20 bits
    return Math.floor(base.moduleGenome.bitLength / 20)
  }

  /**
   * Check if module is empty/invalid
   * @param {Object} base - Module base
   * @returns {boolean} True if empty
   */
  static isEmpty(base) {
    return base.length === 0 || base.moduleGenome.bitLength === 0
  }

  /**
   * Get module type name (if predefined)
   * @param {number} moduleId - Module ID
   * @returns {string} Module type name
   */
  static getModuleTypeName(moduleId) {
    // Predefined module types (extensible)
    const types = {
      0: 'Generic',
      1: 'Sensory Processor',
      2: 'Motor Controller',
      3: 'Memory Unit',
      4: 'Decision Maker',
      5: 'Pattern Recognizer',
      // ... can be extended
    }
    return types[moduleId] || `Custom-${moduleId}`
  }
}
