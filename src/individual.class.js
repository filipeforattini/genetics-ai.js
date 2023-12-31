import { merge } from "lodash-es"
import { Brain } from "./brain.class.js"
import { Genome } from "./genome.class.js"

export class Individual {
  constructor({
    genome = null,
    sensors = [],
    actions = [],
    environment = {},
  }) {
    const g = Genome.from(genome)
    this.genome = g

    this.brain = new Brain({
      sensors,
      actions,
      genome: g,
      environment: merge({}, environment, {
        me: this,
        individual: this,
      }),
    })
  }

  tick() {
    return this.brain.tick()
  }
}
