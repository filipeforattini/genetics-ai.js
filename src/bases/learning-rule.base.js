import { BitBuffer } from '../bitbuffer.class.js'

const ADVANCED_SENTINEL = 0b11110
const TYPE_ID = 0b010

/**
 * LearningRuleBase - Bit-level encoding for synaptic learning rules
 *
 * Format: [sentinel:5=11110][type:3='010'][ruleType:3][connId:10][rate:5][decay:2]
 *
 * Total: 28 bits
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

  static BIT_LENGTH = 28

  static fromBitBuffer(buffer, position = 0) {
    const totalBits = buffer.bitLength || (buffer.buffer.length * 8)

    if (position + LearningRuleBase.BIT_LENGTH > totalBits) return null
    if (buffer.readBits(5, position) !== ADVANCED_SENTINEL) return null
    if (buffer.readBits(3, position + 5) !== TYPE_ID) return null

    const ruleType = buffer.readBits(3, position + 8)
    const connId = buffer.readBits(10, position + 11)
    const rate = buffer.readBits(5, position + 21)
    const decay = buffer.readBits(2, position + 26)

    return {
      type: 'learning_rule',
      ruleType,
      connId,
      rate,
      decay,
      bitLength: LearningRuleBase.BIT_LENGTH,
      data: ruleType
    }
  }

  static toBitBuffer(base) {
    const buffer = new BitBuffer(LearningRuleBase.BIT_LENGTH)

    buffer.writeBits(ADVANCED_SENTINEL, 5)
    buffer.writeBits(TYPE_ID, 3)
    buffer.writeBits(base.ruleType & 0b111, 3)
    buffer.writeBits(base.connId & 0b1111111111, 10)
    buffer.writeBits(base.rate & 0b11111, 5)
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
    const PREFIX_BITS = 8  // sentinel(5) + typeId(3) — stays intact
    for (let i = PREFIX_BITS; i < LearningRuleBase.BIT_LENGTH; i++) {
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
