export const randomInt = (min, max) => {
  return Math.floor(Math.random() * (max - min + 1)) + min;
}

export const toBin = x => parseInt(x).toString(2)
export const fromBin = bin => parseInt(bin, 2)
export const fromBinToBase32 = bin => parseInt(bin, 2).toString(32)

export const toBase32 = x => parseInt(x).toString(32)
export const fromBase32 = b32 => parseInt(b32, 32)
export const fromBase32ToBin = b32 => parseInt(b32, 32).toString(2)
