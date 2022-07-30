<script>
  const { ipcRenderer, BrowserWindow } = require("electron");
  import * as d3 from 'd3';
  import { onMount } from 'svelte';
  import { DirectoryData } from '../Utilities/DirectoryStore';
  import { snapshots } from "./stores.js";
  export let hierarchy = {};
  let snapshotList;
  // let snapshotList = [];
  let activeIndex = 0;
  $: compState = snapshotList[activeIndex];

  let el;
  
  DirectoryData.subscribe((data) => {
    hierarchy = data.parentChildTree;
  })

  snapshots.subscribe((arr) => {
    snapshotList = arr;
  });

  // user clicks snapshot button - send message to browser to display that specific snapshot
  function updateWindow (index) {
    ipcRenderer.send('TIME_TRAVEL', index)
    //re-render snapshot in the debugger when click on a snapshot button
    const currentSVG = document.querySelector("svg")
    if (currentSVG) {
      currentSVG.remove();
    }
    let treeData = createD3relationship(snapshotList, 'App', activeIndex);
    console.log('activeIndex', activeIndex);
    // console.log('snapshotList[activeIndex]', snapshotList[activeIndex])
    console.log('treeData', treeData);
    drawTree(treeData);
  }

  // listening for "SNAPSHOT" message
  ipcRenderer.on("SNAPSHOT", (event, data) => {
    // console.log("DATA SNAPSHOT ", data);
    const singleCapturedSnapshot = []
    data.body.componentStates.forEach(comp => {
      const componentStateObj = {}
      componentStateObj[comp[2]] = comp[1];
      singleCapturedSnapshot.push(componentStateObj)
    })
    // snapshotList = [...snapshotList.slice(0, data.body.cacheLength), singleCapturedSnapshot]
    
    snapshots.update(() => {
      return [...snapshotList, singleCapturedSnapshot];
    });
    
    /*             OLD ONE              */
  // ipcRenderer.on("SNAPSHOT", (event, data) => {
  // // console.log("DATA SNAPSHOT ", data);
  // snapshots.update(() => {
  //   return [...snapshotList, data.body];
  // });
  // const singleCapturedSnapshot = []
  // data.body.componentStates.forEach(comp => {
  //   const componentStateObj = {}
  //   componentStateObj[comp[2]] = comp[1];
  //   singleCapturedSnapshot.push(componentStateObj)
  // })
  // snapshotList = [...snapshotList.slice(0, data.body.cacheLength), singleCapturedSnapshot]

    // removes previous D3 representation from the IDE
    const currentSVG = document.querySelector("svg")
    if (currentSVG) {
      currentSVG.remove();
      activeIndex += 1;
    }
    let treeData = createD3relationship(snapshotList, 'App', activeIndex);
    console.log('activeIndex', activeIndex);
    console.log('snapshotList[activeIndex]', snapshotList[activeIndex])
    console.log('treeData', treeData);
    drawTree(treeData);
  });

// loops through single snpashot array (current state) 
function createD3relationship (componentArray, compName, activeIndex) {
const d3FormatTree = {}
d3FormatTree['name'] = compName;
const childrenArray = [];
let childrenNames;        // [Task, Stats]
if (findChildren(hierarchy, compName)) {
  childrenNames = findChildren(hierarchy, compName)
}
// console.log("componentArray:", componentArray);
// console.log("activeIndex inside func:", activeIndex)
for (let element of componentArray[activeIndex]) {

  for (let key in element) {
 
    for (let name of childrenNames) {
      if (key === name) {
        const newObject = createD3relationship(componentArray, key, activeIndex)
        childrenArray.push(newObject);
      }
    }
  }
}
d3FormatTree['children'] = childrenArray;
return d3FormatTree;
}

// find children of component
function findChildren(store, compName) {


for (let element in store) {
 
  if (element === compName) {
    const children = [];
    for (let key in store[element]) {
      // console.log(key);
      children.push(key);
    }
    return children;
  }
}

for (let element in hierarchy) {
  // console.log(store[element]);
  return findChildren(store[element], compName)
}

}

function drawTree(treeData) {

// var treeData = {
//   "name": "Top Level",
//   "children": [
//     { 
//   "name": "Level 2: A",
//       "children": [
//         { "name": "Son of A" },
//         { "name": "Daughter of A" }
//       ]
//     },
//     { "name": "Level 2: B" }
//   ]
// };

// set the dimensions and margins of the diagram
var margin = {top: 40, right: 90, bottom: 50, left: 90},
  width = 660 - margin.left - margin.right,
  height = 500 - margin.top - margin.bottom;

// declares a tree layout and assigns the size
var treemap = d3.tree()
  .size([width, height]);

  
//  assigns the data to a hierarchy using parent-child relationships
var nodes = d3.hierarchy(treeData);

// maps the node data to the tree layout
nodes = treemap(nodes);

// append the svg obgect to the body of the page
// appends a 'group' element to 'svg'
// moves the 'group' element to the top left margin

var svg = d3.select(el).append('svg')
// var svg = d3.select("body").append("svg")
    .attr("width", width + margin.left + margin.right)
    .attr("height", height + margin.top + margin.bottom),
  g = svg.append("g")
    .attr("transform",
          "translate(" + margin.left + "," + margin.top + ")");

// adds the links between the nodes
var link = g.selectAll(".link")
  .data( nodes.descendants().slice(1))
.enter().append("path")
  .attr("class", "link")
  .attr("d", function(d) {
      return "M" + d.x + "," + d.y
        + "C" + d.x + "," + (d.y + d.parent.y) / 2
        + " " + d.parent.x + "," +  (d.y + d.parent.y) / 2
        + " " + d.parent.x + "," + d.parent.y;
      });

// adds each node as a group
var node = g.selectAll(".node")
  .data(nodes.descendants())
.enter().append("g")
  .attr("class", function(d) { 
    return "node" + 
      (d.children ? " node--internal" : " node--leaf"); })
  .attr("transform", function(d) { 
    return "translate(" + d.x + "," + d.y + ")"; });

// adds the circle to the node
node.append("circle")
.attr("r", 10);

// adds the text to the node
node.append("text")
.attr("dy", ".35em")
.attr("y", function(d) { return d.children ? -20 : 20; })
.style("text-anchor", "middle")
.text(function(d) { return d.data.name; });
}


</script>


<!-- snapshot buttons -->
{#if snapshotList.length}
<div class="buttonContainer">
{#each snapshotList as snapshot, idx}
  <button on:click={()=> {
    activeIndex = idx;
    updateWindow(activeIndex);
    }}>Snapshot {idx + 1}</button>
{/each}
</div>
<!-- <div class="container">
<div class="block">
  <Snap {compState} />
</div>
</div> -->
{/if}


<!-- D3 tree -->
<div class="svgtree" bind:this={el}></div>





<style>
/************** D3 **************/
:global(path) {
    fill: none;
    stroke: green;
}
:global(.node circle){
    fill: #fff;
    stroke: steelblue;
    stroke-width: 3px;
}

:global(.node--leaf text){
  fill: black;
  text-shadow: 0 1px 0 #fff, 0 -1px 0 #fff, 1px 0 0 #fff, -1px 0 0 #fff;
}

:global(.node text) { 
  font: 12px sans-serif; 
}

:global(.node--internal text){
  text-shadow: 0 1px 0 #fff, 0 -1px 0 #fff, 1px 0 0 #fff, -1px 0 0 #fff;
}

:global(.link) {
  fill: none;
  stroke: #ccc;
  stroke-width: 2px;
}

/* **************snapshot buttons ***************/
.buttonContainer {
  display: flex;
  justify-content: space-around;
  flex-wrap: wrap;
}

button{
  color: rgb(188, 188, 188);
  border: 1px solid #444;
  border-radius: 5px;
  background-color: #1c2737;
  transition: .2s;
}
button:hover{
  color: white;
  background-color: rgb(36, 50, 71);
  -webkit-transform: translateY(-2px);
  -webkit-transform: translateX(-1px);
  transform: scale(1.05,1.05);
}

</style>

