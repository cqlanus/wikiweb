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
    this.setState({
      history: !this.state.history
    })

    const zoom = d3.zoom().on('zoom', zoomed)

    // const circleArray = [...d3.select('svg').selectAll('circle')._groups[0]]
    // const firstCircle = circleArray.filter(circle => circle.__data__.id === 1)[0]
    const firstCircle = d3.selectAll('circle')


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