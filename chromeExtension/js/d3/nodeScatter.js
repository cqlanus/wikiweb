const d3 = require('d3')

const createNodeScatter = (nodesArray) => {
  d3.select('.scatter').remove()
  let dates = []
  nodesArray.forEach(node => {
    let nestArr = node.datesVisited.map(date => {
      return {
      date: date,
      category: node.category,
      title: node.title
      }
    })
    dates = [...dates, ...nestArr]
  })
  const modDatesArr = formatTime(dates)

  let parentWidth = d3.select('svg').node().parentNode.clientWidth,
      parentHeight = d3.select('svg').node().parentNode.clientHeight,
      svgMargin = {top: 50, left: 80, bottom: 160, right: 50},
      brushMargin = {top: 600, left: 80, bottom: 30, right: 50},
      brushWidth = parentWidth-brushMargin.left-brushMargin.right,
      brushHeight = 35

  /* GET SVG ELEMENT ON PAGE */
  const svg = d3.select("svg")
    .attr('width', parentWidth)
    .attr('height', parentHeight)
    .attr('class', 'scatter svg')

  svg.append("defs").append("clipPath")
    .attr("id", "clip")
    .append('rect')
    .attr('width', parentWidth-svgMargin.left - 50)
    .attr('height', parentHeight-svgMargin.top - svgMargin.bottom)

  const focus = svg.append('g')
    .attr('class', 'focus')
    .attr('transform', `translate(${svgMargin.left+100}, ${svgMargin.top})`)

  /* CREATE COLOR SCALE */
  const color = d3.scaleOrdinal(d3.schemeCategory20);

  /* CREATE X-SCALE & DOMAIN */
  function addDaystoDate(days, date) {
    const offsetms = days * 24 * 60 * 60 * 1000
    const newTime = Date.parse(date) + offsetms

    return new Date(newTime)
  }
  const dateDomain = d3.extent(modDatesArr.map(obj => obj.date))
  const originDate = addDaystoDate(-1, dateDomain[0])
  const endDate = addDaystoDate(1, dateDomain[1])
  const xScale = d3.scaleTime()
    .domain([originDate, endDate])
    .range([0, parentWidth-svgMargin.right-svgMargin.left-100])

  /* CREATE Y-SCALE & DOMAIN */
  const yScale = d3.scaleTime()
    .domain([new Date(1900, 0, 1), new Date(1900, 0, 2)])
    .range([parentHeight-svgMargin.bottom-svgMargin.top, 0])
    .nice(d3.timeDay)

  /* BUILD X AND Y AXIS */
  const xAxis = d3.axisBottom(xScale)
    .ticks(10)

  const yAxis = d3.axisLeft(yScale)
    .ticks(10)
    .tickFormat(d3.timeFormat('%I %p'))

  /* ATTACH NODE DATA */
  const dots = focus.append('g')
    dots.attr("clip-path", "url(#clip)")
    .selectAll('circle')
    .data(modDatesArr)
    .enter().append('circle')
    // .classed('dot show', true)
    .attr('class', d => {
      return `${d.category.split(' ').join('')} show dot`})
    .attr('cx', d => xScale(d.date))
    .attr('cy', d => yScale(d.time))
    .attr('r', 10)
    .attr('fill', d => color(d.category))
    .attr('stroke', 'black')
    .attr('opacity', 0.7)

  /* ATTACH X-AXIS */
  focus.append('g')
    .attr('class', 'axis-x')
    .call(xAxis)
    .attr('transform', `translate(0, ${parentHeight-svgMargin.bottom-svgMargin.top})`)

  /* ATTACH Y-AXIS */
  focus.append('g')
    .attr('class', 'axis-y')
    .call(yAxis)

  createBrushX(brushWidth,
              brushHeight,
              brushMargin,
              xScale,
              yScale,
              xAxis,
              modDatesArr)

  createBrushY(35,
              (parentHeight-svgMargin.bottom-svgMargin.top),
              brushMargin,
              yScale,
              xScale,
              yAxis,
              modDatesArr)

  /* CREATE HOVERABLE TOOLTIPS */
  const divTooltip = d3.select("body").append("div").attr("class", "toolTip")
    focus.on("mousemove", function(d){
      let elements = document.querySelectorAll(':hover');
      let l = elements.length
      l = l-1
      let elementData = elements[l].__data__
      if (elements[l].__data__ && elementData.title) {
        divTooltip.style("left", d3.event.pageX+10+"px");
        divTooltip.style("top", d3.event.pageY-25+"px");
        divTooltip.style("display", "inline-block");

        divTooltip.html(`
          ${elementData.title}
        `)
        }
      });
    focus.on("mouseout", function(d){
      divTooltip.style("display", "none");
      })


  const categories = nodesArray.map(node => node.category)
  const catSet = new Set(categories)
  const catArr = new Array(...catSet)
  createLegend(catArr, parentWidth, parentHeight, color)
}


function createBrushX(width, height, margin, outerX, outerY, outerXAxis, dataArr) {
  const brushX = d3.brushX()
    .extent([[0, 0], [width-100, height]])
    .on('brush', brushedX)

  const context = d3.select('svg').append('g')
    .attr('class', 'context')
    .attr('transform', `translate(${margin.left+100}, ${margin.top})`)

  const xScale = d3.scaleTime()
    .domain(outerX.domain())
    .range([0, width-100])

  const xAxis = d3.axisBottom(xScale)

  const dots = context.append('g')
    .selectAll('dot')
      .data(dataArr).enter().append('circle')
      .attr('class', 'dotContext')
      .attr('r', 5)
      .style('opacity', 0.5)
      .attr('cx', d => xScale(d.date))
      .attr('cy', 15)

  context.append('g')
    .attr('class', 'axis-x')
    .attr('transform', `translate(0, ${height})`)
    .call(xAxis)

  context.append('g')
    .attr('class', 'brush')
    .call(brushX)
    // .call(brushX.move, xScale.range())

  function brushedX() {
    const selected = d3.event.selection
    outerX.domain(selected.map(xScale.invert, xScale))
    d3.select('.focus').selectAll('.dot')
      .attr('cx', d => outerX(d.date))
      .attr('cy', d => outerY(d.time))
    d3.select('.focus').select('.axis-x').call(outerXAxis)
  }
}

function createBrushY(width, height, margin, outerY, outerX, outerYAxis, dataArr) {
  const brushY = d3.brushY()
    .extent([[0, 0], [width, height]])
    .on('brush', brushedY)

  const context = d3.select('svg').append('g')
    .attr('class', 'context')
    .attr('transform', `translate(70, 50)`)

  const yScale = d3.scaleTime()
    .domain(outerY.domain())
    .range([height, 0])

  const yAxis = d3.axisLeft(yScale)

  const dots = context.append('g')
    .selectAll('dot')
      .data(dataArr).enter().append('circle')
      .attr('class', 'dotContext')
      .attr('r', 5)
      .style('opacity', 0.5)
      .attr('cx', 20)
      .attr('cy', d => yScale(d.time))

  context.append('g')
    .attr('class', 'axis-y')
    .attr('transform', `translate(0, 0)`)
    .call(yAxis)

  context.append('g')
    .attr('class', 'brush')
    .call(brushY)
    // .call(brushY.move, yScale.range())

  function brushedY() {
    const selected = d3.event.selection
    selected[1] > 1 ?
    outerY.domain([yScale.invert(selected[1]), yScale.invert(selected[0])]) :
    outerY.domain([yScale.invert(selected[0]), yScale.invert(selected[1])])
    d3.select('.focus').selectAll('.dot')
      .attr('cx', d => outerX(d.date))
      .attr('cy', d => outerY(d.time))
    d3.select('.focus').select('.axis-y').call(outerYAxis)
  }
}

function formatTime (datesArray) {

  function fixTime(dbDate) {
      var date = new Date(dbDate)
      // var offsetms = date.getTimezoneOffset() * 60 * 1000;
      // let timeCorrect = Date.parse(dbDate)

      return date
    }

  /* CREATE DATE PARSING FUNCTION */
    const parseDate = d3.timeParse("%Y-%m-%dT%H:%M:%S.%LZ")

    /* CREATE TIME FORMATTING FUNCTION */
    const timeSpecifier = "%I:%M:%S %p"
    const timeFormat = d3.timeFormat(timeSpecifier)
    const timeParse = d3.timeParse(timeSpecifier)

    const time24Specifier = "%X"
    const time24Format = d3.timeFormat(time24Specifier)
    const time24Parse = d3.timeParse(time24Specifier)

    /* CREATE DATE FORMATTING FUNCTION x*/
    const dateSpecifier = "%x"
    const dateFormat = d3.timeFormat(dateSpecifier)
    const dateParse = d3.timeParse(dateSpecifier)

    /* PARSE DATES ARRAY INTO DATES AND TIMES */
    const modDatesArr = datesArray.map((obj, i) => {
      // console.log('what is this', dates)
      return {
        full: fixTime(obj.date),
        date: dateParse(dateFormat(fixTime(obj.date))),
        time: timeParse(timeFormat(fixTime(obj.date))),
        time24: time24Parse(time24Format(fixTime(obj.date))),
        category: obj.category,
        title: obj.title
      }
    })

    return modDatesArr
}

function createLegend(dataArr, width, height, colors) {
  const legend = d3.select('svg').selectAll('.legend')
    .data(dataArr)
    .enter().append('g')
    .attr('class', 'legend')

  legend.append('rect')
    .attr('class', 'legend')
    .attr('x', width - 170)
    .attr('y', (d, i) => (i*25 + 20))
    .attr('width', 18)
    .attr('height', 18)
    .attr('fill', d => colors(d))

  legend.append('text')
    .attr('x', width - 140)
    .attr('y', (d, i) => (i*25 + 33))
    .text(d => {
      return d.length > 17 ? `${d.substring(0, 17)}...` : d})
    .attr('fill', 'white')
    .style('font-size', '10px')
}

function createNodeScatterWrapper (nodesObj) {
  const GET_SINGLE_NODE = 'GET_SINGLE_NODE'

  /* MAKE A GET REQUEST FOR SINGLE NODE */
  chrome.runtime.sendMessage({
    type: GET_SINGLE_NODE,
    data: {
      nodes: nodesObj
    }
  }, nodesArray => {
    createNodeScatter(nodesArray)
  })
}

export default createNodeScatterWrapper