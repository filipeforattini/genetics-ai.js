export const shuffle = (arr = []) => arr.sort(() => Math.random() - 0.5)

export const intersection = (arrA = [], arrB = []) => arrA.filter(x => arrB.includes(x))

export const removeArray = (arrA = [], arrB = []) => arrA.filter(x => !arrB.includes(x))

export const chunkArray = (arr = [], perChunk = 1) => arr.reduce((all, one, i) => {
  const ch = Math.floor(i / perChunk);
  all[ch] = [].concat((all[ch] || []), one);
  return all
}, [])
