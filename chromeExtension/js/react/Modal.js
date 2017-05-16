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
            {this.props.selectedNodes.map(node => {
              const data = node.__data__
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
