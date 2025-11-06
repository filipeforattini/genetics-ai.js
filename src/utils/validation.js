/**
 * Validation utilities for genetics-ai.js
 *
 * Provides helpful error messages and input validation
 */

/**
 * Custom error class with helpful context
 */
export class ValidationError extends Error {
  constructor(message, context = {}) {
    super(message)
    this.name = 'ValidationError'
    this.context = context
  }
}

/**
 * Validate a number is within a range
 *
 * @param {number} value - Value to validate
 * @param {string} name - Parameter name
 * @param {number} min - Minimum value (inclusive)
 * @param {number} max - Maximum value (inclusive)
 * @param {Object} options - Options
 * @throws {ValidationError}
 */
export function validateRange(value, name, min, max, options = {}) {
  const { required = true, integer = false } = options

  if (value === null || value === undefined) {
    if (required) {
      throw new ValidationError(
        `${name} is required`,
        { parameter: name, value, expected: `number between ${min} and ${max}` }
      )
    }
    return
  }

  if (typeof value !== 'number' || isNaN(value)) {
    throw new ValidationError(
      `${name} must be a number, got ${typeof value}`,
      { parameter: name, value, expected: 'number' }
    )
  }

  if (integer && !Number.isInteger(value)) {
    throw new ValidationError(
      `${name} must be an integer, got ${value}`,
      { parameter: name, value, expected: 'integer' }
    )
  }

  if (value < min || value > max) {
    throw new ValidationError(
      `${name} must be between ${min} and ${max}, got ${value}`,
      { parameter: name, value, min, max }
    )
  }
}

/**
 * Validate a ratio (0 to 1)
 *
 * @param {number} value - Value to validate
 * @param {string} name - Parameter name
 * @param {Object} options - Options
 * @throws {ValidationError}
 */
export function validateRatio(value, name, options = {}) {
  validateRange(value, name, 0, 1, options)
}

/**
 * Validate a positive integer
 *
 * @param {number} value - Value to validate
 * @param {string} name - Parameter name
 * @param {Object} options - Options
 * @throws {ValidationError}
 */
export function validatePositiveInteger(value, name, options = {}) {
  validateRange(value, name, 1, Number.MAX_SAFE_INTEGER, {
    ...options,
    integer: true
  })
}

/**
 * Validate a class constructor
 *
 * @param {Function} value - Class to validate
 * @param {string} name - Parameter name
 * @param {Function} baseClass - Expected base class
 * @throws {ValidationError}
 */
export function validateClass(value, name, baseClass = null) {
  if (typeof value !== 'function') {
    throw new ValidationError(
      `${name} must be a class constructor, got ${typeof value}`,
      { parameter: name, value, expected: 'class constructor' }
    )
  }

  if (baseClass && !(value.prototype instanceof baseClass) && value !== baseClass) {
    throw new ValidationError(
      `${name} must extend ${baseClass.name}`,
      { parameter: name, value: value.name, expected: `subclass of ${baseClass.name}` }
    )
  }
}

/**
 * Validate an object
 *
 * @param {Object} value - Object to validate
 * @param {string} name - Parameter name
 * @param {Object} options - Options
 * @throws {ValidationError}
 */
export function validateObject(value, name, options = {}) {
  const { required = true, allowNull = false } = options

  if (value === null) {
    if (allowNull) return
    if (required) {
      throw new ValidationError(
        `${name} cannot be null`,
        { parameter: name, value, expected: 'object' }
      )
    }
    return
  }

  if (value === undefined) {
    if (required) {
      throw new ValidationError(
        `${name} is required`,
        { parameter: name, value, expected: 'object' }
      )
    }
    return
  }

  if (typeof value !== 'object' || Array.isArray(value)) {
    throw new ValidationError(
      `${name} must be an object, got ${Array.isArray(value) ? 'array' : typeof value}`,
      { parameter: name, value, expected: 'object' }
    )
  }
}

/**
 * Validate array
 *
 * @param {Array} value - Array to validate
 * @param {string} name - Parameter name
 * @param {Object} options - Options
 * @throws {ValidationError}
 */
export function validateArray(value, name, options = {}) {
  const { required = true, minLength = 0, maxLength = Infinity } = options

  if (value === null || value === undefined) {
    if (required) {
      throw new ValidationError(
        `${name} is required`,
        { parameter: name, value, expected: 'array' }
      )
    }
    return
  }

  if (!Array.isArray(value)) {
    throw new ValidationError(
      `${name} must be an array, got ${typeof value}`,
      { parameter: name, value, expected: 'array' }
    )
  }

  if (value.length < minLength) {
    throw new ValidationError(
      `${name} must have at least ${minLength} elements, got ${value.length}`,
      { parameter: name, value: value.length, min: minLength }
    )
  }

  if (value.length > maxLength) {
    throw new ValidationError(
      `${name} must have at most ${maxLength} elements, got ${value.length}`,
      { parameter: name, value: value.length, max: maxLength }
    )
  }
}

/**
 * Validate function
 *
 * @param {Function} value - Function to validate
 * @param {string} name - Parameter name
 * @param {Object} options - Options
 * @throws {ValidationError}
 */
export function validateFunction(value, name, options = {}) {
  const { required = true } = options

  if (value === null || value === undefined) {
    if (required) {
      throw new ValidationError(
        `${name} is required`,
        { parameter: name, value, expected: 'function' }
      )
    }
    return
  }

  if (typeof value !== 'function') {
    throw new ValidationError(
      `${name} must be a function, got ${typeof value}`,
      { parameter: name, value, expected: 'function' }
    )
  }
}

/**
 * Create a helpful error message for common issues
 *
 * @param {string} issue - Issue identifier
 * @param {Object} context - Error context
 * @returns {string} - Helpful error message
 */
export function createHelpfulError(issue, context = {}) {
  const messages = {
    'fitness-not-implemented': `
Individual class must implement fitness() method.

Example:
  class MyCreature extends Individual {
    fitness() {
      // Return a number representing fitness
      return this.score
    }
  }

If using async fitness, implement as async function:
  async fitness() {
    const result = await computeAsync()
    return result
  }
`,
    'invalid-population-size': `
Population size must be a positive integer (got: ${context.value}).

Example:
  new Generation({
    size: 100,  // At least 1
    ...
  })
`,
    'invalid-ratio': `
${context.name} must be between 0 and 1 (got: ${context.value}).

Example:
  new Generation({
    eliteRatio: 0.05,        // 0 to 1 (5%)
    randomFillRatio: 0.10,   // 0 to 1 (10%)
    ...
  })
`,
    'no-individuals': `
Population is empty. Use fillRandom() to create initial population.

Example:
  const generation = new Generation({ size: 100, ... })
  generation.fillRandom()
  generation.tick()
`
  }

  return messages[issue] || `Unknown error: ${issue}`
}
