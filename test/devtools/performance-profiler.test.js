import { jest } from '@jest/globals'
import { PerformanceProfiler } from '../../src/devtools/performance-profiler.class.js'

describe('PerformanceProfiler', () => {
  afterEach(() => {
    jest.restoreAllMocks()
  })

  const createBrain = () => {
    const brain = {
      environment: { value: 1 },
      useJIT: false,
      useLayeredProcessing: false,
      definitions: {
        all: {},
        sensors: {},
        neurons: {},
        actions: {}
      },
      tick: jest.fn(() => ({ result: 'ok' }))
    }
    return brain
  }

  test('collects statistics and generates report', () => {
    const brain = createBrain()
    const profiler = new PerformanceProfiler(brain)

    const times = [0, 1.5, 3.5, 6] // durations: 1.5, 2.0, 2.5
    jest.spyOn(performance, 'now').mockImplementation(() => times.shift() ?? 6)

    profiler.start()

    brain.tick()
    brain.useLayeredProcessing = true
    brain.tick()
    brain.useLayeredProcessing = false
    brain.useJIT = true
    brain.tick()

    profiler.stop()

    const stats = profiler.getStats()
    expect(stats.ticks).toBe(3)
    expect(stats.percentiles.p95).toContain('ms')

    const report = profiler.getReport()
    expect(report).toContain('Brain Performance Profile')
    expect(report).toContain('Ticks/second')
  })
})
