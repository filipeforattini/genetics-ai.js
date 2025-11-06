# 🔢 Mathematics Examples

Solving mathematical problems using evolved neural networks.

---

## 📂 Available Examples

### ✅ Equation Solver
**File**: [`equation-solver.js`](equation-solver.js)

Evolve neural networks to solve algebraic equations:
- Quadratic equations: `ax² + bx + c = 0`
- Linear equations: `mx + b = y`
- Systems of linear equations

**How it works**: The network learns to output the correct solution given equation coefficients as inputs.

---

## 🚀 Possible Math Problems to Solve

### 1. **Function Approximation** ⭐ Easy-Medium

Evolve networks that learn to approximate mathematical functions:

```javascript
// Learn sin(x)
sensors: [{ tick: () => this.x }]
actions: [{ tick: v => this.prediction = v }]
fitness: () => -Math.abs(Math.sin(this.x) - this.prediction)

// Learn polynomials: f(x) = x³ - 2x² + 3x - 1
// Learn exponentials: f(x) = e^x
// Learn logarithms: f(x) = ln(x)
```

**Why it's interesting**: Test if networks can learn continuous functions without training data!

### 2. **Optimization Problems** ⭐⭐ Medium

Find minima/maxima of complex functions:

```javascript
// Find minimum of f(x,y) = x² + y² - xy + 2x - 3y
// Rastrigin function (many local minima)
// Rosenbrock function (optimization benchmark)
```

**Genetic algorithm directly searches the function space!**

### 3. **System of Equations** ⭐⭐ Medium

Solve multiple equations simultaneously:

```javascript
// 2x + 3y = 8
// 4x - y = 2
// Network outputs (x, y) given coefficients
```

### 4. **Numerical Integration** ⭐⭐⭐ Hard

Approximate integrals without symbolic math:

```javascript
// ∫₀¹ x² dx = 1/3
// Network learns to integrate by sampling points
```

### 5. **Differential Equations** ⭐⭐⭐ Hard

Learn solutions to ODEs:

```javascript
// dy/dx = y  →  y = Ce^x
// Network learns y(x) given initial conditions
```

### 6. **Sequence Prediction** ⭐ Easy-Medium

Predict next numbers in sequences:

```javascript
// Fibonacci: 1, 1, 2, 3, 5, 8, 13, ...
// Primes: 2, 3, 5, 7, 11, 13, ...
// Geometric: 2, 6, 18, 54, ...
// Custom patterns
```

**Sensors**: Last N numbers
**Actions**: Predict next number

### 7. **Matrix Operations** ⭐⭐ Medium

Learn matrix math:

```javascript
// Matrix multiplication
// Matrix inversion (2×2, 3×3)
// Determinant calculation
// Eigenvalue estimation
```

**Inputs**: Flattened matrix elements
**Outputs**: Result matrix elements

### 8. **Symbolic Regression** ⭐⭐⭐ Hard

Discover formulas from data points:

```javascript
// Given points: (1,3), (2,7), (3,13), (4,21)
// Discover: y = 2x² - x + 2
```

**This is what genetic algorithms excel at!** No pre-defined formula needed.

### 9. **Root Finding** ⭐⭐ Medium

Find roots of equations:

```javascript
// Find x where f(x) = 0
// Newton's method, but evolved
```

### 10. **Trigonometry** ⭐ Easy-Medium

Learn trig identities:

```javascript
// sin²(x) + cos²(x) = 1
// tan(x) = sin(x)/cos(x)
// Given angle, output sin/cos/tan
```

### 11. **Prime Factorization** ⭐⭐⭐ Hard

Factor numbers into primes:

```javascript
// Input: 12
// Output: [2, 2, 3]
// Very hard for large numbers!
```

### 12. **Calculus - Derivatives** ⭐⭐ Medium

Approximate derivatives:

```javascript
// Given f(x) = x³, learn f'(x) = 3x²
// Numerical differentiation through evolution
```

### 13. **Statistics** ⭐⭐ Medium

Learn statistical measures:

```javascript
// Mean, median, mode
// Standard deviation
// Correlation coefficient
// Linear regression coefficients
```

### 14. **Number Theory** ⭐⭐⭐ Hard

Number theory problems:

```javascript
// GCD (Greatest Common Divisor)
// LCM (Least Common Multiple)
// Modular arithmetic: (a + b) mod n
// Fermat's little theorem applications
```

### 15. **Geometry** ⭐⭐ Medium

Geometric calculations:

```javascript
// Distance between points
// Area of triangle given vertices
// Circle intersection
// Angle calculations
```

---

## 💡 Implementation Tips

### For Function Approximation:
```javascript
class FunctionLearner extends Individual {
  constructor(options) {
    super({
      ...options,
      sensors: [
        { id: 0, tick: () => this.x }  // Input value
      ],
      actions: [
        { id: 0, tick: v => this.output = v }  // Predicted output
      ]
    })
  }

  fitness() {
    let error = 0
    // Test on multiple x values
    for (let x = -10; x <= 10; x += 0.5) {
      this.x = x
      this.tick()
      const expected = Math.sin(x)  // Target function
      const predicted = this.output
      error += Math.abs(expected - predicted)
    }
    return -error  // Lower error = higher fitness
  }
}
```

### For Optimization:
```javascript
class Optimizer extends Individual {
  constructor(options) {
    super({
      ...options,
      sensors: [],
      actions: [
        { id: 0, tick: v => this.x = v },
        { id: 1, tick: v => this.y = v }
      ]
    })
  }

  fitness() {
    this.tick()
    // Minimize f(x,y) = x² + y²
    return -(this.x * this.x + this.y * this.y)
  }
}
```

---

## 🎯 Difficulty Guide

- 🟢 **Easy**: Function approximation, basic equations, sequences
- 🟡 **Medium**: Systems of equations, matrix operations, optimization
- 🔴 **Hard**: Symbolic regression, differential equations, prime factorization

---

## 📊 Why Use Genetic Algorithms for Math?

✅ **No training data needed** - Just define the problem
✅ **Black-box optimization** - Works when gradient descent fails
✅ **Discover formulas** - Symbolic regression finds equations from data
✅ **Handle discontinuities** - Works on non-differentiable functions
✅ **Parallel exploration** - Population searches many solutions simultaneously

---

## 🚀 Try It Yourself!

Pick a problem above and implement it! All you need:

1. Define sensors (problem inputs)
2. Define actions (problem outputs)
3. Implement fitness function (how close to correct answer)
4. Let evolution find the solution!

**Example template** in `equation-solver.js` - start from there! 🎉
