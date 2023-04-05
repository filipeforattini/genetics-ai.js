import { Brain } from "./brain.class.js"
import { Genome } from "./genome.class.js"
import { ResourcefulMixin } from "./mixins/index.js"

export class Individual {
  constructor({
    genome = null,
    genomeSize = 1,

    brain: {
      sensors = [],
      actions = [],
      neuronsCount = 0,
      graphOptions = {},
      verticesParams = {},
    }
  }) {
    Object.assign(this, ResourcefulMixin)

    this.id = this.createId('i#', 4)
    this.health = 1

    const ids = [...new Set([]
      .concat(sensors)
      .concat(actions).map(x => x.id)
    )].sort()

    this.genome = genome || Genome.randomWithinIds({
      ids,
      neuronsCount,
      size: genomeSize,
    })

    this.brain = new Brain({
      genome: this.genome,
      neuronsCount,
      graphOptions,
      sensors: sensors.map(s => ({ bindTo: this, ...s })),
      actions: actions.map(a => ({ bindTo: this, ...a })),
      verticesParams: { ...verticesParams, individual: this },
    })

  }

  tick() {
    return this.brain.tick()
  }

  toJSON() {
    const brain = this.brain.toJSON()

    return {
      id: this.id,
      health: this.health,
      genome: this.genome.toString(),

      brain: {
        order: brain?.brainOrder || 0,
        connections: brain?.brainConnections || 0,
        nodes: this.genome.nodes.join(' '),
        edges: [].concat(brain.edges).map(k => k.key).join(' '),
        ticks: brain.ticks,
      }
    }
  }

  toString() {
    return JSON.stringify(this.toJSON(), null, 2)
  }
}
