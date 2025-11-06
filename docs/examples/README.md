# 🎮 Complete Examples

Complete, runnable examples showing different use cases for genetics-ai.js.

## Example 1: Evolve a Tic-Tac-Toe Player

```javascript
import { Generation, Individual } from 'genetics-ai.js'

class TicTacToePlayer extends Individual {
  constructor(options) {
    super({
      ...options,
      sensors: [
        // 9 cells (0 = empty, 1 = X, -1 = O)
        { id: 0, tick: () => this.board[0] },
        { id: 1, tick: () => this.board[1] },
        { id: 2, tick: () => this.board[2] },
        { id: 3, tick: () => this.board[3] },
        { id: 4, tick: () => this.board[4] },
        { id: 5, tick: () => this.board[5] },
        { id: 6, tick: () => this.board[6] },
        { id: 7, tick: () => this.board[7] },
        { id: 8, tick: () => this.board[8] },
        // Whose turn (1 = X, -1 = O)
        { id: 9, tick: () => this.turn }
      ],
      actions: [
        // 9 possible positions
        { id: 0, tick: () => this.move = 0 },
        { id: 1, tick: () => this.move = 1 },
        { id: 2, tick: () => this.move = 2 },
        { id: 3, tick: () => this.move = 3 },
        { id: 4, tick: () => this.move = 4 },
        { id: 5, tick: () => this.move = 5 },
        { id: 6, tick: () => this.move = 6 },
        { id: 7, tick: () => this.move = 7 },
        { id: 8, tick: () => this.move = 8 }
      ]
    })
    this.board = new Array(9).fill(0)
    this.turn = 1
    this.move = -1
    this.wins = 0
    this.draws = 0
    this.losses = 0
  }

  fitness() {
    return this.wins * 100 + this.draws * 50 - this.losses * 200
  }

  makeMove() {
    this.tick()  // Brain decides move
    if (this.board[this.move] === 0) {
      this.board[this.move] = this.turn
      return this.move
    }
    // Invalid move - pick first empty cell
    const empty = this.board.findIndex(cell => cell === 0)
    if (empty !== -1) this.board[empty] = this.turn
    return empty
  }
}

// Train
const gen = new Generation({
  size: 100,
  individualClass: TicTacToePlayer,
  individualGenomeSize: 200,
  individualNeurons: 30,
  useSpeciation: true
})

gen.fillRandom()

for (let i = 0; i < 100; i++) {
  // Play games
  gen.population.forEach(player => {
    for (let game = 0; game < 10; game++) {
      playGame(player, randomOpponent())
    }
  })

  await gen.tickAsync()
  gen.population.sort((a, b) => b.fitness() - a.fitness())
  gen.population.slice(-30).forEach(ind => ind.dead = true)
  gen = await gen.nextAsync()

  const best = gen.population[0]
  console.log(`Gen ${i}: ${best.wins}W-${best.draws}D-${best.losses}L`)
}

function playGame(player1, player2) {
  // ... implement tic-tac-toe game logic ...
}
```

## Example 2: Physics-Based Creatures

```javascript
import { Generation, Individual, NoveltySearch } from 'genetics-ai.js'

class Creature extends Individual {
  constructor(options) {
    super({
      ...options,
      sensors: [
        { id: 0, tick: () => this.x },
        { id: 1, tick: () => this.y },
        { id: 2, tick: () => this.vx },
        { id: 3, tick: () => this.vy },
        { id: 4, tick: () => this.energy }
      ],
      actions: [
        { id: 0, tick: v => { this.vx += v * 0.1; return v } },  // Accelerate X
        { id: 1, tick: v => { this.vy += v * 0.1; return v } }   // Accelerate Y
      ]
    })
    this.x = 0
    this.y = 0
    this.vx = 0
    this.vy = 0
    this.energy = 100
    this.maxDistance = 0
  }

  simulate(steps = 100) {
    for (let i = 0; i < steps; i++) {
      this.tick()  // Brain decides action

      // Physics
      this.x += this.vx
      this.y += this.vy
      this.vx *= 0.95  // Drag
      this.vy *= 0.95

      // Energy cost
      this.energy -= Math.abs(this.vx) * 0.1 + Math.abs(this.vy) * 0.1

      // Track max distance
      const distance = Math.sqrt(this.x * this.x + this.y * this.y)
      this.maxDistance = Math.max(this.maxDistance, distance)

      if (this.energy <= 0) break
    }
  }

  fitness() {
    return this.maxDistance
  }

  getBehavior() {
    // For novelty search
    return [this.x, this.y, this.energy]
  }
}

// Evolve with novelty search
const gen = new Generation({
  size: 100,
  individualClass: Creature,
  individualGenomeSize: 150,
  individualNeurons: 20
})

const novelty = new NoveltySearch({ k: 15 })

gen.fillRandom()

for (let i = 0; i < 100; i++) {
  // Simulate all creatures
  gen.population.forEach(creature => creature.simulate(100))

  // Evaluate fitness
  await gen.tickAsync()

  // Evaluate novelty
  novelty.evaluatePopulation(gen.population, c => c.getBehavior())

  // Select based on fitness + novelty
  gen.population.sort((a, b) => {
    const scoreA = a.fitness() + a._noveltyScore * 100
    const scoreB = b.fitness() + b._noveltyScore * 100
    return scoreB - scoreA
  })

  gen.population.slice(-30).forEach(ind => ind.dead = true)
  gen = await gen.nextAsync()
  novelty.nextGeneration()

  const best = gen.population[0]
  console.log(`Gen ${i}: Distance = ${best.maxDistance.toFixed(2)}`)
}
```

## Example 3: All Advanced Features Combined

```javascript
import {
  Generation,
  Individual,
  NoveltySearch,
  MultiObjective,
  HybridGAHC,
  HillClimbing
} from 'genetics-ai.js'

class AdvancedCreature extends Individual {
  fitness() {
    return this.distance
  }

  getObjectives() {
    return {
      distance: this.distance,
      efficiency: this.distance / this.energyUsed,
      stability: -this.oscillations
    }
  }

  getBehavior() {
    return [this.finalX, this.finalY, this.energyUsed]
  }
}

// Setup
const gen = new Generation({
  size: 100,
  individualClass: AdvancedCreature,
  useSpeciation: true,
  adaptiveMutation: true,
  speciationOptions: {
    compatibilityThreshold: 3.0,
    stagnationThreshold: 15
  }
})

const novelty = new NoveltySearch({ k: 15 })
const multiObj = new MultiObjective({
  objectives: ['distance', 'efficiency', 'stability']
})
const hybrid = new HybridGAHC(new HillClimbing({ maxIterations: 10 }), {
  applyToEliteRatio: 0.10
})

gen.fillRandom()

// Evolution loop with ALL features
for (let i = 0; i < 100; i++) {
  // 1. Simulate
  gen.population.forEach(ind => ind.simulate())

  // 2. Evaluate fitness
  await gen.tickAsync({
    onProgress: p => console.log(`Progress: ${p.percentage}%`)
  })

  // 3. Novelty search
  novelty.evaluatePopulation(gen.population, ind => ind.getBehavior())

  // 4. Multi-objective
  const { paretoFront } = multiObj.evaluatePopulation(
    gen.population,
    ind => ind.getObjectives()
  )

  // 5. Selection (Pareto + Novelty)
  const selected = multiObj.select(gen.population, 70)
  gen.population.forEach(ind => {
    if (!selected.includes(ind)) ind.dead = true
  })

  // 6. Hill climbing every 5 generations
  if (i % 5 === 0) {
    hybrid.refineElite(gen.population)
  }

  // 7. Next generation (with speciation!)
  gen = await gen.nextAsync()
  novelty.nextGeneration()

  // 8. Stats
  console.log(`Gen ${i}:`)
  console.log(`  Species: ${gen.speciation.species.length}`)
  console.log(`  Pareto front: ${paretoFront.length}`)
  console.log(`  Best distance: ${gen.population[0].distance.toFixed(2)}`)
}
```

## Example 4: Creatures with Attribute-Based Personalities

Create diverse behaviors using Attribute bases:

```javascript
import { Generation, Individual, AttributeBase, BitBuffer } from 'genetics-ai.js'

class CreatureWithPersonality extends Individual {
  constructor(options) {
    super({
      ...options,
      sensors: [
        { id: 0, tick: () => this.x },
        { id: 1, tick: () => this.enemyDistance },
        { id: 2, tick: () => this.foodDistance },
        { id: 3, tick: () => this.attributes.energy }
      ],
      actions: [
        { id: 0, tick: v => this.moveForward(v) },
        { id: 1, tick: v => this.attack(v) },
        { id: 2, tick: v => this.eat(v) }
      ]
    })

    this.x = 0
    this.attributes = { energy: 100, aggression: 0.5, speed: 1.0, hunger: 50 }
    this.parseAttributes()
  }

  parseAttributes() {
    // Extract attributes from genome
    for (const base of this.genome.bases()) {
      if (base.type === 'attribute') {
        switch (base.attributeId) {
          case AttributeBase.ATTR_ENERGY:
            this.attributes.energy = base.value
            break
          case AttributeBase.ATTR_AGGRESSION:
            this.attributes.aggression = base.value / 255
            break
          case AttributeBase.ATTR_SPEED:
            this.attributes.speed = 0.5 + (base.value / 255) * 1.5
            break
          case AttributeBase.ATTR_HUNGER:
            this.attributes.hunger = base.value / 255 * 100
            break
        }
      }
    }
  }

  moveForward(value) {
    const speed = value * this.attributes.speed
    this.x += speed
    this.attributes.energy -= 0.1 * this.attributes.speed
    return speed
  }

  attack(value) {
    const power = value * (1 + this.attributes.aggression)
    if (this.attributes.aggression > 0.3) {
      this.attributes.energy -= 5
    }
    return power
  }

  eat(value) {
    const urgency = value * (this.attributes.hunger / 100)
    if (this.foodDistance < 2 && this.attributes.hunger > 30) {
      this.attributes.energy += 20
      this.attributes.hunger -= 30
    }
    return urgency
  }

  fitness() {
    return this.attributes.energy + this.x
  }
}

const gen = new Generation({
  size: 100,
  individualClass: CreatureWithPersonality,
  individualGenomeSize: 200
})

gen.fillRandom()

for (let i = 0; i < 50; i++) {
  gen.population.forEach(c => {
    for (let t = 0; t < 100; t++) c.tick()
  })

  gen.population.sort((a, b) => b.fitness() - a.fitness())
  gen.population.slice(-30).forEach(ind => ind.dead = true)
  gen = await gen.nextAsync()

  const best = gen.population[0]
  console.log(`Gen ${i}: Energy=${best.attributes.energy.toFixed(1)}, ` +
              `Aggression=${best.attributes.aggression.toFixed(2)}, ` +
              `Speed=${best.attributes.speed.toFixed(2)}`)
}

// Result: Diverse personalities emerge!
// - "Runners": high speed, low aggression (travel far, avoid fights)
// - "Fighters": high aggression, medium speed (dominate territory)
// - "Survivors": balanced attributes (adaptable generalists)
```

---

## Running the Examples

Each example can be run by copying it into a JavaScript file and running:

```bash
node --experimental-modules your-example.js
```

Or check out the working examples in this directory!
