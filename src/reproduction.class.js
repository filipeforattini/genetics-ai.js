import { isString, random } from "lodash-es"

import { Base } from "./base.class"
import { Genome } from "./genome.class"

export class Reproduction {

  static genomeMutate (genome, rate = 1/1000) {
    if (isString(genome)) {
      return genome.split('')
        .map(base => {
          return Math.random() > rate
            ? base
            : random(0, 31).toString(32).toUpperCase()
        })
        .join('')
    }

    genome.bases.map(base => {
      return Math.random() > rate
        ? base
        : Base.random()
    })

    return Genome.fromBases(genome.bases)
  }

}