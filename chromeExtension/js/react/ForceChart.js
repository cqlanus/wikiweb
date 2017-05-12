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
      pageHistory: [],
      categories: {},
      totalPageVisits: 0,
      totalArticles: 0,
      selectedNodes: {},
    }
    this.handleToggle = this.handleToggle.bind(this)
    this.handleNextNode = this.handleNextNode.bind(this)
    this.handlePrevNode = this.handlePrevNode.bind(this)
    this.getUserInfo = this.getUserInfo.bind(this)
    this.getSelected = this.getSelected.bind(this)
  }

  componentDidMount() {
    this.getUserInfo()
  }

  getUserInfo() {
    const self = this
    chrome.identity.getProfileUserInfo(function(info){
      // console.log('this is MY id',info.id)
      chrome.runtime.sendMessage({
        type: 'getUser',
        data: info.id
      }, (results) => {
        const categoryObj = {}
        const categoriesArr = results.nodes
          .map(node => node.category)
          .forEach(category => {
          categoryObj[category] = categoryObj[category] ? categoryObj[category] + 1 : 1
        })
        const totalPageVisits = results.nodes
          .map(node => node.visitCount)
          .reduce((acc=0, node) => {
          return acc + node
        })

        self.setState({
          pageHistory: results.history.history,
          categories: categoryObj,
          totalArticles: results.nodes.length,
          totalPageVisits: totalPageVisits
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

  getSelected(evt) {
    const selectedObj = {}
    d3.selectAll('.selected').nodes()
      .forEach(node => {selectedObj[parseInt(node.id)] = true})

    chrome.runtime.sendMessage({
      type: 'SET_SELECTED',
      data: selectedObj
    }, (selected) => {
      this.setState({
        selectedNodes: selected
      })

    })
  }

  render() {
    this.state.pageHistory.length && this.state.historyView ? this.zoomFn() : null
  return (
  <div>
  <div className="canvas-container">
    <svg height="700" width="100%"
      onMouseOver={this.getSelected}
      onClick={this.getSelected}
    ></svg>


  </div>
  <div className='btns'>
      <button onClick={this.handleToggle}>history</button>
    { this.state.historyView ?
      <div>
        <button onClick={this.handlePrevNode}>back</button>
        <button onClick={this.handleNextNode}>forward</button>
      </div> : null
    }
    </div>
    <svg height="300" width="300" id="barchart"></svg>
  </div>
  )}
}

export default ForceChart
