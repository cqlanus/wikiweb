const d3 = require('d3')

function d3Zoom(history, idx, historyView) {

    const d3NodeArr = d3.selectAll('circle').empty() ? 'empty' : d3.selectAll('circle').nodes()
    const nodeDataArr = d3.selectAll('circle').empty() ? 'empty' : d3.selectAll('circle').nodes().map(node => node.__data__)
    const currentNodeData = nodeDataArr.find(node => {
      return node.id === history[idx]
    })

    const currentD3Node = d3NodeArr.find(node => node.__data__.id === currentNodeData.id)

    d3.selectAll('circle').classed('selected', false)
    d3.select(currentD3Node).attr('class', 'selected')

    const xOffset = currentNodeData.x,
          yOffset = currentNodeData.y

    const zoom = d3.zoom().on('zoom', zoomer)

    function zoomer() {
      const scaleMultipler = 4,
            height = d3.selectAll('.rect').node().getBBox().height,
            width = d3.selectAll('.rect').node().getBBox().width,
            center = [width/2, height/2],
            xTranslation = center[0] - xOffset * scaleMultipler,
            yTranslation = center[1]-yOffset * scaleMultipler

      drawSpace.transition().duration(500)
      .attr('transform', `translate(${xTranslation}, ${yTranslation})scale(${scaleMultipler})`)
    // createToolTip(currentNodeData, xTranslation, yTranslation)
    }
    const drawSpace = d3.selectAll('.draw')
    drawSpace.call(zoom.transform)
}

function createToolTip(node, xTrans, yTrans) {
 /* CREATE HOVERABLE TOOLTIPS */
  const divTooltip = d3.select("rect")
      .append("text")
      .attr("class", "toolTip")
      .attr("x", 20 + xTrans)
      .attr("y", 20 + yTrans)
      .attr('width', 100)
      .attr('height', 60)
      .text(d => node.title)

      divTooltip.style("display", "inline-block");
      divTooltip.html(`
        ${node.title} <br>
        ${node.category}
      `);
}

module.exports = {d3Zoom,}