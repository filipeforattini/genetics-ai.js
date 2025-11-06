/**
 * DEVX Demo - Demonstração das ferramentas de desenvolvimento do genetics-ai.js v3
 *
 * Este exemplo mostra como usar:
 * - PerformanceProfiler: Medir performance do seu brain
 * - BrainVisualizer: Visualizar estrutura da rede neural
 *
 * Rode com: node examples/devx-demo.js
 */

import { Genome, Brain, PerformanceProfiler, BrainVisualizer } from '../src/index.js'

console.log('╔═══════════════════════════════════════════╗')
console.log('║   🎨 DEVX Demo - genetics-ai.js v3       ║')
console.log('╚═══════════════════════════════════════════╝')
console.log('')

// Criar um genoma simples para demonstração
// Este genoma terá alguns sensores, neurônios e ações
const genomeString = [
  // Connections: sensor -> neuron
  'A0001', 'B0002', 'C0003',
  // Connections: neuron -> action
  'D0101', 'E0102', 'F0103',
  // Biases para neurônios
  'G01', 'H02', 'I03'
].join('')

console.log('📝 Criando genoma de exemplo...')
const genome = Genome.from(genomeString)
const genomeDNA = genome.toString()
console.log(`   Genoma: ${genomeDNA} (${genomeDNA.length} caracteres)`)
console.log('')

// Definir sensores e ações (Brain espera arrays!)
const sensors = [
  { id: 0, tick: () => Math.random() },      // Sensor aleatório
  { id: 1, tick: () => Math.sin(Date.now() / 1000) },  // Sensor senoidal
  { id: 2, tick: () => 0.5 }                 // Sensor constante
]

const actions = [
  { id: 0, tick: (value) => ({ move: value }) },
  { id: 1, tick: (value) => ({ turn: value }) },
  { id: 2, tick: (value) => ({ jump: value }) }
]

// Criar o brain
console.log('🧠 Criando brain...')
const brain = new Brain({ genome, sensors, actions })
console.log(`   Brain criado com sucesso!`)
console.log(`   Otimização: ${brain.useJIT ? 'JIT (ultra-rápido!)' : brain.useLayeredProcessing ? 'Layered' : 'Direct'}`)
console.log('')

// ===========================================
// 1. BRAIN VISUALIZER
// ===========================================
console.log('═══════════════════════════════════════════')
console.log('  📊 BrainVisualizer - Estrutura da Rede')
console.log('═══════════════════════════════════════════')
console.log('')

const visualizer = new BrainVisualizer(brain)

// Mostrar topologia da rede
console.log(visualizer.drawTopology())
console.log('')

// Mostrar conexões fortes
console.log(visualizer.drawConnections())
console.log('')

// Fazer alguns ticks para ter dados de ativação
console.log('⚡ Executando 5 ticks para coletar ativações...')
for (let i = 0; i < 5; i++) {
  brain.tick()
}
console.log('')

// Mostrar valores de ativação
console.log(visualizer.drawActivations())
console.log('')

// Exportar estrutura como JSON (útil para ferramentas externas)
const networkJson = visualizer.toJSON()
console.log('📦 Estrutura exportada como JSON:')
console.log(`   Nodes: ${networkJson.nodes.length}`)
console.log(`   Edges: ${networkJson.edges.length}`)
console.log(`   Stats:`, networkJson.stats)
console.log('')

// ===========================================
// 2. PERFORMANCE PROFILER
// ===========================================
console.log('═══════════════════════════════════════════')
console.log('  🔬 PerformanceProfiler - Análise de Performance')
console.log('═══════════════════════════════════════════')
console.log('')

const profiler = new PerformanceProfiler(brain)

console.log('⏱️  Iniciando profiling (10,000 ticks)...')
profiler.start()

const startTime = performance.now()
for (let i = 0; i < 10_000; i++) {
  brain.tick()
}
const endTime = performance.now()

profiler.stop()
console.log(`   ✓ Concluído em ${(endTime - startTime).toFixed(2)}ms`)
console.log('')

// Mostrar relatório completo
console.log(profiler.getReport())
console.log('')

// Mostrar estatísticas brutas
const stats = profiler.getStats()
console.log('📈 Estatísticas Detalhadas:')
console.log(`   Total de ticks:    ${stats.ticks.toLocaleString()}`)
console.log(`   Tempo total:       ${stats.totalTime}`)
console.log(`   Tempo médio:       ${stats.avgTime}`)
console.log(`   Ticks por segundo: ${stats.ticksPerSecond.toLocaleString()}`)
console.log(`   P50 (mediana):     ${stats.percentiles.p50}`)
console.log(`   P95:               ${stats.percentiles.p95}`)
console.log(`   P99:               ${stats.percentiles.p99}`)
console.log('')

// ===========================================
// 3. COMPARAÇÃO DE PERFORMANCE
// ===========================================
console.log('═══════════════════════════════════════════')
console.log('  🏆 Comparação: Diferentes Tamanhos de Rede')
console.log('═══════════════════════════════════════════')
console.log('')

// Função auxiliar para criar e testar um brain
function testBrain(connectionCount, iterations = 5000) {
  const testGenome = Genome.random({
    sensorCount: 5,
    neuronCount: Math.floor(connectionCount / 3),
    actionCount: 3
  })

  const testBrain = new Brain({
    genome: testGenome,
    sensors: [
      { id: 0, tick: () => 0.5 },
      { id: 1, tick: () => 0.5 },
      { id: 2, tick: () => 0.5 },
      { id: 3, tick: () => 0.5 },
      { id: 4, tick: () => 0.5 }
    ],
    actions: [
      { id: 0, tick: (v) => v },
      { id: 1, tick: (v) => v },
      { id: 2, tick: (v) => v }
    ]
  })

  const start = performance.now()
  for (let i = 0; i < iterations; i++) {
    testBrain.tick()
  }
  const time = performance.now() - start

  return {
    time,
    avgPerTick: time / iterations,
    mode: testBrain.useJIT ? 'JIT' : testBrain.useLayeredProcessing ? 'Layered' : 'Direct'
  }
}

// Testar diferentes tamanhos
console.log('Testando diferentes tamanhos de rede:')
console.log('')

const sizes = [10, 50, 100, 150]
for (const size of sizes) {
  const result = testBrain(size)
  console.log(`  ${size.toString().padStart(3)} conexões → ${result.avgPerTick.toFixed(4)}ms/tick [${result.mode}]`)
}

console.log('')
console.log('═══════════════════════════════════════════')
console.log('  ✨ Demo concluído!')
console.log('═══════════════════════════════════════════')
console.log('')
console.log('💡 Dicas:')
console.log('   - Use PerformanceProfiler para otimizar seu código')
console.log('   - Use BrainVisualizer para debugar problemas na rede')
console.log('   - JIT mode é ativado automaticamente para redes de 5-200 conexões')
console.log('   - Activation LUT torna sigmoid/tanh 50-100x mais rápidos!')
console.log('')
