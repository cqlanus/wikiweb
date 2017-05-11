import React from 'react'
import createForceChart from '../d3/dashboard.js'
const d3 = require('d3')
const d3Zoom = require('../d3/historyzoomer')

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
    //  chrome.identity.getProfileUserInfo(function(info) {
    //   	console.log('in getProfileUserInfo, going to set store', info)
    //   })
    this.getHistory()
  }

  getHistory() {
    chrome.identity.getProfileUserInfo(function(info){
      chrome.runtime.sendMessage({
        type: 'getUser',
        data: info.id
      }, (results) => {
          this.setState({
            pageHistory: results.history.history
          })
      })
  })
}

  handleToggle(evt) {
    console.log('toggle')
    this.setState({
      historyView: !this.state.historyView,
      currentNodeId: 0
    })

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

  zoomFn() {
    d3Zoom(this.state.pageHistory, this.state.currentNodeId)
  }

  render() {
    this.state.pageHistory.length && this.state.historyView ? this.zoomFn() : null

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
