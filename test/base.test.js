import { Base } from "../src/base.class.js"

describe('bases parser', () => {
  describe('config', () => {
    test('get bias from char', () => {
      const bases = [
        '1', '3', '5', '10', '30', '50',
        'B', 'D', 'F', 'B0', 'D0', 'F0',
      ]

      for (const base of bases) {
        const baseFound = Base.getConfig(base)
        expect(baseFound.type).toEqual('bias')
      }
    })

    test('get connection from char', () => {
      const bases = [
        '0', '2', '4', '00', '20', '40',
        'A', 'C', 'E', 'A0', 'C0', 'E0',
      ]

      for (const base of bases) {
        const baseFound = Base.getConfig(base)
        expect(baseFound.type).toEqual('connection')
      }
    })
  })

  describe('bias', () => {
    test('from string', () => {
      const bases = [
        '1', '10', '100', '1000', '10000',
        'B', 'B0', 'B00', 'B000', 'B0000',
        'V', 'V0', 'V00', 'V000', 'V0000',
      ]

      for (const base of bases) {
        const baseFound = Base.fromString(base)
        expect(baseFound.type).toEqual('bias')
      }
    })

    test('from string content', () => {
      const base = Base.fromString('D02')

      expect(base.type).toEqual('bias')
      expect(base.data).toEqual(3)
      expect(base.target.id).toEqual(0)
      expect(base.target.type).toEqual('action')
    })

    test('max value', () => {
      const base = Base.fromString('VVS')
      expect(base.type).toEqual('bias')
      expect(base.data).toEqual(-7)
      expect(base.target.id).toEqual(255)
      expect(base.target.type).toEqual('sensor')
    })
  })

  describe('connection', () => {
    test('from string', () => {
      const bases = [
        '0', '00', '000', '0000', '00000',
        'A', 'A0', 'A00', 'A000', 'A0000',
        'U', 'U0', 'U00', 'U000', 'U0000',
      ]

      for (const base of bases) {
        const baseFound = Base.fromString(base)
        expect(baseFound.type).toEqual('connection')
      }
    })

    test('from string content', () => {
      const base = Base.fromString('C0101')

      expect(base.type).toEqual('connection')
      expect(base.data).toEqual(6)
    })

  })
})

describe('bases zip', () => {
  test('bias base to string', () => {
    const baseStr = '90C'
    const baseObj = {
      type: 'bias',
      data: 2,
      target: { type: 'sensor', id: 3 },
    }

    const newBaseStr = Base.toString(baseObj)
    expect(newBaseStr).toEqual(baseStr)

    const newBaseObj = Base.fromString(newBaseStr)
    expect(newBaseObj.type).toEqual(baseObj.type)
    expect(newBaseObj.data).toEqual(baseObj.data)
    expect(newBaseObj.target.type).toEqual(baseObj.target.type)
    expect(newBaseObj.target.id).toEqual(baseObj.target.id)
  })

  test('connection base to string', () => {
    const baseStr = '40709'
    const baseObj = {
      type: 'connection',
      data: 2,
      source: { type: 'neuron', id: 3 },
      target: { type: 'action', id: 4 },
    }

    const newBaseStr = Base.toString(baseObj)
    expect(newBaseStr).toEqual(baseStr)

    const newBaseObj = Base.fromString(newBaseStr)
    expect(newBaseObj.type).toEqual(baseObj.type)
    expect(newBaseObj.data).toEqual(baseObj.data)
    expect(newBaseObj.source.type).toEqual(baseObj.source.type)
    expect(newBaseObj.source.id).toEqual(baseObj.source.id)
    expect(newBaseObj.target.type).toEqual(baseObj.target.type)
    expect(newBaseObj.target.id).toEqual(baseObj.target.id)
  })

  test('random with restrictions', () => {
    const base = Base.randomWith({
      neurons: 1,
      sensors: 1,
      actions: 1,
    })

    expect(base.target.id).toEqual(0)

    const base2 = Base.randomWith({
      neurons: 20,
      sensors: 20,
      actions: 20,
    })
  })
})
