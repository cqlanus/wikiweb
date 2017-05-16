import React from 'react'
import { Link } from 'react-router'
import Modal from './modal'
import SentimentModal from './SentimentModal'

class Sentiment extends React.Component {
  constructor() {
    super()

    this.state = {
      selectedNodes: {},
      foundNodes: []
    }
    this.handleClick = this.handleClick.bind(this)
  }

  componentDidMount() {
    chrome.runtime.sendMessage({
      type: 'GET_SELECTED'
    }, selected => {
      this.setState({
        selectedNodes: selected
      })
    })
  }



  handleClick(evt) {
    const textContent = evt.target.__data__.data.mention
    chrome.runtime.sendMessage({
      type: 'GET_NODES_BY_TEXT_CONTENT',
      data: {
        text: textContent,
        nodes: this.state.selectedNodes
      }
    }, nodes => {
      this.setState({
        foundNodes: nodes
      })
    })
  }

render(){
  console.log('selectedNodes: ', this.state.selectedNodes)
  let nodeDataArr= this.state.foundNodes
  return (
  <div>
    <div className="canvas-container">
      <svg height="700" width="100%" onClick={this.handleClick}></svg>
    </div>
    <div className="svghistory">
        <h3> The visual above, represents specific keywords found in your selected articles.  The grey nodes represent a neutral response, while green represents positive and red negative. Click an individual node to see every article that mentions the keyword. </h3>
    </div>
    <div>
      {nodeDataArr &&
           <SentimentModal nodeData={nodeDataArr}/>
      }
    </div>
  </div>
)}
}

function formatTitle(title) {
  const index = title.indexOf(' - Wiki')
  return title.substring(0, index)
}

export default Sentiment

/*

{this.state.foundNodes.length>0 &&
           <SentimentModal nodeData={this.state.foundNodes}/>
      }

      */