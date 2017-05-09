const d3 = require('d3')

const createNodeScatter = () => {
  const GET_SINGLE_NODE = 'GET_SINGLE_NODE'

  /* MAKE A GET REQUEST FOR SINGLE NODE */
  chrome.runtime.sendMessage({
    type: GET_SINGLE_NODE,
    data: 17
  }, function(node) {
    const dates = node.datesVisited

    let parentWidth = d3.select('svg').node().parentNode.clientWidth,
        parentHeight = d3.select('svg').node().parentNode.clientHeight;

    /* GET SVG ELEMENT ON PAGE */
    const svg = d3.select("svg")
      .attr('width', parentWidth)
      .attr('height', parentHeight)

    /* CREATE DATE PARSING FUNCTION */
    const parseDate = d3.utcParse("%Y-%m-%dT%H:%M:%S.%LZ")

    /* CREATE TIME FORMATTING FUNCTION */
    const timeFormat = d3.timeFormat("%I:%M:%S %p")
    const timeParse = d3.utcParse("%I:%M:%S %p")

    const time24Format = d3.timeFormat('%H:%M:%S')
    const time24Parse = d3.utcParse('%H:%M:%S')

    /* CREATE DATE FORMATTING FUNCTION x*/
    const dateFormat = d3.timeFormat("%d-%m-%Y")
    const dateParse = d3.utcParse("%d-%m-%Y")

    /* PARSE DATES ARRAY INTO DATES AND TIMES */
    const modDatesArr = dates.map(date => {
      return {
        full: parseDate(date),
        date: dateParse(dateFormat(parseDate(date))),
        time: timeParse(timeFormat(parseDate(date))),
        time24: time24Parse(time24Format(parseDate(date)))
      }
    })

    console.log('datesObjArr', modDatesArr)

    /* CREATE X-SCALE & DOMAIN */
    const dateDomain = d3.extent(modDatesArr.map(obj => obj.date))
    const xScale = d3.scaleTime()
      .domain(dateDomain)
      .range([0, parentWidth-100])


    /* CREATE Y-SCALE & DOMAIN */
    const timeDomain = d3.extent(modDatesArr.map(obj => obj.time))
    const yScale = d3.scaleTime()
      .domain([new Date(1900, 0, 1), new Date(1900, 0, 2)])
      .range([parentHeight-100, 50])
      .nice(d3.timeDay)


    /* BUILD X AND Y AXIS */
    const xAxis = d3.axisBottom(xScale)
      .ticks(10)

    const yAxis = d3.axisLeft(yScale)
      .ticks(24)
      .tickFormat(d3.timeFormat('%I %p'))

    const g = svg.append('g')
      .attr('transform', 'translate(50, 0)')

    /* ATTACH X-AXIS */
    g.append('g')
      .attr('class', 'axis x')
      .call(xAxis)
      .attr('transform', `translate(0, ${parentHeight-100})`)

    /* ATTACH Y-AXIS */
    g.append('g')
      .attr('class', 'axis y')
      .call(yAxis)
      .attr('transform', `translate(0, 0)`)

    /* ATTACH NODE DATA */
    g.selectAll('circle')
      .data(modDatesArr)
      .enter().append('circle')
      .attr('class', 'dots')
      .attr('cx', d => xScale(d.date))
      .attr('cy', d => {
        console.log(yScale(d.time))
        return yScale(d.time)})
      .attr('r', 10)
      .attr('fill', 'indianred')
      .attr('stroke', 'black')
  })
}

export default createNodeScatter