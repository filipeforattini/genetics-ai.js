import { merge, random, first, take, takeRight } from "lodash-es"

import { sensors } from "./sensors.js"
import { actions } from "./actions.js"
import { Creature } from "./creature.js"
import { Generation } from "../../../src/generation.class.js"

export class World {
  constructor({
    worldConfig,
    generationConfig,
    individualConfig,
  }) {
    this.obstacles = []
    this.size = worldConfig.size
    this.simulation = worldConfig.simulation
    this.hasObstacles = worldConfig.hasObstacles
    this.generationTicks = worldConfig.generationTicks

    this.generationsConfig = {
      size: generationConfig.populationSize,

      individualClass: Creature,
      individualNeurons: individualConfig.neuronsCount,
      individualGenomeSize: individualConfig.genomeSize,

      individualArgs: {
        sensors,
        actions,
        world: this,
        environment: { world: this },
      },
    };

    this.generations = {
      count: 0,
      current: null,
      previous: null,
    }

    this.resetGrid()
  }

  static from(...args) {
    return new World(...args)
  }

  resetGrid() {
    this.obstacles = []
    this.grid = new Array(this.size).fill(null).map(() => new Array(this.size).fill(null).map(() => 0))

    if (this.hasObstacles) {
      const obstacles = Math.floor(random(this.size / 8, this.size / 3)) + 1

      for (let i = 0; i < obstacles; i++) {
        const p = {
          x: random(0, this.size - 1),
          y: random(0, this.size - 1),
        }

        const positions = [
          p,
          { x: p.x, y: p.y - 1 },
          { x: p.x + 1, y: p.y - 1 },
          { x: p.x + 1, y: p.y },
        ].filter(x => this.canMove(x))

        positions.forEach(p => this.ocupay(p, -1))
        this.obstacles = this.obstacles.concat(positions)
      }
    }
  }

  randomPosition() {
    let position = null

    while (position === null || !this.canMove(position)) {
      position = {
        x: random(0, this.size - 1),
        y: random(0, this.size - 1),
      }
    }

    return position
  }

  canMove({ x, y }) {
    if (x < 0 || x >= this.size) return false
    if (y < 0 || y >= this.size) return false
    if (this.grid[y][x] !== 0) return false
    return true
  }

  ocupay({ x, y }, id) {
    this.grid[y][x] = id
  }

  release({ x, y }) {
    this.grid[y][x] = 0
  }

  initializeGeneration() {
    this.resetGrid()
    const world = this

    delete this.generations.previous
    delete this.generations.current
    this.generations.previous = null

    this.generations.current = Generation.from(merge(
      this.generationsConfig,
      {
        individualArgs: {
          hooks: {
            beforeTick() {
              console.log(this)
              if (this.dead) return
            },

            afterTick() {
              this.age = (this.age || 0) + 1
            }
          }
        },

        hooks: {
          beforeNext() {
            for (const ind of this.population) {
                ind.dead = true
                ind.fitness = 0

                if (world.simulation.includes('north') && (ind.position.y / (world.size - 1)) < 0.1) {
                  ind.dead = false
                  ind.fitness += ((world.size - 1) - ind.position.y) / (world.size - 1)
                }

                if (world.simulation.includes('south') && (ind.position.y / (world.size - 1)) > 0.9) {
                  ind.dead = false
                  ind.fitness += ind.position.y / (world.size - 1)
                }

                if (world.simulation.includes('east') && (ind.position.x / (world.size - 1)) < 0.1) {
                  ind.dead = false
                  ind.fitness += ((world.size - 1) - ind.position.x) / (world.size - 1)
                }

                if (world.simulation.includes('west') && (ind.position.x / (world.size - 1)) > 0.9) {
                  ind.dead = false
                  ind.fitness += ind.position.x / (world.size - 1)
                }

                ind.fitness = ind.fitness / world.simulation.length
              if ((ind.position.y / (world.size - 1)) < 0.9) {
                ind.dead = true
                ind.fitness = 0
              } else {
                ind.fitness = ind.position.y / (world.size - 1)
              }
            }

            this.population = this.population.sort((a, b) => b.fitness - a.fitness)

            this.meta.fitAverage = this.population.reduce((acc, ind) => acc + ind.fitness, 0) / this.population.length
            this.meta.fitTop10 = take(this.population, Math.ceil(this.population.length * 0.1)).reduce((acc, ind) => acc + ind.fitness, 0) / Math.ceil(this.population.length * 0.1)
            this.meta.fitTop30 = take(this.population, Math.ceil(this.population.length * 0.3)).reduce((acc, ind) => acc + ind.fitness, 0) / Math.ceil(this.population.length * 0.3)
            this.meta.fitBest = first(this.population).fitness
          }
        }
      }
    ))

    this.generations.current.id = this.generations.count
    this.generations.count += 1
    this.generations.current.fillRandom()
  }

  multiTick(n = 100, draw = false) {
    for (let i = 1; i <= n; i++) {
      this.generations.current.tick()
      if (draw) this.consoleDraw()
    }
  }

  generationNext() {
    this.resetGrid()

    delete this.generations.previous
    const newGen = this.generations.current.next()
    this.generations.previous = this.generations.current
    delete this.generations.current
    this.generations.current = newGen
  }

  multiGeneration(n = 100) {
    for (let i = 1; i <= n; i++) {
      this.multiTick(this.generationTicks || 200, i % 10 === 0)
      this.generationNext()
    }
  }

  consoleDraw() {
    let canvas = new Array(this.size).fill(null).map(() => new Array(this.size).fill(null).map(() => '░'))

    if (this.simulation.includes('north')) {
      for (let i = 0; i < this.size; i++) {
        canvas[Math.floor(this.size * 0.1)][i] = '▓'
      }
    }

    if (this.simulation.includes('south')) {
      for (let i = 0; i < this.size; i++) {
        canvas[Math.floor(this.size * 0.9)][i] = '▓'
      }
    }

    if (this.simulation.includes('east')) {
      for (let i = 0; i < this.size; i++) {
        canvas[i][Math.floor(this.size * 0.1)] = '▓'
      }
    }

    if (this.simulation.includes('west')) {
      for (let i = 0; i < this.size; i++) {
        canvas[i][Math.floor(this.size * 0.9)] = '▓'
      }
    }

    this.obstacles.forEach(({ x, y }) => {
      canvas[y][x] = '█'
    })

    this.generations.current.population.forEach(({ position, id }) => {
      canvas[position.y][position.x] = '§'
    })

    canvas = canvas.map((row, i) => `${i.toString().padStart(3)} ` + row.join('')).join('\n')
    canvas += '\n   ' + new Array(Math.ceil(this.size / 10)).fill(null).map((_, i) => `${i.toString().padStart(2)}        `).join('')
    console.log(canvas)
  }
}
