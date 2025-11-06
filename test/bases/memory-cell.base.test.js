import { jest } from '@jest/globals'
import { MemoryCellBase } from '../../src/bases/memory-cell.base.js'

describe('MemoryCellBase', () => {
  afterEach(() => {
    jest.restoreAllMocks()
  })

  const sample = {
    type: 'memory_cell',
    cellId: 17,
    decay: 10,
    persistence: 5
  }

  test('round-trips through BitBuffer', () => {
    const buffer = MemoryCellBase.toBitBuffer(sample)
    const parsed = MemoryCellBase.fromBitBuffer(buffer, 0)

    expect(parsed).toMatchObject({
      type: 'memory_cell',
      cellId: 17,
      decay: 10,
      persistence: 5,
      bitLength: MemoryCellBase.BIT_LENGTH
    })
  })

  test('randomBinary honours limits', () => {
    jest.spyOn(Math, 'random').mockReturnValue(0.2)
    const buffer = MemoryCellBase.randomBinary({ maxCells: 16 })
    const parsed = MemoryCellBase.fromBitBuffer(buffer, 0)
    expect(parsed.cellId).toBeLessThan(16)
  })

  test('decay helpers compute expected values', () => {
    expect(MemoryCellBase.getDecayFactor(0)).toBe(0)
    expect(MemoryCellBase.getPersistenceThreshold(7)).toBeCloseTo(1)
    expect(MemoryCellBase.getTimeConstant({ decay: 5 })).toBeGreaterThan(0)
    expect(MemoryCellBase.getHalfLife({ decay: 5 })).toBeGreaterThan(0)
  })

  test('updateValue applies decay and clamps output', () => {
    const result = MemoryCellBase.updateValue(1, sample, -2)
    expect(result).toBeGreaterThanOrEqual(-1)
    expect(result).toBeLessThanOrEqual(1)
  })

  test('shouldPersist compares against random draw', () => {
    jest.spyOn(Math, 'random').mockReturnValue(0.99)
    expect(MemoryCellBase.shouldPersist(sample, 1)).toBe(true)
    jest.spyOn(Math, 'random').mockReturnValue(0)
    expect(MemoryCellBase.shouldPersist(sample, 1)).toBe(false)
  })

  test('mutateBinary flips bits when rate high', () => {
    const buffer = MemoryCellBase.toBitBuffer(sample)
    let call = 0
    jest.spyOn(Math, 'random').mockImplementation(() => {
      call++
      // Keep the leading type bits intact to preserve base validity
      if (call <= 3) return 1
      return 0
    })
    MemoryCellBase.mutateBinary(buffer, 0, 1)
    const parsed = MemoryCellBase.fromBitBuffer(buffer, 0)
    expect(parsed).not.toBeNull()
    expect(parsed.cellId).not.toBe(sample.cellId)
  })
})
