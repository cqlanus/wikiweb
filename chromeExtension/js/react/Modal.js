import React from 'react'
const d3 = require('d3')



class Modal extends React.Component {
  constructor(props) {
    super(props)

    this.state = {
     selectedNodes: [{title:'Barack Obama', category:"President", visitCount:2, lastVisit:"January 1, 2017", url:'wwI'},{title:'WWII', category:" WAR",  visitCount:1, lastVisit:"May 2, 2016", url:'wwII'},{title:'Mercedes', category:"Transportation", visitCount:4, lastVisit:"May 2, 2016", url:'Mercedes'},{title:'Truck', category:"Transportation",visitCount:2, lastVisit:"May 2, 2016", url:'truck'}],
    }
    //function bindnign statment ehre
  }

  ObjtoArr(cat){
    return Object.keys(cat).map(key=>{
      return {[key]:cat[key]}
  })
}
  render() {
    // let selectedNodes = [this.props.nodes]
    // console.log('SELECTED NODES',selectedNodes[0])
//    let categories = this.ObjtoArr(this.props.nodes)
    //console.log('????????',this.props.nodes)
    let categories = this.state.selectedNodes
    if(this.props.nodes){
        categories = this.ObjtoArr(this.props.nodes)
    }

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
            { categories.map(data => {
              return(
                <tr key={data.url} className="dataRow">
                  <td>{data.title}</td>
                  <td>{data.category}</td>
                  <td>{data.visitCount}</td>

                  <td><a href={`https://en.wikipedia.org/wiki/`+data.url}>{data.url}</a></td>
                  <td>{data.lastVisit}</td>
                </tr>
                )
            })}
            </tbody>
        </table>
    </div>

  )}
}

export default Modal
