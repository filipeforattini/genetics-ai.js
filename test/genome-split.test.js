import { Genome } from "../src/genome.class.js"

describe('Genome.mutateSplitConnection', () => {
  test('should split a connection and add a new neuron', () => {
    // Create a simple genome with one connection: Sensor 0 -> Action 0
    const bases = [
      { type: 'connection', data: 10, source: { type: 'sensor', id: 0 }, target: { type: 'action', id: 0 } }
    ]
    const genome = Genome.fromBases(bases)
    
    // Mutate with split connection
    // We force a high success chance by providing maxNeuronId (default is 511, plenty of space)
    // and the method should pick the only connection available.
    genome.mutateSplitConnection({ maxNeuronId: 10 })
    
    const newBases = genome.bases
    
    // Should have 3 bases now: 
    // 1. Sensor 0 -> NewNeuron (Weight 10)
    // 2. NewNeuron -> Action 0 (Weight 15)
    // 3. Bias for NewNeuron (Weight 0)
    expect(newBases.length).toBe(3)
    
    // Find the new neuron ID
    const connections = newBases.filter(b => b.type === 'connection')
    expect(connections.length).toBe(2)
    
    const conn1 = connections.find(b => b.source.type === 'sensor' && b.source.id === 0)
    const conn2 = connections.find(b => b.target.type === 'action' && b.target.id === 0)
    
    expect(conn1).toBeDefined()
    expect(conn2).toBeDefined()
    
    // Check topology
    expect(conn1.target.type).toBe('neuron')
    expect(conn2.source.type).toBe('neuron')
    expect(conn1.target.id).toBe(conn2.source.id)
    
    const newNeuronId = conn1.target.id
    
    // Check weights
    expect(conn1.data).toBe(10) // Preserved
    expect(conn2.data).toBe(14) // Max weight (15 reserved as advanced-base sentinel)
    
    // Check bias
    const bias = newBases.find(b => b.type === 'bias')
    expect(bias).toBeDefined()
    expect(bias.target.type).toBe('neuron')
    expect(bias.target.id).toBe(newNeuronId)
    expect(bias.data).toBe(0)
  })

  test('should fail gracefully if no connections', () => {
    const bases = [
      { type: 'bias', data: 5, target: { type: 'neuron', id: 0 } }
    ]
    const genome = Genome.fromBases(bases)
    const oldEncoded = genome.encoded
    
    genome.mutateSplitConnection()
    
    expect(genome.encoded).toBe(oldEncoded)
  })

  test('should fail gracefully if all neurons used', () => {
     const bases = [
      { type: 'connection', data: 10, source: { type: 'sensor', id: 0 }, target: { type: 'action', id: 0 } }
    ]
    const genome = Genome.fromBases(bases)
    
    // Pretend all IDs are taken by passing maxNeuronId = -1 (impossible) or checking logic
    // Actually, let's just make a genome that uses ID 0 and set maxNeuronId to 0.
    // But the new neuron needs a NEW ID. If 0 is used, and max is 0, it should fail.
    
    // Wait, the test setup needs to mark ID 0 as used.
    // The connection uses Sensor 0 and Action 0. It does NOT use Neuron 0.
    // So Neuron 0 is free.
    
    // Let's force usage of Neuron 0.
    const bases2 = [
        { type: 'connection', data: 10, source: { type: 'neuron', id: 0 }, target: { type: 'action', id: 0 } }
    ]
    const genome2 = Genome.fromBases(bases2)
    const oldEncoded2 = genome2.encoded
    
    // Max neuron ID 0, and Neuron 0 is used.
    genome2.mutateSplitConnection({ maxNeuronId: 0 })
    
    expect(genome2.encoded).toBe(oldEncoded2)
  })
})
