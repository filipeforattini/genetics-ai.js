import { random } from "lodash-es"

export const sensors = [
  // instinct -------------------------------------------------------------------------------------

  // RND = Random input
  { tick() { return Math.random() } },

  // OSC = Oscillator
  { tick({ me }) { return (me.oscillatorCoef || 1) * Math.sin(Date.now()) } },

  // position -------------------------------------------------------------------------------------

  // LX  = East/west world location
  { tick({ me, world }) { return me.position.x / world.size } },

  // LY  = North/south world location
  { tick({ me, world }) { return me.position.y / world.size } },

  // BDX = East/west distance
  { tick({ me, world }) { return Math.abs(world.size - me.position.x) / world.size } },

  // BDY = Noth/south distance
  { tick({ me, world }) { return Math.abs(world.size - me.position.y) / world.size } },

  // BD  = Nearest border distance
  // TODO

  // BLR = Blockage left-right
  // TODO

  // BFD = Blockage forward
  {
    tick({ me, world }) {
      const nextPosition = { ...me.position }

      if (me.direction === 'up') nextPosition.y -= 1
      else if (me.direction === 'down') nextPosition.y += 1
      else if (me.direction === 'left') nextPosition.x -= 1
      else if (me.direction === 'right') nextPosition.x += 1
      
      return world.canMove(nextPosition) ? 1 : 0
    }
  },

  // LBF = Blockage long-range forward
  {
    tick({ me, world }) {
      let spaces = 0
      const direction = me.direction || ['up', 'down', 'left', 'right'][random(0, 3)]
      const currentPosition = { ...me.position }

      const nextPosition = {
        'up': () => currentPosition.y -= 1,
        'down': () => currentPosition.y += 1,
        'left': () => currentPosition.x -= 1,
        'right': () => currentPosition.x += 1,
      }

      while (currentPosition.x > 0 && currentPosition.x < world.size && currentPosition.y > 0 && currentPosition.y < world.size) {
        nextPosition[direction]()
        if (world.canMove(currentPosition)) spaces += 1
        else break
      }

      return spaces / world.size
    }
  },

  // PLR = Population gradient left-right
  // TODO

  // POP = Population density
  // TODO

  // PFD = Population gradient forward
  // TODO

  // LPF = Population long-range forward
  // TODO

  // memory ---------------------------------------------------------------------------------------

  // AGE = Age
  { tick({ me, world }) { return me.age / world.generationTicks } },

  // LMY = Last movement Y
  // TODO

  // LMX = Last movement X
  // TODO

  // biology --------------------------------------------------------------------------------------

  // GEN = Genetic similarity of forward neighbor
  // TODO

  // SLR = Pheromone gradient left-right
  // TODO

  // SFD = Pheromone gradient forward
  // TODO

  // SG  = Pheromone density
  // TODO
]