import React from 'react'
import createPieChart from '../d3/piechart.js'
import createLineChart from '../d3/linechart.js'

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

  formatVisitDates(nodes) {

    function stringifyDate(dbDate) {
      const dateSpecifier = "%x"
      const dateFormat = d3.timeFormat(dateSpecifier)
      var date = new Date(dbDate)
      const output = dateFormat(date)

      return output
    }

    function parseDate(dateString) {
      const dateSpecifier = "%x"
      const dateParse = d3.timeParse(dateSpecifier)

      return dateParse(dateString)
    }

    const visitDateObj = {}
    nodes.forEach(node => {
      // console.log('node in formatVisitDates', node)
      node.__data__.datesVisited.forEach(date => {
        const stringDate = stringifyDate(date)
        if (visitDateObj[stringDate]) {
          visitDateObj[stringDate] = visitDateObj[stringDate] + 1
        } else {
          visitDateObj[stringDate] = 1
        }
      })
    })

    const visitDateArr = Object.keys(visitDateObj).map(key => ({
      date: parseDate(key),
      count: visitDateObj[key]
    })).sort((a,b) => a.date-b.date)

    return visitDateArr
  }

  createCharts() {

  }

  render() {
    // console.log('nodes on render', this.props.nodes)
    const categoryArticles = this.getCatArr(this.props.nodes, 'articles')
    const categoryViews = this.getCatArr(this.props.nodes, 'views')
    const visitDates = this.formatVisitDates(this.props.nodes)

    createPieChart(categoryArticles, 'pieChartArticles', 'Articles Read by Category')
    createPieChart(categoryViews, 'pieChartViews', 'Page Views by Category')
    createLineChart(visitDates)

    return (
      <div>
        <div className="row">
        <div className="TopRow-Cat CatTable" style={{display: 'inline-block'}}>
          <div className="table-row-Cat header">
            <div className="text-Cat">Top Categories</div>
            <div className="text-Cat">Page Views</div>
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
          <svg height="230" width="100%" id="lineChart" className=""></svg>
        </div>

        <div className="row">
          <svg height="270" width="200" id="pieChartArticles" className="bottomChart"></svg>
          <svg height="270" width="200" id="pieChartViews" className="bottomChart"></svg>
          <svg height="270" width="200" id="pieChartSent" className="bottomChart"></svg>
          </div>
      </div>
        )
  }
}

export default UserModal
