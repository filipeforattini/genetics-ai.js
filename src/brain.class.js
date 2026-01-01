import { sortBy } from "lodash-es"

import { Genome } from "./genome.class.js"
import { Vertex } from "./vertex.class.js"
import { SparseConnectionMatrix } from "./structures/sparse-connection-matrix.class.js"
import { globalArrayPool } from "./pools/typed-array-pool.class.js"
import { globalActivationLUT } from "./activation-lut.class.js"
import { AttributeBase } from "./bases/attribute.base.js"
import { EvolvedNeuronBase, EvolvedNeuronModes } from "./bases/evolved-neuron.base.js"
import { LearningRuleBase } from "./bases/learning-rule.base.js"
import { MemoryCellBase } from "./bases/memory-cell.base.js"
import { PlasticityBase } from "./bases/plasticity.base.js"

// Activation functions with ULTRA-FAST lookup tables
// LUT = Lookup Table: Pre-computed values, 50-100x faster than Math.exp()!
const sigmoid = x => globalActivationLUT.sigmoid(x)  // ~1 cycle vs ~100-200!
const relu = x => x > 0 ? x : 0                       // Already super fast
const tanh = x => globalActivationLUT.tanh(x)         // ~1 cycle vs ~150!
const identity = x => x

export class Brain {
  constructor({
    genome,
    sensors = [],
    actions = [],
    environment = {},
    activationFunction = 'relu',
  }) {
    this.environment = environment
    this.genome = Genome.from(genome)
    this.tickGeneration = 0  // Track tick generation for caching

    // Select activation function
    const activationMap = {
      'sigmoid': sigmoid,
      'relu': relu,
      'tanh': tanh,
      'identity': identity
    }
    this.activationFunction = activationMap[activationFunction] || relu

    this.definitions = {
      all: {},
      actions: {},
      neurons: {},
      sensors: {},
    }

    this.sensors = sensors.reduce((acc, sensor, i) => {
      if (!sensor.name) sensor.name = `s#${sensor.id || i}`
      acc[sensor.name] = sensor
      return acc
    }, {})

    this.actions = actions.reduce((acc, action, i) => {
      if (!action.name) action.name = `a#${action.id || i}`
      acc[action.name] = action
      return acc
    }, {})

    this.tickOrder = []

    // Pre-allocated reusable objects for performance
    this._tickCache = {
      ticked: {},
      types: {
        sensor: [],
        neuron: [],
        action: [],
      },
      actionsInputs: [],
    }

    // Performance optimization structures
    // Sparse connection matrix for memory efficiency
    this.connectionMatrix = new SparseConnectionMatrix(10000)

    // TypedArrays for neuron values (reused across ticks)
    this.neuronValues = null  // Allocated in setup
    this.sensorValues = null
    this.actionValues = null

    // Advanced base collections
    this.programmableNeurons = []
    this.learningRules = []
    this.memoryCells = []
    this.plasticities = []
    this.attributes = []
    this._allActions = []
    this._activeActions = []
    this._actionConnections = new Map()
    this._actionAttributeMap = new Map()
    this._sensorAttributesApplied = false

    // Memory cell state (persistent across ticks)
    this.memoryCellState = new Map()  // cellId -> current value

    // Plasticity map (targetId -> level)
    this.plasticityMap = new Map()

    this.setup()
  }

  setup() {
    // Process all bases using lazy iteration
    const basesIterator = this.genome.iterBases()

    for (const base of basesIterator) {
      switch (base.type) {
        case 'bias':
          this.setupBias(base)
          break
        case 'connection':
          this.setupConnection(base)
          break
        case 'evolved_neuron':
          this.programmableNeurons.push(base)
          break
        case 'learning_rule':
          this.learningRules.push(base)
          break
        case 'memory_cell':
          this.memoryCells.push(base)
          // Initialize memory cell state
          this.memoryCellState.set(base.cellId, 0)
          break
        case 'plasticity':
          this.plasticities.push(base)
          // Store plasticity level for target
          this.plasticityMap.set(base.targetId, base.level)
          break
        case 'attribute':
          this.attributes.push(base)
          break
      }
    }

    // Auto-fix cycles before computing tick order
    this.fixCycles()

    this.tickOrder = this.defineTickOrder()

    this._allActions = Object.values(this.definitions.actions)
    this._activeActions = this._allActions.filter(action => action.in.length > 0)
    this.buildActionConnections()

    // Determine optimization mode based on network size
    const connectionCount = Object.values(this.definitions.all).reduce((sum, v) => sum + v.in.length, 0)

    // Large networks (150+ connections): use layered batch processing
    // Smaller networks: use direct processing (simpler, less overhead)
    if (connectionCount >= 150) {
      this.useLayeredProcessing = true
      this.layers = this.buildLayers()
    } else {
      this.useLayeredProcessing = false
      this.layers = null
    }

    // Detect which advanced features are actually used
    // This allows us to skip entire code paths that aren't needed
    this._features = {
      hasAttributes: this.attributes.length > 0,
      hasSensorAttributes: false,  // Detected below
      hasActionAttributes: false,  // Detected below
      hasLearning: this.learningRules.length > 0,
      hasMemory: this.memoryCells.length > 0,
      hasPlasticity: this.plasticityMap && this.plasticityMap.size > 0,
      hasProgrammableNeurons: this.programmableNeurons.length > 0,
    }

    // Detect which attribute types are present
    if (this._features.hasAttributes) {
      for (const attr of this.attributes) {
        if (attr.targetType === AttributeBase.TARGET_SENSOR || attr.targetType === AttributeBase.TARGET_GLOBAL) {
          this._features.hasSensorAttributes = true
        }
        if (attr.targetType === AttributeBase.TARGET_ACTION || attr.targetType === AttributeBase.TARGET_GLOBAL) {
          this._features.hasActionAttributes = true
        }
        // Early exit if both detected
        if (this._features.hasSensorAttributes && this._features.hasActionAttributes) break
      }
    }

    if (this._features.hasSensorAttributes) {
      this.applySensorAttributes(true)
    }
    if (this._features.hasActionAttributes) {
      this.buildActionAttributeMap()
    }

    // Allocate TypedArrays after we know vertex counts
    const neuronCount = Object.keys(this.definitions.neurons).length
    const sensorCount = Object.keys(this.definitions.sensors).length
    const actionCount = Object.keys(this.definitions.actions).length

    // Use pool to get arrays (or allocate new ones)
    this.neuronValues = globalArrayPool.allocFloat32(neuronCount)
    this.sensorValues = globalArrayPool.allocFloat32(sensorCount)
    this.actionValues = globalArrayPool.allocFloat32(actionCount)

    // Compact connection matrix for better cache locality
    if (this.connectionMatrix.count > 0) {
      this.connectionMatrix.compact()
    }

    const env = this.environment
    const activationFunction = this.activationFunction
    const useReluFastPath = activationFunction === relu
    const context = env.me || this
    const brain = this  // Capture for closures

    // Cache for bound functions
    const boundFunctions = new Map()

    // Setup sensors with closures (V8 JIT optimizes these well)
    for (const vertex of Object.values(this.definitions.sensors)) {
      const sensorDef = this.sensors[vertex.name]

      if (!sensorDef?.tick) {
        vertex.tick = function() {
          return this.metadata.bias || 0
        }
      } else {
        let boundFn = boundFunctions.get(sensorDef.tick)
        if (!boundFn) {
          boundFn = sensorDef.tick.bind(context)
          boundFunctions.set(sensorDef.tick, boundFn)
        }
        vertex.tick = function() {
          return boundFn(env) + (this.metadata.bias || 0)
        }
      }
    }

    // Setup neurons with closures
    for (const vertex of Object.values(this.definitions.neurons)) {
      vertex.tick = function() {
        const input = this.calculateInput(brain.tickGeneration) + (this.metadata.bias || 0)
        return useReluFastPath ? (input > 0 ? input : 0) : activationFunction(input)
      }
    }

    if (this._features.hasProgrammableNeurons) {
      this.setupEvolvedNeurons({
        activationFunction,
        useReluFastPath
      })
    }

    // Setup actions with closures
    for (const vertex of Object.values(this.definitions.actions)) {
      const actionDef = this.actions[vertex.name]

      if (!actionDef?.tick) {
        vertex.tick = function() {
          const input = this.calculateInput(brain.tickGeneration) + (this.metadata.bias || 0)
          return useReluFastPath ? (input > 0 ? input : 0) : activationFunction(input)
        }
      } else {
        let boundFn = boundFunctions.get(actionDef.tick)
        if (!boundFn) {
          boundFn = actionDef.tick.bind(context)
          boundFunctions.set(actionDef.tick, boundFn)
        }
        vertex.tick = function() {
          const input = this.calculateInput(brain.tickGeneration) + (this.metadata.bias || 0)
          const activated = useReluFastPath ? (input > 0 ? input : 0) : activationFunction(input)
          return boundFn(activated, env)
        }
      }
    }
  }

  setupBias({ target, data }) {
    this.findOrCreateVertex({
      id: target.id,
      collection: target.type + 's',
      metadata: {
        bias: data || 0,
        type: target.type,
      },
    })
  }

  setupConnection({ data, source, target }) {
    const x = this.findOrCreateVertex({
      id: source.id,
      collection: source.type + 's',
      metadata: {
        type: source.type,
      },
    })

    const y = this.findOrCreateVertex({
      id: target.id,
      collection: target.type + 's',
      metadata: {
        type: target.type
      },
    })

    y.addIn(x, data)
    x.addOut(y, data)
  }

  setupEvolvedNeurons({ activationFunction, useReluFastPath }) {
    const brain = this
    const env = this.environment
    const getMemoryCellValue = this.getMemoryCellValue.bind(this)

    for (const base of this.programmableNeurons) {
      const neuronVertex = this.definitions.neurons[base.targetId]
      if (!neuronVertex) continue

      const mode = EvolvedNeuronBase.resolveMode(base.mode)

      neuronVertex.tick = function() {
        const generation = brain.tickGeneration
        const rawInput = this.calculateInput(generation)
        const bias = this.metadata.bias || 0
        const biasedInput = rawInput + bias

        const inputs = this.in.map(conn => conn.vertex.getCachedOrCalculate(generation))
        const weights = this.in.map(conn => conn.weight)

        const programOutput = brain.executeEvolvedNeuron(base, {
          neuron: this,
          rawInput,
          biasedInput,
          bias,
          inputs,
          weights,
          environment: env,
          getMemoryCellValue
        })

        let combined
        if (mode === EvolvedNeuronModes.ADD) {
          combined = biasedInput + programOutput
        } else if (mode === EvolvedNeuronModes.PASS_THROUGH) {
          combined = biasedInput
        } else {
          combined = programOutput
        }

        return useReluFastPath ? (combined > 0 ? combined : 0) : activationFunction(combined)
      }
    }
  }

  findOrCreateVertex({ id, collection, metadata }) {
    if (!this.definitions[collection][id]) {
      const vertex = new Vertex(`${collection[0]}#${id}`, { bias: 0, ...metadata, id })

      this.definitions[collection][id] = vertex
      this.definitions.all[vertex.name] = vertex

      return vertex
    }

    this.definitions[collection][id].metadata.bias = this.definitions[collection][id].metadata.bias + (metadata.bias || 0)
    return this.definitions[collection][id]
  }

  /**
   * Validate that the neural network is a DAG (Directed Acyclic Graph)
   * Uses DFS to detect cycles in the graph
   * @returns {{ isDAG: boolean, cycles: Array<{ from: string, to: string }> }}
   */
  validateDAG() {
    const vertices = Object.values(this.definitions.all)
    const visited = new Set()
    const recStack = new Set()
    const cycles = []

    const hasCycle = (vertex) => {
      visited.add(vertex.name)
      recStack.add(vertex.name)

      for (const edge of vertex.out) {
        const neighbor = edge.vertex
        if (!visited.has(neighbor.name)) {
          if (hasCycle(neighbor)) return true
        } else if (recStack.has(neighbor.name)) {
          cycles.push({ from: vertex.name, to: neighbor.name })
          return true
        }
      }

      recStack.delete(vertex.name)
      return false
    }

    for (const vertex of vertices) {
      if (!visited.has(vertex.name)) {
        hasCycle(vertex)
      }
    }

    return { isDAG: cycles.length === 0, cycles }
  }

  /**
   * Auto-fix cycles by removing connections that cause them
   * Optimized: Uses Set for O(n) batch removal instead of O(n²) per-edge removal
   * @returns {number} Number of connections removed
   */
  fixCycles() {
    let totalFixed = 0
    let validation = this.validateDAG()

    // Loop while cycles exist (usually just 1 iteration needed)
    while (!validation.isDAG && validation.cycles.length > 0) {
      // Collect ALL edges to remove in a Set for O(1) lookup
      const edgesToRemove = new Set()
      for (const cycle of validation.cycles) {
        edgesToRemove.add(`${cycle.from}|${cycle.to}`)
      }

      let fixedThisRound = 0

      // Single pass through all vertices, removing all cycle edges at once
      for (const vertexName in this.definitions.all) {
        const vertex = this.definitions.all[vertexName]

        // Check outgoing edges
        const originalOutLen = vertex.out.length
        if (originalOutLen > 0) {
          // Filter out edges that are in cycles
          const newOut = []
          for (let i = 0; i < vertex.out.length; i++) {
            const edge = vertex.out[i]
            const edgeKey = `${vertexName}|${edge.vertex.name}`
            if (edgesToRemove.has(edgeKey)) {
              delete vertex.outMap[edge.vertex.name]
              fixedThisRound++
            } else {
              newOut.push(edge)
            }
          }
          if (newOut.length !== originalOutLen) {
            vertex.out = newOut
          }
        }

        // Check incoming edges
        const originalInLen = vertex.in.length
        if (originalInLen > 0) {
          const newIn = []
          for (let i = 0; i < vertex.in.length; i++) {
            const edge = vertex.in[i]
            const edgeKey = `${edge.vertex.name}|${vertexName}`
            if (edgesToRemove.has(edgeKey)) {
              delete vertex.inMap[edge.vertex.name]
              // Don't double-count - already counted in out removal
            } else {
              newIn.push(edge)
            }
          }
          if (newIn.length !== originalInLen) {
            vertex.in = newIn
          }
        }
      }

      totalFixed += fixedThisRound

      // Revalidate once after batch removal (not after each edge)
      validation = this.validateDAG()
    }

    // Silent fix - no logging (was spamming during evolution)

    return totalFixed
  }

  defineTickOrder() {
    let tickList = []

    const usableActions = Object
      .values(this.definitions.actions)
      .filter(action => action.in.length > 0)

    // Build complete list first, then sort once
    for (const action of usableActions) {
      tickList = tickList.concat(action.inputsTree())
    }

    // CRITICAL BUG FIX: Filter out actions from tickList!
    //
    // Problem: inputsTree() returns the entire tree INCLUDING the action itself.
    // When Brain.tick() processes tickOrder, it calls getCachedOrCalculate() on ALL vertices,
    // which triggers action tick() functions for ALL actions (not just the winner).
    //
    // This caused:
    // 1. All actions executing their user code every tick (not just the winner)
    // 2. Neural networks unable to learn (all individuals showed identical behavior)
    // 3. Snake and other examples failing completely
    //
    // Solution: Filter out action vertices (names starting with 'a#') from tickOrder.
    // Actions should ONLY execute when they win (highest input), not during processing.
    //
    // See: test-sensor.js and debug-neural-net.js for verification tests
    tickList = tickList.filter(item => !item.vertex.name.startsWith('a#'))

    // Single sort at the end
    tickList = sortBy(tickList, ['depth']).reverse()

    return tickList
  }

  /**
   * V3: Build layer structure from tickOrder for batched computation
   * Groups vertices by depth to enable matrix operations per layer
   * OPTIMIZED: Removed unused vertexIndices Map for reduced memory
   * @returns {Array<Object>} Array of layer objects
   */
  buildLayers() {
    if (this.tickOrder.length === 0) return []

    const layers = []
    let currentDepth = this.tickOrder[0].depth
    let currentLayer = {
      depth: currentDepth,
      vertices: [],
      // REMOVED: vertexIndices Map was never used, just wasted memory
    }

    // Group vertices by depth
    for (const item of this.tickOrder) {
      if (item.depth !== currentDepth) {
        // Finalize current layer
        layers.push(currentLayer)

        // Start new layer
        currentDepth = item.depth
        currentLayer = {
          depth: currentDepth,
          vertices: [],
        }
      }

      // Add vertex to current layer
      currentLayer.vertices.push(item.vertex)
    }

    // Push final layer
    if (currentLayer.vertices.length > 0) {
      layers.push(currentLayer)
    }

    // Build connection info for each layer
    for (const layer of layers) {
      this.buildLayerConnectionInfo(layer)
    }

    return layers
  }

  /**
   * V3: Build connection information for a layer
   * Prepares data structures for efficient batched computation
   * OPTIMIZED: TypedArrays for ranges, pre-computed vertex types
   * @param {Object} layer - Layer object to populate with connection info
   */
  buildLayerConnectionInfo(layer) {
    const vertexCount = layer.vertices.length

    // First pass: count total connections to pre-allocate
    let totalConnections = 0
    for (let i = 0; i < vertexCount; i++) {
      totalConnections += layer.vertices[i].in.length
    }

    // Pre-allocate arrays for connection data
    // OPTIMIZED: Use TypedArrays for ranges instead of objects
    layer.connections = {
      // Total number of connections in this layer
      totalCount: totalConnections,

      // OPTIMIZED: TypedArrays for vertex ranges (Uint32 for start, Uint16 for count)
      // Much better cache locality than array of objects
      rangeStarts: new Uint32Array(vertexCount),
      rangeCounts: new Uint16Array(vertexCount),

      // Flattened connection data (pre-allocated)
      sourceVertices: new Array(totalConnections),
      sourceCaches: new Array(totalConnections),
      weightsTyped: new Float32Array(totalConnections),

      // Output buffer for computed values
      outputs: new Float32Array(vertexCount),
      biases: new Float32Array(vertexCount),

      // OPTIMIZED: Pre-computed vertex types (0=sensor, 1=neuron, 2=action)
      // Avoids string comparison in hot loop
      vertexTypes: new Uint8Array(vertexCount),
    }

    const conn = layer.connections

    // Second pass: fill arrays
    let flatIdx = 0
    for (let vIdx = 0; vIdx < vertexCount; vIdx++) {
      const vertex = layer.vertices[vIdx]
      const inputs = vertex.in
      const inputCount = inputs.length

      // Store bias
      conn.biases[vIdx] = vertex.metadata.bias || 0

      // Store vertex type as numeric (faster comparison)
      const type = vertex.metadata.type
      conn.vertexTypes[vIdx] = type === 'sensor' ? 0 : (type === 'action' ? 2 : 1)

      // Store range info
      conn.rangeStarts[vIdx] = flatIdx
      conn.rangeCounts[vIdx] = inputCount

      // Fill connection data
      for (let i = 0; i < inputCount; i++) {
        const input = inputs[i]
        conn.sourceVertices[flatIdx] = input.vertex
        conn.sourceCaches[flatIdx] = input.vertex.cache
        conn.weightsTyped[flatIdx] = input.weight
        flatIdx++
      }
    }
  }

  /**
   * V3: Process neural network using layered batch computation
   * This method processes all vertices in a layer together, enabling better
   * CPU cache utilization and potential SIMD optimizations
   * OPTIMIZED: TypedArray ranges, numeric vertex types, reduced dereferencing
   * @param {number} currentGen - Current tick generation for cache
   */
  tickLayered(currentGen) {
    const activation = this.activationFunction
    const layers = this.layers
    const layerCount = layers.length

    // Process each layer in order (already sorted by depth)
    for (let layerIdx = 0; layerIdx < layerCount; layerIdx++) {
      const layer = layers[layerIdx]
      const conn = layer.connections
      const vertices = layer.vertices
      const vertexCount = vertices.length

      // OPTIMIZED: Cache TypedArray references outside inner loop
      const rangeStarts = conn.rangeStarts
      const rangeCounts = conn.rangeCounts
      const vertexTypes = conn.vertexTypes
      const biases = conn.biases
      const sourceCaches = conn.sourceCaches
      const sourceVertices = conn.sourceVertices
      const weights = conn.weightsTyped
      const outputs = conn.outputs

      // Batch compute all vertices in this layer
      for (let vIdx = 0; vIdx < vertexCount; vIdx++) {
        const vertex = vertices[vIdx]
        const cache = vertex.cache

        // Check if already computed this generation (avoid duplicates)
        if (cache.generation === currentGen) {
          continue
        }

        // OPTIMIZED: Use TypedArrays instead of object property access
        const rangeStart = rangeStarts[vIdx]
        const rangeCount = rangeCounts[vIdx]
        const vertexType = vertexTypes[vIdx]

        // Different handling based on vertex type (0=sensor, 1=neuron, 2=action)
        let output

        if (rangeCount === 0 || vertexType === 0) {
          // Sensor: call custom tick function (reads from environment)
          output = vertex.tick ? vertex.tick() : 0

          // Cache sensor value
          cache.generation = currentGen
          cache.value = output
          outputs[vIdx] = output
        } else if (vertexType === 2) {
          // Action: compute weighted sum but DON'T execute yet
          // We need to find the winning action first, then execute only that one
          let sum = 0

          // OPTIMIZED: Minimal inner loop with cached references
          for (let i = 0; i < rangeCount; i++) {
            const connIdx = rangeStart + i
            const sourceCache = sourceCaches[connIdx]

            // Fast path: already cached this generation
            const sourceValue = sourceCache.generation === currentGen
              ? sourceCache.value
              : sourceVertices[connIdx].getCachedOrCalculate(currentGen)

            sum += sourceValue * weights[connIdx]
          }

          // Store the raw input (before activation) for later comparison
          const input = sum + biases[vIdx]
          cache.generation = currentGen
          cache.input = input  // Store input for action selection
          cache.value = activation(input)  // Store activated value for execution
        } else {
          // Neuron: compute weighted sum of inputs
          let sum = 0

          // OPTIMIZED: Minimal inner loop with cached references
          for (let i = 0; i < rangeCount; i++) {
            const connIdx = rangeStart + i
            const sourceCache = sourceCaches[connIdx]

            // Fast path: already cached this generation
            const sourceValue = sourceCache.generation === currentGen
              ? sourceCache.value
              : sourceVertices[connIdx].getCachedOrCalculate(currentGen)

            sum += sourceValue * weights[connIdx]
          }

          // Add bias and apply activation
          const input = sum + biases[vIdx]
          output = activation(input)

          // Cache neuron value
          cache.generation = currentGen
          cache.value = output
          outputs[vIdx] = output
        }
      }
    }
  }

  tick() {
    // Increment generation for cache invalidation
    this.tickGeneration++
    const currentGen = this.tickGeneration
    const activationFunction = this.activationFunction
    const useReluFastPath = activationFunction === relu

    // Use layered batch processing for large networks
    // Or direct processing for small networks
    if (this.useLayeredProcessing) {
      this.tickLayered(currentGen)
    } else {
      // Direct processing: Better for very small networks
      for (const { vertex } of this.tickOrder) {
        vertex.getCachedOrCalculate(currentGen)
      }
    }

    // Process actions and find the one with maximum input
    const ticked = {}
    let maxVertex = null
    let maxInput = -Infinity
    const actionPool = this._activeActions.length ? this._activeActions : this._allActions

    for (const action of actionPool) {
      const fanIn = this._actionConnections.get(action.name)
      if (!fanIn) continue

      let input = action.cache.generation === currentGen && action.cache.input !== undefined
        ? action.cache.input
        : null

      if (input === null) {
        const sources = fanIn.sources
        const caches = fanIn.caches
        const weights = fanIn.weights
        let sum = 0

        for (let idx = 0; idx < sources.length; idx++) {
          const cache = caches[idx]
          let value
          if (cache.generation === currentGen) {
            value = cache.value
          } else {
            const sourceVertex = sources[idx]
            value = sourceVertex.getCachedOrCalculate
              ? sourceVertex.getCachedOrCalculate(currentGen)
              : (sourceVertex.tick ? sourceVertex.tick() : 0)
          }

          sum += value * weights[idx]
        }

        input = sum
      }

      const biased = input + (action.metadata.bias || 0)
      const activated = useReluFastPath ? (biased > 0 ? biased : 0) : activationFunction(biased)
      action.cache.generation = currentGen
      action.cache.input = input
      action.cache.value = activated

      if (input > maxInput) {
        maxInput = input
        maxVertex = action
      }
    }

    if (!maxVertex) return ticked

    const maxAction = { input: maxInput, vertex: maxVertex }

    // Apply action attributes before execution (only if present)
    if (this._features.hasActionAttributes) {
      this.applyActionAttributes(maxAction, currentGen)
    }

    // Execute the winning action
    // CRITICAL FIX: Must call tick() directly for side effects (like setting chosenMove).
    // The cache was set in the action-finding loop above, but that doesn't execute the
    // user's tick function. We need to call tick() here for side effects AND return value.
    //
    // IMPORTANT: Clear the cache generation to force tick() to re-execute.
    // Otherwise getCachedOrCalculate would just return the cached value without calling tick.
    maxAction.vertex.cache.generation = -1  // Invalidate cache to force re-execution
    ticked[maxAction.vertex.name] = maxAction.vertex.getCachedOrCalculate(currentGen)

    // Apply learning rules after tick (only if present)
    if (this._features.hasLearning) {
      this.applyLearningRules(currentGen)
    }

    // Update memory cells (only if present)
    if (this._features.hasMemory) {
      this.updateMemoryCells()
    }

    return ticked
  }

  /**
   * Apply attribute influences to sensors
   */
  applySensorAttributes(force = false) {
    if (!this.attributes.length) return
    if (this._sensorAttributesApplied && !force) return

    for (const attr of this.attributes) {
      // Skip if not targeting sensors
      if (attr.targetType !== AttributeBase.TARGET_SENSOR &&
          attr.targetType !== AttributeBase.TARGET_GLOBAL) {
        continue
      }

      // Find matching sensors
      const sensorIds = attr.targetType === AttributeBase.TARGET_GLOBAL
        ? Object.keys(this.definitions.sensors)
        : [attr.targetId]

      for (const sensorId of sensorIds) {
        const sensor = this.definitions.sensors[sensorId]
        if (!sensor) continue

        // Store original tick function if not already stored
        if (!sensor._originalTick) {
          sensor._originalTick = sensor.tick
        }

        // Wrap tick with attribute influence
        const originalTick = sensor._originalTick
        const attribute = attr
        sensor.tick = function() {
          const rawValue = originalTick.call(this)
          return AttributeBase.applySensorInfluence(attribute, rawValue)
        }
      }
    }

    this._sensorAttributesApplied = true
  }

  buildActionAttributeMap() {
    this._actionAttributeMap = new Map()
    if (!this.attributes.length) return

    const actionEntries = Object.values(this.definitions.actions)
    if (!actionEntries.length) return

    const register = (actionId, attr) => {
      if (!this._actionAttributeMap.has(actionId)) {
        this._actionAttributeMap.set(actionId, [])
      }
      this._actionAttributeMap.get(actionId).push(attr)
    }

    for (const attr of this.attributes) {
      if (attr.targetType === AttributeBase.TARGET_ACTION) {
        register(attr.targetId, attr)
      } else if (attr.targetType === AttributeBase.TARGET_GLOBAL) {
        for (const action of actionEntries) {
          register(action.metadata.id, attr)
        }
      }
    }
  }

  /**
   * Apply attribute influences to actions
   */
  applyActionAttributes(maxAction, currentGen) {
    if (!this.attributes.length) return
    if (!maxAction) return

    const actionVertex = maxAction.vertex
    const actionId = actionVertex.metadata.id
    const actionAttrs = this._actionAttributeMap.get(actionId)

    if (!actionAttrs || !actionAttrs.length) return

    for (const attr of actionAttrs) {
      const attrName = AttributeBase.getAttributeName(attr.attributeId)

      // Determine influence mode based on attribute type
      let influenceMode = 'multiply'  // Default
      if (attr.attributeId === AttributeBase.ATTR_HUNGER ||
          attr.attributeId === AttributeBase.ATTR_CURIOSITY) {
        influenceMode = 'boost'
      } else if (attr.attributeId === AttributeBase.ATTR_FEAR) {
        influenceMode = 'threshold'
      } else if (attr.attributeId === AttributeBase.ATTR_AGGRESSION) {
        influenceMode = 'add'
      }

      // Modify action input
      maxAction.input = AttributeBase.applyActionInfluence(
        attr,
        maxAction.input,
        influenceMode
      )
    }
  }

  /**
   * Apply learning rules to connections
   */
  applyLearningRules(currentGen) {
    if (!this.learningRules.length) return

    for (const rule of this.learningRules) {
      // Find connection in matrix or vertex graph
      if (this.connectionMatrix && this.connectionMatrix.count > 0) {
        // Find connection by ID
        const connIdx = rule.connectionId
        if (connIdx < 0 || connIdx >= this.connectionMatrix.count) continue

        const conn = this.connectionMatrix.get(connIdx)
        if (!conn) continue

        // Get pre and post values
        const preVertex = this.definitions.all[`s#${conn.sourceId}`] ||
                         this.definitions.all[`n#${conn.sourceId}`]
        const postVertex = this.definitions.all[`n#${conn.targetId}`] ||
                          this.definitions.all[`a#${conn.targetId}`]

        if (!preVertex || !postVertex) continue

        const preValue = preVertex.cache.value || 0
        const postValue = postVertex.cache.value || 0

        // Apply learning rule
        const newWeight = LearningRuleBase.applyRule(
          rule,
          conn.weight,
          preValue,
          postValue
        )

        // Check plasticity
        const plasticity = this.plasticityMap.get(conn.targetId)
        const finalWeight = plasticity !== undefined
          ? conn.weight + PlasticityBase.scaleWeightDelta(plasticity, newWeight - conn.weight)
          : newWeight

        // Update weight
        this.connectionMatrix.updateWeight(connIdx, finalWeight)
      }
    }
  }

  /**
   * Update memory cell states
   */
  updateMemoryCells() {
    if (!this.memoryCells.length) return

    for (const cell of this.memoryCells) {
      const currentValue = this.memoryCellState.get(cell.cellId) || 0

      // Get input from corresponding neuron
      const neuron = this.definitions.neurons[cell.cellId]
      const newInput = neuron ? (neuron.cache.value || 0) : 0

      // Update memory with decay
      const newValue = MemoryCellBase.updateValue(currentValue, cell, newInput)
      this.memoryCellState.set(cell.cellId, newValue)

      // Inject memory value back as bias to neuron
      if (neuron) {
        neuron.metadata.bias = (neuron.metadata.bias || 0) + newValue * 0.1
      }
    }
  }

  /**
   * Execute evolved neuron program
   * @param {Object} evolvedNeuron - EvolvedNeuron base
   * @param {Object} extraContext - Additional context overrides
   * @returns {number} Computed value
   */
  executeEvolvedNeuron(evolvedNeuron, extraContext = {}) {
    return EvolvedNeuronBase.execute(
      evolvedNeuron,
      {
        brain: this,
        environment: this.environment,
        getMemoryCellValue: this.getMemoryCellValue.bind(this),
        ...extraContext
      }
    )
  }

  /**
   * V3: Get memory cell value
   * @param {number} cellId - Memory cell ID
   * @returns {number} Current memory value
   */
  getMemoryCellValue(cellId) {
    return this.memoryCellState.get(cellId) || 0
  }

  /**
   * V3: Set memory cell value (for testing/debugging)
   * @param {number} cellId - Memory cell ID
   * @param {number} value - New value
   */
  setMemoryCellValue(cellId, value) {
    this.memoryCellState.set(cellId, Math.max(-1, Math.min(1, value)))
  }

  /**
   * Clean up resources (release arrays back to pool)
   */
  destroy() {
    if (this.neuronValues) globalArrayPool.free(this.neuronValues)
    if (this.sensorValues) globalArrayPool.free(this.sensorValues)
    if (this.actionValues) globalArrayPool.free(this.actionValues)

    this.neuronValues = null
    this.sensorValues = null
    this.actionValues = null
  }

  buildActionConnections() {
    this._actionConnections = new Map()

    for (const action of Object.values(this.definitions.actions)) {
      const inputs = action.in
      if (!inputs.length) continue

      const len = inputs.length
      const sources = new Array(len)
      const caches = new Array(len)
      const weights = new Float32Array(len)

      for (let i = 0; i < len; i++) {
        const input = inputs[i]
        sources[i] = input.vertex
        caches[i] = input.vertex.cache
        weights[i] = input.weight
      }

      this._actionConnections.set(action.name, { sources, caches, weights })
    }
  }
}
