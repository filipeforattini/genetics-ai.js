/**
 * Minimal animated-SVG renderer for a Snake game replay.
 * Zero dependencies. Produces a single self-contained .svg file that
 * plays in any browser, Markdown preview, or README.
 *
 * Frame shape: { snake: [{x, y}, ...], food: {x, y}, step: N, foodEaten: N }
 * The snake head is frame.snake[0].
 */

const ESC = { '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;' }
const escape = s => String(s).replace(/[&<>"]/g, c => ESC[c])

export function framesToSVG(frames, options = {}) {
  const {
    gridSize = 10,
    cellSize = 28,
    bg = '#0f1117',
    gridColor = '#1f2430',
    snakeColor = '#4ade80',
    headColor = '#22c55e',
    foodColor = '#ef4444',
    fps = 10,
    loop = true,
    title = 'Snake replay'
  } = options

  if (!Array.isArray(frames) || frames.length === 0) {
    throw new Error('framesToSVG: frames must be a non-empty array')
  }

  const size = gridSize * cellSize
  const duration = (frames.length / fps).toFixed(2) + 's'
  const repeat = loop ? 'indefinite' : '1'

  const cellCenter = (v) => v * cellSize + cellSize / 2

  // Snake as polyline: points string per frame
  const snakePointValues = frames
    .map(f => f.snake.map(seg => `${cellCenter(seg.x)},${cellCenter(seg.y)}`).join(' '))
    .join(';')

  const headCxValues = frames.map(f => cellCenter(f.snake[0].x)).join(';')
  const headCyValues = frames.map(f => cellCenter(f.snake[0].y)).join(';')

  const foodCxValues = frames.map(f => cellCenter(f.food.x)).join(';')
  const foodCyValues = frames.map(f => cellCenter(f.food.y)).join(';')

  const stepValues = frames.map(f => `step ${f.step}  •  food ${f.foodEaten}`).join(';')

  // Grid lines
  const gridLines = []
  for (let i = 0; i <= gridSize; i++) {
    const p = i * cellSize
    gridLines.push(`<line x1="${p}" y1="0" x2="${p}" y2="${size}" stroke="${gridColor}" stroke-width="1"/>`)
    gridLines.push(`<line x1="0" y1="${p}" x2="${size}" y2="${p}" stroke="${gridColor}" stroke-width="1"/>`)
  }

  return `<?xml version="1.0" encoding="UTF-8"?>
<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 ${size} ${size + 28}" width="${size}" height="${size + 28}">
  <title>${escape(title)}</title>
  <rect width="100%" height="100%" fill="${bg}"/>
  <g>${gridLines.join('')}</g>

  <polyline fill="none" stroke="${snakeColor}" stroke-width="${cellSize * 0.7}" stroke-linejoin="round" stroke-linecap="round">
    <animate attributeName="points" values="${snakePointValues}" dur="${duration}" calcMode="discrete" repeatCount="${repeat}"/>
  </polyline>

  <circle r="${cellSize * 0.45}" fill="${headColor}">
    <animate attributeName="cx" values="${headCxValues}" dur="${duration}" calcMode="discrete" repeatCount="${repeat}"/>
    <animate attributeName="cy" values="${headCyValues}" dur="${duration}" calcMode="discrete" repeatCount="${repeat}"/>
  </circle>

  <circle r="${cellSize * 0.35}" fill="${foodColor}">
    <animate attributeName="cx" values="${foodCxValues}" dur="${duration}" calcMode="discrete" repeatCount="${repeat}"/>
    <animate attributeName="cy" values="${foodCyValues}" dur="${duration}" calcMode="discrete" repeatCount="${repeat}"/>
  </circle>

  <text x="8" y="${size + 20}" fill="#cbd5e1" font-family="monospace" font-size="14">
    <animate attributeName="textContent" values="${escape(stepValues)}" dur="${duration}" calcMode="discrete" repeatCount="${repeat}"/>
  </text>
</svg>
`
}

/**
 * Convenience: run a game and collect frames.
 * Drives any object that exposes `reset()`, `move()`, `super.tick()` or
 * `tick()`, plus `snake`/`food`/`steps`/`foodEaten`/`alive`.
 */
export function recordGame(snake, { maxSteps = 500 } = {}) {
  if (typeof snake.reset === 'function') snake.reset()
  const frames = []
  const snapshot = () => ({
    step: snake.steps ?? 0,
    foodEaten: snake.foodEaten ?? 0,
    food: { x: snake.food.x, y: snake.food.y },
    snake: snake.snake.map(seg => ({ x: seg.x, y: seg.y }))
  })
  frames.push(snapshot())
  while (snake.alive && snake.steps < maxSteps) {
    if (typeof snake.tick === 'function') snake.tick()
    if (typeof snake.move === 'function') snake.move()
    snake.steps = (snake.steps ?? 0) + 1
    frames.push(snapshot())
  }
  return frames
}
