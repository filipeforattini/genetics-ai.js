/**
 * Performance Profiler - Built-in profiling for Brain performance
 *
 * Makes it EASY to understand where time is spent and optimize your networks!
 *
 * Usage:
 * ```javascript
 * const brain = new Brain({ genome, sensors, actions })
 * const profiler = new PerformanceProfiler(brain)
 *
 * // Run your simulation
 * for (let i = 0; i < 1000; i++) {
 *   brain.tick()
 * }
 *
 * // Get beautiful report
 * console.log(profiler.getReport())
 * ```
 */
export class PerformanceProfiler {
  constructor(brain) {
    this.brain = brain
    this.stats = {
      ticks: 0,
      totalTime: 0,
      setupTime: 0,
      sensorTime: 0,
      neuronTime: 0,
      actionTime: 0,
      jitTime: 0,
      layeredTime: 0,
      directTime: 0,
    }

    this.timestamps = []
    this.enabled = false
  }

  /**
   * Start profiling
   */
  start() {
    this.enabled = true
    this.stats = {
      ticks: 0,
      totalTime: 0,
      setupTime: 0,
      sensorTime: 0,
      neuronTime: 0,
      actionTime: 0,
      jitTime: 0,
      layeredTime: 0,
      directTime: 0,
    }
    this.timestamps = []

    // Wrap brain.tick() to measure time
    const originalTick = this.brain.tick.bind(this.brain)
    this.brain.tick = () => {
      const start = performance.now()
      const result = originalTick()
      const time = performance.now() - start

      this.stats.ticks++
      this.stats.totalTime += time
      this.timestamps.push(time)

      // Track which mode was used
      if (this.brain.useJIT) {
        this.stats.jitTime += time
      } else if (this.brain.useLayeredProcessing) {
        this.stats.layeredTime += time
      } else {
        this.stats.directTime += time
      }

      return result
    }
  }

  /**
   * Stop profiling
   */
  stop() {
    this.enabled = false
  }

  /**
   * Get statistics
   */
  getStats() {
    const avgTime = this.stats.ticks > 0 ? this.stats.totalTime / this.stats.ticks : 0

    // Calculate percentiles
    const sorted = [...this.timestamps].sort((a, b) => a - b)
    const p50 = sorted[Math.floor(sorted.length * 0.5)] || 0
    const p95 = sorted[Math.floor(sorted.length * 0.95)] || 0
    const p99 = sorted[Math.floor(sorted.length * 0.99)] || 0

    return {
      ticks: this.stats.ticks,
      totalTime: this.stats.totalTime.toFixed(2) + 'ms',
      avgTime: avgTime.toFixed(4) + 'ms',
      ticksPerSecond: this.stats.ticks > 0 ? Math.floor(1000 / avgTime) : 0,
      percentiles: {
        p50: p50.toFixed(4) + 'ms',
        p95: p95.toFixed(4) + 'ms',
        p99: p99.toFixed(4) + 'ms',
      },
      modes: {
        jit: ((this.stats.jitTime / this.stats.totalTime) * 100).toFixed(1) + '%',
        layered: ((this.stats.layeredTime / this.stats.totalTime) * 100).toFixed(1) + '%',
        direct: ((this.stats.directTime / this.stats.totalTime) * 100).toFixed(1) + '%',
      }
    }
  }

  /**
   * Get a beautiful formatted report
   */
  getReport() {
    const stats = this.getStats()
    const brain = this.brain

    const lines = []
    lines.push('═══════════════════════════════════════════')
    lines.push('  🔬 Brain Performance Profile')
    lines.push('═══════════════════════════════════════════')
    lines.push('')
    lines.push('📊 Network Info:')
    lines.push(`  Vertices:    ${Object.keys(brain.definitions.all).length}`)
    lines.push(`  Sensors:     ${Object.keys(brain.definitions.sensors).length}`)
    lines.push(`  Neurons:     ${Object.keys(brain.definitions.neurons).length}`)
    lines.push(`  Actions:     ${Object.keys(brain.definitions.actions).length}`)
    lines.push(`  Connections: ${Object.values(brain.definitions.all).reduce((sum, v) => sum + v.in.length, 0)}`)
    lines.push('')
    lines.push('⚡ Optimization Mode:')
    if (brain.useJIT) {
      lines.push(`  🚀 JIT (Just-In-Time compilation) - FASTEST!`)
    } else if (brain.useLayeredProcessing) {
      lines.push(`  📦 Layered (Batch processing)`)
    } else {
      lines.push(`  📍 Direct (Simple processing)`)
    }
    lines.push('')
    lines.push('⏱️  Performance Stats:')
    lines.push(`  Total ticks:     ${stats.ticks.toLocaleString()}`)
    lines.push(`  Total time:      ${stats.totalTime}`)
    lines.push(`  Avg per tick:    ${stats.avgTime}`)
    lines.push(`  Ticks/second:    ${stats.ticksPerSecond.toLocaleString()}`)
    lines.push('')
    lines.push('📈 Percentiles:')
    lines.push(`  50th (median):   ${stats.percentiles.p50}`)
    lines.push(`  95th:            ${stats.percentiles.p95}`)
    lines.push(`  99th:            ${stats.percentiles.p99}`)
    lines.push('')
    lines.push('🎯 Mode Usage:')
    lines.push(`  JIT:             ${stats.modes.jit}`)
    lines.push(`  Layered:         ${stats.modes.layered}`)
    lines.push(`  Direct:          ${stats.modes.direct}`)
    lines.push('')
    lines.push('💡 Recommendations:')

    const connections = Object.values(brain.definitions.all).reduce((sum, v) => sum + v.in.length, 0)

    if (!brain.useJIT && connections >= 5 && connections <= 200) {
      lines.push(`  ⚠️  Network size (${connections} conn) is suitable for JIT!`)
      lines.push(`  💡 Remove advanced features to enable JIT for max speed`)
    } else if (brain.useJIT) {
      lines.push(`  ✅ JIT is active - you're getting maximum performance!`)
    } else if (connections < 5) {
      lines.push(`  ℹ️  Network is very small (${connections} conn)`)
      lines.push(`  💡 Direct mode is optimal for tiny networks`)
    } else if (connections > 200) {
      lines.push(`  ℹ️  Network is large (${connections} conn)`)
      lines.push(`  💡 Layered mode is optimal for large networks`)
    }

    lines.push('')
    lines.push('═══════════════════════════════════════════')

    return lines.join('\n')
  }
}
