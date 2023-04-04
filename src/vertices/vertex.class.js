import { ResourcefulMixin, SerializableMixin } from "../mixins/index.js"

export class Vertex {
  constructor({ 
    id, 
    tick, 
    bindTo, 
    params, 
    prefix = 'v#'
  }) {
    Object.assign(this, ResourcefulMixin)
    Object.assign(this, SerializableMixin)

    this.id = id || this.createId(prefix, 2)

    this.value = 0
    this.params = params
    this.bindTo = bindTo

    this.tickFn = !tick
      ? data => data
      : tick
  }
}