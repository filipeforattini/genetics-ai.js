import { sparkline, barChart, summaryTable } from '../../src/devtools/fitness-plot.js'

const history = [
  { generation: 0, populationSize: 10, best: 10, worst: 1, mean: 5, median: 5, stdDev: 1, timestamp: 1 },
  { generation: 1, populationSize: 10, best: 20, worst: 2, mean: 10, median: 10, stdDev: 2, timestamp: 2 },
  { generation: 2, populationSize: 10, best: 40, worst: 3, mean: 20, median: 20, stdDev: 3, timestamp: 3 },
  { generation: 3, populationSize: 10, best: 35, worst: 4, mean: 18, median: 17, stdDev: 3.5, timestamp: 4 }
]

describe('fitness-plot', () => {
  test('sparkline renders a single line with min/max label', () => {
    const out = sparkline(history)
    expect(out).toMatch(/best \[10\.00 → 40\.00\]/)
    // Spark characters
    expect(out).toMatch(/[▁▂▃▄▅▆▇█]{4}$/)
  })

  test('sparkline respects metric option', () => {
    expect(sparkline(history, { metric: 'mean' })).toMatch(/mean /)
  })

  test('sparkline handles empty history', () => {
    expect(sparkline([])).toBe('(no data)')
  })

  test('barChart produces one row per generation', () => {
    const out = barChart(history, { maxWidth: 10 })
    const lines = out.split('\n')
    expect(lines).toHaveLength(4)
    expect(lines[0]).toMatch(/Gen\s+0/)
    expect(lines[2]).toMatch(/40\.00$/)
  })

  test('summaryTable lists all metrics', () => {
    const out = summaryTable(history)
    expect(out).toContain('best')
    expect(out).toContain('mean')
    expect(out).toContain('worst')
    expect(out.split('\n')).toHaveLength(history.length + 1)
  })

  test('summaryTable handles empty history', () => {
    expect(summaryTable([])).toBe('(no data)')
  })
})
