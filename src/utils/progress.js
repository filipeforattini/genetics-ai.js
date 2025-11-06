/**
 * Progress tracking utilities
 *
 * Provides progress callbacks for long-running operations
 */

/**
 * Create a progress tracker
 *
 * @param {Object} options
 * @param {number} options.total - Total steps
 * @param {Function} options.onProgress - Progress callback
 * @param {number} options.throttle - Minimum ms between progress updates (default: 100)
 * @returns {Object} - Progress tracker
 */
export function createProgressTracker(options = {}) {
  const {
    total = 100,
    onProgress = null,
    throttle = 100
  } = options

  let current = 0
  let lastUpdateTime = 0
  const startTime = Date.now()

  const tracker = {
    total,
    current: 0,

    /**
     * Update progress
     *
     * @param {number} value - New current value
     * @param {Object} metadata - Additional metadata
     */
    update(value, metadata = {}) {
      current = value
      tracker.current = current

      // Throttle updates
      const now = Date.now()
      if (now - lastUpdateTime < throttle && current < total) {
        return
      }

      lastUpdateTime = now

      if (onProgress && typeof onProgress === 'function') {
        const elapsed = now - startTime
        const percentage = total > 0 ? (current / total) * 100 : 0
        const eta = current > 0 ? (elapsed / current) * (total - current) : 0

        onProgress({
          current,
          total,
          percentage: Math.min(100, percentage),
          elapsed,
          eta: Math.max(0, eta),
          ...metadata
        })
      }
    },

    /**
     * Increment progress by 1
     *
     * @param {Object} metadata - Additional metadata
     */
    increment(metadata = {}) {
      tracker.update(current + 1, metadata)
    },

    /**
     * Complete the progress (set to 100%)
     *
     * @param {Object} metadata - Additional metadata
     */
    complete(metadata = {}) {
      tracker.update(total, {
        ...metadata,
        completed: true
      })
    }
  }

  return tracker
}

/**
 * Run async tasks with progress tracking
 *
 * @param {Array} tasks - Array of async functions
 * @param {Object} options - Options
 * @param {Function} options.onProgress - Progress callback
 * @param {number} options.concurrency - Max concurrent tasks (default: Infinity)
 * @returns {Promise<Array>} - Results
 */
export async function runWithProgress(tasks, options = {}) {
  const {
    onProgress = null,
    concurrency = Infinity
  } = options

  const tracker = createProgressTracker({
    total: tasks.length,
    onProgress
  })

  const results = new Array(tasks.length)
  let activeCount = 0
  let index = 0

  const runNext = async () => {
    if (index >= tasks.length) return

    const currentIndex = index++
    const task = tasks[currentIndex]

    activeCount++

    try {
      results[currentIndex] = await task()
      tracker.increment({ index: currentIndex })
    } catch (err) {
      results[currentIndex] = { error: err }
    }

    activeCount--

    if (index < tasks.length) {
      await runNext()
    }
  }

  // Start initial batch
  const initialBatch = Math.min(concurrency, tasks.length)
  const promises = []
  for (let i = 0; i < initialBatch; i++) {
    promises.push(runNext())
  }

  await Promise.all(promises)
  tracker.complete()

  return results
}

/**
 * Format time duration
 *
 * @param {number} ms - Milliseconds
 * @returns {string} - Formatted duration
 */
export function formatDuration(ms) {
  if (ms < 1000) {
    return `${Math.round(ms)}ms`
  } else if (ms < 60000) {
    return `${(ms / 1000).toFixed(1)}s`
  } else if (ms < 3600000) {
    const minutes = Math.floor(ms / 60000)
    const seconds = Math.round((ms % 60000) / 1000)
    return `${minutes}m ${seconds}s`
  } else {
    const hours = Math.floor(ms / 3600000)
    const minutes = Math.round((ms % 3600000) / 60000)
    return `${hours}h ${minutes}m`
  }
}

/**
 * Format progress bar
 *
 * @param {number} percentage - Progress percentage (0-100)
 * @param {number} width - Bar width (default: 20)
 * @returns {string} - Progress bar string
 */
export function formatProgressBar(percentage, width = 20) {
  const filled = Math.round((percentage / 100) * width)
  const empty = width - filled
  return `[${'█'.repeat(filled)}${'░'.repeat(empty)}]`
}
