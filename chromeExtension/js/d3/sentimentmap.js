const d3 = require('d3')

const createSentimentMap = (sentimentAnalysis) => {
  // console.log(sentimentAnalysis)
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
    .attr('fill', 'lightsteelblue')

  const gDraw = gMain.append('g').classed('draw', true)

  const tree = buildTree(sentimentAnalysis.entities, startTree())

  const pack = d3.pack()
    .size([parentWidth, parentHeight])
    .padding(2)

  const treeRoot = d3.hierarchy(tree)
    .sum(d => d.count)
    .sort((a, b) => {
      return b.value - a.value
    })

  const nodes = pack(treeRoot).descendants()
  console.log('tree', nodes)

  const node = gDraw.selectAll('.node')
    .data(nodes)
    .enter().append('g')
    .attr('transform', d => {
      return `translate(${d.x}, ${d.y})`
    })

  node.append('circle')
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

    // .enter().append('circle')
    // .attr('class', 'nodes')
    // .attr('r', d => d.data.count)
    // .attr('opacity', '0.7')
    // .attr('stroke', 'black')


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