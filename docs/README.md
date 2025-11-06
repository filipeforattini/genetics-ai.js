# 📚 Documentation & Examples

Complete documentation, examples, and guides for genetics-ai.js.

---

## 🎮 Examples by Category

### 🔢 Mathematics

**Location**: [`examples/math/`](examples/math/)

Solving mathematical problems using genetic algorithms:

- **[Equation Solver](examples/math/equation-solver.js)** - Solve algebraic equations (x² + 2x - 3 = 0)

**🚀 Coming Soon**:
- Function Approximation - Learn to approximate sin(x), cos(x), polynomials
- Optimization Problems - Find minima/maxima of complex functions
- System of Equations - Solve multiple equations simultaneously
- Calculus - Approximate derivatives and integrals
- Sequence Prediction - Predict next numbers in sequences (Fibonacci, primes)
- Matrix Operations - Learn matrix multiplication, inversion
- Symbolic Regression - Discover mathematical formulas from data

### ⚡ Engineering

**Location**: [`examples/engineering/`](examples/engineering/)

Electrical engineering and logic circuit problems:

- **[Logic Gates](examples/engineering/logic-gates.js)** - Evolve AND, OR, XOR, NAND gates
- **[Noise Reducer](examples/engineering/noise-reducer.js)** - Signal processing with neural networks

**🚀 Coming Soon**:
- Digital Circuits - Half adder, full adder, multiplexer
- State Machines - Finite state machine evolution
- PID Controller - Evolve control systems
- Filter Design - Low-pass, high-pass, band-pass filters
- Boolean Function Minimization - Optimize logic expressions
- Sequential Logic - Flip-flops, counters, shift registers

### 🎯 Games

**Location**: [`examples/games/`](examples/games/)

Game-playing AI evolved through genetic algorithms:

- **[Tic-Tac-Toe](examples/games/tic-tac-toe/)** - Complete tic-tac-toe AI
  - Basic implementation
  - Turbocharged version with optimizations
  - Ultimate version with all features
- **[Snake](examples/games/snake/)** - Evolve AI to navigate, eat food, and avoid collisions
  - Wall detection and self-collision avoidance
  - Food navigation and survival optimization
- **[Connect Four](examples/games/connect-four/)** - Strategic 4-in-a-row board game
  - Win/block detection and center control
  - Multi-move planning with strategic opponents

**🚀 Coming Soon**:
- Flappy Bird - Timing-based obstacle avoidance
- Pong - Classic paddle game
- 2048 - Tile merging puzzle
- Breakout - Brick breaking game
- Maze Solver - Pathfinding through mazes

### 🤖 Physics & Simulation

**Location**: [`examples/physics/`](examples/physics/)

**🚀 Coming Soon**:
- Walker - Evolve creatures that learn to walk
- Swimmer - Aquatic creatures with fluid dynamics
- Flyer - Bird-like flight mechanics
- Car Racing - Vehicle control and racing lines
- Pendulum Balance - Inverted pendulum control
- Rocket Landing - SpaceX-style landing optimization

### 🧬 Advanced Features

**Location**: [`examples/`](examples/)

Examples showcasing advanced library features:

- **[Complete Demo](examples/complete-demo.js)** - All features in one example
- **[Async API](examples/async-api-test.js)** - Asynchronous evolution with progress tracking
- **[Speciation](examples/speciation-test.js)** - NEAT-style speciation
- **[Novelty Search](examples/novelty-search-test.js)** - Explore behavior space
- **[Multi-Objective](examples/multi-objective-test.js)** - Pareto optimization (NSGA-II)
- **[Progress Tracking](examples/progress-tracking-test.js)** - Monitor evolution progress
- **[Validation](examples/validation-test.js)** - Input validation examples
- **[DEVX Demo](examples/devx-demo.js)** - Developer tools (profiler, visualizer)
- **[Evolved Sensors](examples/evolved-sensors-demo.js)** - Sensors that evolve their computation
- **[Genome Demo](examples/genome-evolved-sensor-demo.js)** - Advanced genome manipulation

### 🌟 Research & Experiments

**Location**: [`examples/davidrandallmiller/`](examples/davidrandallmiller/)

Based on [David Randall Miller's biosim4](https://github.com/davidrmiller/biosim4):

- Creatures evolving in 2D grid world
- Survival selection based on position
- Complex sensor-action networks

---

## 📖 Architecture & Guides

### Core Documentation

- **[V3 Architecture](V3-ARCHITECTURE.md)** - System architecture overview
- **[V3 Guide](V3-GUIDE.md)** - Complete v3.0 feature guide
- **[Migration Guide](MIGRATION-GUIDE-V3.md)** - Upgrading from previous versions

### Advanced Topics

- **[Attributes Guide](ATTRIBUTES-GUIDE.md)** - Custom attributes for personality traits
- **[Evolved Sensors](EVOLVED-SENSORS.md)** - Creating computed sensors
- **[Evolved Sensors Integration](EVOLVED-SENSORS-GENOME-INTEGRATION.md)** - Genome-level sensor evolution

### Development

- **[DEVX Summary](DEVX-SUMMARY.md)** - Developer experience improvements
- **[DEVX Improvements](V3-DEVX-IMPROVEMENTS.md)** - Detailed DEVX features
- **[JIT Optimization](V3-JIT-OPTIMIZATION.md)** - Just-in-time compilation

### Performance & Benchmarks

- **[Benchmark Results](BENCHMARK-RESULTS.md)** - Performance comparisons
- **[Real Benchmarks](BENCHMARK-RESULTS-REAL.md)** - Real-world benchmark data
- **[Convergence Improvements](CONVERGENCE_IMPROVEMENTS.md)** - Evolution quality improvements

### Project Status

- **[V3 Progress](V3-PROGRESS.md)** - Development progress tracker
- **[V3 Complete](V3-COMPLETE.md)** - Feature completion status
- **[V3 Final Status](V3-FINAL-STATUS.md)** - Final release notes
- **[V3 Victory](V3-VICTORY.md)** - Achievement summary

---

## 🛠️ Utilities

### Benchmarks

**Location**: [`benchmarks/`](benchmarks/)

Performance testing and comparison scripts.

### Scripts

**Location**: [`scripts/`](scripts/)

- **[Run Benchmarks](scripts/run-benchmarks.js)** - Automated benchmark runner

### Champions

**Location**: [`champions/`](champions/)

Saved champion genomes and training checkpoints from evolution runs.

---

## 🌐 Browser Testing

- **[Browser Test](test-browser.html)** - Run genetics-ai.js in the browser

---

## 📊 Data

- **[Metrics](metrics.json)** - Performance metrics and statistics

---

## 🎯 Quick Navigation

**By Difficulty**:
- 🟢 **Beginner**: Tic-Tac-Toe, Logic Gates, Simple Math
- 🟡 **Intermediate**: Speciation, Multi-Objective, Evolved Sensors
- 🔴 **Advanced**: Custom Attributes, JIT Optimization, DEVX Tools

**By Topic**:
- 🧠 **Neural Networks**: All examples use neural networks
- 🧬 **Genetic Algorithms**: Core evolution mechanism
- 🎮 **Reinforcement Learning**: Game-playing examples
- 🔬 **Research**: Novel algorithms (Novelty Search, NSGA-II)

---

## 💡 Contributing Examples

Want to add your own example? Examples should:

1. Be self-contained (single file or folder)
2. Include clear comments
3. Demonstrate a specific use case
4. Run without modification
5. Include a README if complex

See existing examples for structure!
