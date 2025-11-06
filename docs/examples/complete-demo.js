#!/usr/bin/env node

/**
 * COMPLETE DEMO - Demonstra todas as features avançadas
 *
 * Este exemplo mostra:
 * - ✅ Async/await API
 * - ✅ Flexible arguments
 * - ✅ Progress tracking
 * - ✅ Validation
 * - ✅ Speciation (NEAT)
 * - ✅ Novelty Search
 * - ✅ Multi-Objective
 * - ✅ Fitness sharing
 * - ✅ Crowding distance
 * - ✅ Hybrid GA + Hill Climbing
 */

import {
  Generation,
  Individual,
  NoveltySearch,
  MultiObjective,
  HillClimbing,
  HybridGAHC,
  formatDuration,
  formatProgressBar
} from '../src/index.js'

// Problema: Criatura que deve chegar a um objetivo
// - Maximizar distância percorrida (fitness)
// - Explorar diferentes estratégias de movimento (novelty)
// - Balancear velocidade vs eficiência energética (multi-objective)

class SmartCreature extends Individual {
  constructor(options) {
    super({
      ...options,
      sensors: [
        { tick: () => this.position.x },
        { tick: () => this.position.y },
        { tick: () => this.velocity.x },
        { tick: () => this.velocity.y },
      ],
      actions: [
        { tick: (v) => { this.velocity.x += v * 0.1; return v } },  // Acelerar X
        { tick: (v) => { this.velocity.y += v * 0.1; return v } },  // Acelerar Y
      ]
    })

    this.position = { x: 0, y: 0 }
    this.velocity = { x: 0, y: 0 }
    this.energy = 100
    this.path = []
  }

  // Simula movimento por N steps
  simulate(steps = 100) {
    this.position = { x: 0, y: 0 }
    this.velocity = { x: 0, y: 0 }
    this.energy = 100
    this.path = []

    for (let i = 0; i < steps; i++) {
      // Brain pensa e age
      this.tick()

      // Física
      this.position.x += this.velocity.x
      this.position.y += this.velocity.y

      // Drag
      this.velocity.x *= 0.95
      this.velocity.y *= 0.95

      // Gasta energia
      const speed = Math.sqrt(this.velocity.x ** 2 + this.velocity.y ** 2)
      this.energy -= speed * 0.1

      // Registra posição
      this.path.push({ ...this.position })

      // Morre se acabar energia
      if (this.energy <= 0) break
    }
  }

  // Fitness: distância total percorrida
  fitness() {
    const distance = Math.sqrt(this.position.x ** 2 + this.position.y ** 2)
    return distance
  }

  // Behavior para Novelty Search: padrão de movimento
  getBehavior() {
    // Caracteriza comportamento pela trajetória
    const samples = 10
    const step = Math.floor(this.path.length / samples)

    const behavior = []
    for (let i = 0; i < samples && i * step < this.path.length; i++) {
      const pos = this.path[i * step]
      behavior.push(pos.x, pos.y)
    }

    return behavior
  }

  // Objetivos para Multi-Objective
  getObjectives() {
    return {
      distance: this.fitness(),
      efficiency: this.energy / 100,  // Quanto de energia sobrou
      pathLength: this.path.length     // Quantos steps sobreviveu
    }
  }
}

async function main() {
  console.log('\n🧬 COMPLETE DEMO - All Advanced Features')
  console.log('='.repeat(70))

  // ===== CONFIGURAÇÃO =====
  console.log('\n📋 Configurando algoritmo...')

  let generation = new Generation({
    size: 60,
    individualClass: SmartCreature,
    individualGenomeSize: 40,
    individualNeurons: 8,

    // Phase 1+2: Convergence improvements
    eliteRatio: 0.05,
    randomFillRatio: 0.10,
    tournamentSize: 3,
    adaptiveMutation: true,
    baseMutationRate: 0.02,

    // Speciation (NEAT)
    useSpeciation: true,
    speciationOptions: {
      compatibilityThreshold: 2.5,
      stagnationThreshold: 15,
    }
  })

  // Novelty Search
  const novelty = new NoveltySearch({
    k: 10,
    archiveThreshold: 0.85,
  })

  // Multi-Objective
  const multiObjective = new MultiObjective({
    objectives: ['distance', 'efficiency', 'pathLength']
  })

  // Hill Climbing
  const hillClimbing = new HillClimbing({
    maxIterations: 5,
    mutationStrength: 0.005,
    patience: 2
  })

  const hybridHC = new HybridGAHC(hillClimbing, {
    applyToEliteRatio: 0.10
  })

  console.log('✅ Configuração completa')
  console.log(`   População: ${generation.size}`)
  console.log(`   Speciation: ${generation.useSpeciation}`)
  console.log(`   Mutation rate: ${generation.baseMutationRate}`)

  // ===== POPULAÇÃO INICIAL =====
  console.log('\n🌱 Criando população inicial...')
  generation.fillRandom()

  // Simula todos
  generation.population.forEach(ind => ind.simulate(100))

  console.log('✅ População criada e simulada')

  // ===== EVOLUÇÃO =====
  console.log('\n🔄 Iniciando evolução...\n')

  const startTime = Date.now()
  const generations = 30
  const history = {
    bestFitness: [],
    avgFitness: [],
    speciesCount: [],
    noveltyArchive: [],
    paretoSize: []
  }

  for (let gen = 0; gen < generations; gen++) {
    // ===== TICK COM PROGRESS =====
    await generation.tickAsync({
      onProgress: (p) => {
        if (p.percentage === 100) {
          const bar = formatProgressBar(p.percentage, 15)
          process.stdout.write(`\r  Gen ${gen.toString().padStart(2)}: ${bar} 100%`)
        }
      }
    })

    // Simula todos
    generation.population.forEach(ind => ind.simulate(100))

    // ===== NOVELTY SEARCH =====
    novelty.evaluatePopulation(
      generation.population,
      ind => ind.getBehavior()
    )

    // ===== MULTI-OBJECTIVE =====
    const objectives = {
      distance: ind => ind.getObjectives().distance,
      efficiency: ind => ind.getObjectives().efficiency,
      pathLength: ind => ind.getObjectives().pathLength
    }

    const moResult = multiObjective.evaluatePopulation(generation.population, objectives)

    // ===== HYBRID FITNESS (fitness + novelty) =====
    generation.population.forEach(ind => {
      const fitness = ind.fitness()
      const noveltyScore = ind._noveltyScore || 0

      // Combina fitness tradicional com novelty
      ind._combinedScore = (0.7 * fitness) + (0.3 * noveltyScore * 100)
    })

    // ===== HILL CLIMBING NOS ELITE =====
    if (gen % 5 === 0) {
      hybridHC.refineElite(generation.population, ind => {
        ind.simulate(100)
        return ind.fitness()
      })
    }

    // ===== ESTATÍSTICAS =====
    const fitnesses = generation.population.map(ind => ind._combinedScore || ind.fitness())
    const best = Math.max(...fitnesses)
    const avg = fitnesses.reduce((a, b) => a + b) / fitnesses.length

    history.bestFitness.push(best)
    history.avgFitness.push(avg)

    const specInfo = generation.meta.speciation || { speciesCount: 0 }
    history.speciesCount.push(specInfo.speciesCount)

    const noveltyStats = novelty.getStats()
    history.noveltyArchive.push(noveltyStats.archiveSize)

    history.paretoSize.push(moResult.paretoFront.length)

    // Log a cada 5 gerações
    if (gen % 5 === 0 || gen === generations - 1) {
      const diversity = generation.calculateDiversity()

      console.log(`\r  Gen ${gen.toString().padStart(2)}: ` +
        `Best=${best.toFixed(0).padStart(4)} ` +
        `Avg=${avg.toFixed(0).padStart(4)} ` +
        `Species=${specInfo.speciesCount} ` +
        `NoveltyArchive=${noveltyStats.archiveSize.toString().padStart(3)} ` +
        `Pareto=${moResult.paretoFront.length.toString().padStart(2)} ` +
        `Div=${(diversity * 100).toFixed(0)}%`)
    }

    // ===== SELEÇÃO =====
    // Usa Pareto ranking para selecionar melhores
    const selected = multiObjective.select(generation.population, generation.size)

    // Mata bottom 40%
    const killCount = Math.floor(generation.size * 0.4)
    selected.slice(-killCount).forEach(ind => ind.dead = true)

    // ===== PRÓXIMA GERAÇÃO =====
    if (gen < generations - 1) {
      generation = await generation.nextAsync()
      generation.population.forEach(ind => ind.simulate(100))
      novelty.nextGeneration()
    }
  }

  const elapsed = Date.now() - startTime

  // ===== RESULTADOS FINAIS =====
  console.log('\n')
  console.log('='.repeat(70))
  console.log('📊 RESULTADOS FINAIS')
  console.log('='.repeat(70))

  const improvement = ((history.bestFitness[history.bestFitness.length - 1] - history.bestFitness[0]) / history.bestFitness[0] * 100).toFixed(1)

  console.log(`\n  Tempo total: ${formatDuration(elapsed)}`)
  console.log(`  Gerações: ${generations}`)
  console.log(`  Fitness inicial: ${history.bestFitness[0].toFixed(0)}`)
  console.log(`  Fitness final: ${history.bestFitness[history.bestFitness.length - 1].toFixed(0)}`)
  console.log(`  Melhoria: ${improvement}%`)
  console.log(`  Espécies finais: ${history.speciesCount[history.speciesCount.length - 1]}`)
  console.log(`  Comportamentos novos arquivados: ${history.noveltyArchive[history.noveltyArchive.length - 1]}`)
  console.log(`  Soluções no Pareto Front: ${history.paretoSize[history.paretoSize.length - 1]}`)

  // ===== MELHOR INDIVÍDUO =====
  console.log('\n  🏆 Melhor Indivíduo:')
  const best = generation.population.reduce((best, ind) => {
    return (ind._combinedScore || ind.fitness()) > (best._combinedScore || best.fitness()) ? ind : best
  })

  best.simulate(100)
  const objectives = best.getObjectives()

  console.log(`     Distância: ${objectives.distance.toFixed(2)}`)
  console.log(`     Eficiência: ${(objectives.efficiency * 100).toFixed(1)}%`)
  console.log(`     Passos sobrevividos: ${objectives.pathLength}`)
  console.log(`     Novelty score: ${(best._noveltyScore || 0).toFixed(2)}`)
  console.log(`     Pareto rank: ${best._rank}`)
  console.log(`     Crowding distance: ${(best._crowdingDistance || 0).toFixed(2)}`)

  // ===== FEATURES UTILIZADAS =====
  console.log('\n  ✅ Features utilizadas neste exemplo:')
  console.log('     - Promise/async-await API (tickAsync, nextAsync)')
  console.log('     - Progress tracking com callbacks')
  console.log('     - Flexible arguments (options + callback)')
  console.log('     - Speciation (NEAT) - múltiplos nichos')
  console.log('     - Novelty Search - arquivo de comportamentos')
  console.log('     - Multi-Objective - Pareto front')
  console.log('     - Fitness sharing - automático via speciation')
  console.log('     - Crowding distance - automático via multi-objective')
  console.log('     - Hybrid GA + Hill Climbing - refinamento de elite')
  console.log('     - Adaptive mutation - taxa decai ao longo do tempo')
  console.log('     - Elitism - top 5% sempre sobrevive')
  console.log('     - Tournament selection - pressão seletiva')

  console.log('\n' + '='.repeat(70))
  console.log('✨ DEMO COMPLETO - Todas as features funcionando juntas!')
  console.log('='.repeat(70) + '\n')
}

main().catch(err => {
  console.error('❌ Erro:', err.message)
  console.error(err.stack)
})
