const d3 = require('d3')

const createLineChart = nodeArr => {
  d3.select('.lineGroup').remove()
  const svg = d3.select('#lineChart')

  let width = svg.node() ? svg.node().parentNode.clientWidth : null,
      height = 170,
      margin = {top: 20, bottom: 20, left: 30, right: 20},
      group = svg.append('g')
        .attr('transform', `translate(${margin.left}, ${margin.top})`)
        .attr('class', `lineGroup`)

  const xScale = d3.scaleTime()
    .rangeRound([0, width*.61])
    .domain(d3.extent(nodeArr, d => d.date))

  const yScale = d3.scaleLinear()
    .rangeRound([height, 0])
    .domain([0, d3.extent(nodeArr, d => d.count)[1]])

  const line = d3.line()
    .x(function(d) { return xScale(d.date) })
    .y(function(d) { return yScale(d.count) })

  group.append('g')
    .attr('transform', `translate(0, ${height})`)
    .attr('class', 'axis-x')
    .call(d3.axisBottom(xScale).ticks(4))
    // .select('.domain').remove()

  group.append('g')
    .attr('class', 'axis-y')
    .call(d3.axisLeft(yScale).ticks(6))

  group.append('path')
    .datum(nodeArr)
    .attr('fill', 'none')
    .attr('stroke', 'white')
    .attr('stroke-linejoin', 'round')
    .attr('stroke-linecap', 'round')
    .attr('stroke-width', 5)
    .attr('d', line)

  group.append('text')
    .attr('transform', `translate(${width/2-100}, 10)`)
    .text('Page Views Over Time')
    .attr('fill', 'white')
    .style('font-size', '18px')
}

function stringifyTime(dbDate) {
  const dateSpecifier = "%x"
  const dateFormat = d3.timeFormat(dateSpecifier)
  var date = new Date(dbDate)
  const output = dateFormat(date)

  return output
  }

function parseTime(dateString) {
  const dateSpecifier = "%x"
  const dateParse = d3.timeParse(dateSpecifier)

  return dateParse(dateString)
}

module.exports = createLineChart