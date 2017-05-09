import React from 'react'
import { Router, Route, hashHistory, IndexRedirect } from 'react-router'
import ReactDOM from 'react-dom'

/* COMPONENTS */
import NavBar from './NavBar'
import ForceChart from './ForceChart'
import History from './ScatterHistory'

/* D3 CREATORS */
import createForceChart from '../d3/dashboard.js'
import createNodeScatter from '../d3/nodeScatter.js'

const Main = props => (
 <div>
  <NavBar />
  {props.children}
 </div>
)

const onWebEnter = () => {
  createForceChart('115893302668387505418')
}

const onScatterEnter = () => {
  createNodeScatter({'17': true, '16': true})
}

ReactDOM.render(
  <Router history={hashHistory} >
    <Route path='/' component={Main}>
      <IndexRedirect to='/web' />
      <Route path='/web' component={ForceChart} onEnter={onWebEnter}/>
      <Route path='/history' component={History} onEnter={onScatterEnter}/>
    </Route>
  </Router>,
  document.getElementById('app'))

/* INVOKE D3 AFTER RENDER TO ATTACH TO DOM */
// createForceChart()