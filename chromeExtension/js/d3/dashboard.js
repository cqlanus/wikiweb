const d3 = require('d3')

const createForceChart = () => {
  const GET_USER = 'getUser'

  /* MAKE A GET REQUEST FOR CURRENT USER */
  chrome.runtime.sendMessage({
    type: GET_USER,
    data: 1
  }, function(results) {

    let parentWidth = d3.select('svg').node().parentNode.clientWidth,
        parentHeight = d3.select('svg').node().parentNode.clientHeight;

    /* GET SVG ELEMENT ON PAGE */
    const svg = d3.select("svg")
      .attr('width', parentWidth)
      .attr('height', parentHeight)

    const gMain = svg.append('g')
      .classed('g-main', true)

    const rect = gMain.append('rect')
      .attr('width', parentWidth)
      .attr('height', parentHeight)
      .attr('fill', 'white')

    const gDraw = gMain.append('g').classed('draw', true)

    /* CREATE ZOOM BEHAVIOR */
    const zoom = d3.zoom().on('zoom', zoomed)

    /* ATTACH ZOOM BEHAVIOR */
    gMain.call(zoom)

    function zoomed() { gDraw.attr('transform', d3.event.transform)}

    const rect = gMain.append('rect')
      .attr('width', parentWidth)
      .attr('height', parentHeight)
      // .attr('fill', 'white')

    const gDraw = gMain.append('g')

    /* CREATE ZOOM BEHAVIOR */
    const zoom = d3.zoom().on('zoom', zoomed)

    /* ATTACH ZOOM BEHAVIOR */
    gMain.call(zoom)

    function zoomed() { gDraw.attr('transform', d3.event.transform)}
    /* CREATE COLOR SCALE */
    const color = d3.scaleOrdinal(d3.schemeCategory20);

    const gBrushHolder = gDraw.append('g')
    let gBrush = null
    let brushMode = false
    let brushing = false

    /* ATTACH LINES TO SVG AS LINKS */
    let link = gDraw.append("g")
        .attr("class", "links")
      .selectAll("line")
      .data(results.links)
      .enter().append("line")
        .attr("stroke-width", function(d) { return Math.sqrt(d.strength); })

    /* ATTACH CIRCLES TO SVG AS NODES */
    let node = gDraw.append("g")
        .attr("class", "nodes")
      .selectAll("circle")
      .data(results.nodes)
      .enter().append("circle")
        .attr("r", function(d){return d.visitCount * 5})
        .attr("fill", d => color(d.visitCount))
        .call(d3.drag()
          .on("start", dragstarted)
          .on("drag", dragged)
          .on("end", dragended));

    /* DEFINE FORCE GRAPH RULES */
    const simulation = d3.forceSimulation()
      .force("link", d3.forceLink().id(function(d) { return d.id; }).distance(d => 30/d.strength))
      .force("charge", d3.forceManyBody().distanceMax(200))
      .force("center", d3.forceCenter(window.innerWidth / 2, parentHeight / 2))
      .velocityDecay(0.7)

    simulation
      .nodes(results.nodes)
      .on("tick", ticked);

    simulation
      .force("link")
      .links(results.links);

    /* CREATE HOVERABLE TOOLTIPS */
    const divTooltip = d3.select("body").append("div").attr("class", "toolTip")
        node.on("mousemove", function(d){
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
            ${elementData.id} ${elementData.title}
          `);
          });
        node.on("mouseout", function(d){
          divTooltip.style("display", "none");
          })

    function ticked() {
      link
          .attr("x1", function(d) { return d.source.x; })
          .attr("y1", function(d) { return d.source.y; })
          .attr("x2", function(d) { return d.target.x; })
          .attr("y2", function(d) { return d.target.y; });

      node
          .attr("cx", function(d) { return d.x; })
          .attr("cy", function(d) { return d.y; });
    }

    const brush = d3.brush()
      .on('start', brushstarted)
      .on('brush', brushed)
      .on('end', brushended)

    function brushstarted() {
      brushing = true
      node.each(d => {
        if (d.previouslySelected) {console.log('this is previouslySelected', d)}
        return d.previouslySelected = shiftKey && d.selected})
    }

    rect.on('click', () => {
      console.log('getting called')
      node.each(d => {
        d.selected = false
        d.previouslySelected = false
      })
      node.classed('selected', false)
    })

    function brushed() {
      if (!d3.event.sourceEvent) return
      if (!d3.event.selection) return

      const extent = d3.event.selection
      node.classed('selected', d => {
        /* ^ is XOR operator -- toggles selected */
        return d.selected = d.previouslySelected ^
        (extent[0][0] <= d.x && d.x < extent[1][0]
         && extent[0][1] <= d.y && d.y < extent[1][1])
      })
    }

    function brushended() {
      if (!d3.event.sourceEvent) return;
      if (!d3.event.selection) return;
      if (!gBrush) return;

      gBrush.call(brush.move, null)

      if (!brushMode) {
        gBrush.remove()
        gBrush = null
      }
      brushing = false
    }

    d3.select('body').on('keydown', keydown)
    d3.select('body').on('keyup', keyup)

    let shiftKey

    function keydown() {
      shiftKey = d3.event.shiftKey
      if (shiftKey) {
        if (gBrush) return

        brushMode = true

        if (!gBrush) {
          gBrush = gBrushHolder.append('g')
          gBrush.call(brush)
        }
      }
    }

    function keyup() {
      shiftKey = false
      brushMode = false

      if (!gBrush) return

      if (!brushing) {
        gBrush.remove()
        gBrush = null
      }
    }

    function dragstarted(d) {
      if (!d3.event.active) simulation.alphaTarget(0.3).restart();

      if (!d3.selected & !shiftKey) {
        node.classed('selected', p => {
          return p.selected = p.previouslySelected = false
        })
      }
      d3.select(this).classed("selected", function(p) {
        d.previouslySelected = d.selected;
        return d.selected = true; })

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
  })
}

export default createForceChart