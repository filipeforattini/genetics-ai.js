import { ActivationLUT, globalActivationLUT } from '../src/activation-lut.class.js'

describe('ActivationLUT', () => {
  test('sigmoid lookup approximates logistic function', () => {
    const lut = new ActivationLUT()
    expect(lut.sigmoid(-100)).toBe(0)
    expect(lut.sigmoid(100)).toBe(1)
    const mid = lut.sigmoid(0)
    expect(mid).toBeGreaterThan(0.45)
    expect(mid).toBeLessThan(0.55)
  })

  test('tanh lookup respects range', () => {
    const lut = new ActivationLUT()
    expect(lut.tanh(-100)).toBe(-1)
    expect(lut.tanh(100)).toBe(1)
    expect(lut.tanh(0)).toBeCloseTo(0, 3)
  })

  test('relu and identity passthrough values', () => {
    expect(globalActivationLUT.relu(-5)).toBe(0)
    expect(globalActivationLUT.relu(3)).toBe(3)
    expect(globalActivationLUT.identity(7)).toBe(7)
  })

  test('memory usage helper reports totals', () => {
    const usage = globalActivationLUT.getMemoryUsage()
    expect(usage.total).toMatch(/[0-9.]+ KB/)
    expect(Number(usage.entries)).toBe(globalActivationLUT.TABLE_SIZE)
  })
})
