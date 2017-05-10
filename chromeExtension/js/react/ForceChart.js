import React from 'react'
import createForceChart from '../d3/dashboard.js'
const d3 = require('d3')

class ForceChart extends React.Component {
  constructor() {
    super()

    this.state = {
      historyView: false,
      currentNodeId: 0,
      pageHistory: []
    }
    this.handleToggle = this.handleToggle.bind(this)
    this.handleNextNode = this.handleNextNode.bind(this)
    this.handlePrevNode = this.handlePrevNode.bind(this)
    this.getHistory = this.getHistory.bind(this)
  }

  componentDidMount() {
    this.getHistory()
  }

  getHistory() {
    chrome.runtime.sendMessage({
    type: 'getUser',
    data: '115893302668387505418'
  }, (results) => {
      this.setState({
        pageHistory: results.history.history
      })
    })
  }

  handleToggle(evt) {
    console.log('toggle')
    this.setState({
      historyView: !this.state.historyView,
      currentNodeId: this.state.currentNodeId + 1
    })

  this.zoomFn()
  }

  zoomFn() {

    const d3NodeArr = d3.selectAll('circle').empty() ? 'empty' : d3.selectAll('circle').nodes()
    const nodeDataArr = d3.selectAll('circle').empty() ? 'empty' : d3.selectAll('circle').nodes().map(node => node.__data__)
    const currentNodeData = nodeDataArr.find(node => {
      return node.id === this.state.pageHistory[this.state.currentNodeId]
    })
    // console.log('d3NodeArr', d3NodeArr)
    const currentD3Node = d3NodeArr.find(node => node.__data__.id === currentNodeData.id)
    console.log('currentNodeData', currentNodeData, currentD3Node)
    d3.select(currentD3Node).attr('class', 'selected')

    const xOffset = currentNodeData.x,
          yOffset = currentNodeData.y

    const zoom = d3.zoom().on('zoom', zoomer)

    function zoomer() {
      const scaleMultipler = 4,
            height = d3.selectAll('.rect').node().getBBox().height,
            width = d3.selectAll('.rect').node().getBBox().width,
            center = [width/2, height/2],
            xTranlation = center[0] - xOffset * scaleMultipler,
            yTranslation = center[1]-yOffset * scaleMultipler

      drawSpace.transition().duration(1000)
      .attr('transform', `translate(${xTranlation}, ${yTranslation})scale(${scaleMultipler})`)
    }

    const drawSpace = d3.selectAll('.draw')
    drawSpace.call(zoom.transform, d3.zoomIdentity)
  }

  handleNextNode(evt) {
    this.setState({
      currentNodeId: this.state.currentNodeId + 1
    })
    this.zoomFn()
  }

  handlePrevNode(evt) {
    this.setState({
      currentNodeId: this.state.currentNodeId - 1
    })
    this.zoomFn()
  }

  render() {
    console.log('currentNodeId & history position', this.state.currentNodeId, this.state.pageHistory[this.state.currentNodeId])
  return (
  <div className="canvas-container">
    <svg height="700" width="100%"></svg>
    <div className='btns'>
      <button onClick={this.handleToggle}>history</button>
    { this.state.historyView ?
      <div>
        <button onClick={this.handlePrevNode}>back</button>
        <button onClick={this.handleNextNode}>forward</button>
      </div> : null
    }
    </div>
  </div>
  )}
}

export default ForceChart