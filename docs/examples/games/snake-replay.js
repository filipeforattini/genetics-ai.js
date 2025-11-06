import { Individual, Genome } from '../../../src/index.js'
import fs from 'fs'
import path from 'node:path'
import { fileURLToPath } from 'node:url'

const __filename = fileURLToPath(import.meta.url)
const __dirname = path.dirname(__filename)
const DEFAULT_CHAMPION_FILE = path.join(__dirname, 'snake-champion.json')
let REPLAY_NEURON_COUNT = 50

const DEFAULT_SENSOR_NAMES = [
  'Head X Norm', 'Head Y Norm',
  'Food X Norm', 'Food Y Norm',
  'Food Offset X', 'Food Offset Y',
  'Food Forward', 'Food Side',
  'Heading Cos', 'Heading Sin',
  'Facing Cos', 'Facing Sin',
  'Food Distance', 'Food Delta', 'Food Trend',
  'Steps Since', 'Steps Trend', 'Food Value',
  'Free Forward Dist', 'Free Left Dist', 'Free Right Dist',
  'Danger Forward', 'Danger Left', 'Danger Right',
  'Corridor Forward', 'Corridor Left', 'Corridor Right',
  'Wall North Dist', 'Wall South Dist', 'Wall East Dist', 'Wall West Dist',
  'Body Front Density', 'Body Back Density', 'Body Left Density', 'Body Right Density',
  'Local Free 3', 'Local Free 5',
  'Curvature', 'Exploration Delta'
]

const DEFAULT_ACTION_NAMES = ['Forward', 'Left', 'Right']
const ACTION_HISTORY_SYMBOLS = ['⬆️', '⬅️', '➡️']

let SENSOR_NAMES = [...DEFAULT_SENSOR_NAMES]
let ACTION_NAMES = [...DEFAULT_ACTION_NAMES]
const YELLOW = '\x1b[33m'
const RESET = '\x1b[0m'

function visibleLength(str = '') {
  return str.replace(/\x1B\[[0-9;]*m/g, '').length
}

let GRID_SIZE = 10
let MAX_STEPS = 500
let TOTAL_TILES = GRID_SIZE * GRID_SIZE
const LEVEL5_GRID_SEQUENCE = [9, 10, 11, 12, 13, 14, 15]
let LEVEL5_GRID_INDEX = 0
const WATCH_SPEED = 110
let CURRICULUM_LEVEL = 1

function setGridSize(size) {
  const normalized = Number.isFinite(size) ? Math.max(4, Math.floor(size)) : GRID_SIZE
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

const CURRICULUM_WARMUP_RUNS = {
  2: 3,
  3: 2
}

function mulberry32(seed) {
  let t = seed >>> 0
  return function() {
    t += 0x6D2B79F5
    let res = Math.imul(t ^ (t >>> 15), 1 | t)
    res ^= res + Math.imul(res ^ (res >>> 7), 61 | res)
    return ((res ^ (res >>> 14)) >>> 0) / 4294967296
  }
}

function clamp(value, min = -Infinity, max = Infinity) {
  if (!Number.isFinite(value)) {
    return 0
  }
  if (value < min) return min
  if (value > max) return max
  return value
}

function configureReplayEnvironment({ gridSize, maxSteps, level } = {}) {
  if (Number.isFinite(gridSize)) {
    setGridSize(gridSize)
  }
  if (Number.isFinite(maxSteps) && maxSteps > 0) {
    MAX_STEPS = Math.floor(maxSteps)
  }
  if (level !== undefined) {
    const normalizedLevel = Number.isFinite(level) ? Math.max(1, Math.floor(level)) : 1
    CURRICULUM_LEVEL = normalizedLevel
  }
  resetLevel5GridCycle()
}

class SnakeAI extends Individual {
  constructor(options) {
    super({
      ...options,
      sensors: [
        { id: 0, tick: () => this.getSpatialCache().headNorm.x },
        { id: 1, tick: () => this.getSpatialCache().headNorm.y },
        { id: 2, tick: () => this.getSpatialCache().foodNorm.x },
        { id: 3, tick: () => this.getSpatialCache().foodNorm.y },
        { id: 4, tick: () => this.getSpatialCache().foodOffset.dx },
        { id: 5, tick: () => this.getSpatialCache().foodOffset.dy },
        { id: 6, tick: () => this.getSpatialCache().foodProjection.forward },
        { id: 7, tick: () => this.getSpatialCache().foodProjection.side },
        { id: 8, tick: () => this.getSpatialCache().heading.cos },
        { id: 9, tick: () => this.getSpatialCache().heading.sin },
        { id: 10, tick: () => this.getSpatialCache().facing.cos },
        { id: 11, tick: () => this.getSpatialCache().facing.sin },
        { id: 12, tick: () => this.getSpatialCache().foodDistance },
        { id: 13, tick: () => this.getSpatialCache().foodDelta },
        { id: 14, tick: () => this.getSpatialCache().foodTrend },
        { id: 15, tick: () => this.getSpatialCache().stepsSince },
        { id: 16, tick: () => this.getSpatialCache().stepsTrend },
        { id: 17, tick: () => this.getSpatialCache().foodValue },
        { id: 18, tick: () => this.getSpatialCache().freeDistances.forward },
        { id: 19, tick: () => this.getSpatialCache().freeDistances.left },
        { id: 20, tick: () => this.getSpatialCache().freeDistances.right },
        { id: 21, tick: () => this.getSpatialCache().danger.forward },
        { id: 22, tick: () => this.getSpatialCache().danger.left },
        { id: 23, tick: () => this.getSpatialCache().danger.right },
        { id: 24, tick: () => this.getSpatialCache().corridors.forward },
        { id: 25, tick: () => this.getSpatialCache().corridors.left },
        { id: 26, tick: () => this.getSpatialCache().corridors.right },
        { id: 27, tick: () => this.getSpatialCache().wallDistances.north },
        { id: 28, tick: () => this.getSpatialCache().wallDistances.south },
        { id: 29, tick: () => this.getSpatialCache().wallDistances.east },
        { id: 30, tick: () => this.getSpatialCache().wallDistances.west },
        { id: 31, tick: () => this.getSpatialCache().bodyDensity.front },
        { id: 32, tick: () => this.getSpatialCache().bodyDensity.back },
        { id: 33, tick: () => this.getSpatialCache().bodyDensity.left },
        { id: 34, tick: () => this.getSpatialCache().bodyDensity.right },
        { id: 35, tick: () => this.getSpatialCache().localFree.radius1 },
        { id: 36, tick: () => this.getSpatialCache().localFree.radius2 },
        { id: 37, tick: () => this.getSpatialCache().curvature },
        { id: 38, tick: () => this.getSpatialCache().explorationDelta }
      ],
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
  }

  applyCurriculumGrid() {
    let nextSize = GRID_SIZE
    if (CURRICULUM_LEVEL === 5) {
      const sequenceLength = LEVEL5_GRID_SEQUENCE.length
      const index = LEVEL5_GRID_INDEX % sequenceLength
      nextSize = LEVEL5_GRID_SEQUENCE[index]
      LEVEL5_GRID_INDEX = (index + 1) % sequenceLength
    } else {
      nextSize = GRID_SIZE
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

  invalidateSpatialCache() {
    this._spatialCache = null
    this._spatialCacheStamp = -1
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
    switch (dir) {
      case 'up': return { dx: 0, dy: -1 }
      case 'down': return { dx: 0, dy: 1 }
      case 'left': return { dx: -1, dy: 0 }
      case 'right': return { dx: 1, dy: 0 }
      default: return { dx: 0, dy: 0 }
    }
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
    const denom = Math.max(1, GRID_SIZE - 1)
    return {
      north: this.head.y / denom,
      south: (GRID_SIZE - 1 - this.head.y) / denom,
      east: (GRID_SIZE - 1 - this.head.x) / denom,
      west: this.head.x / denom
    }
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
      if (minRatio === 0) break
    }
    return minRatio
  }

  getDirectionDelta(relDir) {
    if (!this.head) return null
    const directions = ['up', 'right', 'down', 'left']
    const currentIndex = directions.indexOf(this.direction)
    let targetDir = null
    if (relDir === 'forward') targetDir = this.direction
    else if (relDir === 'left') targetDir = directions[(currentIndex + 3) % 4]
    else if (relDir === 'right') targetDir = directions[(currentIndex + 1) % 4]
    else if (relDir === 'back') targetDir = directions[(currentIndex + 2) % 4]
    return targetDir ? this.getDirectionVector(targetDir) : null
  }

  getLocalFreeRatio(radius) {
    if (!this.head) return 0
    let free = 0
    let total = 0
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
    if (total === 0) return 0
    return free / total
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
    // RELATIVE ACTIONS - much easier to learn!
    const directions = ['up', 'right', 'down', 'left']
    const currentIndex = directions.indexOf(this.direction)

    this.lastTurnDelta = 0
    if (action === 'forward') {
      return
    } else if (action === 'left') {
      this.lastTurnDelta = 1
      this.direction = directions[(currentIndex + 3) % 4]
    } else if (action === 'right') {
      this.lastTurnDelta = -1
      this.direction = directions[(currentIndex + 1) % 4]
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

    // Reset cached stats before re-evaluating
    this.cachedStats = null

    const seeds = this.evaluationSeeds || []

    // Run multiple games and average fitness for CONSISTENCY!
    let totalScore = 0
    let totalFoodEaten = 0
    let totalSteps = 0
    let allVisited = new Set()
    let sumVisitedCounts = 0
    let maxFoodEaten = -Infinity
    let bestRunSteps = 0
    let bestVisitedSet = null

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

      let score = 0
      const size = this.foodEaten  // Snake size (foods eaten)

      // ⏱️ TIME-DECAY: Use actual values collected during game!
      // Each food was worth a different amount based on speed
      const foodReward = this.foodValues.reduce((sum, val) => sum + val, 0)
      score += foodReward

      // 🎯 SPEED BONUS: Extra reward for consistently fast eating!
      if (size >= 3) {
        const avgValue = foodReward / size
        // If average food value > 7000, give bonus (means consistently fast!)
        if (avgValue > 7000) {
          score += 10000 * size  // LEGENDARY speed bonus!
        }
      }

      // 🏆 BONUS: Long snakes get HUGE multiplier!
      if (size >= 10) {
        score += size * 5000  // Double reward for 10+!
      }
      if (size >= 20) {
        score += size * 10000  // Triple reward for 20+!
      }

      // 🎯 ADAPTIVE STRATEGY based on snake size!
      if (size < 6) {
        // 🚀 SMALL SNAKE: Be AGGRESSIVE! Focus ONLY on food!
        score += this.stepsCloser * 1500  // Reward approaching food
        score -= this.stepsFarther * 100  // HARSH penalty for moving away!

        // NO exploration rewards yet - just get food!
        // (Speed rewards are now handled by time-decay multiplier above)

        // Small survival reward only if actually eating
        if (size > 0) {
          score += this.steps * 2  // Very small
        }
      } else if (size < 16) {
        // ⚖️ MEDIUM SNAKE: Balance aggression with caution
        score += this.stepsCloser * 800
        score -= this.stepsFarther * 30

        // Small exploration reward (but food is still 100x more important!)
        score += this.visited.size * 50  // Reduced from 100
        score += this.steps * 5  // Small survival bonus
      } else {
        // 🐉 LARGE SNAKE: SURVIVAL MODE! Now exploration matters!
        score += this.steps * 50  // Survival important
        score += this.visited.size * 200  // Zig-zag exploration
        score += this.stepsCloser * 400

        // Mega bonus for epic endgame survival
        if (this.steps >= 300) {
          score += 50000  // LEGEND status!
        }
      }

      // 📍 Reward for getting close (important for learning!)
      if (this.closestToFood < Infinity) {
        const maxDist = GRID_SIZE * 2
        const proximity = (maxDist - this.closestToFood) * 300
        score += size < 6 ? proximity * 2 : proximity
      }

      // 🛡️ MEGA BONUS: Survived long with big body!
      if (this.snake.length >= 10 && this.steps >= 200) {
        score += 30000  // Avoiding self-collision is HARD!
      }

      totalScore += score

      // 📊 Track stats across ALL runs (for REALISTIC average!)
      totalFoodEaten += this.foodEaten
      totalSteps += this.steps
      sumVisitedCounts += this.visited.size
      for (const tile of this.visited) {
        allVisited.add(tile)
      }

      if (
        run === 0 ||
        this.foodEaten > maxFoodEaten ||
        (this.foodEaten === maxFoodEaten && this.visited.size > (bestVisitedSet?.size || 0)) ||
        (this.foodEaten === maxFoodEaten && this.visited.size === (bestVisitedSet?.size || 0) && this.steps > bestRunSteps)
      ) {
        maxFoodEaten = this.foodEaten
        bestRunSteps = this.steps
        bestVisitedSet = new Set(this.visited)
      }
    }

    const avgFood = totalFoodEaten / FITNESS_RUNS
    const avgSteps = totalSteps / FITNESS_RUNS
    const avgTiles = sumVisitedCounts / FITNESS_RUNS

    // 📈 Persist best-run stats for reporting / champion export
    this.foodEaten = maxFoodEaten
    this.steps = bestRunSteps
    this.visited = bestVisitedSet ? new Set(bestVisitedSet) : new Set(this.visited)
    const tilesBest = this.visited.size

    const baseScore = Math.floor(totalScore / FITNESS_RUNS)
    const bestRunBonus =
      (maxFoodEaten ** 2) * 3000 +           // Supercharge best food count
      tilesBest * 150 +                      // Exploration in best run
      bestRunSteps * 40                      // Survival credit

    const finalScore = baseScore + bestRunBonus

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
class ReplaySnakeAI extends SnakeAI {
  constructor(options) {
    super(options)
    this.currentSensors = Array(SENSOR_NAMES.length).fill(0)
    this.neuronSnapshot = []
    this.actionHistory = []
    this.maxActionHistory = 20
    this.connectedSensorIds = new Set()
    this.connectedNeuronIds = new Set()
    this.lastActionTelemetry = {
      actions: ACTION_NAMES.map(() => ({ raw: 0, activated: 0, selected: false })),
      selectedIndex: null
    }
    this.sensorTickMap = new Map()
    for (const sensor of this._sensors || []) {
      if (!sensor) continue
      const sensorId = typeof sensor.id === 'number' ? sensor.id : null
      if (sensorId === null) continue
      if (typeof sensor.tick === 'function') {
        this.sensorTickMap.set(sensorId, sensor.tick)
      }
    }

    this.computeConnectivityMaps()
  }

  computeConnectivityMaps() {
    const sensors = this.brain?.definitions?.sensors ?? {}
    const neurons = this.brain?.definitions?.neurons ?? {}

    Object.values(sensors).forEach((vertex, idx) => {
      const metaId = Number.isInteger(vertex?.metadata?.id)
        ? vertex.metadata.id
        : parseInt(typeof vertex?.name === 'string' ? vertex.name.replace(/[^0-9]/g, '') : '', 10)
      const sensorId = Number.isInteger(metaId) && metaId >= 0 ? metaId : idx
      if ((vertex?.out?.length ?? 0) > 0) {
        this.connectedSensorIds.add(sensorId)
      }
    })

    Object.values(neurons).forEach((vertex, idx) => {
      const hasIn = (vertex?.in?.length ?? 0) > 0
      const hasOut = (vertex?.out?.length ?? 0) > 0
      if (hasIn || hasOut) {
        this.connectedNeuronIds.add(idx)
      }
    })
  }

  tick() {
    const result = super.tick()
    this.captureActionTelemetry(result)
    return result
  }

  captureActionTelemetry(result) {
    const actionsInfo = []
    let selectedIndex = null
    const currentGen = this.brain.tickGeneration

    for (let i = 0; i < ACTION_NAMES.length; i++) {
      const vertex = this.getActionVertex(i)
      if (!vertex) {
        actionsInfo.push({ raw: 0, activated: 0, selected: false })
        continue
      }

      const raw = vertex.calculateInput(currentGen) + (vertex.metadata.bias || 0)
      const activated = this.brain.activationFunction(raw)
      const vertexName = vertex.name
      const selected = !!(result && Object.prototype.hasOwnProperty.call(result, vertexName))
      if (selected) {
        selectedIndex = i
      }
      actionsInfo.push({ raw, activated, selected })
    }

    if (selectedIndex === null && actionsInfo.length > 0) {
      let maxIdx = 0
      let maxValue = actionsInfo[0].raw
      for (let i = 1; i < actionsInfo.length; i++) {
        if (actionsInfo[i].raw > maxValue) {
          maxValue = actionsInfo[i].raw
          maxIdx = i
        }
      }
      actionsInfo[maxIdx].selected = true
      selectedIndex = maxIdx
    }

    this.lastActionTelemetry = {
      actions: actionsInfo,
      selectedIndex
    }

    if (selectedIndex !== null) {
      const historySymbol =
        ACTION_HISTORY_SYMBOLS[selectedIndex] ||
        (ACTION_NAMES[selectedIndex] ? ACTION_NAMES[selectedIndex][0].toUpperCase() : `A${selectedIndex}`)
      this.actionHistory.push(historySymbol)
      if (this.actionHistory.length > this.maxActionHistory) {
        this.actionHistory.shift()
      }
    }
  }

  updateSensorSnapshot() {
    const snapshot = []
    for (let i = 0; i < SENSOR_NAMES.length; i++) {
      let value

      const rawTick = this.sensorTickMap?.get(i)
      if (typeof rawTick === 'function') {
        try {
          value = rawTick.call(this)
        } catch {
          value = undefined
        }
      }

      if (!Number.isFinite(value)) {
        const vertex = this.getSensorVertex(i)
        if (vertex) {
          const sensorDef = this.brain?.sensors?.[vertex.name]
          if (sensorDef && typeof sensorDef.tick === 'function') {
            try {
              value = sensorDef.tick.call(this)
            } catch {
              value = undefined
            }
          }

          if (!Number.isFinite(value) && typeof vertex._originalTick === 'function') {
            try {
              value = vertex._originalTick.call(vertex)
            } catch {
              value = undefined
            }
          }

          if (!Number.isFinite(value) && typeof vertex.tick === 'function') {
            try {
              value = vertex.tick()
            } catch {
              value = undefined
            }
          }
        }
      }

      const numericValue = Number.isFinite(value) ? value : 0
      snapshot.push(numericValue)
    }
    this.currentSensors = snapshot
    this.updateNeuronSnapshot()
  }

  updateNeuronSnapshot() {
    const neurons = this.brain?.definitions?.neurons ?? {}
    const entries = Object.values(neurons)
    const baseCount = REPLAY_NEURON_COUNT || 0
    const count = Math.max(baseCount, entries.length)
    const snapshot = Array(count).fill(0)

    const currentGen = this.brain?.tickGeneration ?? 0
    entries.forEach((vertex, idx) => {
      let value = vertex?.cache?.value
      if (vertex && vertex.cache?.generation !== currentGen && typeof vertex.getCachedOrCalculate === 'function') {
        value = vertex.getCachedOrCalculate(currentGen)
      }
      if (idx < snapshot.length) {
        snapshot[idx] = Number.isFinite(value) ? value : 0
      }
    })

    this.neuronSnapshot = snapshot
  }

  formatNumber(value) {
    return Number.isFinite(value) ? value.toFixed(2) : '0.00'
  }

  formatSensorCell(index, value) {
    const label = SENSOR_NAMES[index] || `Sensor ${index}`
    const width = 18
    const paddedLabel = label.length > width
      ? `${label.slice(0, width - 1)}…`
      : label.padEnd(width, ' ')
    const coloredLabel = this.connectedSensorIds.has(index)
      ? `${YELLOW}${paddedLabel}${RESET}`
      : paddedLabel
    return `[${String(index).padStart(2, '0')}] ${coloredLabel} ${this.formatNumber(value).padStart(6, ' ')}`
  }

  formatSensorRows() {
    const rows = []
    const values = this.currentSensors || []
    const columnCount = 3
    for (let i = 0; i < SENSOR_NAMES.length; i += columnCount) {
      const left = this.formatSensorCell(i, values[i] ?? 0)
      const segments = [left]
      for (let offset = 1; offset < columnCount; offset++) {
        const idx = i + offset
        if (idx < SENSOR_NAMES.length) {
          segments.push(this.formatSensorCell(idx, values[idx] ?? 0))
        }
      }
      rows.push(segments.join('   '))
    }
    return rows
  }

  formatNeuronCell(index, value, maxAbs) {
    const abs = Math.abs(value)
    let symbol = '⚫'
    if (abs > 1e-4) {
      const normalized = maxAbs > 0 ? abs / maxAbs : abs
      if (normalized < 0.35) {
        symbol = '⚪'
      } else if (normalized < 0.8) {
        symbol = '🟢'
      } else {
        symbol = '🔴'
      }
    }
    const label = `n${String(index).padStart(2, '0')}`
    const coloredLabel = this.connectedNeuronIds.has(index)
      ? `${YELLOW}${label}${RESET}`
      : label
    return `[${coloredLabel}] ${symbol} ${this.formatNumber(value).padStart(6, ' ')}`
  }

  formatNeuronRows() {
    const values = this.neuronSnapshot || []
    if (!values.length) return ['(no neurons)']

    let maxAbs = 0
    for (const value of values) {
      const abs = Math.abs(value)
      if (abs > maxAbs) maxAbs = abs
    }
    if (maxAbs < 1e-6) maxAbs = 1

    const rows = []
    const columns = 5
    for (let i = 0; i < values.length; i += columns) {
      const cells = []
      for (let j = 0; j < columns && (i + j) < values.length; j++) {
        const idx = i + j
        cells.push(this.formatNeuronCell(idx, values[idx], maxAbs))
      }
      rows.push(cells.join('    '))
    }
    return rows
  }

  formatActionLines() {
    const lines = []
    const actions = this.lastActionTelemetry?.actions || []
    for (let i = 0; i < ACTION_NAMES.length; i++) {
      const info = actions[i] || { raw: 0, activated: 0, selected: false }
      const marker = info.selected
        ? (info.activated >= 0 ? '🟢' : '🔴')
        : '⚫'
      const name = (ACTION_NAMES[i] || `Action ${i}`).padEnd(8, ' ')
      lines.push(`${marker} ${name} in:${this.formatNumber(info.raw)} act:${this.formatNumber(info.activated)}`)
    }
    return lines
  }

  formatActionHistory() {
    if (!this.actionHistory.length) {
      return 'History: (none yet)'
    }
    const total = this.actionHistory.length
    const start = Math.max(0, total - this.maxActionHistory)
    const recent = this.actionHistory.slice(start)
    return `History: ${recent.join(' ')}`
  }

  getSensorVertex(id) {
    const sensors = this.brain.definitions.sensors || {}
    return sensors[id] || sensors[String(id)] || Object.values(sensors).find(v => v.metadata?.id === id) || null
  }

  getActionVertex(id) {
    const actions = this.brain.definitions.actions || {}
    return actions[id] || actions[String(id)] || Object.values(actions).find(v => v.metadata?.id === id) || null
  }

  render() {
    const useEmoji = process.stdout.columns ? process.stdout.columns > 60 : false
    const headChars = { up: '^', down: 'v', left: '<', right: '>' }
    const boardLines = []
    const topBorder = useEmoji ? '┌' + '─'.repeat(GRID_SIZE * 2 + 1) + '┐' : '┌' + '─'.repeat(GRID_SIZE) + '┐'
    boardLines.push(topBorder)

    for (let y = 0; y < GRID_SIZE; y++) {
      let row = useEmoji ? '│ ' : '│'
      for (let x = 0; x < GRID_SIZE; x++) {
        if (x === this.head.x && y === this.head.y) {
          if (useEmoji) {
            const emojiHeads = { up: '⬆️ ', down: '⬇️ ', left: '⬅️ ', right: '➡️ ' }
            row += emojiHeads[this.direction] || '🐍 '
          } else {
            row += headChars[this.direction] || '@'
          }
        } else if (this.isOnSnake(x, y)) {
          row += useEmoji ? '🟩' : 'o'
        } else if (x === this.food.x && y === this.food.y) {
          row += useEmoji ? '🍎' : '*'
        } else {
          row += useEmoji ? '· ' : '.'
        }
      }
      row += useEmoji ? ' │' : '│'
      boardLines.push(row)
    }

    const bottomBorder = useEmoji ? '└' + '─'.repeat(GRID_SIZE * 2 + 1) + '┘' : '└' + '─'.repeat(GRID_SIZE) + '┘'
    boardLines.push(bottomBorder)

    const selectedIdx = this.lastActionTelemetry?.selectedIndex
    const selectedName = selectedIdx != null
      ? (ACTION_NAMES[selectedIdx] || `Action ${selectedIdx}`)
      : '-'

    const infoLines = [
      `Food   : ${this.foodEaten}`,
      `Length : ${this.snake.length}`,
      `Steps  : ${this.steps}/${MAX_STEPS}`,
      `Level  : ${CURRICULUM_LEVEL}`,
      `Config : ${GRID_SIZE}x${GRID_SIZE}`,
      `Last Act: ${selectedName}`
    ]

    if (this.deathReason) {
      infoLines.push(`Death  : ${this.deathReason}`)
    }

    const actionLines = this.formatActionLines()
    const sensorLines = this.formatSensorRows()
    const neuronLines = this.formatNeuronRows()
    const historyLine = this.formatActionHistory()

    const leftPanel = [
      ...infoLines,
      '',
      'Actions:',
      ...actionLines,
      '',
      historyLine,
      '',
      'Sensors:',
      ...sensorLines,
      '',
      'Neurons:',
      ...neuronLines,
      '',
      'Neuron legend: ⚫ idle  ⚪ weak  🟢 active  🔴 saturated',
      'Connected nodes shown in yellow'
    ]

    const boardWidth = boardLines[0].length
    const infoWidth = leftPanel.reduce((max, line) => Math.max(max, visibleLength(line)), 0)
    const maxLines = Math.max(boardLines.length, leftPanel.length)

    let output = '\x1b[2J\x1b[H'
    for (let i = 0; i < maxLines; i++) {
      const rawLine = leftPanel[i] || ''
      const padding = Math.max(0, infoWidth - visibleLength(rawLine))
      const infoSegment = rawLine + ' '.repeat(padding)
      const boardSegment = (boardLines[i] || ' '.repeat(boardWidth))
      output += infoSegment + '          ' + boardSegment + '\n'
    }

    process.stdout.write(output)
  }
}

async function watchSnake(snake) {
  if (CURRICULUM_LEVEL === 5) {
    resetLevel5GridCycle()
  }
  if (typeof snake.applyCurriculumGrid === 'function') {
    snake.applyCurriculumGrid()
  }
  snake.reset()
  snake.updateSensorSnapshot()
  snake.render()

  while (snake.alive && snake.steps < MAX_STEPS) {
    await new Promise(resolve => setTimeout(resolve, WATCH_SPEED))

    snake.tick()
    snake.move()
    snake.steps++
    snake.stepsWithCurrentFood = (snake.stepsWithCurrentFood || 0) + 1

    if (!snake.alive) break

    snake.updateSensorSnapshot()
    snake.render()
  }

  if (snake.alive && snake.steps >= MAX_STEPS) {
    snake.alive = false
    snake.deathReason = `⏱️  Reached max steps (${MAX_STEPS})`
  }

  snake.render()

  const summaryLines = [
    '',
    '🏁 GAME OVER',
    snake.deathReason ? snake.deathReason : "⏱️  TIME'S UP!",
    '',
    '📊 Final Stats',
    `   🍎 Food eaten : ${snake.foodEaten}`,
    `   📏 Length     : ${snake.snake.length}`,
    `   🚶 Steps      : ${snake.steps}/${MAX_STEPS}`,
    `   🗺️  Tiles      : ${snake.visited.size}/${GRID_SIZE * GRID_SIZE}`,
    ''
  ]

  process.stdout.write(summaryLines.join('\n'))
}

async function replay() {
  const requestedPath = process.argv[2]
  const filePath = requestedPath
    ? path.resolve(process.cwd(), requestedPath)
    : DEFAULT_CHAMPION_FILE

  if (!fs.existsSync(filePath)) {
    console.error(`❌ File not found: ${filePath}`)
    console.log('\nUsage: node docs/examples/games/snake-replay.js [champion-file.json]')
    console.log(`Default: ${DEFAULT_CHAMPION_FILE}\n`)
    process.exit(1)
  }

  const championData = JSON.parse(fs.readFileSync(filePath, 'utf-8'))
  const championConfig = championData.config || {}
  REPLAY_NEURON_COUNT = championConfig.neurons || REPLAY_NEURON_COUNT

  if (Array.isArray(championConfig.sensorNames) && championConfig.sensorNames.length > 0) {
    SENSOR_NAMES = championConfig.sensorNames
  } else {
    SENSOR_NAMES = [...DEFAULT_SENSOR_NAMES]
  }

  if (Array.isArray(championConfig.actionNames) && championConfig.actionNames.length > 0) {
    ACTION_NAMES = championConfig.actionNames
  } else {
    ACTION_NAMES = [...DEFAULT_ACTION_NAMES]
  }

  configureReplayEnvironment({
    gridSize: championConfig.gridSize ?? GRID_SIZE,
    maxSteps: championConfig.maxSteps ?? MAX_STEPS,
    level: (championData.stats && championData.stats.curriculumLevel) ?? CURRICULUM_LEVEL
  })

  const genome = Genome.from(championData.genome)

  const snake = new ReplaySnakeAI({
    genome,
    neurons: championConfig.neurons || REPLAY_NEURON_COUNT
  })

  await watchSnake(snake)
}

if (process.argv[1] === fileURLToPath(import.meta.url)) {
  replay().catch(err => {
    console.error('ERROR:', err)
    console.error(err.stack)
  })
}

export { ReplaySnakeAI, watchSnake, configureReplayEnvironment }
