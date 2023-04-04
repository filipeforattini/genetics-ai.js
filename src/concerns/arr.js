export const shuffle = (arr = []) => arr.sort(() => Math.random() - 0.5)

export const intersection = (arrA = [], arrB = []) => arrA.filter(x => arrB.includes(x))

export const removeArray = (arrA = [], arrB = []) => arrA.filter(x => !arrB.includes(x))
