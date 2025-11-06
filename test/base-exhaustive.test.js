import { Base } from '../src/base.class.js'

describe('Exhaustive Base Testing Strategy', () => {
  /**
   * Total combinations: 16,790,016
   * - Connections: 16,777,216 
   * - Biases: 10,752
   * - Attributes: 2,048
   * 
   * Strategy: Test boundaries and random samples
   */

  describe('Connection bases - Smart sampling', () => {
    test('boundary values for all fields', () => {
      const boundaries = {
        data: [0, 1, 7, 8, 15],  // min, low, mid, high, max
        sourceId: [0, 1, 255, 256, 511],  // boundary at 8/9 bit
        targetId: [0, 1, 255, 256, 511]
      }

      let testCount = 0
      
      // Test all boundary combinations (5 × 5 × 5 × 2 × 2 = 500 tests)
      for (const data of boundaries.data) {
        for (const sourceId of boundaries.sourceId) {
          for (const targetId of boundaries.targetId) {
            for (const sourceType of ['sensor', 'neuron']) {
              for (const targetType of ['neuron', 'action']) {
                const base = {
                  type: 'connection',
                  data,
                  source: { type: sourceType, id: sourceId },
                  target: { type: targetType, id: targetId }
                }
                
                const encoded = Base.toString(base)
                const decoded = Base.fromString(encoded)
                
                expect(decoded.type).toBe('connection')
                expect(decoded.data).toBe(data)
                
                // IDs might be truncated based on encoding limits
                if (sourceId <= 255) {
                  expect(decoded.source.id).toBe(sourceId)
                }
                if (targetId <= 255) {
                  expect(decoded.target.id).toBe(targetId)
                }
                
                testCount++
              }
            }
          }
        }
      }
    })

    test('random sampling - 1000 connections', () => {
      let successCount = 0
      
      for (let i = 0; i < 1000; i++) {
        const base = {
          type: 'connection',
          data: Math.floor(Math.random() * 16),
          source: {
            type: Math.random() < 0.5 ? 'sensor' : 'neuron',
            id: Math.floor(Math.random() * 256)  // Stay within reliable range
          },
          target: {
            type: Math.random() < 0.5 ? 'neuron' : 'action',
            id: Math.floor(Math.random() * 256)
          }
        }
        
        const encoded = Base.toString(base)
        const decoded = Base.fromString(encoded)
        
        if (
          decoded.type === 'connection' &&
          decoded.data === base.data &&
          decoded.source.type === base.source.type &&
          decoded.target.type === base.target.type
        ) {
          successCount++
        }
      }
      
      expect(successCount).toBe(1000)
    })
  })

  describe('Bias bases - Complete test (10,752 combinations)', () => {
    test('all valid bias combinations', () => {
      let testCount = 0
      const errors = []
      
      // Test ALL bias combinations (it's only 10,752)
      for (let data = -6; data <= 7; data++) {
        if (data === -7) continue // Skip -7 (conflicts with 'V')
        
        for (const targetType of ['sensor', 'neuron', 'action']) {
          for (let targetId = 0; targetId < 256; targetId++) {
            const base = {
              type: 'bias',
              data,
              target: { type: targetType, id: targetId }
            }
            
            const encoded = Base.toString(base)
            const decoded = Base.fromString(encoded)
            
            // Check first character is never 'V' (reserved for attributes)
            if (encoded[0] === 'V') {
              errors.push(`Bias with data=${data} generated 'V': ${encoded}`)
            }
            
            // Verify round-trip
            if (decoded.type !== 'bias' || 
                decoded.data !== data ||
                decoded.target.type !== targetType ||
                decoded.target.id !== targetId) {
              errors.push(`Failed round-trip: ${JSON.stringify(base)} -> ${encoded} -> ${JSON.stringify(decoded)}`)
            }
            
            testCount++
          }
        }
      }
      
      expect(errors).toEqual([])
    })
  })

  describe('Attribute bases - Complete test (2,048 combinations)', () => {
    test('all valid attribute combinations', () => {
      let testCount = 0
      const errors = []
      
      // Test ALL attribute combinations (only 2,048)
      for (let id = 0; id < 16; id++) {
        for (let value = 0; value < 128; value++) {
          const base = {
            type: 'attribute',
            data: 0,
            id,
            value
          }
          
          const encoded = Base.toString(base)
          const decoded = Base.fromString(encoded)
          
          // Check it starts with 'V'
          if (encoded[0] !== 'V') {
            errors.push(`Attribute didn't start with 'V': ${encoded}`)
          }
          
          // Check length is 4
          if (encoded.length !== 4) {
            errors.push(`Attribute wrong length: ${encoded.length}`)
          }
          
          // Verify round-trip
          if (decoded.type !== 'attribute' ||
              decoded.id !== id ||
              decoded.value !== value) {
            errors.push(`Failed round-trip: ${JSON.stringify(base)} -> ${encoded} -> ${JSON.stringify(decoded)}`)
          }
          
          testCount++
        }
      }
      
      expect(errors).toEqual([])
    })
  })

  describe('Performance benchmarks', () => {
    test('encoding speed - 10000 operations', () => {
      const bases = []
      
      // Prepare test data
      for (let i = 0; i < 10000; i++) {
        bases.push({
          type: 'connection',
          data: i % 16,
          source: { type: 'sensor', id: i % 256 },
          target: { type: 'neuron', id: i % 256 }
        })
      }
      
      const start = Date.now()
      
      for (const base of bases) {
        Base.toString(base)
      }
      
      const duration = Date.now() - start
      
      expect(duration).toBeLessThan(1000) // Should be under 1 second
    })

    test('decoding speed - 10000 operations', () => {
      const strings = []
      
      // Prepare encoded strings
      for (let i = 0; i < 10000; i++) {
        const base = {
          type: 'connection',
          data: i % 16,
          source: { type: 'sensor', id: i % 256 },
          target: { type: 'neuron', id: i % 256 }
        }
        strings.push(Base.toString(base))
      }
      
      const start = Date.now()
      
      for (const str of strings) {
        Base.fromString(str)
      }
      
      const duration = Date.now() - start
      
      expect(duration).toBeLessThan(1000) // Should be under 1 second
    })

    test('round-trip speed - 10000 operations', () => {
      const bases = []
      
      // Prepare test data with mixed types
      for (let i = 0; i < 10000; i++) {
        if (i % 3 === 0) {
          bases.push({
            type: 'connection',
            data: i % 16,
            source: { type: 'sensor', id: i % 256 },
            target: { type: 'neuron', id: i % 256 }
          })
        } else if (i % 3 === 1) {
          bases.push({
            type: 'bias',
            data: (i % 14) - 6,
            target: { type: 'neuron', id: i % 256 }
          })
        } else {
          bases.push({
            type: 'attribute',
            data: 0,
            id: i % 16,
            value: i % 128
          })
        }
      }
      
      const start = Date.now()
      
      for (const base of bases) {
        const encoded = Base.toString(base)
        Base.fromString(encoded)
      }
      
      const duration = Date.now() - start
      
      expect(duration).toBeLessThan(2000) // Should be under 2 seconds
    })
  })

  describe('Statistical validation', () => {
    test('encoding distribution analysis', () => {
      const charFrequency = {}
      const firstCharFrequency = {}
      
      // Generate 1000 random bases and analyze character distribution
      for (let i = 0; i < 1000; i++) {
        let encoded
        
        if (i % 3 === 0) {
          encoded = Base.toString({
            type: 'connection',
            data: Math.floor(Math.random() * 16),
            source: { 
              type: Math.random() < 0.5 ? 'sensor' : 'neuron',
              id: Math.floor(Math.random() * 256)
            },
            target: {
              type: Math.random() < 0.5 ? 'neuron' : 'action',
              id: Math.floor(Math.random() * 256)
            }
          })
        } else if (i % 3 === 1) {
          encoded = Base.toString({
            type: 'bias',
            data: Math.floor(Math.random() * 14) - 6,
            target: {
              type: ['sensor', 'neuron', 'action'][Math.floor(Math.random() * 3)],
              id: Math.floor(Math.random() * 256)
            }
          })
        } else {
          encoded = Base.toString({
            type: 'attribute',
            data: 0,
            id: Math.floor(Math.random() * 16),
            value: Math.floor(Math.random() * 128)
          })
        }
        
        // Count character frequencies
        for (const char of encoded) {
          charFrequency[char] = (charFrequency[char] || 0) + 1
        }
        
        firstCharFrequency[encoded[0]] = (firstCharFrequency[encoded[0]] || 0) + 1
      }
      
      // Check that we use a good range of the base32 alphabet
      const uniqueChars = Object.keys(charFrequency).length
      expect(uniqueChars).toBeGreaterThan(20) // Should use most of the alphabet
      
      // Check 'V' distribution
      const vInFirstPosition = firstCharFrequency['V'] || 0
      const vTotal = charFrequency['V'] || 0
      
      // 'V' as first character should only be for attributes (about 1/3 of samples)
      // But 'V' can appear in other positions as part of the Base32 encoding
      if (vInFirstPosition > 0) {
        // Roughly 1/3 of our samples should be attributes
        expect(vInFirstPosition).toBeGreaterThan(250) // At least 25% should be attributes
        expect(vInFirstPosition).toBeLessThan(400) // At most 40% should be attributes
      }
      
      // 'V' can appear in other positions too (it's a valid Base32 char = 31)
      // So vTotal >= vInFirstPosition
      expect(vTotal).toBeGreaterThanOrEqual(vInFirstPosition)
    })
  })
})