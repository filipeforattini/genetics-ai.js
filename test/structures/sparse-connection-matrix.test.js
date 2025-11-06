import { SparseConnectionMatrix } from '../../src/structures/sparse-connection-matrix.class.js'

describe('SparseConnectionMatrix', () => {
  describe('Construction', () => {
    test('should create matrix with default capacity', () => {
      const matrix = new SparseConnectionMatrix()

      expect(matrix.maxConnections).toBe(1000)
      expect(matrix.count).toBe(0)
      expect(matrix.sourceIds).toBeInstanceOf(Uint16Array)
      expect(matrix.targetIds).toBeInstanceOf(Uint16Array)
      expect(matrix.weights).toBeInstanceOf(Float32Array)
      expect(matrix.sourceTypes).toBeInstanceOf(Uint8Array)
      expect(matrix.targetTypes).toBeInstanceOf(Uint8Array)
    })

    test('should create matrix with custom capacity', () => {
      const matrix = new SparseConnectionMatrix(500)

      expect(matrix.maxConnections).toBe(500)
      expect(matrix.sourceIds.length).toBe(500)
      expect(matrix.targetIds.length).toBe(500)
      expect(matrix.weights.length).toBe(500)
    })

    test('should initialize statistics', () => {
      const matrix = new SparseConnectionMatrix()

      expect(matrix.stats.added).toBe(0)
      expect(matrix.stats.removed).toBe(0)
      expect(matrix.stats.compacted).toBe(0)
    })
  })

  describe('Add Connection', () => {
    test('should add connection correctly', () => {
      const matrix = new SparseConnectionMatrix(10)

      const idx = matrix.add(5, 10, 0.75, 0, 1)

      expect(idx).toBe(0)
      expect(matrix.count).toBe(1)
      expect(matrix.sourceIds[0]).toBe(5)
      expect(matrix.targetIds[0]).toBe(10)
      expect(matrix.weights[0]).toBeCloseTo(0.75, 2)
      expect(matrix.sourceTypes[0]).toBe(0)
      expect(matrix.targetTypes[0]).toBe(1)
      expect(matrix.stats.added).toBe(1)
    })

    test('should add multiple connections', () => {
      const matrix = new SparseConnectionMatrix(10)

      matrix.add(1, 2, 0.5)
      matrix.add(2, 3, 0.75)
      matrix.add(3, 4, 1.0)

      expect(matrix.count).toBe(3)
      expect(matrix.stats.added).toBe(3)
    })

    test('should throw error when matrix is full', () => {
      const matrix = new SparseConnectionMatrix(2)

      matrix.add(1, 2, 0.5)
      matrix.add(2, 3, 0.75)

      expect(() => {
        matrix.add(3, 4, 1.0)
      }).toThrow(/Connection matrix full/)
    })

    test('should return correct indices for sequential adds', () => {
      const matrix = new SparseConnectionMatrix(10)

      expect(matrix.add(1, 2, 0.5)).toBe(0)
      expect(matrix.add(2, 3, 0.75)).toBe(1)
      expect(matrix.add(3, 4, 1.0)).toBe(2)
    })
  })

  describe('Get Connection', () => {
    test('should get connection by index', () => {
      const matrix = new SparseConnectionMatrix(10)

      matrix.add(5, 10, 0.75, 0, 1)
      matrix.add(3, 8, 0.5, 1, 0)

      const conn0 = matrix.get(0)
      expect(conn0.sourceId).toBe(5)
      expect(conn0.targetId).toBe(10)
      expect(conn0.weight).toBeCloseTo(0.75, 2)
      expect(conn0.sourceType).toBe(0)
      expect(conn0.targetType).toBe(1)

      const conn1 = matrix.get(1)
      expect(conn1.sourceId).toBe(3)
      expect(conn1.targetId).toBe(8)
      expect(conn1.weight).toBeCloseTo(0.5, 2)
    })

    test('should return null for invalid index', () => {
      const matrix = new SparseConnectionMatrix(10)

      matrix.add(5, 10, 0.75)

      expect(matrix.get(-1)).toBeNull()
      expect(matrix.get(1)).toBeNull()
      expect(matrix.get(100)).toBeNull()
    })
  })

  describe('Update Weight', () => {
    test('should update weight at index', () => {
      const matrix = new SparseConnectionMatrix(10)

      const idx = matrix.add(5, 10, 0.75)
      matrix.updateWeight(idx, 0.9)

      expect(matrix.weights[idx]).toBeCloseTo(0.9, 2)
    })

    test('should not update invalid indices', () => {
      const matrix = new SparseConnectionMatrix(10)

      matrix.add(5, 10, 0.75)

      matrix.updateWeight(-1, 0.9)
      matrix.updateWeight(100, 0.9)

      expect(matrix.weights[0]).toBeCloseTo(0.75, 2)
    })
  })

  describe('Remove Connection', () => {
    test('should remove connection (swap with last)', () => {
      const matrix = new SparseConnectionMatrix(10)

      matrix.add(1, 2, 0.1)
      matrix.add(3, 4, 0.2)
      matrix.add(5, 6, 0.3)

      // Remove middle connection
      matrix.remove(1)

      expect(matrix.count).toBe(2)
      expect(matrix.stats.removed).toBe(1)

      // Index 1 should now have the last connection (5→6)
      expect(matrix.sourceIds[1]).toBe(5)
      expect(matrix.targetIds[1]).toBe(6)
      expect(matrix.weights[1]).toBeCloseTo(0.3, 2)
    })

    test('should handle removing last connection', () => {
      const matrix = new SparseConnectionMatrix(10)

      matrix.add(1, 2, 0.1)
      matrix.add(3, 4, 0.2)

      matrix.remove(1)

      expect(matrix.count).toBe(1)
      expect(matrix.sourceIds[0]).toBe(1)
      expect(matrix.targetIds[0]).toBe(2)
    })

    test('should handle removing only connection', () => {
      const matrix = new SparseConnectionMatrix(10)

      matrix.add(1, 2, 0.1)
      matrix.remove(0)

      expect(matrix.count).toBe(0)
    })

    test('should not remove invalid indices', () => {
      const matrix = new SparseConnectionMatrix(10)

      matrix.add(1, 2, 0.1)

      matrix.remove(-1)
      matrix.remove(10)

      expect(matrix.count).toBe(1)
      expect(matrix.stats.removed).toBe(0)
    })
  })

  describe('Find Connections', () => {
    let matrix

    beforeEach(() => {
      matrix = new SparseConnectionMatrix(20)
      // Create test network:
      // 1 → 5, 1 → 6, 2 → 5, 2 → 7, 3 → 8
      matrix.add(1, 5, 0.1)
      matrix.add(1, 6, 0.2)
      matrix.add(2, 5, 0.3)
      matrix.add(2, 7, 0.4)
      matrix.add(3, 8, 0.5)
    })

    test('should find connections by source', () => {
      const indices = matrix.findBySource(1)

      expect(indices.length).toBe(2)
      expect(matrix.targetIds[indices[0]]).toBe(5)
      expect(matrix.targetIds[indices[1]]).toBe(6)
    })

    test('should find connections by target', () => {
      const indices = matrix.findByTarget(5)

      expect(indices.length).toBe(2)
      expect(matrix.sourceIds[indices[0]]).toBe(1)
      expect(matrix.sourceIds[indices[1]]).toBe(2)
    })

    test('should find specific connection', () => {
      const idx = matrix.find(2, 7)

      expect(idx).toBeGreaterThanOrEqual(0)
      expect(matrix.sourceIds[idx]).toBe(2)
      expect(matrix.targetIds[idx]).toBe(7)
      expect(matrix.weights[idx]).toBeCloseTo(0.4, 2)
    })

    test('should return -1 for non-existent connection', () => {
      const idx = matrix.find(1, 8)

      expect(idx).toBe(-1)
    })

    test('should check if connection exists', () => {
      expect(matrix.has(1, 5)).toBe(true)
      expect(matrix.has(2, 7)).toBe(true)
      expect(matrix.has(1, 8)).toBe(false)
      expect(matrix.has(99, 99)).toBe(false)
    })
  })

  describe('Clear', () => {
    test('should clear all connections', () => {
      const matrix = new SparseConnectionMatrix(10)

      matrix.add(1, 2, 0.1)
      matrix.add(3, 4, 0.2)
      matrix.add(5, 6, 0.3)

      matrix.clear()

      expect(matrix.count).toBe(0)
    })

    test('should allow adding after clear', () => {
      const matrix = new SparseConnectionMatrix(10)

      matrix.add(1, 2, 0.1)
      matrix.clear()
      matrix.add(3, 4, 0.2)

      expect(matrix.count).toBe(1)
      expect(matrix.sourceIds[0]).toBe(3)
      expect(matrix.targetIds[0]).toBe(4)
    })
  })

  describe('Compact (Sort)', () => {
    test('should compact and sort by source', () => {
      const matrix = new SparseConnectionMatrix(10)

      // Add in random order
      matrix.add(5, 10, 0.5)
      matrix.add(2, 8, 0.2)
      matrix.add(1, 7, 0.1)
      matrix.add(5, 11, 0.6)
      matrix.add(2, 9, 0.3)

      matrix.compact()

      // Should be sorted by source (1, 2, 2, 5, 5)
      expect(matrix.sourceIds[0]).toBe(1)
      expect(matrix.sourceIds[1]).toBe(2)
      expect(matrix.sourceIds[2]).toBe(2)
      expect(matrix.sourceIds[3]).toBe(5)
      expect(matrix.sourceIds[4]).toBe(5)

      expect(matrix.stats.compacted).toBe(1)
    })

    test('should preserve connection data during compact', () => {
      const matrix = new SparseConnectionMatrix(10)

      matrix.add(5, 10, 0.5, 1, 0)
      matrix.add(2, 8, 0.2, 0, 1)

      matrix.compact()

      // Find 5→10 connection
      const idx = matrix.find(5, 10)
      expect(idx).toBeGreaterThanOrEqual(0)
      expect(matrix.weights[idx]).toBeCloseTo(0.5, 2)
      expect(matrix.sourceTypes[idx]).toBe(1)
      expect(matrix.targetTypes[idx]).toBe(0)
    })

    test('should handle empty matrix compact', () => {
      const matrix = new SparseConnectionMatrix(10)

      matrix.compact()

      expect(matrix.count).toBe(0)
      expect(matrix.stats.compacted).toBe(0)
    })

    test('should sort by target as secondary key', () => {
      const matrix = new SparseConnectionMatrix(10)

      // Same source, different targets
      matrix.add(5, 15, 0.5)
      matrix.add(5, 10, 0.5)
      matrix.add(5, 12, 0.5)

      matrix.compact()

      // Should be sorted: 5→10, 5→12, 5→15
      expect(matrix.targetIds[0]).toBe(10)
      expect(matrix.targetIds[1]).toBe(12)
      expect(matrix.targetIds[2]).toBe(15)
    })
  })

  describe('Memory Usage', () => {
    test('should calculate memory usage correctly', () => {
      const matrix = new SparseConnectionMatrix(1000)

      const usage = matrix.getMemoryUsage()

      expect(usage.sourceIds).toBe(2000)  // 1000 * 2
      expect(usage.targetIds).toBe(2000)
      expect(usage.weights).toBe(4000)    // 1000 * 4
      expect(usage.sourceTypes).toBe(1000)
      expect(usage.targetTypes).toBe(1000)
      expect(usage.total).toBe(10000)     // 2+2+4+1+1 = 10 bytes per connection
    })

    test('should calculate utilization correctly', () => {
      const matrix = new SparseConnectionMatrix(100)

      matrix.add(1, 2, 0.5)
      matrix.add(2, 3, 0.5)

      const usage = matrix.getMemoryUsage()

      expect(usage.utilizationPercent).toBe('2.00')
    })

    test('should calculate per-connection cost', () => {
      const matrix = new SparseConnectionMatrix(1000)

      const usage = matrix.getMemoryUsage()

      expect(usage.perConnection).toBe('10.00')  // 10 bytes/connection
    })
  })

  describe('Statistics', () => {
    test('should track statistics correctly', () => {
      const matrix = new SparseConnectionMatrix(10)

      matrix.add(1, 2, 0.5)
      matrix.add(2, 3, 0.5)
      matrix.add(3, 4, 0.5)
      matrix.remove(1)
      matrix.compact()

      const stats = matrix.getStats()

      expect(stats.added).toBe(3)
      expect(stats.removed).toBe(1)
      expect(stats.compacted).toBe(1)
      expect(stats.count).toBe(2)
      expect(stats.maxConnections).toBe(10)
      expect(parseFloat(stats.utilizationPercent)).toBeCloseTo(20, 1)
    })
  })

  describe('Iteration', () => {
    let matrix

    beforeEach(() => {
      matrix = new SparseConnectionMatrix(20)
      matrix.add(1, 5, 0.1, 0, 1)
      matrix.add(2, 6, 0.2, 1, 0)
      matrix.add(3, 7, 0.3, 0, 1)
    })

    test('should iterate all connections', () => {
      const connections = []
      for (const conn of matrix.iterConnections()) {
        connections.push(conn)
      }

      expect(connections.length).toBe(3)
      expect(connections[0].sourceId).toBe(1)
      expect(connections[1].sourceId).toBe(2)
      expect(connections[2].sourceId).toBe(3)
    })

    test('should iterate connections from source', () => {
      matrix.add(1, 8, 0.4)  // Another from source 1

      const connections = []
      for (const conn of matrix.iterConnectionsFrom(1)) {
        connections.push(conn)
      }

      expect(connections.length).toBe(2)
      expect(connections[0].targetId).toBe(5)
      expect(connections[1].targetId).toBe(8)
    })

    test('should iterate connections to target', () => {
      matrix.add(4, 5, 0.4)  // Another to target 5

      const connections = []
      for (const conn of matrix.iterConnectionsTo(5)) {
        connections.push(conn)
      }

      expect(connections.length).toBe(2)
      expect(connections[0].sourceId).toBe(1)
      expect(connections[1].sourceId).toBe(4)
    })

    test('should include index in iteration', () => {
      for (const conn of matrix.iterConnections()) {
        expect(conn.index).toBeGreaterThanOrEqual(0)
        expect(conn.index).toBeLessThan(matrix.count)
      }
    })
  })

  describe('Export/Import', () => {
    test('should export to JSON', () => {
      const matrix = new SparseConnectionMatrix(10)

      matrix.add(1, 5, 0.5, 0, 1)
      matrix.add(2, 6, 0.75, 1, 0)

      const json = matrix.toJSON()

      expect(json.count).toBe(2)
      expect(json.maxConnections).toBe(10)
      expect(json.connections.length).toBe(2)
      expect(json.connections[0].sourceId).toBe(1)
      expect(json.connections[0].targetId).toBe(5)
      expect(json.connections[0].weight).toBeCloseTo(0.5, 2)
    })

    test('should export empty matrix', () => {
      const matrix = new SparseConnectionMatrix(10)

      const json = matrix.toJSON()

      expect(json.count).toBe(0)
      expect(json.connections.length).toBe(0)
    })
  })

  describe('Clone', () => {
    test('should clone matrix correctly', () => {
      const matrix = new SparseConnectionMatrix(10)

      matrix.add(1, 5, 0.5, 0, 1)
      matrix.add(2, 6, 0.75, 1, 0)

      const clone = matrix.clone()

      expect(clone.maxConnections).toBe(matrix.maxConnections)
      expect(clone.count).toBe(matrix.count)

      // Verify connections
      expect(clone.sourceIds[0]).toBe(matrix.sourceIds[0])
      expect(clone.targetIds[0]).toBe(matrix.targetIds[0])
      expect(clone.weights[0]).toBe(matrix.weights[0])

      // Verify independence
      matrix.updateWeight(0, 0.9)
      expect(clone.weights[0]).toBeCloseTo(0.5, 2)
    })
  })

  describe('Resize', () => {
    test('should resize matrix correctly', () => {
      const matrix = new SparseConnectionMatrix(5)

      matrix.add(1, 2, 0.1)
      matrix.add(2, 3, 0.2)

      matrix.resize(10)

      expect(matrix.maxConnections).toBe(10)
      expect(matrix.count).toBe(2)
      expect(matrix.sourceIds.length).toBe(10)
      expect(matrix.targetIds.length).toBe(10)
      expect(matrix.weights.length).toBe(10)

      // Verify existing data preserved
      expect(matrix.sourceIds[0]).toBe(1)
      expect(matrix.targetIds[0]).toBe(2)
      expect(matrix.weights[0]).toBeCloseTo(0.1, 2)
    })

    test('should not shrink matrix', () => {
      const matrix = new SparseConnectionMatrix(10)

      matrix.add(1, 2, 0.1)

      matrix.resize(5)

      expect(matrix.maxConnections).toBe(10)
    })

    test('should allow adding after resize', () => {
      const matrix = new SparseConnectionMatrix(2)

      matrix.add(1, 2, 0.1)
      matrix.add(2, 3, 0.2)

      matrix.resize(5)
      matrix.add(3, 4, 0.3)

      expect(matrix.count).toBe(3)
      expect(matrix.sourceIds[2]).toBe(3)
    })
  })

  describe('Performance', () => {
    test('should handle large number of connections', () => {
      const matrix = new SparseConnectionMatrix(10000)

      const start = Date.now()

      for (let i = 0; i < 5000; i++) {
        matrix.add(i % 100, i % 200, Math.random())
      }

      const addTime = Date.now() - start

      expect(matrix.count).toBe(5000)
      expect(addTime).toBeLessThan(100)  // Should be very fast
    })

    test('should iterate large matrix efficiently', () => {
      const matrix = new SparseConnectionMatrix(10000)

      for (let i = 0; i < 5000; i++) {
        matrix.add(i % 100, i % 200, Math.random())
      }

      const start = Date.now()

      let count = 0
      for (const conn of matrix.iterConnections()) {
        count++
      }

      const iterTime = Date.now() - start

      expect(count).toBe(5000)
      expect(iterTime).toBeLessThan(50)  // Should be very fast
    })
  })
})
