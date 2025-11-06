/**
 * 🧬 GENOME EVOLVED SENSOR ENCODING DEMO
 *
 * Demonstra como sensores evoluídos são codificados em genoma base32
 * e integrados com o sistema genetics-ai.js
 */

// ==================== BASE32 UTILITIES ====================

class Base32 {
  static CHARSET = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ234567'

  // Encode number to base32
  static encode(num, length = 2) {
    if (num < 0 || num >= Math.pow(32, length)) {
      throw new Error(`Number ${num} out of range for ${length} chars`)
    }

    let result = ''
    for (let i = 0; i < length; i++) {
      result = this.CHARSET[num % 32] + result
      num = Math.floor(num / 32)
    }
    return result
  }

  // Decode base32 to number
  static decode(str) {
    let result = 0
    for (let i = 0; i < str.length; i++) {
      const index = this.CHARSET.indexOf(str[i])
      if (index === -1) {
        throw new Error(`Invalid base32 char: ${str[i]}`)
      }
      result = result * 32 + index
    }
    return result
  }
}

// ==================== PRIMITIVES ====================

const SENSOR_PRIMITIVES = {
  'MY_X': (ctx) => ctx.me?.x || 0,
  'MY_Y': (ctx) => ctx.me?.y || 0,
  'TARGET_X': (ctx) => ctx.target?.x || 0,
  'TARGET_Y': (ctx) => ctx.target?.y || 0,
  'DISTANCE': (ctx) => {
    const dx = (ctx.me?.x || 0) - (ctx.target?.x || 0)
    const dy = (ctx.me?.y || 0) - (ctx.target?.y || 0)
    return Math.sqrt(dx*dx + dy*dy)
  },
  'GT': (a, b) => a > b ? 1 : 0,
  'LT': (a, b) => a < b ? 1 : 0,
  'EQ': (a, b) => Math.abs(a - b) < 0.01 ? 1 : 0,
  'AND': (a, b) => (a && b) ? 1 : 0,
  'OR': (a, b) => (a || b) ? 1 : 0,
  'NOT': (a) => a ? 0 : 1,
  'ADD': (a, b) => a + b,
  'SUB': (a, b) => a - b,
  'ABS': (a) => Math.abs(a),
  'CONST_0': () => 0,
  'CONST_1': () => 1,
  'CONST_5': () => 5,
  'CONST_10': () => 10,
  'CONST_50': () => 50,
}

const PRIMITIVES_LIST = Object.keys(SENSOR_PRIMITIVES)

// ==================== EVOLVED SENSOR BASE ====================

class EvolvedSensorBase {
  constructor(encoded) {
    this.encoded = encoded
    this.type = 'evolved_sensor'
    this.parse()
  }

  parse() {
    if (!this.encoded || this.encoded[0] !== 'S') {
      throw new Error('Invalid evolved sensor base')
    }

    // Format: S + numOps(1) + op1(2) + op2(2) + ...
    const chars = this.encoded

    // Number of operations (1 char = 0-31)
    this.numOps = Base32.decode(chars[1])

    // Extract operation IDs (2 chars each = 0-1023)
    this.operationIds = []
    for (let i = 0; i < this.numOps; i++) {
      const start = 2 + i * 2
      const end = start + 2
      const opId = Base32.decode(chars.substring(start, end))
      this.operationIds.push(opId)
    }

    return this
  }

  getOperations() {
    return this.operationIds.map(id => PRIMITIVES_LIST[id] || 'UNKNOWN')
  }

  static fromOperations(operations) {
    const numOps = operations.length
    let encoded = 'S' + Base32.encode(numOps, 1)

    for (const opName of operations) {
      const opId = PRIMITIVES_LIST.indexOf(opName)
      if (opId === -1) {
        throw new Error(`Unknown operation: ${opName}`)
      }
      encoded += Base32.encode(opId, 2)
    }

    return new EvolvedSensorBase(encoded)
  }

  static calculateLength(numOps) {
    return 2 + (numOps * 2)  // 'S' + numOps(1) + ops(2 each)
  }

  toString() {
    const ops = this.getOperations()
    return `${this.encoded} = [${ops.join(' → ')}]`
  }
}

// ==================== INTERPRETER ====================

class EvolvedSensorInterpreter {
  evaluate(operations, context) {
    const stack = []

    for (const opName of operations) {
      const fn = SENSOR_PRIMITIVES[opName]
      if (!fn) continue

      const arity = fn.length

      if (arity === 0) {
        stack.push(fn(context))
      } else if (arity === 1) {
        if (opName.startsWith('MY_') || opName.startsWith('TARGET_') || opName.startsWith('DISTANCE')) {
          stack.push(fn(context))
        } else {
          const a = stack.pop() || 0
          stack.push(fn(a))
        }
      } else if (arity === 2) {
        const b = stack.pop() || 0
        const a = stack.pop() || 0
        stack.push(fn(a, b))
      }
    }

    return stack.length > 0 ? stack[stack.length - 1] : 0
  }
}

// ==================== GENOME SIMULATOR ====================

class SimpleGenome {
  constructor(encoded) {
    this.encoded = encoded
    this.bases = []
  }

  parse() {
    this.bases = []
    let i = 0

    while (i < this.encoded.length) {
      const char = this.encoded[i]

      if (char === 'S') {
        // Evolved sensor base
        try {
          const numOps = Base32.decode(this.encoded[i + 1])
          const length = EvolvedSensorBase.calculateLength(numOps)
          const base = new EvolvedSensorBase(this.encoded.substring(i, i + length))
          this.bases.push(base)
          i += length
        } catch (err) {
          console.warn(`Error parsing evolved sensor at ${i}:`, err.message)
          i++
        }
      } else if (char === 'C') {
        // Connection base (mock)
        this.bases.push({ type: 'connection', encoded: this.encoded.substring(i, i + 5) })
        i += 5
      } else if (char === 'B') {
        // Bias base (mock)
        this.bases.push({ type: 'bias', encoded: this.encoded.substring(i, i + 3) })
        i += 3
      } else {
        i++  // Skip unknown
      }
    }

    return this
  }

  getEvolvedSensors() {
    return this.bases.filter(b => b.type === 'evolved_sensor')
  }

  visualize() {
    console.log('Genome Visualization:')
    console.log('='.repeat(80))
    console.log(`Raw: ${this.encoded}`)
    console.log(`Length: ${this.encoded.length} chars\n`)

    for (let i = 0; i < this.bases.length; i++) {
      const base = this.bases[i]
      if (base.type === 'evolved_sensor') {
        console.log(`[${i}] Evolved Sensor: ${base.toString()}`)
      } else if (base.type === 'connection') {
        console.log(`[${i}] Connection: ${base.encoded}`)
      } else if (base.type === 'bias') {
        console.log(`[${i}] Bias: ${base.encoded}`)
      }
    }
  }
}

// ==================== DEMO ====================

function demo() {
  console.log('🧬 GENOME EVOLVED SENSOR ENCODING DEMO\n')
  console.log('='.repeat(80))

  // ===== EXAMPLE 1: Encoding individual operations =====
  console.log('\n📝 EXAMPLE 1: Encoding Individual Primitives\n')

  const testPrimitives = ['MY_X', 'TARGET_X', 'GT', 'DISTANCE', 'CONST_50', 'LT']

  console.log('Primitive → Index → Base32:')
  for (const prim of testPrimitives) {
    const index = PRIMITIVES_LIST.indexOf(prim)
    const encoded = Base32.encode(index, 2)
    console.log(`  ${prim.padEnd(12)} → ${index.toString().padStart(2)} → ${encoded}`)
  }

  // ===== EXAMPLE 2: Create evolved sensor from operations =====
  console.log('\n' + '='.repeat(80))
  console.log('\n🔬 EXAMPLE 2: Create Evolved Sensor\n')

  const operations1 = ['MY_X', 'TARGET_X', 'GT']
  const sensor1 = EvolvedSensorBase.fromOperations(operations1)

  console.log(`Operations: [${operations1.join(', ')}]`)
  console.log(`Encoded: ${sensor1.encoded}`)
  console.log(`Length: ${sensor1.encoded.length} chars`)
  console.log(`Breakdown:`)
  console.log(`  'S'      = Type marker (evolved sensor)`)
  console.log(`  '${sensor1.encoded[1]}'      = NumOps (${sensor1.numOps})`)
  for (let i = 0; i < sensor1.numOps; i++) {
    const opChars = sensor1.encoded.substring(2 + i*2, 4 + i*2)
    const opId = sensor1.operationIds[i]
    const opName = PRIMITIVES_LIST[opId]
    console.log(`  '${opChars}' = Op${i+1}: ${opName} (id=${opId})`)
  }

  // ===== EXAMPLE 3: Decode and execute sensor =====
  console.log('\n' + '='.repeat(80))
  console.log('\n⚙️  EXAMPLE 3: Decode and Execute\n')

  const context = {
    me: { x: 10, y: 20 },
    target: { x: 30, y: 40 }
  }

  console.log(`Context: me=(${context.me.x}, ${context.me.y}), target=(${context.target.x}, ${context.target.y})`)
  console.log(`\nExecuting: ${sensor1.toString()}`)

  const interpreter = new EvolvedSensorInterpreter()
  const result = interpreter.evaluate(sensor1.getOperations(), context)

  console.log(`\nExecution steps:`)
  console.log(`  1. MY_X → ${context.me.x}`)
  console.log(`  2. TARGET_X → ${context.target.x}`)
  console.log(`  3. GT(${context.me.x}, ${context.target.x}) → ${result}`)
  console.log(`\n✅ Result: ${result} (${result ? 'my X > target X' : 'my X <= target X'})`)

  // ===== EXAMPLE 4: Multiple sensors in genome =====
  console.log('\n' + '='.repeat(80))
  console.log('\n🧬 EXAMPLE 4: Complete Genome with Multiple Bases\n')

  // Create multiple sensors
  const sensor2 = EvolvedSensorBase.fromOperations(['DISTANCE', 'CONST_50', 'LT'])
  const sensor3 = EvolvedSensorBase.fromOperations(['MY_Y', 'TARGET_Y', 'SUB', 'ABS'])

  // Build genome: Connection + Sensor1 + Bias + Sensor2 + Connection + Sensor3
  const genomeString = 'CABCD' + sensor1.encoded + 'BXYZ' + sensor2.encoded + 'CEFGH' + sensor3.encoded

  console.log(`Building genome with:`)
  console.log(`  - 2 connections (mock)`)
  console.log(`  - 1 bias (mock)`)
  console.log(`  - 3 evolved sensors`)
  console.log(`\nGenome string: ${genomeString}`)
  console.log(`Total length: ${genomeString.length} chars\n`)

  const genome = new SimpleGenome(genomeString)
  genome.parse()
  genome.visualize()

  // ===== EXAMPLE 5: Execute all sensors =====
  console.log('\n' + '='.repeat(80))
  console.log('\n🚀 EXAMPLE 5: Execute All Evolved Sensors\n')

  const evolvedSensors = genome.getEvolvedSensors()
  console.log(`Found ${evolvedSensors.length} evolved sensors\n`)

  for (let i = 0; i < evolvedSensors.length; i++) {
    const sensor = evolvedSensors[i]
    const ops = sensor.getOperations()
    const result = interpreter.evaluate(ops, context)

    console.log(`Sensor ${i+1}: ${ops.join(' → ')}`)
    console.log(`  Result: ${result.toFixed(3)}`)
  }

  // ===== EXAMPLE 6: Mutation simulation =====
  console.log('\n' + '='.repeat(80))
  console.log('\n🔀 EXAMPLE 6: Mutation Simulation\n')

  console.log(`Original sensor: ${sensor1.encoded} = [${sensor1.getOperations().join(' → ')}]`)
  console.log(`\nMutations:\n`)

  // Mutation 1: Change one char
  let mutated = sensor1.encoded
  const mutatePos = 2 + Math.floor(Math.random() * (sensor1.numOps * 2))
  const randomChar = Base32.CHARSET[Math.floor(Math.random() * 32)]
  mutated = mutated.substring(0, mutatePos) + randomChar + mutated.substring(mutatePos + 1)

  try {
    const mutatedSensor = new EvolvedSensorBase(mutated)
    console.log(`1. Point mutation (changed char at ${mutatePos}):`)
    console.log(`   ${mutated} = [${mutatedSensor.getOperations().join(' → ')}]`)
  } catch (err) {
    console.log(`1. Point mutation failed: ${err.message}`)
  }

  // Mutation 2: Add operation
  const newOp = PRIMITIVES_LIST[Math.floor(Math.random() * PRIMITIVES_LIST.length)]
  const newSensor = EvolvedSensorBase.fromOperations([...sensor1.getOperations(), newOp])
  console.log(`\n2. Add operation (added ${newOp}):`)
  console.log(`   ${newSensor.encoded} = [${newSensor.getOperations().join(' → ')}]`)

  // Mutation 3: Remove operation
  if (sensor1.numOps > 1) {
    const ops = sensor1.getOperations()
    ops.splice(Math.floor(Math.random() * ops.length), 1)
    const smallerSensor = EvolvedSensorBase.fromOperations(ops)
    console.log(`\n3. Remove operation:`)
    console.log(`   ${smallerSensor.encoded} = [${smallerSensor.getOperations().join(' → ')}]`)
  }

  // ===== SUMMARY =====
  console.log('\n' + '='.repeat(80))
  console.log('\n✅ SUMMARY\n')
  console.log('Key Points:')
  console.log('  ✓ Evolved sensors encode as base32 strings')
  console.log('  ✓ Format: S + numOps(1) + op1(2) + op2(2) + ...')
  console.log('  ✓ Compact: 3 ops = 7 chars, 5 ops = 11 chars')
  console.log('  ✓ Mix naturally with connection/bias bases in genome')
  console.log('  ✓ Mutation works at character level')
  console.log('  ✓ Crossover works automatically (string slicing)')
  console.log('\n🚀 Ready to integrate with genetics-ai.js!')
}

demo()
