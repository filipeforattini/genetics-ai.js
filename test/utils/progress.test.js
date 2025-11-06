import {
  createProgressTracker,
  runWithProgress,
  formatDuration,
  formatProgressBar
} from '../../src/utils/progress.js'

describe('progress utilities', () => {
  describe('createProgressTracker', () => {
    test('creates tracker with defaults', () => {
      const tracker = createProgressTracker()

      expect(tracker.total).toBe(100)
      expect(tracker.current).toBe(0)
      expect(tracker.update).toBeDefined()
      expect(tracker.increment).toBeDefined()
      expect(tracker.complete).toBeDefined()
    })

    test('creates tracker with custom total', () => {
      const tracker = createProgressTracker({ total: 50 })

      expect(tracker.total).toBe(50)
      expect(tracker.current).toBe(0)
    })

    test('updates progress', () => {
      const tracker = createProgressTracker({ total: 10, throttle: 0 })

      tracker.update(5)

      expect(tracker.current).toBe(5)
    })

    test('calls onProgress callback', (done) => {
      const tracker = createProgressTracker({
        total: 10,
        throttle: 0,
        onProgress: (progress) => {
          expect(progress.current).toBe(5)
          expect(progress.total).toBe(10)
          expect(progress.percentage).toBe(50)
          expect(progress.elapsed).toBeGreaterThanOrEqual(0)
          expect(progress.eta).toBeGreaterThanOrEqual(0)
          done()
        }
      })

      tracker.update(5)
    })

    test('increments progress', () => {
      const tracker = createProgressTracker({ total: 10, throttle: 0 })

      tracker.increment()
      expect(tracker.current).toBe(1)

      tracker.increment()
      expect(tracker.current).toBe(2)

      tracker.increment()
      expect(tracker.current).toBe(3)
    })

    test('completes progress', (done) => {
      const tracker = createProgressTracker({
        total: 10,
        throttle: 0,
        onProgress: (progress) => {
          if (progress.completed) {
            expect(progress.current).toBe(10)
            expect(progress.total).toBe(10)
            expect(progress.percentage).toBe(100)
            expect(progress.completed).toBe(true)
            done()
          }
        }
      })

      tracker.complete()
    })

    test('includes metadata in progress', (done) => {
      const tracker = createProgressTracker({
        total: 10,
        throttle: 0,
        onProgress: (progress) => {
          expect(progress.customData).toBe('test')
          expect(progress.index).toBe(5)
          done()
        }
      })

      tracker.update(5, { customData: 'test', index: 5 })
    })

    test('throttles updates', (done) => {
      let callCount = 0

      const tracker = createProgressTracker({
        total: 100,
        throttle: 50, // 50ms throttle
        onProgress: () => {
          callCount++
        }
      })

      // Rapid updates
      for (let i = 1; i <= 10; i++) {
        tracker.update(i)
      }

      // Should be throttled
      expect(callCount).toBeLessThan(10)

      // Wait for throttle and complete
      setTimeout(() => {
        tracker.complete()
        expect(callCount).toBeGreaterThan(0)
        done()
      }, 100)
    })

    test('calculates percentage correctly', (done) => {
      const tracker = createProgressTracker({
        total: 100,
        throttle: 0,
        onProgress: (progress) => {
          if (progress.current === 25) {
            expect(progress.percentage).toBe(25)
            done()
          }
        }
      })

      tracker.update(25)
    })

    test('handles zero total', (done) => {
      const tracker = createProgressTracker({
        total: 0,
        throttle: 0,
        onProgress: (progress) => {
          expect(progress.percentage).toBe(0)
          done()
        }
      })

      tracker.update(0)
    })

    test('caps percentage at 100', (done) => {
      const tracker = createProgressTracker({
        total: 10,
        throttle: 0,
        onProgress: (progress) => {
          expect(progress.percentage).toBe(100)
          done()
        }
      })

      tracker.update(15) // Over 100%
    })
  })

  describe('runWithProgress', () => {
    test('runs tasks with progress tracking', async () => {
      const tasks = [
        async () => 1,
        async () => 2,
        async () => 3,
      ]

      const progressUpdates = []

      const results = await runWithProgress(tasks, {
        onProgress: (progress) => {
          progressUpdates.push(progress)
        }
      })

      expect(results).toEqual([1, 2, 3])
      expect(progressUpdates.length).toBeGreaterThan(0)

      // Last update should be completion
      const last = progressUpdates[progressUpdates.length - 1]
      expect(last.current).toBe(3)
      expect(last.total).toBe(3)
    })

    test('runs tasks without progress callback', async () => {
      const tasks = [
        async () => 'a',
        async () => 'b',
      ]

      const results = await runWithProgress(tasks)

      expect(results).toEqual(['a', 'b'])
    })

    test('handles task errors', async () => {
      const tasks = [
        async () => 1,
        async () => { throw new Error('task error') },
        async () => 3,
      ]

      const results = await runWithProgress(tasks)

      expect(results[0]).toBe(1)
      expect(results[1].error).toBeDefined()
      expect(results[1].error.message).toBe('task error')
      expect(results[2]).toBe(3)
    })

    test('respects concurrency limit', async () => {
      let concurrentCount = 0
      let maxConcurrent = 0

      const tasks = Array(10).fill(0).map((_, i) => async () => {
        concurrentCount++
        maxConcurrent = Math.max(maxConcurrent, concurrentCount)
        await new Promise(resolve => setTimeout(resolve, 10))
        concurrentCount--
        return i
      })

      await runWithProgress(tasks, { concurrency: 3 })

      expect(maxConcurrent).toBeLessThanOrEqual(3)
    })

    test('runs unlimited concurrency by default', async () => {
      let concurrentCount = 0
      let maxConcurrent = 0

      const tasks = Array(10).fill(0).map((_, i) => async () => {
        concurrentCount++
        maxConcurrent = Math.max(maxConcurrent, concurrentCount)
        await new Promise(resolve => setTimeout(resolve, 10))
        concurrentCount--
        return i
      })

      await runWithProgress(tasks)

      expect(maxConcurrent).toBe(10)
    })

    test('includes task index in progress', async () => {
      const tasks = [
        async () => 1,
        async () => 2,
        async () => 3,
      ]

      const indices = []

      await runWithProgress(tasks, {
        onProgress: (progress) => {
          if (progress.index !== undefined) {
            indices.push(progress.index)
          }
        }
      })

      // May not get all indices due to concurrency, but should get at least one
      expect(indices.length).toBeGreaterThan(0)
      expect(indices.some(i => i >= 0 && i <= 2)).toBe(true)
    })

    test('handles empty task list', async () => {
      const results = await runWithProgress([])

      expect(results).toEqual([])
    })
  })

  describe('formatDuration', () => {
    test('formats milliseconds', () => {
      expect(formatDuration(0)).toBe('0ms')
      expect(formatDuration(100)).toBe('100ms')
      expect(formatDuration(500)).toBe('500ms')
      expect(formatDuration(999)).toBe('999ms')
    })

    test('formats seconds', () => {
      expect(formatDuration(1000)).toBe('1.0s')
      expect(formatDuration(1500)).toBe('1.5s')
      expect(formatDuration(30000)).toBe('30.0s')
      expect(formatDuration(59999)).toBe('60.0s')
    })

    test('formats minutes', () => {
      expect(formatDuration(60000)).toBe('1m 0s')
      expect(formatDuration(90000)).toBe('1m 30s')
      expect(formatDuration(120000)).toBe('2m 0s')
      expect(formatDuration(3599000)).toBe('59m 59s')
    })

    test('formats hours', () => {
      expect(formatDuration(3600000)).toBe('1h 0m')
      expect(formatDuration(5400000)).toBe('1h 30m')
      expect(formatDuration(7200000)).toBe('2h 0m')
      expect(formatDuration(10800000)).toBe('3h 0m')
    })
  })

  describe('formatProgressBar', () => {
    test('formats progress bar with default width', () => {
      expect(formatProgressBar(0)).toBe('[░░░░░░░░░░░░░░░░░░░░]')
      expect(formatProgressBar(100)).toBe('[████████████████████]')
    })

    test('formats progress bar with custom width', () => {
      expect(formatProgressBar(0, 10)).toBe('[░░░░░░░░░░]')
      expect(formatProgressBar(100, 10)).toBe('[██████████]')
    })

    test('formats partial progress', () => {
      const bar50 = formatProgressBar(50, 10)
      expect(bar50).toBe('[█████░░░░░]')

      const bar25 = formatProgressBar(25, 20)
      expect(bar25).toBe('[█████░░░░░░░░░░░░░░░]')

      const bar75 = formatProgressBar(75, 20)
      expect(bar75).toBe('[███████████████░░░░░]')
    })

    test('handles edge cases', () => {
      expect(formatProgressBar(1, 10)).toBe('[░░░░░░░░░░]')
      expect(formatProgressBar(99, 10)).toBe('[██████████]')
      expect(formatProgressBar(50, 1)).toBe('[█]')
    })

    test('handles non-integer percentages', () => {
      expect(formatProgressBar(33.33, 10)).toBe('[███░░░░░░░]')
      expect(formatProgressBar(66.66, 10)).toBe('[███████░░░]')
    })
  })

  describe('integration scenarios', () => {
    test('tracks progress of async population evaluation', async () => {
      // Simulate evaluating a population
      const population = Array(50).fill(0).map((_, i) => ({
        id: i,
        evaluate: async () => {
          await new Promise(resolve => setTimeout(resolve, 5))
          return i * 10
        }
      }))

      const progressUpdates = []

      const tasks = population.map(ind => async () => {
        const fitness = await ind.evaluate()
        return { id: ind.id, fitness }
      })

      const results = await runWithProgress(tasks, {
        concurrency: 10,
        onProgress: (progress) => {
          progressUpdates.push({
            percentage: progress.percentage,
            eta: progress.eta
          })
        }
      })

      expect(results.length).toBe(50)
      expect(progressUpdates.length).toBeGreaterThan(0)

      // Check that progress increased
      const percentages = progressUpdates.map(p => p.percentage)
      expect(Math.max(...percentages)).toBe(100)
    })

    test('displays progress with formatted output', (done) => {
      const tracker = createProgressTracker({
        total: 100,
        throttle: 0,
        onProgress: (progress) => {
          const bar = formatProgressBar(progress.percentage)
          const duration = formatDuration(progress.elapsed)

          expect(bar).toMatch(/^\[.*\]$/)
          expect(duration).toMatch(/\d+(ms|s|m|h)/)

          if (progress.completed) {
            done()
          }
        }
      })

      for (let i = 1; i < 100; i++) {
        tracker.update(i)
      }
      tracker.complete() // Ensure completion triggers
    })
  })
})
