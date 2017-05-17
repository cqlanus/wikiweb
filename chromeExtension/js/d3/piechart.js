const d3 = require('d3')

const createPieChart = (nodesArr, id, caption) => {
  // console.log('nodesArr in pie', nodesArr.map(cat => cat.name))
  d3.selectAll(`.${id}`).remove()
  const svg = d3.select(`#${id}`)
  console.log(d3.select(`#${id}`).node())
  let width = 200,
      height = 250,
      margin = {top: 20, bottom: 20, left: 20, right: 20},
      radius = Math.min(width, height) / 2,
      group = svg.append('g')
        .attr('transform', `translate(${width/2}, ${(height-10)/2})`)
        .attr('class', `pieGroup ${id}`)

  svg.style('display', 'inline-block')
  /* CREATE COLOR SCALE */
  const color = id === 'pieChartSent' ? d3.scaleOrdinal([d3.rgb(99, 99, 99), d3.rgb(49, 163, 84), d3.rgb(251, 96, 74)]) : d3.scaleOrdinal(d3.schemeCategory20)
  // console.log('nodesArr in pie', nodesArr.map(cat => cat.name))
  // console.log('sports color in pie', color('SPORTS'))

  const pie = d3.pie().sort(null).value(d => d.count)

  const path = d3.arc()
    .outerRadius(radius-5)
    .innerRadius(0)

  const label = d3.arc()
    .outerRadius(radius-40)
    .innerRadius(radius-40)

  const arc = group.selectAll('.arc')
    .data(pie(nodesArr))
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
    .text(d => {
      if(d.endAngle - d.startAngle > 0.5){
        return d.data.count
      } else { return null }
    })

  group.append('text')
    .attr('transform', `translate(${-90}, ${120})`)
    .attr('fill', 'white')
    .style('font-size', '15px')
    .text(`${caption}`)

  createToolTip(arc)
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