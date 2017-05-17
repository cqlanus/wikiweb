import React from 'react'
import { Link } from 'react-router'

const NavBar = props => (
  <nav className="navigation">
    {/*<div id="title">My Dashboard</div>*/}
                <img id='title' src="../../assets/logo-wide.jpeg"/>

    <ul>
      <li className="btn"><Link to="/">WikiWeb</Link></li>
      <li className="btn"><Link to="/allhistory">WikiHistory</Link></li>
      <li className="btn"><Link to="/allsentiment">WikiAnalysis</Link></li>
    </ul>
  </nav>
)

export default NavBar
