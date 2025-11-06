import { random } from "lodash-es"

export const actions = [
  // LPD = set long-probe distance
  // TODO

  // KILL = kill forward neighbor
  // TODO
  
  // OSC = set oscillator period
  { tick(data, { me }) { me.oscillatorCoef = Math.tanh(data) } },
  
  // SG = emit pheromone
  // TODO

  // RES = set responsiveness
  // TODO

  // MFD = move forward
  { tick(data, { me }) { me.move() } },
  
  // MRN = move random
  { tick(data, { me }) { me.move(['up', 'down', 'left', 'right'][random(0, 3)]) } },
  
  // MRV = move reverse
  {
    tick(data, { me }) {
      if (!data) return

      if (me.direction === 'up') me.move('down')
      else if (me.direction === 'down') me.move('up')
      else if (me.direction === 'left') me.move('right')
      else if (me.direction === 'right') me.move('left')
    }
  },
  
  // MRL = move left-right (+/-)
  { tick(data, { me }) { data > 0 ? me.move('right') : me.move('left') } },
  
  // MX = move east/west (+/-)
  { tick(data, { me }) { data > 0 ? me.move('right') : me.move('left') } },
  
  // MY = move north/south (+/-)
  { tick(data, { me }) { data > 0 ? me.move('down') : me.move('up') } },
]
