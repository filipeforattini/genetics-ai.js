import { jest } from '@jest/globals'
import { EvolvedNeuronBase, EvolvedNeuronModes } from '../../src/bases/evolved-neuron.base.js'

describe('EvolvedNeuronBase', () => {
  afterEach(() => {
    jest.restoreAllMocks()
  })

  test('encodes and decodes metadata and operation ids', () => {
    const buffer = EvolvedNeuronBase.toBitBuffer({
      targetId: 12,
      mode: EvolvedNeuronModes.ADD,
      operationIds: [1, 5, 12]
    })

    const parsed = EvolvedNeuronBase.fromBitBuffer(buffer, 0)

    expect(parsed).toMatchObject({
      type: 'evolved_neuron',
      targetId: 12,
      mode: EvolvedNeuronModes.ADD,
      numOps: 3,
      operationIds: [1, 5, 12],
      bitLength: 42
    })
  })

  test('maps operation names using builtin list', () => {
    const names = EvolvedNeuronBase.primitivesList
    const buffer = EvolvedNeuronBase.toBitBuffer({
      targetId: 0,
      mode: EvolvedNeuronModes.REPLACE,
      operationIds: [0, 24, 36]
    })
    const parsed = EvolvedNeuronBase.fromBitBuffer(buffer, 0)

    expect(parsed.operationIds).toEqual([0, 24, 36])
    expect(EvolvedNeuronBase.getOperationNames(parsed.operationIds))
      .toEqual([names[0], names[24], names[36]])
  })

  test('randomBinary respects options', () => {
    const mockSequence = [0.1, 0.2, 0.3, 0.4, 0.5]
    jest.spyOn(Math, 'random').mockImplementation(() => mockSequence.shift() ?? 0.5)

    const buffer = EvolvedNeuronBase.randomBinary({
      minOps: 3,
      maxOps: 3,
      numPrimitives: 8,
      maxNeuronId: 10
    })

    const parsed = EvolvedNeuronBase.fromBitBuffer(buffer, 0)
    expect(parsed.numOps).toBe(3)
    parsed.operationIds.forEach(id => expect(id).toBeLessThan(8))
    // With mockSequence[4]=0.5 and maxNeuronId=10: floor(0.5 * 11) = 5
    expect(parsed.targetId).toBe(5)
    expect(parsed.mode).toBe(EvolvedNeuronModes.ADD)
  })

  test('mutateBinary mutates target, mode and operations', () => {
    const original = EvolvedNeuronBase.toBitBuffer({
      targetId: 5,
      mode: EvolvedNeuronModes.REPLACE,
      operationIds: [1, 2]
    })

    const sequence = [0.1, 0.6, 0.2, 0.1, 0.5, 0.2, 0.4, 0.8, 0.1, 0.4, 0.9]
    jest.spyOn(Math, 'random').mockImplementation(() => sequence.shift() ?? 0.5)

    const buffer = original.clone()
    EvolvedNeuronBase.mutateBinary(buffer, 0, 1, { numPrimitives: 8, maxNeuronId: 10 })

    const parsed = EvolvedNeuronBase.fromBitBuffer(buffer, 0)
    expect(parsed.targetId).toBe(6)
    expect(parsed.mode).toBe(EvolvedNeuronModes.ADD)
    expect(parsed.operationIds).toEqual([3, 0, 7])
  })
})
