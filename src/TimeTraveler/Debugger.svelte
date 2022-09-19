<!-- This is the main container for the debugger. It contains the snahoshots and d3 tree. -->
<script>
  import * as d3 from 'd3';
  import {
    DirectoryData,
    saveToFileName,
    snapshots,
  } from '../DataStore/SvelteStormDataStore';
  import CardHolder from './CardHolder.svelte'
  export let hierarchy = {};

  const {ipcRenderer, BrowserWindow} = require('electron');

  const fs = require('fs');
  const path = require('path');
  const SerAny = require('serialize-anything');
  let activeIndex = 0;
  let collectionOfAllSnapshots;
  $: compState = collectionOfAllSnapshots[activeIndex];
  let myWriteStream;
  let FileNPathNameToStoreSnapshots = '';

  let el;

  DirectoryData.subscribe((data) => {
    hierarchy = data.componentRelationships;
  });

  snapshots.subscribe((arr) => {
    collectionOfAllSnapshots = arr;
  });

  saveToFileName.subscribe((pathNFileName) => {
    FileNPathNameToStoreSnapshots = pathNFileName;
  });

  /*
   * ==================================================
   *   When the snapshot data is received, update the snapshots in the store
   *   Then, loop through the data to get the individual component states
   *   States holds the component and component states
   * ==================================================
   */
  ipcRenderer.on('SNAPSHOT', (event, data) => {
    const singleCapturedSnapshot = createSnapshot(data);
    // Update the store with newest snapshot if actually different
    if(JSON.stringify(collectionOfAllSnapshots[collectionOfAllSnapshots.length - 1]) !== JSON.stringify(singleCapturedSnapshot)) {
      snapshots.update(() => {
        return [...collectionOfAllSnapshots, singleCapturedSnapshot];
      });
    } ; 

    const currentSVG = document.querySelector('#D3Tree');
    if (currentSVG) {
      currentSVG.remove();
      activeIndex += 1;
    }

    let treeData = createD3relationship(
      collectionOfAllSnapshots,
      'App',
      activeIndex
    );
    drawTree(treeData);
  });

  function createSnapshot(data) {
    const singleCapturedSnapshot = [];
    data.body.componentStates.forEach((comp) => {
      const componentStateObj = {};
      componentStateObj[comp[2]] = comp[1];
      singleCapturedSnapshot.push(componentStateObj);
    });

    return singleCapturedSnapshot;
  }

  /*
   * ==================================================
   *   The following code intends to write and save snapshots
   *   for developers to save their sanpshots and replay them.
   *   We ran into an issue where we were unable to inject state into
   *   Svelte components before they exist.
   * ==================================================
   */
  // function writeSnapToDisk(singleCapturedSnapshot) {
  //   // stringify the snapshot
  //   const stringSnapshot = JSON.stringify(singleCapturedSnapshot);

  //   // Check if file exists is yes, set 'fileExists = true'
  //   // fs.existsSync(path) -> returns boolean

  //   // if ($saveToFileName && !myWriteStream) {
  //   //   myWriteStream = fs.createWriteStream($saveToFileName, {
  //   //     encoding: 'utf8',
  //   //     autoClose: true,
  //   //   });
  //   // }

  //   if ($saveToFileName && myWriteStream) {
  //     myWriteStream.write(stringSnapshot);
  //   }
  // }

  /*
   * ==================================================
   *   User chooses to display previously saved snapshots
   * ==================================================
   */
  // function displaySavedSnapshots(fileName) {
  //   const stringSavedSnapshots = fs.readFileSync(
  //     path.join(__dirname, `../public/CapturedSnaps/${fileName}`)
  //   );
  //   collectionOfAllSnapshots = JSON.parse(stringSavedSnapshots);
  //   snapshots.update(() => {
  //     return collectionOfAllSnapshots;
  //   });
  // }

  /*
   * ==================================================
   *   End write and save snapshots feature
   * ==================================================calend
   */


  function createD3relationship(componentArray, compName, activeIndex) {
    const d3FormatTree = {};
    d3FormatTree['name'] = compName;
    const childrenArray = [];
    let childrenNames; // [Task, Stats]
    if (findChildren(hierarchy, compName)) {
      childrenNames = findChildren(hierarchy, compName);
    }

    for (let element of componentArray[activeIndex]) {
      for (let key in element) {
        for (let name of childrenNames) {
          if (key === name) {
            const newObject = createD3relationship(
              componentArray,
              key,
              activeIndex
            );
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
          children.push(key);
        }
        return children;
      }
    }

    // delete count later
    for (let element in store) {
      return findChildren(store[element], compName);
    }
  }

  function drawTree(treeData) {

    // set the dimensions and margins of the diagram
    const treeParent = document.querySelector('#treeParent');
    // const buttonContainer = document.querySelector('.buttonContainer')

    var margin = {top: 60, right: 90, bottom: 50, left: 90},
      // width = 100% - margin.left - margin.right,
      // height = 100% - margin.top - margin.bottom;
      width = treeParent.clientWidth - margin.left - margin.right,
      height = treeParent.clientHeight - margin.top - margin.bottom;

    // declares a tree layout and assigns the size
    var treemap = d3.tree().size([width, height]);

    //  assigns the data to a hierarchy using parent-child relationships
    var nodes = d3.hierarchy(treeData);

    // maps the node data to the tree layout
    nodes = treemap(nodes);

    // append the svg obgect to the body of the page
    // appends a 'group' element to '#D3Tree'
    // moves the 'group' element to the top left margin

    // SS5.0 JO - Added viewbox attr and removed w/h as this seemed to be contributing to resize bug when tree was populated
    var svg = d3
        .select(el)
        .append('svg')
        .attr('id', 'D3Tree')
        .attr('viewBox', `0 0 ${treeParent.clientWidth} ${treeParent.clientHeight}`),
        // var svg = d3.select("body").append("svg")
        // .attr('width', width + margin.left + margin.right)
        // .attr('height', height + margin.top + margin.bottom),
      g = svg
        .append('g')
        .attr('transform', 'translate(' + margin.left + ',' + margin.top + ')');

    // adds the links between the nodes
    var link = g
      .selectAll('.link')
      .data(nodes.descendants().slice(1))
      .enter()
      .append('path')
      .style('stroke', '#9300ff')
      .attr('class', 'link')
      .attr('d', function (d) {
        return (
          'M' +
          d.x +
          ',' +
          d.y +
          'C' +
          d.x +
          ',' +
          (d.y + d.parent.y) / 2 +
          ' ' +
          d.parent.x +
          ',' +
          (d.y + d.parent.y) / 2 +
          ' ' +
          d.parent.x +
          ',' +
          d.parent.y
        );
      });

    // adds each node as a group
    var node = g
      .selectAll('.node')
      .data(nodes.descendants())
      .enter()
      .append('g')
      .attr('class', function (d) {
        return 'node' + (d.children ? ' node--internal' : ' node--leaf');
      })
      .attr('transform', function (d) {
        return 'translate(' + d.x + ',' + d.y + ')';
      });

    // adds the circle to the node
    node.append('circle').attr('r', 10);

    // adds the text to the node
    node
      .append('text')
      .attr('dy', '.35em')
      .attr('y', function (d) {
        return d.children ? -20 : 20;
      })
      .style('text-anchor', 'middle')
      .text(function (d) {
        return d.data.name;
      });
  }

  /*
   * ==================================================
   *   user clicks snapshot button - send message to
   *   browser to display that specific snapshot
   * ==================================================
   */
  function updateWindow(index) {
    ipcRenderer.send('TIME_TRAVEL', index);
    //re-render snapshot in the debugger when click on a snapshot button
    const currentSVG = document.querySelector('#D3Tree');
    if (currentSVG) {
      currentSVG.remove();
    }
    let treeData = createD3relationship(
      collectionOfAllSnapshots,
      'App',
      activeIndex
    );
    drawTree(treeData);
  }

  function refresh(){
    // update snapshots to include only the initial snapshot
    snapshots.update(() => {
      return [collectionOfAllSnapshots[0]];
    });
    // send refresh message to main process
    ipcRenderer.send('REFRESH', 0);

    // redraw tree
    const currentSVG = document.querySelector('#D3Tree');
    currentSVG.remove();
    activeIndex = 0;

    let treeData = createD3relationship(
      collectionOfAllSnapshots,
      'App',
      activeIndex
    );
    drawTree(treeData);
  }

</script>

<div id="buttonsAndTree">

  <!-- /*
    * ==================================================
    *   Display the State "Snapshots"
    * ==================================================
    */ -->
    
    {#if collectionOfAllSnapshots.length}
    <div class="buttonContainer">
    <button class="refreshbtn"
      on:click={() => {
        refresh();
        }}>Reset</button
    >
    {#each collectionOfAllSnapshots as snapshot, idx}
      <button
        on:click={() => {
          activeIndex = idx;
          updateWindow(activeIndex);
        }}>Snapshot {idx + 1}</button
      >
      {#if idx === activeIndex}
      <CardHolder {snapshot} />
      {/if}
    {/each}
    </div>
  {/if}
  
  <!-- D3 tree -->
  <div class="svgtree" bind:this={el} />
</div>

<!-- /*
* ==================================================
*   Style for this display states component
* ==================================================
*/ -->
<style>
  .refreshbtn{
    background-color: #3632a2;
    color: whitesmoke;
  }
  #buttonsAndTree {
    display: flex;
    flex-direction: row;
  }
  .buttonContainer {
    margin-left: 10px;
    display: flex;
    flex-direction: column;
    justify-content: start;
    flex-wrap: wrap;
  }

  .svgtree {
    flex-grow: 1;
  }
  /* .block {
    width: 180px;
  } */
  button {
    color: rgb(188, 188, 188);
    border: 1px solid #444;
    border-radius: 5px;
    background-color: #1c2737;
    transition: 0.2s;
  }
  button:hover {
    color: white;
    background-color: rgb(36, 50, 71);
    -webkit-transform: translateY(-2px);
    -webkit-transform: translateX(-1px);
    transform: scale(1.05, 1.05);
  }
  /* .container {
    display: flex;
    flex-direction: row;
    align-items: flex-start;
    justify-content: space-evenly;
  } */

  /* :global(path) {
    fill: none;
    stroke: green;
  } */
  :global(.node circle) {
    /* fill: #fff; */
    fill: #FFFFFF;
    stroke: dark rgb(38, 38, 119);
    stroke-width: 3px;
  }

  :global(.node--leaf text) {
    fill: black;
    text-shadow: 0 1px 0 #fff, 0 -1px 0 #fff, 1px 0 0 #fff, -1px 0 0 #fff;
  }

  :global(.node text) {
    font: 12px sans-serif;
  }

  :global(.node--internal text) {
    text-shadow: 0 1px 0 #fff, 0 -1px 0 #fff, 1px 0 0 #fff, -1px 0 0 #fff;
  }

  :global(.link) {
    fill: none;
    stroke: rgb(38, 38, 134);
    stroke-width: 2px;
  }
</style>
