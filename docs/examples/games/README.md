# 🎮 Game-Playing AI Examples

Evolve neural networks that learn to play games through natural selection.

---

## 📂 Available Examples

### 🐍 Snake
**File**: `snake.js`

Evolve AI that learns to navigate a 10×10 grid, eat food, and avoid collisions.

**Features**:
- 10 sensors (wall distances, food direction, danger detection)
- 4 actions (up, down, left, right)
- Fitness rewards: eating food, exploration, survival

**Run**:
```bash
node docs/examples/games/snake.js
node docs/examples/games/snake.js --watch  # Watch best AI play
```

**Expected Results**: By gen 100+, best snakes eating 3+ food consistently!

**Why try this**: Fast evolution, visual feedback, emergent pathfinding strategies!

---

### ❌⭕ Tic-Tac-Toe
**File**: `tic-tac-toe.js`

Learn to play Tic-Tac-Toe strategically against smart opponents.

**Features**:
- 9 sensors (board state)
- 9 actions (one per position)
- Trains against random and smart opponents
- Learns to block threats and create wins

**Run**:
```bash
node docs/examples/games/tic-tac-toe.js
node docs/examples/games/tic-tac-toe.js --watch  # Watch best AI play
```

**Expected Results**: By gen 150+, 50+ AIs with near-perfect play!

**Why start here**: Perfect introduction to game AI evolution!

---

### 🔴🟡 Connect Four
**File**: `connect-four.js`

Strategic 4-in-a-row board game AI on a 7×6 grid.

**Features**:
- 21 sensors (column heights, threats, opportunities)
- 7 actions (one per column)
- Trains against random and smart opponents
- Learns to block, attack, and control center

**Run**:
```bash
node docs/examples/games/connect-four.js
node docs/examples/games/connect-four.js --watch  # Watch best AI play
```

**Expected Results**: By gen 150+, 40+ AIs winning 7+/10 games!

**Why try this**: Learn how AI develops strategic thinking through evolution!

---

## 🚀 Possible Games to Implement

### 🎯 Board Games

#### 1. **Checkers** ⭐⭐⭐ Hard

Classic 8×8 board game:

```javascript
sensors: [
  ...board_state,      // 64 cells
  piece_positions,     // Own pieces
  opponent_pieces      // Opponent pieces
]
actions: [
  move_piece[id]_to[position]  // All legal moves
]
```

**Challenges**:
- Complex move rules (diagonal, jumping, kinging)
- Multiple jumps in one turn
- Strategic planning

#### 2. **Reversi/Othello** ⭐⭐ Medium

Flip opponent pieces:

```javascript
// 8×8 board, place disc to flip opponent's discs
// Simple rules, deep strategy
```

#### 3. **Chess** ⭐⭐⭐⭐ Very Hard

The ultimate board game:

```javascript
// Would need massive network
// Consider simplified version (mini-chess 5×5)
// Or specific endgames (King+Rook vs King)
```

### 🕹️ Classic Arcade

#### 4. **Flappy Bird** ⭐ Easy-Medium

Timing-based obstacle avoidance:

```javascript
sensors: [
  { tick: () => this.y },              // Bird height
  { tick: () => this.velocity },       // Vertical velocity
  { tick: () => this.nextPipe.x },     // Distance to pipe
  { tick: () => this.nextPipe.gap_y }, // Gap center height
  { tick: () => this.nextPipe.gap_size }
]
actions: [
  { tick: () => this.flap() }  // Jump!
]
```

**Why it's great**: Simple rules, immediate feedback, fast evolution!

#### 5. **Pong** ⭐ Easy

Classic paddle game:

```javascript
sensors: [
  { tick: () => this.paddle_y },
  { tick: () => this.ball_x },
  { tick: () => this.ball_y },
  { tick: () => this.ball_velocity_y }
]
actions: [
  { tick: () => this.paddle_up() },
  { tick: () => this.paddle_down() }
]
```

**Perfect for beginners!** Simple physics, clear goal.

#### 6. **Breakout** ⭐⭐ Medium

Brick-breaking game:

```javascript
sensors: [
  { tick: () => this.paddle_x },
  { tick: () => this.ball_x },
  { tick: () => this.ball_y },
  { tick: () => this.ball_velocity_x },
  { tick: () => this.ball_velocity_y },
  ...brick_positions  // Remaining bricks
]
actions: [
  { tick: () => this.paddle_left() },
  { tick: () => this.paddle_right() }
]
```

### 🧩 Puzzle Games

#### 7. **2048** ⭐⭐⭐ Hard

Tile merging puzzle:

```javascript
sensors: [
  ...board_state  // 4×4 = 16 tiles
]
actions: [
  { tick: () => this.move('up') },
  { tick: () => this.move('down') },
  { tick: () => this.move('left') },
  { tick: () => this.move('right') }
]

fitness() {
  return this.max_tile * 1000 + this.score
}
```

**Challenges**:
- Complex merge rules
- Strategic planning (corner strategy)
- Exponential growth

#### 8. **Tetris** ⭐⭐⭐ Hard

Block stacking:

```javascript
sensors: [
  ...board_holes,        // Gaps in rows
  board_height,          // Max height
  current_piece_type,
  next_piece_type
]
actions: [
  rotate, left, right, drop
]
```

**Very challenging** - needs look-ahead and planning!

#### 9. **Sokoban** ⭐⭐⭐⭐ Very Hard

Push boxes to targets:

```javascript
// Requires pathfinding and planning
// Extremely hard - can use Novelty Search!
```

### 🏃 Platformers

#### 10. **Mario-like Platformer** ⭐⭐⭐ Hard

Side-scrolling platformer:

```javascript
sensors: [
  ...vision_rays,     // Ray casting for obstacles
  on_ground,
  velocity_x,
  velocity_y,
  enemy_nearby
]
actions: [
  jump, move_right, move_left
]
```

**Use**: David Randall Miller-style simulation!

### 🎲 Strategy & Card Games

#### 11. **Blackjack** ⭐⭐ Medium

Card game - when to hit or stand:

```javascript
sensors: [
  { tick: () => this.hand_value },
  { tick: () => this.dealer_showing },
  { tick: () => this.cards_left_in_deck }
]
actions: [
  { tick: () => this.hit() },
  { tick: () => this.stand() },
  { tick: () => this.double_down() }
]
```

#### 12. **Rock-Paper-Scissors** ⭐ Easy

Pattern recognition:

```javascript
sensors: [
  { tick: () => this.opponent_last_5_moves },
  { tick: () => this.my_last_5_moves }
]
actions: [
  rock, paper, scissors
]
```

**Interesting**: Can it learn to predict opponent patterns?

---

## 💡 General Game AI Template

```javascript
import { Generation, Individual } from 'genetics-ai.js'

class GamePlayer extends Individual {
  constructor(options) {
    super({
      ...options,
      sensors: [
        // Game state inputs
      ],
      actions: [
        // Possible moves
      ]
    })
    this.score = 0
    this.game_state = null
  }

  playGame(opponent = null) {
    // Initialize game
    this.game_state = new GameState()

    while (!this.game_state.isOver()) {
      // Neural network decides move
      this.tick()

      // Execute move in game
      this.game_state.makeMove(this.chosen_action)

      // Opponent's turn (if applicable)
      if (opponent) {
        opponent.tick()
        this.game_state.makeMove(opponent.chosen_action)
      }
    }

    this.score = this.game_state.getScore()
  }

  fitness() {
    // Play multiple games for average performance
    let total_score = 0
    for (let i = 0; i < 10; i++) {
      this.playGame(randomOpponent())
      total_score += this.score
    }
    return total_score / 10
  }
}

// Evolution loop
const gen = new Generation({
  size: 100,
  individualClass: GamePlayer,
  individualGenomeSize: 200,
  individualNeurons: 30
})

gen.fillRandom()

for (let i = 0; i < 1000; i++) {
  // Evaluate by playing games
  await gen.tickAsync()

  // Selection
  gen.population.sort((a, b) => b.fitness() - a.fitness())
  gen.population.slice(-30).forEach(ind => ind.dead = true)

  // Next generation
  gen = await gen.nextAsync()

  console.log(`Gen ${i}: Best score = ${gen.population[0].fitness()}`)
}
```

---

## 🎯 Difficulty Guide

- 🟢 **Beginner**: Pong, Flappy Bird, Rock-Paper-Scissors
- 🟡 **Intermediate**: Tic-Tac-Toe, Snake, Connect Four, Blackjack
- 🔴 **Advanced**: 2048, Breakout, Tetris, Checkers
- ⚫ **Expert**: Chess, Sokoban, Mario platformer

---

## 📊 Fitness Function Design Tips

### For Score-Based Games:
```javascript
fitness() {
  return this.final_score
}
```

### For Survival Games:
```javascript
fitness() {
  return this.steps_survived + this.score * 100
}
```

### For Win/Loss Games:
```javascript
fitness() {
  return this.wins * 100 + this.draws * 50 - this.losses * 200
}
```

### For Time-Based Games:
```javascript
fitness() {
  return this.score / this.time_taken  // Efficiency!
}
```

---

## 🔥 Advanced Techniques

### 1. **Co-Evolution**
Evolve player AND opponent together:
```javascript
// Both populations improve against each other
// Leads to emergent strategies!
```

### 2. **Novelty Search**
For exploration games (Snake, Mario):
```javascript
// Reward novel behaviors, not just high scores
// Discovers creative solutions!
```

### 3. **Multi-Objective**
Optimize multiple goals:
```javascript
objectives: {
  score: ind => ind.score,
  efficiency: ind => ind.score / ind.moves,
  safety: ind => -ind.close_calls
}
```

---

## 🏆 Challenge Ideas

1. **Beat Human Player**: Can your AI beat you consistently?
2. **Speedrun**: Evolve fastest completion (if game has levels)
3. **Perfect Play**: Achieve theoretical maximum (e.g., tic-tac-toe never loses)
4. **Generalization**: Train on one level, test on different levels
5. **Style Points**: Reward aesthetically pleasing play

---

## 📚 Starting Recommendations

**New to GA?** Start with:
1. Flappy Bird (simplest)
2. Pong (classic, easy physics)
3. Tic-Tac-Toe (strategic)

**Want a challenge?**
1. Snake (medium difficulty, fun to watch!)
2. 2048 (strategic puzzle)
3. Connect Four (competitive AI)

**Expert level?**
Try implementing Tetris or a platformer! 🚀

---

## 🎮 Let's Play!

Check out `tic-tac-toe/` to see a complete implementation. Use it as a template for your own games!

**Remember**: Games are the most fun way to learn genetic algorithms. The visual feedback and clear goals make evolution exciting to watch! 🎉
