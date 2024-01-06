import { sortBy } from "lodash-es"

import { Genome } from "./genome.class.js"
import { Vertex } from "./vertex.class.js"

function sigmoid(x = 0) {
  return 1 / (1 + Math.exp(x * -1));
}

function relu(x = 0) {
  return Math.max(0, x);
}

export class Brain {
  constructor({
    genome,
    sensors = [],
    actions = [],
    environment = {},
    activationFunction = 'relu',
  }) {
    this.environment = environment
    this.genome = Genome.from(genome)

    this.activationFunction = activationFunction === 'sigmoid'
      ? sigmoid
      : relu

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

    const env = this.environment
    const activationFunction = this.activationFunction

    for (const vertex of Object.values(this.definitions.sensors)) {
      let fn = this.sensors[vertex.name].tick || (() => 0)
      fn = fn.bind(env.me || this)

      vertex.tick = function () {
        const result = fn(env) + (this.metadata.bias || 0)
        this.metadata.lastTick = result
        return result
      }
    }

    for (const vertex of Object.values(this.definitions.neurons)) {
      vertex.tick = function () {
        let input = this.calculateInput()
        let result = activationFunction(input + (this.metadata.bias || 0))
        this.metadata.lastTick = result
        return result
      }
    }

    for (const vertex of Object.values(this.definitions.actions)) {
      let fn = this.actions[vertex.name].tick || (() => 0)
      fn = fn.bind(env.me || this)

      vertex.tick = function () {
        let input = this.calculateInput()
        input = activationFunction(input + (this.metadata.bias || 0))
        const result = fn(input, env)
        this.metadata.lastTick = result
        return result
      }
    }
  }

  setupBias({ target, data }) {
    this.findOrCreateVertex({
      id: target.id,
      collection: target.type + 's',
      metadata: {
        bias: data || 0,
        type: target.type,
      },
    })
  }

  setupConnection({ data, source, target }) {
    const x = this.findOrCreateVertex({
      id: source.id,
      collection: source.type + 's',
      metadata: {
        type: source.type,
      },
    })

    const y = this.findOrCreateVertex({
      id: target.id,
      collection: target.type + 's',
      metadata: {
        type: target.type
      },
    })

    y.addIn(x, data)
    x.addOut(y, data)
  }

  findOrCreateVertex({ id, collection, metadata }) {
    if (!this.definitions[collection][id]) {
      const vertex = new Vertex(`${collection[0]}#${id}`, { bias: 0, ...metadata, id })

      this.definitions[collection][id] = vertex
      this.definitions.all[vertex.name] = vertex

      return vertex
    }

    this.definitions[collection][id].metadata.bias = this.definitions[collection][id].metadata.bias + (metadata.bias || 0)
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
