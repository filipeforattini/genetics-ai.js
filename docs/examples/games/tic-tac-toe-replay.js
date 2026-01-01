import { Individual, Genome } from '../../../src/index.js'
import fs from 'fs'
import { fileURLToPath } from 'node:url'
import readline from 'readline'

const CHAMPION_PATH = new URL('./tictactoe-champion.json', import.meta.url)
const CHAMPION_FILE = fileURLToPath(CHAMPION_PATH)

/**
 * TIC-TAC-TOE REPLAY - Watch the champion AI play!
 *
 * Run: node docs/examples/games/tic-tac-toe-replay.js
 * Options:
 *   --interactive    Play against the AI yourself
 *   --fast           Speed up animations
 *   --opponent=TYPE  Choose opponent (random, blocking, smart, minimax)
 */

// === CONFIGURATION ===
const WINNING_LINES = [
  [0, 1, 2], [3, 4, 5], [6, 7, 8],
  [0, 3, 6], [1, 4, 7], [2, 5, 8],
  [0, 4, 8], [2, 4, 6]
]

const isInteractive = process.argv.includes('--interactive')
const isFast = process.argv.includes('--fast')
const DELAY_MOVE = isFast ? 200 : 600
const DELAY_THINK = isFast ? 100 : 400

function getOpponentArg() {
  const arg = process.argv.find(a => a.startsWith('--opponent='))
  return arg ? arg.split('=')[1] : 'smart'
}

// === REPLAY AI CLASS ===
class ReplayTicTacToeAI extends Individual {
  constructor(options) {
    super({
      ...options,
      sensors: [
        { id: 0, tick: () => this.getBoardSensor(0) },
        { id: 1, tick: () => this.getBoardSensor(1) },
        { id: 2, tick: () => this.getBoardSensor(2) },
        { id: 3, tick: () => this.getBoardSensor(3) },
        { id: 4, tick: () => this.getBoardSensor(4) },
        { id: 5, tick: () => this.getBoardSensor(5) },
        { id: 6, tick: () => this.getBoardSensor(6) },
        { id: 7, tick: () => this.getBoardSensor(7) },
        { id: 8, tick: () => this.getBoardSensor(8) },
        { id: 9, tick: () => this.getMyWinThreats() },
        { id: 10, tick: () => this.getOppWinThreats() },
        { id: 11, tick: () => this.getMyForks() },
        { id: 12, tick: () => this.getOppForks() },
        { id: 13, tick: () => this.getCenterControl() },
        { id: 14, tick: () => this.getCornerControl() },
        { id: 15, tick: () => this.getEdgeControl() },
        { id: 16, tick: () => this.getValidMovesCount() },
        { id: 17, tick: () => this.getGamePhase() },
        { id: 18, tick: () => this.getMyPieceCount() },
        { id: 19, tick: () => this.getOppPieceCount() },
        { id: 20, tick: () => this.getTurnAdvantage() },
        { id: 21, tick: () => this.getLineMy(0) },
        { id: 22, tick: () => this.getLineOpp(0) },
        { id: 23, tick: () => this.getLineMy(1) },
        { id: 24, tick: () => this.getLineOpp(1) },
        { id: 25, tick: () => this.getLineMy(2) },
        { id: 26, tick: () => this.getLineOpp(2) },
        { id: 27, tick: () => this.getLineMy(3) },
        { id: 28, tick: () => this.getLineOpp(3) },
        { id: 29, tick: () => this.getLineMy(4) },
        { id: 30, tick: () => this.getLineOpp(4) },
        { id: 31, tick: () => this.getLineMy(5) },
        { id: 32, tick: () => this.getLineOpp(5) },
        { id: 33, tick: () => this.getLineMy(6) },
        { id: 34, tick: () => this.getLineOpp(6) },
        { id: 35, tick: () => this.getLineMy(7) },
        { id: 36, tick: () => this.getLineOpp(7) },
        { id: 37, tick: () => this.getPositionPriority(0) },
        { id: 38, tick: () => this.getPositionPriority(1) },
        { id: 39, tick: () => this.getPositionPriority(2) },
        { id: 40, tick: () => this.getPositionPriority(3) },
        { id: 41, tick: () => this.getPositionPriority(4) },
        { id: 42, tick: () => this.getPositionPriority(5) },
        { id: 43, tick: () => this.getPositionPriority(6) },
        { id: 44, tick: () => this.getPositionPriority(7) },
        { id: 45, tick: () => this.getPositionPriority(8) }
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
        { id: 8, tick: () => { this.chosenMove = 8 } }
      ]
    })

    this.board = Array(9).fill(null)
    this.mySymbol = 'X'
    this.oppSymbol = 'O'
    this.chosenMove = null
    this.movedFirst = true
    this._sensorCache = null
    this._sensorCacheStamp = -1
  }

  resetGame(symbol = 'X') {
    this.board = Array(9).fill(null)
    this.mySymbol = symbol
    this.oppSymbol = symbol === 'X' ? 'O' : 'X'
    this.movedFirst = symbol === 'X'
    this.chosenMove = null
    this._sensorCache = null
  }

  makeMove(position, symbol) {
    if (position < 0 || position > 8 || this.board[position] !== null) {
      return false
    }
    this.board[position] = symbol
    this._sensorCache = null
    return true
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

  // Sensor implementations
  getSensorCache() {
    const stamp = this.board.join('')
    if (this._sensorCache && this._sensorCacheStamp === stamp) {
      return this._sensorCache
    }

    const cache = {
      lineAnalysis: [],
      myWinThreats: 0,
      oppWinThreats: 0,
      myForks: 0,
      oppForks: 0
    }

    for (const line of WINNING_LINES) {
      let myCount = 0, oppCount = 0, emptyCount = 0, emptyPos = -1
      for (const pos of line) {
        if (this.board[pos] === this.mySymbol) myCount++
        else if (this.board[pos] === this.oppSymbol) oppCount++
        else { emptyCount++; emptyPos = pos }
      }
      cache.lineAnalysis.push({ myCount, oppCount, emptyCount, emptyPos })
    }

    for (const analysis of cache.lineAnalysis) {
      if (analysis.myCount === 2 && analysis.emptyCount === 1) cache.myWinThreats++
      if (analysis.oppCount === 2 && analysis.emptyCount === 1) cache.oppWinThreats++
    }

    for (let pos = 0; pos < 9; pos++) {
      if (this.board[pos] !== null) continue
      let myThreats = 0, oppThreats = 0
      for (let i = 0; i < WINNING_LINES.length; i++) {
        if (!WINNING_LINES[i].includes(pos)) continue
        const a = cache.lineAnalysis[i]
        if (a.myCount === 1 && a.emptyCount === 2) myThreats++
        if (a.oppCount === 1 && a.emptyCount === 2) oppThreats++
      }
      if (myThreats >= 2) cache.myForks++
      if (oppThreats >= 2) cache.oppForks++
    }

    this._sensorCache = cache
    this._sensorCacheStamp = stamp
    return cache
  }

  clamp(v, min, max) {
    return Math.max(min, Math.min(max, v))
  }

  getBoardSensor(pos) {
    return this.board[pos] === this.mySymbol ? 1 : this.board[pos] === this.oppSymbol ? -1 : 0
  }
  getMyWinThreats() { return this.clamp(this.getSensorCache().myWinThreats / 4, 0, 1) }
  getOppWinThreats() { return this.clamp(this.getSensorCache().oppWinThreats / 4, 0, 1) }
  getMyForks() { return this.clamp(this.getSensorCache().myForks / 2, 0, 1) }
  getOppForks() { return this.clamp(this.getSensorCache().oppForks / 2, 0, 1) }
  getCenterControl() { return this.board[4] === this.mySymbol ? 1 : this.board[4] === this.oppSymbol ? -1 : 0 }
  getCornerControl() {
    const c = [0, 2, 6, 8]
    let my = 0, opp = 0
    for (const p of c) { if (this.board[p] === this.mySymbol) my++; else if (this.board[p] === this.oppSymbol) opp++ }
    return (my - opp) / 4
  }
  getEdgeControl() {
    const e = [1, 3, 5, 7]
    let my = 0, opp = 0
    for (const p of e) { if (this.board[p] === this.mySymbol) my++; else if (this.board[p] === this.oppSymbol) opp++ }
    return (my - opp) / 4
  }
  getValidMovesCount() { let c = 0; for (let i = 0; i < 9; i++) if (!this.board[i]) c++; return c / 9 }
  getGamePhase() { return (9 - this.getValidMoves().length) / 9 }
  getMyPieceCount() { let c = 0; for (let i = 0; i < 9; i++) if (this.board[i] === this.mySymbol) c++; return c / 5 }
  getOppPieceCount() { let c = 0; for (let i = 0; i < 9; i++) if (this.board[i] === this.oppSymbol) c++; return c / 5 }
  getTurnAdvantage() { return this.movedFirst ? 1 : -1 }
  getLineMy(idx) { const a = this.getSensorCache().lineAnalysis[idx]; return a.oppCount > 0 ? -0.5 : a.myCount / 3 }
  getLineOpp(idx) { const a = this.getSensorCache().lineAnalysis[idx]; return a.myCount > 0 ? -0.5 : a.oppCount / 3 }
  getPositionPriority(pos) {
    if (this.board[pos] !== null) return -1
    let priority = 0
    for (let i = 0; i < WINNING_LINES.length; i++) {
      if (!WINNING_LINES[i].includes(pos)) continue
      const a = this.getSensorCache().lineAnalysis[i]
      if (a.myCount === 2 && a.emptyCount === 1) priority += 1.0
      else if (a.oppCount === 2 && a.emptyCount === 1) priority += 0.9
      else if (a.myCount === 1 && a.emptyCount === 2) priority += 0.3
    }
    if (pos === 4) priority += 0.2
    else if ([0, 2, 6, 8].includes(pos)) priority += 0.1
    return this.clamp(priority, -1, 1)
  }

  // Opponent moves
  opponentMoveRandom() {
    const v = this.getValidMoves()
    if (v.length > 0) this.makeMove(v[Math.floor(Math.random() * v.length)], this.oppSymbol)
  }

  opponentMoveBlocking() {
    const v = this.getValidMoves()
    for (const m of v) {
      this.board[m] = this.mySymbol
      if (this.checkWinner() === this.mySymbol) { this.board[m] = this.oppSymbol; return }
      this.board[m] = null
    }
    this.opponentMoveRandom()
  }

  opponentMoveSmart() {
    const v = this.getValidMoves()
    for (const m of v) { this.board[m] = this.oppSymbol; if (this.checkWinner() === this.oppSymbol) return; this.board[m] = null }
    for (const m of v) { this.board[m] = this.mySymbol; if (this.checkWinner() === this.mySymbol) { this.board[m] = this.oppSymbol; return }; this.board[m] = null }
    if (v.includes(4)) { this.makeMove(4, this.oppSymbol); return }
    const corners = [0, 2, 6, 8].filter(c => v.includes(c))
    if (corners.length > 0) { this.makeMove(corners[Math.floor(Math.random() * corners.length)], this.oppSymbol); return }
    this.opponentMoveRandom()
  }

  opponentMoveMinimax() {
    const v = this.getValidMoves()
    let best = -Infinity, bestMove = v[0]
    for (const m of v) {
      this.board[m] = this.oppSymbol
      const s = this.minimax(0, false)
      this.board[m] = null
      if (s > best) { best = s; bestMove = m }
    }
    this.makeMove(bestMove, this.oppSymbol)
  }

  minimax(depth, isMax) {
    const w = this.checkWinner()
    if (w === this.oppSymbol) return 10 - depth
    if (w === this.mySymbol) return depth - 10
    if (w === 'DRAW') return 0
    const v = this.getValidMoves()
    if (isMax) {
      let max = -Infinity
      for (const m of v) { this.board[m] = this.oppSymbol; max = Math.max(max, this.minimax(depth + 1, false)); this.board[m] = null }
      return max
    } else {
      let min = Infinity
      for (const m of v) { this.board[m] = this.mySymbol; min = Math.min(min, this.minimax(depth + 1, true)); this.board[m] = null }
      return min
    }
  }

  opponentMove(type) {
    switch (type) {
      case 'random': this.opponentMoveRandom(); break
      case 'blocking': this.opponentMoveBlocking(); break
      case 'smart': this.opponentMoveSmart(); break
      case 'minimax': this.opponentMoveMinimax(); break
      default: this.opponentMoveRandom()
    }
  }

  render(highlight = null) {
    const colors = {
      reset: '\x1b[0m',
      cyan: '\x1b[36m',
      yellow: '\x1b[33m',
      red: '\x1b[31m',
      green: '\x1b[32m',
      dim: '\x1b[2m'
    }

    console.log()
    console.log(`${colors.dim}     0   1   2${colors.reset}`)
    console.log(`   ${colors.cyan}+---+---+---+${colors.reset}`)
    for (let row = 0; row < 3; row++) {
      let line = `${colors.dim} ${row} ${colors.reset}${colors.cyan}|${colors.reset}`
      for (let col = 0; col < 3; col++) {
        const pos = row * 3 + col
        const cell = this.board[pos]
        let display = '   '
        if (cell === 'X') display = ` ${colors.green}X${colors.reset} `
        else if (cell === 'O') display = ` ${colors.red}O${colors.reset} `
        else if (highlight === pos) display = ` ${colors.yellow}?${colors.reset} `
        line += display + `${colors.cyan}|${colors.reset}`
      }
      console.log(line)
      console.log(`   ${colors.cyan}+---+---+---+${colors.reset}`)
    }
  }
}

// === HELPER FUNCTIONS ===
function loadChampion() {
  try {
    if (fs.existsSync(CHAMPION_FILE)) {
      return JSON.parse(fs.readFileSync(CHAMPION_FILE, 'utf-8'))
    }
  } catch (e) {}
  return null
}

async function sleep(ms) {
  return new Promise(r => setTimeout(r, ms))
}

async function askQuestion(prompt) {
  const rl = readline.createInterface({ input: process.stdin, output: process.stdout })
  return new Promise(resolve => {
    rl.question(prompt, answer => {
      rl.close()
      resolve(answer)
    })
  })
}

// === WATCH MODE ===
async function watchGame(ai, oppType, startAsX) {
  ai.resetGame(startAsX ? 'X' : 'O')

  console.log(`\n${'='.repeat(40)}`)
  console.log(`AI plays as ${ai.mySymbol} vs ${oppType.toUpperCase()}`)
  console.log(`${'='.repeat(40)}`)

  if (!startAsX) {
    console.log('\nOpponent moves first...')
    await sleep(DELAY_MOVE)
    ai.opponentMove(oppType)
  }

  ai.render()
  await sleep(DELAY_MOVE)

  while (true) {
    const valid = ai.getValidMoves()
    if (valid.length === 0) break

    console.log('\nAI thinking...')
    await sleep(DELAY_THINK)
    ai.tick()

    let move = ai.chosenMove
    if (move === null || !valid.includes(move)) {
      console.log(`Invalid move, using fallback`)
      move = valid[0]
    }

    console.log(`AI plays position ${move}`)
    ai.makeMove(move, ai.mySymbol)
    ai.render()

    const w1 = ai.checkWinner()
    if (w1) {
      console.log('\n' + (w1 === ai.mySymbol ? '>>> AI WINS! <<<' : w1 === 'DRAW' ? '>>> DRAW <<<' : '>>> AI LOSES <<<'))
      return w1
    }

    await sleep(DELAY_MOVE)
    console.log('\nOpponent thinking...')
    await sleep(DELAY_THINK)
    ai.opponentMove(oppType)
    console.log('Opponent moved')
    ai.render()

    const w2 = ai.checkWinner()
    if (w2) {
      console.log('\n' + (w2 === ai.mySymbol ? '>>> AI WINS! <<<' : w2 === 'DRAW' ? '>>> DRAW <<<' : '>>> AI LOSES <<<'))
      return w2
    }

    await sleep(DELAY_MOVE)
  }
}

// === INTERACTIVE MODE ===
async function playInteractive(ai) {
  console.clear()
  console.log('TIC-TAC-TOE - PLAY AGAINST THE AI\n')
  console.log('You are O, AI is X')
  console.log('Enter position (0-8) or row,col (e.g., 1,2)\n')

  ai.resetGame('X')  // AI is X, plays first
  ai.render()

  while (true) {
    const valid = ai.getValidMoves()
    if (valid.length === 0) break

    // AI's turn
    console.log('\nAI thinking...')
    await sleep(DELAY_THINK)
    ai.tick()

    let move = ai.chosenMove
    if (move === null || !valid.includes(move)) move = valid[0]

    console.log(`AI plays position ${move}`)
    ai.makeMove(move, 'X')
    ai.render()

    let winner = ai.checkWinner()
    if (winner) {
      console.log('\n' + (winner === 'X' ? 'AI WINS!' : winner === 'DRAW' ? 'DRAW!' : 'YOU WIN!'))
      return
    }

    // Human's turn
    const validNow = ai.getValidMoves()
    if (validNow.length === 0) break

    let humanMove = -1
    while (humanMove === -1) {
      const input = await askQuestion(`\nYour move (${validNow.join(', ')}): `)

      if (input.includes(',')) {
        const [row, col] = input.split(',').map(Number)
        humanMove = row * 3 + col
      } else {
        humanMove = parseInt(input, 10)
      }

      if (isNaN(humanMove) || !validNow.includes(humanMove)) {
        console.log('Invalid move! Try again.')
        humanMove = -1
      }
    }

    ai.makeMove(humanMove, 'O')
    ai.render()

    winner = ai.checkWinner()
    if (winner) {
      console.log('\n' + (winner === 'X' ? 'AI WINS!' : winner === 'DRAW' ? 'DRAW!' : 'YOU WIN!'))
      return
    }
  }
}

// === MAIN ===
async function main() {
  console.clear()
  console.log('TIC-TAC-TOE AI REPLAY\n')

  const champion = loadChampion()
  if (!champion) {
    console.log('No champion found! Run training first:')
    console.log('  node docs/examples/games/tic-tac-toe.js\n')
    process.exit(1)
  }

  console.log('Champion loaded:')
  console.log(`  Wins: ${champion.stats.wins}/${champion.stats.gamesPlayed}`)
  console.log(`  Draws: ${champion.stats.draws}`)
  console.log(`  Losses: ${champion.stats.losses}`)
  console.log(`  Fitness: ${champion.fitness}`)
  console.log(`  Level: ${champion.curriculumLevel}`)
  console.log(`  Generation: ${champion.generation}`)
  console.log()

  const genome = Genome.from(champion.genome)
  const ai = new ReplayTicTacToeAI({
    genome,
    neurons: champion.config?.neurons || 30
  })

  if (isInteractive) {
    await playInteractive(ai)
  } else {
    const oppType = getOpponentArg()
    const opponents = oppType === 'all'
      ? ['random', 'blocking', 'smart', 'minimax']
      : [oppType]

    let wins = 0, losses = 0, draws = 0

    for (const opp of opponents) {
      for (const startAsX of [true, false]) {
        const result = await watchGame(ai, opp, startAsX)
        if (result === ai.mySymbol) wins++
        else if (result === 'DRAW') draws++
        else losses++
        await sleep(1500)
      }
    }

    console.log('\n' + '='.repeat(40))
    console.log('SESSION COMPLETE')
    console.log('='.repeat(40))
    console.log(`Wins: ${wins} | Draws: ${draws} | Losses: ${losses}`)
  }
}

main().catch(console.error)
