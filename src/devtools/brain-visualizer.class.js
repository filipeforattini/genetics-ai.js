/**
 * Brain Visualizer - ASCII art visualization of neural networks
 *
 * Makes it SUPER EASY to understand your network's structure!
 *
 * Usage:
 * ```javascript
 * const brain = new Brain({ genome, sensors, actions })
 * const visualizer = new BrainVisualizer(brain)
 *
 * console.log(visualizer.draw())
 * console.log(visualizer.drawTopology())
 * console.log(visualizer.drawActivations())
 * ```
 */
export class BrainVisualizer {
  constructor(brain) {
    this.brain = brain
  }

  /**
   * Draw a complete ASCII visualization of the brain
   */
  draw() {
    const lines = []

    lines.push('╔═══════════════════════════════════════════╗')
    lines.push('║         🧠 Brain Visualization            ║')
    lines.push('╚═══════════════════════════════════════════╝')
    lines.push('')

    // Network structure
    lines.push(this.drawTopology())
    lines.push('')

    // Connection details
    lines.push(this.drawConnections())
    lines.push('')

    return lines.join('\n')
  }

  /**
   * Draw network topology (layers)
   */
  drawTopology() {
    const { sensors, neurons, actions } = this.brain.definitions
    const lines = []

    lines.push('📐 Network Topology:')
    lines.push('')

    const sensorCount = Object.keys(sensors).length
    const neuronCount = Object.keys(neurons).length
    const actionCount = Object.keys(actions).length

    // Draw layers
    const maxWidth = Math.max(sensorCount, neuronCount, actionCount)

    // Sensors layer
    lines.push(`  Sensors (${sensorCount}):`)
    lines.push(`    ${this._drawNodes(sensorCount, '🔵', maxWidth)}`)
    lines.push(`    ${this._drawConnectionLines(maxWidth)}`)

    // Neurons layer (if any)
    if (neuronCount > 0) {
      lines.push(`  Neurons (${neuronCount}):`)
      lines.push(`    ${this._drawNodes(neuronCount, '⚫', maxWidth)}`)
      lines.push(`    ${this._drawConnectionLines(maxWidth)}`)
    }

    // Actions layer
    lines.push(`  Actions (${actionCount}):`)
    lines.push(`    ${this._drawNodes(actionCount, '🔴', maxWidth)}`)

    lines.push('')
    lines.push(`  Total connections: ${this._countConnections()}`)

    return lines.join('\n')
  }

  /**
   * Draw connection details
   */
  drawConnections() {
    const lines = []
    lines.push('🔗 Strong Connections (weight > 1.0):')
    lines.push('')

    const strongConnections = []

    for (const [name, vertex] of Object.entries(this.brain.definitions.all)) {
      for (const conn of vertex.in) {
        if (Math.abs(conn.weight) > 1.0) {
          strongConnections.push({
            from: conn.vertex.name,
            to: name,
            weight: conn.weight
          })
        }
      }
    }

    if (strongConnections.length === 0) {
      lines.push('  (No strong connections found)')
    } else {
      // Sort by weight
      strongConnections.sort((a, b) => Math.abs(b.weight) - Math.abs(a.weight))

      for (const conn of strongConnections.slice(0, 10)) {  // Top 10
        const arrow = conn.weight > 0 ? '→' : '⤍'
        const weight = conn.weight.toFixed(2).padStart(5)
        lines.push(`  ${conn.from} ${arrow} ${conn.to}  [${weight}]`)
      }

      if (strongConnections.length > 10) {
        lines.push(`  ... and ${strongConnections.length - 10} more`)
      }
    }

    return lines.join('\n')
  }

  /**
   * Draw current activation values (requires tick first)
   */
  drawActivations() {
    const lines = []
    lines.push('⚡ Current Activations:')
    lines.push('')

    const { sensors, neurons, actions } = this.brain.definitions

    // Sensors
    lines.push('  Sensors:')
    for (const [id, vertex] of Object.entries(sensors)) {
      const rawValue = vertex.cache.value || 0
      const value = typeof rawValue === 'number' ? rawValue : 0
      const bar = this._drawBar(value)
      lines.push(`    ${vertex.name.padEnd(8)} ${bar} ${value.toFixed(3)}`)
    }

    // Neurons
    if (Object.keys(neurons).length > 0) {
      lines.push('')
      lines.push('  Neurons:')
      for (const [id, vertex] of Object.entries(neurons)) {
        const rawValue = vertex.cache.value || 0
        const value = typeof rawValue === 'number' ? rawValue : 0
        const bar = this._drawBar(value)
        lines.push(`    ${vertex.name.padEnd(8)} ${bar} ${value.toFixed(3)}`)
      }
    }

    // Actions
    lines.push('')
    lines.push('  Actions:')
    for (const [id, vertex] of Object.entries(actions)) {
      const rawValue = vertex.cache.value || 0
      const value = typeof rawValue === 'number' ? rawValue : 0
      const bar = this._drawBar(value)
      lines.push(`    ${vertex.name.padEnd(8)} ${bar} ${value.toFixed(3)}`)
    }

    return lines.join('\n')
  }

  /**
   * Helper: Draw nodes as ASCII art
   */
  _drawNodes(count, symbol, maxWidth) {
    if (count === 0) return '(none)'

    const spacing = maxWidth > 10 ? 1 : 2
    const nodes = Array(Math.min(count, 20)).fill(symbol)

    if (count > 20) {
      nodes.push('...')
    }

    return nodes.join(' '.repeat(spacing))
  }

  /**
   * Helper: Draw connection lines
   */
  _drawConnectionLines(width) {
    return '    ' + '|'.padStart(width * 2, ' ')
  }

  /**
   * Helper: Draw a value as a bar chart
   */
  _drawBar(value, maxWidth = 20) {
    const normalized = Math.max(-1, Math.min(1, value))
    const filled = Math.floor(Math.abs(normalized) * maxWidth)
    const empty = maxWidth - filled

    const bar = normalized >= 0
      ? '░'.repeat(empty) + '█'.repeat(filled)
      : '█'.repeat(filled) + '░'.repeat(empty)

    return `[${bar}]`
  }

  /**
   * Helper: Count total connections
   */
  _countConnections() {
    return Object.values(this.brain.definitions.all)
      .reduce((sum, v) => sum + v.in.length, 0)
  }

  /**
   * Export network as JSON for external visualization
   */
  toJSON() {
    const nodes = []
    const edges = []

    for (const [name, vertex] of Object.entries(this.brain.definitions.all)) {
      nodes.push({
        id: name,
        type: vertex.metadata.type,
        bias: vertex.metadata.bias || 0
      })

      for (const conn of vertex.in) {
        edges.push({
          from: conn.vertex.name,
          to: name,
          weight: conn.weight
        })
      }
    }

    return {
      nodes,
      edges,
      stats: {
        sensors: Object.keys(this.brain.definitions.sensors).length,
        neurons: Object.keys(this.brain.definitions.neurons).length,
        actions: Object.keys(this.brain.definitions.actions).length,
        connections: this._countConnections()
      }
    }
  }
}
