import { md5 } from '../src/md5.js'

describe('md5', () => {
  test('generates consistent hash for same input', async () => {
    const input = 'test string'
    const hash1 = await md5(input)
    const hash2 = await md5(input)
    
    expect(hash1).toBe(hash2)
    expect(typeof hash1).toBe('string')
    expect(hash1.length).toBe(32) // MD5 hash is 32 hex characters
  })

  test('generates different hashes for different inputs', async () => {
    const hash1 = await md5('input1')
    const hash2 = await md5('input2')
    
    expect(hash1).not.toBe(hash2)
  })

  test('handles empty string', async () => {
    const hash = await md5('')
    
    expect(hash).toBe('d41d8cd98f00b204e9800998ecf8427e') // Known MD5 of empty string
  })

  test('handles special characters', async () => {
    const hash = await md5('!@#$%^&*()')
    
    expect(typeof hash).toBe('string')
    expect(hash.length).toBe(32)
  })

  test('handles unicode characters', async () => {
    const hash = await md5('😀🎉🚀')
    
    expect(typeof hash).toBe('string')
    expect(hash.length).toBe(32)
  })

  test('handles long strings', async () => {
    const longString = 'a'.repeat(10000)
    const hash = await md5(longString)
    
    expect(typeof hash).toBe('string')
    expect(hash.length).toBe(32)
  })

  test('returns lowercase hex string', async () => {
    const hash = await md5('test')
    
    expect(hash).toBe(hash.toLowerCase())
    expect(/^[a-f0-9]{32}$/.test(hash)).toBe(true)
  })

  test('handles numbers as input', async () => {
    const hash1 = await md5(String(123))
    const hash2 = await md5('123')
    
    expect(hash1).toBe(hash2) // Should convert number to string
  })

  test('handles null and undefined', async () => {
    const hashNull = await md5(String(null))
    const hashUndefined = await md5(String(undefined))
    
    expect(typeof hashNull).toBe('string')
    expect(typeof hashUndefined).toBe('string')
    expect(hashNull.length).toBe(32)
    expect(hashUndefined.length).toBe(32)
  })

  test('common test vectors', async () => {
    // Known MD5 test vectors
    expect(await md5('abc')).toBe('900150983cd24fb0d6963f7d28e17f72')
    expect(await md5('message digest')).toBe('f96b697d7cb7938d525a2f31aaf161d0')
    expect(await md5('abcdefghijklmnopqrstuvwxyz')).toBe('c3fcd3d76192e4007dfb496cca67e13b')
  })
})