import { Individual } from '../../../src/index.js'
import fs from 'fs'

// Import SnakeAI class from snake.js
const GRID_SIZE = 10
const MAX_STEPS = 500  // Match training max steps
const FITNESS_RUNS = 3
let CURRICULUM_LEVEL = 1

class SnakeAI extends Individual {
  constructor(options) {
    super({
      ...options,
      sensors: [
        { id: 0, tick: () => this.isFoodInDirection('forward') },
        { id: 1, tick: () => this.isFoodInDirection('left') },
        { id: 2, tick: () => this.isFoodInDirection('right') },
        { id: 3, tick: () => this.getDangerDistance('forward') },
        { id: 4, tick: () => this.getDangerDistance('left') },
        { id: 5, tick: () => this.getDangerDistance('right') },
        { id: 6, tick: () => {
          if (!this.head || !this.food) return 0.5
          const dist = Math.abs(this.food.x - this.head.x) + Math.abs(this.food.y - this.head.y)
          return 1 - (dist / (GRID_SIZE * 2))
        }},
        { id: 7, tick: () => Math.min(this.snake.length / (GRID_SIZE * 2), 1) },
        { id: 8, tick: () => {
          if (!this.head) return 0.5
          let freeCount = 0
          const directions = [
            [-1, 0], [1, 0], [0, -1], [0, 1],
            [-1, -1], [1, -1], [-1, 1], [1, 1]
          ]
          for (const [dx, dy] of directions) {
            const x = this.head.x + dx
            const y = this.head.y + dy
            if (x >= 0 && x < GRID_SIZE && y >= 0 && y < GRID_SIZE && !this.isOnSnake(x, y)) {
              freeCount++
            }
          }
          return freeCount / 8
        }},
        { id: 9, tick: () => {
          if (!this.head) return 0.5
          const distToEdge = Math.min(
            this.head.x, this.head.y,
            GRID_SIZE - 1 - this.head.x,
            GRID_SIZE - 1 - this.head.y
          )
          return Math.min(distToEdge / (GRID_SIZE / 2), 1)
        }}
      ],
      actions: [
        { id: 0, tick: () => this.turn('forward') },
        { id: 1, tick: () => this.turn('left') },
        { id: 2, tick: () => this.turn('right') }
      ]
    })
    this.head = { x: 5, y: 5 }
    this.food = { x: 8, y: 8 }
    this.snake = []
    this.deathReason = null
  }

  reset() {
    this.snake = [{ x: 1, y: 3 }]
    this.head = this.snake[0]
    this.direction = 'right'
    this.food = this.spawnFoodCurriculum(true)
    this.foodEaten = 0
    this.steps = 0
    this.alive = true
    this.visited = new Set()
    this.closestToFood = Infinity
    this.lastDistance = Math.abs(this.food.x - this.head.x) + Math.abs(this.food.y - this.head.y)
    this.stepsCloser = 0
    this.stepsFarther = 0
    this.deathReason = null
  }

  spawnFoodCurriculum(isFirstFood = false) {
    const positions = {
      1: [{ x: 2, y: 3 }, { x: 3, y: 3 }, { x: 4, y: 3 }],
      2: [{ x: 4, y: 3 }, { x: 1, y: 1 }, { x: 1, y: 5 }, { x: 0, y: 3 }],
      3: [
        { x: 4, y: 3 }, { x: 1, y: 1 }, { x: 1, y: 5 }, { x: 0, y: 3 },
        { x: 4, y: 1 }, { x: 4, y: 5 }, { x: 0, y: 1 }, { x: 0, y: 5 }
      ]
    }

    if (CURRICULUM_LEVEL <= 3) {
      const levelPositions = positions[CURRICULUM_LEVEL]
      const food = levelPositions[Math.floor(Math.random() * levelPositions.length)]
      if (!this.isOnSnake(food.x, food.y)) return food
    }

    let attempts = 0
    while (attempts < 100) {
      const x = Math.floor(Math.random() * GRID_SIZE)
      const y = Math.floor(Math.random() * GRID_SIZE)
      if (!this.isOnSnake(x, y)) return { x, y }
      attempts++
    }
    return { x: GRID_SIZE - 1, y: GRID_SIZE - 1 }
  }

  isFoodInDirection(dir) {
    if (!this.head || !this.food) return 0
    const targetPos = this.getRelativeDirection(dir)
    const dx = Math.sign(this.food.x - this.head.x)
    const dy = Math.sign(this.food.y - this.head.y)
    if (dx === targetPos.x && dy === targetPos.y) return 1
    if (targetPos.x !== 0 && dx === targetPos.x) return 0.5
    if (targetPos.y !== 0 && dy === targetPos.y) return 0.5
    return 0
  }

  getDangerDistance(dir) {
    if (!this.head) return 0
    const targetPos = this.getRelativeDirection(dir)
    let distance = 0
    let x = this.head.x
    let y = this.head.y
    while (distance < GRID_SIZE) {
      x += targetPos.x
      y += targetPos.y
      if (x < 0 || x >= GRID_SIZE || y < 0 || y >= GRID_SIZE) return 1 - (distance / GRID_SIZE)
      if (this.isOnSnake(x, y)) return 1 - (distance / GRID_SIZE)
      distance++
    }
    return 0
  }

  getRelativeDirection(relDir) {
    const dirs = {
      'up': { x: 0, y: -1 }, 'down': { x: 0, y: 1 },
      'left': { x: -1, y: 0 }, 'right': { x: 1, y: 0 }
    }
    const current = dirs[this.direction]
    if (relDir === 'forward') return current
    if (relDir === 'left') {
      if (this.direction === 'up') return dirs.left
      if (this.direction === 'down') return dirs.right
      if (this.direction === 'left') return dirs.down
      return dirs.up
    }
    if (relDir === 'right') {
      if (this.direction === 'up') return dirs.right
      if (this.direction === 'down') return dirs.left
      if (this.direction === 'left') return dirs.up
      return dirs.down
    }
    return current
  }

  turn(relDir) {
    if (relDir === 'forward') return
    const turns = {
      'up': { left: 'left', right: 'right' },
      'down': { left: 'right', right: 'left' },
      'left': { left: 'down', right: 'up' },
      'right': { left: 'up', right: 'down' }
    }
    if (turns[this.direction] && turns[this.direction][relDir]) {
      this.direction = turns[this.direction][relDir]
    }
  }

  isOnSnake(x, y) {
    return this.snake.some(s => s.x === x && s.y === y)
  }

  playGame() {
    this.reset()
    while (this.alive && this.steps < MAX_STEPS) {
      this.tick()
      const dir = this.getRelativeDirection('forward')
      const newHead = { x: this.head.x + dir.x, y: this.head.y + dir.y }

      if (newHead.x < 0 || newHead.x >= GRID_SIZE || newHead.y < 0 || newHead.y >= GRID_SIZE) {
        this.alive = false
        this.deathReason = 'wall'
        break
      }

      if (this.isOnSnake(newHead.x, newHead.y)) {
        this.alive = false
        this.deathReason = 'self'
        break
      }

      this.snake.unshift(newHead)
      this.head = newHead

      if (newHead.x === this.food.x && newHead.y === this.food.y) {
        this.foodEaten++
        this.food = this.spawnFoodCurriculum(false)
      } else {
        this.snake.pop()
      }

      this.visited.add(`${newHead.x},${newHead.y}`)
      this.steps++
    }
  }
}

// Load champion
const championData = JSON.parse(fs.readFileSync('docs/examples/games/snake-champion.json', 'utf-8'))
CURRICULUM_LEVEL = championData.stats.curriculumLevel || 1

console.log('🧪 TESTING CHAMPION WITH CORRECTED GENOME LOADING\n')
console.log(`Champion from Gen ${championData.stats.generation}`)
console.log(`Training stats: ${championData.stats.foodEaten} foods\n`)

// Create snake with CORRECT parameter name
const snake = new SnakeAI({
  genome: championData.genome,
  neurons: 50
})

console.log(`Genome loaded: ${snake.genome.bases.length} bases\n`)

// Run 5 test games
console.log('Running 5 test games...\n')
const results = []
for (let i = 0; i < 5; i++) {
  snake.playGame()
  results.push({
    foodEaten: snake.foodEaten,
    steps: snake.steps,
    tilesExplored: snake.visited.size
  })
  console.log(`Game ${i + 1}: ${snake.foodEaten} foods, ${snake.steps} steps, ${snake.visited.size} tiles`)
}

console.log('\n📊 RESULTS:')
const avgFood = results.reduce((sum, r) => sum + r.foodEaten, 0) / results.length
const avgSteps = results.reduce((sum, r) => sum + r.steps, 0) / results.length
const avgTiles = results.reduce((sum, r) => sum + r.tilesExplored, 0) / results.length

console.log(`   Average food eaten: ${avgFood.toFixed(1)}`)
console.log(`   Average steps: ${avgSteps.toFixed(0)}`)
console.log(`   Average tiles explored: ${avgTiles.toFixed(0)}`)
console.log(`\n   Training claimed: ${championData.stats.foodEaten} foods`)
console.log(`   Replay achieved: ${avgFood.toFixed(1)} foods`)

if (avgFood >= championData.stats.foodEaten * 0.5) {
  console.log('\n✅ SUCCESS! Replay performance matches training!')
} else {
  console.log('\n❌ STILL UNDERPERFORMING (but better than before)')
}
