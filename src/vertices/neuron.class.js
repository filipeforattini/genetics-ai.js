import { Vertex } from "./vertex.class.js"

export class Neuron extends Vertex {
  constructor({ id } = {}) {
    super({ id, prefix: 'n#' })
  }
}
