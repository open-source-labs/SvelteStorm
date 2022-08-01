//   const chooseSnapsFile4 = (exports.getFileFromUser = async (targetWindow) => {

//   if (files) {
//     if (files) {
//       openFile(targetWindow, files.filePaths[0]);
//     }
//   }
// });

//   const chooseSnapsFile3 = (exports.getFileFromUser = async (targetWindow) => {
//   const files = await dialog.showOpenDialog(targetWindow, {
//     properties: ['openFile'],
//   });

//   userFile = files;

//   if (files) {
//     if (files) {
//       openFile(targetWindow, files.filePaths[0]);
//     }
//   }
// });




async function chooseSnapsFile2() {
  let { canceled, filePaths } = await dialog.showOpenDialog(this.window, {
    properties: ['openFile'],
    filters: [{ name: 'Snapshots', extensions: ['snaps'] }],
    message: 'Choose the collection of snapshots you wish to replay:',
    defaultPath: `${__dirname}/CapturedSnaps`,
  });
  if (canceled) {
    console.log(`\n🔴🔴🔴🔴🔴🔴🔴🔴🔴🔴🔴🔴🔴🔴🔴🔴🔴🔴🔴🔴🔴🔴🔴🔴🔴🔴🔴🔴`);
  }
  console.log(`\n🟢🟢🟢🟢🟢🟢🟢🟢🟢🟢🟢🟢🟢🟢🟢🟢🟢🟢🟢🟢🟢🟢🟢🟢🟢🟢🟢🟢`);

  console.log('file: Tree.svelte | line 369 | chooseSnapsFile | filePaths',
    filePaths
  );
}
  //   // for (let path of filePaths) {
  //   //   let qs = new URLSearchParams({ path }).toString();
  //   //   let win = new BrowserWindow({
  //   //     width: 1024,
  //   //     height: 768,
  //   //     webPreferences: {
  //   //       preload: `${__dirname}/preload.js`,
  //   //     },
  //   //   })
  //   //   win.loadURL(`http://localhost:5000/?${qs}`)
  //   // }
  // }

  async function chooseSnapsFile () {
    const selectedSnapsFile = await dialog.showOpenDialog({
      properties: ['openFile'],
      defaultPath: `${path.join(__dirname, '../public/CapturedSnaps/')}`,
      buttonLabel: 'Open SNAP!',
      message: 'Choose the collection of snapshots you wish to replay:',
      filters: [
      { name: 'Snapshots', extensions: ['snaps'] },
      ]
    })



  function chooseSnapsFile () {
    const selectedSnapsFile = dialog.showOpenDialog({
      properties: ['openFile', 'dontAddToRecent'],
      defaultPath: `${path.join(__dirname, '../public/CapturedSnaps/')}`,
      buttonLabel: 'Open SNAP!',
      message: 'Choose the collection of snapshots you wish to replay:',
      filters: [
      { name: 'Snapshots', extensions: ['snaps'] },
      ]
    })



    console.log('🔴🟠🟡🟢🔵🟣 | file: Tree.svelte | line 368 | chooseSnapsFile | selectedSnapsFile', selectedSnapsFile);
  }
<script>
  import * as d3 from 'd3';
  // import { dialog } from 'electron/main';
  import {
    DirectoryData,
    saveToFileName,
    snapshots,
  } from '../DataStore/SvelteStormDataStore';
  // import newWindow from '../index'
  export let hierarchy = {};

  const {ipcRenderer, BrowserWindow, dialog} = require('electron');
  const fs = require('fs');
  const path = require('path');
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
    console.log('🔴🟠🟡🟢🔵🟣 | OH SNAP, I BEEN CALLED ');

    // const singleCapturedSnapshot = createSnapshot(data);

    // console.log('🔴🟠🟡🟢🔵🟣 | SNAP BE MADE ');
    // // Update the store with newest snapshot
    // snapshots.update(() => {
    //   return [...collectionOfAllSnapshots, singleCapturedSnapshot];
    // });
    snapshots.update(() => {
      return [...collectionOfAllSnapshots, data.body.componentStates];
    });
    console.log(`\n🟢🟢🟢🟢🟢🟢🟢🟢🟢🟢🟢🟢🟢🟢🟢🟢🟢🟢🟢🟢🟢🟢🟢🟢🟢🟢🟢🟢`);
    console.log(
      '🔴🟠🟡🟢🔵🟣 | file: Chart.svelte | line 54 | snapshots.update | collectionOfAllSnapshots',
      collectionOfAllSnapshots
    );

    console.log('🔴🟠🟡🟢🔵🟣 | BEFORE WRITE SNAP FUNC CALL ');

    const stringSnapshot = JSON.stringify(collectionOfAllSnapshots);
    fs.writeFileSync(FileNPathNameToStoreSnapshots, stringSnapshot);
    console.log('🔴🟠🟡🟢🔵🟣 | AFTER WRITE SNAP FUNC CALL ');

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
    console.log('activeIndex', activeIndex);
    console.log(
      'collectionOfAllSnapshots[activeIndex]',
      collectionOfAllSnapshots[activeIndex]
    );
    console.log('treeData', treeData);
    drawTree(treeData);
  });

  /*
   * ==================================================
   *   Blah
   * ==================================================
   */
  function createSnapshot(data) {
    console.log('🔴🟠🟡🟢🔵🟣 | I B IN CREATE SNAP ');
    const singleCapturedSnapshot = [];
    data.body.componentStates.forEach((comp) => {
      const componentStateObj = {};
      componentStateObj[comp[2]] = comp[1];
      singleCapturedSnapshot.push(componentStateObj);
    });
    console.log('🔴🟠🟡🟢🔵🟣 | I B GONNA RETURN SNAP ');

    return singleCapturedSnapshot;
  }

  /*
   * ==================================================
   *   Blah
   * ==================================================
   */
  function writeSnapToDisk(singleCapturedSnapshot) {
    console.log('🔴🟠🟡🟢🔵🟣 | WRITE STD LINE 1 ');
    // stringify the snapshot
    const stringSnapshot = JSON.stringify(singleCapturedSnapshot);
    console.log('🔴🟠🟡🟢🔵🟣 | BEEN STRINGED ');

    // Check if file exists is yes, set 'fileExists = true'
    // fs.existsSync(path) -> returns boolean

    if ($saveToFileName && !myWriteStream) {
      console.log(`\n🟢🟢🟢🟢🟢🟢🟢🟢🟢🟢🟢🟢🟢🟢🟢🟢🟢🟢🟢🟢🟢🟢🟢🟢🟢🟢🟢🟢`);
      console.log(`\n🟢🟢🟢🟢🟢🟢🟢🟢🟢🟢🟢🟢🟢🟢🟢🟢🟢🟢🟢🟢🟢🟢🟢🟢🟢🟢🟢🟢`);
      console.log(`\n🟢🟢🟢🟢🟢🟢🟢🟢🟢🟢🟢🟢🟢🟢🟢🟢🟢🟢🟢🟢🟢🟢🟢🟢🟢🟢🟢🟢`);
      myWriteStream = fs.createWriteStream($saveToFileName, {
        encoding: 'utf8',
        autoClose: true,
      });
      console.log(`\n🟡🟡🟡🟡🟡🟡🟡🟡🟡🟡🟡🟡🟡🟡🟡🟡🟡🟡🟡🟡🟡🟡🟡🟡🟡🟡🟡🟡`);
      console.log(`\n🟡🟡🟡🟡🟡🟡🟡🟡🟡🟡🟡🟡🟡🟡🟡🟡🟡🟡🟡🟡🟡🟡🟡🟡🟡🟡🟡🟡`);
      console.log(`\n🟡🟡🟡🟡🟡🟡🟡🟡🟡🟡🟡🟡🟡🟡🟡🟡🟡🟡🟡🟡🟡🟡🟡🟡🟡🟡🟡🟡`);
    }

    if ($saveToFileName && myWriteStream) {
      console.log(`\n🟣🟣🟣🟣🟣🟣🟣🟣🟣🟣🟣🟣🟣🟣🟣🟣🟣🟣🟣🟣🟣🟣🟣🟣🟣🟣🟣🟣`);
      console.log(`\n🟣🟣🟣🟣🟣🟣🟣🟣🟣🟣🟣🟣🟣🟣🟣🟣🟣🟣🟣🟣🟣🟣🟣🟣🟣🟣🟣🟣`);
      console.log(`\n🟣🟣🟣🟣🟣🟣🟣🟣🟣🟣🟣🟣🟣🟣🟣🟣🟣🟣🟣🟣🟣🟣🟣🟣🟣🟣🟣🟣`);
      myWriteStream.write(stringSnapshot);
      console.log(`\n🔵🔵🔵🔵🔵🔵🔵🔵🔵🔵🔵🔵🔵🔵🔵🔵🔵🔵🔵🔵🔵🔵🔵🔵🔵🔵🔵🔵`);
      console.log(`\n🔵🔵🔵🔵🔵🔵🔵🔵🔵🔵🔵🔵🔵🔵🔵🔵🔵🔵🔵🔵🔵🔵🔵🔵🔵🔵🔵🔵`);
      console.log(`\n🔵🔵🔵🔵🔵🔵🔵🔵🔵🔵🔵🔵🔵🔵🔵🔵🔵🔵🔵🔵🔵🔵🔵🔵🔵🔵🔵🔵`);
    }

    console.log('🔴🟠🟡🟢🔵🟣 | FUNC B DONE ');
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
    console.log(`\n🟡🟡🟡🟡🟡🟡🟡🟡🟡🟡🟡🟡🟡🟡🟡🟡🟡🟡🟡🟡🟡🟡🟡🟡🟡🟡🟡🟡`);
    console.log(collectionOfAllSnapshots);
    console.log(`\n🟣🟣🟣🟣🟣🟣🟣🟣🟣🟣🟣🟣🟣🟣🟣🟣🟣🟣🟣🟣🟣🟣🟣🟣🟣🟣🟣🟣`);
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
    // console.log("componentArray:", componentArray);
    // console.log("activeIndex inside func:", activeIndex)
    console.log(
      '🔴🟠🟡🟢🔵🟣 | file: Tree.svelte | line 169 | createD3relationship | componentArray',
      componentArray
    );
    console.log(
      '🔴🟠🟡🟢🔵🟣 | file: Tree.svelte | line 179 | createD3relationship | activeIndex',
      activeIndex
    );
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
    console.log('****store:', store);
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
      .style('stroke', 'cyan')
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
    // ipcRenderer.send('TIME_TRAVEL', index);
    ipcRenderer.send('TIME_TRAVEL', [index, collectionOfAllSnapshots]);
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
    console.log('activeIndex', activeIndex);
    // console.log('snapshotList[activeIndex]', snapshotList[activeIndex])
    console.log('treeData', treeData);
    drawTree(treeData);
  }




async function chooseSnapsFile () {
  const files = await dialog.showOpenDialog({
    properties: ['openFile'],
  });

  userFile = files;

return files;

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
          chooseSnapsFile();
          displaySavedSnapshots(
            'Snaps_svelte-demo_1.0.0_2022-07-30_13-29-03.snaps'
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

<!-- 
/*
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
