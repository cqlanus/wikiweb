import React from 'react'
const d3 = require('d3')



class SentimentModal extends React.Component {
  constructor(props) {
    super(props)

    this.state = {
     nodeData: [],
  }

  }

  componentDidMount() {
    console.log('component did mount', this.props)

  }

  componentWillReceiveProps() {
    console.log('props changed')
  }
  



  render() {
    console.log('rendering SM with this node data', this.props.nodeData)
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
            {this.props.nodeData.map(data => {
              return(
                <tr key={data.url} className="dataRow">
                  <td>{formatTitle(data.title)}</td>
                  <td>{data.category}</td>
                  <td>{data.visitCount}</td>
                  <td><a href={`https://en.wikipedia.org/wiki/`+data.url}>Link</a></td>
                  <td>{formatDate(data.updatedAt)}</td>
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

function formatDate(dateStr) {
  let newDate = new Date(dateStr).toString()
  newDate=newDate.slice(0, newDate.indexOf('GMT'))
  return newDate
}

export default SentimentModal
