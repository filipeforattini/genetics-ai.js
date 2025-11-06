import { jest } from '@jest/globals'
import { PlasticityBase } from '../../src/bases/plasticity.base.js'

describe('PlasticityBase', () => {
  afterEach(() => {
    jest.restoreAllMocks()
  })

  const base = {
    type: 'plasticity',
    targetId: 10,
    level: 8
  }

  test('toBitBuffer/fromBitBuffer roundtrip', () => {
    const buffer = PlasticityBase.toBitBuffer(base)
    const parsed = PlasticityBase.fromBitBuffer(buffer, 0)
    expect(parsed).toMatchObject({
      type: 'plasticity',
      targetId: 10,
      level: 8,
      bitLength: PlasticityBase.BIT_LENGTH
    })
  })

  test('randomBinary obeys limits', () => {
    jest.spyOn(Math, 'random').mockReturnValue(0.1)
    const buffer = PlasticityBase.randomBinary({
      neurons: 32,
      minLevel: 4,
      maxLevel: 4
    })
    const parsed = PlasticityBase.fromBitBuffer(buffer, 0)
    expect(parsed.targetId).toBeLessThan(32)
    expect(parsed.level).toBe(4)
  })

  test('level conversions and categories', () => {
    expect(PlasticityBase.levelToFloat(15)).toBeCloseTo(1)
    expect(PlasticityBase.floatToLevel(0.5)).toBe(8)
    expect(PlasticityBase.getCategory(0)).toContain('Fixed')
    expect(PlasticityBase.getCategory(4)).toContain('Moderate')
  })

  test('scaling helpers respond to plasticity level', () => {
    expect(PlasticityBase.getMaxWeightChange(5, 0.2)).toBeCloseTo(0.2 * (5 / 15))
    expect(PlasticityBase.scaleWeightDelta(10, 2)).toBeCloseTo(2 * (10 / 15))
    expect(PlasticityBase.isPlastic(8, 4)).toBe(true)
  })

  test('critical period adjustment reduces level after threshold', () => {
    expect(PlasticityBase.getCriticalPeriodLevel(12, 0, 100)).toBe(12)
    expect(PlasticityBase.getCriticalPeriodLevel(12, 150, 100)).toBeLessThan(12)
  })

  test('mutateBinary flips bits when rate high', () => {
    const buffer = PlasticityBase.toBitBuffer(base)
    let call = 0
    jest.spyOn(Math, 'random').mockImplementation(() => {
      call++
      if (call <= 3) return 1
      return 0
    })
    PlasticityBase.mutateBinary(buffer, 0, 1)
    const parsed = PlasticityBase.fromBitBuffer(buffer, 0)
    expect(parsed).not.toBeNull()
    expect(parsed.level).not.toBe(base.level)
  })
})
