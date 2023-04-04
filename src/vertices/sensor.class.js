import { Vertex } from "./vertex.class.js"

export class Sensor extends Vertex {
  constructor({ 
    id, 
    tick, 
    bindTo, 
    config, 
    params 
  } = {}) {
    super({ 
      id, 
      tick, 
      bindTo, 
      params, 
      prefix: 's#'
    })

    if (config) this.config(params)
  }

  tick() {
    const fn = this.bindTo
      ? this.tickFn.bind(this.bindTo)
      : this.tickFn

    this.value = fn(this.params || null)

    return this.value
  }
}
