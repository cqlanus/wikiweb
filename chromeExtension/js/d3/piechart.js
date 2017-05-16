const d3 = require('d3')

const createPieChart = (nodesArr, id) => {
  // console.log('nodesArr in pie', nodesArr.map(cat => cat.name))
  d3.selectAll(`.${id}`).remove()
  const svg = d3.select(`#${id}`)
  let width = 200,
      height = 170,
      margin = {top: 20, bottom: 20, left: 20, right: 20},
      radius = Math.min(width, height) / 2,
      group = svg.append('g')
        .attr('transform', `translate(${width/2}, ${(height-10)/2})`)
        .attr('class', `pieGroup ${id}`)

  svg.style('display', 'inline-block')
  /* CREATE COLOR SCALE */
  const color = d3.scaleOrdinal(d3.schemeCategory20)
  // console.log('nodesArr in pie', nodesArr.map(cat => cat.name))
  // console.log('sports color in pie', color('SPORTS'))

  const pie = d3.pie().sort(null).value(d => d.count)

  const path = d3.arc()
    .outerRadius(radius-10)
    .innerRadius(0)

  const label = d3.arc()
    .outerRadius(radius)
    .innerRadius(radius)
  const newNodesArr = nodesArr.slice()
  const arc = group.selectAll('.arc')
    .data(pie(newNodesArr))
    .enter().append('g')
    .attr('class', 'arc')

  arc.append('path')
    .attr('d', path)
    .attr('fill', d => color(d.data.name))

  arc.append('text')
    .attr('transform', d => {
      // console.log(d)
      return `translate(${label.centroid(d)})`})
    .attr('dy', '0.35em')
    .attr('fill', 'white')
    .text(d => d.data.count)

  createToolTip(arc)

  let parentWidth = d3.select('#pieChart').node()
  console.log(parentWidth)
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
        ${elementData.data.name}
      `);
      });
    node.on("mouseout", function(d){
      divTooltip.style("display", "none");
      })
}

module.exports = createPieChart