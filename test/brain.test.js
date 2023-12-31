import { Brain } from "../src/brain.class.js"

describe('brain', () => {
  test('from array', () => {
    const brain = new Brain({ 
      genome: {
        bases: [
          {
            type: 'bias',
            data: 0,
            target: { type: 'neuron', id: 0 },
          },
          {
            type: 'bias',
            data: 1,
            target: { type: 'neuron', id: 1 },
          },
          {
            // s#0 -> n#0
            type: 'connection',
            data: 1,
            source: { type: 'sensor', id: 0 },
            target: { type: 'neuron', id: 0 },
          },
          {
            // s#0 -> n#1
            type: 'connection',
            data: 1,
            source: { type: 'sensor', id: 0 },
            target: { type: 'neuron', id: 1 },
          },
          {
            // s#1 -> n#2
            type: 'connection',
            data: 1,
            source: { type: 'sensor', id: 1 },
            target: { type: 'neuron', id: 2 },
          },
          {
            // n#0 -> a#0
            type: 'connection',
            data: 1,
            source: { type: 'neuron', id: 0 },
            target: { type: 'action', id: 0 },
          },
          {
            // n#1 -> a#0
            type: 'connection',
            data: 1,
            source: { type: 'neuron', id: 1 },
            target: { type: 'action', id: 0 },
          },
          {
            // n#2 -> a#1
            type: 'connection',
            data: 1,
            source: { type: 'neuron', id: 2 },
            target: { type: 'action', id: 1 },
          },
        ]
      },

      sensors: [
        { 
          tick () {
            return Math.cos(Date.now())
          },
        },
        { 
          tick () {
            return Math.sin(Date.now())
          },
        },
      ],

      actions: [
        { 
          tick (data) {
            console.log('action0', { data })
            return data + 1
          },
        },
        { 
          tick (data) {
            console.log('action1', { data })
            return data * data
          },
        },
      ],
    })

    // console.log(brain)
    // console.log(brain.tick())
    brain.tick()
  })
})
