import { isString, random } from "lodash-es"

import { Base } from "./base.class"
import { Genome } from "./genome.class"

export class Reproduction {

  static genomeMutate (genome, mutationRate = 1/1000) {
    if (isString(genome)) {
      const g = genome.split('')
        .map(base => {
          return Math.random() > mutationRate
            ? base
            : random(0, 31).toString(32).toUpperCase()
        })
        .join('')

      return Genome.fromString(g)
    }

    const bases = genome.bases.map(base => {
      return Math.random() > mutationRate
        ? base
        : Base.random()
    })

    return Genome.fromBases(bases)
  }

}