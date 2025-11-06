import { BitBuffer } from './bitbuffer.class.js'
import { LearningRuleBase } from './bases/learning-rule.base.js'
import { MemoryCellBase } from './bases/memory-cell.base.js'
import { ModuleBase } from './bases/module.base.js'
import { PlasticityBase } from './bases/plasticity.base.js'
import { AttributeBase } from './bases/attribute.base.js'

/**
 * Base - Binary implementation for maximum performance
 * Works directly with bits instead of string conversions
 * Supports connections, biases, attributes, and advanced base types
 */
export class Base {
  /**
   * Parse base from BitBuffer
   * Much faster than string parsing
   * Supports all base types: connection, bias, attribute, evolved_neuron, learning_rule, etc.
   */
  static fromBitBuffer(buffer, position = 0) {
    // Check if we have enough bits
    const totalBits = buffer.bitLength || (buffer.buffer.length * 8)
    if (position + 3 > totalBits) return null

    // PARSING PRIORITY: Try basic bases first to avoid false positives!
    // Basic bases (connection/bias) are much more common than advanced bases
    // Trying advanced bases first causes false positives

    // Try basic parsing FIRST (connections and biases)
    // Read 5-bit config
    if (position + 5 > totalBits) return null
    const configBits = buffer.readBits(5, position)
    const lastBit = configBits & 1

    // Determine base type: connection (lastBit=0) or bias (lastBit=1)
    let type
    const pattern = configBits & 0b11111

    // Special pattern for attribute: 11111 (all bits set)
    // BUT: We need to check if this is actually an attribute or a corrupted bias
    if (pattern === 0b11111) {
      // Check the context: attributes are 20 bits, bias are 15 bits
      // If we have exactly 15 bits left or this looks like a bias, treat as bias
      const remainingBits = totalBits - position

      if (remainingBits === 15) {
        // This is likely a corrupted bias (mutation created -7)
        type = 'bias'
      } else if (remainingBits >= 20) {
        // Check if next bits look like attribute pattern
        // Attributes have specific structure after the V marker
        type = 'attribute'
      } else {
        // Not enough bits for attribute, treat as corrupted bias
        type = 'bias'
      }
    } else if (lastBit === 0) {
      type = 'connection'
    } else {
      type = 'bias'
    }
    
    let base = { type, encoded: null }
    
    if (type === 'bias') {
      // Bias: 3 chars total = 15 bits
      // Check if we have enough bits
      if (position + 15 > totalBits) return null
      
      // Extract data and sign from config
      const data = (configBits >> 2) & 0b111  // 3 bits
      const sign = (configBits >> 1) & 1      // 1 bit
      
      // If pattern was 11111 (V), this is a corrupted -7 bias
      if ((configBits & 0b11111) === 0b11111) {
        // This was a mutation that created -7, map it to -6
        base.data = -6
      } else {
        // Normal bias processing
        base.data = sign ? -(data > 6 ? 6 : data) : data
      }
      
      // Read target (10 bits)
      const targetBits = buffer.readBits(10, position + 5)
      const targetId = targetBits >> 2  // 8 bits
      const targetType = targetBits & 0b11  // 2 bits
      
      base.target = {
        id: targetId,
        type: ['sensor', 'neuron', 'action'][targetType] || 'neuron'
      }
      
      base.bitLength = 15
    } else if (type === 'attribute') {
      // Attribute: 4 chars total = 20 bits
      // Check if we have enough bits
      if (position + 20 > totalBits) return null
      
      // No data in config for attributes (all bits used for type identification)
      base.data = 0
      
      // Read ID (8 bits)
      base.id = buffer.readBits(8, position + 5)
      
      // Read value (7 bits)
      base.value = buffer.readBits(7, position + 13)
      
      base.bitLength = 20
    } else {
      // Connection: 5 chars total = 25 bits
      // Check if we have enough bits
      if (position + 25 > totalBits) return null
      
      // Extract data from config
      base.data = (configBits >> 1) & 0b1111  // 4 bits
      
      // Read source (10 bits)
      const sourceBits = buffer.readBits(10, position + 5)
      const sourceId = sourceBits >> 1  // 9 bits
      const sourceType = sourceBits & 1  // 1 bit
      
      base.source = {
        id: sourceId,
        type: sourceType === 0 ? 'sensor' : 'neuron'
      }
      
      // Read target (10 bits)
      const targetBits = buffer.readBits(10, position + 15)
      const targetId = targetBits >> 1  // 9 bits
      const targetType = targetBits & 1  // 1 bit
      
      base.target = {
        id: targetId,
        type: targetType === 0 ? 'neuron' : 'action'
      }
      
      base.bitLength = 25
    }
    
    return base
  }

  /**
   * Convert base to BitBuffer
   * Much faster than string conversion
   */
  static toBitBuffer(base) {
    // Validate base has required type field
    if (!base || !base.type) {
      throw new Error('Base must have a type property')
    }

    if (base.type === 'attribute') {
      const buffer = new BitBuffer(20)

      // Config byte (5 bits): use special pattern 11111 for attribute
      const config = 0b11111  // All bits set indicates attribute
      buffer.writeBits(config, 5)

      // ID (8 bits) - default to 0 if missing
      const id = (base.id !== undefined) ? base.id : 0
      buffer.writeBits(id & 0xFF, 8)

      // Value (7 bits) - default to 0 if missing
      const value = (base.value !== undefined) ? base.value : 0
      buffer.writeBits(value & 0x7F, 7)

      return buffer
    } else if (base.type === 'bias') {
      const buffer = new BitBuffer(15)

      // Validate target exists
      if (!base.target || base.target.id === undefined) {
        throw new Error('Bias base must have a valid target with id')
      }

      // Limit -7 to -6 to avoid 'V' conflict
      const data = (base.data !== undefined) ? base.data : 0
      const limitedData = data === -7 ? -6 : data

      // Config byte (5 bits)
      const absData = Math.abs(limitedData) & 0b111  // 3 bits
      const sign = limitedData < 0 ? 1 : 0  // 1 bit
      const typeBit = 1  // bias type
      const config = (absData << 2) | (sign << 1) | typeBit
      buffer.writeBits(config, 5)

      // Target (10 bits)
      const targetId = base.target.id & 0xFF  // 8 bits
      let targetType = 0
      if (base.target.type === 'neuron') targetType = 1
      else if (base.target.type === 'action') targetType = 2

      const targetBits = (targetId << 2) | targetType
      buffer.writeBits(targetBits, 10)

      return buffer
    } else {
      // Connection type (default)
      const buffer = new BitBuffer(25)

      // Validate source and target exist
      if (!base.source || base.source.id === undefined) {
        throw new Error('Connection base must have a valid source with id')
      }
      if (!base.target || base.target.id === undefined) {
        throw new Error('Connection base must have a valid target with id')
      }

      // Config byte (5 bits)
      const data = (base.data !== undefined) ? base.data : 0
      const typeBit = 0  // connection type
      const config = (data & 0b1111) << 1 | typeBit
      buffer.writeBits(config, 5)

      // Source (10 bits)
      const sourceId = base.source.id & 0x1FF  // 9 bits
      const sourceType = base.source.type === 'neuron' ? 1 : 0
      const sourceBits = (sourceId << 1) | sourceType
      buffer.writeBits(sourceBits, 10)

      // Target (10 bits)
      const targetId = base.target.id & 0x1FF  // 9 bits
      const targetType = base.target.type === 'action' ? 1 : 0
      const targetBits = (targetId << 1) | targetType
      buffer.writeBits(targetBits, 10)

      return buffer
    }
  }

  /**
   * Generate random base as BitBuffer
   * No string conversion needed
   */
  static randomBinary(options = {}) {
    const {
      neurons = 10,
      sensors = 10,
      actions = 10,
      attributes = 0,
      attributeIds = 0,  // Number of different attribute IDs to use
      type = null  // Force specific type if provided
    } = options
    
    // If type is specified, generate that type
    if (type === 'attribute') {
      const maxIds = Math.min(16, attributeIds || attributes || 1)  // Max 16 IDs (0-15)
      return Base.toBitBuffer({
        type: 'attribute',
        data: 0,  // Not used in attribute
        id: Math.floor(Math.random() * maxIds),
        value: Math.floor(Math.random() * 128)  // 7 bits max (0-127)
      })
    } else if (type === 'bias') {
      // Select target type first, then generate appropriate ID
      const targetType = ['sensor', 'neuron', 'action'][Math.floor(Math.random() * 3)]
      let maxId
      if (targetType === 'sensor') maxId = sensors
      else if (targetType === 'neuron') maxId = neurons
      else maxId = actions
      
      return Base.toBitBuffer({
        type: 'bias',
        data: Math.floor(Math.random() * 14) - 6,  // -6 to 7 (avoiding -7 which conflicts with 'V')
        target: {
          id: Math.floor(Math.random() * maxId),
          type: targetType
        }
      })
    } else if (type === 'connection') {
      const useNeuronSource = Math.random() < 0.5
      const useActionTarget = Math.random() < 0.5
      
      return Base.toBitBuffer({
        type: 'connection',
        data: Math.floor(Math.random() * 16),  // 0 to 15
        source: {
          id: Math.floor(Math.random() * (useNeuronSource ? neurons : sensors)),
          type: useNeuronSource ? 'neuron' : 'sensor'
        },
        target: {
          id: Math.floor(Math.random() * (useActionTarget ? actions : neurons)),
          type: useActionTarget ? 'action' : 'neuron'
        }
      })
    }
    
    // Random selection based on enabled features
    const rand = Math.random()
    
    // If attributes are enabled and no type specified
    const hasAttributes = (attributeIds > 0)
    
    if (hasAttributes && rand < 0.15) {
      // 15% chance for attribute if enabled
      const maxIds = Math.min(16, attributeIds || attributes || 1)
      return Base.toBitBuffer({
        type: 'attribute',
        data: 0,
        id: Math.floor(Math.random() * maxIds),
        value: Math.floor(Math.random() * 128)
      })
    } else if (rand < 0.40) {  
      // 25% chance for bias (or 40% if no attributes)
      // Select target type first, then generate appropriate ID
      const targetType = ['sensor', 'neuron', 'action'][Math.floor(Math.random() * 3)]
      let maxId
      if (targetType === 'sensor') maxId = sensors
      else if (targetType === 'neuron') maxId = neurons
      else maxId = actions
      
      return Base.toBitBuffer({
        type: 'bias',
        data: Math.floor(Math.random() * 14) - 6,  // -6 to 7 (avoiding -7)
        target: {
          id: Math.floor(Math.random() * maxId),
          type: targetType
        }
      })
    } else {
      // Connection (remaining probability)
      const useNeuronSource = Math.random() < 0.5
      const useActionTarget = Math.random() < 0.5
      
      return Base.toBitBuffer({
        type: 'connection',
        data: Math.floor(Math.random() * 16),
        source: {
          id: Math.floor(Math.random() * (useNeuronSource ? neurons : sensors)),
          type: useNeuronSource ? 'neuron' : 'sensor'
        },
        target: {
          id: Math.floor(Math.random() * (useActionTarget ? actions : neurons)),
          type: useActionTarget ? 'action' : 'neuron'
        }
      })
    }
  }

  /**
   * Fast comparison without string conversion
   */
  static equals(base1, base2) {
    if (base1.type !== base2.type) return false
    if (base1.data !== base2.data) return false
    
    if (base1.type === 'bias') {
      return base1.target.id === base2.target.id &&
             base1.target.type === base2.target.type
    } else {
      return base1.source.id === base2.source.id &&
             base1.source.type === base2.source.type &&
             base1.target.id === base2.target.id &&
             base1.target.type === base2.target.type
    }
  }

  /**
   * Mutate base in-place (very fast)
   */
  static mutateBinary(buffer, position, mutationRate = 0.01) {
    const baseBits = buffer.getBit(position + 4) === 0 ? 25 : 15
    
    for (let i = 0; i < baseBits; i++) {
      if (Math.random() < mutationRate) {
        // Flip bit
        const currentBit = buffer.getBit(position + i)
        buffer.setBit(position + i, currentBit ? 0 : 1)
      }
    }
  }
  
  /**
   * String-based API compatibility methods
   */
  
  static charToBin(char) {
    return parseInt(char, 32).toString(2).padStart(5, '0')
  }
  
  static targetTypes(char, typesArray = null) {
    return (typesArray || ['sensor', 'neuron', 'action'])[char] || 'neuron'
  }
  
  static getTarget(str = '', typeSize = 1, targetTypes = null) {
    // Optimize string operations - avoid split/join/split
    let binStr = ''
    for (let i = 0; i < str.length; i++) {
      binStr += this.charToBin(str[i])
    }
    
    const idLen = binStr.length - typeSize
    const idBits = binStr.substring(0, idLen)
    const typeBits = binStr.substring(idLen)

    return {
      id: parseInt(idBits, 2),
      type: this.targetTypes(parseInt(typeBits, 2), targetTypes),
    }
  }
  
  /**
   * Create base from string (compatibility)
   */
  static fromString(str = '') {
    if (!str || str.length === 0) return null
    
    let base = {
      encoded: str,
    }

    const config = this.getConfig(base.encoded[0])
    
    // Special handling for 'V' - could be attribute or corrupted bias
    if (base.encoded[0] === 'V') {
      // Check length to determine if it's attribute (4 chars) or bias (3 chars)
      if (str.length === 3 || (str.length > 3 && str.length < 4)) {
        // This is a corrupted bias (-7 that became V through mutation)
        base.type = 'bias'
        base.data = -6  // Map -7 to -6
        base.encoded = base.encoded.padEnd(3, '0')
        base.target = this.getTarget(base.encoded[1] + base.encoded[2], 2)
      } else {
        // This is an attribute
        base.type = 'attribute'
        base.data = 0
        base.encoded = base.encoded.padEnd(4, '0')
        // Parse attribute ID and value
        let binStr = ''
        for (let i = 1; i < 4; i++) {
          binStr += this.charToBin(base.encoded[i] || '0')
        }
        base.id = parseInt(binStr.substring(0, 8), 2)
        base.value = parseInt(binStr.substring(8, 15), 2)
      }
    } else {
      base.type = config.type
      base.data = config.data
      
      if (base.type === 'bias') {
        base.encoded = base.encoded.padEnd(3, '0')
        base.target = this.getTarget(base.encoded[1] + base.encoded[2], 2)
      }
      else if (base.type === 'connection') {
        base.encoded = base.encoded.padEnd(5, '0')
        base.source = this.getTarget(base.encoded[1] + base.encoded[2], 1, ['sensor', 'neuron'])
        base.target = this.getTarget(base.encoded[3] + base.encoded[4], 1, ['neuron', 'action'])
      }
    }

    delete base.config
    return base
  }
  
  /**
   * Convert base to string (compatibility)
   */
  static toString(base) {
    let str = ''

    if (base.type === 'bias') {
      // Limit -7 to -6 to avoid 'V' conflict
      const limitedData = base.data === -7 ? -6 : base.data
      // config
      str += Math.abs(limitedData).toString(2).padStart(3, '0')
      if (limitedData >= 0) str += '0'
      else str += '1'
      str += '1'

      // target
      str += base.target.id.toString(2).padStart(8, '0')

      if (base.target.type === 'sensor') str += '00'
      else if (base.target.type === 'neuron') str += '01'
      else if (base.target.type === 'action') str += '10'
      else str += '01'
    }
    else if (base.type === 'connection') {
      // config
      str += Math.abs(base.data).toString(2).padStart(4, '0')
      str += '0'

      // source
      str += base.source.id.toString(2).padStart(9, '0')

      if (base.source.type === 'sensor') str += '0'
      else if (base.source.type === 'neuron') str += '1'
      else str += '1'

      // target
      str += base.target.id.toString(2).padStart(9, '0')

      if (base.target.type === 'neuron') str += '0'
      else if (base.target.type === 'action') str += '1'
      else str += '0'
    }
    else if (base.type === 'attribute') {
      // Special pattern for attribute
      str += '11111' // All bits set for attribute type
      
      // attribute ID (8 bits)
      str += base.id.toString(2).padStart(8, '0')
      
      // attribute value (7 bits)
      str += base.value.toString(2).padStart(7, '0')
    }

    // Convert binary string to base32
    const chunks = []
    for (let i = 0; i < str.length; i += 5) {
      chunks.push(str.substring(i, i + 5))
    }
    
    return chunks
      .map(chunk => {
        const padded = chunk.padEnd(5, '0')
        return parseInt(padded, 2).toString(32)
      })
      .join('')
      .toUpperCase()
  }
  
  /**
   * Generate random base (compatibility)
   */
  static random() {
    const buffer = Base.randomBinary({
      neurons: 10,
      sensors: 10,
      actions: 10,
      attributes: 0
    })
    return Base.fromBitBuffer(buffer, 0)
  }
  
  /**
   * Generate random base with constraints (compatibility)
   */
  static randomWith(options = {}) {
    // Ensure options includes attributeIds if attributes is specified
    const enhancedOptions = { ...options }
    if (options.attributes && !options.attributeIds) {
      enhancedOptions.attributeIds = options.attributes
    }
    const buffer = Base.randomBinary(enhancedOptions)
    return Base.fromBitBuffer(buffer, 0)
  }
  
  /**
   * Get config from char (compatibility)
   */
  static getConfig(char) {
    // Take only first character if multiple provided
    const firstChar = (char || '0')[0]
    const bits = parseInt(firstChar, 32).toString(2).padStart(5, '0')
    const binValue = parseInt(bits, 2)
    
    let type, data
    
    // Check for attribute pattern (all bits set = 31 in decimal = 'V' in base32)
    if (binValue === 0b11111) {
      type = 'attribute'
      data = 0
    } else if ((binValue & 1) === 0) {
      type = 'connection'
      data = (binValue >> 1) & 0b1111
    } else {
      type = 'bias'
      const absData = (binValue >> 2) & 0b111
      const sign = (binValue >> 1) & 1
      // Note: -7 would conflict with attribute marker 'V', so we limit to -6
      data = sign ? -(absData > 6 ? 6 : absData) : absData
    }
    
    return { type, data }
  }
}
