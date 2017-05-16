import React from 'react'
const d3 = require('d3')



class SentimentModal extends React.Component {
  constructor(props) {
    super(props)

    this.state = {
     nodeData: [],
  }

  }

  render() {

    return (
        <div className="TopRow">
          <div className="table-row header">
            <div className="text">Title</div>
            <div className="text">Category</div>
            <div className="num">Visit Count</div>
            <div className="num">Page URL</div>
            <div className="num">Updated</div>
          </div>
          <div className="container-fluid">
              {this.props.nodeData.map(data => {
              //const data = node.__data__
              return (
                <div key={data.url} className="table-row">
                  <div className="text">{data.title}</div>
                  <div className="text">{data.category}</div>
                  <div className="num">{data.visitCount}</div>
                  <div className="num">
                      <a href={data.url}>Link</a>
                  </div>
                  <div className="num">{formatDate(data.updatedAt)}</div>
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

function formatDate(dateStr) {
  let newDate = new Date(dateStr).toString()
  newDate=newDate.slice(0, newDate.indexOf('GMT'))
  return newDate
}

export default SentimentModal
