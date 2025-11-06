import { BitBuffer } from '../bitbuffer.class.js'

/**
 * PlasticityBase - Bit-level encoding for meta-learning plasticity
 *
 * Format: [type:3='101'][targetId:9][level:4]
 *
 * - type: 101 (Plasticity identifier)
 * - targetId: 0-511 neuron ID to make plastic
 * - level: 0-15 plasticity strength (how much weights can change)
 *
 * Plasticity controls meta-learning - how much a neuron's incoming
 * connections can adapt during the individual's lifetime. This is
 * separate from LearningRule which defines HOW weights change.
 * Plasticity defines HOW MUCH they can change.
 *
 * Example: Neuron #127 with high plasticity
 * 101 001111111 1010
 * │   │         │
 * │   │         └─ level: 10 (high)
 * │   └─ neuron #127
 * └─ type: Plasticity
 *
 * Total: 16 bits
 */
export class PlasticityBase {
  // Bit length constant
  static BIT_LENGTH = 16

  /**
   * Parse plasticity from BitBuffer
   * @param {BitBuffer} buffer - Source buffer
   * @param {number} position - Bit position to start reading
   * @returns {Object|null} Parsed base or null if invalid
   */
  static fromBitBuffer(buffer, position = 0) {
    const totalBits = buffer.bitLength || (buffer.buffer.length * 8)

    // Need exactly 16 bits
    if (position + PlasticityBase.BIT_LENGTH > totalBits) return null

    // Read type (3 bits) - should be 101
    const typeId = buffer.readBits(3, position)
    if (typeId !== 0b101) return null

    // Read target neuron ID (9 bits)
    const targetId = buffer.readBits(9, position + 3)

    // Read plasticity level (4 bits)
    const level = buffer.readBits(4, position + 12)

    return {
      type: 'plasticity',
      targetId,
      level,
      bitLength: PlasticityBase.BIT_LENGTH,
      data: targetId  // Compatibility with Base class
    }
  }

  /**
   * Convert plasticity to BitBuffer
   * @param {Object} base - Base object
   * @returns {BitBuffer} Encoded buffer
   */
  static toBitBuffer(base) {
    const buffer = new BitBuffer(PlasticityBase.BIT_LENGTH)

    // Write type (3 bits): 101
    buffer.writeBits(0b101, 3)

    // Write target neuron ID (9 bits)
    buffer.writeBits(base.targetId & 0b111111111, 9)

    // Write plasticity level (4 bits)
    buffer.writeBits(base.level & 0b1111, 4)

    return buffer
  }

  /**
   * Generate random plasticity
   * @param {Object} options - Configuration options
   * @returns {BitBuffer} Random plasticity buffer
   */
  static randomBinary(options = {}) {
    const {
      neurons = 512,
      minLevel = 0,
      maxLevel = 15
    } = options

    return PlasticityBase.toBitBuffer({
      type: 'plasticity',
      targetId: Math.floor(Math.random() * neurons),
      level: minLevel + Math.floor(Math.random() * (maxLevel - minLevel + 1))
    })
  }

  /**
   * Get plasticity as float (0.0 - 1.0)
   * @param {number} level - Integer level (0-15)
   * @returns {number} Float level
   */
  static levelToFloat(level) {
    return level / 15.0
  }

  /**
   * Convert float level to integer
   * @param {number} floatLevel - Float level (0.0 - 1.0)
   * @returns {number} Integer level (0-15)
   */
  static floatToLevel(floatLevel) {
    return Math.round(Math.max(0, Math.min(1, floatLevel)) * 15)
  }

  /**
   * Get plasticity category description
   * @param {number} level - Plasticity level (0-15)
   * @returns {string} Category name
   */
  static getCategory(level) {
    if (level === 0) return 'Fixed (no plasticity)'
    if (level <= 3) return 'Low plasticity'
    if (level <= 7) return 'Moderate plasticity'
    if (level <= 11) return 'High plasticity'
    return 'Very high plasticity'
  }

  /**
   * Calculate maximum weight change per tick
   * Plasticity acts as a multiplier for learning rules
   * @param {number} level - Plasticity level (0-15)
   * @param {number} baseLearningRate - Base learning rate
   * @returns {number} Maximum delta weight
   */
  static getMaxWeightChange(level, baseLearningRate = 0.1) {
    const plasticityFactor = PlasticityBase.levelToFloat(level)
    return baseLearningRate * plasticityFactor
  }

  /**
   * Apply plasticity scaling to weight update
   * @param {number} level - Plasticity level
   * @param {number} weightDelta - Raw weight change from learning rule
   * @returns {number} Scaled weight change
   */
  static scaleWeightDelta(level, weightDelta) {
    const plasticityFactor = PlasticityBase.levelToFloat(level)
    return weightDelta * plasticityFactor
  }

  /**
   * Check if neuron is plastic enough for learning
   * @param {number} level - Plasticity level
   * @param {number} threshold - Minimum level for plasticity
   * @returns {boolean} True if plastic enough
   */
  static isPlastic(level, threshold = 0) {
    return level > threshold
  }

  /**
   * Get critical period decay
   * Higher plasticity early in life, decreases over time
   * @param {number} level - Initial plasticity level
   * @param {number} age - Current age in ticks
   * @param {number} criticalPeriod - Critical period duration
   * @returns {number} Age-adjusted plasticity level
   */
  static getCriticalPeriodLevel(level, age, criticalPeriod = 1000) {
    if (age >= criticalPeriod) {
      // After critical period, reduce to 50%
      return Math.floor(level * 0.5)
    }

    // Linear decay during critical period
    const decayFactor = 1.0 - (age / criticalPeriod) * 0.5
    return Math.floor(level * decayFactor)
  }

  /**
   * Mutate plasticity in-place
   * @param {BitBuffer} buffer - Buffer containing plasticity
   * @param {number} position - Plasticity position in buffer
   * @param {number} mutationRate - Mutation rate per bit
   */
  static mutateBinary(buffer, position, mutationRate = 0.01) {
    // Bit-flip mutations
    for (let i = 0; i < PlasticityBase.BIT_LENGTH; i++) {
      if (Math.random() < mutationRate) {
        const currentBit = buffer.getBit(position + i)
        buffer.setBit(position + i, currentBit ? 0 : 1)
      }
    }
  }

  /**
   * Compare two plasticity bases
   * @param {Object} base1 - First plasticity
   * @param {Object} base2 - Second plasticity
   * @returns {boolean} True if equal
   */
  static equals(base1, base2) {
    if (base1.type !== 'plasticity' || base2.type !== 'plasticity') {
      return false
    }

    return base1.targetId === base2.targetId &&
           base1.level === base2.level
  }

  /**
   * Calculate stability index
   * Inverse of plasticity - how stable/resistant to change
   * @param {number} level - Plasticity level
   * @returns {number} Stability (0.0 - 1.0)
   */
  static getStability(level) {
    return 1.0 - PlasticityBase.levelToFloat(level)
  }

  /**
   * Get recommended learning rules for plasticity level
   * Different plasticity levels work best with different rules
   * @param {number} level - Plasticity level
   * @returns {Array<string>} Recommended rule types
   */
  static getRecommendedRules(level) {
    if (level === 0) {
      return []  // No learning
    } else if (level <= 3) {
      return ['Hebbian']  // Simple, stable learning
    } else if (level <= 7) {
      return ['Hebbian', 'Oja']  // Moderate learning with normalization
    } else if (level <= 11) {
      return ['Hebbian', 'Oja', 'BCM']  // Competitive learning
    } else {
      return ['Hebbian', 'Anti-Hebbian', 'STDP', 'BCM', 'Oja']  // All rules
    }
  }
}
