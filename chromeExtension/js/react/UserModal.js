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


  getCatArr(nodes, charToCount) {
    const catObj = {}
    if (charToCount === 'articles') {
      nodes.forEach(node => {
        if(catObj[node.__data__.category]){
          catObj[node.__data__.category] = catObj[node.__data__.category] + 1
        } else {
          catObj[node.__data__.category] = 1
        }
      })
    } else {
      nodes.forEach(node => {
        if(catObj[node.__data__.category]){
          catObj[node.__data__.category] = catObj[node.__data__.category] + node.__data__.visitCount
        } else {
          catObj[node.__data__.category] = node.__data__.visitCount
        }
      })
    }

    const catObjArr = Object.keys(catObj).map(key => ({
      name: key,
      count: catObj[key]
    }))

    return catObjArr
  }


  render() {
    const categoryArticles = this.getCatArr(this.props.nodes, 'articles')
    const categoryViews = this.getCatArr(this.props.nodes, 'views')
    // console.log(categoryViews)
    // console.log('modal render', topCategories.map(cat => cat.name))
    createPieChart(categoryArticles, 'pieChartArticles')
    createPieChart(categoryViews, 'pieChartViews')
    return (
      <div>
        <div className="TopRow-Cat CatTable" style={{display: 'inline-block'}}>
          <div className="table-row-Cat header">
            <div className="text-Cat">Top Categories</div>
            <div className="text-Cat">Number of Visits</div>
          </div>
        <div className="container-fluid-Cat">

          {categoryArticles.sort((a,b) => b.count-a.count).slice(0,5).map((data, i) => {
            return (
              <div className="table-row-Cat" key={i}>
                <div className="text-Cat">{data.name}</div>
                <div className="num-Cat">{data.count}</div>
              </div>
            )
          } ) }
        </div>
        </div>

        <svg height="170" width="200" id="pieChartArticles"></svg>
        <svg height="170" width="200" id="pieChartViews"></svg>
      </div>
        )
  }
}

export default UserModal
