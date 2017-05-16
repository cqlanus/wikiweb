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

  render() {


  return (
      <div className="TopRow">
          <div className="table-row header">
            <div className="text">Title</div>
            <div className="text">Category</div>
            <div className="num">Visit Count</div>
            <div className="num">Last Visited</div>

          </div>
        <div className="container-fluid">

          {this.props.selectedNodes.map(node => {
            const data = node.__data__
            return (
               <div className="table-row" key={data.id}>
                <div className="text"><a href={data.url}>{formatTitle(data.title)}</a></div>
                <div className="text">{data.category}</div>
                <div className="num">{data.visitCount}</div>
                <div className="num">{fixTime(data.updatedAt)}</div>
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

function fixTime(dbDate) {
  const dateSpecifier = "%x"
  const dateFormat = d3.timeFormat(dateSpecifier)
  var date = new Date(dbDate)
  const output = dateFormat(date)
  console.log()
      // var offsetms = date.getTimezoneOffset() * 60 * 1000;
      // let timeCorrect = Date.parse(dbDate)

      return output
    }

export default Modal
