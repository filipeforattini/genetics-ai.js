import { Generation, Individual, Genome } from '../../../src/index.js'
import fs from 'fs'
import path from 'node:path'
import { fileURLToPath } from 'node:url'

const CHAMPION_PATH = new URL('./tictactoe-champion.json', import.meta.url)
const CHAMPION_FILE = fileURLToPath(CHAMPION_PATH)

/**
 * TIC-TAC-TOE AI - Neural Network learns to play Tic-Tac-Toe!
 *
 * CURRICULUM LEARNING:
 * L1: Random Opponent
 * L2: Blocking Opponent
 * L3: Smart Opponent (center/corners)
 * L4: Minimax Opponent (perfect play)
 * L5: Mixed Opponents
 *
 * Run: node docs/examples/games/tic-tac-toe.js
 * Watch: node docs/examples/games/tic-tac-toe.js --watch
 */

// === CONFIGURATION ===
const GENERATIONS = parseInt(process.argv.find(a => a.startsWith('--generations='))?.split('=')[1]) || 500
const POPULATION_SIZE = 100
const GENOME_SIZE = 80
const NEURON_COUNT = 12
const FITNESS_RUNS = 10
const MUTATION_RATE = 0.08

const WINNING_LINES = [
  [0, 1, 2], [3, 4, 5], [6, 7, 8],
  [0, 3, 6], [1, 4, 7], [2, 5, 8],
  [0, 4, 8], [2, 4, 6]
]

let CURRICULUM_LEVEL = 1

// === TIC-TAC-TOE AI ===
class TicTacToeAI extends Individual {
  constructor(options) {
    super({
      ...options,
      sensors: [
        // Board state: 1 = mine, -1 = opponent, 0 = empty
        { id: 0, tick: () => this.getSensor(0) },
        { id: 1, tick: () => this.getSensor(1) },
        { id: 2, tick: () => this.getSensor(2) },
        { id: 3, tick: () => this.getSensor(3) },
        { id: 4, tick: () => this.getSensor(4) },
        { id: 5, tick: () => this.getSensor(5) },
        { id: 6, tick: () => this.getSensor(6) },
        { id: 7, tick: () => this.getSensor(7) },
        { id: 8, tick: () => this.getSensor(8) },
        // Tactical sensors
        { id: 9, tick: () => this.getMyThreats() },      // Can I win?
        { id: 10, tick: () => this.getOppThreats() },    // Must I block?
        { id: 11, tick: () => this.getCenterOwner() },   // Center control
      ],
      actions: [
        { id: 0, tick: () => { this.chosenMove = 0 } },
        { id: 1, tick: () => { this.chosenMove = 1 } },
        { id: 2, tick: () => { this.chosenMove = 2 } },
        { id: 3, tick: () => { this.chosenMove = 3 } },
        { id: 4, tick: () => { this.chosenMove = 4 } },
        { id: 5, tick: () => { this.chosenMove = 5 } },
        { id: 6, tick: () => { this.chosenMove = 6 } },
        { id: 7, tick: () => { this.chosenMove = 7 } },
        { id: 8, tick: () => { this.chosenMove = 8 } },
      ]
    })

    this.board = Array(9).fill(null)
    this.mySymbol = 'X'
    this.oppSymbol = 'O'
    this.chosenMove = null

    this.wins = 0
    this.losses = 0
    this.draws = 0
    this.invalidMoves = 0
  }

  getSensor(pos) {
    // CRITICAL: Empty cells return 1 (positive signal) so sensor→action connections work!
    // Before: empty=0 meant NO signal flowed, so AI couldn't learn to play on empty cells
    // Now: empty=1, mine=-1, opponent=-1 (blocked positions are negative)
    return this.board[pos] === null ? 1 :     // Empty = positive signal!
           this.board[pos] === this.mySymbol ? -1 : -1  // Occupied = block signal
  }

  getMyThreats() {
    let count = 0
    for (const [a, b, c] of WINNING_LINES) {
      const cells = [this.board[a], this.board[b], this.board[c]]
      const mine = cells.filter(c => c === this.mySymbol).length
      const empty = cells.filter(c => c === null).length
      if (mine === 2 && empty === 1) count++
    }
    return count / 4
  }

  getOppThreats() {
    let count = 0
    for (const [a, b, c] of WINNING_LINES) {
      const cells = [this.board[a], this.board[b], this.board[c]]
      const opp = cells.filter(c => c === this.oppSymbol).length
      const empty = cells.filter(c => c === null).length
      if (opp === 2 && empty === 1) count++
    }
    return count / 4
  }

  getCenterOwner() {
    return this.board[4] === this.mySymbol ? 1 :
           this.board[4] === this.oppSymbol ? -1 : 0
  }

  resetGame(symbol = 'X') {
    this.board = Array(9).fill(null)
    this.mySymbol = symbol
    this.oppSymbol = symbol === 'X' ? 'O' : 'X'
    this.chosenMove = null
  }

  getValidMoves() {
    const moves = []
    for (let i = 0; i < 9; i++) {
      if (this.board[i] === null) moves.push(i)
    }
    return moves
  }

  checkWinner() {
    for (const [a, b, c] of WINNING_LINES) {
      if (this.board[a] && this.board[a] === this.board[b] && this.board[a] === this.board[c]) {
        return this.board[a]
      }
    }
    return this.getValidMoves().length === 0 ? 'DRAW' : null
  }

  // === OPPONENTS ===
  opponentRandom() {
    const v = this.getValidMoves()
    if (v.length > 0) this.board[v[Math.floor(Math.random() * v.length)]] = this.oppSymbol
  }

  opponentBlocking() {
    const v = this.getValidMoves()
    // Block my wins
    for (const m of v) {
      this.board[m] = this.mySymbol
      if (this.checkWinner() === this.mySymbol) {
        this.board[m] = this.oppSymbol
        return
      }
      this.board[m] = null
    }
    this.opponentRandom()
  }

  opponentSmart() {
    const v = this.getValidMoves()
    // Win if possible
    for (const m of v) {
      this.board[m] = this.oppSymbol
      if (this.checkWinner() === this.oppSymbol) return
      this.board[m] = null
    }
    // Block my wins
    for (const m of v) {
      this.board[m] = this.mySymbol
      if (this.checkWinner() === this.mySymbol) {
        this.board[m] = this.oppSymbol
        return
      }
      this.board[m] = null
    }
    // Take center or corner
    if (v.includes(4)) { this.board[4] = this.oppSymbol; return }
    const corners = [0, 2, 6, 8].filter(c => v.includes(c))
    if (corners.length > 0) {
      this.board[corners[Math.floor(Math.random() * corners.length)]] = this.oppSymbol
      return
    }
    this.opponentRandom()
  }

  opponentMinimax() {
    const v = this.getValidMoves()
    let best = -Infinity, bestMove = v[0]
    for (const m of v) {
      this.board[m] = this.oppSymbol
      const s = this.minimax(0, false)
      this.board[m] = null
      if (s > best) { best = s; bestMove = m }
    }
    this.board[bestMove] = this.oppSymbol
  }

  minimax(depth, isMax) {
    const w = this.checkWinner()
    if (w === this.oppSymbol) return 10 - depth
    if (w === this.mySymbol) return depth - 10
    if (w === 'DRAW') return 0

    const v = this.getValidMoves()
    if (isMax) {
      let max = -Infinity
      for (const m of v) {
        this.board[m] = this.oppSymbol
        max = Math.max(max, this.minimax(depth + 1, false))
        this.board[m] = null
      }
      return max
    } else {
      let min = Infinity
      for (const m of v) {
        this.board[m] = this.mySymbol
        min = Math.min(min, this.minimax(depth + 1, true))
        this.board[m] = null
      }
      return min
    }
  }

  playGame(oppType, startAsX) {
    this.resetGame(startAsX ? 'X' : 'O')

    // Opponent first if we're O
    if (!startAsX) {
      if (oppType === 'random') this.opponentRandom()
      else if (oppType === 'blocking') this.opponentBlocking()
      else if (oppType === 'smart') this.opponentSmart()
      else this.opponentMinimax()
    }

    while (true) {
      const valid = this.getValidMoves()
      if (valid.length === 0) break

      // CRITICAL: Reset chosenMove before tick!
      // Otherwise old value persists if brain produces no output
      this.chosenMove = null

      // AI's turn
      super.tick()

      let move = this.chosenMove
      if (move === null || !valid.includes(move)) {
        this.invalidMoves++
        move = valid[Math.floor(Math.random() * valid.length)]
      }

      this.board[move] = this.mySymbol

      let winner = this.checkWinner()
      if (winner) {
        if (winner === this.mySymbol) this.wins++
        else if (winner === 'DRAW') this.draws++
        return
      }

      // Opponent's turn
      if (oppType === 'random') this.opponentRandom()
      else if (oppType === 'blocking') this.opponentBlocking()
      else if (oppType === 'smart') this.opponentSmart()
      else this.opponentMinimax()

      winner = this.checkWinner()
      if (winner) {
        if (winner === this.oppSymbol) this.losses++
        else if (winner === 'DRAW') this.draws++
        return
      }
    }
  }

  fitness() {
    this.wins = 0
    this.losses = 0
    this.draws = 0
    this.invalidMoves = 0

    // Choose opponent based on curriculum
    const opponents = {
      1: 'random',
      2: 'blocking',
      3: 'smart',
      4: 'minimax',
      5: ['random', 'blocking', 'smart', 'minimax']
    }

    for (let i = 0; i < FITNESS_RUNS; i++) {
      let opp = opponents[CURRICULUM_LEVEL]
      if (Array.isArray(opp)) opp = opp[i % opp.length]
      this.playGame(opp, i % 2 === 0)
    }

    // Total moves is ~45 per 10 games (avg 4.5 moves per game)
    const validMoveRatio = 1 - (this.invalidMoves / 45)

    let score = 0
    score += this.wins * 10000
    score += this.draws * (CURRICULUM_LEVEL >= 4 ? 5000 : 2000)
    score -= this.losses * 8000

    // Scale score by valid move ratio - bad networks get crushed
    score = Math.floor(score * Math.max(0.1, validMoveRatio))

    // Huge bonus for valid moves
    if (this.invalidMoves === 0) score += 50000
    else if (this.invalidMoves < 10) score += 20000
    else if (this.invalidMoves < 20) score += 5000

    return score
  }

  render() {
    console.log('\n     0   1   2')
    console.log('   +---+---+---+')
    for (let row = 0; row < 3; row++) {
      let line = ` ${row} |`
      for (let col = 0; col < 3; col++) {
        const cell = this.board[row * 3 + col]
        line += cell === 'X' ? ' X |' : cell === 'O' ? ' O |' : '   |'
      }
      console.log(line)
      console.log('   +---+---+---+')
    }
  }
}

// === CHAMPION ===
function saveChampion(player, gen, level) {
  const data = {
    genome: player.genome.encoded,
    stats: { wins: player.wins, losses: player.losses, draws: player.draws, invalidMoves: player.invalidMoves },
    generation: gen,
    level,
    timestamp: new Date().toISOString()
  }
  fs.mkdirSync(path.dirname(CHAMPION_FILE), { recursive: true })
  fs.writeFileSync(CHAMPION_FILE, JSON.stringify(data, null, 2))
}

function loadChampion() {
  try {
    if (fs.existsSync(CHAMPION_FILE)) return JSON.parse(fs.readFileSync(CHAMPION_FILE, 'utf-8'))
  } catch (e) {}
  return null
}

// === WATCH MODE ===
async function watchGame(ai, oppType) {
  console.log(`\n=== Playing against ${oppType.toUpperCase()} ===\n`)

  for (const startAsX of [true, false]) {
    ai.resetGame(startAsX ? 'X' : 'O')
    console.log(`AI is ${ai.mySymbol}`)

    if (!startAsX) {
      if (oppType === 'random') ai.opponentRandom()
      else if (oppType === 'blocking') ai.opponentBlocking()
      else if (oppType === 'smart') ai.opponentSmart()
      else ai.opponentMinimax()
    }

    ai.render()
    await new Promise(r => setTimeout(r, 500))

    while (true) {
      const valid = ai.getValidMoves()
      if (valid.length === 0) break

      console.log('\nAI thinking...')
      await new Promise(r => setTimeout(r, 300))
      ai.tick()

      let move = ai.chosenMove
      if (move === null || !valid.includes(move)) {
        console.log(`Invalid move, using fallback`)
        move = valid[0]
      }

      console.log(`AI plays ${move}`)
      ai.board[move] = ai.mySymbol
      ai.render()

      let winner = ai.checkWinner()
      if (winner) {
        console.log('\n' + (winner === ai.mySymbol ? 'AI WINS!' : winner === 'DRAW' ? 'DRAW!' : 'AI LOSES!'))
        break
      }

      await new Promise(r => setTimeout(r, 400))
      console.log('\nOpponent...')
      await new Promise(r => setTimeout(r, 200))

      if (oppType === 'random') ai.opponentRandom()
      else if (oppType === 'blocking') ai.opponentBlocking()
      else if (oppType === 'smart') ai.opponentSmart()
      else ai.opponentMinimax()

      ai.render()

      winner = ai.checkWinner()
      if (winner) {
        console.log('\n' + (winner === ai.mySymbol ? 'AI WINS!' : winner === 'DRAW' ? 'DRAW!' : 'AI LOSES!'))
        break
      }

      await new Promise(r => setTimeout(r, 400))
    }

    await new Promise(r => setTimeout(r, 1000))
    console.log('-'.repeat(30))
  }
}

// === EVOLUTION ===
async function evolve() {
  console.log('TIC-TAC-TOE AI EVOLUTION\n')
  console.log(`Population: ${POPULATION_SIZE} | Genome: ${GENOME_SIZE} | Neurons: ${NEURON_COUNT}`)
  console.log(`Curriculum: L1=Random L2=Blocking L3=Smart L4=Minimax L5=Mixed\n`)

  const champion = loadChampion()
  if (champion) {
    console.log(`Champion loaded: W=${champion.stats.wins} L=${champion.stats.losses} Level=${champion.level}\n`)
  }

  const gen = new Generation({
    size: POPULATION_SIZE,
    individualClass: TicTacToeAI,
    individualGenomeSize: GENOME_SIZE,
    individualNeurons: NEURON_COUNT,
    mutationRate: MUTATION_RATE
  })

  // Create "seed" genomes with direct sensor→action connections
  // This gives evolution a working foundation: if cell i is empty, play there
  function createSeedGenome() {
    const bases = []

    // Direct connections: sensor[i] → action[i] for all 9 positions
    // Weight 10-15 = strong connection, empty cells (signal=1) will trigger action
    for (let i = 0; i < 9; i++) {
      bases.push({
        type: 'connection',
        data: 10 + Math.floor(Math.random() * 6), // Weight 10-15
        source: { type: 'sensor', id: i },
        target: { type: 'action', id: i }
      })
    }

    // Add some tactical connections through neurons
    // Threat sensor → high-value actions (center, corners)
    bases.push({
      type: 'connection',
      data: 12,
      source: { type: 'sensor', id: 9 },  // My threats
      target: { type: 'neuron', id: 0 }
    })
    bases.push({
      type: 'connection',
      data: 14,
      source: { type: 'sensor', id: 10 }, // Opp threats
      target: { type: 'neuron', id: 1 }
    })

    // Center preference
    bases.push({
      type: 'connection',
      data: 8,
      source: { type: 'neuron', id: 0 },
      target: { type: 'action', id: 4 }  // Center
    })

    // Add some random noise for diversity
    for (let i = 0; i < 5; i++) {
      bases.push({
        type: 'connection',
        data: Math.floor(Math.random() * 16),
        source: { type: Math.random() < 0.5 ? 'sensor' : 'neuron', id: Math.floor(Math.random() * 12) },
        target: { type: Math.random() < 0.5 ? 'neuron' : 'action', id: Math.floor(Math.random() * 12) }
      })
    }

    return Genome.fromBases(bases)
  }

  // 50% seed genomes, 50% random genomes for diversity
  for (let i = 0; i < POPULATION_SIZE; i++) {
    const genome = i < POPULATION_SIZE / 2
      ? createSeedGenome()
      : Genome.randomWith(GENOME_SIZE, { sensors: 12, neurons: NEURON_COUNT, actions: 9 })

    // Add slight mutation to seeds for diversity
    if (i < POPULATION_SIZE / 2 && i > 0) {
      genome.mutate(0.02)
    }

    gen.population.push(new TicTacToeAI({ genome, neurons: NEURON_COUNT }))
  }

  // Seed with champion
  if (champion) {
    for (let i = 0; i < 10 && i < gen.size; i++) {
      const genome = Genome.from(champion.genome)
      if (i > 0) genome.mutate(0.05)
      gen.population[i] = new TicTacToeAI({ genome, neurons: NEURON_COUNT })
    }
  }

  let bestEver = null
  let bestFitnessEver = -Infinity
  let noImprove = 0

  for (let i = 0; i < GENERATIONS; i++) {
    // Evaluate all
    for (const ind of gen.population) {
      ind._fitness = ind.fitness()
    }

    // Sort by fitness
    gen.population.sort((a, b) => b._fitness - a._fitness)

    const best = gen.population[0]
    const avg = gen.population.reduce((s, ind) => s + ind._fitness, 0) / gen.size
    const perfect = gen.population.filter(ind => ind.losses === 0 && ind.invalidMoves === 0).length

    if (best._fitness > bestFitnessEver) {
      bestFitnessEver = best._fitness
      bestEver = best
      noImprove = 0
      saveChampion(best, i, CURRICULUM_LEVEL)
      console.log(`\nNEW BEST! Fit=${best._fitness} W=${best.wins} L=${best.losses} Inv=${best.invalidMoves}`)
    } else {
      noImprove++
    }

    // Level up check
    if (CURRICULUM_LEVEL === 1 && perfect >= 30 && best.wins >= 9) {
      CURRICULUM_LEVEL = 2
      console.log('\n>>> LEVEL UP: Blocking Opponent <<<\n')
    } else if (CURRICULUM_LEVEL === 2 && perfect >= 25 && best.wins >= 8) {
      CURRICULUM_LEVEL = 3
      console.log('\n>>> LEVEL UP: Smart Opponent <<<\n')
    } else if (CURRICULUM_LEVEL === 3 && perfect >= 20 && best.wins >= 6) {
      CURRICULUM_LEVEL = 4
      console.log('\n>>> LEVEL UP: Minimax Opponent <<<\n')
    } else if (CURRICULUM_LEVEL === 4 && perfect >= 15 && best.losses === 0) {
      CURRICULUM_LEVEL = 5
      console.log('\n>>> LEVEL UP: Mixed Opponents (FINAL) <<<\n')
    }

    console.log(
      `Gen ${i.toString().padStart(3)} [L${CURRICULUM_LEVEL}]: ` +
      `Perfect=${perfect.toString().padStart(2)}/${gen.size} | ` +
      `Best: W=${best.wins} L=${best.losses} Inv=${best.invalidMoves.toString().padStart(2)} | ` +
      `Fit=${best._fitness.toString().padStart(7)} | Avg=${Math.floor(avg).toString().padStart(7)}`
    )

    if (noImprove >= 50) {
      console.log('\nNo improvement for 50 generations.')
      break
    }

    // Selection: top 30% survive
    const survivors = Math.floor(gen.size * 0.3)
    for (let j = 0; j < survivors; j++) gen.population[j].dead = false
    for (let j = survivors; j < gen.size; j++) gen.population[j].dead = true

    // Create next generation
    const nextGen = gen.next()
    gen.population = nextGen.population

    // Re-inject best ever
    if (bestEver) {
      const clone = new TicTacToeAI({ genome: Genome.from(bestEver.genome.encoded), neurons: NEURON_COUNT })
      gen.population[0] = clone
    }
  }

  console.log('\n' + '='.repeat(50))
  console.log('EVOLUTION COMPLETE!')
  if (bestEver) {
    console.log(`Best: W=${bestEver.wins}/${FITNESS_RUNS} L=${bestEver.losses} Inv=${bestEver.invalidMoves}`)
    console.log(`Fitness: ${bestFitnessEver} | Level: ${CURRICULUM_LEVEL}`)
  }
  console.log('='.repeat(50))

  if (process.argv.includes('--watch') && bestEver) {
    console.log('\nStarting watch mode...\n')
    await new Promise(r => setTimeout(r, 1500))
    for (const opp of ['random', 'blocking', 'smart', 'minimax']) {
      await watchGame(bestEver, opp)
    }
  } else {
    console.log('\nRun with --watch to see the AI play!')
  }
}

evolve().catch(console.error)
