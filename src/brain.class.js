import { isString, sortBy } from "lodash-es"

import { Genome } from "./genome.class.js"
import { Vertex } from "./vertex.class.js"

function sigmoid(x = 0) {
  return 1 / (1 + Math.exp(x * -1));
}

export class Brain {
  constructor({
    genome,
    sensors = [],
    actions = [],
    environment = {},
  }) {
    this.environment = environment
    this.genome = Genome.from(genome)

    this.definitions = {
      all: {},
      actions: {},
      neurons: {},
      sensors: {},
    }

    this.sensors = sensors.reduce((acc, sensor, i) => {
      if (!sensor.name) sensor.name = `s#${sensor.id || i}`
      acc[sensor.name] = sensor
      return acc
    }, {})

    this.actions = actions.reduce((acc, action, i) => {
      if (!action.name) action.name = `a#${action.id || i}`
      acc[action.name] = action
      return acc
    }, {})

    this.tickOrder = []
    this.setup()
  }

  setup() {
    for (const base of this.genome.bases) {
      if (base.type === 'bias') this.setupBias(base)
      else if (base.type === 'connection') this.setupConnection(base)
    }

    this.tickOrder = this.defineTickOrder()

    for (const vertex of Object.values(this.definitions.sensors)) {
      if (!this.sensors[vertex.name]) {
        vertex.tick = () => 0
        continue
      }

      let fn = this.sensors[vertex.name].tick || (() => 0)
      fn = fn.bind(this.environment.me || this)

      vertex.tick = () => {
        const result = fn(this.environment)
        vertex.metadata.current = result
      }
    }

    for (const vertex of Object.values(this.definitions.neurons)) {
      vertex.tick = function () {
        let input = vertex.calculateInput()
        input += parseFloat(this.metadata.bias || 0)

        let result = sigmoid(input) 
        vertex.metadata.current = result

        return result
      }
    }

    for (const vertex of Object.values(this.definitions.actions)) {
      if (!this.actions[vertex.name]) {
        vertex.tick = () => 0
        continue
      }

      let fn = this.actions[vertex.name].tick || (() => 0)
      fn = fn.bind(this.environment.me || this)

      vertex.tick = function (ticks = {}) {
        let input = vertex.calculateInput(ticks)
        input += parseFloat(this.metadata.bias || 0)
        input = sigmoid(input)

        const result = fn(input, this.environment)
        vertex.metadata.current = result

        return result
      }
    }
  }

  setupBias({ target, data }) {
    this.findOrCreateVertex({
      id: target.id,
      collection: target.type + 's',
      metadata: {
        bias: data,
        type: target.type,
      },
    })
  }

  setupConnection({ data, source, target }) {
    const x = this.findOrCreateVertex({
      id: source.id,
      collection: source.type + 's',
      metadata: { type: source.type },
    })

    const y = this.findOrCreateVertex({
      id: target.id,
      collection: target.type + 's',
      metadata: { type: target.type },
    })

    y.addIn(x, data)
    x.addOut(y, data)
  }

  findOrCreateVertex({ id, collection, metadata }) {
    if (!this.definitions[collection][id]) {
      const vertex = new Vertex(`${collection[0]}#${id}`, {
        last: 0,
        current: 0,
        ...metadata,
      })

      this.definitions[collection][id] = vertex
      this.definitions.all[vertex.name] = vertex

      return vertex
    }

    if (metadata.bias) this.definitions[collection][id].metadata.bias += metadata.bias
    return this.definitions[collection][id]
  }

  defineTickOrder() {
    let tickList = []

    const usableActions = Object
      .values(this.definitions.actions)
      .filter(action => action.in.length > 0)

    for (const action of usableActions) {
      tickList = tickList.concat(action.inputsTree())
      tickList = sortBy(tickList, ['deph']).reverse()
    }

    return tickList
  }

  tick() {
    const ticked = {}

    let types = {
      sensor: [],
      neuron: [],
      action: [],
    }

    for (const { vertex } of this.tickOrder) {
      types[vertex.metadata.type].push(vertex)
    }

    for (const vertex of types.sensor) {
      if (ticked[vertex.name]) continue
      ticked[vertex.name] = vertex.tick()
    }

    for (const vertex of types.neuron) {
      if (ticked[vertex.name]) continue
      ticked[vertex.name] = vertex.tick()
    }

    let actionsInputs = []
    for (const vertex of types.action) {
      if (ticked[vertex.name]) continue
      
      actionsInputs.push({
        input: vertex.calculateInput(),
        vertex,
      })
    }

    const finalAction = sortBy(actionsInputs, ['input']).pop().vertex
    ticked[finalAction.name] = finalAction.tick()

    return ticked
  }
}
