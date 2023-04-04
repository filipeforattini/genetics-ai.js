import { Vertex } from "./vertex.class.js"

export class Action extends Vertex {
  constructor({
    id,
    bindTo,
    params,
    tick
  } = {}) {
    super({
      id,
      tick,
      bindTo,
      prefix: 's#'
    })

    Object.assign(this, { params })
  }

  tick(d) {
    const fn = this.bindTo 
      ? this.tickFn.bind(this.bindTo) 
      : this.tickFn

    this.value = fn(d || 0)
    
    return this.value
  }
}
