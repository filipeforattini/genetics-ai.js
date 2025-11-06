# ⚡ Engineering Examples

Electrical engineering, digital circuits, and signal processing using evolved neural networks.

---

## 📂 Available Examples

### ✅ Logic Gates
**File**: [`logic-gates.js`](logic-gates.js)

Evolve neural networks to implement Boolean logic gates:
- AND, OR, NOT, NAND, NOR, XOR, XNOR
- Truth table learning without explicit programming

**Why it's cool**: Networks discover logic functions through evolution!

### ✅ Noise Reducer
**File**: [`noise-reducer.js`](noise-reducer.js)

Signal processing - remove noise from signals:
- Learn to filter out random noise
- Preserve underlying signal
- Digital signal processing with GA

---

## 🚀 Possible Engineering Problems

### 🔌 Digital Logic

#### 1. **Basic Logic Gates** ⭐ Easy

Evolve all fundamental gates:

```javascript
// AND Gate
sensors: [
  { tick: () => this.input_a },  // 0 or 1
  { tick: () => this.input_b }   // 0 or 1
]
actions: [
  { tick: v => this.output = v > 0.5 ? 1 : 0 }
]
fitness: () => {
  // Test all 4 combinations
  const truth_table = [
    {a: 0, b: 0, expected: 0},
    {a: 0, b: 1, expected: 0},
    {a: 1, b: 0, expected: 0},
    {a: 1, b: 1, expected: 1}
  ]
  // Return -errors
}
```

**Gates to implement**:
- AND, OR, NOT
- NAND, NOR (universal gates!)
- XOR, XNOR (harder - not linearly separable)

#### 2. **Combinational Circuits** ⭐⭐ Medium

Multi-gate circuits:

```javascript
// Half Adder (2 outputs: sum, carry)
// Inputs: A, B
// Outputs: Sum = A XOR B, Carry = A AND B
sensors: [A, B]
actions: [Sum, Carry]

// Full Adder (3 inputs, 2 outputs)
// Multiplexer (2ⁿ inputs → 1 output, n select lines)
// Decoder (n inputs → 2ⁿ outputs)
// Priority Encoder
```

#### 3. **Arithmetic Circuits** ⭐⭐⭐ Hard

Binary arithmetic:

```javascript
// 4-bit Adder (add two 4-bit numbers)
sensors: [a3, a2, a1, a0, b3, b2, b1, b0]  // 8 inputs
actions: [s4, s3, s2, s1, s0]              // 5 outputs (4 sum + carry)

// Subtractor
// Multiplier (very hard!)
// Comparator (A > B, A == B, A < B)
```

#### 4. **Sequential Logic** ⭐⭐⭐ Hard

Circuits with memory:

```javascript
// SR Latch (Set-Reset flip-flop)
// D Flip-Flop
// JK Flip-Flop
// T Flip-Flop

// These need MEMORY - use MemoryCell bases!
sensors: [S, R, CLK]
actions: [Q, Q_bar]
// Network must remember previous state
```

#### 5. **Counters & Registers** ⭐⭐⭐ Hard

```javascript
// 4-bit Binary Counter (0000 → 1111, repeats)
// Up/Down Counter
// Ring Counter
// Shift Register
```

### 📡 Signal Processing

#### 6. **Filters** ⭐⭐ Medium

Digital filters:

```javascript
// Low-pass filter (remove high frequencies)
sensors: [signal[t], signal[t-1], signal[t-2]]
actions: [filtered_output]

// High-pass filter
// Band-pass filter
// Notch filter (remove specific frequency)
```

#### 7. **Waveform Generation** ⭐⭐ Medium

Generate specific waveforms:

```javascript
// Square wave generator
// Sawtooth wave
// Triangle wave
// Sine wave approximation
```

#### 8. **Signal Analysis** ⭐⭐⭐ Hard

```javascript
// Peak detector
// Zero-crossing detector
// Frequency estimator
// Amplitude envelope follower
```

### 🎛️ Control Systems

#### 9. **PID Controller** ⭐⭐⭐ Hard

Evolve a PID (Proportional-Integral-Derivative) controller:

```javascript
class PIDController extends Individual {
  constructor(options) {
    super({
      ...options,
      sensors: [
        { tick: () => this.error },           // Current error
        { tick: () => this.error_integral },  // Accumulated error
        { tick: () => this.error_derivative } // Rate of change
      ],
      actions: [
        { tick: v => this.control_signal = v }
      ]
    })
  }

  fitness() {
    // Simulate system (e.g., temperature control)
    // Minimize overshoot, settling time, steady-state error
  }
}
```

**Applications**:
- Temperature control
- Motor speed control
- Robot arm positioning

#### 10. **State Machines** ⭐⭐ Medium

Finite State Machines (FSM):

```javascript
// Traffic light controller
// Vending machine logic
// Protocol state machines
// Elevator controller
```

### 🔋 Power & Analog

#### 11. **Voltage Regulation** ⭐⭐⭐ Hard

```javascript
// Learn to maintain constant voltage output
// Given varying input voltage and load
```

#### 12. **RC/RL Circuit Simulation** ⭐⭐ Medium

```javascript
// Learn RC time constant behavior: V(t) = V₀(1 - e^(-t/RC))
// RL circuit transient response
```

### 🌐 Boolean Function Optimization

#### 13. **Karnaugh Map Simplification** ⭐⭐⭐ Hard

```javascript
// Given a truth table, find minimal Boolean expression
// Network learns to output simplified form
// Classic EE optimization problem!
```

#### 14. **Don't Care Conditions** ⭐⭐ Medium

```javascript
// Boolean functions with don't-care inputs (X)
// Network learns to optimize using don't-cares
```

---

## 💡 Implementation Examples

### Logic Gate Template

```javascript
import { Generation, Individual } from 'genetics-ai.js'

class LogicGate extends Individual {
  constructor(options) {
    super({
      ...options,
      sensors: [
        { id: 0, tick: () => this.a },
        { id: 1, tick: () => this.b }
      ],
      actions: [
        { id: 0, tick: v => this.output = v }
      ]
    })
  }

  fitness() {
    const truthTable = [
      { a: 0, b: 0, expected: 0 },  // Change for different gates
      { a: 0, b: 1, expected: 0 },
      { a: 1, b: 0, expected: 0 },
      { a: 1, b: 1, expected: 1 }   // AND gate
    ]

    let errors = 0
    for (const test of truthTable) {
      this.a = test.a
      this.b = test.b
      this.tick()

      const actual = this.output > 0.5 ? 1 : 0
      if (actual !== test.expected) errors++
    }

    return -errors  // Perfect score = 0 errors
  }
}

const gen = new Generation({
  size: 100,
  individualClass: LogicGate,
  individualGenomeSize: 50,
  individualNeurons: 5
})

gen.fillRandom()

for (let i = 0; i < 100; i++) {
  await gen.tickAsync()
  gen.population.sort((a, b) => b.fitness() - a.fitness())

  if (gen.population[0].fitness() === 0) {
    console.log(`✅ Solved in ${i} generations!`)
    break
  }

  gen.population.slice(-30).forEach(ind => ind.dead = true)
  gen = await gen.nextAsync()
}
```

### Digital Filter Template

```javascript
class DigitalFilter extends Individual {
  constructor(options) {
    super({
      ...options,
      sensors: [
        { id: 0, tick: () => this.signal[this.t] },
        { id: 1, tick: () => this.signal[this.t - 1] || 0 },
        { id: 2, tick: () => this.signal[this.t - 2] || 0 }
      ],
      actions: [
        { id: 0, tick: v => this.filtered = v }
      ]
    })
    this.signal = []
    this.t = 0
  }

  fitness() {
    // Generate noisy signal
    const cleanSignal = x => Math.sin(x / 10)
    const noise = () => (Math.random() - 0.5) * 0.5

    this.signal = []
    for (let i = 0; i < 100; i++) {
      this.signal.push(cleanSignal(i) + noise())
    }

    // Measure how well we filter
    let error = 0
    for (this.t = 0; this.t < 100; this.t++) {
      this.tick()
      error += Math.abs(this.filtered - cleanSignal(this.t))
    }

    return -error
  }
}
```

---

## 🎯 Difficulty Guide

- 🟢 **Easy**: Basic gates (AND, OR, NOT), simple filters
- 🟡 **Medium**: XOR, combinational circuits, waveform generation
- 🔴 **Hard**: Sequential logic, PID controllers, arithmetic circuits

---

## 📊 Why Genetic Algorithms for Engineering?

✅ **No mathematical model needed** - Learn directly from specifications
✅ **Handle non-linear systems** - Works when traditional methods fail
✅ **Optimize parameters** - Find best PID gains, filter coefficients
✅ **Discover novel circuits** - May find unexpected solutions
✅ **Robust design** - Evolution naturally favors robust solutions

---

## 🔬 Advanced: Using Memory Cells

For sequential logic (flip-flops, counters), use **MemoryCell bases**:

```javascript
import { Generation, Individual, MemoryCellBase } from 'genetics-ai.js'

// Memory cells provide temporal state
// Perfect for flip-flops and sequential circuits!
```

See documentation on MemoryCell bases for details.

---

## 🚀 Challenge Problems

1. **Universal Gate**: Build any logic function using only NAND or NOR
2. **4-bit ALU**: Arithmetic Logic Unit (add, subtract, AND, OR)
3. **Binary Multiplier**: Multiply two 4-bit numbers
4. **Adaptive Filter**: Filter that adapts to changing noise patterns
5. **Oscillator**: Generate stable periodic signal without external clock

---

## 📚 Resources

- **Truth Tables**: Define expected outputs for all input combinations
- **Timing Diagrams**: For sequential circuits, define behavior over time
- **Transfer Functions**: For analog/filter problems

Start with `logic-gates.js` and build from there! ⚡
