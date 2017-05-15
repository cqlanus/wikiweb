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
    // console.log('rendering with this node data', this.state.nodeData)
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
                <tr key={data.url} className="dataRow">
                  <td>{formatTitle(data.title)}</td>
                  <td>{data.category}</td>
                  <td>{data.visitCount}</td>
                  <td><a href={`https://en.wikipedia.org/wiki/`+data.url}>Click Here</a></td>

                  <td>{data.updatedAt}</td>
                </tr>
                )
            })}
            </tbody>
        </table>
    </div>
    )
  }
}

function formatTitle(title) {
  const index = title.indexOf(' - Wiki')
  return title.substring(0, index)
}

export default Modal
