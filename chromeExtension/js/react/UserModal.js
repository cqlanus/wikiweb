import React from 'react'
const d3 = require('d3')

class UserModal extends React.Component {
  constructor(props) {
    super(props)
    this.state = { }
   this.CalculateTopCategories = this.CalculateTopCategories.bind(this)
   this.SortCat = this.SortCat.bind(this)
  }

  ObjtoArr(cat){
    return Object.keys(cat).map(key=>{
      return {[key]:cat[key]}
  })
}

  SortCat(a,b){
    if(a[Object.keys(a)[0]] < b[Object.keys(b)[0]]) { return -1 }
    if(b[Object.keys(b)[0]] < a[Object.keys(a)[0]]) { return 1  }
    return 0
  }

  CalculateTopCategories(arr){
    console.log('arr', arr)
    const sortedCat = arr.sort(this.SortCat)
    return sortedCat.slice(-5).reverse()
  }


  render() {
    let arr = this.ObjtoArr(this.props.cat);
    let sortedARR = arr.sort(this.SortCat)
    let topFive = this.CalculateTopCategories(sortedARR)
   // console.log('props in render',this.props.cat)

  return (
    <div>
       <table className="tableHeader">
         <tbody>
            <tr className="descRow">
              <th>Top 5 Catagories</th>
              <th>Number of Visits</th>
            </tr>
              {topFive.map(data => {
                return <tr className="dataRow" key={Object.keys(data)[0]}>
                  <td>{Object.keys(data)[0]}</td>
                  <td>{data[Object.keys(data)[0]]}</td>
                </tr>
              })}
            </tbody>
        </table>
    </div>

  )}
}

export default UserModal
