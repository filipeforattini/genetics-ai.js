export const SerializableMixin = {
  toString() {
    return JSON.stringify({ ...this }, null, 2)
  },
  toJSON() {
    return { ...this }
  },
}
