import { chunk, merge, random } from "lodash-es"

export const toBin = x => parseInt(x).toString(2)
export const fromBin = bin => parseInt(bin, 2)
export const fromBinToBase32 = bin => parseInt(bin, 2).toString(32)

export const toBase32 = x => parseInt(x).toString(32)
export const fromBase32 = b32 => parseInt(b32, 32)
export const fromBase32ToBin = b32 => parseInt(b32, 32).toString(2)

export const chars = [
  'a', 'b', 'c', 'd', 'e', 'f', 'g', 'h', 'i', 'j',
  'k', 'l', 'm', 'n', 'o', 'p', 'q', 'r', 's', 't',
  'u', 'v', 'w', 'x', 'y', 'z'
].join('')

export const vowels = ['a', 'e', 'i', 'o', 'u'].join('')

export const alphanum = [
  '0', '1', '2', '3', '4', '5', '6', '7', '8', '9',
  ...chars.split(''),
].join('')

export const randomChar = (size = 1) => {
  const str = new Array(size).fill(0).map(() => chars[randomInt(0, chars.length)])
  return shuffleStr(str).join('')
}

export const randomAlpha = (size = 1, base = alphanum.length) => {
  const str = new Array(size).fill(0).map(() => alphanum[randomInt(0, base)])
  return shuffleStr(str).join('')
}

export class Base {
  static charToBin(char) {
    return fromBase32ToBin(char).padStart(5, '0')
  }

  static targetTypes(char, typesArray = null) {
    return (typesArray || ['sensor', 'neuron', 'action'])[char] || 'neuron'
  }

  static getConfig(char = '') {
    let base = {
      config: this.charToBin(char[0])
    }

    const [data, [type]] = chunk(base.config.split(''), 4)

    base.type = type
    if (type === '0') {
      base.type = 'connection'
    } else if (type === '1') {
      base.type = 'bias'
    }

    const sign = base.type === 'bias'
      ? data.pop()
      : undefined

    base.data = fromBin(data.join(''))
    if (sign === '1') base.data *= -1

    return base
  }

  static getTarget(str = '', typeSize = 1, targetTypes = null) {
    let bins = str.split('').map(x => this.charToBin(x))
    bins = bins.join('').split('')

    const [id, type] = chunk(bins, bins.length - typeSize)

    return {
      id: fromBin(id.join('')),
      type: this.targetTypes(fromBin(type.join('')), targetTypes),
    }
  }

  static fromString(str = '') {
    let base = {
      encoded: str,
    }

    base = merge(base, this.getConfig(base.encoded[0]))

    if (base.type === 'bias') {
      base.encoded = base.encoded.padEnd(3, '0')
      base.target = this.getTarget(base.encoded[1] + base.encoded[2], 2)
    }
    else if (base.type === 'connection') {
      base.encoded = base.encoded.padEnd(5, '0')
      base.source = this.getTarget(base.encoded[1] + base.encoded[2], 1, ['sensor', 'neuron'])
      base.target = this.getTarget(base.encoded[3] + base.encoded[4], 1, ['neuron', 'action'])
    }

    delete base.config
    return base
  }

  static toString(base) {
    let str = ''

    if (base.type === 'bias') {
      // config
      str += Math.abs(base.data).toString(2).padStart(3, '0')
      if (base.data >= 0) str += '0'
      else str += '1'
      str += '1'

      // target
      str += base.target.id.toString(2).padStart(8, '0')

      if (base.target.type === 'sensor') str += '00'
      else if (base.target.type === 'neuron') str += '01'
      else if (base.target.type === 'action') str += '10'
      else str += '01'
    }
    else if (base.type === 'connection') {
      // config
      str += Math.abs(base.data).toString(2).padStart(4, '0')
      str += '0'

      // source
      str += base.source.id.toString(2).padStart(9, '0')

      if (base.source.type === 'sensor') str += '0'
      else if (base.source.type === 'neuron') str += '1'
      else str += '1'

      // target
      str += base.target.id.toString(2).padStart(9, '0')

      if (base.target.type === 'neuron') str += '0'
      else if (base.target.type === 'action') str += '1'
      else str += '0'
    }

    return chunk(str, 5)
      .map(x => fromBinToBase32(x.join('')))
      .join('')
      .toUpperCase()
  }

  static random() {
    if (random(0, 10) < 5) {
      return {
        type: 'bias',
        data: random(0, 4),
        target: {
          id: random(1, 100),
          type: ['sensor', 'neuron', 'action'][random(0, 2)],
        },
      }
    }

    return {
      type: 'connection',
      data: random(0, 4),
      source: {
        type: ['sensor', 'neuron', 'action'][random(0, 2)],
        id: random(1, 100),
      },
      target: {
        type: ['sensor', 'neuron', 'action'][random(0, 2)],
        id: random(1, 100),
      },
    }
  }

  static randomString() {
    return this.toString(this.random())
  }
}
