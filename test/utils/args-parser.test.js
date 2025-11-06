import { isPlainObject, parseArgs, parseMethodArgs, parseConstructorArgs } from '../../src/utils/args-parser.js'

describe('args-parser utilities', () => {
  describe('isPlainObject', () => {
    test('returns true for plain objects', () => {
      expect(isPlainObject({})).toBe(true)
      expect(isPlainObject({ foo: 'bar' })).toBe(true)
      expect(isPlainObject({ nested: { value: 1 } })).toBe(true)
    })

    test('returns false for non-plain objects', () => {
      expect(isPlainObject(null)).toBe(false)
      expect(isPlainObject(undefined)).toBe(false)
      expect(isPlainObject([])).toBe(false)
      expect(isPlainObject([1, 2, 3])).toBe(false)
      expect(isPlainObject(() => {})).toBe(false)
      expect(isPlainObject('string')).toBe(false)
      expect(isPlainObject(123)).toBe(false)
      expect(isPlainObject(new Date())).toBe(false)
      expect(isPlainObject(new Map())).toBe(false)
    })
  })

  describe('parseArgs', () => {
    test('parses no arguments with defaults', () => {
      function testFn() {
        return parseArgs(arguments, {
          defaults: { foo: 'bar', baz: 123 }
        })
      }

      const result = testFn()

      expect(result.options).toEqual({ foo: 'bar', baz: 123 })
      expect(result.callback).toBe(null)
    })

    test('parses callback only', () => {
      function testFn(callback) {
        return parseArgs(arguments, {
          defaults: { foo: 'bar' }
        })
      }

      const cb = () => {}
      const result = testFn(cb)

      expect(result.options).toEqual({ foo: 'bar' })
      expect(result.callback).toBe(cb)
    })

    test('parses options only', () => {
      function testFn(options) {
        return parseArgs(arguments, {
          defaults: { foo: 'bar', baz: 123 }
        })
      }

      const result = testFn({ foo: 'custom', extra: 'value' })

      expect(result.options).toEqual({ foo: 'custom', baz: 123, extra: 'value' })
      expect(result.callback).toBe(null)
    })

    test('parses options and callback', () => {
      function testFn(options, callback) {
        return parseArgs(arguments, {
          defaults: { foo: 'bar' }
        })
      }

      const cb = () => {}
      const result = testFn({ foo: 'custom' }, cb)

      expect(result.options).toEqual({ foo: 'custom' })
      expect(result.callback).toBe(cb)
    })

    test('handles callback in first position', () => {
      function testFn(callback) {
        return parseArgs(arguments, {
          defaults: { foo: 'bar' },
          callbackPositions: [0, 1]
        })
      }

      const cb = () => {}
      const result = testFn(cb)

      expect(result.callback).toBe(cb)
      expect(result.options).toEqual({ foo: 'bar' })
    })

    test('handles custom options positions', () => {
      function testFn(arg1, arg2) {
        return parseArgs(arguments, {
          defaults: { foo: 'bar' },
          optionsPositions: [1]
        })
      }

      const result = testFn('ignored', { foo: 'custom' })

      expect(result.options).toEqual({ foo: 'custom' })
    })

    test('preserves defaults when options not provided', () => {
      function testFn(callback) {
        return parseArgs(arguments, {
          defaults: { foo: 'bar', nested: { value: 1 } }
        })
      }

      const result = testFn(() => {})

      expect(result.options.foo).toBe('bar')
      expect(result.options.nested).toEqual({ value: 1 })
    })

    test('merges options with defaults', () => {
      function testFn(options) {
        return parseArgs(arguments, {
          defaults: { a: 1, b: 2, c: 3 }
        })
      }

      const result = testFn({ b: 20, d: 40 })

      expect(result.options).toEqual({ a: 1, b: 20, c: 3, d: 40 })
    })

    test('handles array-like arguments', () => {
      const argsArray = [{ foo: 'bar' }, () => {}]

      const result = parseArgs(argsArray, {
        defaults: { baz: 'qux' }
      })

      expect(result.options).toEqual({ foo: 'bar', baz: 'qux' })
      expect(typeof result.callback).toBe('function')
    })
  })

  describe('parseMethodArgs', () => {
    test('parses method with no arguments', () => {
      function method() {
        return parseMethodArgs(arguments, { foo: 'default' })
      }

      const result = method()

      expect(result.options).toEqual({ foo: 'default' })
      expect(result.callback).toBe(null)
    })

    test('parses method with callback', () => {
      function method(callback) {
        return parseMethodArgs(arguments, { foo: 'default' })
      }

      const cb = () => {}
      const result = method(cb)

      expect(result.options).toEqual({ foo: 'default' })
      expect(result.callback).toBe(cb)
    })

    test('parses method with options', () => {
      function method(options) {
        return parseMethodArgs(arguments, { foo: 'default' })
      }

      const result = method({ foo: 'custom', bar: 'baz' })

      expect(result.options).toEqual({ foo: 'custom', bar: 'baz' })
      expect(result.callback).toBe(null)
    })

    test('parses method with options and callback', () => {
      function method(options, callback) {
        return parseMethodArgs(arguments, { foo: 'default' })
      }

      const cb = () => {}
      const result = method({ foo: 'custom' }, cb)

      expect(result.options).toEqual({ foo: 'custom' })
      expect(result.callback).toBe(cb)
    })

    test('works with empty defaults', () => {
      function method(options) {
        return parseMethodArgs(arguments, {})
      }

      const result = method({ custom: 'value' })

      expect(result.options).toEqual({ custom: 'value' })
    })

    test('works without defaults parameter', () => {
      function method(options) {
        return parseMethodArgs(arguments)
      }

      const result = method({ custom: 'value' })

      expect(result.options).toEqual({ custom: 'value' })
    })
  })

  describe('parseConstructorArgs', () => {
    test('parses single options object', () => {
      const result = parseConstructorArgs([{ foo: 'bar', baz: 123 }])

      expect(result).toEqual({ foo: 'bar', baz: 123 })
    })

    test('returns first argument if not plain object', () => {
      const result = parseConstructorArgs([100])

      expect(result).toBe(100)
    })

    test('uses positional parser when provided', () => {
      const positionalParser = (args) => {
        return {
          size: args[0],
          type: args[1],
          options: args[2] || {}
        }
      }

      const result = parseConstructorArgs(
        [100, 'type1', { extra: 'value' }],
        { positionalParser }
      )

      expect(result).toEqual({
        size: 100,
        type: 'type1',
        options: { extra: 'value' }
      })
    })

    test('handles empty arguments', () => {
      const result = parseConstructorArgs([])

      expect(result).toBeUndefined()
    })

    test('handles multiple non-object arguments', () => {
      const result = parseConstructorArgs([100, 'string', true])

      expect(result).toBe(100)
    })

    test('distinguishes between plain object and class instance', () => {
      class MyClass {
        constructor() {
          this.value = 'instance'
        }
      }

      const plainObject = { value: 'plain' }
      const classInstance = new MyClass()

      const result1 = parseConstructorArgs([plainObject])
      const result2 = parseConstructorArgs([classInstance])

      expect(result1).toEqual(plainObject)
      expect(result2).toBe(classInstance) // Not treated as options
    })
  })

  describe('integration scenarios', () => {
    test('handles real-world async method pattern', () => {
      function asyncMethod() {
        return parseMethodArgs(arguments, {
          parallel: true,
          timeout: 5000,
          onProgress: null
        })
      }

      // Call with no args
      let result = asyncMethod()
      expect(result.options.parallel).toBe(true)
      expect(result.callback).toBe(null)

      // Call with callback only
      const cb = () => {}
      result = asyncMethod(cb)
      expect(result.options.parallel).toBe(true)
      expect(result.callback).toBe(cb)

      // Call with options only
      result = asyncMethod({ parallel: false, timeout: 10000 })
      expect(result.options.parallel).toBe(false)
      expect(result.options.timeout).toBe(10000)
      expect(result.callback).toBe(null)

      // Call with options and callback
      result = asyncMethod({ parallel: false }, cb)
      expect(result.options.parallel).toBe(false)
      expect(result.callback).toBe(cb)
    })

    test('handles constructor with various patterns', () => {
      class TestClass {
        constructor() {
          const args = parseConstructorArgs(arguments, {
            positionalParser: (args) => {
              if (args.length === 1 && typeof args[0] === 'number') {
                return { size: args[0] }
              }
              if (args.length === 2) {
                return { size: args[0], type: args[1] }
              }
              return args[0]
            }
          })
          this.config = args
        }
      }

      // new TestClass({ foo: 'bar' })
      let instance = new TestClass({ foo: 'bar' })
      expect(instance.config).toEqual({ foo: 'bar' })

      // new TestClass(100)
      instance = new TestClass(100)
      expect(instance.config).toEqual({ size: 100 })

      // new TestClass(100, 'type1')
      instance = new TestClass(100, 'type1')
      expect(instance.config).toEqual({ size: 100, type: 'type1' })
    })
  })
})
