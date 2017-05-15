import React from 'react'
const d3 = require('d3')



class Modal extends React.Component {
  constructor(props) {
    super(props)

    this.state = {
     viewtodisplay: null,
     nodeData: [{title:'Barack Obama', category:"President", visitCount:2, lastVisit:"January 1, 2017", url:'wwI'},{title:'WWII', category:" WAR",  visitCount:1, lastVisit:"May 2, 2016", url:'wwII'},{title:'Mercedes', category:"Transportation", visitCount:4, lastVisit:"May 2, 2016", url:'Mercedes'},{title:'Truck', category:"Transportation",visitCount:2, lastVisit:"May 2, 2016", url:'truck'}],
     selectedNodes: {2: true},
     totalArticles: 18,
     totalPageVisits: 30,
  }
  }

  componentDidMount() {

  }

  componentWillReceiveProps() {
    console.log('component will receive prop')
    if (this.props.selectedNodes) {
      let nodeIdsArr= Object.keys(this.props.selectedNodes)
      let modalProm = fetch('http://localhost:8000/api/nodes/byId', {
          method: 'POST',
          headers: {
          "Content-type": "application/json"
          },
          body: JSON.stringify(nodeIdsArr)
        })
        .then((nodeResponse)=>{
          return nodeResponse.json()
        })
        .then((results)=>{
          let nodeData=[]
          let keys=Object.keys(results)
          keys.forEach(key=>{
          nodeData.push(results[key])
          })
          console.log('nodeData', nodeData)
          this.setState({
            nodeData: nodeData,
          })
        })
      return modalProm
  }
}


  render() {

  return (
      <div className="TopRow">
          <div className="table-row header">
            <div className="text">Title</div>
            <div className="text">Category</div>
            <div className="num">Visit Count</div>
            <div className="num">Updated</div>

          </div>
        <div className="container-fluid">

          {this.state.nodeData.map(data => {
            return (
               <div className="table-row">
                <div className="text">{data.title}</div>
                <div className="text">{data.category}</div>
                <div className="num">{data.visitCount}</div>
                <div className="num">{data.updatedAt}</div>
              </div>
            )
          } ) }
        </div>
        </div>
    )

  }
}

export default Modal
