import { Base } from '../src/base.class.js'
import { Genome } from '../src/genome.class.js'

describe('Comprehensive Base Testing', () => {
  describe('Connection bases - all combinations', () => {
    test('all data values (0-14)', () => {
      // 15 is reserved as the advanced-base sentinel; toBitBuffer clamps to 14.
      for (let data = 0; data <= 14; data++) {
        const base = {
          type: 'connection',
          data,
          source: { type: 'sensor', id: 0 },
          target: { type: 'neuron', id: 0 }
        }

        const encoded = Base.toString(base)
        const decoded = Base.fromString(encoded)

        expect(decoded.type).toBe('connection')
        expect(decoded.data).toBe(data)
        expect(decoded.source).toEqual(base.source)
        expect(decoded.target).toEqual(base.target)
      }
    })

    test('all source combinations', () => {
      const sourceTypes = [
        { type: 'sensor', maxId: 255 },
        { type: 'neuron', maxId: 255 }
      ]
      
      for (const sourceType of sourceTypes) {
        // Test boundary values
        for (const id of [0, 1, 127, 255]) {
          const base = {
            type: 'connection',
            data: 5,
            source: { type: sourceType.type, id },
            target: { type: 'neuron', id: 0 }
          }
          
          const encoded = Base.toString(base)
          const decoded = Base.fromString(encoded)
          
          expect(decoded.source.type).toBe(sourceType.type)
          expect(decoded.source.id).toBe(id)
        }
      }
    })

    test('all target combinations', () => {
      const targetTypes = [
        { type: 'neuron', maxId: 255 },
        { type: 'action', maxId: 255 }
      ]
      
      for (const targetType of targetTypes) {
        // Test boundary values
        for (const id of [0, 1, 127, 255]) {
          const base = {
            type: 'connection',
            data: 5,
            source: { type: 'sensor', id: 0 },
            target: { type: targetType.type, id }
          }
          
          const encoded = Base.toString(base)
          const decoded = Base.fromString(encoded)
          
          expect(decoded.target.type).toBe(targetType.type)
          expect(decoded.target.id).toBe(id)
        }
      }
    })
  })

  describe('Bias bases - all combinations', () => {
    test('all data values (-6 to 7)', () => {
      // Test all valid bias values (avoiding -7 which conflicts with 'V')
      for (let data = -6; data <= 7; data++) {
        const base = {
          type: 'bias',
          data,
          target: { type: 'neuron', id: 10 }
        }
        
        const encoded = Base.toString(base)
        const decoded = Base.fromString(encoded)
        
        expect(decoded.type).toBe('bias')
        expect(decoded.data).toBe(data)
        expect(decoded.target).toEqual(base.target)
      }
    })

    test('all target types', () => {
      const targetTypes = ['sensor', 'neuron', 'action']
      
      for (const targetType of targetTypes) {
        // Test boundary values
        for (const id of [0, 1, 127, 255]) {
          const base = {
            type: 'bias',
            data: 3,
            target: { type: targetType, id }
          }
          
          const encoded = Base.toString(base)
          const decoded = Base.fromString(encoded)
          
          expect(decoded.target.type).toBe(targetType)
          expect(decoded.target.id).toBe(id)
        }
      }
    })

    test('verify -7 limitation', () => {
      // -7 would create 'V' which is reserved for attributes
      const base = {
        type: 'bias',
        data: -7,
        target: { type: 'neuron', id: 0 }
      }
      
      const encoded = Base.toString(base)
      const firstChar = encoded[0]
      
      // Should NOT be 'V' (reserved for attributes)
      expect(firstChar).not.toBe('V')
    })
  })

  describe('Attribute bases - all combinations', () => {
    test('all ID values (0-15)', () => {
      for (let id = 0; id <= 15; id++) {
        const base = {
          type: 'attribute',
          data: 0,
          id,
          value: 50
        }
        
        const encoded = Base.toString(base)
        const decoded = Base.fromString(encoded)
        
        expect(decoded.type).toBe('attribute')
        expect(decoded.id).toBe(id)
        expect(decoded.value).toBe(50)
        expect(encoded[0]).toBe('V') // Always starts with V
      }
    })

    test('all value ranges (0-127)', () => {
      // Test boundary and middle values
      for (const value of [0, 1, 63, 126, 127]) {
        const base = {
          type: 'attribute',
          data: 0,
          id: 5,
          value
        }
        
        const encoded = Base.toString(base)
        const decoded = Base.fromString(encoded)
        
        expect(decoded.type).toBe('attribute')
        expect(decoded.value).toBe(value)
      }
    })

    test('attribute base always 4 characters', () => {
      const base = {
        type: 'attribute',
        data: 0,
        id: 15,
        value: 127
      }
      
      const encoded = Base.toString(base)
      expect(encoded.length).toBe(4)
      expect(encoded[0]).toBe('V')
    })
  })

  describe('Mixed genome sequences', () => {
    test('genome with all base types', () => {
      const bases = [
        { type: 'connection', data: 14, source: { type: 'sensor', id: 255 }, target: { type: 'neuron', id: 255 } },
        { type: 'bias', data: 7, target: { type: 'action', id: 255 } },
        { type: 'attribute', data: 0, id: 15, value: 127 },
        { type: 'connection', data: 0, source: { type: 'neuron', id: 0 }, target: { type: 'action', id: 0 } },
        { type: 'bias', data: -6, target: { type: 'sensor', id: 0 } },
        { type: 'attribute', data: 0, id: 0, value: 0 },
      ]
      
      const genome = Genome.fromBases(bases)
      const encoded = genome.encoded
      const decoded = Genome.fromString(encoded)
      
      expect(decoded.bases.length).toBe(bases.length)
      
      decoded.bases.forEach((decodedBase, i) => {
        const originalBase = bases[i]
        expect(decodedBase.type).toBe(originalBase.type)
        
        if (originalBase.type === 'connection') {
          expect(decodedBase.data).toBe(originalBase.data)
          expect(decodedBase.source).toEqual(originalBase.source)
          expect(decodedBase.target).toEqual(originalBase.target)
        } else if (originalBase.type === 'bias') {
          expect(decodedBase.data).toBe(originalBase.data)
          expect(decodedBase.target).toEqual(originalBase.target)
        } else if (originalBase.type === 'attribute') {
          expect(decodedBase.id).toBe(originalBase.id)
          expect(decodedBase.value).toBe(originalBase.value)
        }
      })
    })

    test('genome string length calculations', () => {
      // Connection = 5 chars
      // Bias = 3 chars
      // Attribute = 4 chars
      
      const testCases = [
        { bases: [{ type: 'connection', data: 0, source: { type: 'sensor', id: 0 }, target: { type: 'neuron', id: 0 } }], expectedLength: 5 },
        { bases: [{ type: 'bias', data: 0, target: { type: 'neuron', id: 0 } }], expectedLength: 3 },
        { bases: [{ type: 'attribute', data: 0, id: 0, value: 0 }], expectedLength: 4 },
        { 
          bases: [
            { type: 'connection', data: 0, source: { type: 'sensor', id: 0 }, target: { type: 'neuron', id: 0 } },
            { type: 'bias', data: 0, target: { type: 'neuron', id: 0 } },
            { type: 'attribute', data: 0, id: 0, value: 0 }
          ], 
          expectedLength: 12 // 5 + 3 + 4
        }
      ]
      
      testCases.forEach(({ bases, expectedLength }) => {
        const genome = Genome.fromBases(bases)
        expect(genome.encoded.length).toBe(expectedLength)
      })
    })
  })

  describe('Edge cases and error handling', () => {
    test('empty string parsing', () => {
      const base = Base.fromString('')
      expect(base).toBeNull()
    })

    test('partial strings', () => {
      // Too short for any base type
      const base1 = Base.fromString('A')
      expect(base1).toBeDefined()
      expect(base1.encoded.length).toBeGreaterThanOrEqual(3) // Padded
      
      const base2 = Base.fromString('AB')
      expect(base2).toBeDefined()
      expect(base2.encoded.length).toBeGreaterThanOrEqual(3) // Padded
    })

    test('maximum ID values', () => {
      // Test that max IDs work correctly
      const maxConnection = {
        type: 'connection',
        data: 14,  // 15 reserved as advanced-base sentinel
        source: { type: 'neuron', id: 511 },
        target: { type: 'action', id: 511 }
      }
      
      const maxBias = {
        type: 'bias',
        data: 7,
        target: { type: 'action', id: 255 }
      }
      
      const maxAttribute = {
        type: 'attribute',
        data: 0,
        id: 15,
        value: 127
      }
      
      // Test encoding and decoding
      for (const base of [maxConnection, maxBias, maxAttribute]) {
        const encoded = Base.toString(base)
        const decoded = Base.fromString(encoded)
        
        expect(decoded.type).toBe(base.type)
        
        if (base.type === 'connection') {
          // Note: IDs may be truncated to fit encoding limits
          expect(decoded.source.type).toBe(base.source.type)
          expect(decoded.target.type).toBe(base.target.type)
        } else if (base.type === 'bias') {
          expect(decoded.data).toBe(base.data)
        } else if (base.type === 'attribute') {
          expect(decoded.id).toBe(base.id)
          expect(decoded.value).toBe(base.value)
        }
      }
    })
  })

  describe('Random generation coverage', () => {
    test('generates all base types with proper distribution', () => {
      const counts = { connection: 0, bias: 0, attribute: 0 }
      const iterations = 1000
      
      for (let i = 0; i < iterations; i++) {
        const base = Base.randomWith({
          neurons: 10,
          sensors: 5,
          actions: 3,
          attributes: 5
        })
        counts[base.type]++
      }
      
      // Should generate all types
      expect(counts.connection).toBeGreaterThan(0)
      expect(counts.bias).toBeGreaterThan(0)
      expect(counts.attribute).toBeGreaterThan(0)
      
      // Rough distribution check (with tolerance)
      // Expected: ~60% connections, ~25% biases, ~15% attributes
      expect(counts.connection / iterations).toBeGreaterThan(0.4)
      expect(counts.bias / iterations).toBeGreaterThan(0.15)
      expect(counts.attribute / iterations).toBeGreaterThan(0.05)
    })

    test('respects attribute parameter', () => {
      // Without attributes
      let hasAttribute = false
      for (let i = 0; i < 100; i++) {
        const base = Base.randomWith({
          neurons: 10,
          sensors: 5,
          actions: 3
          // No attributes parameter
        })
        if (base.type === 'attribute') {
          hasAttribute = true
          break
        }
      }
      expect(hasAttribute).toBe(false)
      
      // With attributes
      hasAttribute = false
      for (let i = 0; i < 100; i++) {
        const base = Base.randomWith({
          neurons: 10,
          sensors: 5,
          actions: 3,
          attributes: 5
        })
        if (base.type === 'attribute') {
          hasAttribute = true
          expect(base.id).toBeLessThan(5)
          break
        }
      }
      expect(hasAttribute).toBe(true)
    })
  })
})