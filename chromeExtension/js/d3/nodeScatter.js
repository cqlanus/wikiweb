const d3 = require('d3')

const createNodeScatter = () => {
  const GET_SINGLE_NODE = 'GET_SINGLE_NODE'

  /* MAKE A GET REQUEST FOR SINGLE NODE */
  chrome.runtime.sendMessage({
    type: GET_SINGLE_NODE,
    data: 17
  }, function(node) {
    console.log('we have a node', node)
    const dates = node.datesVisited

    let parentWidth = d3.select('svg').node().parentNode.clientWidth,
        parentHeight = d3.select('svg').node().parentNode.clientHeight;

    /* GET SVG ELEMENT ON PAGE */
    const svg = d3.select("svg")
      .attr('width', parentWidth)
      .attr('height', parentHeight)

    const parseDate = d3.timeParse('%Y-%m-%d %I:%M')

    console.log((dates[0]))

    const xScale = d3.scaleTime()
      .domain([dates[0], dates[dates.length-1]])
      .range([0, parentWidth])

    // const yScale = d3.scaleTime()
    //   .domain()
    //   .range()

    const xAxis = d3.axisBottom(xScale)
    // const yAxis = d3.axisBottom(yScale)
  })
}

export default createNodeScatter