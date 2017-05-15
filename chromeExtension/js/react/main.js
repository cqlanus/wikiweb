import React from 'react'
import { Router, Route, hashHistory, IndexRedirect } from 'react-router'
import ReactDOM from 'react-dom'

/* COMPONENTS */
import NavBar from './NavBar'
import ForceChart from './ForceChart'
import History from './ScatterHistory'
import Modal from './Modal'
import Sentiment from './Sentiment'

/* D3 CREATORS */
import createForceChart from '../d3/dashboard.js'
import createNodeScatter from '../d3/nodeScatter.js'
import createSentimentMap from '../d3/sentimentmap.js'
import createBarChart from '../d3/barchart.js'

const Main = props => (
 <div>
  <NavBar />
  {props.children}
 </div>
)

const onWebEnter = () => {
  chrome.identity.getProfileUserInfo(function(info){
      createForceChart(info.id)
      // createBarChart({war: 5, sports: 2, travel: 3, politics: 10, food: 6})
  })

}

const onScatterEnter = () => {
  chrome.runtime.sendMessage({
    type: 'GET_SELECTED'
  }, selectedNodes => {
    createNodeScatter(selectedNodes)
  })
}

const onSentimentEnter = () => {
  chrome.runtime.sendMessage({
    type: 'GET_SELECTED',
  }, selectedNodes => {
    chrome.runtime.sendMessage({
      type: 'GET_SENTIMENT_BY_USERID',
      data: selectedNodes,
    }, analysis => {
      createSentimentMap(analysis)
    })
  })
}

ReactDOM.render(
  <Router history={hashHistory} >
    <Route path='/' component={Main}>
      <IndexRedirect to='/web' />
      <Route path='/web' component={ForceChart} onEnter={onWebEnter}/>
      <Route path='/history' component={History} onEnter={onScatterEnter}/>
      <Route path='/sentiment' component={Sentiment} onEnter={onSentimentEnter}/>
    </Route>
  </Router>,
  document.getElementById('app'))

/* INVOKE D3 AFTER RENDER TO ATTACH TO DOM */
// createForceChart()
