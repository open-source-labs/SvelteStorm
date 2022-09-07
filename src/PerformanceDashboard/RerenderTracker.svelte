<script>
  // import {ipcRenderer, BrowserWindow} from 'electron'
  // import { claim_text } from 'svelte/internal';
  import { DirectoryData } from "../DataStore/SvelteStormDataStore";
  import * as d3 from "d3";
  import { scaleLinear } from "d3-scale";

  export const stateObj = {};
  
  // const renderCountObj = {};

  //function to create keys in renderCountObj for each component of applciation. Each key initialized to 0.
  // const populateRenderCountObj = (stateObj) => {
  //     for (const key in stateObj) {
  //         renderCountObj[key] = 0; 
  //         console.log("renderCountObj in RerenderTracker: ", renderCountObj)
  //     }
  // }
  
  //suscribe to DirectoryData to receive updates to stateObj
  // const suscribeToStateUpdates = DirectoryData.subscribe((data) => {
  //   stateObj = data.stateObj;
  //   populateRenderCountObj(stateObj);
  // });
  
  //for every reload, increment relevant key of renderCountObj
  // const handleReloads = (data) => {
  //     if (data) {
  
  //     }
  // }
  

  //Creating the bar chart visualization: 
  const testDataObj = [
    { component: 'Answer', count: 5},
    { component: 'App', count: 5},
    { component: 'Bank', count: 15},
    { component: 'Board', count: 5},
    { component: 'Guess', count: 8}, 
    { component: 'Question', count: 9}, 
    { component: 'Team', count: 9}
  ];

const createRenderBarChart = (data) => {
  let margin = {top: 20, right: 30, bottom: 40, left: 90},
    width = 460 - margin.left - margin.right,
    height = 400 - margin.top - margin.bottom;
  
  let svg = d3.select("#rerender-graph")
    .append("svg")
    .attr("width", width + margin.left + margin.right)
    .attr("height", height + margin.top + margin.bottom)
    .append("g")
    .attr("transform",
          "translate(" + margin.left + "," + margin.top + ")");

   d3.select("#rerender-graph")
    .selectAll("p")
    .data(data)
    .join("p")
    .attr("class", "#rerender-graph")
    .text((d) => d)
  
  const y_scale = d3.scaleLinear()
    .range([ 0, height ])
    .domain(0, data.length)
  svg.append("g")
    .call(d3.axisLeft(y))

  let x = d3.scaleLinear()
    .domain([0, 25])
    .range([ 0, width]);
  svg.append("g")
    .attr("transform", "translate(0," + height + ")")
    .call(d3.axisBottom(x))
    .selectAll("text")
    .attr("transform", "translate(-10,0)rotate(-45)")
    .style("text-anchor", "end");

  svg.selectAll("myRect")
    .data(data)
    .enter()
    .append("rect")
    .attr("x", x(0) )
    .attr("y", function(d) { return y(d.component); })
    .attr("width", function(d) { return x(d.count); })
    .attr("height", y.bandwidth() )
    .attr("fill", "#69b3a2")
  }

createRenderBarChart(testDataObj); 

</script>

<main>
  <h2>Component Render Tracker</h2>
  <div id="rerender-graph"></div>
</main>

<style>
  #rerender-graph {
    width: 100%;
    height: 100%;
    resize: horizontal;
    overflow: auto;
  }

</style>