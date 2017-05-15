import React from 'react'
import createForceChart from '../d3/dashboard.js'
import Modal from './Modal'
import UserModal from './UserModal'
const d3 = require('d3')
const {d3Zoom,} = require('../d3/historyzoomer')


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
        //console.log('this is state',self.state)
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
    d3Zoom(this.state.pageHistory, this.state.currentNodeId, this.state.historyView)
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
    console.log('selected nodes!', this.state.selectedNodes)
  }

  render() {
    this.state.pageHistory.length && this.state.historyView ? this.zoomFn() : d3.selectAll('.pageInfo').remove()
    // this.getSelected()
  return (
  <div>
  <div className="canvas-container">
    <svg height="700" width="100%"
      onMouseOver={this.getSelected}
    ></svg>

    </div>
    <div className='btn-div'>
      <div className="retrace-container">
        <div className="retrace">RETRACE YOUR STEPS</div>
      </div>
      <button className='main-button' onClick={this.handleToggle}>HISTORY</button>
      { this.state.historyView ?
        <div className='btn-div2'>
          <button className='sub-button' onClick={this.handlePrevNode}>BACK</button>
          <button className='sub-button' onClick={this.handleNextNode}>FORWARD</button>
        </div> : null
      }
      </div>
    {/*<svg height="300" width="300" id="barchart"></svg>*/}
    <Modal nodeId={this.state.currentNodeId} selectedNodes={this.state.selectedNodes}/>
    <UserModal />
  </div>
  )
}
}

export default ForceChart
