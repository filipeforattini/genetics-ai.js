import { sortBy } from "lodash-es"

// Removed - no longer needed with inline implementation

export class Vertex {
  constructor(name, metadata = {}) {
    this.name = name
    this.metadata = { ...metadata }

    this.in = []
    this.inMap = {}
    this.out = []
    this.outMap = {}
    
    // Pre-allocated arrays for performance
    this._inputArrays = {
      values: null,
      weights: null,
      size: 0
    }
    
    // Cache system with generation tracking
    this.cache = {
      generation: -1,     // Last generation when calculated
      value: 0           // Cached value
    }
  }

  addIn(vertex, weight) {
    if (!this.inMap[vertex.name]) {
      this.inMap[vertex.name] = {
        weight,
        index: this.in.push({ vertex, weight }) - 1,
      }
    } else {
      this.inMap[vertex.name].weight += weight
      this.in[this.inMap[vertex.name].index].weight += weight
    }
  }

  addOut(vertex, weight) {
    if (!this.outMap[vertex.name]) {
      this.outMap[vertex.name] = {
        weight,
        index: this.out.push({ vertex, weight }) - 1,
      }
    } else {
      this.outMap[vertex.name].weight += weight
      this.out[this.outMap[vertex.name].index].weight += weight
    }
  }

  neighbors(fn = null) {
    return fn
      ? this.in.filter(fn).concat(this.out.filter(fn))
      : this.in.concat(this.out)
  }

  toJSON() {
    return {
      name: this.name,
      metadata: this.metadata,
      in: this.in.map(v => v.vertex.name),
      out: this.out.map(v => v.vertex.name),
    }
  }

  toString() {
    return JSON.stringify(this.toJSON(), null, 2)
  }

  inputsTree(depth = 0, visited = {}) {
    // Prevent infinite recursion with cycle detection and depth limit
    if (visited[this.name] || depth > 100) return []

    let pile = []
    visited[this.name] = true
    pile.push({ depth, vertex: this })

    for (const input of this.in) {
      const subPile = input.vertex.inputsTree(depth + 1, visited)
      // Concat without filter since visited check is done at the start
      pile = pile.concat(subPile)
    }

    return sortBy(pile, ['depth'])
  }

  getCachedOrCalculate(currentGeneration) {
    // Return cached value if already calculated this generation
    if (this.cache.generation === currentGeneration) {
      return this.cache.value
    }
    
    // Mark as being calculated to prevent recursion
    this.cache.generation = currentGeneration
    
    // Calculate new value
    const value = this.tick ? this.tick() : 0
    
    // Update cache with the calculated value
    this.cache.value = value
    
    return value
  }
  
  calculateInput(currentGeneration) {
    const len = this.in.length

    // Early return for no inputs
    if (len === 0) return 0

    // TypedArrays always available in Node.js and modern browsers
    // Allocate or resize only when needed
    if (!this._inputArrays.values || this._inputArrays.size < len) {
      this._inputArrays.values = new Float32Array(len)
      this._inputArrays.weights = new Float32Array(len)
      this._inputArrays.size = len
    }

    const values = this._inputArrays.values
    const weights = this._inputArrays.weights
    const inputs = this.in

    // Fast path: when currentGeneration is provided (normal Brain.tick() usage)
    // Slow path: fallback to metadata.lastTick (for standalone vertex testing)
    const useCache = currentGeneration !== undefined

    // Fill arrays
    for (let i = 0; i < len; i++) {
      const input = inputs[i]
      values[i] = useCache
        ? input.vertex.getCachedOrCalculate(currentGeneration)
        : (input.vertex.metadata.lastTick || 0)
      weights[i] = input.weight
    }

    // Optimized dot product with loop unrolling
    let sum = 0
    let i = 0
    const len4 = len & ~3

    // Process 4 elements at a time
    for (; i < len4; i += 4) {
      sum += values[i] * weights[i] +
             values[i + 1] * weights[i + 1] +
             values[i + 2] * weights[i + 2] +
             values[i + 3] * weights[i + 3]
    }

    // Handle remainder
    for (; i < len; i++) {
      sum += values[i] * weights[i]
    }

    return sum
  }
}
