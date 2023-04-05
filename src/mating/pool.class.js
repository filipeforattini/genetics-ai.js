import { Genome } from '../genome.class.js';
import { chunkArray } from '../concerns/arr.js';
import { Generation } from '../generation.class.js';
import { MatingStrategy } from './mating-strategy.class.js'

export class Pool extends MatingStrategy {
  run() {
    const pool = {
      top: {
        checkIn: (score) => score > 0.85,
        pool: [],
      },
      mid: {
        checkIn: (score) => score > 0.60,
        pool: [],
      },
      low: {
        pool: [],
      },
    }

    for (let i = 0; i < this.generation.individuals.length - 1; i++) {
      const individual = this.generation.individuals[i];
      const score = this.generation.fitness[i]

      if (pool.top.checkIn(score)) pool.top.pool.push(individual.genome)
      else if (pool.mid.checkIn(score)) pool.mid.pool.push(individual.genome)
      else pool.low.pool.push(individual.genome)
    }

    let genomes = []
    for (const pair of chunkArray(pool.top.pool, 2)) {
      let [genA, genB] = pair
      if (!genB) genB = Genome.copy(genA)

      genomes = genomes
        .concat(Genome.sexualReproduction(genA, genB))
        .concat(Genome.sexualReproduction(genA, genB))
    }

    for (const pair of chunkArray(pool.mid.pool, 2)) {
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
