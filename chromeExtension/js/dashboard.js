const GET_USER = 'getUser'
let UserId = 'old';

console.log('hello')

chrome.storage.local.get(/* String or Array */["userId"], function(items){   //ascy
  console.log('hello!')
  console.log(items.userId);
  UserId = items.userId;
  console.log('this is my id!',UserId)
  graphSetUp(1)
});


console.log("this is the user id in the dasboard!", UserId)

const svg = d3.select("svg"),
    width = 900,
    height = 900;

const color = d3.scaleOrdinal(d3.schemeCategory20);

const simulation = d3.forceSimulation()
  .force("link", d3.forceLink().id(function(d) { return d.id; }))
  .force("charge", d3.forceManyBody())
  .force("center", d3.forceCenter(width / 2, height / 2));


const graphSetUp = function(UserId){

  chrome.runtime.sendMessage({
    type: GET_USER,
    data: UserId
  }, function(results) {
    console.log('we got results!!!!!!!!!', results)

    var link = svg.append("g")
        .attr("class", "links")
      .selectAll("line")
      .data(results.links)
      .enter().append("line")
        .attr("stroke-width", function(d) { return d.strength; })

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

    node.append("title")
        .text(function(d) { return d.title; });

    simulation
        .nodes(results.nodes)
        .on("tick", ticked);

    simulation.force("link")
        .links(results.links);

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
  })
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
