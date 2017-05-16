import React from 'react'
import createPieChart from '../d3/piechart.js'

const d3 = require('d3')




class UserModal extends React.Component {
  constructor() {
    super()
    this.state = {
      viewtodisplay: null,
      Categories: {},
      CategoryArray: [],
      pageHistory: [],
      totalArticles: 0,
      totalPageVisits: 0,
    }

  }



  componentDidMount() {

  }


  getCatObj(nodes) {
    const catObj = {}

    nodes.forEach(node => {
      if(catObj[node.__data__.category]){
        catObj[node.__data__.category] = catObj[node.__data__.category] + 1
      } else {
        catObj[node.__data__.category] = 1
      }
    })

    const catObjArr = Object.keys(catObj).map(key => ({
      name: key,
      count: catObj[key]
    }))

    return catObjArr
  }


  render() {
    const topCategories = this.getCatObj(this.props.nodes)
    console.log('modal render')
    createPieChart(topCategories)
    return (
      <div>
        <div className="TopRow-Cat CatTable" style={{display: 'inline-block'}}>
          <div className="table-row-Cat header">
            <div className="text-Cat">Top Categories</div>
            <div className="text-Cat">Number of Visits</div>
          </div>
        <div className="container-fluid-Cat">

          {topCategories.sort((a,b) => b.count-a.count).slice(0,5).map((data, i) => {
            return (
              <div className="table-row-Cat" key={i}>
                <div className="text-Cat">{data.name}</div>
                <div className="num-Cat">{data.count}</div>
              </div>
            )
          } ) }
        </div>
        </div>

        <svg id="pieChart"></svg>
      </div>
        )
  }
}

export default UserModal
