import { Pool } from './mating/pool.class.js'
import { Individual } from "./individual.class.js"

export class Generation {
  constructor({
    size,
    individualOptions = {},
    individualInterface = Individual,
    fitnessFunction = function (individual) { individual.health },
    matingStrategy = [Pool],
  }) {
    this.iteration = 0

    this.size = size
    this.individualInterface = individualInterface
    this.individualOptions = individualOptions
    this.fitnessFunction = fitnessFunction
    this.matingStrategies = matingStrategy
    
    this.best = null
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
    this.fitness = new Array(this.individuals.length).fill(-1)

    this.demographics.total += count
    this.demographics.random += count
  }

  fit() {
    this.fitness = this.individuals.map(ind => {
      const fitness = this.fitnessFunction(ind)
      ind.fitness = fitness
      return fitness
    });

    this.individuals = this.individuals
      .sort((a, b) => b.fitness - a.fitness)

    this.best = this.individuals[0]
    return this.fitness
  }

  next() {
    this.fit()

    let gen
    for (const StrategyInterface of this.matingStrategies) {
      const strategy = new StrategyInterface(this)
      gen = strategy.run()
    }

    gen.iteration = this.iteration + 1    
    const children = gen.individuals.length
    
    gen.demographics.children = children
    gen.demographics.total += children
    
    gen.fill()
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
