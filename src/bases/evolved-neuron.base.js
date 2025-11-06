import { BitBuffer } from '../bitbuffer.class.js'

/**
 * EvolvedNeuronBase - Bit-level encoding for programmable neurons
 *
 * Layout:
 * [type:3=0b101][sentinel:4=0b1110][targetId:10][mode:2][numOps:5][op1:6]...[opN:6]
 *
 * - type identifies programmable neurons within the genome stream
 * - sentinel prevents false positives when scanning mixed base types
 * - targetId marks the neuron that will receive the custom tick
 * - mode defines how opcode output combines with the classical input
 * - numOps is the number of primitive opcodes encoded (1-32)
 */

const TYPE_ID = 0b101
const SENTINEL = 0b1110
const HEADER_BITS = 24
const MAX_OPS = 32

export const EvolvedNeuronModes = {
  REPLACE: 0,
  ADD: 1,
  PASS_THROUGH: 2
}

const clamp = value => {
  if (!Number.isFinite(value)) return 0
  if (Number.isNaN(value)) return 0
  if (value === Infinity) return 1
  if (value === -Infinity) return -1
  return value
}

const distance = (a, b) => {
  if (!a || !b) return 0
  const dx = (a.x || 0) - (b.x || 0)
  const dy = (a.y || 0) - (b.y || 0)
  return Math.sqrt((dx * dx) + (dy * dy))
}

const toBinary = condition => condition ? 1 : 0

const PRIMITIVES = [
  { name: 'NEURON_INPUT', arity: 0, fn: ctx => ctx.rawInput },
  { name: 'NEURON_BIASED', arity: 0, fn: ctx => ctx.biasedInput },
  { name: 'NEURON_BIAS', arity: 0, fn: ctx => ctx.bias },
  { name: 'INPUT_COUNT', arity: 0, fn: ctx => ctx.inputs.length },
  { name: 'IN_0', arity: 0, fn: ctx => ctx.getInputValue(0) },
  { name: 'IN_1', arity: 0, fn: ctx => ctx.getInputValue(1) },
  { name: 'IN_2', arity: 0, fn: ctx => ctx.getInputValue(2) },
  { name: 'IN_3', arity: 0, fn: ctx => ctx.getInputValue(3) },
  { name: 'IN_4', arity: 0, fn: ctx => ctx.getInputValue(4) },
  { name: 'IN_5', arity: 0, fn: ctx => ctx.getInputValue(5) },
  { name: 'IN_6', arity: 0, fn: ctx => ctx.getInputValue(6) },
  { name: 'IN_7', arity: 0, fn: ctx => ctx.getInputValue(7) },
  { name: 'INPUT_MAX', arity: 0, fn: ctx => ctx.inputs.length ? Math.max(...ctx.inputs) : 0 },
  { name: 'INPUT_MIN', arity: 0, fn: ctx => ctx.inputs.length ? Math.min(...ctx.inputs) : 0 },
  { name: 'INPUT_SUM_ABS', arity: 0, fn: ctx => ctx.inputs.reduce((acc, v) => acc + Math.abs(v), 0) },
  { name: 'INPUT_AVG', arity: 0, fn: ctx => ctx.inputs.length ? ctx.inputs.reduce((acc, v) => acc + v, 0) / ctx.inputs.length : 0 },
  { name: 'INPUT_RMS', arity: 0, fn: ctx => ctx.inputs.length ? Math.sqrt(ctx.inputs.reduce((acc, v) => acc + (v * v), 0) / ctx.inputs.length) : 0 },
  { name: 'MEMORY_SELF', arity: 0, fn: ctx => ctx.getMemoryCellValue ? ctx.getMemoryCellValue(ctx.neuron.metadata.id) : 0 },
  { name: 'ME_X', arity: 0, fn: ctx => ctx.individual?.x || 0 },
  { name: 'ME_Y', arity: 0, fn: ctx => ctx.individual?.y || 0 },
  { name: 'ME_ENERGY', arity: 0, fn: ctx => ctx.individual?.energy || 0 },
  { name: 'TARGET_X', arity: 0, fn: ctx => ctx.target?.x || 0 },
  { name: 'TARGET_Y', arity: 0, fn: ctx => ctx.target?.y || 0 },
  { name: 'DISTANCE_TO_TARGET', arity: 0, fn: ctx => distance(ctx.individual, ctx.target) },
  { name: 'DISTANCE_TO_CENTER', arity: 0, fn: ctx => {
    const center = (ctx.world?.size || 0) / 2
    const dx = (ctx.individual?.x || 0) - center
    const dy = (ctx.individual?.y || 0) - center
    return Math.sqrt((dx * dx) + (dy * dy))
  }},
  { name: 'WORLD_SIZE', arity: 0, fn: ctx => ctx.world?.size || 0 },
  { name: 'ADD', arity: 2, fn: (_ctx, a, b) => a + b },
  { name: 'SUB', arity: 2, fn: (_ctx, a, b) => a - b },
  { name: 'MUL', arity: 2, fn: (_ctx, a, b) => a * b },
  { name: 'DIV', arity: 2, fn: (_ctx, a, b) => b !== 0 ? a / b : 0 },
  { name: 'MOD', arity: 2, fn: (_ctx, a, b) => b !== 0 ? a % b : 0 },
  { name: 'MAX', arity: 2, fn: (_ctx, a, b) => Math.max(a, b) },
  { name: 'MIN', arity: 2, fn: (_ctx, a, b) => Math.min(a, b) },
  { name: 'AVG2', arity: 2, fn: (_ctx, a, b) => (a + b) / 2 },
  { name: 'GT', arity: 2, fn: (_ctx, a, b) => toBinary(a > b) },
  { name: 'LT', arity: 2, fn: (_ctx, a, b) => toBinary(a < b) },
  { name: 'GTE', arity: 2, fn: (_ctx, a, b) => toBinary(a >= b) },
  { name: 'LTE', arity: 2, fn: (_ctx, a, b) => toBinary(a <= b) },
  { name: 'EQ', arity: 2, fn: (_ctx, a, b) => toBinary(a === b) },
  { name: 'NEQ', arity: 2, fn: (_ctx, a, b) => toBinary(a !== b) },
  { name: 'AND', arity: 2, fn: (_ctx, a, b) => toBinary(a && b) },
  { name: 'OR', arity: 2, fn: (_ctx, a, b) => toBinary(a || b) },
  { name: 'XOR', arity: 2, fn: (_ctx, a, b) => toBinary(Boolean(a) !== Boolean(b)) },
  { name: 'NOT', arity: 1, fn: (_ctx, a) => toBinary(!a) },
  { name: 'ABS', arity: 1, fn: (_ctx, a) => Math.abs(a) },
  { name: 'NEG', arity: 1, fn: (_ctx, a) => -a },
  { name: 'SIGN', arity: 1, fn: (_ctx, a) => Math.sign(a) },
  { name: 'SQRT', arity: 1, fn: (_ctx, a) => a >= 0 ? Math.sqrt(a) : 0 },
  { name: 'CLAMP_NEG1_1', arity: 1, fn: (_ctx, a) => Math.max(-1, Math.min(1, a)) },
  { name: 'CLAMP_0_1', arity: 1, fn: (_ctx, a) => Math.max(0, Math.min(1, a)) },
  { name: 'TANH', arity: 1, fn: (_ctx, a) => Math.tanh(a) },
  { name: 'SIGMOID', arity: 1, fn: (_ctx, a) => 1 / (1 + Math.exp(-a)) },
  { name: 'STEP_POSITIVE', arity: 1, fn: (_ctx, a) => toBinary(a > 0) },
  { name: 'SELECT', arity: 3, fn: (_ctx, condition, whenTrue, whenFalse) => condition ? whenTrue : whenFalse },
  { name: 'CONST_NEG1', arity: 0, fn: () => -1 },
  { name: 'CONST_NEG0_5', arity: 0, fn: () => -0.5 },
  { name: 'CONST_0', arity: 0, fn: () => 0 },
  { name: 'CONST_0_5', arity: 0, fn: () => 0.5 },
  { name: 'CONST_1', arity: 0, fn: () => 1 },
  { name: 'CONST_2', arity: 0, fn: () => 2 },
  { name: 'CONST_5', arity: 0, fn: () => 5 },
  { name: 'CONST_10', arity: 0, fn: () => 10 },
  { name: 'CONST_50', arity: 0, fn: () => 50 },
  { name: 'CONST_100', arity: 0, fn: () => 100 }
]

const PRIMITIVE_NAMES = PRIMITIVES.map(p => p.name)

export class EvolvedNeuronBase {
  static get modeCount() {
    return Object.keys(EvolvedNeuronModes).length
  }

  static get primitivesList() {
    return PRIMITIVE_NAMES
  }

  static resolveMode(mode) {
    if (mode === undefined || mode === null) return EvolvedNeuronModes.REPLACE
    if (mode < 0) return EvolvedNeuronModes.REPLACE
    if (mode >= this.modeCount) return EvolvedNeuronModes.REPLACE
    return mode
  }

  static fromBitBuffer(buffer, position = 0) {
    const totalBits = buffer.bitLength || (buffer.buffer.length * 8)
    if (position + HEADER_BITS > totalBits) return null

    const typeId = buffer.readBits(3, position)
    if (typeId !== TYPE_ID) return null

    const sentinel = buffer.readBits(4, position + 3)
    if (sentinel !== SENTINEL) return null

    const targetId = buffer.readBits(10, position + 7)
    const mode = this.resolveMode(buffer.readBits(2, position + 17))
    const numOps = buffer.readBits(5, position + 19)

    const bitLength = HEADER_BITS + (numOps * 6)
    if (position + bitLength > totalBits) return null

    const operationIds = []
    for (let i = 0; i < numOps; i++) {
      const opId = buffer.readBits(6, position + HEADER_BITS + (i * 6))
      operationIds.push(opId)
    }

    return {
      type: 'evolved_neuron',
      targetId,
      mode,
      numOps,
      operationIds,
      bitLength,
      data: null
    }
  }

  static toBitBuffer(base) {
    const operationIds = base.operationIds || []
    const numOps = Math.min(operationIds.length, MAX_OPS)
    const bitLength = HEADER_BITS + (numOps * 6)
    const buffer = new BitBuffer(bitLength)

    buffer.writeBits(TYPE_ID, 3)
    buffer.writeBits(SENTINEL, 4, 3)
    buffer.writeBits(base.targetId & 0b1111111111, 10, 7)
    buffer.writeBits(this.resolveMode(base.mode), 2, 17)
    buffer.writeBits(numOps & 0b11111, 5, 19)

    for (let i = 0; i < numOps; i++) {
      const opId = operationIds[i] & 0b111111
      buffer.writeBits(opId, 6, HEADER_BITS + (i * 6))
    }

    return buffer
  }

  static randomBinary(options = {}) {
    const {
      minOps = 3,
      maxOps = 8,
      numPrimitives = PRIMITIVES.length,
      maxNeuronId = 1023,
      mode = null
    } = options

    const numOps = Math.max(minOps, Math.min(maxOps, minOps + Math.floor(Math.random() * (maxOps - minOps + 1))))
    const operationIds = []
    for (let i = 0; i < numOps; i++) {
      operationIds.push(Math.floor(Math.random() * numPrimitives))
    }

    return EvolvedNeuronBase.toBitBuffer({
      type: 'evolved_neuron',
      targetId: Math.floor(Math.random() * (maxNeuronId + 1)),
      mode: mode === null ? Math.floor(Math.random() * this.modeCount) : this.resolveMode(mode),
      operationIds
    })
  }

  static getOperationNames(operationIds) {
    return operationIds.map(id => PRIMITIVE_NAMES[id] || 'UNKNOWN')
  }

  static fromOperations(operations) {
    const operationIds = operations.map(opName => {
      const id = PRIMITIVE_NAMES.indexOf(opName)
      if (id === -1) {
        throw new Error(`Unknown operation: ${opName}`)
      }
      return id
    })

    return EvolvedNeuronBase.toBitBuffer({
      type: 'evolved_neuron',
      targetId: 0,
      mode: EvolvedNeuronModes.REPLACE,
      operationIds
    })
  }

  static calculateBitLength(numOps) {
    return HEADER_BITS + (numOps * 6)
  }

  static mutateBinary(buffer, position, mutationRate = 0.01, options = {}) {
    const {
      maxNeuronId = 255,
      numPrimitives = PRIMITIVES.length
    } = options

    const currentOps = buffer.readBits(5, position + 19)

    if (Math.random() < mutationRate * 4) {
      const target = buffer.readBits(10, position + 7)
      const delta = (Math.random() < 0.5 ? -1 : 1) * Math.ceil(Math.random() * 4)
      const nextTarget = Math.max(0, Math.min(maxNeuronId, target + delta))
      buffer.writeBits(nextTarget, 10, position + 7)
    }

    if (Math.random() < mutationRate * 4) {
      const newMode = Math.floor(Math.random() * this.modeCount)
      buffer.writeBits(newMode, 2, position + 17)
    }

    for (let i = 0; i < currentOps; i++) {
      if (Math.random() < mutationRate) {
        const opPos = position + HEADER_BITS + (i * 6)
        buffer.writeBits(Math.floor(Math.random() * numPrimitives) & 0b111111, 6, opPos)
      }
    }

    if (currentOps < MAX_OPS && Math.random() < mutationRate * 0.5) {
      const newOp = Math.floor(Math.random() * numPrimitives) & 0b111111
      buffer.writeBits(newOp, 6, position + HEADER_BITS + (currentOps * 6))
      buffer.writeBits(currentOps + 1, 5, position + 19)
    }
  }

  static equals(base1, base2) {
    if (base1.type !== 'evolved_neuron' || base2.type !== 'evolved_neuron') return false
    if (base1.targetId !== base2.targetId) return false
    if (this.resolveMode(base1.mode) !== this.resolveMode(base2.mode)) return false
    if (base1.numOps !== base2.numOps) return false

    for (let i = 0; i < base1.numOps; i++) {
      if (base1.operationIds[i] !== base2.operationIds[i]) return false
    }

    return true
  }

  static execute(base, context) {
    if (!base || !Array.isArray(base.operationIds)) return 0

    const maxOps = Math.min(base.operationIds.length, MAX_OPS)
    const stack = []

    const safeContext = {
      ...context,
      rawInput: context.rawInput ?? 0,
      biasedInput: context.biasedInput ?? 0,
      bias: context.bias ?? 0,
      inputs: context.inputs || [],
      individual: context.individual || context.environment?.me || null,
      target: context.environment?.target || null,
      world: context.environment?.world || null,
      getInputValue: index => {
        if (!context.inputs || index < 0 || index >= context.inputs.length) return 0
        return context.inputs[index]
      }
    }

    for (let i = 0; i < maxOps; i++) {
      const opId = base.operationIds[i]
      const primitive = PRIMITIVES[opId]
      if (!primitive) continue

      try {
        if (primitive.arity === 0) {
          stack.push(clamp(primitive.fn(safeContext)))
        } else if (primitive.arity === 1) {
          const a = stack.pop() ?? 0
          stack.push(clamp(primitive.fn(safeContext, a)))
        } else if (primitive.arity === 2) {
          const b = stack.pop() ?? 0
          const a = stack.pop() ?? 0
          stack.push(clamp(primitive.fn(safeContext, a, b)))
        } else if (primitive.arity === 3) {
          const c = stack.pop() ?? 0
          const b = stack.pop() ?? 0
          const a = stack.pop() ?? 0
          stack.push(clamp(primitive.fn(safeContext, a, b, c)))
        }
      } catch (_err) {
        return stack.length ? clamp(stack[stack.length - 1]) : 0
      }
    }

    return stack.length ? clamp(stack[stack.length - 1]) : 0
  }
}
