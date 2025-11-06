import { Base } from '../src/base.class.js'
import { Genome } from '../src/genome.class.js'
import { Individual } from '../src/individual.class.js'

describe('Attribute Bases', () => {
  describe('Base.class.js', () => {
    test('should detect attribute base type', () => {
      // Create attribute base starting with 'V' marker
      const base = Base.fromString('V03A')
      expect(base.type).toBe('attribute')
      expect(base.id).toBeDefined()
      expect(base.value).toBeDefined()
    })

    test('should encode and decode attribute base', () => {
      const originalBase = {
        type: 'attribute',
        data: 3,
        id: 42,
        value: 100,
      }

      const encoded = Base.toString(originalBase)
      expect(encoded).toHaveLength(4)

      const decoded = Base.fromString(encoded)
      expect(decoded.type).toBe('attribute')
      expect(decoded.id).toBe(42)
      expect(decoded.value).toBe(100)
    })

    test('should generate random attribute bases', () => {
      const base = Base.randomWith({ attributes: 10 })
      
      // Should occasionally generate attribute bases
      let foundAttribute = false
      for (let i = 0; i < 20; i++) {
        const b = Base.randomWith({ attributes: 10 })
        if (b.type === 'attribute') {
          foundAttribute = true
          expect(b.id).toBeGreaterThanOrEqual(0)
          expect(b.id).toBeLessThanOrEqual(9)
          expect(b.value).toBeGreaterThanOrEqual(0)
          expect(b.value).toBeLessThanOrEqual(127)
          break
        }
      }
      expect(foundAttribute).toBe(true)
    })
  })

  describe('Genome.class.js', () => {
    test('should parse genome with attribute bases', () => {
      // Create a genome string with mixed base types
      const connectionBase = Base.toString({
        type: 'connection',
        data: 2,
        source: { type: 'sensor', id: 0 },
        target: { type: 'neuron', id: 0 },
      })
      
      const attributeBase = Base.toString({
        type: 'attribute',
        data: 1,
        id: 10,
        value: 100,
      })
      
      const biasBase = Base.toString({
        type: 'bias',
        data: 3,
        target: { type: 'neuron', id: 0 },
      })

      const genomeStr = connectionBase + attributeBase + biasBase
      const genome = Genome.fromString(genomeStr)

      expect(genome.bases).toHaveLength(3)
      expect(genome.bases[0].type).toBe('connection')
      expect(genome.bases[1].type).toBe('attribute')
      expect(genome.bases[1].id).toBe(10)
      expect(genome.bases[1].value).toBe(100)
      expect(genome.bases[2].type).toBe('bias')
    })

    test('should handle randomWith with attributes', () => {
      const genome = Genome.randomWith(10, {
        neurons: 5,
        sensors: 3,
        actions: 2,
        attributes: 8,
      })

      expect(genome.bases).toHaveLength(10)
      
      // Check that some attribute bases were generated
      const attributeBases = genome.bases.filter(b => b.type === 'attribute')
      expect(attributeBases.length).toBeGreaterThan(0)
      
      attributeBases.forEach(base => {
        expect(base.id).toBeGreaterThanOrEqual(0)
        expect(base.id).toBeLessThanOrEqual(7)
        expect(base.value).toBeGreaterThanOrEqual(0)
        expect(base.value).toBeLessThanOrEqual(127)
      })
    })
  })

  describe('Individual.class.js', () => {
    test('should parse attributes from genome', () => {
      // Create genome with attribute bases
      const genome = {
        bases: [
          { type: 'attribute', id: 0, value: 127 }, // Eye color = red
          { type: 'attribute', id: 1, value: 100 }, // Speed = 100
          { type: 'attribute', id: 2, value: 50 },  // Strength = 50
          { type: 'connection', data: 1, source: { type: 'sensor', id: 0 }, target: { type: 'neuron', id: 0 } },
        ],
        encoded: 'TEST',
      }

      const individual = new Individual({
        genome,
        sensors: [{ name: 's0' }],
        actions: [{ name: 'a0' }],
      })

      expect(individual.attributes.size).toBe(3)
      expect(individual.attributes.get(0)).toBe(127) // Eye color
      expect(individual.attributes.get(1)).toBe(100) // Speed
      expect(individual.attributes.get(2)).toBe(50)  // Strength
      expect(individual.attributes.get(3)).toBeUndefined() // Non-existent attribute
    })

    test('should handle genome with no attributes', () => {
      const genome = {
        bases: [
          { type: 'connection', data: 1, source: { type: 'sensor', id: 0 }, target: { type: 'neuron', id: 0 } },
          { type: 'bias', data: 2, target: { type: 'neuron', id: 0 } },
        ],
        encoded: 'TEST',
      }

      const individual = new Individual({
        genome,
        sensors: [{ name: 's0' }],
        actions: [{ name: 'a0' }],
      })

      expect(individual.attributes.size).toBe(0)
    })

    test('should handle duplicate attribute IDs (last value wins)', () => {
      const genome = {
        bases: [
          { type: 'attribute', id: 5, value: 10 },
          { type: 'attribute', id: 5, value: 20 },
          { type: 'attribute', id: 5, value: 30 }, // This should be the final value
        ],
        encoded: 'TEST',
      }

      const individual = new Individual({
        genome,
        sensors: [],
        actions: [],
      })

      expect(individual.attributes.size).toBe(1)
      expect(individual.attributes.get(5)).toBe(30) // Last value wins
    })

    test('should create individual with random genome including attributes', () => {
      const genome = Genome.randomWith(20, {
        neurons: 10,
        sensors: 5,
        actions: 3,
        attributes: 10,
      })

      const individual = new Individual({
        genome,
        sensors: Array(5).fill(null).map((_, i) => ({ name: `s${i}` })),
        actions: Array(3).fill(null).map((_, i) => ({ name: `a${i}` })),
      })

      // Check that attributes were parsed
      const attributeBases = genome.bases.filter(b => b.type === 'attribute')
      expect(individual.attributes.size).toBeGreaterThanOrEqual(0)
      expect(individual.attributes.size).toBeLessThanOrEqual(attributeBases.length)
    })
  })
})