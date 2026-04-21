import { BitBuffer } from '../bitbuffer.class.js'

const ADVANCED_SENTINEL = 0b11110
const TYPE_ID = 0b101

/**
 * PlasticityBase - Bit-level encoding for meta-learning plasticity
 *
 * Format: [sentinel:5=11110][type:3='101'][targetId:9][level:4]
 *
 * Total: 21 bits
 */
export class PlasticityBase {
  static BIT_LENGTH = 21

  static fromBitBuffer(buffer, position = 0) {
    const totalBits = buffer.bitLength || (buffer.buffer.length * 8)

    if (position + PlasticityBase.BIT_LENGTH > totalBits) return null
    if (buffer.readBits(5, position) !== ADVANCED_SENTINEL) return null
    if (buffer.readBits(3, position + 5) !== TYPE_ID) return null

    const targetId = buffer.readBits(9, position + 8)
    const level = buffer.readBits(4, position + 17)

    return {
      type: 'plasticity',
      targetId,
      level,
      bitLength: PlasticityBase.BIT_LENGTH,
      data: targetId
    }
  }

  static toBitBuffer(base) {
    const buffer = new BitBuffer(PlasticityBase.BIT_LENGTH)

    buffer.writeBits(ADVANCED_SENTINEL, 5)
    buffer.writeBits(TYPE_ID, 3)
    buffer.writeBits(base.targetId & 0b111111111, 9)
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
    const PREFIX_BITS = 8  // sentinel(5) + typeId(3) — stays intact
    for (let i = PREFIX_BITS; i < PlasticityBase.BIT_LENGTH; i++) {
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
