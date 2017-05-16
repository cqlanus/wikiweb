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
    this.setSelected = this.setSelected.bind(this)
  }

  componentDidMount() {
    this.getUserInfo()
    this.setSelected()
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
      })
    })
  }

  handleToggle(evt) {
    this.setState({
      historyView: !this.state.historyView,
      currentNodeId: 0
    })
  }

  handleNextNode(evt) {
    console.log('in next node handler')
    this.setState({
      currentNodeId: this.state.currentNodeId + 1
    })
  }

  handlePrevNode(evt) {
    console.log('in prev node handler')
    this.setState({
      currentNodeId: this.state.currentNodeId - 1
    })
  }

  zoomFn() {
    d3Zoom(this.state.pageHistory, this.state.currentNodeId, this.state.historyView)
  }

  setSelected(evt) {
    chrome.runtime.sendMessage({
      type: 'GET_SELECTED',
    }, (selected) => {
      // console.log('selected from store', selected)
      this.setState({
          selectedNodes: selected
        })

    })

  }

  render() {
    this.state.pageHistory.length && this.state.historyView ? this.zoomFn() : d3.selectAll('.pageInfo').remove()
  return (
  <div>
  <div className='svghistory'>
    <div className="canvas-container">
      <svg height="700" width="100%"
        onClick={this.setSelected}
        onMouseOver={this.setSelected}
      ></svg>
    </div>
    <div className='btn-div'>
      { this.state.historyView ?
        <img src="../../assets/left_arrow.png" className='sub-button' onClick={this.handlePrevNode} height="20px" width="20px"/>
        : null
      }
      <button className='main-button' onClick={this.handleToggle}>VIEW HISTORY</button>
      { this.state.historyView ?
        <img src="../../assets/right_arrow.png" className='sub-button' onClick={this.handleNextNode} height="20px" width="20px"/>
          : null
      }
    </div>
  </div>
  <div className='dashboardtables'>
    <Modal nodeId={this.state.currentNodeId} selectedNodes={d3.selectAll('.selected').nodes()}/>
    <UserModal />
  </div>
  </div>
  )
}
}

export default ForceChart


 /* old html

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

*/
