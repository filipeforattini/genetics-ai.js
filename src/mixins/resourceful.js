import { randomAlpha } from "../concerns/index.js"

export const ResourcefulMixin = {
  createId (prefix = '', size = 2) {
    const id = prefix + randomAlpha(size, 31)
    this.id = id
    return id
  },
}
