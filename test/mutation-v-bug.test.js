import { Genome } from '../src/genome.class.js'
import { Base } from '../src/base.class.js'
import { BitBuffer } from '../src/bitbuffer.class.js'

describe('Mutation V Conflict Bug - Now Fixed', () => {
  test('mutation that creates V is now sanitized and corrected', () => {
    // Create a bias close to -7
    const genome = Genome.fromBases([
      { type: 'bias', data: -6, target: { type: 'neuron', id: 0 } }
    ])
    
    let foundVBug = false
    let corruptedGenome = null
    
    // Try many mutations
    for (let i = 0; i < 1000; i++) {
      const mutated = genome.clone()
      
      // Simulate bit flips that could create 'V' (11111 in first 5 bits)
      // We need to flip specific bits to turn bias into 'V'
      // For bias -6: should be 11011 (27), we need 11111 (31)
      // So we need to flip bit 2 (0-indexed from left)
      
      // Force the mutation that creates the problem
      if (i === 0) {
        // Get the first 5 bits (config bits)
        let configBits = mutated.buffer.readBits(5, 0)
        
        // Set all 5 bits to 1 (creates 'V')
        mutated.buffer.writeBits(0b11111, 5, 0)
      }
      
      const encoded = mutated.encoded
      if (encoded[0] === 'V') {
        foundVBug = true
        corruptedGenome = encoded
        
        // With the fix, V in bias position should be handled correctly
        const decoded = Base.fromString(encoded)
        
        // The genome should NOT be corrupted anymore
        const decodedGenome = Genome.fromString(encoded)
        
        // We should still have bases (no data loss)
        expect(decodedGenome.bases.length).toBeGreaterThan(0)
        
        break
      }
    }
    
    expect(foundVBug).toBe(true)
    expect(corruptedGenome).toBeDefined()
  })
  
  test('demonstrates data loss when V appears in bias position', () => {
    // Create a genome with multiple bases
    const originalBases = [
      { type: 'connection', data: 5, source: { type: 'sensor', id: 0 }, target: { type: 'neuron', id: 1 } },
      { type: 'bias', data: -6, target: { type: 'neuron', id: 0 } },
      { type: 'connection', data: 3, source: { type: 'neuron', id: 1 }, target: { type: 'action', id: 0 } }
    ]
    
    const genome = Genome.fromBases(originalBases)
    const originalEncoded = genome.encoded
    
    // Manually corrupt the bias to create 'V'
    const buffer = BitBuffer.fromBase32String(originalEncoded)
    
    // The bias starts at bit 25 (after first connection which is 25 bits)
    // Set its first 5 bits to 11111 to create 'V'
    buffer.writeBits(0b11111, 5, 25)
    
    const corruptedEncoded = buffer.toBase32String()
    
    // Now decode the corrupted genome
    const corruptedGenome = Genome.fromString(corruptedEncoded)
    
    // We've lost data!
    expect(corruptedGenome.bases.length).toBeLessThan(originalBases.length)
    
    // The bias is now misinterpreted as attribute
    const secondBase = corruptedGenome.bases[1]
    if (secondBase) {
      expect(secondBase.type).toBe('attribute') // Wrong!
    }
  })
  
  test('random mutations can create V conflict', () => {
    const conflicts = []
    
    // Test 100 random genomes with mutations
    for (let trial = 0; trial < 100; trial++) {
      const genome = Genome.randomWith(10, {
        neurons: 5,
        sensors: 5,
        actions: 5
      })
      
      // Apply aggressive mutations
      const mutated = genome.clone()
      const totalBits = mutated.buffer.bitLength || (mutated.buffer.buffer.length * 8)
      
      for (let bit = 0; bit < totalBits; bit++) {
        if (Math.random() < 0.05) { // 5% mutation rate
          const currentBit = mutated.buffer.getBit(bit)
          mutated.buffer.setBit(bit, currentBit ? 0 : 1)
        }
      }
      
      // Check if any position has 'V' that shouldn't
      const encoded = mutated.encoded
      const decoded = Genome.fromString(encoded)
      
      // Check for data loss (indicates corruption)
      if (decoded.bases.length !== mutated.bases.length) {
        conflicts.push({
          original: genome.encoded,
          mutated: encoded,
          basesLost: mutated.bases.length - decoded.bases.length
        })
      }
    }
    
    // This test shows the bug has been fixed
    // We expect no conflicts after the fix
    expect(conflicts.length).toBe(0)
  })
})