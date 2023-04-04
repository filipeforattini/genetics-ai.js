import {
  chunk,
  toBin,
  fromBin,
  randomAlpha,
  fromBase32ToBin,
  fromBinToBase32,
} from "./concerns/index.js"

export class Base {
  constructor({ from, to, weight }) {
    this.from = from
    this.to = to
    this.weight = weight
  }

  static random({from, to, weight} = {}) {
    const base = this.fromBase32(randomAlpha(6, 31))
    
    if (from) base.from = from
    if (to) base.to = to
    if (weight) base.weight = weight

    return base
  }

  static fromBase32(chain) {
    let data = chain.padStart(6, '0')

    let [from, to, weight] = chunk(data, 2)
      .map(fromBase32ToBin)
      .map(x => x.padStart(10, '0').split(''))

    let [fromType, ...fromId] = from
    let [toType, ...toId] = to
    let [signWeight, ...weightValue] = weight

    fromId = fromBinToBase32(fromId.join('')).padStart(2, '0')
    toId = fromBinToBase32(toId.join('')).padStart(2, '0')
    const finalWeight = fromBin(weightValue.join('')) * (signWeight === '0' ? 1 : -1)

    const newBase = {
      from: `${fromType === '0' ? 's' : 'n'}#${fromId}`,
      to: `${toType === '0' ? 'n' : 'a'}#${toId}`,
      weight: finalWeight / 10,
    }

    return new this(newBase)
  }

  static fromBin(data) {
    const dataConvertedTo32 = chunk(data, 10).map(d => fromBinToBase32(d).padStart(2, '0')).join('')
    return this.fromBase32(dataConvertedTo32)
  }

  toBase32() {
    const [fromType, fromId] = this.from.split('#')
    const [toType, toId] = this.to.split('#')

    let finalFrom = [fromType === 's' ? '0' : '1', fromBase32ToBin(fromId).padStart(9, '0')].join('')
    finalFrom = fromBinToBase32(finalFrom).padStart(2, '0')

    let finalTo = [toType === 'n' ? '0' : '1', fromBase32ToBin(toId).padStart(9, '0')].join('')
    finalTo = fromBinToBase32(finalTo).padStart(2, '0')

    let weightStr = [this.weight >= 0 ? '0' : '1', toBin(Math.abs(this.weight * 10)).padStart(9, '0')].join('')
    weightStr = fromBinToBase32(weightStr).padStart(2, '0')

    return `${finalFrom}${finalTo}${weightStr}`
  }

  toBin() {
    return chunk(this.toBase32(), 2)
      .map(b32 => fromBase32ToBin(b32))
      .map(bin => bin.padStart(10, '0'))
      .join('')
  }

  toString() {
    return this.toBase32()
  }
}
