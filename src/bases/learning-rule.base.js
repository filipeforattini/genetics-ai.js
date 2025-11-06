import { BitBuffer } from '../bitbuffer.class.js'

/**
 * LearningRuleBase - Bit-level encoding for synaptic learning rules
 *
 * Format: [type:3='010'][ruleType:3][connId:10][rate:5][decay:2]
 *
 * - type: 010 (LearningRule identifier)
 * - ruleType:
 *   000 = Hebbian ("fire together, wire together")
 *   001 = Anti-Hebbian (decorrelation)
 *   010 = STDP (Spike-Timing-Dependent Plasticity)
 *   011 = BCM (Bienenstock-Cooper-Munro)
 *   100 = Oja's Rule (weight normalization)
 *   101-111 = Reserved
 * - connId: 0-1023 connection index to modify
 * - rate: 0-31 learning rate (scaled to 0.0-1.0)
 * - decay: 00=none, 01=slow, 10=medium, 11=fast
 *
 * Example: Hebbian learning on connection #42, rate 0.5
 * 010 000 0000101010 01111 10
 * │   │   │          │     │
 * │   │   │          │     └─ decay: medium
 * │   │   │          └─ rate: 15 (= 0.5)
 * │   │   └─ connection #42
 * │   └─ Hebbian
 * └─ type: LearningRule
 *
 * Total: 23 bits
 */
export class LearningRuleBase {
  // Learning rule type constants
  static HEBBIAN = 0b000
  static ANTI_HEBBIAN = 0b001
  static STDP = 0b010
  static BCM = 0b011
  static OJA = 0b100

  // Decay constants
  static DECAY_NONE = 0b00
  static DECAY_SLOW = 0b01
  static DECAY_MEDIUM = 0b10
  static DECAY_FAST = 0b11

  // Bit length constant
  static BIT_LENGTH = 23

  /**
   * Parse learning rule from BitBuffer
   * @param {BitBuffer} buffer - Source buffer
   * @param {number} position - Bit position to start reading
   * @returns {Object|null} Parsed base or null if invalid
   */
  static fromBitBuffer(buffer, position = 0) {
    const totalBits = buffer.bitLength || (buffer.buffer.length * 8)

    // Need exactly 23 bits
    if (position + LearningRuleBase.BIT_LENGTH > totalBits) return null

    // Read type (3 bits) - should be 010
    const typeId = buffer.readBits(3, position)
    if (typeId !== 0b010) return null

    // Read rule type (3 bits)
    const ruleType = buffer.readBits(3, position + 3)

    // Read connection ID (10 bits)
    const connId = buffer.readBits(10, position + 6)

    // Read learning rate (5 bits)
    const rate = buffer.readBits(5, position + 16)

    // Read decay (2 bits)
    const decay = buffer.readBits(2, position + 21)

    return {
      type: 'learning_rule',
      ruleType,
      connId,
      rate,
      decay,
      bitLength: LearningRuleBase.BIT_LENGTH,
      data: ruleType  // Compatibility with Base class
    }
  }

  /**
   * Convert learning rule to BitBuffer
   * @param {Object} base - Base object
   * @returns {BitBuffer} Encoded buffer
   */
  static toBitBuffer(base) {
    const buffer = new BitBuffer(LearningRuleBase.BIT_LENGTH)

    // Write type (3 bits): 010
    buffer.writeBits(0b010, 3)

    // Write rule type (3 bits)
    buffer.writeBits(base.ruleType & 0b111, 3)

    // Write connection ID (10 bits)
    buffer.writeBits(base.connId & 0b1111111111, 10)

    // Write learning rate (5 bits)
    buffer.writeBits(base.rate & 0b11111, 5)

    // Write decay (2 bits)
    buffer.writeBits(base.decay & 0b11, 2)

    return buffer
  }

  /**
   * Generate random learning rule
   * @param {Object} options - Configuration options
   * @returns {BitBuffer} Random learning rule buffer
   */
  static randomBinary(options = {}) {
    const {
      maxConnections = 1024,
      ruleTypes = [
        LearningRuleBase.HEBBIAN,
        LearningRuleBase.ANTI_HEBBIAN,
        LearningRuleBase.STDP
      ]
    } = options

    return LearningRuleBase.toBitBuffer({
      type: 'learning_rule',
      ruleType: ruleTypes[Math.floor(Math.random() * ruleTypes.length)],
      connId: Math.floor(Math.random() * maxConnections),
      rate: Math.floor(Math.random() * 32),  // 0-31
      decay: Math.floor(Math.random() * 4)   // 0-3
    })
  }

  /**
   * Get learning rate as float (0.0 - 1.0)
   * @param {number} rate - Integer rate (0-31)
   * @returns {number} Float rate
   */
  static rateToFloat(rate) {
    return rate / 31.0
  }

  /**
   * Convert float rate to integer
   * @param {number} floatRate - Float rate (0.0 - 1.0)
   * @returns {number} Integer rate (0-31)
   */
  static floatToRate(floatRate) {
    return Math.round(Math.max(0, Math.min(1, floatRate)) * 31)
  }

  /**
   * Get decay factor
   * @param {number} decay - Decay code (0-3)
   * @returns {number} Decay factor per tick
   */
  static getDecayFactor(decay) {
    const factors = [0, 0.001, 0.01, 0.05]  // none, slow, medium, fast
    return factors[decay] || 0
  }

  /**
   * Get rule type name
   * @param {number} ruleType - Rule type code
   * @returns {string} Rule name
   */
  static getRuleName(ruleType) {
    const names = ['Hebbian', 'Anti-Hebbian', 'STDP', 'BCM', 'Oja']
    return names[ruleType] || 'Unknown'
  }

  /**
   * Apply learning rule to connection weight
   * @param {Object} rule - Learning rule base
   * @param {number} weight - Current weight
   * @param {number} preValue - Pre-synaptic activation
   * @param {number} postValue - Post-synaptic activation
   * @returns {number} New weight
   */
  static applyRule(rule, weight, preValue, postValue) {
    const rate = LearningRuleBase.rateToFloat(rule.rate)
    const decayFactor = LearningRuleBase.getDecayFactor(rule.decay)

    let delta = 0

    switch (rule.ruleType) {
      case LearningRuleBase.HEBBIAN:
        // Δw = η × pre × post
        delta = rate * preValue * postValue
        break

      case LearningRuleBase.ANTI_HEBBIAN:
        // Δw = -η × pre × post
        delta = -rate * preValue * postValue
        break

      case LearningRuleBase.STDP:
        // Simplified STDP: strengthen if post follows pre
        // (Real STDP needs timing information)
        if (preValue > 0.5 && postValue > 0.5) {
          delta = rate * 0.1
        } else if (postValue > 0.5 && preValue < 0.5) {
          delta = -rate * 0.1
        }
        break

      case LearningRuleBase.BCM:
        // BCM: Δw = η × post × (post - θ) × pre
        // Simplified θ = 0.5
        const theta = 0.5
        delta = rate * postValue * (postValue - theta) * preValue
        break

      case LearningRuleBase.OJA:
        // Oja's Rule: Δw = η × post × (pre - post × w)
        delta = rate * postValue * (preValue - postValue * weight)
        break
    }

    // Apply weight update
    let newWeight = weight + delta

    // Apply decay
    if (decayFactor > 0) {
      newWeight *= (1 - decayFactor)
    }

    // Clamp weight to reasonable range
    return Math.max(-1, Math.min(1, newWeight))
  }

  /**
   * Mutate learning rule in-place
   * @param {BitBuffer} buffer - Buffer containing rule
   * @param {number} position - Rule position in buffer
   * @param {number} mutationRate - Mutation rate per bit
   */
  static mutateBinary(buffer, position, mutationRate = 0.01) {
    // Bit-flip mutations
    for (let i = 0; i < LearningRuleBase.BIT_LENGTH; i++) {
      if (Math.random() < mutationRate) {
        const currentBit = buffer.getBit(position + i)
        buffer.setBit(position + i, currentBit ? 0 : 1)
      }
    }
  }

  /**
   * Compare two learning rules
   * @param {Object} base1 - First rule
   * @param {Object} base2 - Second rule
   * @returns {boolean} True if equal
   */
  static equals(base1, base2) {
    if (base1.type !== 'learning_rule' || base2.type !== 'learning_rule') {
      return false
    }

    return base1.ruleType === base2.ruleType &&
           base1.connId === base2.connId &&
           base1.rate === base2.rate &&
           base1.decay === base2.decay
  }
}
