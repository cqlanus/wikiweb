import React from 'react'
const d3 = require('d3')



class Modal extends React.Component {
  constructor() {
    super()

    this.state = {
     viewtodisplay: null,
     nodeData: [{title:'Barack Obama', category:"President", visitCount:2, lastVisit:"January 1, 2017", url:'wwI'},{title:'WWII', category:" WAR",  visitCount:1, lastVisit:"May 2, 2016", url:'wwII'},{title:'Mercedes', category:"Transportation", visitCount:4, lastVisit:"May 2, 2016", url:'Mercedes'},{title:'Truck', category:"Transportation",visitCount:2, lastVisit:"May 2, 2016", url:'truck'}],
     selectedNodes: {2: true},
     totalArticles: 18,
     totalPageVisits: 30,
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
            { this.state.nodeData.map(data => {
              return(
                <tr key={data.url} className="dataRow">
                  <th>{data.title}</th>
                  <th>{data.category}</th>
                  <th>{data.visitCount}</th>

                  <th><a href={`https://en.wikipedia.org/wiki/`+data.url}>{data.url}</a></th>
                  <th>{data.lastVisit}</th>
                </tr>
                )
            })}
            </tbody>
        </table>
    </div>

  )}
}

export default Modal
