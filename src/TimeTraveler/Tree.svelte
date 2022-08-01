<script>
  import * as d3 from 'd3';
  import {
    DirectoryData,
    saveToFileName,
    snapshots,
  } from '../DataStore/SvelteStormDataStore';
  import {get} from 'svelte/store'
  export let hierarchy = {};

  const {ipcRenderer, BrowserWindow} = require('electron');
  const fs = require('fs');
  const path = require('path');
  const SerAny = require('serialize-anything');
  // import { indexes } from "d3";
  // let snapshotList;
  let activeIndex = 0;
  let collectionOfAllSnapshots;
  $: compState = collectionOfAllSnapshots[activeIndex];
  let myWriteStream;
  let FileNPathNameToStoreSnapshots = '';

  let el;

  DirectoryData.subscribe((data) => {
    hierarchy = data.parentChildTree;
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
    // snapshots.update(() => {
    //   return [...collectionOfAllSnapshots, data.body];
    // });
    const singleCapturedSnapshot = createSnapshot(data);
    console.log("SNAPSHOT: singleCapturedSnapshot", singleCapturedSnapshot);
    // Update the store with newest snapshot
    snapshots.update(() => {
      return [...collectionOfAllSnapshots, singleCapturedSnapshot];
    });

    // const currentSnapshots = get(snapshots);
    // console.log("SNAPSHOT: snapshots store:", currentSnapshots)

    // const stringSnapshot = JSON.stringify(collectionOfAllSnapshots);
    
    
        console.log(`\n🟡🟡🟡🟡🟡🟡🟡🟡🟡🟡🟡🟡🟡🟡🟡🟡🟡🟡🟡🟡🟡🟡🟡🟡🟡🟡🟡🟡`);
        console.log(`\n🟡🟡🟡🟡🟡🟡🟡🟡🟡🟡🟡🟡🟡🟡🟡🟡🟡🟡🟡🟡🟡🟡🟡🟡🟡🟡🟡🟡`);
        console.log(`\n🟡🟡🟡🟡🟡🟡🟡🟡🟡🟡🟡🟡🟡🟡🟡🟡🟡🟡🟡🟡🟡🟡🟡🟡🟡🟡🟡🟡`);
        let stringSnapshot = SerAny.serialize(collectionOfAllSnapshots, {maxDepth: 500, pretty: true});
        console.log('🔴🟠🟡🟢🔵🟣 | file: Tree.svelte | line 71 | ipcRenderer.on | stringSnapshot', stringSnapshot);
        console.log(`\n🟡🟡🟡🟡🟡🟡🟡🟡🟡🟡🟡🟡🟡🟡🟡🟡🟡🟡🟡🟡🟡🟡🟡🟡🟡🟡🟡🟡`);
        console.log(`\n🟡🟡🟡🟡🟡🟡🟡🟡🟡🟡🟡🟡🟡🟡🟡🟡🟡🟡🟡🟡🟡🟡🟡🟡🟡🟡🟡🟡`);
        console.log(`\n🟡🟡🟡🟡🟡🟡🟡🟡🟡🟡🟡🟡🟡🟡🟡🟡🟡🟡🟡🟡🟡🟡🟡🟡🟡🟡🟡🟡`);



    fs.writeFileSync(FileNPathNameToStoreSnapshots, stringSnapshot);
      console.log('🔴🟠🟡🟢🔵🟣 | AFTER WRITE SNAP FUNC CALL ');

    const currentSVG = document.querySelector('#D3Tree');
    if (currentSVG) {
      currentSVG.remove();
      activeIndex += 1;
    }

    // console.log("SNAPSHOT: Input collection:", collectionOfAllSnapshots);
    // console.log("SNAPSHOT: Input activeIndex:", activeIndex);
    // console.log("SNAPSHOT: collection[activeIndex]", collectionOfAllSnapshots[activeIndex]);

    let treeData = createD3relationship(
      collectionOfAllSnapshots,
      'App',
      activeIndex
    );
    // console.log("SNAPSHOT: Tree Data:", treeData);
    drawTree(treeData);
  });

  /*
   * ==================================================
   *   Blah
   * ==================================================
   */
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
   *   Blah
   * ==================================================
   */
  function writeSnapToDisk(singleCapturedSnapshot) {
    // stringify the snapshot
    const stringSnapshot = JSON.stringify(singleCapturedSnapshot);
    console.log('🔴🟠🟡🟢🔵🟣 | BEEN STRINGED ');

    


    // Check if file exists is yes, set 'fileExists = true'
    // fs.existsSync(path) -> returns boolean

    if ($saveToFileName && !myWriteStream) {
      myWriteStream = fs.createWriteStream($saveToFileName, {
        encoding: 'utf8',
        autoClose: true,
      });
    }

    if ($saveToFileName && myWriteStream) {
      myWriteStream.write(stringSnapshot);
    }
  }

  /*
   * ==================================================
   *   User chooses to display previously saved snapshots
   * ==================================================
   */
  function displaySavedSnapshots(fileName) {
    const stringSavedSnapshots = fs.readFileSync(
      path.join(__dirname, `../public/CapturedSnaps/${fileName}`)
    );
    collectionOfAllSnapshots = JSON.parse(stringSavedSnapshots);
    snapshots.update(() => {
      return collectionOfAllSnapshots;
    });
  }

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
    const treeParent = document.querySelector('#dummyGraph');
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

    var svg = d3
        .select(el)
        .append('svg')
        .attr('id', 'D3Tree')
        // var svg = d3.select("body").append("svg")
        .attr('width', width + margin.left + margin.right)
        .attr('height', height + margin.top + margin.bottom),
      g = svg
        .append('g')
        .attr('transform', 'translate(' + margin.left + ',' + margin.top + ')');

    // adds the links between the nodes
    var link = g
      .selectAll('.link')
      .data(nodes.descendants().slice(1))
      .enter()
      .append('path')
      .style("stroke", "cyan")
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
    console.log("updateWindow index:", index);
    ipcRenderer.send('TIME_TRAVEL', index);
    //re-render snapshot in the debugger when click on a snapshot button
    const currentSVG = document.querySelector('#D3Tree');
    if (currentSVG) {
      currentSVG.remove();
    }
    // console.log("UpdateWindow: Input collection:", collectionOfAllSnapshots);
    // console.log("UpdateWindow: Input activeIndex:", activeIndex);
    // console.log("UpdateWindow: collection[activeIndex]", collectionOfAllSnapshots[activeIndex]);
    let treeData = createD3relationship(
      collectionOfAllSnapshots,
      'App',
      activeIndex
    );
    console.log("UpdateWindow: treeData", treeData)
    drawTree(treeData);
  }
</script>
<div id="buttonsAndTree">

  <!-- /*
    * ==================================================
    *   Display the State "Snapshorts"
    * ==================================================
    */ -->
    
    {#if collectionOfAllSnapshots.length}
    <div class="buttonContainer">
    <button
      on:click={() => {
        displaySavedSnapshots(
          'Snaps_svelte-demo_1.0.0_2022-07-30_12-40-45.snaps'
          );
        }}>Upload Snapshots</button
    >
    {#each collectionOfAllSnapshots as snapshot, idx}
    <button
    on:click={() => {
      activeIndex = idx;
      updateWindow(activeIndex);
        }}>Snapshot {idx + 1}</button
      >
      {/each}
  </div>
  <!-- <div class="container">
    <div class="block">
      <Snap {compState} />
    </div>
  </div> -->
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
    fill: rgb(240, 10, 121);
    stroke: steelblue;
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
    stroke: #ccc;
    stroke-width: 2px;
  }
</style>
