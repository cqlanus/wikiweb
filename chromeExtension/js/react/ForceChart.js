import React from 'react'
import createForceChart from '../d3/dashboard.js'
const d3 = require('d3')

class ForceChart extends React.Component {
  constructor() {
    super()

    this.state = {
      history: false,
      currentNodeId: 0
    }
    this.handleToggle = this.handleToggle.bind(this)
    this.handleNextNode = this.handleNextNode.bind(this)
    this.handlePrevNode = this.handlePrevNode.bind(this)
  }

  handleToggle(evt) {
    console.log('toggle')
    this.setState({
      history: !this.state.history
    })

  this.zoomFn()

  }

  zoomFn() {
    const selectedCircle = d3.selectAll('.selected')
    const circleData = selectedCircle._groups[0][0] ? selectedCircle._groups[0][0].__data__ : {x: 250, y: 110}
    let x = circleData.x
    let y = circleData.y
    const zoom = d3.zoom().on('zoom', zoomed)

    function zoomed() {
      const k = 500 / 180
      const center = [540/2, 500/2]
      console.log('zoomed called')
      drawSpace.transition().duration(1000)
      .attr('transform', `translate(${center[0]-x * k}, ${center[1]-y * k})scale(3)`)
    }
    const drawSpace = d3.selectAll('.draw')


    drawSpace.call(zoom.transform, d3.zoomIdentity)
  }

  handleNextNode(evt) {
    this.setState({
      currentNodeId: this.state.currentNodeId + 1
    })
  }

  handlePrevNode(evt) {
    this.setState({
      currentNodeId: this.state.currentNodeId - 1
    })
  }

  render() {

    this.zoomFn()
  return (
  <div className="canvas-container">
    <svg height="700" width="100%"></svg>
    <div className='btns'>
      <button onClick={this.handleToggle}>history</button>
    { this.state.history ?
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