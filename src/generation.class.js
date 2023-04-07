import { Individual } from "./individual.class.js"
import { Pool } from './mating/index.js'

export class Generation {
  constructor({
    size,
    individualOptions = {},
    individualInterface = Individual,
    fitnessFunction = function (individual) { individual.health },
    matingStrategy = [Pool],
  }) {
    this.size = size
    this.individualInterface = individualInterface
    this.individualOptions = individualOptions
    this.fitnessFunction = fitnessFunction
    this.matingStrategies = matingStrategy

    this.individuals = []
    this.demographics = {
      total: 0,
      random: 0,
    }
  }

  static first({
    size,
    individualOptions = {},
    individualInterface = Individual,
    fitnessFunction,
  }) {
    const gen = new Generation({
      size,
      individualInterface,
      individualOptions,
      fitnessFunction,
    })

    gen.fill()
    gen.demographics.total = gen.individuals.length
    gen.demographics.random = gen.individuals.length

    return gen
  }

  static from(generation, options = {}, generationOptions = {}) {
    Object.assign(generationOptions, generation.options)

    const {
      justAlive = true,
      topPerformers = 0.15,
      childrenPerIndividual = 4,
    } = options

    const gen = new Generation(generationOptions)

    const winnersCount = Math.floor(topPerformers * generation.individuals.length)

    let winners = generation.individuals
    if (justAlive) winners = winners.filter(x => x.health > 0)
    winners = winners.slice(0, winnersCount)

    const children = winners.flatMap(g => g.children(childrenPerIndividual))

    gen.individuals = children
    gen.fill()

    gen.demographics = {
      winners: winners.length,
      children: children.length,
      random: gen.individuals.length - children.length
    }

    return gen
  }

  createIndividualFromGenome(genome) {
    const ind = new this.individualInterface({
      genome,
      ...this.individualOptions,
    })

    this.individuals.push(ind)
    return ind
  }

  fill() {
    if (!this.individuals) this.individuals = []

    const count = Math.abs(this.size - this.individuals.length) % (this.size + 1)

    const individualsPack = new Array(count).fill(null)
      .map(() => new this.individualInterface({
        ...this.individualOptions,
      }))

    this.individuals = this.individuals.concat(individualsPack)

    this.demographics.random += individualsPack.length
    this.demographics.total += individualsPack.length

    this.fitness = new Array(this.individuals.length).fill(-1)
  }

  fit() {
    this.fitness = this.individuals.map(this.fitnessFunction)
    return this.fitness
  }

  next() {
    this.fit()

    let gen
    for (const StrategyInterface of this.matingStrategies) {
      const strategy = new StrategyInterface(this)
      gen = strategy.run()
    }
    
    gen.demographics = {
      children: gen.individuals.length,
    }

    gen.fill()
    
    gen.demographics = {
      total: gen.individuals.length,
      random: gen.individuals.length - gen.demographics.children,
    }

    return gen
  }

  toArray() {
    return this.individuals.map(i => i.toString())
  }

  toJSON() {
    return this.individuals.map(i => i.toJSON())
  }

  exportParams() {
    return {
      size: this.size,
      individualInterface: this.individualInterface,
      individualOptions: this.individualOptions,
      fitnessFunction: this.fitnessFunction,
      matingStrategy: this.matingStrategies,
    }
  }
}
