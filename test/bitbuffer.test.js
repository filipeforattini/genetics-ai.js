import { BitBuffer } from '../src/bitbuffer.class.js'

describe('BitBuffer', () => {
  describe('constructor', () => {
    test('creates buffer with specified size', () => {
      const buffer = new BitBuffer(100)
      expect(buffer.bitLength).toBe(100)
      expect(buffer.position).toBe(0)
    })

    test('initializes buffer array', () => {
      const buffer = new BitBuffer(32)
      expect(buffer.buffer).toBeInstanceOf(Uint8Array)
      expect(buffer.buffer.length).toBe(4) // 32 bits = 4 bytes
    })
  })

  describe('writeBits and readBits', () => {
    test('writes and reads single bits', () => {
      const buffer = new BitBuffer(8)
      buffer.writeBits(1, 1)
      buffer.writeBits(0, 1)
      buffer.writeBits(1, 1)
      
      buffer.position = 0
      expect(buffer.readBits(1)).toBe(1)
      expect(buffer.readBits(1)).toBe(0)
      expect(buffer.readBits(1)).toBe(1)
    })

    test('writes and reads multiple bits', () => {
      const buffer = new BitBuffer(16)
      buffer.writeBits(0b1010, 4)
      buffer.writeBits(0b1111, 4)
      
      buffer.position = 0
      expect(buffer.readBits(4)).toBe(0b1010)
      expect(buffer.readBits(4)).toBe(0b1111)
    })

    test('writes and reads across byte boundaries', () => {
      const buffer = new BitBuffer(24)
      buffer.writeBits(0b11111111, 8)
      buffer.writeBits(0b10101010, 8)
      buffer.writeBits(0b01010101, 8)
      
      buffer.position = 0
      expect(buffer.readBits(8)).toBe(0b11111111)
      expect(buffer.readBits(8)).toBe(0b10101010)
      expect(buffer.readBits(8)).toBe(0b01010101)
    })

    test('handles large values', () => {
      const buffer = new BitBuffer(32)
      const largeValue = 0x12345678
      buffer.writeBits(largeValue, 32)
      
      buffer.position = 0
      expect(buffer.readBits(32)).toBe(largeValue)
    })
  })

  describe('setBit and getBit', () => {
    test('sets and gets individual bits', () => {
      const buffer = new BitBuffer(8)
      buffer.setBit(0, 1)
      buffer.setBit(1, 0)
      buffer.setBit(2, 1)
      buffer.setBit(3, 1)
      
      expect(buffer.getBit(0)).toBe(1)
      expect(buffer.getBit(1)).toBe(0)
      expect(buffer.getBit(2)).toBe(1)
      expect(buffer.getBit(3)).toBe(1)
    })
  })

  describe('fromBase32String', () => {
    test('converts base32 string to BitBuffer', () => {
      const buffer = BitBuffer.fromBase32String('ABC')
      expect(buffer.bitLength).toBe(15) // 3 chars * 5 bits
      
      // A = 10, B = 11, C = 12 in base32
      buffer.position = 0
      expect(buffer.readBits(5)).toBe(10)
      expect(buffer.readBits(5)).toBe(11)
      expect(buffer.readBits(5)).toBe(12)
    })
  })

  describe('toBase32String', () => {
    test('converts BitBuffer to base32 string', () => {
      const buffer = new BitBuffer(15)
      buffer.writeBits(10, 5) // A
      buffer.writeBits(11, 5) // B
      buffer.writeBits(12, 5) // C
      
      const str = buffer.toBase32String()
      expect(str).toBe('ABC')
    })
  })

  describe('edge cases', () => {
    test('handles zero-size buffer', () => {
      const buffer = new BitBuffer(0)
      expect(buffer.bitLength).toBe(0)
      expect(buffer.buffer.length).toBe(0)
    })

    test('handles non-aligned sizes', () => {
      const buffer = new BitBuffer(17) // Not divisible by 8
      buffer.writeBits(0b11111111111111111, 17)
      
      buffer.position = 0
      expect(buffer.readBits(17)).toBe(0b11111111111111111)
    })

    test('expands buffer when setting bits beyond current size', () => {
      const buffer = new BitBuffer(8)
      buffer.setBit(15, 1) // Beyond initial size
      
      expect(buffer.getBit(15)).toBe(1)
      expect(buffer.buffer.length).toBeGreaterThan(1)
    })
  })
})