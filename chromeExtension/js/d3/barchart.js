const d3 = require('d3')

const createBarChart = (dataObj) => {
  const dataKeys = Object.keys(dataObj)

  const svg = d3.select("#barchart")
  let width = 300,
      height = 300,
      margin = {top: 20, bottom: 40, left: 20, right: 20}
  svg
  .attr('width', 300)
  .attr('height', 300)

  const xScale = d3.scaleBand()
    .domain(dataKeys)
    .rangeRound([0, width-margin.right])
  const xAxis = d3.axisBottom(xScale)

  const dataValues = dataKeys.map(key => dataObj[key])
  const yScale = d3.scaleLinear()
    .domain([0, Math.max(...dataValues)])
    .range([height-margin.bottom, 0])
  const yAxis = d3.axisLeft(yScale).ticks(4)

  const group = svg.append('g')
    .attr('transform', `translate(${margin.left}, ${margin.top})`)

  group.append('g')
    .attr('class', 'x axis')
    .call(xAxis)
    .attr('transform', `translate(0, ${height-margin.bottom})`)

  group.append('g')
    .attr('class', 'y axis')
    .call(yAxis)


  group.selectAll('.bar')
    .data(dataKeys)
    .enter().append('rect')
      .attr('class', 'bar')
      .attr('width', 50)
      .attr('x', (d, i) => 55*i)
      .attr('y', d => ((height) - dataObj[d]*26) )
      .attr('height', d => dataObj[d]*26)
      .attr('fill', 'steelblue')
      .attr('transform', `translate(${5}, ${-margin.bottom})`)
}

module.exports = createBarChart