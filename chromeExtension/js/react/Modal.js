import React from 'react'
const d3 = require('d3')



class Modal extends React.Component {
  constructor(props) {
    super(props)

    this.state = {
     viewtodisplay: null,
     nodeData: [],
     selectedNodes: {},
     totalArticles: 18,
     totalPageVisits: 30,
  }
  }

  componentDidMount() {

  }

  componentWillReceiveProps() {
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
          console.log('results', results)
          let nodeData=[]
          let keys=Object.keys(results)
          console.log('keys', keys)
          keys.forEach(key=>{
            let nodeOb = results[key]
            let newDate = new Date(nodeOb.updatedAt).toString()
            newDate=newDate.slice(0, newDate.indexOf('GMT'))
            console.log('newDate', newDate)
            results[key].updatedAt=newDate
            nodeData.push(results[key])
          })
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

function formatTitle(title) {
  const index = title.indexOf(' - Wiki')
  return title.substring(0, index)
}

export default Modal
