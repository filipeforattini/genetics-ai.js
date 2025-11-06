import { createCanvas } from 'canvas'
import { first, take, takeRight } from "lodash-es"
import fs from 'fs'

import { World } from "./src/world.js"
import { sensors } from "./src/sensors.js"
import { actions } from "./src/actions.js"
import { Creature } from "./src/creature.js"
import { Generation } from "../../src/generation.class.js"

const WORLD_SIZE = 64

let results = []
const world = World.from({ size: WORLD_SIZE })

function drawImage({ creatures, size }) {
  const canvas = createCanvas(WORLD_SIZE, WORLD_SIZE, 'PDF')
  const ctx = canvas.getContext('2d')
  ctx.strokeStyle = 'rgba(0,0,0,0.5)'
  
  const out = fs.createWriteStream(`./population.${Date.now()}.png`)
  const stream = canvas.createPNGStream()
  stream.pipe(out)
}

function draw({ creatures, size }) {
  let canvas = new Array(size).fill(null).map(() => new Array(size).fill(null).map(() => '░'))

  for (let i = 0; i < world.size; i++) {
    canvas[i][Math.floor(world.size * 0.9)] = '▓'
  }

  for (let i = 0; i < world.size; i++) {
    canvas[i][Math.floor(world.size * 0.1)] = '▓'
  }

  creatures.forEach(({ position, id }) => {
    canvas[position.y][position.x] = '@'
  })

  canvas = canvas.map((row, i) => `${i.toString().padStart(3)} ` + row.join('')).join('\n')
  canvas += '\n   ' + new Array(Math.ceil(size / 10)).fill(null).map((_, i) => `${i.toString().padStart(2)}        `).join('')
  console.log(canvas)
}

const initialGen = Generation.from({
  size: 200,
  individualNeurons: 6,
  individualGenomeSize: 20,
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
        if ((ind.position.x / (world.size - 1)) < 0.9 && (ind.position.x / (world.size - 1)) > 0.1) {
          ind.dead = true
          ind.fitness = 0
        } else {
          ind.fitness = Math.abs((world.size - 1) / 2 - ind.position.x) / ((world.size - 1) / 2)
        }
      }

      gen.population = gen.population.sort((a, b) => b.fitness - a.fitness)
      gen.survivors = gen.population.filter(x => !x.dead)

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
  for (let j = 1; j <= 300; j++) {
    gen.tick()
    
    if ((i) % 9 === 0) {
      draw({ creatures: gen.population, size: world.size })
      drawImage({ creatures: gen.population, size: world.size })
    }
  }

  world.resetGrid()
  const bestGenome = gen.population[0].genome
  const newGen = gen.next()
  results.push(gen.export())
  process.stdout.write('▓')

  if ((i) % 10 === 0) {
    process.stdout.write(` ${i}\n`)
    console.table(takeRight(results, 10))
    console.log(`best gnome = ${bestGenome.encoded}`)
  }

  gen = newGen
}
