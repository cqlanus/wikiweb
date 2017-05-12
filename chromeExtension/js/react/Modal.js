import React from 'react'
import createForceChart from '../d3/dashboard.js'
const d3 = require('d3')
const d3Zoom = require('../d3/historyzoomer')



class Modal extends React.Component {
  constructor() {
    super()

    this.state = {
     viewtodisplay: null,
     nodeData: [{title:'WWI',visitCount:2,url:'wiki/wwI'},{title:'WWII',visitCount:1,url:'wiki/wwII'},{title:'Mercedes',visitCount:4,url:'wiki/Mercedes'},{title:'Truck',visitCount:2,url:'wiki/truck'}]
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
              <th>Visit Count</th>
              <th>Page Url</th>
            </tr>
            {this.state.nodeData.map(data => {
              return<tr className="dataRow"><th>{data.title}</th><th>{data.visitCount}</th><th>/{data.url}</th></tr>
            })   }
            </tbody>
        </table>
    </div>

  )}
}

export default Modal
