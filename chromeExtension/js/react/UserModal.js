import React from 'react'
const d3 = require('d3')

function compare(obA, obB) {
  if (obA.count<obB.count) {
    return -1
  } 
  if (obA.count>obB.count) {
    return 0
  }
}

class UserModal extends React.Component {
  constructor() {
    super()
    this.state = {
      viewtodisplay: null,
      Categories: {
      'Law': 2,
      'Culture': 8,
      'Movies': 4,
      'Science': 2,
      'People': 1,
      'Actors': 1,
      'Beer': 2,
      'Government': 7,
      'Education': 4,
      'Politics': 9,
      'Religion': 12,
      'Weather': 2 ,
      'Real Estate': 1
    },
      CategoryArray: [],
      pageHistory: [2,3,5,],
      totalArticles: 18,
      totalPageVisits: 30,
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
    
 


  render() {
    // let arr = this.ObjtoArr(this.state.Categories);
    // let sortedARR = arr.sort(this.SortCat)
   // console.log(sortedARR)
  return (
    <div>
       <table className="tableHeader">
         <tbody>
            <tr className="descRow">
              <th>Top Categories</th>
              <th>Number of Visits</th>
            </tr>
              {this.state.CategoryArray.map(data => {
                return <tr className="dataRow" key={data.name}> <th>{data.name}</th> <th>{data.count}</th></tr>
              })} 
            </tbody>
        </table>
    </div>

  )}
}

export default UserModal

/*

removed 
{sortedARR.map(data => {
                return <tr className="dataRow" key={Object.keys(data)[0]}> <th>{Object.keys(data)[0]}</th> <th>{data[Object.keys(data)[0]]}</th></tr>
              })} 
*/