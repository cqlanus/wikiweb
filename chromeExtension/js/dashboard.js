const GET_USER = 'getUser'

const svg = d3.select("svg"),
    width = 700,
    height = 700;

const color = d3.scaleOrdinal(d3.schemeCategory20);

const simulation = d3.forceSimulation()
  .force("link", d3.forceLink().id(function(d) { return d.id; }))
  .force("charge", d3.forceManyBody())
  .force("center", d3.forceCenter(window.innerWidth / 2, height / 2));

svg
  .attr('class','canvas')
  // .attr('transform', `translate(100, 0)`)

chrome.runtime.sendMessage({
  type: GET_USER,
  data: 1
}, function(results) {
  console.log('we got results', results)

  var link = svg.append("g")
      .attr("class", "links")
    .selectAll("line")
    .data(results.links)
    .enter().append("line")
      .attr("stroke-width", function(d) { return d.strength*2; })
    // .enter().append("path")
    //   .attr("class", "link");

  var node = svg.append("g")
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

  simulation
      .nodes(results.nodes)
      .on("tick", ticked);

  simulation.force("link")
      .links(results.links);

  const divTooltip = d3.select("body").append("div").attr("class", "toolTip")
      node.on("mousemove", function(d){
        divTooltip.style("left", d3.event.pageX+10+"px");
        divTooltip.style("top", d3.event.pageY-25+"px");
        divTooltip.style("display", "inline-block");
        var x = d3.event.pageX, y = d3.event.pageY
        var elements = document.querySelectorAll(':hover');
        var l = elements.length
        l = l-1
        var elementData = elements[l].__data__
        // console.log(elementData)
        divTooltip.html(`
          ${elementData.title}
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
    // link.attr("d", positionLink);
    node
        .attr("cx", function(d) { return d.x; })
        .attr("cy", function(d) { return d.y; });
  }
})

function positionLink(d) {
  return "M" + d[0].x + "," + d[0].y
       + "S" + d[1].x + "," + d[1].y
       + " " + d[2].x + "," + d[2].y;
}

function dragstarted(d) {
  if (!d3.event.active) simulation.alphaTarget(0.3).restart();
  d.fx = d.x;
  d.fy = d.y;
}

function dragged(d) {
  d.fx = d3.event.x;
  d.fy = d3.event.y;
}

function dragended(d) {
  if (!d3.event.active) simulation.alphaTarget(0);
  d.fx = null;
  d.fy = null;
}

