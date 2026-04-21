/**
 * ASCII fitness plots for Generation.history entries.
 * Zero dependencies — works in any terminal that can render Unicode.
 *
 * Usage:
 *   import { sparkline, barChart } from 'genetics-ai/devtools/fitness-plot'
 *   console.log(sparkline(gen.history))
 *   console.log(barChart(gen.history, { metric: 'mean', maxWidth: 40 }))
 */

const SPARK_BLOCKS = ['▁', '▂', '▃', '▄', '▅', '▆', '▇', '█']

function extractValues(history, metric) {
  const values = []
  for (const snap of history) {
    const v = snap?.[metric]
    if (Number.isFinite(v)) values.push(v)
  }
  return values
}

/**
 * Single-line sparkline. Great for embedding in log output every generation.
 */
export function sparkline(history, { metric = 'best', width = 80 } = {}) {
  const values = extractValues(history, metric).slice(-width)
  if (values.length === 0) return '(no data)'
  const min = Math.min(...values)
  const max = Math.max(...values)
  const range = max - min || 1
  const line = values
    .map(v => {
      const norm = (v - min) / range
      const idx = Math.min(SPARK_BLOCKS.length - 1, Math.floor(norm * SPARK_BLOCKS.length))
      return SPARK_BLOCKS[idx]
    })
    .join('')
  return `${metric} [${min.toFixed(2)} → ${max.toFixed(2)}] ${line}`
}

/**
 * Multi-line bar chart for deeper inspection. One line per generation.
 */
export function barChart(history, { metric = 'best', maxWidth = 40 } = {}) {
  const values = extractValues(history, metric)
  if (values.length === 0) return '(no data)'
  const max = Math.max(...values, 1)
  const rows = []
  for (const snap of history) {
    const v = snap?.[metric]
    if (!Number.isFinite(v)) continue
    const barLen = Math.max(0, Math.round((v / max) * maxWidth))
    const bar = '█'.repeat(barLen) + '·'.repeat(maxWidth - barLen)
    rows.push(`Gen ${String(snap.generation).padStart(4)} ${bar} ${v.toFixed(2)}`)
  }
  return rows.join('\n')
}

/**
 * Compact summary table covering best / mean / worst across all generations.
 */
export function summaryTable(history) {
  if (!history || history.length === 0) return '(no data)'
  const rows = ['gen  |  best        mean        worst']
  for (const s of history) {
    rows.push(
      `${String(s.generation).padStart(4)} | ` +
      `${s.best.toFixed(2).padStart(10)}  ${s.mean.toFixed(2).padStart(10)}  ${s.worst.toFixed(2).padStart(10)}`
    )
  }
  return rows.join('\n')
}
