#!/usr/bin/env node

/**
 * TIC-TAC-TOE CONVERGENCE BENCHMARK
 *
 * Real problem with optimal solution to test convergence
 */

import { Generation, Individual } from '../src/index.js'

class TicTacToePlayer extends Individual {
  constructor(options) {
    super({
      ...options,
      sensors: [
        // Board cells (9 sensors)
        ...Array(9).fill(0).map((_, i) => ({
          tick: () => this.board?.[i] || 0
        })),
        // Player marker
        { tick: () => this.player || 0 },
      ],
      actions: [
        // 9 possible moves
        ...Array(9).fill(0).map((_, i) => ({
          tick: (v) => {
            this.moves[i] = v
            return v
          }
        }))
      ]
    })

    this.board = Array(9).fill(0)
    this.player = 1
    this.moves = Array(9).fill(0)
  }

  chooseMove(board, player) {
    this.board = [...board]
    this.player = player
    this.moves = Array(9).fill(-1000)

    // Neural network thinks
    for (let i = 0; i < 3; i++) {
      this.tick()
    }

    // Find best valid move
    let bestMove = -1
    let bestScore = -Infinity

    for (let i = 0; i < 9; i++) {
      if (board[i] === 0 && this.moves[i] > bestScore) {
        bestScore = this.moves[i]
        bestMove = i
      }
    }

    return bestMove
  }

  playVs(opponent, playerSide) {
    const board = Array(9).fill(0)
    let current = 1

    while (true) {
      let move
      if (current === playerSide) {
        move = this.chooseMove(board, current)
      } else {
        move = opponent(board, current)
      }

      if (move < 0 || move > 8 || board[move] !== 0) {
        return current === playerSide ? -1 : 1
      }

      board[move] = current

      // Check winner
      const lines = [[0,1,2],[3,4,5],[6,7,8],[0,3,6],[1,4,7],[2,5,8],[0,4,8],[2,4,6]]
      for (const [a,b,c] of lines) {
        if (board[a] !== 0 && board[a] === board[b] && board[a] === board[c]) {
          return board[a] === playerSide ? 1 : -1
        }
      }

      if (board.every(c => c !== 0)) return 0

      current = -current
    }
  }

  fitness() {
    let score = 0

    // Opponent: Random
    const randomOpponent = (board) => {
      const valid = []
      for (let i = 0; i < 9; i++) {
        if (board[i] === 0) valid.push(i)
      }
      return valid[Math.floor(Math.random() * valid.length)]
    }

    // Play 10 games
    let wins = 0, draws = 0, losses = 0

    for (let i = 0; i < 10; i++) {
      const side = i % 2 === 0 ? 1 : -1
      const result = this.playVs(randomOpponent, side)

      if (result === 1) {
        wins++
        score += 100
      } else if (result === 0) {
        draws++
        score += 50
      } else {
        losses++
        score -= 20
      }
    }

    // Bonus for never losing
    if (losses === 0) {
      score += 500
    }

    // Bonus for dominating
    if (wins >= 7) {
      score += 300
    }

    this.stats = { wins, draws, losses }

    return Math.max(0, score)
  }
}

async function main() {
  console.log('\n🎮 TIC-TAC-TOE CONVERGENCE TEST')
  console.log('='.repeat(70))

  const configs = [
    {
      name: 'OLD (no improvements)',
      eliteRatio: 0,
      randomFillRatio: 0.5,
      tournamentSize: 1,
      adaptiveMutation: false,
      baseMutationRate: 0.001,
    },
    {
      name: 'NEW (all Phase 1+2)',
      eliteRatio: 0.05,
      randomFillRatio: 0.10,
      tournamentSize: 3,
      adaptiveMutation: true,
      baseMutationRate: 0.01,
    }
  ]

  for (const config of configs) {
    console.log(`\n🧪 Testing: ${config.name}`)
    console.log('='.repeat(50))

    let generation = new Generation({
      size: 30,
      individualClass: TicTacToePlayer,
      individualGenomeSize: 60,
      individualNeurons: 8,
      ...config
    })

    generation.fillRandom()

    let convergedAt = null
    const bestScores = []

    for (let gen = 0; gen < 50; gen++) {
      generation.tick()

      const fitnesses = generation.population.map(i => i.fitness())
      const best = Math.max(...fitnesses)
      const avg = fitnesses.reduce((a, b) => a + b) / fitnesses.length
      const bestInd = generation.population[fitnesses.indexOf(best)]

      bestScores.push(best)

      if (gen % 10 === 0 || gen === 49) {
        const diversity = generation.calculateDiversity()
        const mutRate = generation.getCurrentMutationRate ? generation.getCurrentMutationRate() : config.baseMutationRate

        console.log(`  Gen ${gen.toString().padStart(2)}: Best=${best.toFixed(0).padStart(4)} Avg=${avg.toFixed(1).padStart(5)} ` +
          `Diversity=${(diversity * 100).toFixed(0)}% MutRate=${(mutRate * 1000).toFixed(1)}‰ ` +
          `(${bestInd.stats.wins}W ${bestInd.stats.draws}D ${bestInd.stats.losses}L)`)
      }

      // Check convergence (10 gens without improvement)
      if (!convergedAt && gen >= 10) {
        const recent = bestScores.slice(-10)
        const max = Math.max(...recent)
        if (recent.every(s => s === max) && max > 0) {
          convergedAt = gen - 9
        }
      }

      // Kill bottom 40%
      const sorted = generation.population
        .map((ind, i) => ({ ind, fitness: fitnesses[i] }))
        .sort((a, b) => b.fitness - a.fitness)

      const killCount = Math.floor(generation.size * 0.4)
      for (let i = generation.size - killCount; i < generation.size; i++) {
        sorted[i].ind.dead = true
      }

      if (gen < 49) {
        generation = generation.next()
      }
    }

    const finalBest = bestScores[bestScores.length - 1]
    console.log(`\n  📊 Final: Best=${finalBest.toFixed(0)} Converged=${convergedAt !== null ? `Gen ${convergedAt}` : 'Never'}`)
  }

  console.log('\n' + '='.repeat(70))
}

main().catch(console.error)
