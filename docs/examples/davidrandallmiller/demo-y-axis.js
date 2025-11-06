import { first, take, takeRight } from "lodash-es"

import { World } from "./src/world.js"
import { sensors } from "./src/sensors.js"
import { actions } from "./src/actions.js"
import { Creature } from "./src/creature.js"
import { Generation } from "../../src/generation.class.js"

let results = []
const world = World.from({ size: 128 })

async function draw({ creatures, size }) {
  let canvas = new Array(size).fill(null).map(() => new Array(size).fill(null).map(() => '░'))

  for (let i = 0; i < world.size; i++) {
    canvas[Math.floor(world.size * 0.9)][i] = '▓'
  }

  creatures.forEach(({ position, id }) => {
    canvas[position.y][position.x] = '@'
  })

  canvas = canvas.map((row, i) => `${i.toString().padStart(3)} ` + row.join('')).join('\n')
  canvas += '\n   ' + new Array(Math.ceil(size / 10)).fill(null).map((_, i) => `${i.toString().padStart(2)}        `).join('')
  console.log(canvas)
}

const initialGen = Generation.from({
  size: 500,
  individualNeurons: 12,
  individualGenomeSize: 32,
  individualClass: Creature,

  individualArgs: {
    world,
    sensors,
    actions,
    environment: { world },
  },

  hooks: {
    beforeNext(gen) {
      for (const ind of gen.population) {
        if ((ind.position.y / (world.size - 1)) < 0.9) {
          ind.dead = true
          ind.fitness = 0
        } else {
          ind.fitness = ind.position.y / (world.size - 1)
        }
      }

      gen.population = gen.population.sort((a, b) => b.fitness - a.fitness)

      gen.meta.fitAverage = gen.population.reduce((acc, ind) => acc + ind.fitness, 0) / gen.population.length
      gen.meta.fitTop10 = take(gen.population, Math.ceil(gen.population.length * 0.1)).reduce((acc, ind) => acc + ind.fitness, 0) / Math.ceil(gen.population.length * 0.1)
      gen.meta.fitTop30 = take(gen.population, Math.ceil(gen.population.length * 0.3)).reduce((acc, ind) => acc + ind.fitness, 0) / Math.ceil(gen.population.length * 0.3)
      gen.meta.fitBest = first(gen.population).fitness
    }
  }
})

initialGen.fillRandom()
let gen = initialGen

for (let i = 1; i <= 1000; i++) {
  for (let j = 1; j <= 150; j++) {
    gen.tick()
    if ((i) % 10 === 0 || i === 1) draw({ creatures: gen.population, size: world.size })
  }

  world.resetGrid()
  const bestGenome = gen.population[0].genome
  const newGen = gen.next()
  results.push(gen.export())
  process.stdout.write('▓')

  if (i % 10 === 0 || i === 1) {
    process.stdout.write(`\n`)
    console.table(takeRight(results, 5))
    console.log(`best gnome = ${bestGenome.encoded}`)
  }

  gen = newGen
}
