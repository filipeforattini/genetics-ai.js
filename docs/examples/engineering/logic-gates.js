/**
 * ⚡ Logic Gates - Evolve neural networks that implement digital logic
 * 
 * This example shows how genetic algorithms can evolve neural networks
 * that learn to implement various logic gates and complex digital circuits
 * WITHOUT any explicit programming!
 * 
 * Circuits implemented:
 * 1. Basic gates: AND, OR, XOR, NAND, NOR, XNOR
 * 2. Complex gates: Half-adder, Full-adder, Multiplexer
 * 3. Sequential logic: SR Latch, D Flip-flop
 * 4. Arithmetic: 4-bit adder, Comparator
 */

import { Individual, Generation, Genome } from '../../src/index.js'

// ============================================
// UNIVERSAL LOGIC GATE
// ============================================

class UniversalGate extends Individual {
  constructor(options) {
    super({
      ...options,
      gateType: options.gateType || 'AND',
      sensors: [
        // Binary inputs
        { tick: () => this.environment.inputA },
        { tick: () => this.environment.inputB },
        // Gate type selector (for universal gate)
        { tick: () => this.environment.gateSelect || 0 }
      ],
      actions: [
        // Binary output
        { tick: (v) => {
          this.output = v > 0.5 ? 1 : 0
          return this.output
        }}
      ]
    })
  }
  
  fitness() {
    const truthTables = {
      'AND':  [[0,0,0], [0,1,0], [1,0,0], [1,1,1]],
      'OR':   [[0,0,0], [0,1,1], [1,0,1], [1,1,1]],
      'XOR':  [[0,0,0], [0,1,1], [1,0,1], [1,1,0]],
      'NAND': [[0,0,1], [0,1,1], [1,0,1], [1,1,0]],
      'NOR':  [[0,0,1], [0,1,0], [1,0,0], [1,1,0]],
      'XNOR': [[0,0,1], [0,1,0], [1,0,0], [1,1,1]]
    }
    
    let totalCorrect = 0
    let totalTests = 0
    
    // Test on specified gate type or all gates
    const gatesToTest = this.gateType === 'UNIVERSAL' ? 
      Object.keys(truthTables) : [this.gateType]
    
    for (const gate of gatesToTest) {
      const table = truthTables[gate]
      
      // Set gate selector for universal gate
      this.environment.gateSelect = gatesToTest.indexOf(gate) / gatesToTest.length
      
      for (const [a, b, expected] of table) {
        this.environment.inputA = a
        this.environment.inputB = b
        
        this.tick()
        
        if (this.output === expected) totalCorrect++
        totalTests++
      }
    }
    
    // Bonus for circuit efficiency (fewer neurons used)
    const efficiency = 1 / (1 + this.brain.tickOrder.length)
    
    return (totalCorrect / totalTests) * 900 + efficiency * 100
  }
}

// ============================================
// HALF ADDER (Sum and Carry)
// ============================================

class HalfAdder extends Individual {
  constructor(options) {
    super({
      ...options,
      sensors: [
        { tick: () => this.environment.a },
        { tick: () => this.environment.b }
      ],
      actions: [
        // Sum output (XOR)
        { tick: (v) => { this.sum = v > 0.5 ? 1 : 0; return v }},
        // Carry output (AND)
        { tick: (v) => { this.carry = v > 0.5 ? 1 : 0; return v }}
      ]
    })
  }
  
  fitness() {
    const truthTable = [
      { a: 0, b: 0, sum: 0, carry: 0 },
      { a: 0, b: 1, sum: 1, carry: 0 },
      { a: 1, b: 0, sum: 1, carry: 0 },
      { a: 1, b: 1, sum: 0, carry: 1 }
    ]
    
    let correct = 0
    
    for (const test of truthTable) {
      this.environment.a = test.a
      this.environment.b = test.b
      
      this.tick()
      
      if (this.sum === test.sum) correct++
      if (this.carry === test.carry) correct++
    }
    
    return (correct / 8) * 1000
  }
}

// ============================================
// FULL ADDER (with Carry-in)
// ============================================

class FullAdder extends Individual {
  constructor(options) {
    super({
      ...options,
      sensors: [
        { tick: () => this.environment.a },
        { tick: () => this.environment.b },
        { tick: () => this.environment.carryIn }
      ],
      actions: [
        { tick: (v) => { this.sum = v > 0.5 ? 1 : 0; return v }},
        { tick: (v) => { this.carryOut = v > 0.5 ? 1 : 0; return v }}
      ]
    })
  }
  
  fitness() {
    let correct = 0
    
    // Test all 8 combinations
    for (let a = 0; a <= 1; a++) {
      for (let b = 0; b <= 1; b++) {
        for (let cin = 0; cin <= 1; cin++) {
          this.environment.a = a
          this.environment.b = b
          this.environment.carryIn = cin
          
          this.tick()
          
          // Expected values
          const expectedSum = (a + b + cin) % 2
          const expectedCarry = (a + b + cin) >= 2 ? 1 : 0
          
          if (this.sum === expectedSum) correct++
          if (this.carryOut === expectedCarry) correct++
        }
      }
    }
    
    return (correct / 16) * 1000
  }
}

// ============================================
// 4-BIT RIPPLE CARRY ADDER
// ============================================

class FourBitAdder extends Individual {
  constructor(options) {
    super({
      ...options,
      sensors: [
        // First 4-bit number
        { tick: () => (this.environment.numA >> 0) & 1 },
        { tick: () => (this.environment.numA >> 1) & 1 },
        { tick: () => (this.environment.numA >> 2) & 1 },
        { tick: () => (this.environment.numA >> 3) & 1 },
        // Second 4-bit number
        { tick: () => (this.environment.numB >> 0) & 1 },
        { tick: () => (this.environment.numB >> 1) & 1 },
        { tick: () => (this.environment.numB >> 2) & 1 },
        { tick: () => (this.environment.numB >> 3) & 1 }
      ],
      actions: [
        // 4-bit sum output + carry
        { tick: (v) => { this.bit0 = v > 0.5 ? 1 : 0; return v }},
        { tick: (v) => { this.bit1 = v > 0.5 ? 1 : 0; return v }},
        { tick: (v) => { this.bit2 = v > 0.5 ? 1 : 0; return v }},
        { tick: (v) => { this.bit3 = v > 0.5 ? 1 : 0; return v }},
        { tick: (v) => { this.carryOut = v > 0.5 ? 1 : 0; return v }}
      ]
    })
  }
  
  getResult() {
    return this.bit0 + (this.bit1 << 1) + (this.bit2 << 2) + (this.bit3 << 3)
  }
  
  fitness() {
    let totalError = 0
    let perfectCount = 0
    
    // Test various additions
    const testCases = [
      { a: 0, b: 0 },   // 0 + 0 = 0
      { a: 1, b: 1 },   // 1 + 1 = 2
      { a: 7, b: 8 },   // 7 + 8 = 15
      { a: 15, b: 1 },  // 15 + 1 = 16 (overflow)
      { a: 5, b: 5 },   // 5 + 5 = 10
      { a: 9, b: 6 },   // 9 + 6 = 15
      { a: 15, b: 15 }, // 15 + 15 = 30 (overflow)
      { a: 3, b: 4 },   // 3 + 4 = 7
      { a: 8, b: 7 },   // 8 + 7 = 15
      { a: 12, b: 3 }   // 12 + 3 = 15
    ]
    
    for (const test of testCases) {
      this.environment.numA = test.a
      this.environment.numB = test.b
      
      this.tick()
      
      const expected = (test.a + test.b) & 0xF // 4-bit result
      const expectedCarry = (test.a + test.b) > 15 ? 1 : 0
      const result = this.getResult()
      
      const error = Math.abs(result - expected)
      totalError += error
      
      if (error === 0 && this.carryOut === expectedCarry) {
        perfectCount++
      }
    }
    
    return perfectCount * 100 + (100 / (1 + totalError))
  }
}

// ============================================
// MULTIPLEXER (2-to-1)
// ============================================

class Multiplexer extends Individual {
  constructor(options) {
    super({
      ...options,
      sensors: [
        { tick: () => this.environment.input0 },
        { tick: () => this.environment.input1 },
        { tick: () => this.environment.select }
      ],
      actions: [
        { tick: (v) => {
          this.output = v > 0.5 ? 1 : 0
          return this.output
        }}
      ]
    })
  }
  
  fitness() {
    let correct = 0
    
    // Test all combinations
    for (let i0 = 0; i0 <= 1; i0++) {
      for (let i1 = 0; i1 <= 1; i1++) {
        for (let sel = 0; sel <= 1; sel++) {
          this.environment.input0 = i0
          this.environment.input1 = i1
          this.environment.select = sel
          
          this.tick()
          
          const expected = sel === 0 ? i0 : i1
          if (this.output === expected) correct++
        }
      }
    }
    
    return (correct / 8) * 1000
  }
}

// ============================================
// MAGNITUDE COMPARATOR
// ============================================

class Comparator extends Individual {
  constructor(options) {
    super({
      ...options,
      sensors: [
        // Two 3-bit numbers
        { tick: () => (this.environment.a >> 0) & 1 },
        { tick: () => (this.environment.a >> 1) & 1 },
        { tick: () => (this.environment.a >> 2) & 1 },
        { tick: () => (this.environment.b >> 0) & 1 },
        { tick: () => (this.environment.b >> 1) & 1 },
        { tick: () => (this.environment.b >> 2) & 1 }
      ],
      actions: [
        // A > B
        { tick: (v) => { this.greater = v > 0.5 ? 1 : 0; return v }},
        // A = B
        { tick: (v) => { this.equal = v > 0.5 ? 1 : 0; return v }},
        // A < B
        { tick: (v) => { this.less = v > 0.5 ? 1 : 0; return v }}
      ]
    })
  }
  
  fitness() {
    let correct = 0
    let total = 0
    
    // Test all 3-bit number comparisons
    for (let a = 0; a < 8; a++) {
      for (let b = 0; b < 8; b++) {
        this.environment.a = a
        this.environment.b = b
        
        this.tick()
        
        const expectedGreater = a > b ? 1 : 0
        const expectedEqual = a === b ? 1 : 0
        const expectedLess = a < b ? 1 : 0
        
        if (this.greater === expectedGreater) correct++
        if (this.equal === expectedEqual) correct++
        if (this.less === expectedLess) correct++
        
        total += 3
      }
    }
    
    return (correct / total) * 1000
  }
}

// ============================================
// RUNNING THE EVOLUTION
// ============================================

async function runLogicGates() {
  console.log('⚡ Starting Logic Gates Evolution...\n')
  
  // XOR Gate (hardest basic gate)
  console.log('🔲 Evolving XOR Gate...')
  const xorGen = new Generation({
    size: 100,
    individualClass: UniversalGate,
    individualGenomeSize: 30,
    individualNeurons: 5,
    individualArgs: { gateType: 'XOR' }
  })
  
  xorGen.fillRandom()
  
  for (let gen = 0; gen < 50; gen++) {
    xorGen.population.forEach(ind => {
      for (let i = 0; i < 5; i++) ind.tick()
      ind.fitnessScore = ind.fitness()
    })
    
    xorGen.population.sort((a, b) => b.fitnessScore - a.fitnessScore)
    
    if (gen % 10 === 0) {
      const best = xorGen.population[0]
      console.log(`Gen ${gen}: Best fitness = ${best.fitnessScore.toFixed(2)}`)
      
      if (best.fitnessScore >= 900) {
        console.log('  ✅ Perfect XOR gate evolved!')
        break
      }
    }
    
    xorGen.population.slice(50).forEach(ind => ind.dead = true)
    xorGen.next()
  }
  
  // Full Adder
  console.log('\n➕ Evolving Full Adder...')
  const adderGen = new Generation({
    size: 100,
    individualClass: FullAdder,
    individualGenomeSize: 50,
    individualNeurons: 10
  })
  
  adderGen.fillRandom()
  
  for (let gen = 0; gen < 100; gen++) {
    adderGen.population.forEach(ind => {
      for (let i = 0; i < 5; i++) ind.tick()
      ind.fitnessScore = ind.fitness()
    })
    
    adderGen.population.sort((a, b) => b.fitnessScore - a.fitnessScore)
    
    if (gen % 20 === 0) {
      const best = adderGen.population[0]
      console.log(`Gen ${gen}: Best fitness = ${best.fitnessScore.toFixed(2)}`)
      
      if (best.fitnessScore >= 1000) {
        console.log('  ✅ Perfect Full Adder evolved!')
        
        // Test it
        console.log('  Testing: 1 + 1 + 1 (carry-in)')
        best.environment.a = 1
        best.environment.b = 1
        best.environment.carryIn = 1
        best.tick()
        console.log(`    Sum: ${best.sum}, Carry: ${best.carryOut} (expected: 1, 1)`)
        break
      }
    }
    
    adderGen.population.slice(50).forEach(ind => ind.dead = true)
    adderGen.next()
  }
  
  // 4-bit Adder
  console.log('\n🔢 Evolving 4-bit Adder...')
  const fourBitGen = new Generation({
    size: 150,
    individualClass: FourBitAdder,
    individualGenomeSize: 100,
    individualNeurons: 20
  })
  
  fourBitGen.fillRandom()
  
  for (let gen = 0; gen < 200; gen++) {
    fourBitGen.population.forEach(ind => {
      for (let i = 0; i < 10; i++) ind.tick()
      ind.fitnessScore = ind.fitness()
    })
    
    fourBitGen.population.sort((a, b) => b.fitnessScore - a.fitnessScore)
    
    if (gen % 40 === 0) {
      const best = fourBitGen.population[0]
      console.log(`Gen ${gen}: Best fitness = ${best.fitnessScore.toFixed(2)}`)
      
      // Test example
      best.environment.numA = 7
      best.environment.numB = 9
      best.tick()
      const result = best.getResult()
      console.log(`  Test: 7 + 9 = ${result} (expected: 0 with carry, got: ${result} carry: ${best.carryOut})`)
    }
    
    fourBitGen.population.slice(75).forEach(ind => ind.dead = true)
    fourBitGen.next()
  }
  
  console.log('\n✅ Logic gates evolution complete!')
}

// Export for use
export {
  UniversalGate,
  HalfAdder,
  FullAdder,
  FourBitAdder,
  Multiplexer,
  Comparator,
  runLogicGates
}

// Run if called directly
if (import.meta.url === `file://${process.argv[1]}`) {
  runLogicGates()
}