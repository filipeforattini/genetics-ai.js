import { TypedArrayPool } from '../../src/pools/typed-array-pool.class.js'

describe('TypedArrayPool', () => {
  test('reuses typed arrays and tracks statistics', () => {
    const pool = new TypedArrayPool({
      initialFloat32: 0,
      initialUint8: 0,
      initialUint16: 0,
      maxPoolSize: 1
    })

    const arr = pool.allocFloat32(4)
    expect(arr).toBeInstanceOf(Float32Array)
    pool.free(arr)

    const reused = pool.allocFloat32(4)
    expect(reused).toBe(arr)

    const stats = pool.getStats()
    expect(stats.float32Allocated).toBe(1)
    expect(stats.float32Reused).toBe(1)

    const usage = pool.getMemoryUsage()
    expect(usage.total).toBeGreaterThanOrEqual(0)
  })

  test('compact and clear maintain pool integrity', () => {
    const pool = new TypedArrayPool({ initialFloat32: 0, initialUint8: 0, initialUint16: 0 })
    pool.free(new Float32Array(8))
    pool.free(new Float32Array(8))
    pool.free(new Uint8Array(16))

    pool.compact()
    expect(pool.float32Pool.length).toBe(1)
    expect(pool.uint8Pool.length).toBe(1)

    pool.clear()
    expect(pool.float32Pool.length).toBe(0)
    expect(pool.getStats().totalAllocated).toBe(0)
  })
})
