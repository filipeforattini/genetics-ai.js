import {
  ValidationError,
  validateRange,
  validateRatio,
  validatePositiveInteger,
  validateClass,
  validateObject,
  validateArray,
  validateFunction,
  createHelpfulError
} from '../../src/utils/validation.js'
import { Individual } from '../../src/individual.class.js'

describe('validation utilities', () => {
  describe('ValidationError', () => {
    test('creates error with message', () => {
      const error = new ValidationError('Test error')

      expect(error).toBeInstanceOf(Error)
      expect(error.name).toBe('ValidationError')
      expect(error.message).toBe('Test error')
      expect(error.context).toEqual({})
    })

    test('creates error with context', () => {
      const context = { parameter: 'size', value: -1, expected: 'positive integer' }
      const error = new ValidationError('Invalid size', context)

      expect(error.message).toBe('Invalid size')
      expect(error.context).toEqual(context)
    })
  })

  describe('validateRange', () => {
    test('validates number within range', () => {
      expect(() => validateRange(5, 'value', 0, 10)).not.toThrow()
      expect(() => validateRange(0, 'value', 0, 10)).not.toThrow()
      expect(() => validateRange(10, 'value', 0, 10)).not.toThrow()
    })

    test('throws for value below min', () => {
      expect(() => validateRange(-1, 'value', 0, 10)).toThrow(ValidationError)
      expect(() => validateRange(-1, 'value', 0, 10)).toThrow('must be between 0 and 10')
    })

    test('throws for value above max', () => {
      expect(() => validateRange(11, 'value', 0, 10)).toThrow(ValidationError)
      expect(() => validateRange(11, 'value', 0, 10)).toThrow('must be between 0 and 10')
    })

    test('throws for non-number', () => {
      expect(() => validateRange('5', 'value', 0, 10)).toThrow('must be a number')
      expect(() => validateRange(null, 'value', 0, 10)).toThrow()
      expect(() => validateRange({}, 'value', 0, 10)).toThrow()
    })

    test('throws for NaN', () => {
      expect(() => validateRange(NaN, 'value', 0, 10)).toThrow('must be a number')
    })

    test('validates integers when required', () => {
      expect(() => validateRange(5, 'value', 0, 10, { integer: true })).not.toThrow()
      expect(() => validateRange(5.5, 'value', 0, 10, { integer: true })).toThrow('must be an integer')
    })

    test('handles optional values', () => {
      expect(() => validateRange(null, 'value', 0, 10, { required: false })).not.toThrow()
      expect(() => validateRange(undefined, 'value', 0, 10, { required: false })).not.toThrow()
    })

    test('throws for null/undefined when required', () => {
      expect(() => validateRange(null, 'value', 0, 10)).toThrow('is required')
      expect(() => validateRange(undefined, 'value', 0, 10)).toThrow('is required')
    })
  })

  describe('validateRatio', () => {
    test('validates ratios between 0 and 1', () => {
      expect(() => validateRatio(0, 'ratio')).not.toThrow()
      expect(() => validateRatio(0.5, 'ratio')).not.toThrow()
      expect(() => validateRatio(1, 'ratio')).not.toThrow()
    })

    test('throws for values outside 0-1', () => {
      expect(() => validateRatio(-0.1, 'ratio')).toThrow('must be between 0 and 1')
      expect(() => validateRatio(1.1, 'ratio')).toThrow('must be between 0 and 1')
    })

    test('handles optional ratios', () => {
      expect(() => validateRatio(null, 'ratio', { required: false })).not.toThrow()
      expect(() => validateRatio(undefined, 'ratio', { required: false })).not.toThrow()
    })
  })

  describe('validatePositiveInteger', () => {
    test('validates positive integers', () => {
      expect(() => validatePositiveInteger(1, 'count')).not.toThrow()
      expect(() => validatePositiveInteger(10, 'count')).not.toThrow()
      expect(() => validatePositiveInteger(1000, 'count')).not.toThrow()
    })

    test('throws for zero', () => {
      expect(() => validatePositiveInteger(0, 'count')).toThrow()
    })

    test('throws for negative integers', () => {
      expect(() => validatePositiveInteger(-1, 'count')).toThrow()
      expect(() => validatePositiveInteger(-100, 'count')).toThrow()
    })

    test('throws for non-integers', () => {
      expect(() => validatePositiveInteger(5.5, 'count')).toThrow('must be an integer')
      expect(() => validatePositiveInteger(1.1, 'count')).toThrow('must be an integer')
    })

    test('handles optional values', () => {
      expect(() => validatePositiveInteger(null, 'count', { required: false })).not.toThrow()
      expect(() => validatePositiveInteger(undefined, 'count', { required: false })).not.toThrow()
    })
  })

  describe('validateClass', () => {
    test('validates class constructor', () => {
      class TestClass {}

      expect(() => validateClass(TestClass, 'MyClass')).not.toThrow()
    })

    test('validates subclass', () => {
      class SubIndividual extends Individual {}

      expect(() => validateClass(SubIndividual, 'MyClass', Individual)).not.toThrow()
    })

    test('validates exact base class', () => {
      expect(() => validateClass(Individual, 'MyClass', Individual)).not.toThrow()
    })

    test('throws for non-function', () => {
      expect(() => validateClass({}, 'MyClass')).toThrow('must be a class constructor')
      expect(() => validateClass('string', 'MyClass')).toThrow('must be a class constructor')
      expect(() => validateClass(123, 'MyClass')).toThrow('must be a class constructor')
    })

    test('throws for non-subclass', () => {
      class OtherClass {}

      expect(() => validateClass(OtherClass, 'MyClass', Individual)).toThrow('must extend Individual')
    })

    test('throws for regular function (not class)', () => {
      function regularFunction() {}

      // Regular functions are still typeof 'function', so this passes the first check
      // But will fail baseClass check if specified
      expect(() => validateClass(regularFunction, 'MyClass', Individual)).toThrow()
    })
  })

  describe('validateObject', () => {
    test('validates objects', () => {
      expect(() => validateObject({}, 'options')).not.toThrow()
      expect(() => validateObject({ foo: 'bar' }, 'options')).not.toThrow()
    })

    test('throws for null by default', () => {
      expect(() => validateObject(null, 'options')).toThrow('cannot be null')
    })

    test('allows null when specified', () => {
      expect(() => validateObject(null, 'options', { allowNull: true })).not.toThrow()
    })

    test('throws for undefined when required', () => {
      expect(() => validateObject(undefined, 'options')).toThrow('is required')
    })

    test('handles optional objects', () => {
      expect(() => validateObject(undefined, 'options', { required: false })).not.toThrow()
    })

    test('throws for arrays', () => {
      expect(() => validateObject([], 'options')).toThrow('must be an object')
      expect(() => validateObject([1, 2, 3], 'options')).toThrow('must be an object')
    })

    test('throws for primitives', () => {
      expect(() => validateObject('string', 'options')).toThrow()
      expect(() => validateObject(123, 'options')).toThrow()
      expect(() => validateObject(true, 'options')).toThrow()
    })
  })

  describe('validateArray', () => {
    test('validates arrays', () => {
      expect(() => validateArray([], 'items')).not.toThrow()
      expect(() => validateArray([1, 2, 3], 'items')).not.toThrow()
    })

    test('throws for null when required', () => {
      expect(() => validateArray(null, 'items')).toThrow('is required')
    })

    test('throws for undefined when required', () => {
      expect(() => validateArray(undefined, 'items')).toThrow('is required')
    })

    test('handles optional arrays', () => {
      expect(() => validateArray(null, 'items', { required: false })).not.toThrow()
      expect(() => validateArray(undefined, 'items', { required: false })).not.toThrow()
    })

    test('throws for non-arrays', () => {
      expect(() => validateArray({}, 'items')).toThrow('must be an array')
      expect(() => validateArray('string', 'items')).toThrow('must be an array')
      expect(() => validateArray(123, 'items')).toThrow('must be an array')
    })

    test('validates minimum length', () => {
      expect(() => validateArray([1, 2, 3], 'items', { minLength: 3 })).not.toThrow()
      expect(() => validateArray([1, 2], 'items', { minLength: 3 })).toThrow('must have at least 3 elements')
    })

    test('validates maximum length', () => {
      expect(() => validateArray([1, 2], 'items', { maxLength: 3 })).not.toThrow()
      expect(() => validateArray([1, 2, 3, 4], 'items', { maxLength: 3 })).toThrow('must have at most 3 elements')
    })

    test('validates both min and max length', () => {
      expect(() => validateArray([1, 2, 3], 'items', { minLength: 2, maxLength: 4 })).not.toThrow()
      expect(() => validateArray([1], 'items', { minLength: 2, maxLength: 4 })).toThrow()
      expect(() => validateArray([1, 2, 3, 4, 5], 'items', { minLength: 2, maxLength: 4 })).toThrow()
    })
  })

  describe('validateFunction', () => {
    test('validates functions', () => {
      expect(() => validateFunction(() => {}, 'callback')).not.toThrow()
      expect(() => validateFunction(function() {}, 'callback')).not.toThrow()
      expect(() => validateFunction(async () => {}, 'callback')).not.toThrow()
    })

    test('throws for null when required', () => {
      expect(() => validateFunction(null, 'callback')).toThrow('is required')
    })

    test('throws for undefined when required', () => {
      expect(() => validateFunction(undefined, 'callback')).toThrow('is required')
    })

    test('handles optional functions', () => {
      expect(() => validateFunction(null, 'callback', { required: false })).not.toThrow()
      expect(() => validateFunction(undefined, 'callback', { required: false })).not.toThrow()
    })

    test('throws for non-functions', () => {
      expect(() => validateFunction({}, 'callback')).toThrow('must be a function')
      expect(() => validateFunction('string', 'callback')).toThrow('must be a function')
      expect(() => validateFunction(123, 'callback')).toThrow('must be a function')
      expect(() => validateFunction([], 'callback')).toThrow('must be a function')
    })
  })

  describe('createHelpfulError', () => {
    test('creates helpful error for fitness-not-implemented', () => {
      const message = createHelpfulError('fitness-not-implemented')

      expect(message).toContain('Individual class must implement fitness()')
      expect(message).toContain('Example:')
      expect(message).toContain('class MyCreature extends Individual')
    })

    test('creates helpful error for invalid-population-size', () => {
      const message = createHelpfulError('invalid-population-size', { value: -1 })

      expect(message).toContain('Population size must be a positive integer')
      expect(message).toContain('got: -1')
      expect(message).toContain('size: 100')
    })

    test('creates helpful error for invalid-ratio', () => {
      const message = createHelpfulError('invalid-ratio', { name: 'eliteRatio', value: 1.5 })

      expect(message).toContain('eliteRatio')
      expect(message).toContain('must be between 0 and 1')
      expect(message).toContain('got: 1.5')
      expect(message).toContain('eliteRatio: 0.05')
    })

    test('creates helpful error for no-individuals', () => {
      const message = createHelpfulError('no-individuals')

      expect(message).toContain('Population is empty')
      expect(message).toContain('fillRandom()')
      expect(message).toContain('Example:')
    })

    test('returns default message for unknown issue', () => {
      const message = createHelpfulError('unknown-issue')

      expect(message).toContain('Unknown error')
      expect(message).toContain('unknown-issue')
    })
  })

  describe('integration scenarios', () => {
    test('validates Generation options', () => {
      // Simulate Generation constructor validation
      const validateGenerationOptions = (options) => {
        validatePositiveInteger(options.size, 'size')
        validateRatio(options.eliteRatio, 'eliteRatio', { required: false })
        validateRatio(options.randomFillRatio, 'randomFillRatio', { required: false })
        validateClass(options.individualClass, 'individualClass', Individual)
      }

      // Valid options
      expect(() => validateGenerationOptions({
        size: 100,
        eliteRatio: 0.05,
        randomFillRatio: 0.1,
        individualClass: Individual
      })).not.toThrow()

      // Invalid size
      expect(() => validateGenerationOptions({
        size: -1,
        individualClass: Individual
      })).toThrow()

      // Invalid ratio
      expect(() => validateGenerationOptions({
        size: 100,
        eliteRatio: 1.5,
        individualClass: Individual
      })).toThrow()

      // Invalid class
      class NotIndividual {}
      expect(() => validateGenerationOptions({
        size: 100,
        individualClass: NotIndividual
      })).toThrow('must extend Individual')
    })

    test('validates HillClimbing options', () => {
      const validateHillClimbingOptions = (options) => {
        validatePositiveInteger(options.maxIterations, 'maxIterations')
        validateRatio(options.mutationStrength, 'mutationStrength')
        validatePositiveInteger(options.patience, 'patience')
      }

      // Valid options
      expect(() => validateHillClimbingOptions({
        maxIterations: 10,
        mutationStrength: 0.001,
        patience: 3
      })).not.toThrow()

      // Invalid maxIterations
      expect(() => validateHillClimbingOptions({
        maxIterations: -1,
        mutationStrength: 0.001,
        patience: 3
      })).toThrow()

      // Invalid mutationStrength
      expect(() => validateHillClimbingOptions({
        maxIterations: 10,
        mutationStrength: 2.0,
        patience: 3
      })).toThrow()
    })

    test('error contains useful context', () => {
      try {
        validateRange(150, 'population size', 1, 100)
      } catch (error) {
        expect(error).toBeInstanceOf(ValidationError)
        expect(error.context.parameter).toBe('population size')
        expect(error.context.value).toBe(150)
        expect(error.context.max).toBe(100)
      }
    })
  })
})
