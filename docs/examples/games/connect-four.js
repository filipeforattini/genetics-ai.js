import { Generation, Individual } from '../../../src/index.js'

/**
 * 🔴🟡 CONNECT FOUR AI - Neural Network learns to play Connect Four!
 *
 * Grid: 7 columns × 6 rows
 * Goal: Get 4 pieces in a row (horizontal, vertical, or diagonal)
 *
 * The AI learns to:
 * - Make valid moves
 * - Block opponent threats
 * - Create winning sequences
 * - Control the center
 *
 * Run: node docs/examples/games/connect-four.js
 * Watch: node docs/examples/games/connect-four.js --watch
 */

const COLS = 7
const ROWS = 6
const GENERATIONS = 300

class ConnectFourAI extends Individual {
  constructor(options) {
    super({
      ...options,
      sensors: [
        // Column heights (how full is each column? 0-1)
        { id: 0, tick: () => this.heights ? this.heights[0] / ROWS : 0 },
        { id: 1, tick: () => this.heights ? this.heights[1] / ROWS : 0 },
        { id: 2, tick: () => this.heights ? this.heights[2] / ROWS : 0 },
        { id: 3, tick: () => this.heights ? this.heights[3] / ROWS : 0 },
        { id: 4, tick: () => this.heights ? this.heights[4] / ROWS : 0 },
        { id: 5, tick: () => this.heights ? this.heights[5] / ROWS : 0 },
        { id: 6, tick: () => this.heights ? this.heights[6] / ROWS : 0 },

        // Threat detection (opponent can win in column?)
        { id: 7, tick: () => this.board ? this.getThreatLevel(0) : 0 },
        { id: 8, tick: () => this.board ? this.getThreatLevel(1) : 0 },
        { id: 9, tick: () => this.board ? this.getThreatLevel(2) : 0 },
        { id: 10, tick: () => this.board ? this.getThreatLevel(3) : 0 },
        { id: 11, tick: () => this.board ? this.getThreatLevel(4) : 0 },
        { id: 12, tick: () => this.board ? this.getThreatLevel(5) : 0 },
        { id: 13, tick: () => this.board ? this.getThreatLevel(6) : 0 },

        // Opportunity detection (I can win in column?)
        { id: 14, tick: () => this.board ? this.getOpportunityLevel(0) : 0 },
        { id: 15, tick: () => this.board ? this.getOpportunityLevel(1) : 0 },
        { id: 16, tick: () => this.board ? this.getOpportunityLevel(2) : 0 },
        { id: 17, tick: () => this.board ? this.getOpportunityLevel(3) : 0 },
        { id: 18, tick: () => this.board ? this.getOpportunityLevel(4) : 0 },
        { id: 19, tick: () => this.board ? this.getOpportunityLevel(5) : 0 },
        { id: 20, tick: () => this.board ? this.getOpportunityLevel(6) : 0 },
      ],
      actions: [
        // One action per column
        { id: 0, tick: () => this.chosenColumn = 0 },
        { id: 1, tick: () => this.chosenColumn = 1 },
        { id: 2, tick: () => this.chosenColumn = 2 },
        { id: 3, tick: () => this.chosenColumn = 3 },
        { id: 4, tick: () => this.chosenColumn = 4 },
        { id: 5, tick: () => this.chosenColumn = 5 },
        { id: 6, tick: () => this.chosenColumn = 6 },
      ]
    })

    this.wins = 0
    this.losses = 0
    this.draws = 0
    this.invalidMoves = 0

    // Initialize default values to prevent errors
    this.board = Array(ROWS).fill(null).map(() => Array(COLS).fill(0))
    this.heights = Array(COLS).fill(0)
    this.mySymbol = 1
    this.oppSymbol = 2
  }

  resetGame(symbol = 1) {
    this.board = Array(ROWS).fill(null).map(() => Array(COLS).fill(0))
    this.mySymbol = symbol
    this.oppSymbol = symbol === 1 ? 2 : 1
    this.chosenColumn = null
    this.heights = Array(COLS).fill(0)
  }

  getColumnHeight(col) {
    return this.heights[col]
  }

  getThreatLevel(col) {
    if (this.heights[col] >= ROWS) return 0

    // Simulate opponent move
    const row = this.heights[col]
    this.board[row][col] = this.oppSymbol
    const wouldWin = this.checkWinner() === this.oppSymbol
    this.board[row][col] = 0

    return wouldWin ? 1 : 0
  }

  getOpportunityLevel(col) {
    if (this.heights[col] >= ROWS) return 0

    // Simulate my move
    const row = this.heights[col]
    this.board[row][col] = this.mySymbol
    const wouldWin = this.checkWinner() === this.mySymbol
    this.board[row][col] = 0

    return wouldWin ? 1 : 0
  }

  dropPiece(col, symbol) {
    if (col < 0 || col >= COLS || this.heights[col] >= ROWS) return false

    const row = this.heights[col]
    this.board[row][col] = symbol
    this.heights[col]++
    return true
  }

  getValidColumns() {
    return Array.from({ length: COLS }, (_, i) => i).filter(col => this.heights[col] < ROWS)
  }

  checkWinner() {
    // Check horizontal
    for (let row = 0; row < ROWS; row++) {
      for (let col = 0; col <= COLS - 4; col++) {
        const symbol = this.board[row][col]
        if (symbol !== 0 &&
            symbol === this.board[row][col + 1] &&
            symbol === this.board[row][col + 2] &&
            symbol === this.board[row][col + 3]) {
          return symbol
        }
      }
    }

    // Check vertical
    for (let col = 0; col < COLS; col++) {
      for (let row = 0; row <= ROWS - 4; row++) {
        const symbol = this.board[row][col]
        if (symbol !== 0 &&
            symbol === this.board[row + 1][col] &&
            symbol === this.board[row + 2][col] &&
            symbol === this.board[row + 3][col]) {
          return symbol
        }
      }
    }

    // Check diagonal (down-right)
    for (let row = 0; row <= ROWS - 4; row++) {
      for (let col = 0; col <= COLS - 4; col++) {
        const symbol = this.board[row][col]
        if (symbol !== 0 &&
            symbol === this.board[row + 1][col + 1] &&
            symbol === this.board[row + 2][col + 2] &&
            symbol === this.board[row + 3][col + 3]) {
          return symbol
        }
      }
    }

    // Check diagonal (down-left)
    for (let row = 0; row <= ROWS - 4; row++) {
      for (let col = 3; col < COLS; col++) {
        const symbol = this.board[row][col]
        if (symbol !== 0 &&
            symbol === this.board[row + 1][col - 1] &&
            symbol === this.board[row + 2][col - 2] &&
            symbol === this.board[row + 3][col - 3]) {
          return symbol
        }
      }
    }

    // Check draw
    if (this.heights.every(h => h >= ROWS)) return 'DRAW'

    return null
  }

  // Random opponent
  opponentMoveRandom() {
    const valid = this.getValidColumns()
    if (valid.length === 0) return
    const col = valid[Math.floor(Math.random() * valid.length)]
    this.dropPiece(col, this.oppSymbol)
  }

  // Smart opponent
  opponentMoveSmart() {
    const valid = this.getValidColumns()
    if (valid.length === 0) return

    // Win if possible
    for (const col of valid) {
      const row = this.heights[col]
      this.board[row][col] = this.oppSymbol
      if (this.checkWinner() === this.oppSymbol) {
        this.heights[col]++
        return
      }
      this.board[row][col] = 0
    }

    // Block player from winning
    for (const col of valid) {
      const row = this.heights[col]
      this.board[row][col] = this.mySymbol
      if (this.checkWinner() === this.mySymbol) {
        this.board[row][col] = this.oppSymbol
        this.heights[col]++
        return
      }
      this.board[row][col] = 0
    }

    // Prefer center columns
    const centerCols = [3, 2, 4, 1, 5, 0, 6]
    for (const col of centerCols) {
      if (valid.includes(col)) {
        this.dropPiece(col, this.oppSymbol)
        return
      }
    }
  }

  playGame(opponentLevel = 'random') {
    this.resetGame(1)

    let gameOver = false
    let moves = 0

    while (!gameOver && moves < 50) {
      // AI's turn
      super.tick()

      const validCols = this.getValidColumns()

      if (this.chosenColumn === null || !validCols.includes(this.chosenColumn)) {
        if (validCols.length > 0) {
          this.chosenColumn = validCols[Math.floor(Math.random() * validCols.length)]
          this.invalidMoves++
        } else {
          break
        }
      }

      this.dropPiece(this.chosenColumn, this.mySymbol)
      moves++

      const winner = this.checkWinner()
      if (winner) {
        if (winner === this.mySymbol) this.wins++
        else if (winner === 'DRAW') this.draws++
        gameOver = true
        break
      }

      // Opponent's turn
      if (opponentLevel === 'smart') {
        this.opponentMoveSmart()
      } else {
        this.opponentMoveRandom()
      }
      moves++

      const winner2 = this.checkWinner()
      if (winner2) {
        if (winner2 === this.oppSymbol) this.losses++
        else if (winner2 === 'DRAW') this.draws++
        gameOver = true
      }
    }
  }

  fitness() {
    this.wins = 0
    this.losses = 0
    this.draws = 0
    this.invalidMoves = 0

    // Play against different opponents
    for (let i = 0; i < 2; i++) {
      this.playGame('random')
    }
    for (let i = 0; i < 2; i++) {
      this.playGame('smart')
    }

    let score = 0

    // Massive reward for wins
    score += this.wins * 10000

    // Small reward for draws
    score += this.draws * 1000

    // Penalty for losses
    score -= this.losses * 3000

    // Massive penalty for invalid moves
    score -= this.invalidMoves * 5000

    return Math.floor(score)
  }

  render() {
    console.log('\n  0   1   2   3   4   5   6')
    console.log('┌───┬───┬───┬───┬───┬───┬───┐')
    for (let row = ROWS - 1; row >= 0; row--) {
      const cells = []
      for (let col = 0; col < COLS; col++) {
        const symbol = this.board[row][col]
        cells.push(symbol === 1 ? ' 🔴' : symbol === 2 ? ' 🟡' : '  ')
      }
      console.log(`│${cells.join('│')}│`)
      if (row > 0) console.log('├───┼───┼───┼───┼───┼───┼───┤')
    }
    console.log('└───┴───┴───┴───┴───┴───┴───┘')
  }
}

async function watchBest(ai) {
  console.clear()
  console.log('🔴🟡 WATCHING BEST CONNECT FOUR AI 🔴🟡\n')
  console.log('Playing against SMART opponent...\n')
  console.log('AI is 🔴 | Opponent is 🟡\n')

  ai.resetGame(1)

  let gameOver = false
  let moves = 0

  while (!gameOver && moves < 50) {
    // Show current board
    ai.render()

    // AI's turn
    await new Promise(resolve => setTimeout(resolve, 800))
    console.log('\n🤖 AI thinking...')

    ai.tick()

    const validCols = ai.getValidColumns()
    if (ai.chosenColumn === null || !validCols.includes(ai.chosenColumn)) {
      if (validCols.length > 0) {
        ai.chosenColumn = validCols[0]
        console.log('⚠️  Invalid move, choosing fallback')
      } else {
        break
      }
    }

    ai.dropPiece(ai.chosenColumn, ai.mySymbol)
    console.log(`✅ AI drops in column ${ai.chosenColumn}`)
    moves++

    const winner = ai.checkWinner()
    if (winner) {
      console.clear()
      console.log('🔴🟡 GAME OVER 🔴🟡\n')
      ai.render()
      console.log('\n' + (winner === 1 ? '🏆 AI WINS!' : winner === 2 ? '😢 OPPONENT WINS' : '🤝 DRAW'))
      break
    }

    // Opponent's turn
    await new Promise(resolve => setTimeout(resolve, 800))
    console.log('\n🎯 Opponent thinking...')
    ai.opponentMoveSmart()
    console.log('✅ Opponent moved')
    moves++

    const winner2 = ai.checkWinner()
    if (winner2) {
      console.clear()
      console.log('🔴🟡 GAME OVER 🔴🟡\n')
      ai.render()
      console.log('\n' + (winner2 === 1 ? '🏆 AI WINS!' : winner2 === 2 ? '😢 OPPONENT WINS' : '🤝 DRAW'))
      break
    }

    console.clear()
    console.log('🔴🟡 WATCHING BEST CONNECT FOUR AI 🔴🟡\n')
    console.log('AI is 🔴 | Opponent is 🟡\n')
  }

  console.log()
}

async function evolve() {
  console.log('🧬 CONNECT FOUR AI EVOLUTION\n')
  console.log('Training against random and smart opponents...\n')

  const gen = new Generation({
    size: 50,
    individualClass: ConnectFourAI,
    individualGenomeSize: 150,
    individualNeurons: 20,
    mutationRate: 0.05
  })

  gen.fillRandom()

  let bestEver = null
  let bestFitnessEver = -Infinity

  for (let i = 0; i < GENERATIONS; i++) {
    await gen.tickAsync()
    gen.population.sort((a, b) => b.fitness() - a.fitness())

    const best = gen.population[0]
    const avgFit = gen.population.reduce((sum, ind) => sum + ind.fitness(), 0) / gen.size
    const strongPlayers = gen.population.filter(ind => ind.wins >= 3 && ind.losses <= 1).length

    if (best.fitness() > bestFitnessEver) {
      bestFitnessEver = best.fitness()
      bestEver = best
    }

    console.log(
      `Gen ${i.toString().padStart(3)}: ` +
      `Strong=${strongPlayers.toString().padStart(2)}/${gen.size} | ` +
      `Best: W=${best.wins}/D=${best.draws}/L=${best.losses} | ` +
      `Invalid=${best.invalidMoves} | ` +
      `Fit=${best.fitness().toString().padStart(8)} | ` +
      `Avg=${Math.floor(avgFit).toString().padStart(7)}`
    )

    // Victory: 15+ strong players
    if (strongPlayers >= 15) {
      console.log('\n🏆 MASTERY ACHIEVED! 15+ strong players!')
      break
    }

    // Elitism
    for (let j = 0; j < 5; j++) {
      gen.population[j].dead = false
    }

    // Kill bottom 50%
    for (let j = Math.floor(gen.size * 0.5); j < gen.population.length; j++) {
      gen.population[j].dead = true
    }

    const nextGen = await gen.nextAsync()
    Object.assign(gen, nextGen)
  }

  console.log('\n' + '='.repeat(60))
  console.log('🎉 EVOLUTION COMPLETE!')
  console.log('='.repeat(60))
  console.log(`Best Performance:`)
  console.log(`  Wins: ${bestEver.wins}/4`)
  console.log(`  Draws: ${bestEver.draws}`)
  console.log(`  Losses: ${bestEver.losses}`)
  console.log(`  Invalid Moves: ${bestEver.invalidMoves}`)
  console.log(`  Fitness: ${bestEver.fitness()}\n`)

  if (process.argv.includes('--watch')) {
    await watchBest(bestEver)
  } else {
    console.log('💡 Run with --watch to see the best AI play!\n')
  }
}

evolve().catch(err => {
  console.error('ERROR:', err)
  console.error(err.stack)
})
