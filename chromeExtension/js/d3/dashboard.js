/************************************************

Source Attribution:
Mike Bostock - Force-Directed Graph
https://bl.ocks.org/mbostock/4062045

************************************************/

const d3 = require('d3')

const buildWikiWeb = (results) => {
  let parentWidth = d3.select('svg').node().parentNode.clientWidth,
      parentHeight = 600;

  /* GET SVG ELEMENT ON PAGE */
  const svg = d3.select("svg")
    .attr('width', parentWidth)
    .attr('height', parentHeight)

  /* PARENT EL */
  const gMain = svg.append('g')
    .classed('g-main', true)

  /* ATTACH RECT TO SIMULATE EMPTY SPACE FOR ZOOM/PAN BEHAVIOR */
  const rect = gMain.append('rect')
    .attr('class', 'rect')
    .attr('width', parentWidth)
    .attr('height', parentHeight)
    .attr('fill', '#7f7e7b')

  const gDraw = gMain.append('g')
    .classed('draw', true)

  createZoomBehavior(gMain, gDraw)

  /* CREATE COLOR SCALE */

  const categories = results.nodes.map(node => node.category)
  const catSet = new Set(categories)
  const catArr = new Array(...catSet)
  const color = d3.scaleOrdinal(d3.schemeCategory20).domain(catArr)
  createLegend(catArr, parentWidth, parentHeight, color)

  let legend = d3.select('.legend')
  legend.on('click', d => {
    console.log(d)
  })

  let text = gMain.append('text')
    .attr('transform', `translate(${parentWidth - 250}, ${parentHeight - 50})`)
    .style('font-size', '15px')
    .style('fill', 'white')

  text.append('tspan')
    .attr('x', 0)
    .attr('dy', '1em')
    .text('Click to select a node')

  text.append('tspan')
    .attr('x', 0)
    .attr('dy', '1.6em')
    .text('Press shift to select multiple nodes')


  const gBrushHolder = gDraw.append('g')
  let gBrush = null
  let brushMode = false
  let brushing = false
  let shiftKey

  /* ATTACH LINES TO SVG AS LINKS */
  let link = gDraw.append("g")
      .attr("class", "links")
    .selectAll("line")
    .data(results.links)
    .enter().append("line")
      .attr("stroke-width", function(d) { return d.strength; })
      .attr('stroke', '#fff')

  /* ATTACH CIRCLES TO SVG AS NODES */
  let node = gDraw.append("g")
      .attr("class", "nodes")
    .selectAll("circle")
    .data(results.nodes)
    .enter().append("circle")
      .attr("r", function(d){return d.visitCount * 10})
      .attr("fill", d => color(d.category))
      .attr('id', d => d.id)
      .attr('class', 'forceDots')
      .call(d3.drag()
        .on("start", dragstarted)
        .on("drag", dragged)
        .on("end", dragended));

  const simulation = createForceSim({
    w: parentWidth,
    h: parentHeight,
    results,
    node,
    link
  })
  createBrushBehavior({
    gBrushHolder,
    gBrush,
    brushing,
    brushMode,
    node,
    shiftKey
  })
  createToolTip(node)

  rect.on('click', () => {
    node.each(d => {
        d.selected = false
        d.previouslySelected = false
      })
    node.classed('selected', false)
  })

  function dragstarted(d) {
    if (!d3.event.active) simulation.alphaTarget(0.3).restart();

    // d3.select(this).classed("selected", true)

    d3.select(this).classed("selected", function(p) {
        d.previouslySelected = d.selected;
        return d.selected = true; })


    const selectedObj = {}
    d3.selectAll('.selected').nodes()
      .forEach(node => {selectedObj[parseInt(node.id)] = true})

    chrome.runtime.sendMessage({
      type: 'SET_SELECTED',
      data: selectedObj
    }, (selected) => {
      // console.log('selected', selected)
    })

    node.filter(d => d.selected)
      .each(d => {
        d.fx = d.x;
        d.fy = d.y;
      })
  }

  function dragged(d) {
    node.filter(d => d.selected)
    .each(d => {
      d.fx += d3.event.dx;
      d.fy += d3.event.dy;
    })
  }

  function dragended(d) {
    if (!d3.event.active) simulation.alphaTarget(0);
    d.fx = null;
    d.fy = null;

    node.filter(d => d.selected)
    .each(d => {
      d.fx = null
      d.fy = null
    })
  }
}

function createForceSim(options) {
  /* DEFINE FORCE GRAPH RULES */
  const simulation = d3.forceSimulation()
    .force("link", d3.forceLink().id(function(d) { return d.id; }).distance(d => (options.h - 200)/d.strength))
    .force("charge", d3.forceManyBody().distanceMax(200))
    .force("center", d3.forceCenter(options.w / (2), options.h / 2))
    .velocityDecay(0.5)

  simulation
    .nodes(options.results.nodes)
    .on("tick", ticked);

  simulation
    .force("link")
    .links(options.results.links)

  function ticked() {
    options.link
        .attr("x1", function(d) { return d.source.x; })
        .attr("y1", function(d) { return d.source.y; })
        .attr("x2", function(d) { return d.target.x; })
        .attr("y2", function(d) { return d.target.y; });

    options.node
        .attr("cx", function(d) { return d.x; })
        .attr("cy", function(d) { return d.y; });
  }
  return simulation
}

function createBrushBehavior (options) {

  const brush = d3.brush()
    .on('start', brushstarted)
    .on('brush', brushed)
    .on('end', brushended)

  function brushstarted() {
    options.brushing = true
    options.node.each(d => {
      return d.previouslySelected = options.shiftKey && d.selected})
  }

  function brushed() {
    if (!d3.event.sourceEvent) return
    if (!d3.event.selection) return
    const extent = d3.event.selection
    options.node.classed('selected', d => {
      /* ^ is XOR operator -- toggles selected */
      return d.selected = d.previouslySelected ^
      (extent[0][0] <= d.x && d.x < extent[1][0]
       && extent[0][1] <= d.y && d.y < extent[1][1])
    })

    const selectedObj = {}
    d3.selectAll('.selected').nodes()
      .forEach(node => {selectedObj[parseInt(node.id)] = true})

    chrome.runtime.sendMessage({
      type: 'SET_SELECTED',
      data: selectedObj
    }, (selected) => {
      // console.log('selected', selected)
    })
  }

  function brushended() {
    if (!d3.event.sourceEvent) return;
    if (!d3.event.selection) return;
    if (!options.gBrush) return;

    options.gBrush.call(brush.move, null)

    if (!options.brushMode) {
      options.gBrush.remove()
      options.gBrush = null
    }
    options.brushing = false
  }

  d3.select('body').on('keydown', keydown)
  d3.select('body').on('keyup', keyup)

  function keydown() {
    options.shiftKey = d3.event.shiftKey
    if (options.shiftKey) {

      options.brushMode = !options.brushMode
      options.brushing = !options.brushing
    }
    toggleBrush()
  }

  function toggleBrush() {
    if (!options.gBrush) {
      options.gBrush = options.gBrushHolder.append('g')
      options.gBrush.call(brush)
    } else {
      options.gBrush.remove()
      options.gBrush = null
    }
  }

  function keyup() {
    options.shiftKey = false
  }
}

function createZoomBehavior(canvas, drawSpace) {
  /* CREATE ZOOM BEHAVIOR */
  const zoom = d3.zoom()
    .scaleExtent([0.5, 16])
    .on('zoom', zoomed)

  /* ATTACH ZOOM BEHAVIOR TO PARENT EL (gMain) */
  canvas.call(zoom)

  function zoomed() { drawSpace.attr('transform', d3.event.transform)}
}

function createToolTip(node) {
 /* CREATE HOVERABLE TOOLTIPS */
  const divTooltip = d3.select("body").append("div").attr("class", "toolTip")
    node.on("mousemove", function(d){
      divTooltip.style("left", d3.event.pageX+10+"px");
      divTooltip.style("top", d3.event.pageY-25+"px");
      divTooltip.style("display", "inline-block");
      let elements = document.querySelectorAll(':hover');
      let l = elements.length
      l = l-1
      let elementData = elements[l].__data__
      // console.log(elementData)
      divTooltip.html(`
        ${formatTitle(elementData.title)} <br>
      `);
      });
    node.on("mouseout", function(d){
      divTooltip.style("display", "none");
      })
}

function createLegend(dataArr, width, height, colors) {
  const legend = d3.select('.g-main').selectAll('.legend')
    .data(dataArr)
    .enter().append('g')
    .attr('class', 'legend')

  legend.append('rect')
    .attr('x', 10)
    .attr('y', (d, i) => height - (i*25 + 30))
    .attr('width', 18)
    .attr('height', 18)
    .attr('fill', d => colors(d))

  legend.append('text')
    .attr('x', 35)
    .attr('y', (d, i) => height - (i*25 + 18))
    .text(d => d)
    .attr('fill', 'white')

}

function formatTitle(title) {
  const idx = title.indexOf(' - Wiki')
  return title.substring(0, idx)
}

const createForceChartWrapper = (googleId) => {
  /* MAKE A GET REQUEST FOR CURRENT USER */
  chrome.runtime.sendMessage({
    type: 'getUser',
    data: googleId
  }, function (user) {
    buildWikiWeb(user)

  })
}

export default createForceChartWrapper
