import React from 'react'

const NavBar = props => (
  <nav className="navigation">
    <div id="title">My Dashboard</div>
    <ul>
      <li className="btn"><a href="#">WikiWeb</a></li>
      <li className="btn"><a href="#">WikiHistory</a></li>
      <li className="btn"><a href="#">WikiAnalysis</a></li>
    </ul>
  </nav>
)

export default NavBar