/**
 * 🧮 Equation Solver - Evolve neural networks to solve mathematical equations
 * 
 * This example demonstrates how genetic algorithms can evolve neural networks
 * that learn to solve various types of equations WITHOUT any training data!
 * 
 * Supported equation types:
 * 1. Linear equations: ax + b = c
 * 2. Quadratic equations: ax² + bx + c = 0
 * 3. Systems of equations
 * 4. Polynomial roots
 */

import { Individual, Generation, Genome } from '../../src/index.js'

// ============================================
// LINEAR EQUATION SOLVER: ax + b = c
// ============================================

class LinearEquationSolver extends Individual {
  constructor(options) {
    super({
      ...options,
      sensors: [
        // Coefficients a, b, c normalized
        { tick: () => this.environment.a / 10 },
        { tick: () => this.environment.b / 10 },
        { tick: () => this.environment.c / 10 },
        // Additional sensor for problem complexity
        { tick: () => Math.abs(this.environment.a) / 10 }
      ],
      actions: [
        // Output: the solution x
        { tick: (v) => { 
          this.solution = (v - 0.5) * 20 // Scale to [-10, 10]
          return this.solution 
        }}
      ]
    })
  }
  
  fitness() {
    // Test on various linear equations
    const testCases = [
      { a: 2, b: 3, c: 7 },    // 2x + 3 = 7, x = 2
      { a: 1, b: -5, c: 10 },  // x - 5 = 10, x = 15
      { a: 3, b: 0, c: 9 },    // 3x = 9, x = 3
      { a: -2, b: 8, c: 2 },   // -2x + 8 = 2, x = 3
      { a: 5, b: 10, c: 0 },   // 5x + 10 = 0, x = -2
      { a: 0.5, b: 1, c: 3 },  // 0.5x + 1 = 3, x = 4
    ]
    
    let totalError = 0
    let correctCount = 0
    
    for (const test of testCases) {
      this.environment.a = test.a
      this.environment.b = test.b
      this.environment.c = test.c
      
      // Calculate expected solution
      const expected = test.a !== 0 ? (test.c - test.b) / test.a : 0
      
      // Get neural network's solution
      this.tick()
      
      const error = Math.abs(this.solution - expected)
      totalError += error
      
      // Count as correct if error < 0.1
      if (error < 0.1) correctCount++
    }
    
    // Fitness combines accuracy and precision
    const accuracy = correctCount / testCases.length
    const precision = 1 / (1 + totalError)
    
    return accuracy * 500 + precision * 500
  }
}

// ============================================
// QUADRATIC EQUATION SOLVER: ax² + bx + c = 0
// ============================================

class QuadraticSolver extends Individual {
  constructor(options) {
    super({
      ...options,
      sensors: [
        // Coefficients
        { tick: () => this.environment.a / 10 },
        { tick: () => this.environment.b / 10 },
        { tick: () => this.environment.c / 10 },
        // Discriminant indicator (helps network understand solvability)
        { tick: () => {
          const disc = this.environment.b ** 2 - 4 * this.environment.a * this.environment.c
          return Math.tanh(disc / 100) // Normalized discriminant
        }}
      ],
      actions: [
        // Two outputs for two roots
        { tick: (v) => { this.root1 = (v - 0.5) * 20; return v }},
        { tick: (v) => { this.root2 = (v - 0.5) * 20; return v }}
      ]
    })
  }
  
  fitness() {
    const testCases = [
      { a: 1, b: -5, c: 6 },    // x² - 5x + 6 = 0, roots: 2, 3
      { a: 1, b: 0, c: -9 },    // x² - 9 = 0, roots: ±3
      { a: 1, b: -4, c: 4 },    // x² - 4x + 4 = 0, root: 2 (double)
      { a: 2, b: 7, c: 3 },     // 2x² + 7x + 3 = 0
      { a: 1, b: 2, c: 1 },     // x² + 2x + 1 = 0, root: -1 (double)
    ]
    
    let totalError = 0
    
    for (const test of testCases) {
      this.environment.a = test.a
      this.environment.b = test.b
      this.environment.c = test.c
      
      // Calculate real roots using quadratic formula
      const disc = test.b ** 2 - 4 * test.a * test.c
      
      if (disc >= 0) {
        const root1 = (-test.b + Math.sqrt(disc)) / (2 * test.a)
        const root2 = (-test.b - Math.sqrt(disc)) / (2 * test.a)
        
        // Get network's predictions
        this.tick()
        
        // Find best matching (roots might be in different order)
        const error1 = Math.min(
          Math.abs(this.root1 - root1) + Math.abs(this.root2 - root2),
          Math.abs(this.root1 - root2) + Math.abs(this.root2 - root1)
        )
        
        totalError += error1
      }
    }
    
    return 1000 / (1 + totalError)
  }
}

// ============================================
// SYSTEM OF EQUATIONS SOLVER
// ============================================

class SystemSolver extends Individual {
  constructor(options) {
    super({
      ...options,
      sensors: [
        // 2x2 system: a1*x + b1*y = c1, a2*x + b2*y = c2
        { tick: () => this.environment.a1 / 10 },
        { tick: () => this.environment.b1 / 10 },
        { tick: () => this.environment.c1 / 10 },
        { tick: () => this.environment.a2 / 10 },
        { tick: () => this.environment.b2 / 10 },
        { tick: () => this.environment.c2 / 10 },
      ],
      actions: [
        // Solutions for x and y
        { tick: (v) => { this.x = (v - 0.5) * 20; return v }},
        { tick: (v) => { this.y = (v - 0.5) * 20; return v }}
      ]
    })
  }
  
  fitness() {
    const testCases = [
      // 2x + y = 5, x - y = 1 => x = 2, y = 1
      { a1: 2, b1: 1, c1: 5, a2: 1, b2: -1, c2: 1 },
      // 3x + 2y = 12, x + y = 5 => x = 2, y = 3
      { a1: 3, b1: 2, c1: 12, a2: 1, b2: 1, c2: 5 },
      // x + 2y = 7, 2x - y = 4 => x = 3, y = 2
      { a1: 1, b1: 2, c1: 7, a2: 2, b2: -1, c2: 4 },
    ]
    
    let totalError = 0
    
    for (const test of testCases) {
      Object.assign(this.environment, test)
      
      // Solve using Cramer's rule
      const det = test.a1 * test.b2 - test.a2 * test.b1
      if (Math.abs(det) > 0.001) {
        const x = (test.c1 * test.b2 - test.c2 * test.b1) / det
        const y = (test.a1 * test.c2 - test.a2 * test.c1) / det
        
        this.tick()
        
        totalError += Math.abs(this.x - x) + Math.abs(this.y - y)
      }
    }
    
    return 1000 / (1 + totalError)
  }
}

// ============================================
// POLYNOMIAL ROOT FINDER
// ============================================

class PolynomialRootFinder extends Individual {
  constructor(options) {
    super({
      ...options,
      sensors: [
        // Cubic: ax³ + bx² + cx + d = 0
        { tick: () => this.environment.a / 10 },
        { tick: () => this.environment.b / 10 },
        { tick: () => this.environment.c / 10 },
        { tick: () => this.environment.d / 10 },
        // Helper sensors for pattern recognition
        { tick: () => Math.sign(this.environment.a * this.environment.d) },
        { tick: () => Math.sign(this.environment.b * this.environment.c) }
      ],
      actions: [
        // Output one real root
        { tick: (v) => { 
          this.root = (v - 0.5) * 10
          return this.root 
        }}
      ]
    })
  }
  
  fitness() {
    // Test finding at least one root
    const testCases = [
      { a: 1, b: -6, c: 11, d: -6 },  // (x-1)(x-2)(x-3) = 0
      { a: 1, b: 0, c: -1, d: 0 },    // x³ - x = 0, roots: 0, ±1
      { a: 1, b: -3, c: 3, d: -1 },   // (x-1)³ = 0
      { a: 2, b: -8, c: 8, d: 0 },    // 2x(x-2)² = 0
    ]
    
    let totalError = 0
    
    for (const test of testCases) {
      Object.assign(this.environment, test)
      this.tick()
      
      // Check if the found value is actually a root
      const value = test.a * this.root**3 + test.b * this.root**2 + 
                    test.c * this.root + test.d
      
      totalError += Math.abs(value)
    }
    
    return 1000 / (1 + totalError)
  }
}

// ============================================
// RUNNING THE EVOLUTION
// ============================================

async function runEquationSolver() {
  console.log('🧮 Starting Equation Solver Evolution...\n')
  
  // Linear Equation Solver
  console.log('📐 Evolving Linear Equation Solver...')
  const linearGen = new Generation({
    size: 100,
    individualClass: LinearEquationSolver,
    individualGenomeSize: 50,
    individualNeurons: 10
  })
  
  linearGen.fillRandom()
  
  for (let gen = 0; gen < 100; gen++) {
    linearGen.population.forEach(ind => {
      for (let i = 0; i < 10; i++) ind.tick()
      ind.fitnessScore = ind.fitness()
    })
    
    linearGen.population.sort((a, b) => b.fitnessScore - a.fitnessScore)
    
    if (gen % 20 === 0) {
      const best = linearGen.population[0]
      console.log(`Gen ${gen}: Best fitness = ${best.fitnessScore.toFixed(2)}`)
      
      // Test the best on a new equation
      best.environment.a = 4
      best.environment.b = 5
      best.environment.c = 13
      best.tick()
      const expected = (13 - 5) / 4 // x = 2
      console.log(`  Test: 4x + 5 = 13, Expected: ${expected}, Got: ${best.solution.toFixed(2)}`)
    }
    
    // Evolution
    linearGen.population.slice(50).forEach(ind => ind.dead = true)
    linearGen.next()
  }
  
  // Quadratic Solver
  console.log('\n📈 Evolving Quadratic Equation Solver...')
  const quadGen = new Generation({
    size: 100,
    individualClass: QuadraticSolver,
    individualGenomeSize: 80,
    individualNeurons: 15
  })
  
  quadGen.fillRandom()
  
  for (let gen = 0; gen < 150; gen++) {
    quadGen.population.forEach(ind => {
      for (let i = 0; i < 10; i++) ind.tick()
      ind.fitnessScore = ind.fitness()
    })
    
    quadGen.population.sort((a, b) => b.fitnessScore - a.fitnessScore)
    
    if (gen % 30 === 0) {
      const best = quadGen.population[0]
      console.log(`Gen ${gen}: Best fitness = ${best.fitnessScore.toFixed(2)}`)
      
      // Test on x² - 7x + 12 = 0 (roots: 3, 4)
      best.environment.a = 1
      best.environment.b = -7
      best.environment.c = 12
      best.tick()
      console.log(`  Test: x² - 7x + 12 = 0, Expected roots: 3, 4`)
      console.log(`  Got: ${best.root1.toFixed(2)}, ${best.root2.toFixed(2)}`)
    }
    
    quadGen.population.slice(50).forEach(ind => ind.dead = true)
    quadGen.next()
  }
  
  console.log('\n✅ Evolution complete!')
}

// Export for use
export {
  LinearEquationSolver,
  QuadraticSolver,
  SystemSolver,
  PolynomialRootFinder,
  runEquationSolver
}

// Run if called directly
if (import.meta.url === `file://${process.argv[1]}`) {
  runEquationSolver()
}