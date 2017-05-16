const d3 = require('d3')

const createPieChart = (nodesArr) => {
  // console.log('nodesArr in pie', nodesArr.map(cat => cat.name))
  const svg = d3.select('#pieChart')
  let width = 300,
      height = 150,
      margin = {top: 20, bottom: 20, left: 20, right: 20},
      radius = Math.min(width, height) / 2,
      group = svg.append('g').attr('transform', `translate(${width/2}, ${height/2})`)

  svg.style('display', 'inline-block')
  /* CREATE COLOR SCALE */
  const color = d3.scaleOrdinal(d3.schemeCategory20).domain(nodesArr)
  console.log('sports color in pie', color('SPORTS'))

  const pie = d3.pie().sort(null).value(d => d.count)

  const path = d3.arc()
    .outerRadius(radius-10)
    .innerRadius(0)

  const label = d3.arc()
    .outerRadius(radius-40)
    .innerRadius(radius-40)
  const newNodesArr = nodesArr.slice()
  const arc = group.selectAll('.arc')
    .data(pie(newNodesArr.sort((a,b) => b.count-a.count).slice(0,5)))
    .enter().append('g')
    .attr('class', 'arc')

  arc.append('path')
    .attr('d', path)
    .attr('fill', d => color(d.data.name))

  // arc.append('text')
  //   .attr('transform', d => `translate(${label.centroid(d)})`)
  //   .attr('dy', '0.35em')
  //   .text(d => d.data.name)

}

module.exports = createPieChart