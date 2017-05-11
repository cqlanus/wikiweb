import React from 'react'
import { Link } from 'react-router'

const NavBar = props => (
  <nav className="navigation">
    <div id="title">My Dashboard</div>
    <ul>
      <li className="btn"><Link to="/">WikiWeb</Link></li>
      <li className="btn"><Link to="/history">WikiHistory</Link></li>
      <li className="btn"><Link to="/sentiment">WikiAnalysis</Link></li>
    </ul>
  </nav>
)

export default NavBar