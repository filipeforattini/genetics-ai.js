import { jest } from '@jest/globals'
import { ModuleBase } from '../../src/bases/module.base.js'
import { BitBuffer } from '../../src/bitbuffer.class.js'

describe('ModuleBase', () => {
  afterEach(() => {
    jest.restoreAllMocks()
  })

  const createGenome = (bytes = [0xaa, 0xbb]) => {
    const genome = new BitBuffer(bytes.length * 8)
    bytes.forEach((value, idx) => genome.writeBits(value, 8, idx * 8))
    genome.bitLength = bytes.length * 8
    return genome
  }

  test('encodes and decodes module genome', () => {
    const genome = createGenome()
    const buffer = ModuleBase.toBitBuffer({
      type: 'module',
      moduleId: 7,
      length: 2,
      moduleGenome: genome
    })

    const parsed = ModuleBase.fromBitBuffer(buffer, 0)
    expect(parsed).toMatchObject({
      type: 'module',
      moduleId: 7,
      length: 2,
      bitLength: ModuleBase.calculateBitLength(2)
    })
    const extracted = ModuleBase.extractGenome(parsed)
    expect(extracted.readBits(8, 0)).toBe(0xaa)
    expect(extracted.readBits(8, 8)).toBe(0xbb)
  })

  test('fromGenome and extractGenome round-trip', () => {
    const genome = createGenome([0x11, 0x22, 0x33])
    const buffer = ModuleBase.fromGenome(12, genome)
    const parsed = ModuleBase.fromBitBuffer(buffer, 0)
    const extracted = ModuleBase.extractGenome(parsed)

    expect(parsed.moduleId).toBe(12)
    expect(extracted.buffer.slice(0, 3)).toEqual(genome.buffer.slice(0, 3))
  })

  test('randomBinary produces valid module respecting bounds', () => {
    const values = [0.1, 0.2, 0.3, 0.4]
    jest.spyOn(Math, 'random').mockImplementation(() => values.shift() ?? 0.5)

    const buffer = ModuleBase.randomBinary({
      maxModuleTypes: 16,
      minGenomeBytes: 1,
      maxGenomeBytes: 1
    })

    const parsed = ModuleBase.fromBitBuffer(buffer, 0)
    expect(parsed.moduleId).toBeLessThan(16)
    expect(parsed.length).toBe(1)
  })

  test('mutateBinary can change module id and genome bits', () => {
    const genome = createGenome([0x00])
    const buffer = ModuleBase.toBitBuffer({
      type: 'module',
      moduleId: 1,
      length: 1,
      moduleGenome: genome
    })

    let call = 0
    jest.spyOn(Math, 'random').mockImplementation(() => {
      call++
      if (call === 1) return 0 // trigger module id change (5% check)
      return 0 // also force bit mutations
    })

    ModuleBase.mutateBinary(buffer, 0, 1, { canChangeModuleId: true })
    const parsed = ModuleBase.fromBitBuffer(buffer, 0)
    expect(parsed.moduleId).not.toBe(1)
    expect(parsed.moduleGenome.buffer[0]).not.toBe(0x00)
  })
})
