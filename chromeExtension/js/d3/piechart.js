const d3 = require('d3')

const createPieChart = nodesArr => {

  const svg = d3.select('#pieChart')
  let width = 300,
      height = 300,
      margin = {top: 20, bottom: 20, left: 20, right: 20},
      radius = Math.min(width, height) / 2,
      group = svg.append('g').attr('transform', `translate(${width/2}, ${height/2})`)

  /* CREATE COLOR SCALE */
  const color = d3.scaleOrdinal(d3.schemeCategory20);

  const pie = d3.pie().sort(null).value(d => d.visitCount)

  const path = d3.arc()
    .outerRadius(radius-10)
    .innerRadius(0)

  const label = d3.arc()
    .outerRadius(radius-40)
    .innerRadius(radius-40)

  const arc = group.selectAll('.arc')
    .data(pie(nodesArr))
    .enter().append('g')
    .attr('class', 'arc')

  arc.append('path')
    .attr('d', path)
    .attr('fill', d => color(d.data.category))

  arc.append('text')
    .attr('transform', d => `translate(${label.centroid(d)})`)
    .attr('dy', '0.35em')
    .text(d => d.category)

}

module.exports = createPieChart