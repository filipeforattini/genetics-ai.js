import { VertexPool } from '../../src/pools/vertex-pool.class.js'

describe('VertexPool', () => {
  test('acquire and release update stats and reuse vertices', () => {
    const pool = new VertexPool(2)
    const v1 = pool.acquire()
    expect(v1._inUse).toBe(true)
    const v2 = pool.acquire()
    expect(() => pool.acquire()).toThrow(/exhausted/)

    pool.release(v1)
    expect(v1._inUse).toBe(false)

    const reused = pool.acquire()
    expect(reused).toBe(v1)

    pool.releaseAll([reused, v2])
    const stats = pool.getStats()
    expect(Number(stats.utilizationPercent)).toBeCloseTo(0)
    expect(pool.hasCapacity()).toBe(true)
  })

  test('expand and compact adjust pool size', () => {
    const pool = new VertexPool(2)
    pool.expand(3)
    expect(pool.maxSize).toBe(5)
    expect(pool.hasCapacity(5)).toBe(true)

    const acquired = [pool.acquire(), pool.acquire()]
    pool.compact()

    expect(pool.maxSize).toBeGreaterThanOrEqual(acquired.length * 2)
    acquired.forEach(v => pool.release(v))
    expect(pool.getUtilization()).toBe(0)
  })
})
