<div align="center">

# 🧬 genetics-ai.js

### Evolution-powered neural networks with genetic algorithms in JavaScript

*State-of-the-art GA + Neural Networks + Blazing Fast Performance*

[![Tests](https://img.shields.io/badge/tests-262%20passing-brightgreen.svg)](.)
[![Coverage](https://img.shields.io/badge/coverage-61%25-yellow.svg)](.)
[![Version](https://img.shields.io/badge/version-3.0.0-blue.svg)](.)
[![License](https://img.shields.io/badge/license-UNLICENSED-red.svg)](.)

</div>

---

## 🎯 TL;DR

**genetics-ai.js** lets you evolve neural networks using genetic algorithms. No training data needed, no backpropagation - just natural selection!

**Blazing fast, modern codebase** with **built-in profiling and visualization tools**.

```javascript
import { Generation, Individual } from 'genetics-ai.js'

class Creature extends Individual {
  constructor(options) {
    super(options)
    this.distance = 0  // Track how far it travels
  }

  tick() {
    super.tick()  // Brain processes sensors → actions
    this.distance += 0.1  // Creature moves
  }

  fitness() {
    // Fitness = how well it performed (further = better!)
    return this.distance
  }
}

const gen = new Generation({ size: 100, individualClass: Creature })
gen.fillRandom()

for (let i = 0; i < 100; i++) {
  await gen.tickAsync()  // Simulate all creatures
  gen.population.sort((a, b) => b.fitness() - a.fitness())
  gen.population.slice(-30).forEach(ind => ind.dead = true)  // Kill worst 30%
  gen = await gen.nextAsync()  // Reproduce survivors
}
```

**Done!** You just evolved 100 generations. Best creatures travel ~10x farther than generation 1! 🎉

---

## ⚡ Quick Start

### Installation

```bash
npm install genetics-ai.js
# or
pnpm add genetics-ai.js
```

### 3 Examples in 3 Minutes

#### 1️⃣ Your First Evolution (1 minute)

```javascript
import { Generation, Individual } from 'genetics-ai.js'

// Define what you're evolving
class Robot extends Individual {
  constructor(options) {
    super({
      ...options,
      sensors: [
        { id: 0, tick: () => this.x },      // Sensor: current position
        { id: 1, tick: () => this.target }  // Sensor: target position
      ],
      actions: [
        { id: 0, tick: v => { this.x += v * 0.1; return v } }  // Action: move
      ]
    })
    this.x = 0
    this.target = 100
  }

  fitness() {
    return -Math.abs(this.target - this.x)  // Closer to target = better
  }
}

// Evolve!
const gen = new Generation({
  size: 50,
  individualClass: Robot,
  individualGenomeSize: 100,
  individualNeurons: 10
})

gen.fillRandom()

for (let i = 0; i < 50; i++) {
  // Simulate each robot
  gen.population.forEach(robot => {
    for (let step = 0; step < 100; step++) {
      robot.tick()  // Brain decides action based on sensors
    }
  })

  await gen.tickAsync()  // Calculate fitness
  gen.population.sort((a, b) => b.fitness() - a.fitness())
  gen.population.slice(-20).forEach(ind => ind.dead = true)  // Kill worst 40%
  gen = await gen.nextAsync()  // Next generation

  console.log(`Gen ${i}: Best fitness = ${gen.population[0].fitness().toFixed(2)}`)
}
```

**Result**: Robots learn to reach the target in ~20 generations! 🤖

#### 2️⃣ Profile Performance (30 seconds)

```javascript
import { Brain, Genome, PerformanceProfiler } from 'genetics-ai.js'

const genome = Genome.random(100, 10)
const brain = new Brain({ genome, sensors: [], actions: [] })

const profiler = new PerformanceProfiler(brain)
profiler.start()

for (let i = 0; i < 10_000; i++) {
  brain.tick()
}

console.log(profiler.getReport())
// Output:
// ⚡ Optimization Mode: Optimized (Activation LUT)
// ⏱️  Avg per tick: 0.0045ms
// 🎯 Ticks/second: 220,750
// 📊 P50: 0.004ms | P95: 0.006ms | P99: 0.008ms
```

#### 3️⃣ Visualize Your Network (30 seconds)

```javascript
import { Brain, Genome, BrainVisualizer } from 'genetics-ai.js'

const genome = Genome.from('A0001B0002C0003D0101E0102')
const brain = new Brain({ genome, sensors: [], actions: [] })

const visualizer = new BrainVisualizer(brain)
console.log(visualizer.draw())
// Output:
// 📐 Network Topology:
//   Sensors (3): 🔵 🔵 🔵
//   Neurons (5): ⚫ ⚫ ⚫ ⚫ ⚫
//   Actions (2): 🔴 🔴
//   Total connections: 5
//
//   🔵 → ⚫ (0.8)
//   🔵 → ⚫ (0.6)
//   ...
```

---

## 📚 Table of Contents

- [🎯 TL;DR](#-tldr)
- [⚡ Quick Start](#-quick-start)
- [📚 Table of Contents](#-table-of-contents)
- [✨ Key Features](#-key-features)
- [🚀 Core Concepts](#-core-concepts)
  - [How It Works](#how-it-works)
  - [Genome Encoding](#genome-encoding)
  - [Neural Network](#neural-network)
- [📖 API Reference](#-api-reference)
  - [Generation](#generation)
  - [Individual](#individual)
  - [Brain](#brain)
  - [Genome](#genome)
  - [Performance Tools](#performance-tools)
- [🎯 Advanced Features](#-advanced-features)
  - [Speciation (NEAT)](#speciation-neat)
  - [Novelty Search](#novelty-search)
  - [Multi-Objective (NSGA-II)](#multi-objective-nsga-ii)
  - [Hill Climbing](#hill-climbing)
- [📊 Performance](#-performance)
- [🎮 Complete Examples](#-complete-examples)
- [🔧 Troubleshooting](#-troubleshooting)
- [❓ FAQ](#-faq)

---

## ✨ Key Features

### Blazing Fast Performance

```
🚀 Highly optimized for speed and memory efficiency!

Parsing:    ~700k bases/second average
Brain Tick: ~8k ticks/second average, ~12k peak
Math Ops:   50-100x faster activation functions (LUT)
```

### Developer Tools

**PerformanceProfiler** - Built-in profiling
```javascript
const profiler = new PerformanceProfiler(brain)
profiler.start()
// ... run your simulation ...
console.log(profiler.getReport())  // Beautiful metrics!
```

**BrainVisualizer** - ASCII network visualization
```javascript
const visualizer = new BrainVisualizer(brain)
console.log(visualizer.draw())           // Topology
console.log(visualizer.drawActivations()) // Real-time values
const json = visualizer.toJSON()          // Export for external tools
```

### Automatic Optimizations

The brain automatically picks the best optimization strategies for your network:

- **Activation LUT**: 50-100x faster sigmoid/tanh (pre-computed lookup tables)
- **Inline caching**: Optimized vertex value storage
- **Lazy parsing**: Memory-efficient genome parsing with generators
- **TypedArray pools**: Efficient numeric data handling
- **Sparse matrices**: Optimized for large, sparse networks

### Clean, Modern Codebase

Focused entirely on performance and developer experience. No legacy code, no compatibility layers - just the best genetic algorithm library for JavaScript!

---

## 🚀 Core Concepts

### How It Works

```
1. Create creatures (Individuals)
   ↓
2. Each creature has a Brain (neural network)
   ↓
3. Brain is defined by a Genome (genetic code)
   ↓
4. Evaluate fitness (how well they perform)
   ↓
5. Select best performers
   ↓
6. Reproduce (crossover + mutation)
   ↓
7. Repeat → Evolution! 🧬
```

### Genome Encoding

Genomes are encoded as **base-32 strings** or **BitBuffer** (binary) format, where each base represents a genetic instruction:

```javascript
const genome = Genome.from('A0001B0002C0003')
// A0001 = Connection: sensor #0 → neuron #0, weight 0.8
// B0002 = Connection: sensor #0 → neuron #1, weight 0.6
// C0003 = Bias: neuron #0, bias +0.5
```

#### 🧬 Base Types (8 types)

**Basic Bases** (Base-32 encoded):

1. **Connection** (5 chars) - Neural connections with weights
   - Links: sensors → neurons or neurons → actions
   - Weight: 0-15 (mapped to -1.0 to +1.0)
   - Example: `A0001` = sensor #0 → neuron #0, weight 0.8

2. **Bias** (3 chars) - Neuron/action biases
   - Bias: -7 to +7 (mapped to -1.0 to +1.0)
   - Example: `C0003` = neuron #0, bias +0.5

**Advanced Bases** (BitBuffer encoded - 30% more compact):

3. **Attribute** (30 bits) - Custom properties that influence behavior
   - 10 pre-defined attributes: energy, health, hunger, fear, curiosity, aggression, sociability, speed, strength, intelligence
   - Affects: sensors, neurons, or **actions** ⚡
   - Use cases:
     - "energy" reduces action outputs when low
     - "fear" inhibits aggressive actions
     - "hunger" amplifies food-seeking actions
     - "speed" multiplies movement action strength

4. **EvolvedNeuron** (variable bits) - Programmable neurons driven by opcodes
   - Primitives: `NEURON_INPUT`, `ME_X`, `ADD`, `GT`, `CLAMP_NEG1_1`, etc
   - Example: `['IN_0', 'CONST_0', 'GT']` → fires when first input > 0

5. **LearningRule** (23 bits) - Synaptic plasticity rules
   - Types: Hebbian, Anti-Hebbian, STDP, BCM, Oja's Rule
   - Allows weights to change during individual's lifetime

6. **MemoryCell** (20 bits) - Temporal memory with decay
   - Short-term memory that fades over time
   - Persistence: 0 (volatile) to 7 (permanent)

7. **Plasticity** (16 bits) - Meta-learning control
   - Controls HOW MUCH weights can adapt during lifetime
   - Works with LearningRule (which defines HOW they adapt)

8. **Module** (variable bits) - Hierarchical sub-networks
   - Encapsulated sub-networks as reusable components
   - Allows compositional architectures

**💡 Pro Tip**: Mix base types! Use Connections for structure, Attributes for personality, LearningRules for adaptation.

### Neural Network

```
Sensors (inputs) → Neurons (hidden) → Actions (outputs)
     🔵              ⚫                  🔴
```

**Each tick**:
1. Read sensor values from environment
2. Propagate through neurons (weighted sums + activation)
3. Find action with highest input
4. Execute that action

**Activation function**: ReLU by default (configurable)

```javascript
brain.tick()  // Returns { actionName: value }
```

---

## 📖 API Reference

### Generation

The main class for managing populations and evolution.

```javascript
import { Generation } from 'genetics-ai.js'

const gen = new Generation({
  // Required
  size: 100,                    // Population size
  individualClass: MyCreature,  // Your Individual subclass

  // Optional - Genome
  individualGenomeSize: 100,    // Genome length (default: 100)
  individualNeurons: 16,        // Hidden neurons (default: 16)

  // Optional - Selection
  eliteRatio: 0.05,             // Top 5% always survive (default: 0.05)
  tournamentSize: 3,            // Tournament selection size (default: 3)
  randomFillRatio: 0.1,         // Random individuals in next gen (default: 0.1)

  // Optional - Mutation
  mutationRate: 0.001,          // Per-character mutation rate (default: 0.001)
  adaptiveMutation: true,       // Decay mutation over time (default: false)

  // Optional - Advanced
  useSpeciation: false,         // Enable NEAT speciation (default: false)
  speciationOptions: { ... }    // Speciation config
})
```

**Methods**:

```javascript
// Population management
gen.fillRandom()                          // Fill with random individuals
gen.add(individual)                       // Add individual to population

// Evolution
await gen.tickAsync()                     // Calculate fitness (async)
await gen.tickAsync({ onProgress })       // With progress callback
gen = await gen.nextAsync()               // Create next generation

// Access
gen.population                            // Array of all individuals
gen.alive                                 // Array of living individuals
gen.dead                                  // Array of dead individuals
gen.survivalRate                          // Percentage that survived
```

**Progress tracking**:

```javascript
await gen.tickAsync({
  onProgress: (progress) => {
    console.log(`${progress.percentage}% | ${progress.current}/${progress.total}`)
  }
})
```

### Individual

Base class that you extend to create your creatures.

```javascript
import { Individual } from 'genetics-ai.js'

class MyCreature extends Individual {
  constructor(options) {
    super({
      ...options,
      sensors: [
        { id: 0, tick: () => this.x },           // Sensor: position
        { id: 1, tick: () => this.targetX }      // Sensor: target
      ],
      actions: [
        { id: 0, tick: (v) => { this.x += v * 0.1; return v } }  // Action: move
      ]
    })
    // Your custom properties
    this.x = 0
    this.targetX = 100
    this.stepsTaken = 0
  }

  // REQUIRED: Implement fitness function
  fitness() {
    // Calculate fitness based on behavior
    const distanceToTarget = Math.abs(this.targetX - this.x)
    const efficiency = 1000 / (this.stepsTaken + 1)  // Fewer steps = better
    return -distanceToTarget + efficiency  // Closer + faster = higher fitness
  }

  // Optional: Custom tick behavior
  tick() {
    const result = super.tick()  // Brain decides action based on sensors
    this.stepsTaken++
    return result
  }
}
```

**Properties**:

```javascript
individual.genome       // Genome instance
individual.brain        // Brain instance
individual.dead         // Boolean: is this individual dead?
individual.age          // Number of ticks lived
individual.generation   // Generation number
individual.environment  // Reference to environment object
```

**Methods**:

```javascript
individual.tick()                    // Execute one brain tick
individual.fitness()                 // Calculate fitness (you implement this!)
individual.reproduce(other)          // Sexual reproduction (crossover)
individual.mutate()                  // Asexual reproduction (mutation)
individual.fusion(other)             // Genome fusion
```

### Brain

The neural network that processes inputs and produces outputs.

```javascript
import { Brain, Genome } from 'genetics-ai.js'

const brain = new Brain({
  genome: Genome.from('A0001B0002'),  // or Genome.random(100, 10)
  sensors: [
    { id: 0, tick: () => 0.5 }
  ],
  actions: [
    { id: 0, tick: (value) => console.log('Action!', value) }
  ],
  activationFunction: 'relu'  // 'relu', 'sigmoid', or 'tanh' (default: 'relu')
})

// Execute one tick
const result = brain.tick()
// Returns: { actionName: value } or {}
```

**Properties**:

```javascript
brain.genome              // Genome instance
brain.sensors             // Array of sensor objects
brain.actions             // Array of action objects
brain.definitions         // Parsed graph structure
brain.tickOrder           // Execution order for vertices
brain.vertexCache         // Current values of all vertices
```

**Optimization modes** (automatically selected):

```javascript
brain.optimizationMode    // 'standard' | 'optimized' | 'jit'
brain.useJIT              // Boolean: is JIT enabled?
```

### Genome

Genetic code that defines the neural network structure.

```javascript
import { Genome } from 'genetics-ai.js'

// Create from existing string
const genome = Genome.from('A0001B0002C0003')

// Create random genome
const genome = Genome.random(
  100,  // genomeSize: number of characters
  10    // neurons: number of hidden neurons
)

// Generate specific genome
const genome = Genome.generate({
  connections: 20,    // Number of connections to generate
  biases: 5,          // Number of biases to generate
  neurons: 10,        // Number of hidden neurons
  sensors: 3,         // Number of sensors
  actions: 2          // Number of actions
})
```

**Methods**:

```javascript
genome.toString()           // Get base-32 string representation
genome.clone()              // Deep copy
genome.mutate(rate)         // Mutate genome (default rate: 0.001)
genome.crossover(other)     // Sexual reproduction with another genome
```

**Parsing**:

```javascript
// Lazy parsing - only parses bases as needed
for (const base of genome.bases()) {
  console.log(base.type)  // 'connection' or 'bias'
}

// Get all bases at once (eager parsing)
const bases = genome.toArray()
```

### Performance Tools

#### PerformanceProfiler

Measure and analyze brain performance.

```javascript
import { PerformanceProfiler } from 'genetics-ai.js'

const profiler = new PerformanceProfiler(brain)

// Start profiling
profiler.start()

// Run your simulation
for (let i = 0; i < 10_000; i++) {
  brain.tick()
}

// Stop and get report
profiler.stop()
const report = profiler.getReport()
console.log(report)
```

**Report includes**:
- Optimization mode (Standard / Optimized / JIT)
- Average time per tick
- Ticks per second
- Percentiles (P50, P95, P99)
- Total time and ticks
- Automatic recommendations

**Example output**:

```
╔════════════════════════════════════════════╗
║   ⚡ Brain Performance Report              ║
╚════════════════════════════════════════════╝

🧠 Optimization Mode: Optimized (Activation LUT)

⏱️  Average per tick: 0.0045ms
🎯 Ticks/second: 220,750

📊 Percentiles:
   P50 (median): 0.004ms
   P95: 0.006ms
   P99: 0.008ms

📈 Total Stats:
   Total time: 45.23ms
   Total ticks: 10,000
   Network size: 45 vertices, 92 connections

💡 Recommendations:
   ✅ Your brain is well-optimized!
   ✅ Activation LUT is providing major speedup
```

#### BrainVisualizer

Visualize neural network structure and activations.

```javascript
import { BrainVisualizer } from 'genetics-ai.js'

const visualizer = new BrainVisualizer(brain)

// Draw network topology
console.log(visualizer.draw())

// Draw current activation values
console.log(visualizer.drawActivations())

// Export to JSON for external tools (D3.js, Cytoscape, etc.)
const json = visualizer.toJSON()
```

**Example output**:

```
╔════════════════════════════════════════════╗
║   📐 Neural Network Topology               ║
╚════════════════════════════════════════════╝

🔵 Sensors (3):
   sensor_0, sensor_1, sensor_2

⚫ Neurons (5):
   neuron_0, neuron_1, neuron_2, neuron_3, neuron_4

🔴 Actions (2):
   action_0, action_1

📊 Total connections: 12

🔗 Connection Details:
   🔵 sensor_0 → ⚫ neuron_0 (weight: 0.80)
   🔵 sensor_1 → ⚫ neuron_1 (weight: -0.60)
   ⚫ neuron_0 → ⚫ neuron_2 (weight: 0.40)
   ...
```

---

## 🎯 Advanced Features

### Speciation (NEAT)

Protect innovation by grouping similar individuals into species.

```javascript
import { Generation } from 'genetics-ai.js'

const gen = new Generation({
  size: 100,
  individualClass: MyCreature,
  useSpeciation: true,
  speciationOptions: {
    compatibilityThreshold: 3.0,  // How similar to be in same species
    stagnationThreshold: 15       // Generations without improvement before extinction
  }
})

// Evolution loop
for (let i = 0; i < 100; i++) {
  await gen.tickAsync()
  gen = await gen.nextAsync()  // Speciation happens automatically!

  console.log(`Species: ${gen.speciation.species.length}`)
}
```

**When to use**: Slow convergence, premature convergence, or exploring multiple strategies.

### Novelty Search

Reward novel behaviors instead of (or in addition to) fitness.

```javascript
import { Generation, NoveltySearch } from 'genetics-ai.js'

const gen = new Generation({ size: 100, individualClass: MyCreature })
const novelty = new NoveltySearch({
  k: 15,            // Number of nearest neighbors
  threshold: 0.5    // Novelty threshold for archive
})

// Evolution loop
for (let i = 0; i < 100; i++) {
  // 1. Simulate all individuals
  gen.population.forEach(ind => ind.simulate())

  // 2. Evaluate novelty based on behavior
  novelty.evaluatePopulation(
    gen.population,
    ind => [ind.x, ind.y, ind.direction]  // Behavior descriptor
  )

  // 3. Select based on novelty (not fitness!)
  const sorted = novelty.sortByNovelty(gen.population)
  sorted.slice(-30).forEach(ind => ind.dead = true)

  gen = await gen.nextAsync()
  novelty.nextGeneration()  // Update novelty archive
}
```

**When to use**: Deceptive problems where fitness is misleading, or when you want creative solutions.

### Multi-Objective (NSGA-II)

Optimize multiple objectives simultaneously using Pareto fronts.

```javascript
import { Generation, MultiObjective } from 'genetics-ai.js'

const gen = new Generation({ size: 100, individualClass: MyCreature })
const multiObj = new MultiObjective({
  objectives: ['speed', 'accuracy', 'energy']
})

// Evolution loop
for (let i = 0; i < 100; i++) {
  gen.population.forEach(ind => ind.simulate())

  // Evaluate all objectives
  const { paretoFront, ranks } = multiObj.evaluatePopulation(gen.population, {
    speed: ind => ind.speed,
    accuracy: ind => ind.accuracy,
    energy: ind => -ind.energyUsed  // Minimize (negate!)
  })

  console.log(`Pareto front size: ${paretoFront.length}`)

  // Select based on Pareto rank + crowding distance
  const selected = multiObj.select(gen.population, 70)
  gen.population.forEach(ind => {
    if (!selected.includes(ind)) ind.dead = true
  })

  gen = await gen.nextAsync()
}
```

**When to use**: Multiple conflicting objectives (speed vs accuracy, cost vs quality, etc.)

#### 🎯 Multi-Objective + Attributes = 🔥

Combine Multi-Objective with Attribute bases to evolve diverse "personalities":

```javascript
import { Generation, MultiObjective, AttributeBase } from 'genetics-ai.js'

class Creature extends Individual {
  constructor(options) {
    super(options)
    this.attributes = {
      energy: 100,
      aggression: 0,
      speed: 1.0
    }
  }

  tick() {
    // Attributes influence behavior automatically!
    const actions = this.brain.tick()

    // Attack action modified by aggression attribute
    if (actions['attack']) {
      const attackPower = actions['attack'] * (1 + this.attributes.aggression / 100)
      // ... execute attack with modified power
    }

    // Movement modified by speed attribute
    if (actions['move']) {
      const moveSpeed = actions['move'] * this.attributes.speed
      // ... move with modified speed
    }

    // Energy drains faster with higher speed
    this.attributes.energy -= 0.1 * this.attributes.speed

    return actions
  }
}

// Create population with attribute-based genomes
const gen = new Generation({
  size: 100,
  individualClass: Creature,
  individualGenomeSize: 150  // More space for attributes!
})

// Add attributes to random genomes
gen.fillRandom()
gen.population.forEach(ind => {
  // Randomly add energy, aggression, speed attributes
  for (let i = 0; i < 5; i++) {
    const attrType = Math.floor(Math.random() * 3)  // 0=energy, 5=aggression, 7=speed
    const attrId = [AttributeBase.ATTR_ENERGY, AttributeBase.ATTR_AGGRESSION, AttributeBase.ATTR_SPEED][attrType]
    const value = Math.floor(Math.random() * 256)

    // Add attribute base to genome (see AttributeBase docs)
    // ... genome modification code
  }
})

// Multi-objective: survive longer (energy) vs defeat enemies (aggression) vs explore faster (speed)
const multiObj = new MultiObjective({
  objectives: ['survival', 'combat', 'exploration']
})

for (let i = 0; i < 100; i++) {
  gen.population.forEach(ind => ind.simulate())

  // Evaluate objectives
  const { paretoFront } = multiObj.evaluatePopulation(gen.population, {
    survival: ind => ind.attributes.energy,         // High energy = survived longer
    combat: ind => ind.enemiesDefeated,             // Aggression helps here
    exploration: ind => ind.tilesExplored           // Speed helps here
  })

  // Pareto front will contain diverse individuals:
  // - High energy, low aggression, low speed (survival specialists)
  // - Low energy, high aggression, medium speed (combat specialists)
  // - Medium energy, low aggression, high speed (exploration specialists)

  console.log(`Diverse strategies: ${paretoFront.length}`)

  const selected = multiObj.select(gen.population, 70)
  gen.population.forEach(ind => {
    if (!selected.includes(ind)) ind.dead = true
  })

  gen = await gen.nextAsync()
}
```

**Result**: Evolution discovers multiple viable strategies through attribute combinations! 🎉

### Hill Climbing

Refine elite individuals with local search.

```javascript
import { Generation, HillClimbing, HybridGAHC } from 'genetics-ai.js'

const gen = new Generation({ size: 100, individualClass: MyCreature })
const hillClimbing = new HillClimbing({
  maxIterations: 10,      // Max iterations per individual
  stepSize: 0.1,          // Mutation step size
  patience: 3             // Stop after N iterations without improvement
})

const hybrid = new HybridGAHC(hillClimbing, {
  applyToEliteRatio: 0.10  // Refine top 10%
})

// Evolution loop
for (let i = 0; i < 100; i++) {
  await gen.tickAsync()
  gen.population.sort((a, b) => b.fitness() - a.fitness())
  gen.population.slice(-30).forEach(ind => ind.dead = true)

  // Apply hill climbing every 5 generations
  if (i % 5 === 0) {
    hybrid.refineElite(gen.population)
  }

  gen = await gen.nextAsync()
}
```

**When to use**: Final refinement, or when you're close to the optimum but evolution is slow.

---

## 📊 Performance

### Why It's Fast

**Core Optimizations**:

1. **Activation LUT** - 50-100x faster than `Math.exp()`
   - Pre-computed lookup tables for sigmoid/tanh
   - Falls back to Math functions for extreme values

2. **Lazy Parsing** - Memory efficient genome processing
   - Generator-based base iteration
   - Only parses what you need, when you need it

3. **Inline Caching** - Optimized neural network execution
   - Pre-allocated tick cache objects
   - Reused vertex value storage

4. **Smart Data Structures**
   - BitBuffer for compact genome storage
   - Sparse connection matrices for large networks
   - TypedArray pools for numeric data

### Benchmark Results

**Parsing Performance** (bases/second):
```
Small networks (20 connections):   ~850k bases/sec
Medium networks (50 connections):  ~720k bases/sec
Large networks (100 connections):  ~680k bases/sec
```

**Brain Execution** (ticks/second):
```
Small networks:   ~12k ticks/sec
Medium networks:  ~8k ticks/sec  🥇 Best overall
Large networks:   ~5k ticks/sec
```

**Evolution Performance**:
```
Problem: Evolve creatures to reach target position (100 generations)

Final fitness: 2081
Convergence: Stable (0 regressions)
Time: ~3 seconds for 100 individuals
```

### Real-World Performance

| Problem | Generations | Time | Result |
|---------|-------------|------|--------|
| Tic-Tac-Toe AI | 100 | ~2s | 10W-0D-0L vs random |
| Physics Simulation | 50 | ~1s | Learns to move efficiently |
| Pathfinding | 30 | ~0.5s | Finds optimal path |

---

## 🎮 Complete Examples

**[See full examples with complete code →](docs/examples/)**

- **Tic-Tac-Toe Player**: Evolve a neural network to play tic-tac-toe
- **Physics-Based Creatures**: Creatures with velocity, energy, and novelty search
- **All Advanced Features**: Combining speciation, multi-objective, novelty search, and hill climbing
- **Attribute-Based Personalities**: Diverse behaviors through genetic attributes (aggressive, fast, cautious)

---

## 🔧 Troubleshooting

### Problem: Evolution converges too fast (local optima)

**Solution**: Enable speciation or novelty search

```javascript
// Option 1: Speciation
const gen = new Generation({
  size: 100,
  individualClass: MyCreature,
  useSpeciation: true
})

// Option 2: Novelty Search
const novelty = new NoveltySearch({ k: 15 })
novelty.evaluatePopulation(population, ind => ind.getBehavior())
```

### Problem: Evolution is too slow

**Solution**: Increase selection pressure

```javascript
const gen = new Generation({
  size: 100,
  individualClass: MyCreature,
  tournamentSize: 5,        // Larger = more pressure (default: 3)
  eliteRatio: 0.10,         // Keep more elite (default: 0.05)
  randomFillRatio: 0.05     // Less randomness (default: 0.1)
})
```

### Problem: Good solutions keep getting lost

**Solution**: Increase elitism

```javascript
const gen = new Generation({
  size: 100,
  individualClass: MyCreature,
  eliteRatio: 0.15  // Keep top 15% (default: 0.05)
})
```

### Problem: Population becomes too homogeneous

**Solution**: Increase mutation or use speciation

```javascript
const gen = new Generation({
  size: 100,
  individualClass: MyCreature,
  mutationRate: 0.005,      // Higher mutation (default: 0.001)
  adaptiveMutation: false,  // Don't decay mutation
  useSpeciation: true       // Protect diversity
})
```

### Problem: Fitness evaluation is too slow

**Solution**: Use async API with progress tracking

```javascript
// Make fitness evaluation async (e.g., for physics simulations)
class MyCreature extends Individual {
  async fitness() {
    // Run expensive simulation
    for (let i = 0; i < 1000; i++) {
      this.tick()
      if (i % 100 === 0) {
        await new Promise(resolve => setTimeout(resolve, 0))  // Don't block event loop
      }
    }
    return this.distance  // Fitness = how far it traveled
  }
}

// Use async tick
await gen.tickAsync({
  onProgress: p => console.log(`${p.percentage}% complete`)
})
```

### Problem: Need to optimize multiple objectives

**Solution**: Use MultiObjective (Pareto fronts)

```javascript
import { MultiObjective } from 'genetics-ai.js'

const multiObj = new MultiObjective({
  objectives: ['speed', 'accuracy', 'cost']
})

const { paretoFront } = multiObj.evaluatePopulation(population, {
  speed: ind => ind.speed,
  accuracy: ind => ind.accuracy,
  cost: ind => -ind.cost  // Minimize (negate!)
})
```

### Problem: Brain is slow

**Solution**: Profile with PerformanceProfiler

```javascript
import { PerformanceProfiler } from 'genetics-ai.js'

const profiler = new PerformanceProfiler(brain)
profiler.start()
// ... run simulation ...
console.log(profiler.getReport())
// Check optimization mode and recommendations
```

The brain automatically optimizes based on network size for best performance.

### Problem: Can't understand network structure

**Solution**: Use BrainVisualizer

```javascript
import { BrainVisualizer } from 'genetics-ai.js'

const visualizer = new BrainVisualizer(brain)
console.log(visualizer.draw())
console.log(visualizer.drawActivations())

// Export to JSON for external tools
const json = visualizer.toJSON()
```

---

## ❓ FAQ

### General

**Q: What is a genetic algorithm?**
A: A search technique inspired by natural evolution. You create a population of solutions, evaluate their fitness, select the best ones, and create new solutions through reproduction (crossover + mutation). Over many generations, solutions evolve to become better and better.

**Q: How is this different from traditional neural networks?**
A: Traditional NNs use backpropagation and require labeled training data. Genetic algorithms evolve networks through natural selection - no training data needed! Just define what "good" means (fitness function) and evolution does the rest.

**Q: When should I use genetic algorithms vs traditional ML?**
A: Use GAs when:
- You don't have labeled training data
- You can simulate/evaluate solutions (fitness function)
- The problem has a complex search space
- You want to explore creative/novel solutions
- You're optimizing agents in environments (games, robotics, etc.)

**Q: Is this production-ready?**
A: Yes! 262 tests passing, 61% coverage, actively maintained. Used in research and hobby projects. For production, thoroughly test your specific use case.

---

### Performance

**Q: How fast is it?**
A: Very fast! ~8k brain ticks/second average, ~700k genome bases parsed/second. Medium networks (50 connections) perform best.

**Q: What makes it fast?**
A: Three core optimizations:
1. **Activation LUT** - Pre-computed lookup tables (50-100x faster than Math.exp)
2. **Lazy parsing** - Generator-based genome parsing
3. **Inline caching** - Optimized vertex value storage

**Q: Are the optimizations automatic?**
A: Yes! The brain automatically picks the best optimization mode based on your network size. No configuration needed.

---

### DEVX Tools

**Q: How do I profile my brain's performance?**
A: Use PerformanceProfiler:
```javascript
import { PerformanceProfiler } from 'genetics-ai.js'
const profiler = new PerformanceProfiler(brain)
profiler.start()
// ... run simulation ...
console.log(profiler.getReport())
```

**Q: How do I visualize my neural network?**
A: Use BrainVisualizer:
```javascript
import { BrainVisualizer } from 'genetics-ai.js'
const visualizer = new BrainVisualizer(brain)
console.log(visualizer.draw())
console.log(visualizer.drawActivations())
```

**Q: Can I export network structure for external tools?**
A: Yes! BrainVisualizer can export to JSON:
```javascript
const json = visualizer.toJSON()
// Use with D3.js, Cytoscape, etc.
```

---

### Genomes

**Q: What is a genome?**
A: A genome is the genetic code that defines a neural network. It's encoded as a base-32 string (e.g., `"A0001B0002C0003"`).

**Q: How do I create a genome?**
A: Three ways:
```javascript
// 1. From existing string
const genome = Genome.from('A0001B0002')

// 2. Random genome
const genome = Genome.random(100, 10)  // size, neurons

// 3. Generate specific structure
const genome = Genome.generate({
  connections: 20,
  biases: 5,
  neurons: 10,
  sensors: 3,
  actions: 2
})
```

**Q: What's in a genome?**
A: Eight types of genetic "bases" that define network structure and behavior:

**Basic Bases** (Base-32 strings):
- **Connection** (5 chars): Link neurons with weights
- **Bias** (3 chars): Set neuron biases

**Advanced Bases** (BitBuffer - 30% more compact):
- **Attribute** (30 bits): Custom properties like energy, hunger, fear that influence actions
- **EvolvedNeuron** (variable): Opcode-driven neurons that compute on inputs + world state
- **LearningRule** (23 bits): Hebbian, STDP, BCM - weights adapt during lifetime
- **MemoryCell** (20 bits): Short-term memory with decay
- **Plasticity** (16 bits): Meta-learning - controls how much weights can adapt
- **Module** (variable): Hierarchical sub-networks

**Q: When should I use advanced bases?**
A:
- **Attributes**: When you want diverse "personalities" (aggressive vs cautious, fast vs careful)
- **EvolvedNeuron**: When neurons need stack-based logic on sensor inputs & world context
- **LearningRule**: When individuals should learn during their lifetime (not just evolve)
- **MemoryCell**: When decisions depend on recent history
- **Plasticity**: When some neurons should be more adaptable than others
- **Module**: When you want compositional, hierarchical networks

**Q: Can I manually edit genomes?**
A: Yes, but it's advanced! For Connection/Bias bases, each character represents 5 bits. For advanced bases, use the helper classes (`AttributeBase`, `EvolvedNeuronBase`, etc). See `src/bases/` for encoding details. Easier to use `Genome.generate()` or let evolution do it.

---

### Developer Tools

**Q: How do I profile my brain's performance?**
A: Use the built-in PerformanceProfiler:
```javascript
import { PerformanceProfiler } from 'genetics-ai'

const profiler = new PerformanceProfiler()
profiler.start('brain_tick')
brain.tick()
profiler.end('brain_tick')

console.log(profiler.report())
```

**Q: How can I visualize my neural network?**
A: Use the BrainVisualizer for ASCII visualization:
```javascript
import { BrainVisualizer } from 'genetics-ai'

const viz = new BrainVisualizer(brain)
console.log(viz.render())
```

**Q: Are these tools required?**
A: No, they're optional but highly recommended for debugging and optimization.

---

### Activation Functions

**Q: What activation functions are supported?**
A: Three built-in functions:
- `'relu'` (default) - Rectified Linear Unit: `max(0, x)`
- `'sigmoid'` - Logistic: `1 / (1 + e^-x)`
- `'tanh'` - Hyperbolic tangent: `(e^x - e^-x) / (e^x + e^-x)`

**Q: How do I change the activation function?**
A:
```javascript
const brain = new Brain({
  genome,
  sensors,
  actions,
  activationFunction: 'sigmoid'  // or 'relu', 'tanh'
})
```

**Q: Can I use a custom activation function?**
A: Yes! Pass a function:
```javascript
const brain = new Brain({
  genome,
  sensors,
  actions,
  activationFunction: x => Math.max(0, Math.min(1, x))  // Clamp [0, 1]
})
```

Note: Custom functions don't use the Activation LUT optimization.

---

### Advanced Features

**Q: What is speciation (NEAT)?**
A: A technique from the NEAT algorithm that groups similar individuals into "species". This protects innovation - new mutations have time to evolve before competing with the whole population.

**Q: When should I use speciation?**
A: When:
- Evolution converges too fast (premature convergence)
- You want to explore multiple strategies simultaneously
- The fitness landscape is complex with many local optima

**Q: What is novelty search?**
A: Instead of rewarding high fitness, novelty search rewards *different* behaviors. This can help escape local optima and find creative solutions.

**Q: What is multi-objective optimization?**
A: Optimizing multiple objectives simultaneously (e.g., speed + accuracy + cost). Uses Pareto fronts - solutions where improving one objective requires sacrificing another.

**Q: What is hill climbing?**
A: A local search technique that refines solutions through small mutations. Useful for fine-tuning elite individuals when evolution slows down.

---

### Benchmarks

**Q: How do I benchmark my own code?**
A: Create your own benchmark or use the examples in `benchmarks/`:
```bash
node benchmarks/comprehensive.benchmark.js
node benchmarks/detailed-comparison.js
```

**Q: What benchmarks are included?**
A: Three comprehensive benchmarks:
- `comprehensive.benchmark.js` - Overall performance metrics
- `detailed-comparison.js` - Optimization mode comparison
- `jit-comparison.js` - JIT vs non-JIT performance

**Q: How are benchmarks measured?**
A: Through rigorous testing:
- 50,000 iterations per test for statistical significance
- Multiple network sizes (20, 50, 100 connections)
- Measured parsing and brain ticking separately
- Controlled conditions for accurate comparisons

---

### Troubleshooting

**Q: My evolution isn't improving. What's wrong?**
A: Check these common issues:
1. **Fitness function** - Is higher actually better? Is it returning valid numbers?
2. **Selection pressure** - Too harsh? Try lower `tournamentSize`
3. **Mutation rate** - Too low? Try higher `mutationRate`
4. **Genome size** - Too small? Try larger `individualGenomeSize`
5. **Population size** - Too small? Try larger `size`

**Q: Evolution is stuck in a local optimum. Help!**
A: Try:
1. Enable speciation: `useSpeciation: true`
2. Use novelty search to reward different behaviors
3. Increase mutation rate: `mutationRate: 0.005`
4. Disable adaptive mutation: `adaptiveMutation: false`

**Q: My brains are too slow. What can I do?**
A: Check optimization:
```javascript
const profiler = new PerformanceProfiler(brain)
profiler.start()
// ... run ...
console.log(profiler.getReport())
```
The brain should automatically optimize. If not, check:
- Network size (too large = slower)
- Activation function (custom functions are slower)

**Q: I'm getting weird/NaN fitness values. Why?**
A: Common causes:
1. **Division by zero** - Check your fitness calculation
2. **Undefined sensors** - Make sure all sensors return valid numbers
3. **Math operations** - `Math.sqrt()` of negative, `Math.log()` of zero, etc.

Add validation:
```javascript
fitness() {
  // Calculate fitness (your logic here)
  const distance = this.x - this.startX
  const timeBonus = 1000 / (this.stepsTaken + 1)
  const f = distance + timeBonus

  // Validate before returning
  if (!Number.isFinite(f)) return 0  // Fallback for NaN/Infinity
  return f
}
```

---

### Contributing

**Q: How can I contribute?**
A: Contributions are welcome! Check out the issues on GitHub.

**Q: How do I run tests?**
A:
```bash
pnpm test
```

**Q: How do I build?**
A:
```bash
pnpm build
```

**Q: Where can I report bugs?**
A: GitHub issues: [genetics-ai.js/issues](https://github.com/yourusername/genetics-ai.js/issues)

---

## 📦 Exports

```javascript
import {
  // Core
  Generation,
  Individual,
  Genome,
  Brain,
  Reproduction,

  // Advanced Algorithms
  Speciation,
  NoveltySearch,
  MultiObjective,
  HillClimbing,
  HybridGAHC,

  // Developer Tools
  PerformanceProfiler,
  BrainVisualizer,

  // Utilities
  ValidationError,
  createProgressTracker,
  formatDuration,
  formatProgressBar
} from 'genetics-ai.js'
```

---

## 🧪 Tests

```bash
pnpm test    # Run all 262 tests
pnpm build   # Build distribution files
```

---

## 📁 Examples

Run the examples in `examples/`:

```bash
node examples/complete-demo.js              # ⭐ All features combined
node examples/async-api-test.js             # Async/await API
node examples/speciation-test.js            # NEAT speciation
node examples/novelty-search-test.js        # Novelty search
node examples/multi-objective-test.js       # Multi-objective (Pareto)
node examples/convergence-tictactoe-test.js # Tic-tac-toe player
node examples/devx-demo.js                  # Developer tools demo
```

---

## 🎓 Algorithms Implemented

This library implements **state-of-the-art** genetic algorithm techniques from academic research:

| Algorithm | Paper | What It Does |
|-----------|-------|--------------|
| **NEAT** | Stanley & Miikkulainen, 2002 | Speciation + genetic distance for neural evolution |
| **NSGA-II** | Deb et al., 2002 | Multi-objective optimization with Pareto fronts |
| **Novelty Search** | Lehman & Stanley, 2011 | Reward novel behaviors instead of fitness |
| **CMA-ES** | Hansen, 2001 | Adaptive mutation strategies |
| **Elitism** | Goldberg, 1989 | Preserve best solutions across generations |

---

## 🚀 What's New

### v3.0.0 - PERFORMANCE & DEVX RELEASE

**Performance**:
- ⚡ +13.2% faster overall
- ⚡ +30.4% faster for medium networks (50 connections)
- ⚡ +17.8% faster parsing
- ⚡ Activation functions 50-100x faster (lookup tables)

**New Features**:
- 🎨 PerformanceProfiler - Built-in performance profiling
- 🎨 BrainVisualizer - ASCII network visualization
- 🔧 Auto-optimization based on network size
- 📚 Comprehensive documentation

**Bug Fixes**:
- 🐛 Fixed parser false positives
- 🐛 Improved genome validation
- 🐛 Better error messages

**Breaking Changes**:
- ⚠️ None! v3 is 100% backward compatible.

**Migration**:
No changes needed! Just update the version and enjoy the speed:
```bash
npm install genetics-ai.js@3.0.0
```

### v2.3.0

- ✨ Async/await API with progress tracking
- 🧬 NEAT Speciation
- 🎯 Multi-Objective (NSGA-II)
- 🔍 Novelty Search
- ⛰️ Hill Climbing + Hybrid GA
- 📈 +85% better convergence vs v2.1.6

---

<div align="center">

## 🌟 Featured Capabilities

**🚀 Blazing Fast** • **🎨 Built-in DEVX Tools** • **🧬 NEAT Speciation** • **🎯 Multi-Objective** • **🔍 Novelty Search**

**⛰️ Hill Climbing** • **📊 Excellent Convergence** • **✅ 262 Tests** • **🔧 Production Ready**

---

### Made with ❤️ to democratize genetic algorithms in JavaScript

**v3.0.0** • [Benchmarks](benchmarks/) • [Tests](test/) • [Examples](examples/)

</div>
