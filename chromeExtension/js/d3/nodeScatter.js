const d3 = require('d3')

const createNodeScatter = (nodesObj) => {
  const GET_SINGLE_NODE = 'GET_SINGLE_NODE'

  /* MAKE A GET REQUEST FOR SINGLE NODE */
  chrome.runtime.sendMessage({
    type: GET_SINGLE_NODE,
    data: {
      nodes: nodesObj
    }
  }, function(nodesArray) {
    console.log('nodesArray', nodesArray)
    let dates = []

    // const nodesArray = [node]

    nodesArray.forEach(page => {
      dates = [...dates, ...page.datesVisited]
    })

    function fixTime(dbDate) {
      var date = new Date(dbDate)
      var offsetms = date.getTimezoneOffset() * 60 * 1000;
      let timeCorrect = Date.parse(dbDate) - offsetms

      return new Date(timeCorrect)
    }

    let parentWidth = d3.select('svg').node().parentNode.clientWidth,
        parentHeight = d3.select('svg').node().parentNode.clientHeight;

    /* GET SVG ELEMENT ON PAGE */
    const svg = d3.select("svg")
      .attr('width', parentWidth)
      .attr('height', parentHeight)

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
    const modDatesArr = dates.map((date, i) => {
      // console.log('what is this', nodesArray[i].url)
      return {
        full: fixTime(date),
        date: dateParse(dateFormat(fixTime(date))),
        time: timeParse(timeFormat(fixTime(date))),
        time24: time24Parse(time24Format(fixTime(date)))
      }
    })

    console.log('datesObjArr', modDatesArr)

    /* CREATE X-SCALE & DOMAIN */
    const dateDomain = d3.extent(modDatesArr.map(obj => obj.date))
    const originDate = new Date(2017, 4, 1)
    const endDate = new Date(2017, 5, 1)
    const xScale = d3.scaleTime()
      .domain([originDate, endDate])
      .range([0, parentWidth-100])

    /* CREATE Y-SCALE & DOMAIN */
    const yScale = d3.scaleTime()
      .domain([new Date(1900, 0, 1), new Date(1900, 0, 2)])
      .range([parentHeight-100, 50])
      .nice(d3.timeDay)

    /* BUILD X AND Y AXIS */
    const xAxis = d3.axisBottom(xScale)
      .ticks(10)

    const yAxis = d3.axisLeft(yScale)
      .ticks(10)
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
      .attr('cy', d => yScale(d.time))
      .attr('r', 10)
      .attr('fill', 'indianred')
      .attr('stroke', 'black')

    /* CREATE HOVERABLE TOOLTIPS */
    const divTooltip = d3.select("body").append("div").attr("class", "toolTip")
        g.on("mousemove", function(d){
          divTooltip.style("left", d3.event.pageX+10+"px");
          divTooltip.style("top", d3.event.pageY-25+"px");
          divTooltip.style("display", "inline-block");
          let x = d3.event.pageX, y = d3.event.pageY
          let elements = document.querySelectorAll(':hover');
          let l = elements.length
          l = l-1
          let elementData = elements[l].__data__
          // console.log(elementData)
          divTooltip.html(`
            hello
          `);
          });
        g.on("mouseout", function(d){
          divTooltip.style("display", "none");
          })
  })
}

export default createNodeScatter