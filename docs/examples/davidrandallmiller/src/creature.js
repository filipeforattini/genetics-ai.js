import crypto from 'crypto'
import { chunk, random } from "lodash-es";

import { actions } from "./actions.js";
import { sensors } from "./sensors.js";
import { Genome, Individual } from "../../../src/index.js";

let i = 1

export class Creature {
  constructor(options) {
    this.age = 0
    this.id = i++
    this.steps = 0
    this.born = false
    this.dead = false
    this.direction = null
    this.world = options.world
    this.genome = options.genome
    this.position = this.world.randomPosition()

    this.individual = new Individual({
      ...options,
      actions,
      sensors,
      
      environment: {
        me: this,
        world: options.world
      },

      hooks: {
        ...(options.hooks || {}),
        beforeTick() {
          if (!this.born) {
            this.fitness = 0
            this.born = true

            if (this.world.canMove(this.position)) this.world.ocupay(this.position)
            else this.dead = true
          }
        },
      }
    })
  }

  from(...args) {
    return new Creature(...args)
  }

  static async fromWithColors(...args) {
    const c = new Creature(...args)
    c.color = await Genome.color(c.genome)
    return c
  }

  static fromRandom({ world, id }) {
    return new Creature({
      id,
      world,
      sensors,
      actions,
      position: world.randomPosition(),
      genome: Genome.randomWith(10, {
        neurons: 4,
        sensors: sensors.length,
        actions: actions.length,
      }),
    })
  }

  static color(encodedGenome) {
    let color = [0, 0, 0, 0]
    const md5 = crypto.createHash('md5').update(encodedGenome).digest("hex")

    for (const [i, str] of Object.entries(chunk(md5.split(''), 8))) {
      for (const char of str) {
        color[i] += parseInt(char, 36)
      }

      color[i] = Math.floor((color[i] / (36 * 8)) * 255)
    }

    return color
  }

  tick() {
    return this.individual.tick()
  }

  move(direction = null) {
    if (this.dead) return

    const tryPosition = { ...this.position }
    const tryDirection = direction || this.direction || ['up', 'down', 'left', 'right'][random(0, 3)]

    if (tryDirection === 'up') tryPosition.y -= 1
    else if (tryDirection === 'down') tryPosition.y += 1
    else if (tryDirection === 'left') tryPosition.x -= 1
    else if (tryDirection === 'right') tryPosition.x += 1

    if (this.world.canMove(tryPosition)) {
      this.world.ocupay(tryPosition, this.id)
      this.world.release(this.position)
      this.position = tryPosition
      this.steps += 1
    }
  }
}
