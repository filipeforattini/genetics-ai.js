import { Base } from "../src/base.class.js"

describe('base creation', () => {
  test('from class', () => {
    const base = new Base({
      from: 's#01',
      to: 'a#01',
      weight: 1
    })

    expect(base.from).toEqual('s#01')
    expect(base.to).toEqual('a#01')
    expect(base.weight).toEqual(1)
  })

  test('from static base32', () => {
    const baseStr = '01g10a'
    const base = Base.fromBase32(baseStr)

    expect(base.from).toEqual('s#01')
    expect(base.to).toEqual('a#01')
    expect(base.weight).toEqual(1)

    expect(base.toString()).toEqual(baseStr)
    expect(base.toBase32()).toEqual(baseStr)
  })

  test('from static bin', () => {
    const baseStr = '000000000110000000010000001010'
    const base = Base.fromBin(baseStr)

    expect(base.from).toEqual('s#01')
    expect(base.to).toEqual('a#01')
    expect(base.weight).toEqual(1)

    expect(base.toBin()).toEqual(baseStr)
  })

  test('from static random', () => {
    const base = Base.random()
    expect(base.from).toBeDefined()
    expect(base.to).toBeDefined()
    expect(base.weight).toBeDefined()

    const base1 = Base.random({ from: 's#00' })
    expect(base1.from).toEqual('s#00')

    const base2 = Base.random({ to: 'a#00' })
    expect(base2.to).toEqual('a#00')

    const base3 = Base.random({ weight: 1 })
    expect(base3.weight).toEqual(1)
  })
})
