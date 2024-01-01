import { isArray, isString } from "lodash-es"

import { Base } from './base.class.js'

export class Genome {
  static from (data) {
    return isString(data)
      ? this.fromString(data)
      : isArray(data)
        ? this.fromBases(data)
        : data
  }

  static fromString(str = '') {
    let genome = {
      encoded: (str || '').toUpperCase().trim(),
      bases: [],
    }

    let data = str.split('')

    while (data.length > 0) {
      let base = data.shift()
      const config = Base.fromString(base)

      if (config.type === 'bias') {
        base += (data.shift() || '')
        base += (data.shift() || '')
      }
      else if (config.type === 'connection') {
        base += (data.shift() || '')
        base += (data.shift() || '')
        base += (data.shift() || '')
        base += (data.shift() || '')
      }

      base = Base.fromString(base.trim())
      genome.bases.push(base)
    }

    return genome
  }

  static fromBases(bases) {
    return {
      bases,
      encoded: bases.map(base => Base.toString(base)).join(''),
    }
  }

  static toString(bases) {
    return bases.map(base => Base.toString(base)).join('')
  }

  static random(count = 1) {
    const bases = new Array(count)
      .fill(null)
      .map(() => Base.random())

    return { 
      bases,
      encoded: bases.map(base => Base.toString(base)).join(''),
    }
  }

  static randomWith(count = 1, { 
    neurons = 1,
    sensors = 1, 
    actions = 1, 
  } = {}) {
    const bases = new Array(count)
      .fill(null)
      .map(() => Base.randomWith({
        neurons,
        sensors,
        actions,
      }))

    return { 
      bases,
      encoded: bases.map(base => Base.toString(base)).join(''),
    }
  }
}
