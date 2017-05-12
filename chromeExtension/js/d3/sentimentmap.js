const d3 = require('d3')

const createSentimentMap = (sentimentAnalysis) => {
  let parentWidth = d3.select('svg').node().parentNode.clientWidth,
      parentHeight = d3.select('svg').node().parentNode.clientHeight;

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

  const gDraw = gMain.append('g').classed('draw', true)

  const tree = buildTree(sentimentAnalysis.entities, startTree())

  const pack = d3.pack()
    .size([parentWidth, parentHeight])
    .padding(1)

  const treeRoot = d3.hierarchy(tree)
    .sum(d => d.count)
    .sort((a, b) => {
      return b.value - a.value
    })

  const nodes = pack(treeRoot).descendants()
  // console.log('tree', nodes)

  const node = gDraw.selectAll('.node')
    .data(nodes)
    .enter().append('g')
    .attr('transform', d => {
      return `translate(${d.x}, ${d.y})`
    })

  node.append('circle')
    .attr('class', d => d.children ? null : 'bubble')
    .attr('r', d => d.r)
    .attr('fill', d => {
      if (d.data.sentiment && d.data.sentiment.label === 'pos') {
        return 'DarkSeaGreen'}
      else if (d.data.sentiment && d.data.sentiment.label === 'neg') {
        return 'indianred'
      } else if (d.data.sentiment && d.data.sentiment.label === 'neu') {
        return '#ccc'
      } else { return '#333'}
     })

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
          elementData.data.mention ? divTooltip.html(`
            ${elementData.data.mention}
          `) : divTooltip.style('display', 'none')
          });
        node.on("mouseout", function(d){
          divTooltip.style("display", "none");
          })

  node.filter(function(d) { return !d.children }).append("text")
      .attr('class', 'bubbletext')
      .attr('dx', d => d.r/-2)
      .attr("dy", "0.3em")
      .text(function(d) { return d.data.mention.substring(0, d.r / 4); })
      .attr('fill', d => d.data.sentiment && d.data.sentiment.label === 'neu' ? 'black' : 'white')


}

const startTree = () => {
  const sentimentTree = {
    name: "WikiHistory",
    children: [
      {name: "pos", children: []},
      {name: "neu", children: []},
      {name: "neg", children: []},
    ]
  }
  return sentimentTree
}

const addToTree = (node, tree) => {
  const sent = node.sentiment.label
  if (sent === tree.name) {
    tree.children.push(node)
    return tree
  }
  tree.children ? tree.children.forEach(child => {
    addToTree(node, child)
  }) : null
}

const buildTree = (nodeList, tree) => {
  nodeList.forEach(node => {
    addToTree(node, tree)
  })
  return tree
}

module.exports = createSentimentMap