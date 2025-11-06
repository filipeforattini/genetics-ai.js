import { jest } from '@jest/globals'
import { LearningRuleBase } from '../../src/bases/learning-rule.base.js'

describe('LearningRuleBase', () => {
  afterEach(() => {
    jest.restoreAllMocks()
  })

  test('encodes and decodes learning rule', () => {
    const buffer = LearningRuleBase.toBitBuffer({
      type: 'learning_rule',
      ruleType: LearningRuleBase.STDP,
      connId: 42,
      rate: 15,
      decay: LearningRuleBase.DECAY_MEDIUM
    })

    const parsed = LearningRuleBase.fromBitBuffer(buffer, 0)
    expect(parsed).toMatchObject({
      type: 'learning_rule',
      ruleType: LearningRuleBase.STDP,
      connId: 42,
      rate: 15,
      decay: LearningRuleBase.DECAY_MEDIUM,
      bitLength: LearningRuleBase.BIT_LENGTH
    })
  })

  test('rate conversions are symmetric', () => {
    const floatRate = LearningRuleBase.rateToFloat(31)
    expect(floatRate).toBeCloseTo(1.0, 5)
    expect(LearningRuleBase.floatToRate(0.42)).toBeCloseTo(Math.round(0.42 * 31), 0)
  })

  test('decay factors and names map correctly', () => {
    expect(LearningRuleBase.getDecayFactor(LearningRuleBase.DECAY_FAST)).toBe(0.05)
    expect(LearningRuleBase.getRuleName(LearningRuleBase.HEBBIAN)).toBe('Hebbian')
    expect(LearningRuleBase.getRuleName(9)).toBe('Unknown')
  })

  test('applyRule handles multiple rule types', () => {
    const base = {
      ruleType: LearningRuleBase.HEBBIAN,
      rate: LearningRuleBase.floatToRate(0.5),
      decay: LearningRuleBase.DECAY_NONE
    }
    const hebbian = LearningRuleBase.applyRule(base, 0.2, 0.5, 0.6)
    expect(hebbian).toBeCloseTo(0.2 + 0.5 * 0.5 * 0.6)

    const anti = LearningRuleBase.applyRule(
      { ...base, ruleType: LearningRuleBase.ANTI_HEBBIAN },
      0.2,
      0.5,
      0.6
    )
    expect(anti).toBeLessThan(0.2)

    const stdp = LearningRuleBase.applyRule(
      { ...base, ruleType: LearningRuleBase.STDP },
      0.2,
      0.7,
      0.4
    )
    expect(stdp).not.toBeNaN()

    const oja = LearningRuleBase.applyRule(
      { ...base, ruleType: LearningRuleBase.OJA },
      0.9,
      0.7,
      0.4
    )
    expect(oja).toBeLessThan(0.9 + 0.5 * 0.7 * 0.4) // normalization reduces growth
  })

  test('randomBinary respects provided rule types', () => {
    jest.spyOn(Math, 'random').mockReturnValue(0.1)
    const buffer = LearningRuleBase.randomBinary({
      maxConnections: 8,
      ruleTypes: [LearningRuleBase.BCM]
    })
    const parsed = LearningRuleBase.fromBitBuffer(buffer, 0)
    expect(parsed.ruleType).toBe(LearningRuleBase.BCM)
    expect(parsed.connId).toBeLessThan(8)
  })
})
