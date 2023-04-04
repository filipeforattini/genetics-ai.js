import noverlap from 'graphology-layout-noverlap';
import { renderToPNG } from 'graphology-canvas/node.js'
import circlepack from 'graphology-layout/circlepack.js';

export function GraphToImageMixin ({ brain }) {
  Object.assign(brain, {
    async toPNG({ filename, callback }) {
      const renderSettings = {
        circlepack: {
          hierarchyAttributes: ['nature'],
        },
        noverlap: {
          maxIterations: 25,
          settings: {
            ratio: 2
          }
        },
        renderToPNG: {
          padding: 50
        },
      }
  
      this.sensors.forEach((s) => this.graph.updateNodeAttributes(s.id, (attr) => ({
        ...attr,
        nature: 'sensor',
        size: 10,
        color: '#77aaff',
      })))
  
      this.neurons.forEach((n) => this.graph.updateNodeAttributes(n.id, (attr) => ({
        ...attr,
        nature: 'neuron',
        size: 12,
        color: '#a0a0a0',
      })))
  
      this.actions.forEach((a) => this.graph.updateNodeAttributes(a.id, (attr) => ({
        ...attr,
        nature: 'action',
        size: 14,
        color: '#ff77aa',
      })))
  
      this.graph.forEachEdge(e => this.graph.updateEdgeAttributes(e, (attr) => ({
        ...attr,
        size: 2 * Math.ceil(Math.abs(attr.weight)),
      })))
  
      circlepack.assign(this.graph, renderSettings.circlepack)
      noverlap.assign(this.graph, renderSettings.noverlap)
  
      const res = await renderToPNG(
        this.graph,
        filename,
        renderSettings.renderToPNG,
        callback ? callback : () => { }
      )
  
      return res
    }
  })
}