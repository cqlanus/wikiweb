const d3 = require('d3')
const d3Colors = require('d3-scale-chromatic')

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

  const redScale = d3.scaleThreshold()
    .domain([0.2, 0.4, 0.6, 0.8])
    .range(d3Colors.schemeReds[5])

  const greenScale = d3.scaleThreshold()
    .domain([0.2, 0.4, 0.6, 0.8])
    .range(d3Colors.schemeGreens[5])

  const greyScale = d3.scaleThreshold()
    .domain([0.2, 0.4, 0.6, 0.8])
    .range(d3Colors.schemeGreys[5])

  node.append('circle')
    .attr('class', d => d.children ? null : 'bubble')
    .attr('r', d => d.r)
    .attr('fill', d => {
      if (d.data.sentiment && d.data.sentiment.label === 'pos') {
        return greenScale(d.data.sentiment.confidence)}
      else if (d.data.sentiment && d.data.sentiment.label === 'neg') {
        return redScale(d.data.sentiment.confidence)
      } else if (d.data.sentiment && d.data.sentiment.label === 'neu') {
        return greyScale(d.data.sentiment.confidence)
      } else { return '#333'}
     })

  createLegend(greenScale, 10, 36)
  createLegend(redScale, 10, 28)
  createLegend(greyScale, 0, 0, true)

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
          elementData.data.mention ? divTooltip.html(`
            ${elementData.data.mention} <br>
            ${(elementData.data.sentiment.confidence *100).toFixed(2)}%
          `) : divTooltip.style('display', 'none')
          })
        node.on("mouseout", function(d){
          divTooltip.style("display", "none");
          })

  node.filter(function(d) { return !d.children }).append("text")
      .attr('class', 'bubbletext')
      .attr('dx', d => d.r/-2)
      .attr("dy", "0.3em")
      .text(function(d) { return d.data.mention.substring(0, d.r / 4); })
      .attr('fill', 'white')

}

function createLegend(scale, xOff, yOff, ticks) {

  const x = d3.scaleLinear()
    .domain([0, 1])
    .range([0, 240]);

  const xAxis = d3.axisBottom(x)
    .tickValues(scale.domain())
    .tickSize(31)
    .tickFormat(d3.format(",.0%"))

  const main = d3.select('.g-main').append('g')
  const rect = main.selectAll('.range')
    .data(scale.range().map(color => {
      let d = scale.invertExtent(color)
      if (!d[0]) {d[0] = x.domain()[0]}
      if (!d[1]) {d[1] = x.domain()[1]}
      return d
    }))

    rect.enter().append('rect')
      .attr('class', 'range')
      .attr('height', 8)
      .attr('x', d => (xOff + x(d[0])))
      .attr('y', yOff)
      .attr('width', d => (x(d[1]) - x(d[0])))
      .attr('fill', d => scale(d[0]))

  if (ticks) {
    main.append('text')
      .text('% Confidence (neu/neg/pos)')
      .attr('transform', 'translate(80, -5)')

    main.call(xAxis)
    .attr('class', 'axis-x')
    .attr('transform', `translate(10, 20)`)

    main.append('text')
      .text('Sentiment Analysis courtesy of Rosette Text Analytics')
      .attr('transform', 'translate(145, 670)')


  }
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