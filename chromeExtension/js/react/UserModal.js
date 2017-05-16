import React from 'react'
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
    fetch('http://localhost:8000/api/nodes/cat', {
      method: 'GET',
    })
    .then((nodeResponse)=>{
     return nodeResponse.json()
     })
    .then((results)=>{
      let categoryOb = {}
      results.forEach(cat=>{
        let catName=cat.category
        let catCount=cat.visitCount
        if (categoryOb[catName]) {
          categoryOb[catName]+=catCount
        } else {
          categoryOb[catName]=catCount
        }
      })
      return categoryOb

    })
    .then(categoryOb=>{
        let categoryNames = Object.keys(categoryOb)
        let categoryCounts = Object.values(categoryOb)
        let catArr=[]
        for (var i=0; i<categoryNames.length; i++) {
          catArr.push({name: categoryNames[i], count: categoryCounts[i]})
        }
        catArr.sort(function(a, b){
          return b.count-a.count
        })
        this.setState({
          Categories: categoryOb,
          CategoryArray: catArr
        })
        //return orderCatArr
      })
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
    })).sort((a,b) => b.count-a.count).slice(0, 5)

    return catObjArr
  }


  render() {
    const topCategories = this.getCatObj(this.props.nodes)
    return (
          <div className="TopRow-Cat CatTable">
              <div className="table-row-Cat header">
                <div className="text-Cat">Top Categories</div>
                <div className="text-Cat">Number of Visits</div>
              </div>
            <div className="container-fluid-Cat">

              {topCategories.map((data, i) => {
                return (
                  <div className="table-row-Cat" key={i}>
                    <div className="text-Cat">{data.name}</div>
                    <div className="num-Cat">{data.count}</div>
                  </div>
                )
              } ) }
            </div>
            </div>
        )
  }
}

export default UserModal

/*

removed
{sortedARR.map(data => {
                return <tr className="dataRow" key={Object.keys(data)[0]}> <th>{Object.keys(data)[0]}</th> <th>{data[Object.keys(data)[0]]}</th></tr>
              })}
*/
