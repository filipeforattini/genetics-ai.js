import {
  Generation,
  Individual,
  Genome,
  MemoryCellBase,
  LearningRuleBase,
  PlasticityBase,
  EvolvedNeuronBase,
  AttributeBase,
  ModuleBase,
  sparkline
} from '../../../src/index.js'
import fs from 'fs'
import path from 'node:path'
import { fileURLToPath } from 'node:url'
import { ReplaySnakeAI, watchSnake as watchSnakeHUD, configureReplayEnvironment } from './snake-replay.js'

const CONFIG_PATH = new URL('./snake-config.json', import.meta.url)
const CHAMPION_PATH = new URL('./snake-champion.json', import.meta.url)
const CHAMPION_FILE = fileURLToPath(CHAMPION_PATH)
// Advanced feature switches. Edit here or create docs/examples/games/snake-config.json
// to override. programmableNeurons stays off by default for predictable runs.
const DEFAULT_FEATURES = {
  memory: true,
  plasticity: true,
  learning: true,
  programmableNeurons: false,
  attributes: true,
  modules: false
}

/**
 * 🐍 SNAKE AI - Neural Network learns to play Snake!
 *
 * Grid: 10×10
 * Goal: Learn to navigate and eat food while avoiding walls and self-collision
 *
 * Run: node docs/examples/games/snake.js
 * Watch: node docs/examples/games/snake.js --watch
 */

const GRID_SIZE_DEFAULT = 10
let GRID_SIZE = GRID_SIZE_DEFAULT
let TOTAL_TILES = GRID_SIZE * GRID_SIZE
const MAX_STEPS = 500  // Maximum steps per game
const LEVEL5_GRID_SEQUENCE = [9, 10, 11, 12, 13, 14, 15]
let LEVEL5_GRID_INDEX = 0

function setGridSize(size) {
  const normalized = Number.isFinite(size) ? Math.max(4, Math.floor(size)) : GRID_SIZE_DEFAULT
  GRID_SIZE = normalized
  TOTAL_TILES = GRID_SIZE * GRID_SIZE
}

function resetLevel5GridCycle() {
  LEVEL5_GRID_INDEX = 0
}

function getStartingHeadPosition() {
  const x = Math.min(Math.max(1, Math.floor(GRID_SIZE / 2)), GRID_SIZE - 2)
  const y = Math.min(Math.max(1, Math.floor(GRID_SIZE / 2)), GRID_SIZE - 3)
  return { x, y }
}

function getStartingSnakeSegments() {
  const head = getStartingHeadPosition()
  const body = [
    { x: head.x, y: head.y + 1 },
    { x: head.x, y: head.y + 2 }
  ]
  return { head, body }
}

const CURRICULUM_OFFSETS = {
  1: [
    { dx: 0, dy: -1 },
    { dx: 0, dy: -2 },
    { dx: 0, dy: -3 },
    { dx: 0, dy: -2 },
    { dx: 0, dy: -1 }
  ],
  2: [
    { dx: 0, dy: -2 },
    { dx: 0, dy: -3 },
    { dx: 0, dy: -4 },
    { dx: 0, dy: -5 },
    { dx: -3, dy: 0 },
    { dx: 3, dy: 0 },
    { dx: 0, dy: 3 },
    { dx: -2, dy: -2 },
    { dx: 2, dy: -2 },
    { dx: -2, dy: 2 },
    { dx: 2, dy: 2 }
  ],
  3: [
    { dx: 0, dy: -4 },
    { dx: -3, dy: -3 },
    { dx: 3, dy: -3 },
    { dx: -4, dy: 0 },
    { dx: 4, dy: 0 },
    { dx: -3, dy: 3 },
    { dx: 3, dy: 3 },
    { dx: 0, dy: 4 }
  ]
}

const CURRICULUM_AVG_FOOD_REQUIREMENTS = {
  1: 4,
  2: 5,
  3: 6
}

const CURRICULUM_WARMUP_RUNS = {
  2: 3,
  3: 2
}

function isWithinGrid(x, y) {
  return x >= 0 && x < GRID_SIZE && y >= 0 && y < GRID_SIZE
}

function getCurriculumScript(level) {
  const offsets = CURRICULUM_OFFSETS[level]
  if (!offsets || offsets.length === 0) {
    return []
  }
  const { head } = getStartingSnakeSegments()
  const anchor = head
  return offsets
    .map(({ dx, dy }) => ({ x: anchor.x + dx, y: anchor.y + dy }))
    .filter(pos => isWithinGrid(pos.x, pos.y))
}

function getArgValue(flag) {
  const prefix = `${flag}=`
  const direct = process.argv.find(arg => arg.startsWith(prefix))
  if (direct) return direct.slice(prefix.length)
  const index = process.argv.indexOf(flag)
  if (index !== -1 && process.argv[index + 1] && !process.argv[index + 1].startsWith('--')) {
    return process.argv[index + 1]
  }
  return null
}

function getNumericArg(...flags) {
  for (const flag of flags) {
    const value = getArgValue(flag)
    if (value != null) {
      const parsed = Number(value)
      if (Number.isFinite(parsed) && parsed > 0) {
        return parsed
      }
    }
  }
  return null
}

const CLI_MAX_GENERATIONS = getNumericArg('--max-generations', '--generations')
const GENERATIONS = CLI_MAX_GENERATIONS ?? Infinity
const FITNESS_RUNS = Number(process.env.SNAKE_RUNS) || 5
const ACTION_COUNT = 3
const BASE_NEURON_COUNT = 50
const POPULATION_SIZE = Number(process.env.SNAKE_POPULATION) || 300
const WARM_START_CHAMPION_CLONES = 0  // set >0 if you want to seed champions again
const ENABLE_ADVANCED_BASES = true

// 24 directional sensors: 8 rays relative to heading × 3 channels (wall, food, body)
// Ray order (clockwise from forward): fwd, fwd-R, R, back-R, back, back-L, L, fwd-L
const RAY_NAMES = ['Fwd', 'FwdR', 'R', 'BackR', 'Back', 'BackL', 'L', 'FwdL']
const SENSOR_NAMES = [
  ...RAY_NAMES.map(n => `Wall ${n}`),
  ...RAY_NAMES.map(n => `Food ${n}`),
  ...RAY_NAMES.map(n => `Body ${n}`)
]

const SENSOR_COUNT = SENSOR_NAMES.length

const ADVANCED_BASE_THRESHOLDS = {
  memoryCells: 4,
  plasticities: 4,
  learningRules: 5,
  evolvedNeurons: 2,
  attributes: 3,
  modules: 0,
  attributeIds: 16,
  moduleGenomeSize: 160,
  moduleNeurons: 28
}

// CURRICULUM LEARNING: Progressive difficulty levels
let CURRICULUM_LEVEL = 1  // Start easy, increase gradually
let LEVEL_SEED_EPOCH = 0

function mulberry32(seed) {
  let t = seed >>> 0
  return function() {
    t += 0x6D2B79F5
    let res = Math.imul(t ^ (t >>> 15), 1 | t)
    res ^= res + Math.imul(res ^ (res >>> 7), 61 | res)
    return ((res ^ (res >>> 14)) >>> 0) / 4294967296
  }
}

function hashSeed(generationIndex, runIndex, curriculumLevel) {
  let seed = 0x9E3779B9
  seed ^= (generationIndex + 1) * 0x85EBCA6B
  seed = Math.imul(seed, 0x27D4EB2D)
  seed ^= (runIndex + 1) * 0x165667B1
  seed = Math.imul(seed, 0x9E3779B9)
  seed ^= (curriculumLevel + 1) * 0x85EBCA77
  return seed >>> 0
}

function clamp(value, min = -Infinity, max = Infinity) {
  if (!Number.isFinite(value)) {
    return 0
  }
  if (value < min) return min
  if (value > max) return max
  return value
}

function appendBase(genome, buffer) {
  genome.buffer.append(buffer)
  genome._basesCache = null
  genome._basePositions = null
}

function ensureAdvancedBases(genome, context = {}) {
  if (!ENABLE_ADVANCED_BASES) {
    return genome
  }

  const neurons = context.neurons ?? BASE_NEURON_COUNT
  const sensors = context.sensors ?? SENSOR_COUNT
  const actions = context.actions ?? ACTION_COUNT
  const features = {
    memory: context.features?.memory ?? DEFAULT_FEATURES.memory,
    plasticity: context.features?.plasticity ?? DEFAULT_FEATURES.plasticity,
    learning: context.features?.learning ?? DEFAULT_FEATURES.learning,
    programmableNeurons: context.features?.programmableNeurons ?? DEFAULT_FEATURES.programmableNeurons,
    attributes: context.features?.attributes ?? DEFAULT_FEATURES.attributes,
    modules: context.features?.modules ?? DEFAULT_FEATURES.modules
  }

  const requirements = {
    memoryCells: context.memoryCells ?? ADVANCED_BASE_THRESHOLDS.memoryCells,
    plasticities: context.plasticities ?? ADVANCED_BASE_THRESHOLDS.plasticities,
    learningRules: context.learningRules ?? ADVANCED_BASE_THRESHOLDS.learningRules,
    evolvedNeurons: context.evolvedNeurons ?? ADVANCED_BASE_THRESHOLDS.evolvedNeurons,
    attributes: context.attributes ?? ADVANCED_BASE_THRESHOLDS.attributes,
    modules: context.modules ?? ADVANCED_BASE_THRESHOLDS.modules,
    attributeIds: context.attributeIds ?? ADVANCED_BASE_THRESHOLDS.attributeIds,
    moduleGenomeSize: context.moduleGenomeSize ?? ADVANCED_BASE_THRESHOLDS.moduleGenomeSize,
    moduleNeurons: context.moduleNeurons ?? ADVANCED_BASE_THRESHOLDS.moduleNeurons
  }

  // Safety cap: some advanced base encodings can be corrupted by subsequent
  // appends (re-parsed as a different type). Without this cap a failing
  // generator would loop forever. Bails after target*8 attempts and logs once.
  const warned = new Set()
  const ensureCount = (type, target, generator) => {
    const desired = Math.max(0, target)
    const maxAttempts = Math.max(1, desired * 8)
    let attempts = 0
    while (genome.countBasesByType(type) < desired && attempts < maxAttempts) {
      appendBase(genome, generator())
      attempts++
    }
    // Post-mutation genomes sometimes lose advanced bases to bit flips that
    // misalign the variable-length encoding. Surface only under SNAKE_DEBUG_BASES;
    // in normal training we just move on with whatever count we reached.
    if (attempts >= maxAttempts && !warned.has(type) && process.env.SNAKE_DEBUG_BASES) {
      warned.add(type)
      const got = genome.countBasesByType(type)
      console.warn(`[ensureAdvancedBases] ${type} at ${got}/${desired} after ${attempts} attempts`)
    }
  }

  if (features.memory) {
    ensureCount('memory_cell', requirements.memoryCells, () =>
      MemoryCellBase.randomBinary({ maxCells: neurons })
    )
  }

  if (features.plasticity) {
    ensureCount('plasticity', requirements.plasticities, () =>
      PlasticityBase.randomBinary({ neurons })
    )
  }

  if (features.learning) {
    ensureCount('learning_rule', requirements.learningRules, () =>
      LearningRuleBase.randomBinary({
        maxConnections: Math.max(genome.countBasesByType('connection'), 1)
      })
    )
  }

  if (features.attributes) {
    ensureCount('attribute', requirements.attributes, () =>
      AttributeBase.randomBinary({
        maxAttributes: requirements.attributeIds,
        sensors,
        neurons,
        actions
      })
    )
  }

  if (features.programmableNeurons) {
    ensureCount('evolved_neuron', requirements.evolvedNeurons, () =>
      EvolvedNeuronBase.randomBinary({ minOps: 4, maxOps: 10 })
    )
  }

  if (features.modules && requirements.modules > 0) {
    while (genome.countBasesByType('module') < requirements.modules) {
      const moduleGenome = Genome.randomWith(
        Math.max(40, requirements.moduleGenomeSize),
        {
          neurons: Math.min(requirements.moduleNeurons, neurons),
          sensors,
          actions,
          attributes: features.attributes
            ? Math.min(requirements.attributeIds, 32)
            : 0
        }
      )

      ensureAdvancedBases(moduleGenome, {
        neurons: Math.max(8, Math.min(requirements.moduleNeurons, neurons)),
        sensors,
        actions,
        memoryCells: Math.max(2, Math.floor(requirements.memoryCells / 2)),
        plasticities: Math.max(2, Math.floor(requirements.plasticities / 2)),
        learningRules: Math.max(2, Math.floor(requirements.learningRules / 2)),
        evolvedNeurons: Math.max(1, Math.floor(requirements.evolvedNeurons / 2)),
        attributes: Math.max(2, Math.floor(requirements.attributes / 2)),
        modules: 0,
        attributeIds: requirements.attributeIds,
        moduleGenomeSize: Math.max(20, Math.floor(requirements.moduleGenomeSize / 2)),
        moduleNeurons: Math.max(8, Math.floor(requirements.moduleNeurons / 2)),
        features
      })

      appendBase(
        genome,
        ModuleBase.fromGenome(Math.floor(Math.random() * 256), moduleGenome.buffer)
      )
    }
  }
}

function prepareGenome(baseGenome, context) {
  const genome = Genome.from(baseGenome)
  ensureAdvancedBases(genome, context)
  return genome
}

function createSnakeFromGenome(genome, context) {
  return new SnakeAI({
    genome,
    neurons: context.neurons ?? BASE_NEURON_COUNT
  })
}

function rebuildPopulationWithAdvancedGenomes(gen, context) {
  for (let i = 0; i < gen.population.length; i++) {
    const preparedGenome = prepareGenome(gen.population[i].genome, context)
    gen.population[i] = createSnakeFromGenome(preparedGenome, context)
  }
}

function fillGenerationWithAdvancedBases(gen, context, { reset = true } = {}) {
  if (reset) {
    gen.population = []
    gen.meta.randoms = 0
  }

  const startTime = Date.now()
  while (gen.population.length < gen.size) {
    const baseGenome = Genome.randomWith(gen.individualGenomeSize, {
      neurons: context.neurons,
      sensors: context.sensors,
      actions: context.actions,
      attributes: (context.features?.attributes ?? true)
        ? ADVANCED_BASE_THRESHOLDS.attributes * 2
        : 0
    })
    const prepared = prepareGenome(baseGenome, context)
    gen.add(prepared)
    gen.meta.randoms += 1

    if (gen.population.length === 1) {
      console.log(`     ... first genome ready (${Date.now() - startTime}ms)`)
    }
    if (gen.population.length % 25 === 0 || gen.population.length === gen.size) {
      const percent = Math.floor((gen.population.length / gen.size) * 100)
      console.log(`     ... generated ${gen.population.length}/${gen.size} snakes (${percent}%) [${Date.now() - startTime}ms]`)
    }
  }
  console.log(`     ... total genome prep time: ${Date.now() - startTime}ms`)
}

class SnakeAI extends Individual {
  // ⚡ PERFORMANCE: Static direction mappings (evita recriação e lookups)
  static DIRECTION_VECTORS = {
    up: { dx: 0, dy: -1 },
    down: { dx: 0, dy: 1 },
    left: { dx: -1, dy: 0 },
    right: { dx: 1, dy: 0 }
  }

  static DIRECTION_ORDER = ['up', 'right', 'down', 'left']

  static DIRECTION_INDEX = {
    up: 0,
    right: 1,
    down: 2,
    left: 3
  }

  // Ray offsets clockwise from forward, per heading (up/right/down/left).
  // Order: [fwd, fwdR, R, backR, back, backL, L, fwdL]
  static RAY_OFFSETS_BY_HEADING = {
    0: [[0, -1], [1, -1], [1, 0], [1, 1], [0, 1], [-1, 1], [-1, 0], [-1, -1]],
    1: [[1, 0], [1, 1], [0, 1], [-1, 1], [-1, 0], [-1, -1], [0, -1], [1, -1]],
    2: [[0, 1], [-1, 1], [-1, 0], [-1, -1], [0, -1], [1, -1], [1, 0], [1, 1]],
    3: [[-1, 0], [-1, -1], [0, -1], [1, -1], [1, 0], [1, 1], [0, 1], [-1, 1]]
  }

  constructor(options) {
    const rayTick = (channel, rayIdx) => () => this.castRay(rayIdx)[channel]
    const sensorTicks = []
    for (let r = 0; r < 8; r++) sensorTicks.push({ id: r, tick: rayTick('wall', r) })
    for (let r = 0; r < 8; r++) sensorTicks.push({ id: r + 8, tick: rayTick('food', r) })
    for (let r = 0; r < 8; r++) sensorTicks.push({ id: r + 16, tick: rayTick('body', r) })

    super({
      ...options,
      sensors: sensorTicks,
      actions: [
        { id: 0, tick: () => this.turn('forward') },   // Continue straight
        { id: 1, tick: () => this.turn('left') },      // Turn left 90°
        { id: 2, tick: () => this.turn('right') }      // Turn right 90°
      ]
    })

    // Initialize default values to prevent errors
    const { head, body } = getStartingSnakeSegments()
    this.head = { ...head }
    this.food = { x: head.x, y: Math.max(0, head.y - 2) }
    this.snake = [head, ...body]
    this.visited = new Set(this.snake.map(seg => `${seg.x},${seg.y}`))
    // ⚡ PERFORMANCE: Initialize Set for O(1) lookups
    this.snakeSet = new Set()
    this.deathReason = null  // Track why snake died
    this.cachedFitness = undefined
    this.cachedStats = null
    this._rng = null
    this.evaluationSeeds = null
    this.curriculumSequenceIndex = 0
    this.curriculumSequenceOffset = 0
    this.stepsSinceFood = 0
    this.bestStepsToFood = 1
    this.isCloserThisStep = 0
    this.prevDistanceToFood = null
    this.foodDelta = 0
    this.foodTrend = 0
    this.prevStepsRatio = 0
    this.stepsTrend = 0
    this.curvature = 0
    this.lastTurnDelta = 0
    this.explorationDelta = 0
    this.prevExplorationRatio = 0
    this._spatialCache = null
    this._spatialCacheStamp = -1
    this.activeGridSize = GRID_SIZE
    this.lastGridSizeUsed = GRID_SIZE

    // ⚡ PERFORMANCE: Cache direction index para evitar indexOf() repetidos
    this.directionIndex = 0  // up=0, right=1, down=2, left=3

    // Cache para sensores que mudam raramente
    this._cachedWallDistances = null
    this._cachedWallDistancesStamp = -1
    this._corridorCache = null
    this._localFreeCache = { radius1: null, radius2: null, stamp: -1 }
  }

  applyCurriculumGrid() {
    let nextSize = GRID_SIZE_DEFAULT
    if (CURRICULUM_LEVEL === 5) {
      const sequenceLength = LEVEL5_GRID_SEQUENCE.length
      const index = LEVEL5_GRID_INDEX % sequenceLength
      nextSize = LEVEL5_GRID_SEQUENCE[index]
      LEVEL5_GRID_INDEX = (index + 1) % sequenceLength
    }

    setGridSize(nextSize)
    this.activeGridSize = nextSize
    this.lastGridSizeUsed = nextSize
  }

  reset() {
    this.activeGridSize = GRID_SIZE
    this.lastGridSizeUsed = GRID_SIZE
    const { head, body } = getStartingSnakeSegments()
    this.snake = [{ ...head }, ...body.map(seg => ({ ...seg }))]
    this.head = this.snake[0]
    this.direction = 'up'
    this.directionIndex = 0  // ⚡ PERFORMANCE: Cache direction index (up=0)

    // ⚡ PERFORMANCE: O(1) lookup for snake positions
    this.snakeSet = new Set(this.snake.map(seg => `${seg.x},${seg.y}`))

    // CURRICULUM: First food position depends on difficulty level
    this.food = this.spawnFoodCurriculum(true)  // true = first food

    this.foodEaten = 0
    this.steps = 0
    this.alive = true
    this.visited = new Set()
    this.closestToFood = Infinity
    this.lastDistance = Math.abs(this.food.x - this.head.x) + Math.abs(this.food.y - this.head.y)
    this.stepsCloser = 0
    this.stepsFarther = 0
    this.deathReason = null

    // ⏱️ TIME-DECAY: Track steps with current food
    this.stepsWithCurrentFood = 0
    this.foodValues = []  // Store value of each food when eaten
    this.cachedFitness = undefined
    this.cachedStats = null
    this.curriculumSequenceIndex = this.curriculumSequenceOffset || 0
    this.stepsSinceFood = 0
    this.bestStepsToFood = 1
    this.prevDistanceToFood = this.getDistanceToFood()
    this.isCloserThisStep = 0
    this.foodDelta = 0
    this.foodTrend = 0
    this.prevStepsRatio = 0
    this.stepsTrend = 0
    this.curvature = 0
    this.lastTurnDelta = 0
    this.invalidateSpatialCache()
  }

  setEvaluationSeeds(seeds = []) {
    this.evaluationSeeds = Array.isArray(seeds) ? [...seeds] : []
    this.cachedFitness = undefined
    this.cachedStats = null
    this.curriculumSequenceOffset = 0
  }

  setRandomSeed(seed) {
    if (typeof seed === 'number' && Number.isFinite(seed)) {
      const normalized = (seed >>> 0) || 1
      this._rng = mulberry32(normalized)
    } else {
      this._rng = null
    }
  }

  _random() {
    return this._rng ? this._rng() : Math.random()
  }

  spawnFoodCurriculum(isFirstFood = false) {
    // CURRICULUM LEARNING: Progressive difficulty
    if (CURRICULUM_LEVEL === 1 && this.head) {
      const forward = this.getDirectionVector()
      if (forward) {
        const distances = [1, 2, 3, 4]
        for (let i = 0; i < distances.length; i++) {
          const steps = distances[i]
          const candidate = {
            x: this.head.x + forward.dx * steps,
            y: this.head.y + forward.dy * steps
          }
          if (isWithinGrid(candidate.x, candidate.y) && !this.isOnSnake(candidate.x, candidate.y)) {
            this.curriculumSequenceIndex = (i + 1) % distances.length
            return candidate
          }
        }
      }
    }

    const candidates = getCurriculumScript(CURRICULUM_LEVEL)
    if (candidates.length > 0) {
      for (let offset = 0; offset < candidates.length; offset++) {
        const idx = (this.curriculumSequenceIndex + offset) % candidates.length
        const candidate = candidates[idx]
        if (!this.isOnSnake(candidate.x, candidate.y)) {
          this.curriculumSequenceIndex = (idx + 1) % candidates.length
          return candidate
        }
      }
      this.curriculumSequenceIndex = (this.curriculumSequenceIndex + 1) % candidates.length
    }

    return this.spawnFood()
  }

  spawnFood() {
    const script = getCurriculumScript(CURRICULUM_LEVEL)
    if (script.length > 0) {
      const attempts = script.length
      for (let i = 0; i < attempts; i++) {
        const idx = (this.curriculumSequenceIndex + i) % script.length
        const candidate = script[idx]
        if (!this.isOnSnake(candidate.x, candidate.y)) {
          this.curriculumSequenceIndex = idx + 1
          return { x: candidate.x, y: candidate.y }
        }
      }
    }

    let food
    let attempts = 0
    do {
      food = {
        x: Math.floor(this._random() * GRID_SIZE),
        y: Math.floor(this._random() * GRID_SIZE)
      }
      attempts++
    } while (this.isOnSnake(food.x, food.y) && attempts < 100)
    return food
  }

  isOnSnake(x, y) {
    // ⚡ PERFORMANCE: O(1) Set lookup instead of O(n) array scan
    // Defensive: if Set not initialized yet, build it on-the-fly
    if (!this.snakeSet) {
      this.snakeSet = new Set(this.snake.map(seg => `${seg.x},${seg.y}`))
    }
    return this.snakeSet.has(`${x},${y}`)
  }

  // 8-direction raycast relative to current heading. Returns {wall, food, body}
  // per ray, each as 1/steps_to_target (0 if not seen before wall).
  castRay(rayIdx) {
    // Individual's brain build invokes sensor ticks before reset() runs,
    // so directionIndex/head may still be undefined on first call.
    const dirIdx = this.directionIndex
    if (!this.head || !Number.isInteger(dirIdx) || dirIdx < 0 || dirIdx > 3) {
      return { wall: 0, food: 0, body: 0 }
    }
    const stamp = this.steps ?? 0
    // Initialize or refresh the ray cache. `_rayCache` can be undefined on
    // the very first call (constructor defers allocation).
    if (!this._rayCache || this._rayCacheStamp !== stamp) {
      this._rayCacheStamp = stamp
      this._rayCache = new Array(8)
    }
    const cached = this._rayCache[rayIdx]
    if (cached !== undefined) return cached

    const offsets = SnakeAI.RAY_OFFSETS_BY_HEADING[dirIdx]
    const [dx, dy] = offsets[rayIdx]
    let x = this.head.x
    let y = this.head.y
    let steps = 0
    let food = 0
    let body = 0

    while (true) {
      steps++
      x += dx
      y += dy
      if (x < 0 || x >= GRID_SIZE || y < 0 || y >= GRID_SIZE) {
        const result = { wall: 1 / steps, food, body }
        this._rayCache[rayIdx] = result
        return result
      }
      if (food === 0 && this.food && x === this.food.x && y === this.food.y) {
        food = 1 / steps
      }
      if (body === 0 && this.isOnSnake(x, y)) {
        body = 1 / steps
      }
    }
  }

  invalidateSpatialCache() {
    this._spatialCache = null
    this._spatialCacheStamp = -1
    this._rayCacheStamp = -1
    this._rayCache = null
  }

  getSpatialCache() {
    const stamp = this.steps
    if (this._spatialCache && this._spatialCacheStamp === stamp) {
      return this._spatialCache
    }

    const normDenom = Math.max(1, GRID_SIZE - 1)
    const head = this.head ?? { x: 0, y: 0 }
    const food = this.food ?? head

    const headNorm = {
      x: head.x / normDenom,
      y: head.y / normDenom
    }

    const foodNorm = {
      x: food.x / normDenom,
      y: food.y / normDenom
    }

    const foodProjection = this.getFoodProjection()
    const foodOffset = this.getFoodOffset()
    const heading = this.getHeadingTrig()
    const facing = this.getFacingTrig()
    const foodDistance = this.getFoodDistanceRatio()
    const foodDelta = this.foodDelta ?? 0
    const foodTrend = this.foodTrend ?? 0
    const stepsSince = this.getStepsSinceFoodRatio()
    const stepsTrend = this.stepsTrend ?? 0
    const foodValue = this.getFoodValueRatio()

    const freeDistances = {
      forward: this.getDirectionalFreeRatio('forward', 5),
      left: this.getDirectionalFreeRatio('left', 5),
      right: this.getDirectionalFreeRatio('right', 5)
    }

    const corridors = {
      forward: this.getDirectionalCorridor('forward', 6, 1),
      left: this.getDirectionalCorridor('left', 6, 1),
      right: this.getDirectionalCorridor('right', 6, 1)
    }

    const wallDistances = this.computeWallDistances()
    const bodyDensity = this.computeBodyDensity()
    const localFree = {
      radius1: this.getLocalFreeRatio(1),
      radius2: this.getLocalFreeRatio(2)
    }

    const curvature = clamp(this.curvature ?? 0, -1, 1)
    const danger = {
      forward: this.getImmediateDanger('forward'),
      left: this.getImmediateDanger('left'),
      right: this.getImmediateDanger('right')
    }
    const explorationRatio = (this.visited ? this.visited.size : 0) / Math.max(1, TOTAL_TILES)
    const explorationDelta = this.explorationDelta ?? 0

    this._spatialCache = {
      headNorm,
      foodNorm,
      foodOffset,
      foodProjection,
      heading,
      facing,
      foodDistance,
      foodDelta,
      foodTrend,
      stepsSince,
      stepsTrend,
      foodValue,
      freeDistances,
      corridors,
      wallDistances,
      bodyDensity,
      localFree,
      curvature,
      danger,
      explorationDelta,
      explorationRatio
    }
    this._spatialCacheStamp = stamp
    return this._spatialCache
  }

  getStepsSinceFoodRatio() {
    const denom = Math.max(1, this.bestStepsToFood)
    return Math.min(1, this.stepsSinceFood / denom)
  }

  getDirectionVector(dir = this.direction) {
    // ⚡ PERFORMANCE: Use static mapping ao invés de switch
    return SnakeAI.DIRECTION_VECTORS[dir] || { dx: 0, dy: 0 }
  }

  getPerpendicularVector(vector) {
    return { dx: -vector.dy, dy: vector.dx }
  }

  getFoodProjection() {
    if (!this.head || !this.food) {
      return { forward: 0, side: 0 }
    }
    const forward = this.getDirectionVector()
    const perp = this.getPerpendicularVector(forward)
    const toFood = {
      x: this.food.x - this.head.x,
      y: this.food.y - this.head.y
    }
    const denom = Math.max(1, GRID_SIZE - 1)
    const forwardComponent = (toFood.x * forward.dx + toFood.y * forward.dy) / denom
    const sideComponent = (toFood.x * perp.dx + toFood.y * perp.dy) / denom
    return {
      forward: clamp(forwardComponent, -1, 1),
      side: clamp(sideComponent, -1, 1)
    }
  }

  getFoodOffset() {
    if (!this.head || !this.food) {
      return { dx: 0, dy: 0 }
    }
    const denom = Math.max(1, GRID_SIZE - 1)
    return {
      dx: clamp((this.food.x - this.head.x) / denom, -1, 1),
      dy: clamp((this.food.y - this.head.y) / denom, -1, 1)
    }
  }

  getHeadingTrig() {
    const v = this.getDirectionVector()
    return { cos: v.dx, sin: v.dy }
  }

  getFacingTrig() {
    if (!this.head || !this.food) {
      return { cos: 0, sin: 0 }
    }
    const forward = this.getDirectionVector()
    const perp = this.getPerpendicularVector(forward)
    const dx = this.food.x - this.head.x
    const dy = this.food.y - this.head.y
    const length = Math.hypot(dx, dy)
    if (length === 0) {
      return { cos: 1, sin: 0 }
    }
    const nx = dx / length
    const ny = dy / length
    return {
      cos: clamp(nx * forward.dx + ny * forward.dy, -1, 1),
      sin: clamp(nx * perp.dx + ny * perp.dy, -1, 1)
    }
  }

  computeWallDistances() {
    if (!this.head) {
      return { north: 0, south: 0, east: 0, west: 0 }
    }

    // ⚡ PERFORMANCE: Cache wall distances (só muda quando cabeça move)
    const stamp = this.steps
    if (this._cachedWallDistances && this._cachedWallDistancesStamp === stamp) {
      return this._cachedWallDistances
    }

    const denom = Math.max(1, GRID_SIZE - 1)
    const result = {
      north: this.head.y / denom,
      south: (GRID_SIZE - 1 - this.head.y) / denom,
      east: (GRID_SIZE - 1 - this.head.x) / denom,
      west: this.head.x / denom
    }

    this._cachedWallDistances = result
    this._cachedWallDistancesStamp = stamp
    return result
  }

  computeBodyDensity() {
    if (!this.head || this.snake.length <= 1) {
      return { front: 0, back: 0, left: 0, right: 0 }
    }
    const forward = this.getDirectionVector()
    const perp = this.getPerpendicularVector(forward)
    let front = 0
    let back = 0
    let left = 0
    let right = 0
    const denom = Math.max(1, this.snake.length - 1)
    for (let i = 1; i < this.snake.length; i++) {
      const seg = this.snake[i]
      if (!seg) continue
      const relX = seg.x - this.head.x
      const relY = seg.y - this.head.y
      const forwardProj = relX * forward.dx + relY * forward.dy
      const sideProj = relX * perp.dx + relY * perp.dy
      if (forwardProj >= 0) front++
      else back++
      if (sideProj >= 0) right++
      else left++
    }
    return {
      front: front / denom,
      back: back / denom,
      left: left / denom,
      right: right / denom
    }
  }

  getDirectionalFreeRatio(relDir, limit = 5) {
    const delta = this.getDirectionDelta(relDir)
    if (!delta || !this.head) return 0
    let freeCount = 0
    let x = this.head.x
    let y = this.head.y
    for (let i = 0; i < limit; i++) {
      x += delta.dx
      y += delta.dy
      if (x < 0 || x >= GRID_SIZE || y < 0 || y >= GRID_SIZE) break
      if (this.isOnSnake(x, y)) break
      freeCount++
    }
    return freeCount / Math.max(1, limit)
  }

  getImmediateDanger(relDir) {
    const delta = this.getDirectionDelta(relDir)
    if (!delta || !this.head) return 0
    const x = this.head.x + delta.dx
    const y = this.head.y + delta.dy
    if (x < 0 || x >= GRID_SIZE || y < 0 || y >= GRID_SIZE) return 1
    return this.isOnSnake(x, y) ? 1 : 0
  }

  getDirectionalCorridor(relDir, depth = 6, halfWidth = 1) {
    const delta = this.getDirectionDelta(relDir)
    if (!delta || !this.head) return 0

    // ⚡ PERFORMANCE: Cache corridor checks (caros com nested loops)
    const cacheKey = `${relDir}_${this.steps}`
    if (this._corridorCache?.[cacheKey] !== undefined) {
      return this._corridorCache[cacheKey]
    }

    const perp = this.getPerpendicularVector(delta)
    let minRatio = 1
    for (let step = 1; step <= depth; step++) {
      let free = 0
      let total = 0
      const baseX = this.head.x + delta.dx * step
      const baseY = this.head.y + delta.dy * step
      for (let offset = -halfWidth; offset <= halfWidth; offset++) {
        const x = baseX + perp.dx * offset
        const y = baseY + perp.dy * offset
        if (x < 0 || x >= GRID_SIZE || y < 0 || y >= GRID_SIZE) {
          total++
          continue
        }
        total++
        if (!this.isOnSnake(x, y)) {
          free++
        }
      }
      if (total === 0) continue
      const ratio = free / total
      minRatio = Math.min(minRatio, ratio)
      if (minRatio === 0) break  // ⚡ Early exit
    }

    if (!this._corridorCache) this._corridorCache = {}
    this._corridorCache[cacheKey] = minRatio
    return minRatio
  }

  getDirectionDelta(relDir) {
    if (!this.head) return null
    // ⚡ PERFORMANCE: Use cached directionIndex ao invés de indexOf()
    let targetIndex = this.directionIndex
    if (relDir === 'left') targetIndex = (this.directionIndex + 3) % 4
    else if (relDir === 'right') targetIndex = (this.directionIndex + 1) % 4
    else if (relDir === 'back') targetIndex = (this.directionIndex + 2) % 4
    // 'forward' keeps targetIndex = this.directionIndex

    const targetDir = SnakeAI.DIRECTION_ORDER[targetIndex]
    return SnakeAI.DIRECTION_VECTORS[targetDir]
  }

  getLocalFreeRatio(radius) {
    if (!this.head) return 0

    // ⚡ PERFORMANCE: Cache local free checks
    const stamp = this.steps
    if (this._localFreeCache.stamp === stamp) {
      if (radius === 1 && this._localFreeCache.radius1 !== null) {
        return this._localFreeCache.radius1
      }
      if (radius === 2 && this._localFreeCache.radius2 !== null) {
        return this._localFreeCache.radius2
      }
    } else {
      // Reset cache on new step
      this._localFreeCache = { radius1: null, radius2: null, stamp }
    }

    let free = 0
    let total = 0

    // ⚡ OPTIMIZATION: Reuse radius=1 computation for radius=2
    if (radius === 2 && this._localFreeCache.radius1 !== null) {
      // Start with radius=1 results
      free = this._localFreeCache.radius1Data.free
      total = this._localFreeCache.radius1Data.total

      // Only scan outer ring (radius=2 minus radius=1)
      for (let dx = -2; dx <= 2; dx++) {
        for (let dy = -2; dy <= 2; dy++) {
          if (Math.abs(dx) < 2 && Math.abs(dy) < 2) continue  // Skip inner (radius=1)
          if (dx === 0 && dy === 0) continue
          const x = this.head.x + dx
          const y = this.head.y + dy
          if (x < 0 || x >= GRID_SIZE || y < 0 || y >= GRID_SIZE) continue
          total++
          if (!this.isOnSnake(x, y)) free++
        }
      }
    } else {
      // Normal full scan
      for (let dx = -radius; dx <= radius; dx++) {
        for (let dy = -radius; dy <= radius; dy++) {
          if (dx === 0 && dy === 0) continue
          const x = this.head.x + dx
          const y = this.head.y + dy
          if (x < 0 || x >= GRID_SIZE || y < 0 || y >= GRID_SIZE) continue
          total++
          if (!this.isOnSnake(x, y)) free++
        }
      }

      // Cache radius=1 data for potential reuse
      if (radius === 1) {
        this._localFreeCache.radius1Data = { free, total }
      }
    }

    const ratio = total === 0 ? 0 : free / total

    // Store in cache
    if (radius === 1) {
      this._localFreeCache.radius1 = ratio
    } else if (radius === 2) {
      this._localFreeCache.radius2 = ratio
    }

    return ratio
  }

  getDistanceToFood() {
    if (!this.head || !this.food) return null
    const dx = this.food.x - this.head.x
    const dy = this.food.y - this.head.y
    const maxDist = Math.sqrt(2) * Math.max(1, GRID_SIZE - 1)
    return Math.sqrt(dx * dx + dy * dy) / maxDist
  }

  getFoodDistanceRatio() {
    const dist = this.getDistanceToFood()
    return dist === null ? 0 : Math.min(1, dist)
  }

  getFoodValueRatio() {
    const maxValue = 10000
    const minValue = 2000
    const decayRate = 25
    const valueLost = Math.floor(this.stepsWithCurrentFood / decayRate) * 500
    const value = Math.max(minValue, maxValue - valueLost)
    return value / maxValue
  }

  isFacingFood() {
    if (!this.head || !this.food) return 0
    const dx = this.food.x - this.head.x
    const dy = this.food.y - this.head.y
    switch (this.direction) {
      case 'up': return dx === 0 && dy < 0 ? 1 : 0
      case 'down': return dx === 0 && dy > 0 ? 1 : 0
      case 'left': return dy === 0 && dx < 0 ? 1 : 0
      case 'right': return dy === 0 && dx > 0 ? 1 : 0
      default: return 0
    }
  }

  canSeeFood(dx, dy) {
    if (!this.head || !this.food) return 0

    // Ray cast in the direction until hitting wall or food
    let x = this.head.x
    let y = this.head.y

    for (let i = 1; i < GRID_SIZE; i++) {
      x += dx
      y += dy

      // Hit wall
      if (x < 0 || x >= GRID_SIZE || y < 0 || y >= GRID_SIZE) {
        return 0
      }

      // Found food!
      if (x === this.food.x && y === this.food.y) {
        return 1 / i  // Closer = higher value (1.0 at distance 1, 0.5 at distance 2, etc.)
      }
    }

    return 0
  }

  isFoodInDirection(relativeDir) {
    if (!this.head || !this.food) return 0

    const dx = this.food.x - this.head.x
    const dy = this.food.y - this.head.y

    // Get target direction
    const directions = ['up', 'right', 'down', 'left']
    const currentIndex = directions.indexOf(this.direction)

    let targetDir
    if (relativeDir === 'forward') {
      targetDir = this.direction
    } else if (relativeDir === 'left') {
      targetDir = directions[(currentIndex + 3) % 4]
    } else if (relativeDir === 'right') {
      targetDir = directions[(currentIndex + 1) % 4]
    } else if (relativeDir === 'back') {
      targetDir = directions[(currentIndex + 2) % 4]
    }

    // Check if food is primarily in that direction
    if (targetDir === 'up' && dy < 0) return Math.abs(dy) / GRID_SIZE
    if (targetDir === 'down' && dy > 0) return Math.abs(dy) / GRID_SIZE
    if (targetDir === 'left' && dx < 0) return Math.abs(dx) / GRID_SIZE
    if (targetDir === 'right' && dx > 0) return Math.abs(dx) / GRID_SIZE

    return 0
  }

  // 🚨 NEW: Detect distance to danger (wall or body) in a relative direction
  getDangerDistance(relativeDir) {
    if (!this.head) return 0.5

    // Get target direction
    const directions = ['up', 'right', 'down', 'left']
    const currentIndex = directions.indexOf(this.direction)

    let targetDir
    if (relativeDir === 'forward') {
      targetDir = this.direction
    } else if (relativeDir === 'left') {
      targetDir = directions[(currentIndex + 3) % 4]
    } else if (relativeDir === 'right') {
      targetDir = directions[(currentIndex + 1) % 4]
    }

    // Safety check: return safe default if direction is undefined
    if (!targetDir) {
      return 0.5
    }

    // Get direction deltas
    const deltas = {
      'up': { dx: 0, dy: -1 },
      'down': { dx: 0, dy: 1 },
      'left': { dx: -1, dy: 0 },
      'right': { dx: 1, dy: 0 }
    }

    const delta = deltas[targetDir]
    if (!delta) {
      return 0.5  // Return safe default if delta is undefined
    }
    const { dx, dy } = delta

    // Raycast: count steps until hitting wall or body
    let steps = 0
    let x = this.head.x + dx
    let y = this.head.y + dy

    while (x >= 0 && x < GRID_SIZE && y >= 0 && y < GRID_SIZE && steps < GRID_SIZE) {
      // Hit own body?
      if (this.isOnSnake(x, y)) {
        break
      }

      steps++
      x += dx
      y += dy
    }

    // Normalize: 0 = danger next to me, 1 = danger far away
    return steps / GRID_SIZE
  }

  turn(action) {
    this.lastTurnDelta = 0
    // Actions may fire during brain construction (before reset()). Guard against
    // an uninitialized directionIndex so NaN does not propagate into the cache.
    const current = Number.isInteger(this.directionIndex) ? this.directionIndex : 0
    if (action === 'forward') {
      return
    } else if (action === 'left') {
      this.lastTurnDelta = 1
      this.directionIndex = (current + 3) % 4
      this.direction = SnakeAI.DIRECTION_ORDER[this.directionIndex]
    } else if (action === 'right') {
      this.lastTurnDelta = -1
      this.directionIndex = (current + 1) % 4
      this.direction = SnakeAI.DIRECTION_ORDER[this.directionIndex]
    }
  }

  getDanger(dx, dy) {
    const checkX = this.head.x + dx
    const checkY = this.head.y + dy

    // Wall danger
    if (checkX < 0 || checkX >= GRID_SIZE || checkY < 0 || checkY >= GRID_SIZE) {
      return 1
    }

    // Body danger (check next 3 positions)
    for (let i = 1; i <= 3; i++) {
      const x = this.head.x + dx * i
      const y = this.head.y + dy * i
      if (x >= 0 && x < GRID_SIZE && y >= 0 && y < GRID_SIZE) {
        if (this.isOnSnake(x, y)) {
          return 1.0 / i  // Closer = more dangerous
        }
      }
    }

    return 0
  }

  move() {
    if (!this.alive) return

    const prevDistanceRatio = this.prevDistanceToFood ?? this.getDistanceToFood()
    const previousStepsRatio = this.prevStepsRatio ?? 0
    this.stepsSinceFood = (this.stepsSinceFood ?? 0) + 1
    this.isCloserThisStep = 0

    // Calculate new head position
    const newHead = { ...this.head }
    switch (this.direction) {
      case 'up': newHead.y--; break
      case 'down': newHead.y++; break
      case 'left': newHead.x--; break
      case 'right': newHead.x++; break
    }

    // Die on wall collision
    if (newHead.x < 0 || newHead.x >= GRID_SIZE || newHead.y < 0 || newHead.y >= GRID_SIZE) {
      this.alive = false
      this.deathReason = `💥 Hit wall at (${newHead.x}, ${newHead.y})`
      return
    }

    // Die on self collision (IMPORTANT now that snake grows!)
    if (this.isOnSnake(newHead.x, newHead.y)) {
      this.alive = false
      this.deathReason = `🔁 Ate itself at (${newHead.x}, ${newHead.y}) - Length: ${this.snake.length}`
      return
    }

    // Move snake
    this.snake.unshift(newHead)
    this.head = newHead

    const curvatureAlpha = 0.3
    this.curvature = clamp((this.curvature ?? 0) * (1 - curvatureAlpha) + (this.lastTurnDelta ?? 0) * curvatureAlpha, -1, 1)
    this.lastTurnDelta = 0

    // ⚡ PERFORMANCE: Update Set with new head position
    const key = `${newHead.x},${newHead.y}`
    this.snakeSet.add(key)

    // Track exploration
    this.visited.add(key)
    const prevExploration = this.prevExplorationRatio ?? 0
    const currentExploration = this.visited.size / Math.max(1, TOTAL_TILES)
    const explorationDelta = clamp((currentExploration - prevExploration) * 10, -1, 1)
    this.explorationDelta = explorationDelta
    this.prevExplorationRatio = currentExploration

    // Track distance changes (for gradient reward!)
    const newDist = Math.abs(newHead.x - this.food.x) + Math.abs(newHead.y - this.food.y)
    const approached = newDist < this.lastDistance
    if (approached) {
      this.stepsCloser = (this.stepsCloser || 0) + 1  // Got closer!
    } else if (newDist > this.lastDistance) {
      this.stepsFarther = (this.stepsFarther || 0) + 1  // Got farther!
    }
    this.lastDistance = newDist
    this.closestToFood = Math.min(this.closestToFood, newDist)

    // Check food
    let ateFood = false
    if (newHead.x === this.food.x && newHead.y === this.food.y) {
      this.foodEaten++

      // ⏱️ TIME-DECAY: Calculate food value based on how long it took
      // Food starts at 10000 points and decays to minimum 2000 (20%)
      const maxValue = 10000
      const minValue = 2000
      const decayRate = 25  // Lose value every 25 steps
      const valueLost = Math.floor(this.stepsWithCurrentFood / decayRate) * 500
      const foodValue = Math.max(minValue, maxValue - valueLost)
      this.foodValues.push(foodValue)

      this.food = this.spawnFoodCurriculum()  // Use curriculum for next food
      this.closestToFood = Infinity  // Reset for new food
      this.stepsWithCurrentFood = 0  // Reset timer for new food!
      this.bestStepsToFood = Math.max(this.bestStepsToFood, this.stepsSinceFood)
      this.stepsSinceFood = 0
      ateFood = true  // GROW!
    }

    // Only remove tail if didn't eat (classic Snake growth!)
    if (!ateFood) {
      const tail = this.snake.pop()
      // ⚡ PERFORMANCE: Remove tail from Set
      this.snakeSet.delete(`${tail.x},${tail.y}`)
    }

    const currentDistance = this.getDistanceToFood()
    if (ateFood) {
      this.foodDelta = 1
      const trendAlpha = 0.3
      this.foodTrend = clamp((this.foodTrend ?? 0) * (1 - trendAlpha) + trendAlpha, -1, 1)
      this.isCloserThisStep = 1
    } else if (prevDistanceRatio !== null && currentDistance !== null) {
      const delta = clamp(prevDistanceRatio - currentDistance, -1, 1)
      this.foodDelta = delta
      const trendAlpha = 0.3
      this.foodTrend = clamp((this.foodTrend ?? 0) * (1 - trendAlpha) + delta * trendAlpha, -1, 1)
      this.isCloserThisStep = delta > 0 ? 1 : 0
    } else {
      this.foodDelta = 0
      this.isCloserThisStep = 0
    }
    this.prevDistanceToFood = currentDistance

    const currentStepsRatio = this.getStepsSinceFoodRatio()
    const stepDelta = clamp(currentStepsRatio - previousStepsRatio, -1, 1)
    const stepTrendAlpha = 0.25
    this.stepsTrend = clamp((this.stepsTrend ?? 0) * (1 - stepTrendAlpha) + stepDelta * stepTrendAlpha, -1, 1)
    this.prevStepsRatio = currentStepsRatio

    // ⚡ PERFORMANCE: Invalidate caches after move
    this._corridorCache = null  // Corridor checks need refresh
    this.invalidateSpatialCache()
  }

  playGame() {
    this.applyCurriculumGrid()
    this.reset()

    while (this.alive && this.steps < MAX_STEPS) {
      super.tick()  // Neural network decides direction
      this.move()
      this.steps++
      this.stepsWithCurrentFood++  // ⏱️ Track time with current food

      // Early stop if clearly stuck in a loop
      if (this.steps > 50 && this.visited.size < 10) {
        this.deathReason = '🔄 Stuck in loop (visited <10 tiles in 50 steps)'
        break
      }
    }

    // If reached max steps
    if (this.alive && this.steps >= MAX_STEPS) {
      this.deathReason = `⏱️  Reached max steps (${MAX_STEPS})`
    }
  }

  fitness() {
    if (this.cachedFitness !== undefined) {
      return this.cachedFitness
    }

    this.cachedStats = null
    const seeds = this.evaluationSeeds || []

    let totalScore = 0
    let totalFoodEaten = 0
    let totalSteps = 0
    let sumVisitedCounts = 0
    let maxFoodEaten = 0
    let bestRunSteps = 0
    let bestVisitedSet = null

    // Chrispresso/Greer Viau fitness: monotone in food, smooth gradient.
    // steps + 2^food + food^2.1 * 500 - food^1.2 * (0.25*steps)^1.3
    // When food=0 we cap at steps*0.1 so loop-runners can't beat
    // any snake that ate even a single food.
    const runFitness = (food, steps) => {
      const s = Math.max(1, steps)
      if (food === 0) return s * 0.1
      const f = Math.min(food, 40)
      const reward = Math.pow(2, f) + Math.pow(f, 2.1) * 500
      const penalty = Math.pow(f, 1.2) * Math.pow(0.25 * s, 1.3)
      return s + reward - penalty
    }

    for (let run = 0; run < FITNESS_RUNS; run++) {
      const runSeed = typeof seeds[run] === 'number' ? seeds[run] : null
      const script = getCurriculumScript(CURRICULUM_LEVEL)
      if (script.length > 0) {
        const warmupRuns = CURRICULUM_WARMUP_RUNS[CURRICULUM_LEVEL] ?? 0
        if (warmupRuns > 0 && run < warmupRuns) {
          this.curriculumSequenceOffset = 0
        } else {
          this.curriculumSequenceOffset = run % script.length
        }
      } else {
        this.curriculumSequenceOffset = 0
      }
      this.setRandomSeed(runSeed)
      this.playGame()

      totalScore += runFitness(this.foodEaten, this.steps)
      totalFoodEaten += this.foodEaten
      totalSteps += this.steps
      sumVisitedCounts += this.visited.size

      if (
        run === 0 ||
        this.foodEaten > maxFoodEaten ||
        (this.foodEaten === maxFoodEaten && this.steps > bestRunSteps)
      ) {
        maxFoodEaten = this.foodEaten
        bestRunSteps = this.steps
        bestVisitedSet = new Set(this.visited)
      }
    }

    const avgFood = totalFoodEaten / FITNESS_RUNS
    const avgSteps = totalSteps / FITNESS_RUNS
    const avgTiles = sumVisitedCounts / FITNESS_RUNS

    this.foodEaten = maxFoodEaten
    this.steps = bestRunSteps
    this.visited = bestVisitedSet ? new Set(bestVisitedSet) : new Set(this.visited)
    const tilesBest = this.visited.size

    const finalScore = totalScore / FITNESS_RUNS
    const baseScore = finalScore
    const bestRunBonus = 0

    // Cache stats for reuse within the generation
    this.cachedFitness = finalScore
    this.cachedStats = {
      avgFood,
      bestFood: maxFoodEaten,
      avgSteps,
      bestSteps: bestRunSteps,
      tilesExplored: tilesBest,
      avgTiles,
      baseScore,
      bestRunBonus
    }

    this.setRandomSeed(null)
    this.evaluationSeeds = null

    // Return AVERAGE fitness (consistency matters!)
    return this.cachedFitness
  }

  render() {
    console.log('\n┌' + '──'.repeat(GRID_SIZE) + '┐')
    for (let y = 0; y < GRID_SIZE; y++) {
      let row = '│'
      for (let x = 0; x < GRID_SIZE; x++) {
        if (x === this.head.x && y === this.head.y) {
          // HEAD: Different based on direction
          const headChars = { up: '⬆️ ', down: '⬇️ ', left: '⬅️ ', right: '➡️ ' }
          row += headChars[this.direction] || '🐍'
        } else if (this.isOnSnake(x, y)) {
          row += '🟩'  // Body segments
        } else if (x === this.food.x && y === this.food.y) {
          row += '🍎'
        } else {
          row += '· '
        }
      }
      row += '│'
      console.log(row)
    }
    console.log('└' + '──'.repeat(GRID_SIZE) + '┘')
    console.log(`🍎 Food: ${this.foodEaten} | 📏 Length: ${this.snake.length} | 🚶 Steps: ${this.steps}/${MAX_STEPS}`)
    if (this.deathReason) {
      console.log(`💀 Death: ${this.deathReason}`)
    }
  }
}

async function watchBest(snake) {
  configureReplayEnvironment({
    gridSize: snake.lastGridSizeUsed || GRID_SIZE,
    maxSteps: MAX_STEPS,
    level: CURRICULUM_LEVEL
  })
  const hudSnake = new ReplaySnakeAI({
    genome: snake.genome,
    neurons: BASE_NEURON_COUNT
  })
  await watchSnakeHUD(hudSnake)
}

// Helper function to print brain structure
function printBrainStructure(snake) {
  console.log('\n🧠 ═══ BRAIN STRUCTURE ═══')
  console.log(`📥 Inputs: ${SENSOR_COUNT} sensors`)
  console.log(`🔗 Hidden: ${BASE_NEURON_COUNT} neurons`)
  console.log(`📤 Outputs: ${ACTION_COUNT} actions`)
  console.log(`🧬 Genome: ${snake.genome.bases.length} bases (${snake.genome.encoded.length} chars)`)

  // Count connection types
  let connectionBases = 0
  let biasBases = 0
  for (const base of snake.genome.bases) {
    if (base.type === 'connection') connectionBases++
    else if (base.type === 'bias') biasBases++
  }

  console.log(`   ├─ ${connectionBases} connections`)
  console.log(`   └─ ${biasBases} biases`)

  // Show brain size estimate
  const totalVertices = SENSOR_COUNT + BASE_NEURON_COUNT + ACTION_COUNT
  console.log(`🔢 Total vertices: ${totalVertices}`)
  console.log(`📊 Connection density: ${(connectionBases / (totalVertices * totalVertices) * 100).toFixed(1)}%`)
  console.log('═'.repeat(30) + '\n')
}

// Helper function to save champion
function saveChampion(snake, generation, level, fitnessOverride = null) {
  const fitnessValue = fitnessOverride !== null
    ? fitnessOverride
    : (typeof snake.cachedFitness === 'number' ? snake.cachedFitness : snake.fitness())

  const championData = {
    genome: snake.genome.encoded,
    stats: {
      foodEaten: snake.foodEaten,
      avgFood: snake.cachedStats?.avgFood ?? snake.foodEaten,
      steps: snake.steps,
      avgSteps: snake.cachedStats?.avgSteps ?? snake.steps,
      tilesExplored: snake.visited.size,
      avgTiles: snake.cachedStats?.avgTiles ?? snake.visited.size,
      fitness: fitnessValue,
      generation: generation,
      curriculumLevel: level
    },
    config: {
      gridSize: snake.lastGridSizeUsed || GRID_SIZE,
      maxSteps: MAX_STEPS,
      genomeSize: snake.genome.bases.length,
      neurons: BASE_NEURON_COUNT,
      sensors: SENSOR_COUNT,
      actions: ACTION_COUNT,
      sensorNames: SENSOR_NAMES,
      actionNames: ['Forward', 'Left', 'Right']
    },
    timestamp: new Date().toISOString()
  }

  const championDir = path.dirname(CHAMPION_FILE)
  fs.mkdirSync(championDir, { recursive: true })
  fs.writeFileSync(
    CHAMPION_FILE,
    JSON.stringify(championData, null, 2)
  )

  return championData
}

// Helper function to load current champion (if exists)
function loadChampion() {
  try {
    if (fs.existsSync(CHAMPION_FILE)) {
      const data = JSON.parse(fs.readFileSync(CHAMPION_FILE, 'utf-8'))
      return data
    }
  } catch (err) {
    // File doesn't exist or is invalid
  }
  return null
}

async function evolve() {
  console.log('🧬 SNAKE AI EVOLUTION (ULTIMATE VERSION) 🔥\n')
  console.log(`Grid: ${GRID_SIZE}×${GRID_SIZE}`)
  console.log(`Max Steps: ${MAX_STEPS}`)
  console.log(`Population: ${POPULATION_SIZE} snakes`)
  console.log(`Genome: 500 bases | Neurons: ${BASE_NEURON_COUNT} (🧠 tuned brain capacity!)`)
  console.log(`\n💡 GAME-CHANGING IMPROVEMENTS:`)
  console.log(`  ✅ RELATIVE ACTIONS (forward/left/right) - WAY easier!`)
  console.log(`  ✅ QUADRANT AWARENESS (head, food, and body occupancy signals)`)
  console.log(`  ✅ WALL PROXIMITY & FREE CORRIDOR WINDOWS (forward/left/right safety)`)
  console.log(`  ✅ TEMPORAL & GROWTH SIGNALS (size ratio, total steps, last-food timer)`)
  console.log(`  ✅ LOCAL BREATHING ROOM (3×3 and 5×5 free-space ratios)`)
  console.log(`  ✅ FOOD INTELLIGENCE (distance, value decay, approach, facing target)`)
  console.log(`  ✅ SUPER INCREMENTAL FITNESS - 5x-10x bigger rewards!`)
  console.log(`\nCURRICULUM LEVELS:`)
  console.log(`  L1: Food in LINE → learn "go straight"`)
  console.log(`  L2: Food in 4 positions → learn turning`)
  console.log(`  L3: Food in 8 positions → master all moves`)
  console.log(`  L4: Food RANDOM → full mastery!`)
  console.log(`  L5: GRID LOOP 9×9→15×15 → endurance & adaptability\n`)

  // Load current champion to beat
  const currentChampion = loadChampion()
  if (currentChampion) {
    console.log('🏆 CURRENT CHAMPION TO BEAT:')
    console.log(`   Food: ${currentChampion.stats.foodEaten} | Fitness: ${currentChampion.stats.fitness}`)
    console.log(`   From Gen ${currentChampion.stats.generation} | ${currentChampion.timestamp}\n`)
  } else {
    console.log('🆕 No champion yet - this will be the first!\n')
  }

  console.log(`Starting at Level ${CURRICULUM_LEVEL}...\n`)

  const gen = new Generation({
    size: POPULATION_SIZE,  // Larger population for richer diversity!
    individualClass: SnakeAI,
    individualGenomeSize: 500,  // 🧠 expanded genome for richer solutions!
    individualNeurons: BASE_NEURON_COUNT,  // 🧠 increased base neurons for better pattern recognition!
    mutationRate: 0.05,  // Lower mutation - preserve good solutions
    eliteRatio: 0.4,    // Keep top 40% as elite for stability
    randomFillRatio: 0.05 // Reduce random injections to stabilize progress
  })

  const advancedContext = {
    neurons: gen.individualNeurons || ADVANCED_BASE_THRESHOLDS.moduleNeurons,
    sensors: SENSOR_COUNT,
    actions: ACTION_COUNT,
    memoryCells: ADVANCED_BASE_THRESHOLDS.memoryCells,
    plasticities: ADVANCED_BASE_THRESHOLDS.plasticities,
    learningRules: ADVANCED_BASE_THRESHOLDS.learningRules,
    evolvedNeurons: ADVANCED_BASE_THRESHOLDS.evolvedNeurons,
    attributes: ADVANCED_BASE_THRESHOLDS.attributes,
    modules: ADVANCED_BASE_THRESHOLDS.modules,
    attributeIds: ADVANCED_BASE_THRESHOLDS.attributeIds,
    moduleGenomeSize: Math.max(
      60,
      Math.floor((gen.individualGenomeSize || ADVANCED_BASE_THRESHOLDS.moduleGenomeSize) * 0.4)
    ),
    moduleNeurons: Math.max(
      12,
      Math.floor((gen.individualNeurons || ADVANCED_BASE_THRESHOLDS.moduleNeurons) * 0.6)
    )
  }

  // 🚀 WARM START: Start with champion if exists!
  if (currentChampion && WARM_START_CHAMPION_CLONES > 0) {
    console.log('🚀 WARM START: Seeding population with champion!\n')
    console.log('   ⏳ Preparing champion clones with advanced genes...')
    gen.meta.randoms = 0

    // Add champion exactly as-is (enhanced genome)
    const championGenome = prepareGenome(currentChampion.genome, advancedContext)
    gen.population[0] = createSnakeFromGenome(championGenome, advancedContext)
    bestEverGenomeEncoded = championGenome.encoded
    console.log(`   ✅ Added champion clone (exact copy)`)

    // Add 29 mutated clones of champion with full advanced feature set
    const cloneCount = Math.min(WARM_START_CHAMPION_CLONES, gen.size - 1)
    for (let i = 1; i <= cloneCount; i++) {
      const mutatedGenome = prepareGenome(currentChampion.genome, advancedContext)
      mutatedGenome.mutate(0.05)
      ensureAdvancedBases(mutatedGenome, advancedContext)
      gen.population[i] = createSnakeFromGenome(mutatedGenome, advancedContext)
    }
    console.log(`   ✅ Added ${cloneCount} mutated clones`)

    // Fill rest with advanced random individuals for diversity
    fillGenerationWithAdvancedBases(gen, advancedContext, { reset: false })
    console.log(`   ✅ Added ${gen.size - (cloneCount + 1)} random snakes for diversity\n`)
    console.log('   ✅ Advanced population ready!\n')
  } else {
    // No champion - start from scratch
    console.log('   ⏳ Generating advanced random population...')
    fillGenerationWithAdvancedBases(gen, advancedContext)
    console.log('🆕 Starting from scratch (no champion found)\n')
    console.log('   ✅ Advanced population ready!\n')
  }

  let bestEver = null
  let bestFitnessEver = currentChampion ? currentChampion.stats.fitness : -Infinity
  let bestGeneration = 0
  let noImprovementCount = 0

  if (currentChampion) {
    const bestGenome = prepareGenome(currentChampion.genome, advancedContext)
    bestEver = createSnakeFromGenome(bestGenome, advancedContext)
    bestEver.foodEaten = currentChampion.stats.foodEaten
    bestEver.steps = currentChampion.stats.steps
    bestEver.visited = new Set()
    bestEver.cachedStats = {
      avgFood: currentChampion.stats.avgFood ?? currentChampion.stats.foodEaten,
      bestFood: currentChampion.stats.foodEaten,
      avgSteps: currentChampion.stats.avgSteps ?? currentChampion.stats.steps,
      bestSteps: currentChampion.stats.steps,
      tilesExplored: currentChampion.stats.tilesExplored,
      avgTiles: currentChampion.stats.avgTiles ?? currentChampion.stats.tilesExplored
    }
    bestEver.cachedFitness = currentChampion.stats.fitness
  }

  let bestEverGenomeEncoded = currentChampion ? currentChampion.genome : null

  let generationIndex = 0
  while (true) {
    if (GENERATIONS !== Infinity && generationIndex >= GENERATIONS) {
      console.log('\n✅ Reached max generations limit. Stopping training.')
      break
    }

    const i = generationIndex
    const seedEpoch = LEVEL_SEED_EPOCH
    const runSeeds = Array.from({ length: FITNESS_RUNS }, (_, run) =>
      hashSeed(seedEpoch, run, CURRICULUM_LEVEL)
    )

    for (const ind of gen.population) {
      if (typeof ind.setEvaluationSeeds === 'function') {
        ind.setEvaluationSeeds(runSeeds)
      }
    }

    await gen.tickAsync()

    const evaluated = gen.population.map(ind => {
      const fitnessValue = typeof ind.cachedFitness === 'number'
        ? ind.cachedFitness
        : (typeof ind.fitness === 'function' ? ind.fitness() : ind.fitness)

      const fallbackVisited = ind.visited instanceof Set
        ? ind.visited.size
        : Array.isArray(ind.visited)
          ? ind.visited.length
          : (typeof ind.visited === 'number' ? ind.visited : 0)

      const stats = ind.cachedStats || {
        avgFood: ind.foodEaten ?? 0,
        bestFood: ind.foodEaten ?? 0,
        avgSteps: ind.steps ?? 0,
        bestSteps: ind.steps ?? 0,
        tilesExplored: fallbackVisited,
        avgTiles: fallbackVisited
      }

      return { individual: ind, fitness: fitnessValue ?? 0, stats }
    })

    evaluated.sort((a, b) => b.fitness - a.fitness)
    gen.population = evaluated.map(entry => entry.individual)

    const bestEntry = evaluated[0]
    const best = bestEntry.individual
    const bestFitness = bestEntry.fitness

    const avgFit = evaluated.reduce((sum, entry) => sum + entry.fitness, 0) / evaluated.length
    const foodEaters = evaluated.filter(entry => (entry.stats.bestFood || 0) > 0).length
    const multiEaters = evaluated.filter(entry => (entry.stats.bestFood || 0) >= 2).length
    const superEaters = evaluated.filter(entry => (entry.stats.bestFood || 0) >= 3).length
    const maxFood = Math.max(...evaluated.map(entry => entry.stats.bestFood || 0))
    const avgFoodBest = bestEntry.stats.avgFood ?? best.foodEaten
    const avgFoodPopulation = evaluated.reduce(
      (sum, entry) => sum + (entry.stats.avgFood ?? entry.stats.bestFood ?? 0),
      0
    ) / evaluated.length
    const fourPlus = evaluated.filter(entry => (entry.stats.bestFood || 0) >= 4).length
    const fivePlus = evaluated.filter(entry => (entry.stats.bestFood || 0) >= 5).length

    if (bestFitness > bestFitnessEver) {
      bestFitnessEver = bestFitness
      const bestGenomePrepared = prepareGenome(best.genome, advancedContext)
      const bestClone = createSnakeFromGenome(bestGenomePrepared, advancedContext)
      bestClone.foodEaten = best.foodEaten
      bestClone.steps = best.steps
      bestClone.visited = best.visited instanceof Set ? new Set(best.visited) : new Set()
      bestClone.cachedStats = best.cachedStats ? { ...best.cachedStats } : null
      bestClone.cachedFitness = best.cachedFitness
      bestClone.lastGridSizeUsed = best.lastGridSizeUsed
      bestClone.activeGridSize = best.activeGridSize
      bestEver = bestClone
      bestGeneration = i
      noImprovementCount = 0
      bestEverGenomeEncoded = bestClone.genome.encoded

      // 🏆 NEW CHAMPION! Save immediately
      saveChampion(bestClone, i, CURRICULUM_LEVEL, bestFitness)
      console.log(`\n🏆 NEW RECORD! Fitness: ${bestFitness} | Food: ${best.foodEaten} | Gen ${i}`)
      console.log(`💾 Champion saved to file!\n`)
    } else {
      noImprovementCount++
    }

    // CURRICULUM ADVANCEMENT: More aggressive! 🔥
    let levelUp = false
    const level1AvgRequirement = CURRICULUM_AVG_FOOD_REQUIREMENTS[1] ?? 4
    const level2AvgRequirement = CURRICULUM_AVG_FOOD_REQUIREMENTS[2] ?? 5
    const level3AvgRequirement = CURRICULUM_AVG_FOOD_REQUIREMENTS[3] ?? 6

    if (CURRICULUM_LEVEL === 1 && superEaters >= 80 && avgFoodPopulation >= level1AvgRequirement) {
      // Must consistently eat 3+ foods before advancing
      CURRICULUM_LEVEL = 2
      LEVEL_SEED_EPOCH++
      levelUp = true
      console.log('\n🎓 LEVEL UP! → Level 2: Learning 4 directions!')
      console.log(`   AvgFood=${avgFoodPopulation.toFixed(2)} | 3+=${superEaters}/${gen.size}\n`)
    } else if (CURRICULUM_LEVEL === 2 && fourPlus >= 80 && avgFoodPopulation >= level2AvgRequirement) {
      // Must master turning scenarios with reliable 4+ food runs
      CURRICULUM_LEVEL = 3
      LEVEL_SEED_EPOCH++
      levelUp = true
      console.log('\n🎓 LEVEL UP! → Level 3: Learning 8 positions!')
      console.log(`   AvgFood=${avgFoodPopulation.toFixed(2)} | 4+=${fourPlus}/${gen.size}\n`)
    } else if (CURRICULUM_LEVEL === 3 && fivePlus >= 80 && avgFoodPopulation >= level3AvgRequirement) {
      // Must handle diagonal/random setups with consistent 5+ food scores
      CURRICULUM_LEVEL = 4
      LEVEL_SEED_EPOCH++
      levelUp = true
      console.log('\n🎓 LEVEL UP! → Level 4: RANDOM FOOD (final challenge)!')
      console.log(`   AvgFood=${avgFoodPopulation.toFixed(2)} | 5+=${fivePlus}/${gen.size}\n`)
    } else if (CURRICULUM_LEVEL === 4 && superEaters >= 100 && maxFood >= 5) {
      // Unlock the endurance league with expanding boards
      CURRICULUM_LEVEL = 5
      LEVEL_SEED_EPOCH++
      resetLevel5GridCycle()
      levelUp = true
      console.log('\n🎓 LEVEL UP! → Level 5: GRID LOOP 9×9→15×15 endurance!')
      console.log(`   AvgFood=${avgFoodPopulation.toFixed(2)} | 3+=${superEaters}/${gen.size} | MaxFood=${maxFood}\n`)
    }

    console.log(
      `Gen ${i.toString().padStart(3)} [L${CURRICULUM_LEVEL}]: ` +
      `Eaters=${foodEaters.toString().padStart(3)}/${gen.size} | ` +
      `2+=${multiEaters.toString().padStart(3)} | ` +
      `3+=${superEaters.toString().padStart(3)} | ` +
      `MaxFood=${maxFood} | ` +
      `Best: ${best.foodEaten}food/${best.steps}steps/${best.visited.size}tiles | ` +
      `AvgFood=${avgFoodBest.toFixed(1)} | ` +
      `PopAvg=${avgFoodPopulation.toFixed(2)} | ` +
      `Fit=${bestFitness.toString().padStart(8)} | ` +
      `Avg=${Math.floor(avgFit).toString().padStart(7)}`
    )

    if (gen.history.length >= 2 && i % 5 === 0) {
      console.log(`     ${sparkline(gen.history, { metric: 'best', width: 60 })}`)
    }

    // Stop if stuck for too long
    if (noImprovementCount >= 150) {
      console.log('\n⏸️  No improvement for 150 generations')
      break
    }

    // Strong elitism: keep top 30 best snakes
    for (let j = 0; j < 30; j++) {
      gen.population[j].dead = false
    }

    // Kill bottom 40% (less aggressive - preserve diversity)
    for (let j = Math.floor(gen.size * 0.6); j < gen.population.length; j++) {
      gen.population[j].dead = true
    }

    const nextGen = await gen.nextAsync()
    Object.assign(gen, nextGen)

    rebuildPopulationWithAdvancedGenomes(gen, advancedContext)

    if (bestEverGenomeEncoded) {
      const championGenomePrepared = prepareGenome(bestEverGenomeEncoded, advancedContext)
      const championClone = createSnakeFromGenome(championGenomePrepared, advancedContext)
      championClone.dead = false
      gen.population[0] = championClone

      const extraClones = Math.min(4, gen.population.length - 1)
      for (let k = 1; k <= extraClones; k++) {
        const mutatedGenome = prepareGenome(bestEverGenomeEncoded, advancedContext)
        mutatedGenome.mutate(0.01)
        ensureAdvancedBases(mutatedGenome, advancedContext)
        const mutatedClone = createSnakeFromGenome(mutatedGenome, advancedContext)
        mutatedClone.dead = false
        gen.population[k] = mutatedClone
      }
    }

    generationIndex += 1
  }

  console.log('\n' + '='.repeat(60))
  console.log('🎉 EVOLUTION COMPLETE!')
  console.log('='.repeat(60))

  if (bestEver) {
    const bestStats = bestEver.cachedStats || {}
    console.log(`🏆 Final Champion (from Gen ${bestGeneration}):`)
    console.log(`  Food Eaten: ${bestStats.bestFood ?? bestEver.foodEaten}`)
    console.log(`  Steps: ${bestStats.bestSteps ?? bestEver.steps}`)
    const visitedSize = bestEver.visited instanceof Set ? bestEver.visited.size : undefined
    const tilesExplored = visitedSize && visitedSize > 0 ? visitedSize : (bestStats.tilesExplored ?? 0)
    console.log(`  Tiles Explored: ${tilesExplored}`)
    console.log(`  Fitness: ${bestEver.cachedFitness ?? bestFitnessEver}`)
    console.log(`  Genome: ${bestEver.genome.encoded.substring(0, 60)}...\n`)

    // Show brain structure
    printBrainStructure(bestEver)

    console.log('💾 Champion auto-saved during training!')
    console.log(`   File: docs/examples/games/snake-champion.json`)
  } else {
    console.log('⚠️  No champion was found during training.')
    console.log('   Try running with more generations or without --quick flag.\n')
  }
  if (bestEver) {
    console.log(`\n✅ Replay this champion with:`)
    console.log('   node docs/examples/games/snake-replay.js\n')
  }

  if (process.argv.includes('--watch') && bestEver) {
    console.log('⏱️  Starting watch mode in 3 seconds...\n')
    await new Promise(resolve => setTimeout(resolve, 3000))
    await watchBest(bestEver)
  } else {
    console.log('💡 Or run with --watch to see it play now:\n')
    console.log('   node docs/examples/games/snake.js --watch\n')
  }
}

evolve().catch(err => {
  console.error('ERROR:', err)
  console.error(err.stack)
})
