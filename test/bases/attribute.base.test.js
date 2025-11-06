import { AttributeBase } from '../../src/bases/attribute.base.js'
import { BitBuffer } from '../../src/bitbuffer.class.js'

describe('AttributeBase', () => {
  describe('Constants', () => {
    test('should have correct bit length', () => {
      expect(AttributeBase.BIT_LENGTH).toBe(30)
    })

    test('should have target type constants', () => {
      expect(AttributeBase.TARGET_SENSOR).toBe(0b00)
      expect(AttributeBase.TARGET_NEURON).toBe(0b01)
      expect(AttributeBase.TARGET_ACTION).toBe(0b10)
      expect(AttributeBase.TARGET_GLOBAL).toBe(0b11)
    })

    test('should have predefined attribute IDs', () => {
      expect(AttributeBase.ATTR_ENERGY).toBe(0)
      expect(AttributeBase.ATTR_HEALTH).toBe(1)
      expect(AttributeBase.ATTR_HUNGER).toBe(2)
      expect(AttributeBase.ATTR_FEAR).toBe(3)
      expect(AttributeBase.ATTR_CURIOSITY).toBe(4)
      expect(AttributeBase.ATTR_AGGRESSION).toBe(5)
      expect(AttributeBase.ATTR_SOCIABILITY).toBe(6)
      expect(AttributeBase.ATTR_SPEED).toBe(7)
      expect(AttributeBase.ATTR_STRENGTH).toBe(8)
      expect(AttributeBase.ATTR_INTELLIGENCE).toBe(9)
    })
  })

  describe('Encoding/Decoding', () => {
    test('should encode and decode attribute correctly', () => {
      const original = {
        attributeId: AttributeBase.ATTR_ENERGY,
        value: 200,
        targetType: AttributeBase.TARGET_ACTION,
        targetId: 5
      }

      const buffer = AttributeBase.toBitBuffer(original)
      const decoded = AttributeBase.fromBitBuffer(buffer, 0)

      expect(decoded.type).toBe('attribute')
      expect(decoded.attributeId).toBe(original.attributeId)
      expect(decoded.value).toBe(original.value)
      expect(decoded.targetType).toBe(original.targetType)
      expect(decoded.targetId).toBe(original.targetId)
      expect(decoded.bitLength).toBe(30)
    })

    test('should handle all attribute IDs (0-255)', () => {
      for (let id = 0; id < 256; id += 17) {
        const attr = {
          attributeId: id,
          value: 128,
          targetType: AttributeBase.TARGET_NEURON,
          targetId: 0
        }

        const buffer = AttributeBase.toBitBuffer(attr)
        const decoded = AttributeBase.fromBitBuffer(buffer, 0)

        expect(decoded.attributeId).toBe(id)
      }
    })

    test('should handle all values (0-255)', () => {
      for (let value = 0; value < 256; value += 17) {
        const attr = {
          attributeId: AttributeBase.ATTR_ENERGY,
          value,
          targetType: AttributeBase.TARGET_ACTION,
          targetId: 0
        }

        const buffer = AttributeBase.toBitBuffer(attr)
        const decoded = AttributeBase.fromBitBuffer(buffer, 0)

        expect(decoded.value).toBe(value)
      }
    })

    test('should handle all target types', () => {
      const targetTypes = [
        AttributeBase.TARGET_SENSOR,
        AttributeBase.TARGET_NEURON,
        AttributeBase.TARGET_ACTION,
        AttributeBase.TARGET_GLOBAL
      ]

      for (const targetType of targetTypes) {
        const attr = {
          attributeId: AttributeBase.ATTR_ENERGY,
          value: 100,
          targetType,
          targetId: 42
        }

        const buffer = AttributeBase.toBitBuffer(attr)
        const decoded = AttributeBase.fromBitBuffer(buffer, 0)

        expect(decoded.targetType).toBe(targetType)
      }
    })

    test('should handle all target IDs (0-511)', () => {
      const testIds = [0, 1, 100, 255, 500, 511]

      for (const targetId of testIds) {
        const attr = {
          attributeId: AttributeBase.ATTR_ENERGY,
          value: 100,
          targetType: AttributeBase.TARGET_NEURON,
          targetId
        }

        const buffer = AttributeBase.toBitBuffer(attr)
        const decoded = AttributeBase.fromBitBuffer(buffer, 0)

        expect(decoded.targetId).toBe(targetId)
      }
    })

    test('should reject invalid type ID', () => {
      const buffer = new BitBuffer(30)
      // Write invalid type (not 111)
      buffer.writeBits(0b101, 3)
      buffer.writeBits(0, 8)
      buffer.writeBits(0, 8)
      buffer.writeBits(0, 2)
      buffer.writeBits(0, 9)

      const decoded = AttributeBase.fromBitBuffer(buffer, 0)
      expect(decoded).toBeNull()
    })

    test('should handle buffer too small', () => {
      const buffer = new BitBuffer(20)  // Too small
      const decoded = AttributeBase.fromBitBuffer(buffer, 0)
      expect(decoded).toBeNull()
    })
  })

  describe('Value Conversion', () => {
    test('should convert value to float correctly', () => {
      expect(AttributeBase.valueToFloat(0)).toBe(0)
      expect(AttributeBase.valueToFloat(128)).toBeCloseTo(0.502, 2)
      expect(AttributeBase.valueToFloat(255)).toBe(1)
    })

    test('should convert float to value correctly', () => {
      expect(AttributeBase.floatToValue(0)).toBe(0)
      expect(AttributeBase.floatToValue(0.5)).toBe(128)
      expect(AttributeBase.floatToValue(1)).toBe(255)
    })

    test('should clamp out-of-range floats', () => {
      expect(AttributeBase.floatToValue(-0.5)).toBe(0)
      expect(AttributeBase.floatToValue(1.5)).toBe(255)
    })

    test('should round floats correctly', () => {
      expect(AttributeBase.floatToValue(0.25)).toBe(64)
      expect(AttributeBase.floatToValue(0.75)).toBe(191)
    })
  })

  describe('Action Influence', () => {
    test('multiply mode should work correctly', () => {
      const attr = { value: 128 }  // 0.5x multiplier

      expect(AttributeBase.applyActionInfluence(attr, 1.0, 'multiply')).toBeCloseTo(0.5, 2)
      expect(AttributeBase.applyActionInfluence(attr, 0.8, 'multiply')).toBeCloseTo(0.4, 2)
      expect(AttributeBase.applyActionInfluence(attr, 0.0, 'multiply')).toBe(0)
    })

    test('multiply mode with zero value should suppress action', () => {
      const attr = { value: 0 }  // 0x multiplier

      expect(AttributeBase.applyActionInfluence(attr, 1.0, 'multiply')).toBe(0)
      expect(AttributeBase.applyActionInfluence(attr, 0.5, 'multiply')).toBe(0)
    })

    test('multiply mode with max value should preserve action', () => {
      const attr = { value: 255 }  // 1.0x multiplier

      expect(AttributeBase.applyActionInfluence(attr, 0.5, 'multiply')).toBeCloseTo(0.5, 2)
      expect(AttributeBase.applyActionInfluence(attr, 1.0, 'multiply')).toBeCloseTo(1.0, 2)
    })

    test('add mode should work correctly', () => {
      const attr = { value: 128 }  // +0.0 (neutral)

      expect(AttributeBase.applyActionInfluence(attr, 0.5, 'add')).toBeCloseTo(0.5, 2)
    })

    test('add mode with high value should boost', () => {
      const attr = { value: 255 }  // +0.5

      expect(AttributeBase.applyActionInfluence(attr, 0.3, 'add')).toBeCloseTo(0.8, 2)
    })

    test('add mode with low value should reduce', () => {
      const attr = { value: 0 }  // -0.5

      const result = AttributeBase.applyActionInfluence(attr, 0.3, 'add')
      expect(result).toBeCloseTo(-0.2, 2)
    })

    test('add mode should clamp to [-1, 1]', () => {
      const attrHigh = { value: 255 }
      const attrLow = { value: 0 }

      expect(AttributeBase.applyActionInfluence(attrHigh, 1.0, 'add')).toBe(1)
      expect(AttributeBase.applyActionInfluence(attrLow, -1.0, 'add')).toBe(-1)
    })

    test('threshold mode should work correctly', () => {
      const attrHigh = { value: 200 }  // Above threshold
      const attrLow = { value: 100 }   // Below threshold

      expect(AttributeBase.applyActionInfluence(attrHigh, 0.8, 'threshold')).toBeCloseTo(0.8, 2)
      expect(AttributeBase.applyActionInfluence(attrLow, 0.8, 'threshold')).toBe(0)
    })

    test('threshold mode at boundary', () => {
      const attrBoundary = { value: 128 }  // Exactly 0.5

      // Should block (threshold > 0.5)
      expect(AttributeBase.applyActionInfluence(attrBoundary, 0.8, 'threshold')).toBe(0)
    })

    test('boost mode should work correctly', () => {
      const attr = { value: 128 }  // 1.0x boost (neutral)

      expect(AttributeBase.applyActionInfluence(attr, 0.5, 'boost')).toBeCloseTo(0.5, 2)
    })

    test('boost mode with high value should amplify', () => {
      const attr = { value: 255 }  // 2.0x boost

      expect(AttributeBase.applyActionInfluence(attr, 0.5, 'boost')).toBeCloseTo(1.0, 2)
    })

    test('boost mode with low value should suppress', () => {
      const attr = { value: 0 }  // 0.0x boost

      expect(AttributeBase.applyActionInfluence(attr, 0.5, 'boost')).toBe(0)
    })

    test('sigmoid mode should work correctly', () => {
      const attrHigh = { value: 255 }   // +1 shift (easier to activate)
      const attrLow = { value: 0 }      // -1 shift (harder to activate)
      const attrMid = { value: 128 }    // 0 shift (no change)

      const input = 0.5

      const resultHigh = AttributeBase.applyActionInfluence(attrHigh, input, 'sigmoid')
      const resultLow = AttributeBase.applyActionInfluence(attrLow, input, 'sigmoid')
      const resultMid = AttributeBase.applyActionInfluence(attrMid, input, 'sigmoid')

      expect(resultHigh).toBeGreaterThan(resultMid)
      expect(resultLow).toBeLessThan(resultMid)
    })

    test('unknown mode should return original value', () => {
      const attr = { value: 100 }

      expect(AttributeBase.applyActionInfluence(attr, 0.5, 'unknown')).toBe(0.5)
    })
  })

  describe('Sensor Influence', () => {
    test('should scale sensor input correctly', () => {
      const attr = { value: 128 }  // 0.5x multiplier

      expect(AttributeBase.applySensorInfluence(attr, 1.0)).toBeCloseTo(0.5, 2)
      expect(AttributeBase.applySensorInfluence(attr, 0.8)).toBeCloseTo(0.4, 2)
    })

    test('should suppress sensor with zero value', () => {
      const attr = { value: 0 }

      expect(AttributeBase.applySensorInfluence(attr, 1.0)).toBe(0)
    })

    test('should preserve sensor with max value', () => {
      const attr = { value: 255 }

      expect(AttributeBase.applySensorInfluence(attr, 0.5)).toBeCloseTo(0.5, 2)
    })
  })

  describe('Neuron Influence', () => {
    test('should add bias to neuron correctly', () => {
      const attr = { value: 128 }  // Neutral (0 bias)

      expect(AttributeBase.applyNeuronInfluence(attr, 0.5)).toBeCloseTo(0.5, 2)
    })

    test('should boost neuron with high value', () => {
      const attr = { value: 255 }  // +0.25 bias

      expect(AttributeBase.applyNeuronInfluence(attr, 0.5)).toBeCloseTo(0.75, 2)
    })

    test('should reduce neuron with low value', () => {
      const attr = { value: 0 }  // -0.25 bias

      expect(AttributeBase.applyNeuronInfluence(attr, 0.5)).toBeCloseTo(0.25, 2)
    })

    test('should clamp neuron value to [-1, 1]', () => {
      const attrHigh = { value: 255 }
      const attrLow = { value: 0 }

      expect(AttributeBase.applyNeuronInfluence(attrHigh, 1.0)).toBe(1)
      expect(AttributeBase.applyNeuronInfluence(attrLow, -1.0)).toBe(-1)
    })
  })

  describe('Target Checking', () => {
    test('should detect specific sensor target', () => {
      const attr = {
        attributeId: AttributeBase.ATTR_ENERGY,
        targetType: AttributeBase.TARGET_SENSOR,
        targetId: 5
      }

      expect(AttributeBase.affectsTarget(attr, 'sensor', 5)).toBe(true)
      expect(AttributeBase.affectsTarget(attr, 'sensor', 6)).toBe(false)
      expect(AttributeBase.affectsTarget(attr, 'neuron', 5)).toBe(false)
    })

    test('should detect specific neuron target', () => {
      const attr = {
        attributeId: AttributeBase.ATTR_ENERGY,
        targetType: AttributeBase.TARGET_NEURON,
        targetId: 10
      }

      expect(AttributeBase.affectsTarget(attr, 'neuron', 10)).toBe(true)
      expect(AttributeBase.affectsTarget(attr, 'neuron', 11)).toBe(false)
    })

    test('should detect specific action target', () => {
      const attr = {
        attributeId: AttributeBase.ATTR_ENERGY,
        targetType: AttributeBase.TARGET_ACTION,
        targetId: 3
      }

      expect(AttributeBase.affectsTarget(attr, 'action', 3)).toBe(true)
      expect(AttributeBase.affectsTarget(attr, 'action', 4)).toBe(false)
    })

    test('should detect global target (affects all)', () => {
      const attr = {
        attributeId: AttributeBase.ATTR_ENERGY,
        targetType: AttributeBase.TARGET_GLOBAL,
        targetId: 0
      }

      expect(AttributeBase.affectsTarget(attr, 'sensor', 0)).toBe(true)
      expect(AttributeBase.affectsTarget(attr, 'neuron', 5)).toBe(true)
      expect(AttributeBase.affectsTarget(attr, 'action', 10)).toBe(true)
    })
  })

  describe('Random Generation', () => {
    test('should generate random attribute', () => {
      const buffer = AttributeBase.randomBinary()
      const attr = AttributeBase.fromBitBuffer(buffer, 0)

      expect(attr).not.toBeNull()
      expect(attr.type).toBe('attribute')
      expect(attr.attributeId).toBeGreaterThanOrEqual(0)
      expect(attr.attributeId).toBeLessThan(256)
      expect(attr.value).toBeGreaterThanOrEqual(0)
      expect(attr.value).toBeLessThan(256)
      expect(attr.targetType).toBeGreaterThanOrEqual(0)
      expect(attr.targetType).toBeLessThan(4)
    })

    test('should respect max sensor/neuron/action counts', () => {
      const options = {
        maxAttributes: 10,
        sensors: 50,
        neurons: 100,
        actions: 20
      }

      for (let i = 0; i < 100; i++) {
        const buffer = AttributeBase.randomBinary(options)
        const attr = AttributeBase.fromBitBuffer(buffer, 0)

        expect(attr.attributeId).toBeLessThan(options.maxAttributes)

        if (attr.targetType === AttributeBase.TARGET_SENSOR) {
          expect(attr.targetId).toBeLessThan(options.sensors)
        } else if (attr.targetType === AttributeBase.TARGET_NEURON) {
          expect(attr.targetId).toBeLessThan(options.neurons)
        } else if (attr.targetType === AttributeBase.TARGET_ACTION) {
          expect(attr.targetId).toBeLessThan(options.actions)
        }
      }
    })
  })

  describe('Mutation', () => {
    test('should mutate attribute bits', () => {
      const original = {
        attributeId: AttributeBase.ATTR_ENERGY,
        value: 128,
        targetType: AttributeBase.TARGET_ACTION,
        targetId: 5
      }

      const buffer = AttributeBase.toBitBuffer(original)
      const originalBuffer = buffer.clone()

      // High mutation rate to ensure changes
      AttributeBase.mutateBinary(buffer, 0, 1.0)

      // Should have changed
      const mutated = AttributeBase.fromBitBuffer(buffer, 0)
      const unchanged = AttributeBase.fromBitBuffer(originalBuffer, 0)

      const changed = mutated.attributeId !== unchanged.attributeId ||
                     mutated.value !== unchanged.value ||
                     mutated.targetType !== unchanged.targetType ||
                     mutated.targetId !== unchanged.targetId

      expect(changed).toBe(true)
    })

    test('should not mutate with zero mutation rate', () => {
      const original = {
        attributeId: AttributeBase.ATTR_ENERGY,
        value: 128,
        targetType: AttributeBase.TARGET_ACTION,
        targetId: 5
      }

      const buffer = AttributeBase.toBitBuffer(original)
      const before = AttributeBase.fromBitBuffer(buffer, 0)

      AttributeBase.mutateBinary(buffer, 0, 0.0)

      const after = AttributeBase.fromBitBuffer(buffer, 0)

      expect(AttributeBase.equals(before, after)).toBe(true)
    })
  })

  describe('Equality', () => {
    test('should detect equal attributes', () => {
      const attr1 = {
        type: 'attribute',
        attributeId: AttributeBase.ATTR_ENERGY,
        value: 200,
        targetType: AttributeBase.TARGET_ACTION,
        targetId: 5
      }

      const attr2 = { ...attr1 }

      expect(AttributeBase.equals(attr1, attr2)).toBe(true)
    })

    test('should detect different attribute IDs', () => {
      const attr1 = {
        type: 'attribute',
        attributeId: AttributeBase.ATTR_ENERGY,
        value: 200,
        targetType: AttributeBase.TARGET_ACTION,
        targetId: 5
      }

      const attr2 = { ...attr1, attributeId: AttributeBase.ATTR_HUNGER }

      expect(AttributeBase.equals(attr1, attr2)).toBe(false)
    })

    test('should detect different values', () => {
      const attr1 = {
        type: 'attribute',
        attributeId: AttributeBase.ATTR_ENERGY,
        value: 200,
        targetType: AttributeBase.TARGET_ACTION,
        targetId: 5
      }

      const attr2 = { ...attr1, value: 100 }

      expect(AttributeBase.equals(attr1, attr2)).toBe(false)
    })

    test('should detect invalid types', () => {
      const attr1 = {
        type: 'attribute',
        attributeId: AttributeBase.ATTR_ENERGY,
        value: 200,
        targetType: AttributeBase.TARGET_ACTION,
        targetId: 5
      }

      const attr2 = { ...attr1, type: 'connection' }

      expect(AttributeBase.equals(attr1, attr2)).toBe(false)
    })
  })

  describe('Utilities', () => {
    test('should get target type name', () => {
      expect(AttributeBase.getTargetTypeName(0b00)).toBe('sensor')
      expect(AttributeBase.getTargetTypeName(0b01)).toBe('neuron')
      expect(AttributeBase.getTargetTypeName(0b10)).toBe('action')
      expect(AttributeBase.getTargetTypeName(0b11)).toBe('global')
      expect(AttributeBase.getTargetTypeName(99)).toBe('unknown')
    })

    test('should get attribute name', () => {
      expect(AttributeBase.getAttributeName(0)).toBe('energy')
      expect(AttributeBase.getAttributeName(1)).toBe('health')
      expect(AttributeBase.getAttributeName(2)).toBe('hunger')
      expect(AttributeBase.getAttributeName(99)).toBe('custom-99')
    })

    test('should get description', () => {
      const attr = {
        attributeId: AttributeBase.ATTR_ENERGY,
        value: 200,
        targetType: AttributeBase.TARGET_ACTION,
        targetId: 5
      }

      const desc = AttributeBase.getDescription(attr)

      expect(desc).toContain('energy')
      expect(desc).toContain('200')
      expect(desc).toContain('action')
      expect(desc).toContain('5')
    })

    test('should get description for global target', () => {
      const attr = {
        attributeId: AttributeBase.ATTR_FEAR,
        value: 150,
        targetType: AttributeBase.TARGET_GLOBAL,
        targetId: 0
      }

      const desc = AttributeBase.getDescription(attr)

      expect(desc).toContain('fear')
      expect(desc).toContain('global')
      expect(desc).toContain('all')
    })
  })
})
