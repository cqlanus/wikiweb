import React from 'react'
const d3 = require('d3')

class UserModal extends React.Component {
  constructor(props) {
    super(props)
    this.state = {
      viewtodisplay: null,
      ACategories: {
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
      pageHistory: [2,3,5,],
      totalArticles: 18,
      totalPageVisits: 30,
    }
   this.CalculateTopCategories = this.CalculateTopCategories.bind(this)
   this.SortCat = this.SortCat.bind(this)
  }


  componentWillMount() {
    console.log('props in did mount',this.props.cat)
   this.setState({
     ACategories: this.props.cat
   })
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
              <th>Top Catagories</th>
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
