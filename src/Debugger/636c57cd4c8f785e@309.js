// https://observablehq.com/@danielkerrigan/vertical-zoomable-icicle@309
function _1(md){return(
md`# Vertical Zoomable Icicle

Fork of [Zoomable Icicle](/@d3/zoomable-icicle) to make it vertical. This example answers [this stack overflow question](https://stackoverflow.com/questions/69137774/vertical-icicle-in-d3).`
)}

function* _chart(partition,data,d3,width,height,color,format)
{
  const root = partition(data);
  let focus = root;

  const svg = d3.create("svg")
      .attr("viewBox", [0, 0, width, height])
      .style("font", "10px sans-serif");

  /*
    This line is needed so that we can calculate the length of the text labels
    in the labelVisible function during the initial rendering of the visualization.
    Without this line, all labels would be shown before any node is clicked,
    since getComputedTextLength returns 0 for text elements that aren't added
    to the DOM. This line lets us add the labels to the DOM before we calculate
    their length. The same technique is used in this notebook:
    https://observablehq.com/@analyzer2004/fancy-radial-bars
  */
  yield svg.node();

  const cell = svg
    .selectAll("g")
    .data(root.descendants())
    .join("g")
      .attr("transform", d => `translate(${d.x0},${d.y0})`);

  const rect = cell.append("rect")
      .attr("height", d => d.y1 - d.y0 - 1)
      .attr("width", d => rectWidth(d))
      .attr("fill-opacity", 0.6)
      .attr("fill", d => {
        if (!d.depth) return "#ccc";
        while (d.depth > 1) d = d.parent;
        return color(d.data.name);
      })
      .style("cursor", "pointer")
      .on("click", clicked);

  const textPadding = 4;

  const text = cell.append("text")
      .style("user-select", "none")
      .attr("pointer-events", "none")
      .attr("x", textPadding)
      .attr("y", 13)
      .text(d => `${d.data.name} ${format(d.value)}`)
      .attr("fill-opacity", function(d) { return +labelVisible(d, this) });

  cell.append("title")
      .text(d => `${d.ancestors().map(d => d.data.name).reverse().join("/")}\n${format(d.value)}`);

  function clicked(event, p) {
    focus = focus === p ? p = p.parent : p;

    root.each(d => d.target = {
      y0: d.y0 - p.y0,
      y1: d.y1 - p.y0,
      x0: (d.x0 - p.x0) / (p.x1 - p.x0) * width,
      x1: (d.x1 - p.x0) / (p.x1 - p.x0) * width
    });

    const t = cell.transition().duration(750)
        .attr("transform", d => `translate(${d.target.x0},${d.target.y0})`);

    rect.transition(t).attr("width", d => rectWidth(d.target));
    text.transition(t).attr("fill-opacity", function(d) { return +labelVisible(d.target, this) });
  }

  function rectWidth(d) {
    return d.x1 - d.x0 - Math.min(1, (d.x1 - d.x0) / 2);
  }

  function labelVisible(d, label) {
    return (
      d.x1 <= width &&
      d.x0 >= 0 &&
      // don't show the label if it's wider than the rectangle that it is in
      d.x1 - d.x0 - 2 * textPadding > label.getComputedTextLength()
    );
  }

  return svg.node();
}


function _data(FileAttachment){return(
FileAttachment("flare-2.json").json()
)}

function _partition(d3,width,height){return(
data => {
  const root = d3.hierarchy(data)
      .sum(d => d.value)
      .sort((a, b) => b.height - a.height || b.value - a.value);  
  return d3.partition()
      .size([width, (root.height + 1) * height / 3])
    (root);
}
)}

function _color(d3,data){return(
d3.scaleOrdinal(d3.quantize(d3.interpolateRainbow, data.children.length + 1))
)}

function _format(d3){return(
d3.format(",d")
)}

function _width(){return(
975
)}

function _height(){return(
600
)}

function _d3(require){return(
require("d3@7")
)}

export default function define(runtime, observer) {
  const main = runtime.module();
  function toString() { return this.url; }
  const fileAttachments = new Map([
    ["flare-2.json", {url: new URL("./files/data.json", import.meta.url), mimeType: null, toString}]
  ]);
  main.builtin("FileAttachment", runtime.fileAttachments(name => fileAttachments.get(name)));
  main.variable(observer()).define(["md"], _1);
  main.variable(observer("chart")).define("chart", ["partition","data","d3","width","height","color","format"], _chart);
  main.variable(observer("data")).define("data", ["FileAttachment"], _data);
  main.variable(observer("partition")).define("partition", ["d3","width","height"], _partition);
  main.variable(observer("color")).define("color", ["d3","data"], _color);
  main.variable(observer("format")).define("format", ["d3"], _format);
  main.variable(observer("width")).define("width", _width);
  main.variable(observer("height")).define("height", _height);
  main.variable(observer("d3")).define("d3", ["require"], _d3);
  return main;
}
