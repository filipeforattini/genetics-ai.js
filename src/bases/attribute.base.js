import { BitBuffer } from '../bitbuffer.class.js'

/**
 * AttributeBase - Bit-level encoding for custom attributes
 *
 * Format: [type:3='111'][attributeId:8][value:8][targetType:2][targetId:9]
 *
 * - type: 111 (Attribute identifier)
 * - attributeId: 0-255 attribute type identifier
 * - value: 0-255 attribute value
 * - targetType:
 *   00 = sensor (modifies sensor input)
 *   01 = neuron (modifies neuron activation)
 *   10 = action (modifies action output) ← NOVO! Influencia ações!
 *   11 = global (affects all of a type)
 * - targetId: 0-511 specific target ID
 *
 * Attributes allow users to experiment with custom properties that
 * influence behavior. Examples:
 * - "energy" attribute that reduces action outputs when low
 * - "fear" attribute that inhibits aggressive actions
 * - "curiosity" attribute that boosts exploration actions
 * - "hunger" attribute that amplifies food-seeking actions
 *
 * Example: Energy attribute (id=0, value=75) affecting action 3
 * 111 00000000 01001011 10 000000011
 * │   │        │        │  │
 * │   │        │        │  └─ action #3
 * │   │        │        └─ target type: action
 * │   │        └─ value: 75
 * │   └─ attribute: energy (0)
 * └─ type: Attribute
 *
 * Total: 30 bits
 */
export class AttributeBase {
  // Bit length constant
  static BIT_LENGTH = 30

  // Target type constants
  static TARGET_SENSOR = 0b00
  static TARGET_NEURON = 0b01
  static TARGET_ACTION = 0b10
  static TARGET_GLOBAL = 0b11

  // Common attribute IDs (user-extensible)
  static ATTR_ENERGY = 0
  static ATTR_HEALTH = 1
  static ATTR_HUNGER = 2
  static ATTR_FEAR = 3
  static ATTR_CURIOSITY = 4
  static ATTR_AGGRESSION = 5
  static ATTR_SOCIABILITY = 6
  static ATTR_SPEED = 7
  static ATTR_STRENGTH = 8
  static ATTR_INTELLIGENCE = 9

  /**
   * Parse attribute from BitBuffer
   * @param {BitBuffer} buffer - Source buffer
   * @param {number} position - Bit position to start reading
   * @returns {Object|null} Parsed base or null if invalid
   */
  static fromBitBuffer(buffer, position = 0) {
    const totalBits = buffer.bitLength || (buffer.buffer.length * 8)

    // Need exactly 30 bits
    if (position + AttributeBase.BIT_LENGTH > totalBits) return null

    // Read type (3 bits) - should be 111
    const typeId = buffer.readBits(3, position)
    if (typeId !== 0b111) return null

    // Read attribute ID (8 bits)
    const attributeId = buffer.readBits(8, position + 3)

    // Read value (8 bits)
    const value = buffer.readBits(8, position + 11)

    // Read target type (2 bits)
    const targetType = buffer.readBits(2, position + 19)

    // Read target ID (9 bits)
    const targetId = buffer.readBits(9, position + 21)

    return {
      type: 'attribute',
      attributeId,
      value,
      targetType,
      targetId,
      bitLength: AttributeBase.BIT_LENGTH,
      data: attributeId  // Compatibility with Base class
    }
  }

  /**
   * Convert attribute to BitBuffer
   * @param {Object} base - Base object
   * @returns {BitBuffer} Encoded buffer
   */
  static toBitBuffer(base) {
    const buffer = new BitBuffer(AttributeBase.BIT_LENGTH)

    // Write type (3 bits): 111
    buffer.writeBits(0b111, 3)

    // Write attribute ID (8 bits)
    buffer.writeBits(base.attributeId & 0xFF, 8)

    // Write value (8 bits)
    buffer.writeBits(base.value & 0xFF, 8)

    // Write target type (2 bits)
    buffer.writeBits(base.targetType & 0b11, 2)

    // Write target ID (9 bits)
    buffer.writeBits(base.targetId & 0b111111111, 9)

    return buffer
  }

  /**
   * Generate random attribute
   * @param {Object} options - Configuration options
   * @returns {BitBuffer} Random attribute buffer
   */
  static randomBinary(options = {}) {
    const {
      maxAttributes = 256,
      sensors = 512,
      neurons = 512,
      actions = 512
    } = options

    // Random target type
    const targetType = Math.floor(Math.random() * 4)

    // Random target ID based on type
    let maxTargetId
    if (targetType === AttributeBase.TARGET_SENSOR) maxTargetId = sensors
    else if (targetType === AttributeBase.TARGET_NEURON) maxTargetId = neurons
    else if (targetType === AttributeBase.TARGET_ACTION) maxTargetId = actions
    else maxTargetId = 1  // Global doesn't need specific ID

    return AttributeBase.toBitBuffer({
      type: 'attribute',
      attributeId: Math.floor(Math.random() * maxAttributes),
      value: Math.floor(Math.random() * 256),
      targetType,
      targetId: Math.floor(Math.random() * maxTargetId)
    })
  }

  /**
   * Get target type name
   * @param {number} targetType - Target type code
   * @returns {string} Type name
   */
  static getTargetTypeName(targetType) {
    const names = ['sensor', 'neuron', 'action', 'global']
    return names[targetType] || 'unknown'
  }

  /**
   * Get attribute name
   * @param {number} attributeId - Attribute ID
   * @returns {string} Attribute name
   */
  static getAttributeName(attributeId) {
    const names = {
      0: 'energy',
      1: 'health',
      2: 'hunger',
      3: 'fear',
      4: 'curiosity',
      5: 'aggression',
      6: 'sociability',
      7: 'speed',
      8: 'strength',
      9: 'intelligence'
    }
    return names[attributeId] || `custom-${attributeId}`
  }

  /**
   * Get value as normalized float (0.0 - 1.0)
   * @param {number} value - Integer value (0-255)
   * @returns {number} Normalized value
   */
  static valueToFloat(value) {
    return value / 255.0
  }

  /**
   * Convert float to integer value
   * @param {number} floatValue - Float value (0.0 - 1.0)
   * @returns {number} Integer value (0-255)
   */
  static floatToValue(floatValue) {
    return Math.round(Math.max(0, Math.min(1, floatValue)) * 255)
  }

  /**
   * Apply attribute influence to action output
   * This is where attributes modify action behavior!
   * @param {Object} attribute - Attribute base
   * @param {number} actionOutput - Original action output value
   * @param {string} influenceMode - How to apply influence
   * @returns {number} Modified action output
   */
  static applyActionInfluence(attribute, actionOutput, influenceMode = 'multiply') {
    const normalizedValue = AttributeBase.valueToFloat(attribute.value)

    switch (influenceMode) {
      case 'multiply':
        // Attribute acts as multiplier
        // value=255 → 1.0x (no change)
        // value=128 → 0.5x (reduce by half)
        // value=0 → 0.0x (completely suppress)
        return actionOutput * normalizedValue

      case 'add':
        // Attribute adds to output
        // value=128 → +0.0 (neutral, 128 is center)
        // value=255 → +0.5
        // value=0 → -0.5
        const delta = (normalizedValue - 0.5)
        return Math.max(-1, Math.min(1, actionOutput + delta))

      case 'threshold':
        // Attribute acts as threshold gate
        // Only allow action if attribute > threshold
        const threshold = 0.5
        const thresholdValue = AttributeBase.floatToValue(threshold)
        return attribute.value > thresholdValue ? actionOutput : 0

      case 'boost':
        // Attribute boosts output
        // value=255 → 2.0x (double)
        // value=128 → 1.0x (no change)
        // value=0 → 0.0x (suppress)
        const boostFactor = normalizedValue * 2
        return actionOutput * boostFactor

      case 'sigmoid':
        // Attribute affects sigmoid curve
        // High value = easier to activate
        const shift = (normalizedValue - 0.5) * 2  // -1 to +1
        return 1 / (1 + Math.exp(-(actionOutput + shift)))

      default:
        return actionOutput
    }
  }

  /**
   * Apply attribute influence to sensor input
   * @param {Object} attribute - Attribute base
   * @param {number} sensorInput - Original sensor input
   * @returns {number} Modified sensor input
   */
  static applySensorInfluence(attribute, sensorInput) {
    const normalizedValue = AttributeBase.valueToFloat(attribute.value)
    // Sensor influence: scale input by attribute value
    return sensorInput * normalizedValue
  }

  /**
   * Apply attribute influence to neuron activation
   * @param {Object} attribute - Attribute base
   * @param {number} neuronValue - Original neuron value
   * @returns {number} Modified neuron value
   */
  static applyNeuronInfluence(attribute, neuronValue) {
    const normalizedValue = AttributeBase.valueToFloat(attribute.value)
    // Neuron influence: add bias based on attribute
    const bias = (normalizedValue - 0.5) * 0.5  // -0.25 to +0.25
    return Math.max(-1, Math.min(1, neuronValue + bias))
  }

  /**
   * Check if attribute affects a specific target
   * @param {Object} attribute - Attribute base
   * @param {string} targetType - 'sensor', 'neuron', or 'action'
   * @param {number} targetId - Target ID
   * @returns {boolean} True if attribute affects this target
   */
  static affectsTarget(attribute, targetType, targetId) {
    // Global type affects everything of that kind
    if (attribute.targetType === AttributeBase.TARGET_GLOBAL) {
      const typeMap = { 'sensor': 0, 'neuron': 1, 'action': 2 }
      // Global can affect all types (targetId is ignored)
      return true
    }

    // Check specific target
    const expectedType = {
      'sensor': AttributeBase.TARGET_SENSOR,
      'neuron': AttributeBase.TARGET_NEURON,
      'action': AttributeBase.TARGET_ACTION
    }[targetType]

    return attribute.targetType === expectedType && attribute.targetId === targetId
  }

  /**
   * Mutate attribute in-place
   * @param {BitBuffer} buffer - Buffer containing attribute
   * @param {number} position - Attribute position in buffer
   * @param {number} mutationRate - Mutation rate per bit
   */
  static mutateBinary(buffer, position, mutationRate = 0.01) {
    // Bit-flip mutations
    for (let i = 0; i < AttributeBase.BIT_LENGTH; i++) {
      // Preserve type identifier bits (ensure attribute stays valid)
      if (i < 3) continue

      if (Math.random() < mutationRate) {
        const currentBit = buffer.getBit(position + i)
        buffer.setBit(position + i, currentBit ? 0 : 1)
      }
    }

    // Re-enforce type bits in case mutation skipped due to rate
    buffer.writeBits(0b111, 3, position)
  }

  /**
   * Compare two attributes
   * @param {Object} base1 - First attribute
   * @param {Object} base2 - Second attribute
   * @returns {boolean} True if equal
   */
  static equals(base1, base2) {
    if (base1.type !== 'attribute' || base2.type !== 'attribute') {
      return false
    }

    return base1.attributeId === base2.attributeId &&
           base1.value === base2.value &&
           base1.targetType === base2.targetType &&
           base1.targetId === base2.targetId
  }

  /**
   * Get attribute description
   * @param {Object} attribute - Attribute base
   * @returns {string} Human-readable description
   */
  static getDescription(attribute) {
    const name = AttributeBase.getAttributeName(attribute.attributeId)
    const value = attribute.value
    const targetTypeName = AttributeBase.getTargetTypeName(attribute.targetType)
    const targetId = attribute.targetType === AttributeBase.TARGET_GLOBAL ? 'all' : attribute.targetId

    return `${name}=${value} → ${targetTypeName} #${targetId}`
  }
}
