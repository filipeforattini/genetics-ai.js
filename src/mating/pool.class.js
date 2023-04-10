import { Genome } from '../genome.class.js';
import { chunkArray } from '../concerns/arr.js';
import { Generation } from '../generation.class.js';
import { MatingStrategy } from './mating-strategy.class.js'

export class Pool extends MatingStrategy {
  run() {
    let total = 0

    const pool = {
      top: {
        checkIn: (score) => score >= 0.95,
        pool: [],
      },
      mid: {
        checkIn: (score) => score >= 0.85,
        pool: [],
      },
      low: {
        checkIn: (score) => score >= 0.60,
        pool: [],
      },
    }

    for (let i = 0; i < this.generation.individuals.length - 1; i++) {
      const score = this.generation.fitness[i]
      const individual = this.generation.individuals[i];

      if (pool.top.checkIn(score)) pool.top.pool.push(individual.genome)
      else if (pool.mid.checkIn(score)) pool.mid.pool.push(individual.genome)
      else if (pool.low.checkIn(score)) pool.low.pool.push(individual.genome)
    }

    let genomes = []
    for (const pair of chunkArray(pool.top.pool, 2)) {
      if (genomes.length >= this.generation.size) break

      let [genA, genB] = pair
      if (!genB) genB = Genome.copy(genA)

      genomes = genomes
        .concat(Genome.sexualReproduction(genA, genB))
        .concat(Genome.sexualReproduction(genA, genB))
        .concat(Genome.sexualReproduction(genA, genB))
    }

    for (const pair of chunkArray(pool.mid.pool, 2)) {
      if (genomes.length >= this.generation.size) break

      let [genA, genB] = pair
      if (!genB) genB = Genome.copy(genA)

      genomes = genomes
        .concat(Genome.sexualReproduction(genA, genB))
        .concat(Genome.sexualReproduction(genA, genB))
    }

    for (const pair of chunkArray(pool.low.pool, 2)) {
      if (genomes.length >= this.generation.size) break

      let [genA, genB] = pair
      if (!genB) genB = Genome.copy(genA)

      genomes = genomes.concat(Genome.sexualReproduction(genA, genB))
    }

    const gen = new Generation({ ...this.generation.exportParams() })
    for (const genome of genomes) {
      gen.createIndividualFromGenome(genome)
    }

    return gen
  }
}
