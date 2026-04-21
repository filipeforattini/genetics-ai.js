import { Genome } from "../src/genome.class.js"

const genomes = [
  [2, '528DBA'],
  [2, '05H5302K59'],
  [4, '14M58E5C883D2V'],
  [4, '83J0F85P5501T2L2491Q'],
  [8, 'HBQH5P5CA41V5O90H60Q336170TH6O'],
  [8, '80H3J63H2162N4SDBA01R1KD2M02C5023E0T'],
  [16, '81I3D17063B3V45M5P5260650B45D2MD7D42T2D2655J9289A05C18465F4494J82Q5D'],
  [16, '54A52425T3G81T18DC065H2N0330V25J37H2M02B3F6415R82T6901U5324P0B99T62Q2H'],
]

describe('genome', () => {
  test('from simple string', () => {
    const genomeStr = [
      '101',
      '00000',
      '102',
    ].join('')

    const genome = Genome.fromString(genomeStr)

    expect(genome.bases.length).toEqual(3)
    expect(genome.bases[0].type).toEqual('bias')
    expect(genome.bases[1].type).toEqual('connection')
    expect(genome.bases[2].type).toEqual('bias')
  })

  test('random', () => {
    const count = 10
    const genome = Genome.random(count)
    expect(genome.bases.length).toEqual(count)
  })

  test('evaluate random generated bases', () => {
    for (const [count, genome] of genomes) {
      const g = Genome.from(genome)
      expect(g.bases.length).toEqual(count)
    }
  })

  test('evaluate random generated bases', () => {
    const g = Genome.randomWith(10, {
      neurons: 5,
      sensors: 100,
      actions: 4,
    })
  })

  describe('utils', () => {
    test('color', async () => {
      for (const [s, g] of genomes) {
        const color = await Genome.color(g)
        expect(color.length).toEqual(4)
      }
    })
  })

  describe('constructor', () => {
    test('creates genome from bases array', () => {
      const bases = [
        { type: 'connection', data: 5, source: { type: 'sensor', id: 0 }, target: { type: 'neuron', id: 1 } },
        { type: 'bias', data: 3, target: { type: 'neuron', id: 1 } }
      ]
      
      const genome = Genome.fromBases(bases)
      // Compare base content, not object identity (bitLength and encoded are added)
      expect(genome.bases.length).toBe(bases.length)
      genome.bases.forEach((base, i) => {
        expect(base.type).toBe(bases[i].type)
        expect(base.data).toBe(bases[i].data)
        if (base.type === 'connection') {
          expect(base.source).toEqual(bases[i].source)
          expect(base.target).toEqual(bases[i].target)
        } else if (base.type === 'bias') {
          expect(base.target).toEqual(bases[i].target)
        }
      })
    })

    test('creates empty genome', () => {
      const genome = Genome.fromBases([])
      expect(genome.bases).toEqual([])
      expect(genome.encoded).toBe('')
    })
  })

  describe('fromBases', () => {
    test('creates genome from connection bases', () => {
      const bases = [
        { type: 'connection', data: 10, source: { type: 'sensor', id: 5 }, target: { type: 'action', id: 3 } }
      ]
      
      const genome = Genome.fromBases(bases)
      // Check essential properties, not exact equality (binary adds bitLength and encoded)
      expect(genome.bases.length).toBe(1)
      expect(genome.bases[0].type).toBe('connection')
      expect(genome.bases[0].data).toBe(10)
      expect(genome.bases[0].source).toEqual({ type: 'sensor', id: 5 })
      expect(genome.bases[0].target).toEqual({ type: 'action', id: 3 })
    })

    test('creates genome from bias bases', () => {
      const bases = [
        { type: 'bias', data: -5, target: { type: 'neuron', id: 10 } }
      ]
      
      const genome = Genome.fromBases(bases)
      // Check essential properties
      expect(genome.bases.length).toBe(1)
      expect(genome.bases[0].type).toBe('bias')
      expect(genome.bases[0].data).toBe(-5)
      expect(genome.bases[0].target).toEqual({ type: 'neuron', id: 10 })
    })

    test('creates genome from mixed bases', () => {
      const bases = [
        { type: 'connection', data: 1, source: { type: 'sensor', id: 0 }, target: { type: 'neuron', id: 0 } },
        { type: 'bias', data: 5, target: { type: 'neuron', id: 0 } },
        { type: 'connection', data: 2, source: { type: 'neuron', id: 0 }, target: { type: 'action', id: 0 } }
      ]
      
      const genome = Genome.fromBases(bases)
      // Check essential properties for each base
      expect(genome.bases.length).toBe(3)
      expect(genome.bases[0].type).toBe('connection')
      expect(genome.bases[0].data).toBe(1)
      expect(genome.bases[1].type).toBe('bias')
      expect(genome.bases[1].data).toBe(5)
      expect(genome.bases[2].type).toBe('connection')
      expect(genome.bases[2].data).toBe(2)
    })
  })

  describe('encoding and decoding', () => {
    test('encodes connection to string', () => {
      const genome = Genome.fromBases([
        { type: 'connection', data: 15, source: { type: 'sensor', id: 0 }, target: { type: 'neuron', id: 0 } }
      ])
      
      expect(genome.encoded).toBeDefined()
      expect(genome.encoded.length).toBe(5) // Connection = 5 chars
    })

    test('encodes bias to string', () => {
      const genome = Genome.fromBases([
        { type: 'bias', data: 7, target: { type: 'action', id: 1 } }
      ])
      
      expect(genome.encoded).toBeDefined()
      expect(genome.encoded.length).toBe(3) // Bias = 3 chars
    })

    test('round-trip encoding', () => {
      const bases = [
        { type: 'connection', data: 8, source: { type: 'neuron', id: 10 }, target: { type: 'action', id: 2 } },
        { type: 'bias', data: -6, target: { type: 'sensor', id: 0 } }
      ]
      
      const genome1 = Genome.fromBases(bases)
      const genome2 = Genome.fromString(genome1.encoded)
      
      // Check essential properties match (binary adds extra fields)
      expect(genome2.bases.length).toBe(bases.length)
      genome2.bases.forEach((base, i) => {
        expect(base.type).toBe(bases[i].type)
        expect(base.data).toBe(bases[i].data)
        if (base.type === 'connection') {
          expect(base.source).toEqual(bases[i].source)
          expect(base.target).toEqual(bases[i].target)
        } else if (base.type === 'bias') {
          expect(base.target).toEqual(bases[i].target)
        }
      })
    })

    test('handles maximum values', () => {
      // Connection max weight is 14 (15 is reserved as the advanced-base sentinel)
      const bases = [
        { type: 'connection', data: 14, source: { type: 'sensor', id: 255 }, target: { type: 'neuron', id: 255 } },
        { type: 'bias', data: 7, target: { type: 'action', id: 255 } }
      ]

      const genome = Genome.fromBases(bases)
      const decoded = Genome.fromString(genome.encoded)

      expect(decoded.bases.length).toBe(bases.length)
      expect(decoded.bases[0].type).toBe('connection')
      expect(decoded.bases[0].data).toBe(14)
      expect(decoded.bases[0].source.id).toBe(255)
      expect(decoded.bases[0].target.id).toBe(255)
      expect(decoded.bases[1].type).toBe('bias')
      expect(decoded.bases[1].data).toBe(7)
      expect(decoded.bases[1].target.id).toBe(255)
    })

    test('handles minimum values', () => {
      const bases = [
        { type: 'connection', data: 0, source: { type: 'sensor', id: 0 }, target: { type: 'neuron', id: 0 } },
        { type: 'bias', data: -6, target: { type: 'sensor', id: 0 } }
      ]
      
      const genome = Genome.fromBases(bases)
      const decoded = Genome.fromString(genome.encoded)
      
      // Check essential properties
      expect(decoded.bases.length).toBe(bases.length)
      expect(decoded.bases[0].type).toBe('connection')
      expect(decoded.bases[0].data).toBe(0)
      expect(decoded.bases[1].type).toBe('bias')
      expect(decoded.bases[1].data).toBe(-6)
    })
  })

  describe('randomWith', () => {
    test('respects neuron count', () => {
      const genome = Genome.randomWith(20, {
        neurons: 5,
        sensors: 10,
        actions: 3
      })
      
      const neuronIds = new Set()
      genome.bases.forEach(base => {
        if (base.type === 'connection') {
          if (base.source?.type === 'neuron') neuronIds.add(base.source.id)
          if (base.target?.type === 'neuron') neuronIds.add(base.target.id)
        } else if (base.type === 'bias' && base.target.type === 'neuron') {
          neuronIds.add(base.target.id)
        }
      })
      
      // All neuron IDs should be < neurons param
      Array.from(neuronIds).forEach(id => {
        expect(id).toBeLessThan(5)
      })
    })

    test('generates both connections and biases', () => {
      const genome = Genome.randomWith(50, {
        neurons: 10,
        sensors: 5,
        actions: 5
      })
      
      const connections = genome.bases.filter(b => b.type === 'connection')
      const biases = genome.bases.filter(b => b.type === 'bias')
      
      expect(connections.length).toBeGreaterThan(0)
      expect(biases.length).toBeGreaterThan(0)
    })
  })

  describe('caching', () => {
    test('caches genome parsing', () => {
      const str = '1234567890'
      
      // Parse twice with same string
      const genome1 = Genome.fromString(str)
      const genome2 = Genome.fromString(str)
      
      // Should get same cached result
      expect(genome1.bases).toEqual(genome2.bases)
    })

    test('cache handles different strings', () => {
      const str1 = '12345'
      const str2 = '67890'
      
      const genome1 = Genome.fromString(str1)
      const genome2 = Genome.fromString(str2)
      
      expect(genome1.encoded).not.toBe(genome2.encoded)
    })
  })

  describe('attribute generation', () => {
    test('generates attributes when specified', () => {
      const genome = Genome.random(20, { attributes: 5 })
      const attributes = genome.bases.filter(b => b.type === 'attribute')
      
      // Should have some attributes (about 10% of total)
      expect(attributes.length).toBeGreaterThan(0)
      expect(attributes.length).toBeLessThanOrEqual(4) // ~10% of 20
      
      // All attribute IDs should be < 5
      attributes.forEach(attr => {
        expect(attr.id).toBeLessThan(5)
        expect(attr.value).toBeLessThanOrEqual(127) // 7-bit max
      })
    })

    test('respects attribute count in randomWith', () => {
      const genome = Genome.randomWith(50, {
        neurons: 10,
        sensors: 5,
        actions: 3,
        attributes: 8
      })
      
      const attributes = genome.bases.filter(b => b.type === 'attribute')
      
      // Should have some attributes
      expect(attributes.length).toBeGreaterThan(0)
      
      // All attribute IDs should be < 8
      attributes.forEach(attr => {
        expect(attr.id).toBeLessThan(8)
      })
    })

    test('no attributes when not specified', () => {
      const genome = Genome.random(30)
      const attributes = genome.bases.filter(b => b.type === 'attribute')
      
      // Should have no attributes
      expect(attributes.length).toBe(0)
    })

    test('attribute encoding and decoding', () => {
      const bases = [
        { type: 'attribute', data: 0, id: 0, value: 0 },
        { type: 'attribute', data: 0, id: 5, value: 64 },
        { type: 'attribute', data: 0, id: 15, value: 127 }
      ]
      
      const genome = Genome.fromBases(bases)
      const decoded = Genome.fromString(genome.encoded)
      
      // Compare attributes
      decoded.bases.forEach((base, i) => {
        expect(base.type).toBe('attribute')
        expect(base.id).toBe(bases[i].id)
        expect(base.value).toBe(bases[i].value)
      })
    })

    test('attribute string format', () => {
      // Test that attribute bases start with 'V'
      const genome = Genome.fromBases([
        { type: 'attribute', data: 0, id: 3, value: 42 }
      ])
      
      const encoded = genome.encoded
      expect(encoded[0]).toBe('V') // Attributes start with V
      expect(encoded.length).toBe(4) // Attribute bases are 4 chars
    })
  })

  describe('edge cases', () => {
    test('handles empty string', () => {
      const genome = Genome.fromString('')
      expect(genome.bases).toEqual([])
    })

    test('handles very long genome', () => {
      const genome = Genome.random(1000)
      expect(genome.bases.length).toBe(1000)
      
      const encoded = genome.encoded
      const decoded = Genome.fromString(encoded)
      
      expect(decoded.bases.length).toBe(1000)
    })

    test('handles invalid base characters gracefully', () => {
      // Should handle partial/invalid strings
      const genome = Genome.fromString('12')
      expect(genome.bases).toBeDefined()
    })

    test('handles all node type combinations', () => {
      const bases = [
        // All source -> target combinations
        { type: 'connection', data: 1, source: { type: 'sensor', id: 0 }, target: { type: 'neuron', id: 0 } },
        { type: 'connection', data: 2, source: { type: 'sensor', id: 1 }, target: { type: 'action', id: 0 } },
        { type: 'connection', data: 3, source: { type: 'neuron', id: 0 }, target: { type: 'neuron', id: 1 } },
        { type: 'connection', data: 4, source: { type: 'neuron', id: 1 }, target: { type: 'action', id: 1 } },
        // All bias targets
        { type: 'bias', data: 1, target: { type: 'sensor', id: 0 } },
        { type: 'bias', data: 2, target: { type: 'neuron', id: 0 } },
        { type: 'bias', data: 3, target: { type: 'action', id: 0 } }
      ]
      
      const genome = Genome.fromBases(bases)
      const decoded = Genome.fromString(genome.encoded)
      
      // Check all bases decoded correctly
      expect(decoded.bases.length).toBe(bases.length)
      decoded.bases.forEach((base, i) => {
        expect(base.type).toBe(bases[i].type)
        expect(base.data).toBe(bases[i].data)
      })
    })
  })
})
