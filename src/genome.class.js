import { Base } from "./base.class.js"

import {
  toBin,
  shuffle,
  toBase32,
  randomInt,
  randomAlpha,
  fromBase32ToBin,
  fromBinToBase32,
  chunk,
} from "./concerns/index.js"

export class Genome {
  constructor({ bases = [], base32 = [], baseBin = [] } = {}) {
    this.bases = []
      .concat(baseBin.map(b => Base.fromBin(b)))
      .concat(base32.map(b => Base.fromBase32(b)))
      .concat(bases)

    this.nodes = this.getNodes()
    this.size = this.bases.length
    this.length = this.bases.length
  }

  static copy(genome) {
    const bases = genome.bases.map(b => new Base({ ...b }))
    return new this({ bases })
  }

  static random(size = 1) {
    const bases = new Array(size).fill(0).map(() => Base.random())
    return new this({ bases })
  }

  static mutateMicro(genome, { count = 1 } = {}) {
    let newGen = [...genome.toArray()]
    const size = newGen.length

    while (count-- > 0) {
      const i = randomInt(0, size - 1)
      let part = newGen[i].split('')
      part[randomInt(0, part.length - 1)] = randomAlpha(1, 31)
      newGen[i] = part.join('')
    }

    return new Genome({ base32: newGen })
  }

  static mutateBase(genome, { count = 1, brainConfig }) {
    let newGen = shuffle([...genome.toArray()])

    while (count-- > 0) {
      newGen.pop()
      const newBase = Genome.randomWithinIds({ ...brainConfig, asArray: true })
      newGen = newGen.concat(newBase)
    }

    return new Genome({ base32: newGen })
  }

  static randomWithinIds({
    ids = [],
    size = 1,
    neuronsCount = 0,
    asArray = false,
  }) {
    let myids = [...ids].concat(new Array(neuronsCount).fill(0).map((v, i) => `n#${toBase32(i)}`))

    const idsFrom = shuffle(myids.filter(x => x.startsWith('s#') || x.startsWith('n#')))
    const idsTo = shuffle(myids.filter(x => x.startsWith('n#') || x.startsWith('a#')))

    const base32 = new Array(size).fill(0)
      .map(() => ([idsFrom[randomInt(0, idsFrom.length - 1)], idsTo[randomInt(0, idsTo.length - 1)]]))
      .map(([from, to]) => {
        const [fromType, fromId] = from.split('#')
        const [toType, toId] = to.split('#')

        let finalFrom = [fromType === 's' ? '0' : '1', fromBase32ToBin(fromId).padStart(9, '0')].join('')
        finalFrom = fromBinToBase32(finalFrom).padStart(2, '0')

        let finalTo = [toType === 'n' ? '0' : '1', fromBase32ToBin(toId).padStart(9, '0')].join('')
        finalTo = fromBinToBase32(finalTo).padStart(2, '0')

        let weight = randomInt(-40, 40)
        let weightStr = [weight >= 0 ? '0' : '1', toBin(Math.abs(weight)).padStart(9, '0')].join('')
        weightStr = fromBinToBase32(weightStr).padStart(2, '0')

        return `${finalFrom}${finalTo}${weightStr}`
      })

    return asArray ? base32 : new this({ base32 })
  }

  static sexualReproduction(genA, genB) {
    const middle = Math.floor(genA.size / 2)

    const meiosisA = [
      genA.bases.slice(0, middle).map(b => new Base({ ...b })),
      genA.bases.slice(middle, genA.size).map(b => new Base({ ...b })),
    ]

    const meiosisB = [
      genB.bases.slice(0, middle).map(b => new Base({ ...b })),
      genB.bases.slice(middle, genB.size).map(b => new Base({ ...b })),
    ]

    return [
      new Genome({ bases: [].concat(meiosisA[0].concat(meiosisB[0])) }),
      new Genome({ bases: [].concat(meiosisA[1].concat(meiosisB[1])) }),
    ]
  }

  toArray() {
    return this.bases.map(b => b.toString())
  }

  toString() {
    return this.toArray().join(' ')
  }

  getNodes() {
    return [...new Set([]
      .concat(this.bases.map(x => x.from))
      .concat(this.bases.map(x => x.to)))
    ].sort()
  }
}
