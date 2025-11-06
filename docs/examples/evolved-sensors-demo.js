/**
 * 🧬 EVOLVED SENSORS DEMO
 *
 * Demonstração de como indivíduos podem EVOLUIR seus próprios sensores
 * de forma SEGURA (sem eval!)
 */

// ==================== PRIMITIVE LIBRARY ====================

const SENSOR_PRIMITIVES = {
  // ===== GETTERS =====
  'MY_X': (ctx) => ctx.me.x || 0,
  'MY_Y': (ctx) => ctx.me.y || 0,
  'MY_ENERGY': (ctx) => ctx.me.energy || 0,

  'TARGET_X': (ctx) => ctx.target?.x || 0,
  'TARGET_Y': (ctx) => ctx.target?.y || 0,

  'WORLD_SIZE': (ctx) => ctx.world.size || 100,

  // ===== CALCULATIONS =====
  'DISTANCE_TO_TARGET': (ctx) => {
    if (!ctx.target) return 999
    const dx = ctx.me.x - ctx.target.x
    const dy = ctx.me.y - ctx.target.y
    return Math.sqrt(dx*dx + dy*dy)
  },

  'DISTANCE_TO_CENTER': (ctx) => {
    const center = (ctx.world.size || 100) / 2
    const dx = ctx.me.x - center
    const dy = ctx.me.y - center
    return Math.sqrt(dx*dx + dy*dy)
  },

  // ===== OPERATORS =====
  'GT': (a, b) => a > b ? 1 : 0,
  'LT': (a, b) => a < b ? 1 : 0,
  'GTE': (a, b) => a >= b ? 1 : 0,
  'LTE': (a, b) => a <= b ? 1 : 0,

  'AND': (a, b) => (a && b) ? 1 : 0,
  'OR': (a, b) => (a || b) ? 1 : 0,
  'NOT': (a) => a ? 0 : 1,

  'ADD': (a, b) => a + b,
  'SUB': (a, b) => a - b,
  'MUL': (a, b) => a * b,
  'DIV': (a, b) => b !== 0 ? a / b : 0,
  'ABS': (a) => Math.abs(a),

  // ===== CONSTANTS =====
  'CONST_0': () => 0,
  'CONST_1': () => 1,
  'CONST_5': () => 5,
  'CONST_10': () => 10,
  'CONST_50': () => 50,
}

// ==================== INTERPRETER ====================

class EvolvedSensorInterpreter {
  constructor(primitives = SENSOR_PRIMITIVES) {
    this.primitives = primitives
    this.maxOps = 20  // Prevent runaway computation
  }

  evaluate(operations, context) {
    const stack = []
    let opsCount = 0

    for (const opName of operations) {
      if (opsCount++ > this.maxOps) {
        console.warn('Sensor too complex, aborting')
        return 0
      }

      const fn = this.primitives[opName]
      if (!fn) {
        console.warn(`Unknown primitive: ${opName}`)
        continue
      }

      try {
        // Determine function arity
        const arity = fn.length

        if (arity === 0) {
          // Constant or nullary getter
          stack.push(fn(context))
        } else if (arity === 1) {
          // Unary operator or unary getter
          if (opName.startsWith('MY_') || opName.startsWith('TARGET_') || opName.startsWith('WORLD_') || opName.startsWith('DISTANCE_')) {
            // It's a getter with context
            stack.push(fn(context))
          } else {
            // It's an operator
            const a = stack.pop() || 0
            stack.push(fn(a))
          }
        } else if (arity === 2) {
          // Binary operator
          const b = stack.pop() || 0
          const a = stack.pop() || 0
          stack.push(fn(a, b))
        }
      } catch (err) {
        console.warn(`Error evaluating ${opName}:`, err.message)
        return 0
      }
    }

    return stack.length > 0 ? stack[stack.length - 1] : 0
  }

  explain(operations, context) {
    const stack = []
    const steps = []

    for (const opName of operations) {
      const fn = this.primitives[opName]
      if (!fn) continue

      const arity = fn.length

      if (arity === 0) {
        const result = fn(context)
        stack.push(result)
        steps.push(`${opName} → ${result}`)
      } else if (arity === 1) {
        if (opName.startsWith('MY_') || opName.startsWith('TARGET_') || opName.startsWith('WORLD_') || opName.startsWith('DISTANCE_')) {
          const result = fn(context)
          stack.push(result)
          steps.push(`${opName} → ${result}`)
        } else {
          const a = stack.pop() || 0
          const result = fn(a)
          stack.push(result)
          steps.push(`${opName}(${a}) → ${result}`)
        }
      } else if (arity === 2) {
        const b = stack.pop() || 0
        const a = stack.pop() || 0
        const result = fn(a, b)
        stack.push(result)
        steps.push(`${opName}(${a}, ${b}) → ${result}`)
      }
    }

    return {
      steps,
      result: stack.length > 0 ? stack[stack.length - 1] : 0
    }
  }
}

// ==================== EVOLVED SENSOR ====================

class EvolvedSensor {
  constructor(operations, name = 'unnamed') {
    this.operations = operations
    this.name = name
    this.interpreter = new EvolvedSensorInterpreter()
  }

  tick(context) {
    return this.interpreter.evaluate(this.operations, context)
  }

  explain(context) {
    return this.interpreter.explain(this.operations, context)
  }

  mutate(rate = 0.3) {
    const newOps = [...this.operations]
    const mutationType = Math.random()

    if (mutationType < rate && newOps.length > 1) {
      // Remove operation
      const index = Math.floor(Math.random() * newOps.length)
      newOps.splice(index, 1)
    } else if (mutationType < rate * 2 && newOps.length < 15) {
      // Add operation
      const primitiveNames = Object.keys(SENSOR_PRIMITIVES)
      const newOp = primitiveNames[Math.floor(Math.random() * primitiveNames.length)]
      const index = Math.floor(Math.random() * (newOps.length + 1))
      newOps.splice(index, 0, newOp)
    } else if (mutationType < rate * 3) {
      // Change operation
      const index = Math.floor(Math.random() * newOps.length)
      const primitiveNames = Object.keys(SENSOR_PRIMITIVES)
      newOps[index] = primitiveNames[Math.floor(Math.random() * primitiveNames.length)]
    }

    return new EvolvedSensor(newOps, this.name)
  }

  static random(minOps = 3, maxOps = 8) {
    const numOps = minOps + Math.floor(Math.random() * (maxOps - minOps + 1))
    const primitiveNames = Object.keys(SENSOR_PRIMITIVES)
    const operations = []

    for (let i = 0; i < numOps; i++) {
      operations.push(primitiveNames[Math.floor(Math.random() * primitiveNames.length)])
    }

    return new EvolvedSensor(operations)
  }

  toString() {
    return this.operations.join(' → ')
  }
}

// ==================== DEMO ====================

function demo() {
  console.log('🧬 EVOLVED SENSORS DEMO\n')
  console.log('='.repeat(80))

  // Create context
  const context = {
    me: { x: 10, y: 20, energy: 50 },
    target: { x: 30, y: 40 },
    world: { size: 100 }
  }

  console.log('\n📍 Context:')
  console.log(`  Me: x=${context.me.x}, y=${context.me.y}, energy=${context.me.energy}`)
  console.log(`  Target: x=${context.target.x}, y=${context.target.y}`)
  console.log(`  World: size=${context.world.size}`)

  // Example 1: Hand-crafted sensor
  console.log('\n' + '='.repeat(80))
  console.log('\n🎯 EXAMPLE 1: Hand-crafted Sensor')
  console.log('   Goal: "Am I close to target?" (distance < 50)')

  const sensor1 = new EvolvedSensor([
    'DISTANCE_TO_TARGET',  // Get distance
    'CONST_50',            // Push 50
    'LT'                   // Is distance < 50?
  ], 'close_to_target')

  console.log(`\n   Sensor: ${sensor1}`)
  const explanation1 = sensor1.explain(context)
  console.log('\n   Execution:')
  explanation1.steps.forEach((step, i) => console.log(`     ${i+1}. ${step}`))
  console.log(`\n   ✅ Result: ${explanation1.result} (${explanation1.result ? 'YES, I am close!' : 'NO, too far'})`)

  // Example 2: Another hand-crafted sensor
  console.log('\n' + '='.repeat(80))
  console.log('\n🎯 EXAMPLE 2: Complex Sensor')
  console.log('   Goal: "Am I far from center AND low energy?" ')

  const sensor2 = new EvolvedSensor([
    'DISTANCE_TO_CENTER',  // Get distance to center
    'CONST_50',            // Push 50
    'GT',                  // distance > 50? → result on stack
    'MY_ENERGY',           // Get my energy
    'CONST_50',            // Push 50
    'LT',                  // energy < 50? → result on stack
    'AND'                  // Both conditions?
  ], 'danger_zone')

  console.log(`\n   Sensor: ${sensor2}`)
  const explanation2 = sensor2.explain(context)
  console.log('\n   Execution:')
  explanation2.steps.forEach((step, i) => console.log(`     ${i+1}. ${step}`))
  console.log(`\n   ✅ Result: ${explanation2.result} (${explanation2.result ? 'DANGER!' : 'Safe'})`)

  // Example 3: Random evolved sensors
  console.log('\n' + '='.repeat(80))
  console.log('\n🧬 EXAMPLE 3: Randomly Evolved Sensors')
  console.log('   Testing 5 random sensor "mutations":\n')

  for (let i = 0; i < 5; i++) {
    const randomSensor = EvolvedSensor.random(4, 7)
    const result = randomSensor.tick(context)

    console.log(`   ${i+1}. ${randomSensor}`)
    console.log(`      Result: ${result.toFixed(3)}`)
  }

  // Example 4: Sensor mutation
  console.log('\n' + '='.repeat(80))
  console.log('\n🔬 EXAMPLE 4: Sensor Mutation')
  console.log(`   Original: ${sensor1}\n`)

  for (let i = 0; i < 3; i++) {
    const mutated = sensor1.mutate(0.8)  // High mutation rate for demo
    const result = mutated.tick(context)
    console.log(`   Mutation ${i+1}: ${mutated}`)
    console.log(`               Result: ${result.toFixed(3)}`)
  }

  // Example 5: Evolution simulation
  console.log('\n' + '='.repeat(80))
  console.log('\n🌟 EXAMPLE 5: Simulated Evolution')
  console.log('   Task: Evolve sensor that outputs value closest to 1.0\n')

  let population = []
  for (let i = 0; i < 20; i++) {
    population.push(EvolvedSensor.random(3, 6))
  }

  for (let gen = 0; gen < 5; gen++) {
    // Evaluate
    const fitness = population.map(sensor => {
      const value = sensor.tick(context)
      return Math.abs(1.0 - value)  // Fitness = distance from 1.0 (lower is better)
    })

    // Sort by fitness
    const sorted = population
      .map((sensor, i) => ({ sensor, fitness: fitness[i] }))
      .sort((a, b) => a.fitness - b.fitness)

    const best = sorted[0]
    console.log(`   Gen ${gen+1}: Best fitness=${best.fitness.toFixed(4)}, value=${best.sensor.tick(context).toFixed(4)}`)
    console.log(`           ${best.sensor}`)

    // Create next generation
    const nextGen = []

    // Elites (top 5)
    for (let i = 0; i < 5; i++) {
      nextGen.push(sorted[i].sensor)
    }

    // Mutations of elites
    for (let i = 0; i < 15; i++) {
      const parent = sorted[i % 5].sensor
      nextGen.push(parent.mutate(0.3))
    }

    population = nextGen
  }

  console.log('\n' + '='.repeat(80))
  console.log('\n✅ Demo complete!')
  console.log('\n💡 Key Takeaways:')
  console.log('   - Sensors are SAFE (no eval, just interpretation)')
  console.log('   - Sensors are EVOLVABLE (mutation works)')
  console.log('   - Sensors are EXPLAINABLE (can trace execution)')
  console.log('   - Sensors are POWERFUL (can express complex logic)')
  console.log('\n🚀 Next: Integrate with genetics-ai.js Individual class!')
}

demo()
