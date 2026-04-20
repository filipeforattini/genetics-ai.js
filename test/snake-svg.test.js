import { framesToSVG } from '../docs/examples/games/snake-svg.js'

const sampleFrames = [
  { step: 0, foodEaten: 0, food: { x: 5, y: 5 }, snake: [{ x: 2, y: 2 }, { x: 2, y: 3 }] },
  { step: 1, foodEaten: 0, food: { x: 5, y: 5 }, snake: [{ x: 2, y: 1 }, { x: 2, y: 2 }] },
  { step: 2, foodEaten: 1, food: { x: 7, y: 3 }, snake: [{ x: 2, y: 0 }, { x: 2, y: 1 }, { x: 2, y: 2 }] }
]

describe('snake-svg framesToSVG', () => {
  test('produces self-contained SVG with animations', () => {
    const svg = framesToSVG(sampleFrames, { gridSize: 10, cellSize: 20 })
    expect(svg).toMatch(/<svg [^>]*xmlns="http:\/\/www\.w3\.org\/2000\/svg"/)
    expect(svg).toMatch(/<animate attributeName="points"/)
    expect(svg).toMatch(/<animate attributeName="cx"/)
    // Values list has one entry per frame (separated by ';')
    const polylineMatch = svg.match(/points"\s+values="([^"]*)"/)
    expect(polylineMatch).toBeTruthy()
    expect(polylineMatch[1].split(';')).toHaveLength(sampleFrames.length)
  })

  test('escapes special characters in title', () => {
    const svg = framesToSVG(sampleFrames, { title: 'A & B <replay>' })
    expect(svg).toContain('A &amp; B &lt;replay&gt;')
  })

  test('throws on empty frames', () => {
    expect(() => framesToSVG([])).toThrow(/non-empty/)
  })
})
