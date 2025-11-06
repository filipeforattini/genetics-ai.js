# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Build and Development Commands

```bash
# Build the library (generates dist/ files in multiple formats)
pnpm build

# Run tests with coverage
pnpm test

# Run a single test file
node --experimental-vm-modules --no-warnings ./node_modules/jest/bin/jest.js ./test/[filename].test.js --coverage
```

## Architecture Overview

This is a genetic algorithm library for JavaScript that simulates neural networks through genomes. The core architecture consists of:

### Genome Encoding System
- **Genomes** are encoded as base-32 strings where each character represents 5 bits of information
- **Bases** come in two types:
  - **Connection bases** (5 characters): Link sensors→neurons or neurons→actions with weights [0-15]
  - **Bias bases** (3 characters): Set biases [-7, 7] for sensors, neurons, or actions
- The encoding supports up to 512 sensors, 512 neurons, and 512 actions

### Class Hierarchy
- **Individual**: Base class that users extend, must implement `fitness()` method. Contains a brain and genome, handles reproduction (asexual mutation, sexual crossover)
- **Generation**: Manages populations of individuals, handles evolution cycles with selection, reproduction, and fitness evaluation
- **Brain**: Neural network implementation that processes sensor inputs through neurons to produce actions based on genome connections
- **Genome**: Handles encoding/decoding of genetic information from/to base-32 strings
- **Base**: Low-level class for parsing individual genome bases (connections and biases)
- **Reproduction**: Static methods for genetic operations (mutation, crossover)
- **Vertex**: Graph node representing sensors, neurons, or actions in the neural network

### Data Flow
1. Individuals receive sensor inputs from their environment
2. Brain processes inputs through neural network defined by genome
3. Actions are triggered based on neural network outputs
4. Fitness is evaluated to guide evolution
5. Generation manages reproduction to create new individuals

## Key Implementation Details

- Uses ES6 modules (`type: "module"` in package.json)
- Dependencies: lodash-es for utilities
- Testing: Jest with experimental VM modules flag
- Build: Rollup with Babel for multiple output formats (CJS, UMD, ESM)
- Main entry: `src/index.js` exports all classes

## Detailed Technical Analysis

### Genome Encoding (Base-32 System)
- **Character Encoding**: Each character represents 5 bits (0-31 in decimal)
- **Base Types**:
  - **Connection Base** (5 chars total):
    - Char 1: 4 bits weight + 1 bit type flag (0)
    - Chars 2-3: 9 bits source ID + 1 bit source type
    - Chars 4-5: 9 bits target ID + 1 bit target type
  - **Bias Base** (3 chars total):
    - Char 1: 3 bits absolute value + 1 bit sign + 1 bit type flag (1)
    - Chars 2-3: 8 bits target ID + 2 bits target type

### Neural Network Architecture
- **Vertex System**: Cada sensor/neurônio/ação é um vértice no grafo neural
- **Activation Functions**: 
  - ReLU (padrão): `Math.max(0, x)`
  - Sigmoid: `1 / (1 + Math.exp(x * -1))`
- **Tick Order**: Calculado através de análise de profundidade do grafo, executado em ordem reversa de profundidade
- **Action Selection**: Apenas a ação com maior input é executada por tick

### Reproduction System
- **Mutation**: 
  - Taxa padrão: 1/1000 por caractere
  - Pode mudar caracteres, adicionar ou remover bases
- **Crossover**: 
  - Divide genomas em 2 partes
  - Cruza partes opostas de dois pais
  - Aplica mutação nos filhos resultantes
- **Fusion**: Concatena bases de dois genomas

### Generation Management
- **Population Dynamics**:
  - Sobreviventes: Indivíduos com `dead = false`
  - Taxa de sobrevivência calculada por geração
  - Preenchimento com indivíduos aleatórios quando necessário
- **Hooks System**: 
  - Individual: `beforeTick`, `afterTick`
  - Generation: `beforeTick`, `afterTick`, `beforeNext`, `afterNext`

### Important Observations
1. **MD5 Utility**: Usado para gerar cores baseadas no genoma (4 valores RGB)
2. **Vertex Metadata**: Armazena bias, lastTick, tipo e ID
3. **Weight Accumulation**: Conexões duplicadas somam seus pesos
4. **Tick Result**: Retorna hash com todos os valores calculados no tick
5. **Environment Binding**: Funções de sensor/ação são bindadas ao contexto do indivíduo

### Example Usage Patterns
- **David Randall Miller Example**: Simula criaturas em mundo 2D com sensores de posição, bloqueio e idade
- **Tic-Tac-Toe Example**: Demonstra uso para jogos com sensores de estado do tabuleiro

### Performance Considerations
- Genomas são parseados sob demanda (lazy evaluation)
- Ordem de tick é pré-calculada para eficiência
- Usa mapas para acesso rápido a vértices por nome

### Testing Strategy
- Testa codificação/decodificação de bases
- Valida limites de valores (biases, IDs)
- Verifica reprodução e mutação
- Testa construção de redes neurais

### Future Enhancement Opportunities
- Implementar mais funções de ativação
- Adicionar suporte para conexões recorrentes
- Melhorar sistema de seleção de ações
- Adicionar serialização/deserialização de gerações
- Implementar paralelização de ticks
- Adicionar métricas de diversidade genética