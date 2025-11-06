import { Generation, Individual } from '../../../src/index.js'

/**
 * ❌⭕ TIC-TAC-TOE AI - Neural Network learns to play Tic-Tac-Toe!
 *
 * The AI learns to:
 * - Make valid moves
 * - Block opponent wins
 * - Create winning opportunities
 * - Play strategically
 *
 * Run: node docs/examples/games/tic-tac-toe.js
 * Watch: node docs/examples/games/tic-tac-toe.js --watch
 */

const GENERATIONS = 300

class TicTacToeAI extends Individual {
  constructor(options) {
    super({
      ...options,
      sensors: [
        // Board state for each position (0 = empty, 1 = my piece, -1 = opponent)
        { id: 0, tick: () => this.getSensor(0) },
        { id: 1, tick: () => this.getSensor(1) },
        { id: 2, tick: () => this.getSensor(2) },
        { id: 3, tick: () => this.getSensor(3) },
        { id: 4, tick: () => this.getSensor(4) },
        { id: 5, tick: () => this.getSensor(5) },
        { id: 6, tick: () => this.getSensor(6) },
        { id: 7, tick: () => this.getSensor(7) },
        { id: 8, tick: () => this.getSensor(8) },
      ],
      actions: [
        // One action per board position
        { id: 0, tick: () => this.chosenMove = 0 },
        { id: 1, tick: () => this.chosenMove = 1 },
        { id: 2, tick: () => this.chosenMove = 2 },
        { id: 3, tick: () => this.chosenMove = 3 },
        { id: 4, tick: () => this.chosenMove = 4 },
        { id: 5, tick: () => this.chosenMove = 5 },
        { id: 6, tick: () => this.chosenMove = 6 },
        { id: 7, tick: () => this.chosenMove = 7 },
        { id: 8, tick: () => this.chosenMove = 8 },
      ]
    })

    this.wins = 0
    this.losses = 0
    this.draws = 0
    this.invalidMoves = 0

    // Initialize default values to prevent errors
    this.board = Array(9).fill(null)
    this.mySymbol = 'X'
    this.oppSymbol = 'O'
  }

  getSensor(pos) {
    if (!this.board) return 0
    return this.board[pos] === this.mySymbol ? 1 :
           this.board[pos] === this.oppSymbol ? -1 : 0
  }

  resetGame(symbol = 'X') {
    this.board = Array(9).fill(null)
    this.mySymbol = symbol
    this.oppSymbol = symbol === 'X' ? 'O' : 'X'
    this.chosenMove = null
  }

  makeMove(position, symbol) {
    if (this.board[position] !== null) return false
    this.board[position] = symbol
    return true
  }

  getValidMoves() {
    return this.board.map((cell, i) => cell === null ? i : null).filter(i => i !== null)
  }

  checkWinner() {
    const lines = [
      [0, 1, 2], [3, 4, 5], [6, 7, 8],  // Rows
      [0, 3, 6], [1, 4, 7], [2, 5, 8],  // Cols
      [0, 4, 8], [2, 4, 6]              // Diagonals
    ]

    for (const [a, b, c] of lines) {
      if (this.board[a] && this.board[a] === this.board[b] && this.board[a] === this.board[c]) {
        return this.board[a]
      }
    }

    return this.board.every(cell => cell !== null) ? 'DRAW' : null
  }

  // Random opponent
  opponentMoveRandom() {
    const valid = this.getValidMoves()
    if (valid.length === 0) return
    const move = valid[Math.floor(Math.random() * valid.length)]
    this.makeMove(move, this.oppSymbol)
  }

  // Smart opponent (blocks wins, takes center, takes corners)
  opponentMoveSmart() {
    const valid = this.getValidMoves()
    if (valid.length === 0) return

    // Check if opponent can win
    for (const move of valid) {
      this.board[move] = this.oppSymbol
      if (this.checkWinner() === this.oppSymbol) {
        return // Keep this winning move
      }
      this.board[move] = null
    }

    // Block player from winning
    for (const move of valid) {
      this.board[move] = this.mySymbol
      if (this.checkWinner() === this.mySymbol) {
        this.board[move] = this.oppSymbol
        return
      }
      this.board[move] = null
    }

    // Take center if available
    if (valid.includes(4)) {
      this.makeMove(4, this.oppSymbol)
      return
    }

    // Take corner
    const corners = [0, 2, 6, 8].filter(c => valid.includes(c))
    if (corners.length > 0) {
      this.makeMove(corners[Math.floor(Math.random() * corners.length)], this.oppSymbol)
      return
    }

    // Take any
    this.makeMove(valid[0], this.oppSymbol)
  }

  playGame(opponentLevel = 'random') {
    this.resetGame('X')  // AI is X (goes first)

    let gameOver = false
    let moves = 0

    while (!gameOver && moves < 20) {
      // AI's turn
      super.tick()  // Neural network chooses move

      const validMoves = this.getValidMoves()

      if (this.chosenMove === null || !validMoves.includes(this.chosenMove)) {
        // Invalid move - choose random valid move as fallback
        if (validMoves.length > 0) {
          this.chosenMove = validMoves[Math.floor(Math.random() * validMoves.length)]
          this.invalidMoves++
        } else {
          break
        }
      }

      this.makeMove(this.chosenMove, this.mySymbol)
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

    // Play multiple games against different opponents
    for (let i = 0; i < 3; i++) {
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
    score -= this.losses * 5000

    // Massive penalty for invalid moves
    score -= this.invalidMoves * 2000

    return Math.floor(score)
  }

  render() {
    console.log('\n     0   1   2')
    console.log('   ┌───┬───┬───┐')
    for (let row = 0; row < 3; row++) {
      const cells = []
      for (let col = 0; col < 3; col++) {
        const pos = row * 3 + col
        const symbol = this.board[pos]
        cells.push(symbol === 'X' ? ' ❌' : symbol === 'O' ? ' ⭕' : '  ')
      }
      console.log(` ${row} │${cells[0]}│${cells[1]}│${cells[2]}│`)
      if (row < 2) console.log('   ├───┼───┼───┤')
    }
    console.log('   └───┴───┴───┘')
  }
}

async function watchBest(ai) {
  console.clear()
  console.log('❌⭕ WATCHING BEST TIC-TAC-TOE AI ❌⭕\n')
  console.log('Playing against SMART opponent...\n')

  ai.resetGame('X')

  let gameOver = false
  let moves = 0

  while (!gameOver && moves < 20) {
    // Show current board
    ai.render()

    // AI's turn
    await new Promise(resolve => setTimeout(resolve, 800))
    console.log('\n🤖 AI thinking...')

    ai.tick()

    const validMoves = ai.getValidMoves()
    if (ai.chosenMove === null || !validMoves.includes(ai.chosenMove)) {
      if (validMoves.length > 0) {
        ai.chosenMove = validMoves[0]
        console.log('⚠️  Invalid move, choosing fallback')
      } else {
        break
      }
    }

    ai.makeMove(ai.chosenMove, ai.mySymbol)
    console.log(`✅ AI plays position ${ai.chosenMove}`)
    moves++

    const winner = ai.checkWinner()
    if (winner) {
      console.clear()
      console.log('❌⭕ GAME OVER ❌⭕\n')
      ai.render()
      console.log('\n' + (winner === 'X' ? '🏆 AI WINS!' : winner === 'O' ? '😢 OPPONENT WINS' : '🤝 DRAW'))
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
      console.log('❌⭕ GAME OVER ❌⭕\n')
      ai.render()
      console.log('\n' + (winner2 === 'X' ? '🏆 AI WINS!' : winner2 === 'O' ? '😢 OPPONENT WINS' : '🤝 DRAW'))
      break
    }

    console.clear()
    console.log('❌⭕ WATCHING BEST TIC-TAC-TOE AI ❌⭕\n')
  }

  console.log()
}

async function evolve() {
  console.log('🧬 TIC-TAC-TOE AI EVOLUTION\n')
  console.log('Training against random and smart opponents...\n')

  const gen = new Generation({
    size: 50,
    individualClass: TicTacToeAI,
    individualGenomeSize: 100,
    individualNeurons: 15,
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
    const perfectPlayers = gen.population.filter(ind => ind.wins >= 4 && ind.losses === 0).length

    if (best.fitness() > bestFitnessEver) {
      bestFitnessEver = best.fitness()
      bestEver = best
    }

    console.log(
      `Gen ${i.toString().padStart(3)}: ` +
      `Perfect=${perfectPlayers.toString().padStart(2)}/${gen.size} | ` +
      `Best: W=${best.wins}/D=${best.draws}/L=${best.losses} | ` +
      `Invalid=${best.invalidMoves} | ` +
      `Fit=${best.fitness().toString().padStart(8)} | ` +
      `Avg=${Math.floor(avgFit).toString().padStart(7)}`
    )

    // Victory: 15+ AIs with 4+ wins and 0 losses
    if (perfectPlayers >= 15) {
      console.log('\n🏆 MASTERY ACHIEVED! 15+ perfect players!')
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
  console.log(`  Wins: ${bestEver.wins}/5`)
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
