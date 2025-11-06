/**
 * 🔇 Adaptive Noise Reducer - Evolve neural networks for signal denoising
 * 
 * This example demonstrates how genetic algorithms can create adaptive filters
 * that learn to remove noise from signals while preserving important information.
 * 
 * Applications:
 * 1. Audio noise reduction
 * 2. Image denoising
 * 3. Sensor data cleaning
 * 4. Communication signal enhancement
 */

import { Individual, Generation, Genome } from '../../src/index.js'

// ============================================
// ADAPTIVE NOISE FILTER
// ============================================

class NoiseReducer extends Individual {
  constructor(options) {
    super({
      ...options,
      windowSize: options.windowSize || 5,
      sensors: [
        // Current noisy sample
        { tick: () => this.environment.noisySignal[this.environment.position] || 0 },
        // Previous samples (context window)
        { tick: () => this.environment.noisySignal[this.environment.position - 1] || 0 },
        { tick: () => this.environment.noisySignal[this.environment.position - 2] || 0 },
        // Next samples (look-ahead)
        { tick: () => this.environment.noisySignal[this.environment.position + 1] || 0 },
        { tick: () => this.environment.noisySignal[this.environment.position + 2] || 0 },
        // Local statistics
        { tick: () => {
          // Local variance (noise level indicator)
          const window = []
          for (let i = -2; i <= 2; i++) {
            window.push(this.environment.noisySignal[this.environment.position + i] || 0)
          }
          const mean = window.reduce((a, b) => a + b, 0) / window.length
          const variance = window.reduce((a, b) => a + (b - mean) ** 2, 0) / window.length
          return Math.tanh(variance) // Normalized variance
        }},
        // Gradient (edge detector)
        { tick: () => {
          const prev = this.environment.noisySignal[this.environment.position - 1] || 0
          const next = this.environment.noisySignal[this.environment.position + 1] || 0
          return Math.tanh(next - prev)
        }}
      ],
      actions: [
        // Filtered output
        { tick: (v) => {
          this.filteredValue = v * 2 - 1 // Scale to [-1, 1]
          return this.filteredValue
        }}
      ]
    })
    
    this.filteredSignal = []
  }
  
  processSignal(noisySignal) {
    this.filteredSignal = []
    this.environment.noisySignal = noisySignal
    
    for (let i = 0; i < noisySignal.length; i++) {
      this.environment.position = i
      this.tick()
      this.filteredSignal.push(this.filteredValue)
    }
    
    return this.filteredSignal
  }
  
  fitness() {
    let totalError = 0
    let signalPreservation = 0
    let noiseReduction = 0
    
    // Test on different signal types
    const testCases = [
      // Sine wave with gaussian noise
      {
        clean: Array(100).fill(0).map((_, i) => Math.sin(i * 0.1)),
        noisy: Array(100).fill(0).map((_, i) => 
          Math.sin(i * 0.1) + (Math.random() - 0.5) * 0.3
        )
      },
      // Square wave with impulse noise
      {
        clean: Array(100).fill(0).map((_, i) => i % 20 < 10 ? 1 : -1),
        noisy: Array(100).fill(0).map((_, i) => {
          const square = i % 20 < 10 ? 1 : -1
          const impulse = Math.random() < 0.1 ? (Math.random() - 0.5) * 2 : 0
          return square + impulse
        })
      },
      // Ramp with white noise
      {
        clean: Array(100).fill(0).map((_, i) => (i / 100) * 2 - 1),
        noisy: Array(100).fill(0).map((_, i) => 
          (i / 100) * 2 - 1 + (Math.random() - 0.5) * 0.2
        )
      }
    ]
    
    for (const test of testCases) {
      const filtered = this.processSignal(test.noisy)
      
      // Calculate metrics
      for (let i = 0; i < test.clean.length; i++) {
        // Error from clean signal
        totalError += Math.abs(filtered[i] - test.clean[i])
        
        // Signal preservation (correlation with clean)
        signalPreservation += filtered[i] * test.clean[i]
        
        // Noise reduction (variance reduction)
        const noiseOrig = test.noisy[i] - test.clean[i]
        const noiseFiltered = filtered[i] - test.clean[i]
        noiseReduction += Math.abs(noiseOrig) - Math.abs(noiseFiltered)
      }
    }
    
    // Combined fitness
    const errorScore = 1000 / (1 + totalError)
    const preservationScore = signalPreservation
    const reductionScore = noiseReduction * 10
    
    return errorScore + preservationScore + reductionScore
  }
}

// ============================================
// KALMAN-LIKE FILTER
// ============================================

class KalmanFilter extends Individual {
  constructor(options) {
    super({
      ...options,
      sensors: [
        // Current measurement
        { tick: () => this.environment.measurement },
        // Previous estimate
        { tick: () => this.estimate || 0 },
        // Measurement uncertainty indicator
        { tick: () => this.environment.measurementNoise || 0.5 },
        // Process noise indicator
        { tick: () => this.environment.processNoise || 0.1 },
        // Innovation (measurement - prediction)
        { tick: () => this.environment.measurement - (this.estimate || 0) }
      ],
      actions: [
        // Kalman gain (learning rate)
        { tick: (v) => { this.kalmanGain = v; return v }},
        // State estimate
        { tick: (v) => {
          // Update estimate using Kalman-like equation
          const innovation = this.environment.measurement - (this.estimate || 0)
          this.estimate = (this.estimate || 0) + this.kalmanGain * innovation
          return this.estimate
        }}
      ]
    })
    
    this.estimate = 0
  }
  
  fitness() {
    // Test tracking a noisy signal
    let totalError = 0
    
    // Generate test signal: sine wave with varying noise
    const trueSignal = []
    const measurements = []
    
    for (let i = 0; i < 200; i++) {
      const true_value = Math.sin(i * 0.05) + 0.3 * Math.sin(i * 0.2)
      trueSignal.push(true_value)
      
      // Add varying noise
      const noiseLevel = 0.1 + 0.2 * Math.abs(Math.sin(i * 0.03))
      measurements.push(true_value + (Math.random() - 0.5) * noiseLevel)
    }
    
    // Reset filter
    this.estimate = 0
    
    // Process signal
    for (let i = 0; i < measurements.length; i++) {
      this.environment.measurement = measurements[i]
      this.environment.measurementNoise = 0.1 + 0.2 * Math.abs(Math.sin(i * 0.03))
      this.environment.processNoise = 0.1
      
      this.tick()
      
      totalError += Math.abs(this.estimate - trueSignal[i])
    }
    
    return 10000 / (1 + totalError)
  }
}

// ============================================
// MEDIAN FILTER EVOLVER
// ============================================

class MedianFilterEvolver extends Individual {
  constructor(options) {
    super({
      ...options,
      sensors: [
        // Window of samples (size 7)
        { tick: () => this.environment.window[0] || 0 },
        { tick: () => this.environment.window[1] || 0 },
        { tick: () => this.environment.window[2] || 0 },
        { tick: () => this.environment.window[3] || 0 },
        { tick: () => this.environment.window[4] || 0 },
        { tick: () => this.environment.window[5] || 0 },
        { tick: () => this.environment.window[6] || 0 },
        // Window statistics
        { tick: () => Math.max(...(this.environment.window || [0])) },
        { tick: () => Math.min(...(this.environment.window || [0])) }
      ],
      actions: [
        // Weight for each sample in window
        { tick: (v) => { this.weights = this.weights || []; this.weights[0] = v; return v }},
        { tick: (v) => { this.weights[1] = v; return v }},
        { tick: (v) => { this.weights[2] = v; return v }},
        { tick: (v) => { this.weights[3] = v; return v }},
        { tick: (v) => { this.weights[4] = v; return v }},
        { tick: (v) => { this.weights[5] = v; return v }},
        { tick: (v) => { this.weights[6] = v; return v }},
        // Output
        { tick: (v) => {
          // Weighted median-like operation
          const weighted = this.environment.window.map((val, i) => 
            val * (this.weights[i] || 0.5)
          )
          weighted.sort((a, b) => a - b)
          this.output = weighted[Math.floor(weighted.length / 2)]
          return this.output
        }}
      ]
    })
  }
  
  fitness() {
    // Test on signals with impulse noise
    let totalError = 0
    
    const testSignals = [
      // Clean sine with impulse noise
      Array(100).fill(0).map((_, i) => {
        const clean = Math.sin(i * 0.1)
        const impulse = Math.random() < 0.05 ? (Math.random() - 0.5) * 4 : 0
        return { clean, noisy: clean + impulse }
      }),
      // Step function with noise
      Array(100).fill(0).map((_, i) => {
        const clean = i < 50 ? -1 : 1
        const noise = Math.random() < 0.1 ? (Math.random() - 0.5) * 3 : 
                      (Math.random() - 0.5) * 0.2
        return { clean, noisy: clean + noise }
      })
    ]
    
    for (const signal of testSignals) {
      for (let i = 3; i < signal.length - 3; i++) {
        // Create window
        this.environment.window = []
        for (let j = -3; j <= 3; j++) {
          this.environment.window.push(signal[i + j].noisy)
        }
        
        this.tick()
        
        totalError += Math.abs(this.output - signal[i].clean)
      }
    }
    
    return 10000 / (1 + totalError)
  }
}

// ============================================
// RUNNING THE EVOLUTION
// ============================================

async function runNoiseReducer() {
  console.log('🔇 Starting Noise Reducer Evolution...\n')
  
  // Adaptive Noise Filter
  console.log('📡 Evolving Adaptive Noise Filter...')
  const noiseGen = new Generation({
    size: 100,
    individualClass: NoiseReducer,
    individualGenomeSize: 100,
    individualNeurons: 20
  })
  
  noiseGen.fillRandom()
  
  for (let gen = 0; gen < 100; gen++) {
    noiseGen.population.forEach(ind => {
      ind.fitnessScore = ind.fitness()
    })
    
    noiseGen.population.sort((a, b) => b.fitnessScore - a.fitnessScore)
    
    if (gen % 20 === 0) {
      const best = noiseGen.population[0]
      console.log(`Gen ${gen}: Best fitness = ${best.fitnessScore.toFixed(2)}`)
      
      // Visual test
      const testSignal = Array(50).fill(0).map((_, i) => Math.sin(i * 0.2))
      const noisySignal = testSignal.map(v => v + (Math.random() - 0.5) * 0.3)
      const filtered = best.processSignal(noisySignal)
      
      // Calculate SNR improvement
      let noiseOriginal = 0
      let noiseFiltered = 0
      for (let i = 0; i < testSignal.length; i++) {
        noiseOriginal += (noisySignal[i] - testSignal[i]) ** 2
        noiseFiltered += (filtered[i] - testSignal[i]) ** 2
      }
      
      const snrImprovement = 10 * Math.log10(noiseOriginal / noiseFiltered)
      console.log(`  SNR Improvement: ${snrImprovement.toFixed(2)} dB`)
    }
    
    // Evolution
    noiseGen.population.slice(50).forEach(ind => ind.dead = true)
    noiseGen.next()
  }
  
  // Kalman Filter
  console.log('\n📊 Evolving Kalman-like Filter...')
  const kalmanGen = new Generation({
    size: 50,
    individualClass: KalmanFilter,
    individualGenomeSize: 60,
    individualNeurons: 12
  })
  
  kalmanGen.fillRandom()
  
  for (let gen = 0; gen < 80; gen++) {
    kalmanGen.population.forEach(ind => {
      ind.fitnessScore = ind.fitness()
    })
    
    kalmanGen.population.sort((a, b) => b.fitnessScore - a.fitnessScore)
    
    if (gen % 20 === 0) {
      const best = kalmanGen.population[0]
      console.log(`Gen ${gen}: Best fitness = ${best.fitnessScore.toFixed(2)}`)
      console.log(`  Typical Kalman gain: ${(best.kalmanGain || 0).toFixed(3)}`)
    }
    
    kalmanGen.population.slice(25).forEach(ind => ind.dead = true)
    kalmanGen.next()
  }
  
  console.log('\n✅ Noise reduction evolution complete!')
  
  // Return best individuals for further use
  return {
    noiseReducer: noiseGen.population[0],
    kalmanFilter: kalmanGen.population[0]
  }
}

// Export for use
export {
  NoiseReducer,
  KalmanFilter,
  MedianFilterEvolver,
  runNoiseReducer
}

// Run if called directly
if (import.meta.url === `file://${process.argv[1]}`) {
  runNoiseReducer()
}