import { removeArray } from './arr.js'
import { randomInt } from './number.js'

export const chars = [
  'a', 'b', 'c', 'd', 'e', 'f', 'g', 'h', 'i', 'j',
  'k', 'l', 'm', 'n', 'o', 'p', 'q', 'r', 's', 't',
  'u', 'v', 'w', 'x', 'y', 'z'
].join('')

export const vowels = ['a', 'e', 'i', 'o', 'u'].join('')

export const consonants = removeArray(chars.split(''), vowels.split('')).join('')

export const alphanum = [
  '0', '1', '2', '3', '4', '5', '6', '7', '8', '9',
  ...chars.split(''),
].join('')

export const shuffleStr = (unshuffled) => unshuffled
  .map(value => ({ value, sort: Math.random() }))
  .sort((a, b) => a.sort - b.sort)
  .map(({ value }) => value)

export const randomChar = (size = 1) => {
  const str = new Array(size).fill(0).map(() => chars[randomInt(0, chars.length)])
  return shuffleStr(str).join('')
}

export const randomAlpha = (size = 1, base = alphanum.length) => {
  const str = new Array(size).fill(0).map(() => alphanum[randomInt(0, base)])
  return shuffleStr(str).join('')
}

export const chunk = (str, length) => {
  return str.match(new RegExp('.{1,' + length + '}', 'g'));
}
