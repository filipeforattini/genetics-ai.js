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
import { JITTickGenerator } from "./jit-tick-generator.class.js"

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

    this.tickOrder = this.defineTickOrder()

    // Determine optimization mode based on network size
    // Count total connections to decide optimization strategy
    const connectionCount = Object.values(this.definitions.all).reduce((sum, v) => sum + v.in.length, 0)

    // Adaptive optimization: choose strategy based on network size
    // JIT (5-200 connections): Generate specialized code - FASTEST
    // Direct (<5 or no features): Simple processing
    // Layered (>200): Batch processing for very large networks

    const hasAdvancedFeatures = (this.attributes.length > 0) ||
                                (this.learningRules.length > 0) ||
                                (this.memoryCells.length > 0)

    // Debug: log decision
    const debugJIT = false // Set to true to debug
    if (debugJIT) {
      console.log('JIT decision:', {
        connectionCount,
        hasAdvancedFeatures,
        shouldTryJIT: connectionCount >= 5 && connectionCount <= 200 && !hasAdvancedFeatures
      })
    }

    // JIT DISABLED: Benchmarks show it's slower than optimized implementation (-39%)
    // Current implementation is already +12.4% faster than previous version!
    // Keeping JIT code for future optimization attempts
    this.useJIT = false
    this.jitTickFunction = null

    if (connectionCount >= 150) {
      // Large networks: use layered processing
      this.useJIT = false
      this.useLayeredProcessing = true
      this.layers = this.buildLayers()
    } else {
      // Very small or complex: direct processing
      this.useJIT = false
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
    
    // Cache for bound functions - compatible with all environments
    const hasMap = typeof Map !== 'undefined'
    const boundFunctions = hasMap ? new Map() : {}

    // Setup sensors with cached bound functions
    const brain = this  // Reference for closure
    for (const vertex of Object.values(this.definitions.sensors)) {
      const sensorDef = this.sensors[vertex.name]
      
      if (!sensorDef?.tick) {
        vertex.tick = function() {
          return this.metadata.bias || 0
        }
      } else {
        // Cache bound function
        let boundFn
        if (hasMap) {
          boundFn = boundFunctions.get(sensorDef.tick)
          if (!boundFn) {
            boundFn = sensorDef.tick.bind(context)
            boundFunctions.set(sensorDef.tick, boundFn)
          }
        } else {
          const key = sensorDef.tick.toString()
          boundFn = boundFunctions[key]
          if (!boundFn) {
            boundFn = sensorDef.tick.bind(context)
            boundFunctions[key] = boundFn
          }
        }
        
        vertex.tick = function() {
          return boundFn(env) + (this.metadata.bias || 0)
        }
      }
    }

    // Optimize neuron tick functions based on activation type
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

    // Setup actions with cached bound functions
    for (const vertex of Object.values(this.definitions.actions)) {
      const actionDef = this.actions[vertex.name]
      
      if (!actionDef?.tick) {
        vertex.tick = function() {
          const input = this.calculateInput(brain.tickGeneration) + (this.metadata.bias || 0)
          const activated = useReluFastPath ? (input > 0 ? input : 0) : activationFunction(input)
          return 0
        }
      } else {
        // Cache bound function
        let boundFn
        if (hasMap) {
          boundFn = boundFunctions.get(actionDef.tick)
          if (!boundFn) {
            boundFn = actionDef.tick.bind(context)
            boundFunctions.set(actionDef.tick, boundFn)
          }
        } else {
          const key = actionDef.tick.toString()
          boundFn = boundFunctions[key]
          if (!boundFn) {
            boundFn = actionDef.tick.bind(context)
            boundFunctions[key] = boundFn
          }
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
   * @returns {Array<Object>} Array of layer objects
   */
  buildLayers() {
    if (this.tickOrder.length === 0) return []

    const layers = []
    let currentDepth = this.tickOrder[0].depth
    let currentLayer = {
      depth: currentDepth,
      vertices: [],
      vertexIndices: new Map(),  // vertex.name -> index in layer
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
          vertexIndices: new Map(),
        }
      }

      // Add vertex to current layer
      const idx = currentLayer.vertices.length
      currentLayer.vertices.push(item.vertex)
      currentLayer.vertexIndices.set(item.vertex.name, idx)
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
   * @param {Object} layer - Layer object to populate with connection info
   */
  buildLayerConnectionInfo(layer) {
    const vertexCount = layer.vertices.length

    // Pre-allocate arrays for connection data
    // Format: For each vertex in layer, store all input connections
    layer.connections = {
      // Total number of connections in this layer
      totalCount: 0,

      // For each vertex: [startIdx, count] in flattened arrays
      vertexRanges: new Array(vertexCount),

      // Flattened connection data
      sourceIndices: [],   // Index of source vertex in overall graph
      weights: [],         // Connection weights

      // Output buffer for computed values
      outputs: new Float32Array(vertexCount),
      biases: new Float32Array(vertexCount),
    }

    // Build vertex ID map for fast lookup
    const vertexIdMap = new Map()
    for (let i = 0; i < vertexCount; i++) {
      const vertex = layer.vertices[i]
      vertexIdMap.set(vertex.name, i)

      // Store bias
      layer.connections.biases[i] = vertex.metadata.bias || 0
    }

    // Collect all connections for each vertex in the layer
    let flatIdx = 0
    for (let vIdx = 0; vIdx < vertexCount; vIdx++) {
      const vertex = layer.vertices[vIdx]
      const startIdx = flatIdx

      // Iterate through vertex inputs
      for (const input of vertex.in) {
        layer.connections.sourceIndices.push(input.vertex)
        layer.connections.weights.push(input.weight)
        flatIdx++
      }

      const count = flatIdx - startIdx
      layer.connections.vertexRanges[vIdx] = { start: startIdx, count }
      layer.connections.totalCount += count
    }

    // Convert to TypedArrays for better performance
    layer.connections.weightsTyped = new Float32Array(layer.connections.weights)
  }

  /**
   * V3: Process neural network using layered batch computation
   * This method processes all vertices in a layer together, enabling better
   * CPU cache utilization and potential SIMD optimizations
   * @param {number} currentGen - Current tick generation for cache
   */
  tickLayered(currentGen) {
    const activation = this.activationFunction

    // Process each layer in order (already sorted by depth)
    for (const layer of this.layers) {
      const conn = layer.connections
      const vertexCount = layer.vertices.length

      // Batch compute all vertices in this layer
      // This is the key optimization: instead of calling each vertex.tick() individually,
      // we process the entire layer as a batch operation
      for (let vIdx = 0; vIdx < vertexCount; vIdx++) {
        const vertex = layer.vertices[vIdx]

        // Check if already computed this generation (avoid duplicates)
        if (vertex.cache.generation === currentGen) {
          continue
        }

        const range = conn.vertexRanges[vIdx]

        // Different handling based on vertex type
        let output

        if (range.count === 0 || vertex.metadata.type === 'sensor') {
          // Sensor: call custom tick function (reads from environment)
          output = vertex.tick ? vertex.tick() : 0

          // Cache sensor value
          vertex.cache.generation = currentGen
          vertex.cache.value = output
        } else if (vertex.metadata.type === 'action') {
          // Action: compute weighted sum but DON'T execute yet
          // We need to find the winning action first, then execute only that one
          let sum = 0
          for (let i = 0; i < range.count; i++) {
            const connIdx = range.start + i
            const sourceVertex = conn.sourceIndices[connIdx]

            const sourceValue = sourceVertex.cache.generation === currentGen
              ? sourceVertex.cache.value
              : (sourceVertex.tick ? sourceVertex.tick() : 0)

            sum += sourceValue * conn.weightsTyped[connIdx]
          }

          // Store the raw input (before activation) for later comparison
          const input = sum + conn.biases[vIdx]
          vertex.cache.generation = currentGen
          vertex.cache.input = input  // Store input for action selection
          vertex.cache.value = activation(input)  // Store activated value for execution
        } else {
          // Neuron: compute weighted sum of inputs
          let sum = 0
          for (let i = 0; i < range.count; i++) {
            const connIdx = range.start + i
            const sourceVertex = conn.sourceIndices[connIdx]

            const sourceValue = sourceVertex.cache.generation === currentGen
              ? sourceVertex.cache.value
              : (sourceVertex.tick ? sourceVertex.tick() : 0)

            sum += sourceValue * conn.weightsTyped[connIdx]
          }

          // Add bias and apply activation
          const input = sum + conn.biases[vIdx]
          output = activation(input)

          // Cache neuron value
          vertex.cache.generation = currentGen
          vertex.cache.value = output
        }

        // Store in layer output buffer for potential future use
        if (output !== undefined) {
          conn.outputs[vIdx] = output
        }
      }
    }
  }

  tick() {
    // Increment generation for cache invalidation
    this.tickGeneration++
    const currentGen = this.tickGeneration

    // Apply sensor attributes before processing (only if present)
    if (this._features.hasSensorAttributes) {
      this.applySensorAttributes()
    }

    // V3 ULTRA-OPTIMIZED: Use JIT-compiled function for maximum speed
    if (this.useJIT && this.jitTickFunction) {
      // JIT path: Zero overhead, fully specialized code
      const cache = {}
      const result = this.jitTickFunction(
        this,
        this.sensors,         // Pass sensors map (by name)
        Object.values(this.actions),
        this.actions,         // Pass actions map (by name)
        cache,
        this.activationFunction
      )

      // Update vertex caches from JIT results
      for (const [name, value] of Object.entries(cache)) {
        const vertex = this.definitions.all[name]
        if (vertex) {
          vertex.cache.generation = currentGen
          vertex.cache.value = value
        }
      }

      // Apply post-processing if needed
      if (this._features) {
        const maxAction = result && Object.keys(result)[0]
        if (maxAction && this._features.hasActionAttributes) {
          const actionVertex = this.definitions.actions[maxAction.substring(2)]
          if (actionVertex) {
            this.applyActionAttributes({ vertex: actionVertex, input: cache[maxAction] }, currentGen)
          }
        }

        if (this._features.hasLearning) {
          this.applyLearningRules(currentGen)
        }

        if (this._features.hasMemory) {
          this.updateMemoryCells()
        }
      }

      return result
    }

    // V3 Optimized: Use layered batch processing for large networks
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
    const actionsInputs = []

    for (const action of Object.values(this.definitions.actions)) {
      if (action.in.length === 0) continue

      // Use cached input if available (from layered processing), otherwise calculate
      const input = (action.cache.generation === currentGen && action.cache.input !== undefined)
        ? action.cache.input
        : action.calculateInput(currentGen)

      actionsInputs.push({ input, vertex: action })
    }

    if (actionsInputs.length === 0) return ticked

    // Find max action
    let maxAction = actionsInputs[0]
    for (let i = 1; i < actionsInputs.length; i++) {
      if (actionsInputs[i].input > maxAction.input) {
        maxAction = actionsInputs[i]
      }
    }

    // Apply action attributes before execution (only if present)
    if (this._features.hasActionAttributes) {
      this.applyActionAttributes(maxAction, currentGen)
    }

    // Execute the winning action
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
  applySensorAttributes() {
    if (!this.attributes.length) return

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
  }

  /**
   * Apply attribute influences to actions
   */
  applyActionAttributes(maxAction, currentGen) {
    if (!this.attributes.length) return
    if (!maxAction) return

    const actionVertex = maxAction.vertex
    const actionId = actionVertex.metadata.id

    for (const attr of this.attributes) {
      // Check if attribute affects this action
      if (!AttributeBase.affectsTarget(attr, 'action', actionId)) {
        continue
      }

      // Get action name from attribute ID
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
}
