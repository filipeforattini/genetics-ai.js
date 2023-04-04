import Graph from "graphology"

import { Genome } from "./genome.class.js"
import { toBase32 } from "./concerns/index.js";
import { ResourcefulMixin } from "./mixins/index.js"
import { Neuron, Action, Sensor } from "./vertices/index.js"

export class Brain {
  constructor({
    id,
    genome,
    sensors = [],
    actions = [],
    neuronsCount = 0,
    graphOptions = {},
    verticesParams = {},
  }) {
    Object.assign(this, ResourcefulMixin)

    this.id = id || this.createId('b#', 4)

    this.ticks = []
    this.genome = genome
    this.sensors = sensors
    this.actions = actions
    this.neuronsCount = neuronsCount
    this.graphOptions = graphOptions
    this.verticesParams = verticesParams

    this.setup()
  }

  setup() {
    const verticesParams = {
      brain: this,
      ...this.verticesParams,
    }

    this.sensors = this.sensors
      .map(s => ({ ...s, params: verticesParams }))
      .map(s => new Sensor(s))

    this.actions = this.actions
      .map(s => ({ ...s, params: verticesParams }))
      .map(a => new Action(a))

    this.neurons = new Array(this.neuronsCount).fill(0)
      .map((_, i) => new Neuron({ id: `n#${toBase32(i).padStart(2, '0')}` }))

    const nodes = [... new Set([]
      .concat(this.sensors || [])
      .concat(this.neurons || [])
      .concat(this.actions || [])
      .map(s => s.id))
    ]

    this.graph = new Graph({
      multi: true,
      allowSelfLoops: false,
      ...this.graphOptions,
    });

    this.graph.import({
      attributes: { name: this.id },
      nodes: nodes.map(n => ({ key: n })),
    })

    const bases = this.genome.bases.filter(b => nodes.includes(b.from) && nodes.includes(b.to))

    for (const base of bases) {
      if (base.from !== base.to) {
        if (!this.graph.hasEdge(base.from, base.to)) {
          this.graph.addEdgeWithKey(
            `${base.from}>>${base.to}`,
            base.from,
            base.to,
            { weight: base.weight }
          )
        }
      }
    }
  }

  static random({ genome, genomeSize = 1, neuronsCount = 0, sensors = [], actions = [] } = {}) {
    let gen = genome || Genome.random(genomeSize)

    return new Brain({
      sensors,
      actions,
      genome: gen,
      neuronsCount,
    })
  }

  toJSON() {
    return {
      genome: this.genome.toArray(),
      brainOrder: this.graph.order,
      brainConnections: this.graph.size,
      ...this.graph.export(),
      ticks: this.ticks,
    }
  }

  getObject(id) {
    return id.startsWith('s#')
      ? this.sensors.find(s => s.id === id)
      : id.startsWith('a#')
        ? this.actions.find(a => a.id === id)
        : id.startsWith('#n')
          ? this.neurons.find(n => n.id === id)
          : null
  }

  getObjects(idList = []) {
    return idList
      .map(id => this.getObject(id))
      .filter(n => n)
  }

  tick() {
    const ticks = [... new Set([]
      .concat(this.sensors || [])
      .concat(this.neurons || [])
      .concat(this.actions || [])
      .map(s => s.id))
    ].reduce((acc, n) => {
      acc[n] = 0
      return acc
    }, {})

    // calculate sensors
    this.sensors.forEach(x => { ticks[x.id] = x.tick() })

    // calculate neurons
    let neurons = this.sensors.map(s => this.graph.neighbors(s.id))
      .flatMap(x => x)
      .filter(n => n.startsWith('n#'))
      .map(id => this.neurons.find(n => n.id === id))

    while (neurons.length > 0) {
      let next = neurons.shift()

      const thisEdges = this.graph.edges(next.id)
        .map(e => ({ name: e, extremities: this.graph.extremities(e) }))

      const neuronsReq = thisEdges
        .filter(e => e.extremities[1] === next.id)
        .filter(e => e.extremities[0] !== next.id)

      const deps = neuronsReq.filter(n => !ticks.hasOwnProperty(n.extremities[0])).length

      if (deps > 0) {
        neurons = neurons
          .concat(neuronsReq.map(e => this.neurons.find(n => e === n.extremities[0])))
          .concat(next)

        continue
      }

      let edges = neuronsReq.map(e => ({ ...e, ...this.graph.getEdgeAttributes(e.name) }))
      const weightTotal = edges.map(e => e.weight).reduce((acc, x) => acc + x, 0)
      let values = edges.map(e => ({ ...e, value: ticks[e.extremities[0]] * e.weight }))

      ticks[next.id] = (values.reduce((acc, k) => acc + k.value, 0) / weightTotal)

      let nextTargets = thisEdges
        .filter(e => e.extremities[0] === next.id)
        .filter(n => n.extremities[1].startsWith('n#'))
        .map(e => this.neurons.find(n => n.id === e.extremities[1]))
        .filter(e => !ticks.hasOwnProperty(e.id))

      neurons = neurons.concat(nextTargets)
    }

    // calculate actions
    for (const action of this.actions) {
      let sources = this.graph.edges(action.id)
        .filter(x => x)
        .map(e => ({ name: e, id: this.graph.extremities(e)[0] }))
        .map(e => ({ ...e, ...this.graph.getEdgeAttributes(e.name) }))

      const weightTotal = sources.map(e => e.weight).reduce((acc, x) => acc + x, 0) || 1

      ticks[action.id] = (sources.reduce((acc, e) => acc + ticks[e.id] * e.weight, 0) / weightTotal)
    }

    this.ticks.push(ticks)

    return Object.entries(ticks)
      .filter(([k]) => k.startsWith('a#'))
      .reduce((acc, [k, v]) => {
        acc[k] = v
        return acc
      }, {})
  }

  run() {
    const tick = this.tick()

    for (const action of this.actions) {
      action.tick(tick[action.id])
    }
  }
}
