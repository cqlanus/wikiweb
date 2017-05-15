const d3 = require('d3')

function d3Zoom(history, idx, historyView) {

    const d3NodeArr = d3.selectAll('circle').empty() ? 'empty' : d3.selectAll('circle').nodes()
    const nodeDataArr = d3.selectAll('circle').empty() ? 'empty' : d3.selectAll('circle').nodes().map(node => node.__data__)
    const currentNodeData = nodeDataArr.find(node => {
      return node.id === history[idx]
    })

    // console.log('currentNodeData', currentNodeData)

    const currentD3Node = d3NodeArr.find(node => node.__data__.id === currentNodeData.id)

    d3.selectAll('circle').classed('selected', false)
    d3.select(currentD3Node).attr('class', 'selected')

    const xOffset = currentNodeData.x,
          yOffset = currentNodeData.y

    const zoom = d3.zoom().on('zoom', zoomer)
    const drawSpace = d3.selectAll('.draw')
    drawSpace.call(zoom.transform)

    function zoomer() {
      const scaleMultipler = 4,
            height = d3.selectAll('.rect').node().getBBox().height,
            width = d3.selectAll('.rect').node().getBBox().width,
            center = [width/2, height/2],
            xTranslation = center[0] - xOffset,
            yTranslation = center[1]-yOffset

      drawSpace.transition().duration(500)
      .attr('transform', `translate(${xTranslation}, ${yTranslation})`)

      createToolTip(currentNodeData, 0, 0, idx)
    }
}

function createToolTip(node, xTrans, yTrans, index) {
 /* CREATE HOVERABLE TOOLTIPS */
 d3.selectAll('.pageInfo').remove()

  const divG = d3.select(".g-main")
      .append('g')
      .attr("class", "pageInfo")

  divG.append('rect')
      .attr("x", 20 + xTrans)
      .attr("y", 20 + yTrans)
      .attr('width', 400)
      .attr('height', 100)
      .attr('fill', 'black')
      .attr('opacity', 0.7)

  const text = d3.select('.g-main')
    .append("text")
    .attr('class', 'pageInfo')
    .attr('transform', `translate(${30}, ${40})`)

    text.append('tspan')
      .attr('x', 0)
      .attr('dy', '0.6em')
      .style('font-size', '1.5em')
      .attr('fill', 'white')
      .text(d => {
        return `${index+1}. ${formatTitle(node.title)}`
      })

    divG.append('image')
      .attr('class', 'pageInfo')
      .attr('href', d => node.pictureUrl)
      .attr('x', 300)
      .attr('y', 20 + yTrans)
      .attr('height', '100px')
      .attr('width', '100px')
}

function formatTitle(title) {
  const idx = title.indexOf(' - Wiki')
  return title.substring(0, idx)
}

module.exports = {d3Zoom,}