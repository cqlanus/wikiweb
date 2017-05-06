import React from 'react'
import ReactDOM from 'react-dom'

/* COMPONENTS */
import NavBar from './NavBar'
import ForceChart from './ForceChart'

/* D3 CREATORES */
import createForceChart from '../d3/dashboard.js'

const Main = props => (
 <div>
  <NavBar />
  <ForceChart />
 </div>
)


ReactDOM.render(<Main />, document.getElementById('app'))

/* INVOKE D3 AFTER RENDER TO ATTACH TO DOM */
createForceChart()