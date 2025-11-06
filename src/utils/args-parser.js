/**
 * Flexible argument parser (ml5.js style)
 *
 * Supports multiple calling patterns:
 * - fn()
 * - fn(callback)
 * - fn(options)
 * - fn(options, callback)
 *
 * Usage:
 *   const { options, callback } = parseArgs(arguments, {
 *     defaults: { maxIterations: 100 },
 *     optionsKey: 0  // optional, which arg position can be options
 *   })
 */

/**
 * Check if value is a plain object (not array, not function, not null)
 */
export function isPlainObject(value) {
  return (
    value !== null &&
    typeof value === 'object' &&
    !Array.isArray(value) &&
    Object.getPrototypeOf(value) === Object.prototype
  )
}

/**
 * Parse flexible function arguments
 *
 * @param {IArguments|Array} args - Function arguments
 * @param {Object} config - Configuration
 * @param {Object} config.defaults - Default options
 * @param {number[]} config.optionsPositions - Valid positions for options object (default: [0])
 * @param {number[]} config.callbackPositions - Valid positions for callback (default: [0, 1])
 * @returns {Object} - { options, callback }
 */
export function parseArgs(args, config = {}) {
  const {
    defaults = {},
    optionsPositions = [0],
    callbackPositions = [0, 1]
  } = config

  // Convert arguments to array
  const argsArray = Array.from(args)

  let options = { ...defaults }
  let callback = null

  // Check for callback at valid positions
  for (const pos of callbackPositions) {
    if (pos < argsArray.length && typeof argsArray[pos] === 'function') {
      callback = argsArray[pos]
      break
    }
  }

  // Check for options object at valid positions
  for (const pos of optionsPositions) {
    if (pos < argsArray.length) {
      const arg = argsArray[pos]
      // If it's a plain object and not the callback
      if (isPlainObject(arg) && arg !== callback) {
        options = { ...defaults, ...arg }
        break
      }
    }
  }

  return { options, callback }
}

/**
 * Parse arguments specifically for tick/next methods
 *
 * Supports:
 * - method()
 * - method(callback)
 * - method(options)
 * - method(options, callback)
 *
 * @param {IArguments|Array} args
 * @param {Object} defaults
 * @returns {Object} - { options, callback }
 */
export function parseMethodArgs(args, defaults = {}) {
  return parseArgs(args, {
    defaults,
    optionsPositions: [0],
    callbackPositions: [0, 1]
  })
}

/**
 * Parse constructor arguments
 *
 * Supports:
 * - new Class()
 * - new Class(options)
 * - new Class(size, options)
 * - new Class(size, class, options)
 *
 * @param {IArguments|Array} args
 * @param {Object} config
 * @returns {Object} - Parsed arguments
 */
export function parseConstructorArgs(args, config = {}) {
  const argsArray = Array.from(args)

  // If only one argument and it's an object, treat as options
  if (argsArray.length === 1 && isPlainObject(argsArray[0])) {
    return argsArray[0]
  }

  // Otherwise, handle positional arguments
  return config.positionalParser ? config.positionalParser(argsArray) : argsArray[0]
}
