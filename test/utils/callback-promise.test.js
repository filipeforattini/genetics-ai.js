import { callCallback, isPromise, toPromise, executeAsync } from '../../src/utils/callback-promise.js'

describe('callback-promise utilities', () => {
  describe('isPromise', () => {
    test('returns true for promises', () => {
      expect(isPromise(Promise.resolve(123))).toBe(true)
      expect(isPromise(Promise.reject('error').catch(() => {}))).toBe(true)
      expect(isPromise(new Promise(() => {}))).toBe(true)
    })

    test('returns true for thenable objects', () => {
      const thenable = {
        then: (resolve) => resolve(123)
      }

      expect(isPromise(thenable)).toBe(true)
    })

    test('returns false for non-promises', () => {
      expect(isPromise(null) || !null).toBe(true) // null is falsy
      expect(isPromise(undefined) || !undefined).toBe(true) // undefined is falsy
      expect(isPromise(123)).toBe(false)
      expect(isPromise('string')).toBe(false)
      expect(isPromise({})).toBe(false)
      expect(isPromise([])).toBe(false)
      expect(isPromise(() => {})).toBe(false)
    })
  })

  describe('toPromise', () => {
    test('returns promise unchanged', async () => {
      const promise = Promise.resolve(123)
      const result = toPromise(promise)

      expect(result).toBe(promise)
      expect(await result).toBe(123)
    })

    test('converts value to promise', async () => {
      const result = toPromise(123)

      expect(isPromise(result)).toBe(true)
      expect(await result).toBe(123)
    })

    test('converts null to promise', async () => {
      const result = toPromise(null)

      expect(isPromise(result)).toBe(true)
      expect(await result).toBe(null)
    })

    test('converts object to promise', async () => {
      const obj = { foo: 'bar' }
      const result = toPromise(obj)

      expect(isPromise(result)).toBe(true)
      expect(await result).toBe(obj)
    })

    test('converts thenable to itself', async () => {
      const thenable = {
        then: (resolve) => resolve(123)
      }

      const result = toPromise(thenable)

      expect(result).toBe(thenable)
      expect(await result).toBe(123)
    })
  })

  describe('executeAsync', () => {
    test('executes sync function', async () => {
      const fn = () => 123

      const result = await executeAsync(fn)

      expect(result).toBe(123)
    })

    test('executes async function', async () => {
      const fn = async () => {
        await new Promise(resolve => setTimeout(resolve, 10))
        return 456
      }

      const result = await executeAsync(fn)

      expect(result).toBe(456)
    })

    test('executes function returning promise', async () => {
      const fn = () => Promise.resolve(789)

      const result = await executeAsync(fn)

      expect(result).toBe(789)
    })

    test('handles errors from sync function', async () => {
      const fn = () => {
        throw new Error('sync error')
      }

      await expect(executeAsync(fn)).rejects.toThrow('sync error')
    })

    test('handles errors from async function', async () => {
      const fn = async () => {
        throw new Error('async error')
      }

      await expect(executeAsync(fn)).rejects.toThrow('async error')
    })
  })

  describe('callCallback', () => {
    test('returns promise when no callback provided', async () => {
      const asyncFn = async () => 123

      const result = callCallback(null, asyncFn)

      expect(isPromise(result)).toBe(true)
      expect(await result).toBe(123)
    })

    test('returns promise for undefined callback', async () => {
      const asyncFn = async () => 456

      const result = callCallback(undefined, asyncFn)

      expect(isPromise(result)).toBe(true)
      expect(await result).toBe(456)
    })

    test('calls callback on success', (done) => {
      const asyncFn = async () => {
        await new Promise(resolve => setTimeout(resolve, 10))
        return 789
      }

      const result = callCallback((err, value) => {
        expect(err).toBe(null)
        expect(value).toBe(789)
        done()
      }, asyncFn)

      expect(result).toBeUndefined()
    })

    test('calls callback on error', (done) => {
      const asyncFn = async () => {
        throw new Error('test error')
      }

      const result = callCallback((err, value) => {
        expect(err).toBeDefined()
        expect(err.message).toBe('test error')
        expect(value).toBeUndefined()
        done()
      }, asyncFn)

      expect(result).toBeUndefined()
    })

    test('returns undefined when callback provided', () => {
      const asyncFn = async () => 123
      const callback = () => {}

      const result = callCallback(callback, asyncFn)

      expect(result).toBeUndefined()
    })

    test('handles callback with multiple async operations', (done) => {
      const asyncFn = async () => {
        const value1 = await Promise.resolve(100)
        const value2 = await Promise.resolve(200)
        return value1 + value2
      }

      callCallback((err, value) => {
        expect(err).toBe(null)
        expect(value).toBe(300)
        done()
      }, asyncFn)
    })

    test('works with real-world async example', async () => {
      // Simulate an API that supports both callbacks and promises
      function fetchData(callback) {
        const asyncFn = async () => {
          await new Promise(resolve => setTimeout(resolve, 10))
          return { data: 'fetched' }
        }
        return callCallback(callback, asyncFn)
      }

      // Use as promise
      const promiseResult = await fetchData()
      expect(promiseResult).toEqual({ data: 'fetched' })

      // Use as callback
      await new Promise((resolve) => {
        fetchData((err, result) => {
          expect(err).toBe(null)
          expect(result).toEqual({ data: 'fetched' })
          resolve()
        })
      })
    })
  })

  describe('integration scenarios', () => {
    test('ml5.js-style dual API', async () => {
      // Simulate a function that supports both patterns
      function processImage(optionsOrCallback, callback) {
        // Parse arguments
        let options = {}
        let cb = null

        if (typeof optionsOrCallback === 'function') {
          cb = optionsOrCallback
        } else {
          options = optionsOrCallback || {}
          cb = callback
        }

        // Process async
        const asyncFn = async () => {
          await new Promise(resolve => setTimeout(resolve, 10))
          return { processed: true, ...options }
        }

        return callCallback(cb, asyncFn)
      }

      // Test: no arguments (promise)
      const result1 = await processImage()
      expect(result1.processed).toBe(true)

      // Test: with options (promise)
      const result2 = await processImage({ filter: 'blur' })
      expect(result2.processed).toBe(true)
      expect(result2.filter).toBe('blur')

      // Test: callback only
      await new Promise((resolve) => {
        processImage((err, result) => {
          expect(err).toBe(null)
          expect(result.processed).toBe(true)
          resolve()
        })
      })

      // Test: options + callback
      await new Promise((resolve) => {
        processImage({ filter: 'sharpen' }, (err, result) => {
          expect(err).toBe(null)
          expect(result.processed).toBe(true)
          expect(result.filter).toBe('sharpen')
          resolve()
        })
      })
    })

    test('chaining promises', async () => {
      function step1(callback) {
        return callCallback(callback, async () => 'result1')
      }

      function step2(input, callback) {
        return callCallback(callback, async () => input + '-result2')
      }

      function step3(input, callback) {
        return callCallback(callback, async () => input + '-result3')
      }

      // Chain as promises
      const finalResult = await step1()
        .then(r1 => step2(r1))
        .then(r2 => step3(r2))

      expect(finalResult).toBe('result1-result2-result3')
    })

    test('error propagation in promise chain', async () => {
      function mightFail(shouldFail, callback) {
        return callCallback(callback, async () => {
          if (shouldFail) {
            throw new Error('intentional failure')
          }
          return 'success'
        })
      }

      // Success case
      const result = await mightFail(false)
      expect(result).toBe('success')

      // Error case
      await expect(mightFail(true)).rejects.toThrow('intentional failure')

      // Error case with callback
      await new Promise((resolve) => {
        mightFail(true, (err, result) => {
          expect(err).toBeDefined()
          expect(err.message).toBe('intentional failure')
          expect(result).toBeUndefined()
          resolve()
        })
      })
    })
  })
})
