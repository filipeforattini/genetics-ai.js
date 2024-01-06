import { merge } from "lodash-es"

import { Brain } from "./brain.class.js"
import { Genome } from "./genome.class.js"
import { Reproduction } from "./reproduction.class.js"

export class Individual {
  constructor({
    genome = null,
    sensors = [],
    actions = [],
    environment = {},
  }) {
    this.genome = Genome.from(genome)
    const env = merge({ me: this }, environment)

    this.brain = new Brain({
      sensors,
      actions,
      genome: this.genome,
      environment: env,
    })

    this.reproduce = {
      asexual: {
        fission: (mutationRate = 1/1000) => new Individual({
          sensors,
          actions,
          environment: env,
          genome: Reproduction.genomeMutate(this.genome, mutationRate),
        })
      }
    }
  }

  tick() {
    return this.brain.tick()
  }
}
