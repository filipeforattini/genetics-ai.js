import { BitBuffer } from '../bitbuffer.class.js'

const ADVANCED_SENTINEL = 0b11110
const TYPE_ID = 0b011

/**
 * MemoryCellBase - Bit-level encoding for temporal memory storage
 *
 * Format: [sentinel:5=11110][type:3='011'][cellId:9][decay:5][persistence:3]
 *
 * - sentinel: 11110 (reserved; tells basic parser to defer)
 * - type: 011 (MemoryCell identifier among advanced bases)
 * - cellId: 0-511 unique memory cell identifier
 * - decay: 0-31 exponential decay rate per tick
 * - persistence: 0-7 (0=volatile, 7=permanent)
 *
 * Total: 25 bits
 */
export class MemoryCellBase {
  // Bit length constant
  static BIT_LENGTH = 25

  /**
   * Parse memory cell from BitBuffer
   * @param {BitBuffer} buffer - Source buffer
   * @param {number} position - Bit position to start reading
   * @returns {Object|null} Parsed base or null if invalid
   */
  static fromBitBuffer(buffer, position = 0) {
    const totalBits = buffer.bitLength || (buffer.buffer.length * 8)

    if (position + MemoryCellBase.BIT_LENGTH > totalBits) return null

    // Sentinel (5 bits) — distinguishes from any basic base
    if (buffer.readBits(5, position) !== ADVANCED_SENTINEL) return null

    // Type ID (3 bits) within the advanced-base namespace
    if (buffer.readBits(3, position + 5) !== TYPE_ID) return null

    const cellId = buffer.readBits(9, position + 8)
    const decay = buffer.readBits(5, position + 17)
    const persistence = buffer.readBits(3, position + 22)

    return {
      type: 'memory_cell',
      cellId,
      decay,
      persistence,
      bitLength: MemoryCellBase.BIT_LENGTH,
      data: cellId  // Compatibility with Base class
    }
  }

  /**
   * Convert memory cell to BitBuffer
   * @param {Object} base - Base object
   * @returns {BitBuffer} Encoded buffer
   */
  static toBitBuffer(base) {
    const buffer = new BitBuffer(MemoryCellBase.BIT_LENGTH)

    buffer.writeBits(ADVANCED_SENTINEL, 5)       // sentinel
    buffer.writeBits(TYPE_ID, 3)                 // 011
    buffer.writeBits(base.cellId & 0b111111111, 9)
    buffer.writeBits(base.decay & 0b11111, 5)
    buffer.writeBits(base.persistence & 0b111, 3)

    return buffer
  }

  /**
   * Generate random memory cell
   * @param {Object} options - Configuration options
   * @returns {BitBuffer} Random memory cell buffer
   */
  static randomBinary(options = {}) {
    const {
      maxCells = 512
    } = options

    return MemoryCellBase.toBitBuffer({
      type: 'memory_cell',
      cellId: Math.floor(Math.random() * maxCells),
      decay: Math.floor(Math.random() * 32),      // 0-31
      persistence: Math.floor(Math.random() * 8)  // 0-7
    })
  }

  /**
   * Get decay factor per tick
   * @param {number} decay - Decay code (0-31)
   * @returns {number} Decay factor (0.0 - 1.0)
   */
  static getDecayFactor(decay) {
    // Exponential decay: higher values = faster decay
    // decay=0 → 0% per tick (no decay)
    // decay=31 → 10% per tick (rapid decay)
    return (decay / 31) * 0.1
  }

  /**
   * Get persistence threshold
   * Cells with high persistence resist being cleared/reset
   * @param {number} persistence - Persistence code (0-7)
   * @returns {number} Threshold (0.0 - 1.0)
   */
  static getPersistenceThreshold(persistence) {
    return persistence / 7.0
  }

  /**
   * Update memory cell value with decay
   * @param {number} currentValue - Current cell value
   * @param {Object} cell - Memory cell base
   * @param {number} newInput - Optional new input to add
   * @returns {number} Updated value
   */
  static updateValue(currentValue, cell, newInput = 0) {
    const decayFactor = MemoryCellBase.getDecayFactor(cell.decay)

    // Apply decay
    let value = currentValue * (1 - decayFactor)

    // Add new input
    value += newInput

    // Clamp to reasonable range
    return Math.max(-1, Math.min(1, value))
  }

  /**
   * Check if cell should persist during reset
   * @param {Object} cell - Memory cell base
   * @param {number} resetProbability - Probability of reset (0-1)
   * @returns {boolean} True if cell persists
   */
  static shouldPersist(cell, resetProbability = 1.0) {
    const threshold = MemoryCellBase.getPersistenceThreshold(cell.persistence)
    return Math.random() > (resetProbability * (1 - threshold))
  }

  /**
   * Get memory decay time constant (ticks until ~37% of original)
   * @param {Object} cell - Memory cell base
   * @returns {number} Time constant in ticks
   */
  static getTimeConstant(cell) {
    const decayFactor = MemoryCellBase.getDecayFactor(cell.decay)
    if (decayFactor === 0) return Infinity

    // τ = 1 / decay_factor (exponential decay time constant)
    return Math.round(1 / decayFactor)
  }

  /**
   * Get half-life (ticks until value is 50% of original)
   * @param {Object} cell - Memory cell base
   * @returns {number} Half-life in ticks
   */
  static getHalfLife(cell) {
    const decayFactor = MemoryCellBase.getDecayFactor(cell.decay)
    if (decayFactor === 0) return Infinity

    // t_half = ln(2) / decay_factor
    return Math.round(Math.log(2) / decayFactor)
  }

  /**
   * Mutate memory cell in-place
   * @param {BitBuffer} buffer - Buffer containing cell
   * @param {number} position - Cell position in buffer
   * @param {number} mutationRate - Mutation rate per bit
   */
  static mutateBinary(buffer, position, mutationRate = 0.01) {
    // Keep the 8-bit sentinel+type prefix intact; mutations there would
    // turn the base into unparseable garbage that the genome parser skips.
    const PREFIX_BITS = 8
    for (let i = PREFIX_BITS; i < MemoryCellBase.BIT_LENGTH; i++) {
      if (Math.random() < mutationRate) {
        const currentBit = buffer.getBit(position + i)
        buffer.setBit(position + i, currentBit ? 0 : 1)
      }
    }
  }

  /**
   * Compare two memory cells
   * @param {Object} base1 - First cell
   * @param {Object} base2 - Second cell
   * @returns {boolean} True if equal
   */
  static equals(base1, base2) {
    if (base1.type !== 'memory_cell' || base2.type !== 'memory_cell') {
      return false
    }

    return base1.cellId === base2.cellId &&
           base1.decay === base2.decay &&
           base1.persistence === base2.persistence
  }

  /**
   * Get memory type description
   * @param {Object} cell - Memory cell base
   * @returns {string} Description
   */
  static getTypeDescription(cell) {
    const halfLife = MemoryCellBase.getHalfLife(cell)
    const persistence = MemoryCellBase.getPersistenceThreshold(cell.persistence)

    if (halfLife > 1000) {
      return 'Long-term memory (persistent)'
    } else if (halfLife > 100) {
      return 'Medium-term memory'
    } else if (halfLife > 10) {
      return 'Short-term memory (working)'
    } else {
      return 'Ultra-short memory (sensory buffer)'
    }
  }
}
