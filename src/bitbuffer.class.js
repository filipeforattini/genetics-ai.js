/**
 * BitBuffer - High-performance bit manipulation for genome encoding
 * Works directly with binary data instead of strings for maximum efficiency
 */
export class BitBuffer {
  constructor(sizeInBits = 0) {
    // Calculate bytes needed (round up)
    const bytesNeeded = Math.ceil(sizeInBits / 8)
    this.buffer = new Uint8Array(bytesNeeded)
    this.bitLength = sizeInBits
    this.position = 0
  }

  /**
   * Create from existing data
   */
  static from(data) {
    if (data instanceof Uint8Array) {
      const buffer = new BitBuffer(data.length * 8)
      buffer.buffer = data
      buffer.bitLength = data.length * 8
      return buffer
    }
    if (typeof data === 'string') {
      // Convert base32 string to bits
      return BitBuffer.fromBase32String(data)
    }
    if (data instanceof BitBuffer) {
      return data
    }
    return new BitBuffer()
  }

  /**
   * Convert base32 string to BitBuffer
   */
  static fromBase32String(str) {
    const buffer = new BitBuffer(str.length * 5)
    
    for (let i = 0; i < str.length; i++) {
      const value = parseInt(str[i], 32)
      buffer.writeBits(value, 5, i * 5)
    }
    
    buffer.bitLength = str.length * 5
    buffer.position = buffer.bitLength
    
    return buffer
  }

  /**
   * Write bits at specific position
   * @param {number} value - Value to write
   * @param {number} bits - Number of bits to write
   * @param {number} position - Bit position (optional)
   */
  writeBits(value, bits, position = null) {
    if (bits <= 0) return

    const pos = position !== null ? position : this.position
    this._ensureCapacity(pos + bits)

    // Ensure value only contains the requested number of bits
    if (bits > 32) {
      for (let i = 0; i < bits; i++) {
        const shift = bits - 1 - i
        const bit = Math.floor(value / Math.pow(2, shift)) % 2
        this.writeBits(bit, 1, pos + i)
      }

      const newLengthFallback = pos + bits
      if (newLengthFallback > this.bitLength) {
        this.bitLength = newLengthFallback
      }
      if (position === null) {
        this.position = newLengthFallback
      }
      return
    }

    if (bits === 32) {
      value = value >>> 0
    } else {
      const mask = (1 << bits) - 1
      value &= mask
    }

    let remaining = bits
    let bitPos = pos

    while (remaining > 0) {
      const byteIndex = bitPos >> 3
      const bitOffset = bitPos & 7
      const writable = Math.min(remaining, 8 - bitOffset)
      const shift = remaining - writable
      const chunkMask = (1 << writable) - 1
      const chunk = (value >> shift) & chunkMask
      const targetShift = 8 - bitOffset - writable
      const mask = chunkMask << targetShift

      this.buffer[byteIndex] = (this.buffer[byteIndex] & ~mask) | (chunk << targetShift)

      remaining -= writable
      bitPos += writable
    }

    const newLength = pos + bits
    if (newLength > this.bitLength) {
      this.bitLength = newLength
    } else if (position === null) {
      this.bitLength = newLength
    }
    
    if (position === null) {
      this.position = newLength
    }
  }

  /**
   * Read bits from specific position
   * @param {number} bits - Number of bits to read
   * @param {number} position - Bit position (optional)
   */
  readBits(bits, position = null) {
    if (bits <= 0) return 0

    const pos = position !== null ? position : this.position
    let value = 0

    let remaining = bits
    let bitPos = pos

    while (remaining > 0) {
      const byteIndex = bitPos >> 3
      if (byteIndex >= this.buffer.length) break

      const bitOffset = bitPos & 7
      const readable = Math.min(remaining, 8 - bitOffset)
      const targetShift = 8 - bitOffset - readable
      const chunkMask = (1 << readable) - 1
      const chunk = (this.buffer[byteIndex] >> targetShift) & chunkMask

      value = (value * (1 << readable)) + chunk

      remaining -= readable
      bitPos += readable
    }

    if (position === null) {
      this.position = pos + bits
    }

    return value
  }

  /**
   * Set individual bit
   */
  setBit(position, value) {
    const byteIndex = Math.floor(position / 8)
    const bitIndex = 7 - (position % 8)
    
    if (byteIndex >= this.buffer.length) {
      // Expand buffer if needed
      const newBuffer = new Uint8Array(byteIndex + 1)
      newBuffer.set(this.buffer)
      this.buffer = newBuffer
    }
    
    if (value) {
      this.buffer[byteIndex] |= (1 << bitIndex)
    } else {
      this.buffer[byteIndex] &= ~(1 << bitIndex)
    }
  }

  /**
   * Get individual bit
   */
  getBit(position) {
    const byteIndex = Math.floor(position / 8)
    const bitIndex = 7 - (position % 8)
    
    if (byteIndex >= this.buffer.length) return 0
    
    return (this.buffer[byteIndex] >> bitIndex) & 1
  }

  /**
   * Convert to base32 string
   */
  toBase32String() {
    let str = ''
    const totalBits = this.bitLength || (this.buffer.length * 8)
    
    for (let i = 0; i < totalBits; i += 5) {
      const remainingBits = Math.min(5, totalBits - i)
      const value = this.readBits(remainingBits, i)
      
      // Pad if less than 5 bits and mask to ensure valid base32
      const paddedValue = remainingBits < 5 ? (value << (5 - remainingBits)) & 0x1F : value
      str += paddedValue.toString(32).toUpperCase()
    }
    
    this.position = 0 // Reset position
    return str
  }

  /**
   * Clone the buffer
   */
  clone() {
    const newBuffer = new BitBuffer(this.buffer.length * 8)
    newBuffer.buffer = new Uint8Array(this.buffer)
    newBuffer.position = this.position
    newBuffer.bitLength = this.bitLength
    return newBuffer
  }

  /**
   * Get size in bytes
   */
  get byteLength() {
    return this.buffer.length
  }

  /**
   * Append another BitBuffer
   */
  append(other) {
    const otherBits = other.bitLength || (other.buffer.length * 8)
    if (otherBits === 0) return

    const startPosition = Math.max(this.position, this.bitLength)
    const requiredBits = startPosition + otherBits
    this._ensureCapacity(requiredBits)

    let copiedBits = 0

    if ((startPosition & 7) === 0) {
      const byteLength = Math.floor(otherBits / 8)
      if (byteLength > 0) {
        this.buffer.set(other.buffer.subarray(0, byteLength), startPosition >> 3)
        copiedBits = byteLength * 8
      }
      const remaining = otherBits - copiedBits
      if (remaining > 0) {
        const remainderValue = other.readBits(remaining, copiedBits)
        this.writeBits(remainderValue, remaining, startPosition + copiedBits)
        copiedBits = otherBits
      }
    } else {
      let offset = 0
      while (offset < otherBits) {
        const chunkSize = Math.min(32, otherBits - offset)
        const chunk = other.readBits(chunkSize, offset)
        this.writeBits(chunk, chunkSize, startPosition + offset)
        offset += chunkSize
      }
      copiedBits = otherBits
    }

    const newLength = startPosition + copiedBits
    this.bitLength = Math.max(this.bitLength, newLength)
    this.position = newLength
  }

  /**
   * Slice bits from start to end
   */
  slice(start, end) {
    const length = end - start
    const newBuffer = new BitBuffer(length)
    if (length <= 0) return newBuffer

    newBuffer._ensureCapacity(length)

    let offset = 0
    while (offset < length) {
      const chunkSize = Math.min(32, length - offset)
      const chunk = this.readBits(chunkSize, start + offset)
      newBuffer.writeBits(chunk, chunkSize, offset)
      offset += chunkSize
    }

    newBuffer.bitLength = length
    newBuffer.position = length
    return newBuffer
  }

  /**
   * Ensure the internal buffer can accommodate the requested number of bits
   * @param {number} bitsNeeded
   * @private
   */
  _ensureCapacity(bitsNeeded) {
    if (bitsNeeded <= this.buffer.length * 8) return

    const requiredBytes = Math.ceil(bitsNeeded / 8)
    const currentBytes = this.buffer.length
    const newSize = Math.max(requiredBytes, currentBytes ? currentBytes * 2 : requiredBytes)
    const newBuffer = new Uint8Array(newSize)
    if (currentBytes > 0) {
      newBuffer.set(this.buffer)
    }
    this.buffer = newBuffer
  }
}
