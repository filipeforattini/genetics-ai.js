import { Vertex } from '../src/vertex.class.js'

describe('Vertex', () => {
  describe('constructor', () => {
    test('creates vertex with name and metadata', () => {
      const vertex = new Vertex('test-vertex', { type: 'neuron', id: 1 })
      
      expect(vertex.name).toBe('test-vertex')
      expect(vertex.metadata.type).toBe('neuron')
      expect(vertex.metadata.id).toBe(1)
      expect(vertex.in).toEqual([])
      expect(vertex.out).toEqual([])
      expect(vertex.inMap).toEqual({})
      expect(vertex.outMap).toEqual({})
    })

    test('creates vertex without metadata', () => {
      const vertex = new Vertex('simple')
      
      expect(vertex.name).toBe('simple')
      expect(vertex.metadata).toEqual({})
    })
  })

  describe('addIn', () => {
    test('adds input connection', () => {
      const v1 = new Vertex('v1')
      const v2 = new Vertex('v2')
      
      v2.addIn(v1, 5)
      
      expect(v2.in.length).toBe(1)
      expect(v2.in[0].vertex).toBe(v1)
      expect(v2.in[0].weight).toBe(5)
      expect(v2.inMap['v1'].weight).toBe(5)
      expect(v2.inMap['v1'].index).toBe(0)
    })

    test('accumulates weight for duplicate connections', () => {
      const v1 = new Vertex('v1')
      const v2 = new Vertex('v2')
      
      v2.addIn(v1, 3)
      v2.addIn(v1, 4)
      
      expect(v2.in.length).toBe(1)
      expect(v2.in[0].weight).toBe(7)
      expect(v2.inMap['v1'].weight).toBe(7)
    })

    test('handles multiple input connections', () => {
      const v1 = new Vertex('v1')
      const v2 = new Vertex('v2')
      const v3 = new Vertex('v3')
      const target = new Vertex('target')
      
      target.addIn(v1, 1)
      target.addIn(v2, 2)
      target.addIn(v3, 3)
      
      expect(target.in.length).toBe(3)
      expect(target.inMap['v1'].weight).toBe(1)
      expect(target.inMap['v2'].weight).toBe(2)
      expect(target.inMap['v3'].weight).toBe(3)
    })
  })

  describe('addOut', () => {
    test('adds output connection', () => {
      const v1 = new Vertex('v1')
      const v2 = new Vertex('v2')
      
      v1.addOut(v2, 5)
      
      expect(v1.out.length).toBe(1)
      expect(v1.out[0].vertex).toBe(v2)
      expect(v1.out[0].weight).toBe(5)
      expect(v1.outMap['v2'].weight).toBe(5)
    })

    test('accumulates weight for duplicate out connections', () => {
      const v1 = new Vertex('v1')
      const v2 = new Vertex('v2')
      
      v1.addOut(v2, 2)
      v1.addOut(v2, 3)
      
      expect(v1.out.length).toBe(1)
      expect(v1.out[0].weight).toBe(5)
      expect(v1.outMap['v2'].weight).toBe(5)
    })
  })

  describe('neighbors', () => {
    test('returns all neighbors without filter', () => {
      const center = new Vertex('center')
      const in1 = new Vertex('in1')
      const in2 = new Vertex('in2')
      const out1 = new Vertex('out1')
      
      center.addIn(in1, 1)
      center.addIn(in2, 2)
      center.addOut(out1, 3)
      
      const neighbors = center.neighbors()
      expect(neighbors.length).toBe(3)
    })

    test('returns filtered neighbors', () => {
      const center = new Vertex('center')
      const in1 = new Vertex('in1')
      const out1 = new Vertex('out1')
      
      center.addIn(in1, 5)
      center.addOut(out1, 2)
      
      const highWeight = center.neighbors(n => n.weight > 3)
      expect(highWeight.length).toBe(1)
      expect(highWeight[0].weight).toBe(5)
    })
  })

  describe('calculateInput', () => {
    test('calculates weighted sum of inputs', () => {
      const v1 = new Vertex('v1')
      const v2 = new Vertex('v2')
      const v3 = new Vertex('v3')
      const target = new Vertex('target')
      
      v1.metadata.lastTick = 0.5
      v2.metadata.lastTick = 1.0
      v3.metadata.lastTick = 0.2
      
      target.addIn(v1, 2)
      target.addIn(v2, 3)
      target.addIn(v3, 5)
      
      const input = target.calculateInput()
      expect(input).toBeCloseTo(0.5*2 + 1.0*3 + 0.2*5) // 5
    })

    test('returns 0 for no inputs', () => {
      const vertex = new Vertex('lonely')
      expect(vertex.calculateInput()).toBe(0)
    })

    test('handles missing lastTick values', () => {
      const v1 = new Vertex('v1')
      const v2 = new Vertex('v2')
      const target = new Vertex('target')
      
      v1.metadata.lastTick = 1.0
      // v2 has no lastTick
      
      target.addIn(v1, 2)
      target.addIn(v2, 3)
      
      const input = target.calculateInput()
      expect(input).toBe(2) // 1.0*2 + 0*3
    })

    test('uses TypedArrays when available', () => {
      const v1 = new Vertex('v1')
      const target = new Vertex('target')
      
      v1.metadata.lastTick = 0.5
      target.addIn(v1, 2)
      
      // First call allocates arrays
      const input1 = target.calculateInput()
      expect(input1).toBe(1)
      
      // Second call reuses arrays
      v1.metadata.lastTick = 0.8
      const input2 = target.calculateInput()
      expect(input2).toBeCloseTo(1.6)
    })
  })

  describe('inputsTree', () => {
    test('builds tree of input vertices', () => {
      const v1 = new Vertex('v1')
      const v2 = new Vertex('v2')
      const v3 = new Vertex('v3')
      const v4 = new Vertex('v4')
      
      v3.addIn(v1, 1)
      v3.addIn(v2, 1)
      v4.addIn(v3, 1)
      
      const tree = v4.inputsTree()
      
      // Tree should contain v4, v3, v1, v2
      expect(tree.length).toBe(4)
      expect(tree.find(n => n.vertex.name === 'v4').depth).toBe(0)
      expect(tree.find(n => n.vertex.name === 'v3').depth).toBe(1)
      // v1 and v2 are both at depth 2
      expect(tree.filter(n => n.depth === 2).length).toBe(2)
    })

    test('handles circular references', () => {
      const v1 = new Vertex('v1')
      const v2 = new Vertex('v2')
      
      v1.addIn(v2, 1)
      v2.addIn(v1, 1) // circular
      
      const tree = v1.inputsTree()
      
      expect(tree.length).toBe(2) // Should not infinite loop
    })

    test('tracks visited vertices', () => {
      const v1 = new Vertex('v1')
      const v2 = new Vertex('v2')
      const v3 = new Vertex('v3')
      
      v2.addIn(v1, 1)
      v3.addIn(v1, 1)
      v3.addIn(v2, 1)
      
      const tree = v3.inputsTree()
      
      // v1 should only appear once even though it's referenced twice
      const v1Entries = tree.filter(n => n.vertex.name === 'v1')
      expect(v1Entries.length).toBe(1)
    })
  })

  describe('toJSON', () => {
    test('serializes vertex to JSON', () => {
      const v1 = new Vertex('v1')
      const v2 = new Vertex('v2')
      const v3 = new Vertex('v3', { type: 'neuron', bias: 5 })
      
      v3.addIn(v1, 1)
      v3.addOut(v2, 2)
      
      const json = v3.toJSON()
      
      expect(json.name).toBe('v3')
      expect(json.metadata).toEqual({ type: 'neuron', bias: 5 })
      expect(json.in).toEqual(['v1'])
      expect(json.out).toEqual(['v2'])
    })
  })

  describe('toString', () => {
    test('returns formatted JSON string', () => {
      const vertex = new Vertex('test', { id: 1 })
      const str = vertex.toString()
      
      expect(typeof str).toBe('string')
      expect(str).toContain('"name": "test"')
      expect(str).toContain('"id": 1')
    })
  })
})