import { sortBy } from "lodash-es"

function weightedAverage(values, weights) {
  if (values.length !== weights.length) {
    throw new Error('Values and weights arrays must be of the same length');
  }

  let sum = 0;
  let weightSum = 0;

  for (let i = 0; i < values.length; i++) {
    sum += values[i] * weights[i];
    weightSum += weights[i];
  }

  return sum / weightSum;
}

export class Vertex {
  constructor(name, metadata = {}) {
    this.name = name

    this.metadata = {
      current: 0,
      ...metadata,
    }

    this.in = []
    this.inMap = {}
    this.out = []
    this.outMap = {}
  }

  addIn(vertex, weight) {
    if (!this.inMap[vertex.name]) {
      this.inMap[vertex.name] = {
        weight,
        index: this.in.push({ vertex, weight }) - 1,
      }
    } else {
      this.inMap[vertex.name].weight += weight
      this.in[this.inMap[vertex.name].index].weight += weight
    }
  }

  addOut(vertex, weight) {
    if (!this.outMap[vertex.name]) {
      this.outMap[vertex.name] = {
        weight,
        index: this.out.push({ vertex, weight }) - 1,
      }
    } else {
      this.outMap[vertex.name].weight += weight
      this.out[this.outMap[vertex.name].index].weight += weight
    }
  }

  neighbors(fn = null) {
    return fn
      ? this.in.filter(fn).concat(this.out.filter(fn))
      : this.in.concat(this.out)
  }

  toJSON() {
    return {
      name: this.name,
      metadata: this.metadata,
      in: this.in.map(v => v.vertex.name),
      out: this.out.map(v => v.vertex.name),
    }
  }

  toString() {
    return JSON.stringify(this.toJSON(), null, 2)
  }

  inputsTree(deph = 0, visited = {}) {
    if (visited[this.name]) return []
    
    let pile = []
    visited[this.name] = pile.push({ deph, vertex: this })
    
    for (const input of this.in) {
      let subPile = input.vertex.inputsTree(deph + 1, visited)

      subPile = subPile.filter(v => !visited[v.name])
      pile = pile.concat(subPile)
    }

    return sortBy(pile, ['deph'])
  }

  calculateInput () {
    let values = [], weights = []

    for (const { vertex, weight } of this.in) {
      values.push(vertex.metadata.current || 0)
      weights.push(weight)
    }

    return weightedAverage(values, weights)
  }
}
