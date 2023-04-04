import asciichart from 'asciichart'

export function GraphToImageMixin ({ brain }) {
  Object.assign(brain, {
    chart(tickIdList = [], options = {}) {
      if (!this.ticks.length) throw new Error('no-data')

      const idList = tickIdList.length ? tickIdList : Object.keys(this.ticks[0])

      if (idList.filter(x => !Object.keys(this.ticks[0]).includes(x)).length) throw new Error(`ids ${idList.join('')} may not exist`)

      const zeroState = idList.reduce((acc, k) => {
        acc[k] = []
        return acc
      }, {})

      let series = this.ticks.reduce((acc, tick) => {
        Object.entries(tick)
          .filter(([k]) => idList.includes(k))
          .forEach(([k, v]) => acc[k].push(v))
        return acc
      }, zeroState)

      series = Object.values(series)

      return asciichart.plot(series, {
        height: 25,
        colors: [
          asciichart.red,
          asciichart.blue,
          asciichart.green,
          asciichart.yellow,
          asciichart.magenta,
          asciichart.cyan,
          asciichart.default,
        ],
        ...options
      })
    }
  })
}