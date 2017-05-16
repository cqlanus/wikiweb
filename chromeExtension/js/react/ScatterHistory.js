import React from 'react'
import { Link } from 'react-router'

const History = props => {
  return (
  <div>
  <h3> Review your Wikipedia viewing history below.  Select specific time periods along the axes using the brush effect. </h3>
  <div className="canvas-container">
    <svg height="700" width="100%"></svg>
  </div>
  </div>
)}

export default History
