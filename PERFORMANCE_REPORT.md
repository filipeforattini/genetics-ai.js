# 🚀 Performance Comparison Report

**Data:** 16/11/2025, 13:29:57
**Node.js:** v23.8.0
**Platform:** linux (x64)

---

## 📊 Resultados Detalhados

### 🚀 ActivationLUT.sigmoid

| Métrica | Original | Otimizado | Melhoria |
|---------|----------|-----------|----------|
| Tempo médio | 0.030368μs | **0.023167μs** | **23.71%** ⬇️ |
| Ops/segundo | 32928886 | **43165569** | **1.31x** ⬆️ |
| Iterações | 1,000,000 | 1,000,000 | - |

### 🚀 ActivationLUT.tanh

| Métrica | Original | Otimizado | Melhoria |
|---------|----------|-----------|----------|
| Tempo médio | 0.033977μs | **0.029778μs** | **12.36%** ⬇️ |
| Ops/segundo | 29431262 | **33581581** | **1.14x** ⬆️ |
| Iterações | 1,000,000 | 1,000,000 | - |

### 🚀 Vertex.calculateInput (10 inputs)

| Métrica | Original | Otimizado | Melhoria |
|---------|----------|-----------|----------|
| Tempo médio | 0.093644μs | **0.055777μs** | **40.44%** ⬇️ |
| Ops/segundo | 10678710 | **17928487** | **1.68x** ⬆️ |
| Iterações | 500,000 | 500,000 | - |

### 🚀 Brain.tick (realistic network)

| Métrica | Original | Otimizado | Melhoria |
|---------|----------|-----------|----------|
| Tempo médio | 0.182633μs | **0.152073μs** | **16.73%** ⬇️ |
| Ops/segundo | 5475447 | **6575768** | **1.20x** ⬆️ |
| Iterações | 10,000 | 10,000 | - |

### 🚀 Genome.mutate (200 bases, rate=0.001)

| Métrica | Original | Otimizado | Melhoria |
|---------|----------|-----------|----------|
| Tempo médio | 195.860223μs | **130.309058μs** | **33.47%** ⬇️ |
| Ops/segundo | 5106 | **7674** | **1.50x** ⬆️ |
| Iterações | 1,000 | 1,000 | - |

### 🚀 Base.fromBitBuffer (connection)

| Métrica | Original | Otimizado | Melhoria |
|---------|----------|-----------|----------|
| Tempo médio | 0.112880μs | **0.108670μs** | **3.73%** ⬇️ |
| Ops/segundo | 8858959 | **9202139** | **1.04x** ⬆️ |
| Iterações | 100,000 | 100,000 | - |

---

## 📈 Sumário Geral

### ✅ Melhorias

- **Vertex.calculateInput (10 inputs)**: 40.44% mais rápido (1.68x speedup)
- **Genome.mutate (200 bases, rate=0.001)**: 33.47% mais rápido (1.50x speedup)
- **ActivationLUT.sigmoid**: 23.71% mais rápido (1.31x speedup)
- **Brain.tick (realistic network)**: 16.73% mais rápido (1.20x speedup)
- **ActivationLUT.tanh**: 12.36% mais rápido (1.14x speedup)
- **Base.fromBitBuffer (connection)**: 3.73% mais rápido (1.04x speedup)


---

## 🎯 Impacto por Hot Path

| Hot Path | Importância | Melhoria | Impacto Real |
|----------|-------------|----------|--------------|
| ActivationLUT.sigmoid | 🔥🔥🔥 Muito Alto | 23.71% | Crítico |
| ActivationLUT.tanh | 🔥🔥🔥 Muito Alto | 12.36% | Crítico |
| Vertex.calculateInput (10 inputs) | 🔥🔥🔥 Muito Alto | 40.44% | Crítico |
| Brain.tick (realistic network) | 🔥🔥 Alto | 16.73% | Alto |
| Genome.mutate (200 bases, rate=0.001) | 🔥 Médio | 33.47% | Médio |
| Base.fromBitBuffer (connection) | 🔥 Médio | 3.73% | Médio |


---

## 🏆 Conclusão

**Melhoria média: 21.74%** 🎉

As otimizações implementadas tiveram um impacto **SIGNIFICATIVO** na performance geral do sistema.

### Destaques:

- ✨ **Vertex.calculateInput (10 inputs)**: 1.68x mais rápido!
- ✨ **Genome.mutate (200 bases, rate=0.001)**: 1.50x mais rápido!
- ✨ **ActivationLUT.sigmoid**: 1.31x mais rápido!


---

## 📝 Detalhes Técnicos

### Otimizações Implementadas:

1. **ActivationLUT**: Fast inverse (divisão → multiplicação) + bitwise floor/ceil
2. **Vertex.calculateInput**: Loop unrolling 4x (SIMD manual)
3. **Brain.tick**: Branchless max finding com loop unrolling
4. **Genome.mutate**: Batch RNG generation (TypedArray)

### Metodologia:

- **Warmup**: 1000 iterações para estabilizar JIT
- **Garbage Collection**: Forçada entre benchmarks
- **Ambiente**: Node.js v23.8.0 em linux

---

**Relatório gerado automaticamente por `benchmark/generate-report.js`**
