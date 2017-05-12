import React from 'react'
import createForceChart from '../d3/dashboard.js'
const d3 = require('d3')
const d3Zoom = require('../d3/historyzoomer')



class Modal extends React.Component {
  constructor() {
    super()

    this.state = {
     viewtodisplay: null,
     nodeData: [{title:'Barack Obama', category:"President", visitCount:2, lastVisit:"January 1, 2017", url:'wiki/wwI'},{title:'WWII', category:" WAR",  visitCount:1, lastVisit:"May 2, 2016", url:'wiki/wwII'},{title:'Mercedes', category:"Transportation", visitCount:4, lastVisit:"May 2, 2016", url:'wiki/Mercedes'},{title:'Truck', category:"Transportation",visitCount:2, lastVisit:"May 2, 2016", url:'wiki/truck'}]
    }
    //function bindnign statment ehre
  }

  componentDidMount() {

  }


  render() {

  return (
    <div>
       <table className="tableHeader">
         <tbody>
            <tr className="descRow">
              <th>Page Title</th>
              <th>Page Category</th>
              <th>Visit Count</th>
              <th>Page Url</th>
              <th>Last Visit Date</th>
            </tr>
            {this.state.nodeData.map(data => {
              return(
                <tr className="dataRow">
                  <th>{data.title}</th>
                  <th>{data.category}</th>
                  <th>{data.visitCount}</th>
                  <th>/{data.url}</th>
                  <th>{data.lastVisit}</th>
                </tr>
                )
            })   }
            </tbody>
        </table>
    </div>

  )}
}

export default Modal
