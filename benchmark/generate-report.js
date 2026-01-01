#!/usr/bin/env node

/**
 * Gerador de Relatório de Performance
 * Compara resultados otimizados vs originais
 */

import { readFileSync, writeFileSync } from 'fs'

// Carregar resultados
const optimized = JSON.parse(readFileSync('benchmark/results/optimized.json', 'utf8'))
const original = JSON.parse(readFileSync('benchmark/results/original.json', 'utf8'))

// Calcular diferenças
function calculateImprovement(optValue, origValue) {
  const improvement = ((origValue - optValue) / origValue) * 100
  return {
    improvement: improvement.toFixed(2),
    speedup: (origValue / optValue).toFixed(2),
    isImprovement: improvement > 0
  }
}

// Construir relatório
let report = `# 🚀 Performance Comparison Report

**Data:** ${new Date().toLocaleString('pt-BR')}
**Node.js:** ${optimized.node_version}
**Platform:** ${optimized.platform} (${optimized.arch})

---

## 📊 Resultados Detalhados

`

// Processar cada benchmark
const benchmarks = Object.keys(optimized.results)

benchmarks.forEach(key => {
  const opt = optimized.results[key]
  const orig = original.results[key]

  const avgTimeOpt = parseFloat(opt.avgTime)
  const avgTimeOrig = parseFloat(orig.avgTime)
  const stats = calculateImprovement(avgTimeOpt, avgTimeOrig)

  const opsOpt = parseFloat(opt.opsPerSec)
  const opsOrig = parseFloat(orig.opsPerSec)
  const opsStats = calculateImprovement(1/opsOpt, 1/opsOrig)

  const emoji = stats.isImprovement ? '🚀' : '⚠️'
  const color = stats.isImprovement ? '**' : ''

  report += `### ${emoji} ${opt.name}

| Métrica | Original | Otimizado | Melhoria |
|---------|----------|-----------|----------|
| Tempo médio | ${orig.avgTime}μs | ${color}${opt.avgTime}μs${color} | ${color}${stats.improvement}%${color} ${stats.isImprovement ? '⬇️' : '⬆️'} |
| Ops/segundo | ${orig.opsPerSec.toLocaleString()} | ${color}${opt.opsPerSec.toLocaleString()}${color} | ${color}${stats.speedup}x${color} ${stats.isImprovement ? '⬆️' : '⬇️'} |
| Iterações | ${opt.iterations.toLocaleString()} | ${opt.iterations.toLocaleString()} | - |

`
})

// Sumário geral
report += `---

## 📈 Sumário Geral

`

let totalImprovement = 0
let improvementCount = 0
let worsened = []
let improved = []

benchmarks.forEach(key => {
  const opt = optimized.results[key]
  const orig = original.results[key]

  const avgTimeOpt = parseFloat(opt.avgTime)
  const avgTimeOrig = parseFloat(orig.avgTime)
  const stats = calculateImprovement(avgTimeOpt, avgTimeOrig)

  const improvement = parseFloat(stats.improvement)

  if (stats.isImprovement) {
    totalImprovement += improvement
    improvementCount++
    improved.push({ name: opt.name, improvement, speedup: stats.speedup })
  } else {
    worsened.push({ name: opt.name, regression: Math.abs(improvement) })
  }
})

const avgImprovement = improvementCount > 0 ? (totalImprovement / improvementCount).toFixed(2) : 0

report += `### ✅ Melhorias

`

improved.sort((a, b) => b.improvement - a.improvement)
improved.forEach(item => {
  report += `- **${item.name}**: ${item.improvement}% mais rápido (${item.speedup}x speedup)\n`
})

if (worsened.length > 0) {
  report += `

### ⚠️ Regressões

`
  worsened.forEach(item => {
    report += `- **${item.name}**: ${item.regression}% mais lento\n`
  })
}

report += `

---

## 🎯 Impacto por Hot Path

| Hot Path | Importância | Melhoria | Impacto Real |
|----------|-------------|----------|--------------|
`

// Mapear importância dos hot paths
const importance = {
  'activationLUT_sigmoid': { level: '🔥🔥🔥', freq: 'Muito Alto', impact: 'Crítico' },
  'activationLUT_tanh': { level: '🔥🔥🔥', freq: 'Muito Alto', impact: 'Crítico' },
  'vertex_calculateInput': { level: '🔥🔥🔥', freq: 'Muito Alto', impact: 'Crítico' },
  'brain_tick': { level: '🔥🔥', freq: 'Alto', impact: 'Alto' },
  'genome_mutate': { level: '🔥', freq: 'Médio', impact: 'Médio' },
  'base_parsing': { level: '🔥', freq: 'Médio', impact: 'Médio' }
}

benchmarks.forEach(key => {
  const opt = optimized.results[key]
  const orig = original.results[key]

  const avgTimeOpt = parseFloat(opt.avgTime)
  const avgTimeOrig = parseFloat(orig.avgTime)
  const stats = calculateImprovement(avgTimeOpt, avgTimeOrig)

  const info = importance[key] || { level: '❓', freq: 'Desconhecido', impact: 'Desconhecido' }

  report += `| ${opt.name} | ${info.level} ${info.freq} | ${stats.improvement}% | ${info.impact} |\n`
})

report += `

---

## 🏆 Conclusão

`

if (avgImprovement > 0) {
  report += `**Melhoria média: ${avgImprovement}%** 🎉

As otimizações implementadas tiveram um impacto **${avgImprovement > 30 ? 'MASSIVO' : avgImprovement > 15 ? 'SIGNIFICATIVO' : 'POSITIVO'}** na performance geral do sistema.

### Destaques:

`

  improved.slice(0, 3).forEach(item => {
    report += `- ✨ **${item.name}**: ${item.speedup}x mais rápido!\n`
  })
} else {
  report += `As otimizações não mostraram melhoria significativa. Considere revisar as mudanças.
`
}

report += `

---

## 📝 Detalhes Técnicos

### Otimizações Implementadas:

1. **ActivationLUT**: Fast inverse (divisão → multiplicação) + bitwise floor/ceil
2. **Vertex.calculateInput**: Loop unrolling 4x (SIMD manual)
3. **Brain.tick**: Branchless max finding com loop unrolling
4. **Genome.mutate**: Batch RNG generation (TypedArray)

### Metodologia:

- **Warmup**: ${1000} iterações para estabilizar JIT
- **Garbage Collection**: Forçada entre benchmarks
- **Ambiente**: Node.js ${optimized.node_version} em ${optimized.platform}

---

**Relatório gerado automaticamente por \`benchmark/generate-report.js\`**
`

// Salvar relatório
writeFileSync('PERFORMANCE_REPORT.md', report)

console.log('✅ Relatório gerado: PERFORMANCE_REPORT.md')
console.log('')

// Mostrar sumário no console
console.log('📊 SUMÁRIO RÁPIDO:')
console.log('═'.repeat(60))
console.log(`Melhoria média: ${avgImprovement}%`)
console.log(`Melhorias: ${improved.length}`)
console.log(`Regressões: ${worsened.length}`)
console.log('')

if (improved.length > 0) {
  console.log('🏆 Top 3 Melhorias:')
  improved.slice(0, 3).forEach((item, i) => {
    console.log(`  ${i+1}. ${item.name}: ${item.improvement}% (${item.speedup}x)`)
  })
}

console.log('')
