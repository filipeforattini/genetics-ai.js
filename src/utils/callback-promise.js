/**
 * Utility for handling both callbacks and promises (ml5.js style)
 *
 * Usage:
 *
 * async function myAsyncFunction(callback) {
 *   return callCallback(callback, async () => {
 *     // Do async work
 *     const result = await someAsyncOp()
 *     return result
 *   })
 * }
 *
 * // Then users can use:
 * await myAsyncFunction()           // Promise
 * myAsyncFunction(callback)         // Callback
 * myAsyncFunction().then(...)       // Promise chain
 */

/**
 * Execute an async function and handle both callback and promise patterns
 * @param {Function} callback - Optional callback(error, result)
 * @param {Function} asyncFn - Async function to execute
 * @returns {Promise|undefined} - Returns promise if no callback, undefined otherwise
 */
export function callCallback(callback, asyncFn) {
  // If callback provided, use callback pattern
  if (typeof callback === 'function') {
    asyncFn()
      .then(result => callback(null, result))
      .catch(error => callback(error))
    return undefined
  }

  // Otherwise return promise
  return asyncFn()
}

/**
 * Check if a value is a promise
 * @param {*} value
 * @returns {boolean}
 */
export function isPromise(value) {
  return value && typeof value.then === 'function'
}

/**
 * Ensure a value is a promise
 * @param {*} value
 * @returns {Promise}
 */
export function toPromise(value) {
  if (isPromise(value)) return value
  return Promise.resolve(value)
}

/**
 * Execute function and handle both sync and async results
 * @param {Function} fn
 * @returns {Promise}
 */
export async function executeAsync(fn) {
  const result = fn()
  return toPromise(result)
}
