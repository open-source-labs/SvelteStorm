<script>
  const {ipcRenderer, BrowserWindow} = require('electron');
  import {snapshots} from './stores.js';
  import Snap from "./Snap.svelte"
  const fs = require('fs');
  const path = require('path');
  import {saveToFileName} from '../Utilities/JimsStore';
  // import { indexes } from "d3";
  let snapshotList;
  let activeIndex = 0;
  let collectionOfAllSnapshots;
  $: compState = collectionOfAllSnapshots[activeIndex];
  let myWriteStream;
  let FileNPathNameToStoreSnapshots = '';

  /*
   * ==================================================
   *   Open da File First...
   * ==================================================
   */

  // const myFileHandle = fs.openSync($saveToFileName, 'a+')

  // const myWriteStream = myFileHandle.createWriteStream({
  //   encoding: 'utf8',
  //   autoClose: false,
  //   emitClose: false
  // })

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
    console.log('🔴🟠🟡🟢🔵🟣 | OH SNAP, I BEEN CALLED ');
    // console.log("DATA SNAPSHOT ", data);
    const singleCapturedSnapshot = createSnapshot(data);
    console.log('🔴🟠🟡🟢🔵🟣 | SNAP BE MADE ');
    // Update the store with newest snapshot
    snapshots.update(() => {
      return [...collectionOfAllSnapshots, singleCapturedSnapshot];
    });
    console.log('🔴🟠🟡🟢🔵🟣 | BEFORE WRITE SNAP FUNC CALL ');

    // const stringSnapshot = JSON.stringify(singleCapturedSnapshot)
    const stringSnapshot = JSON.stringify(collectionOfAllSnapshots);
    console.log(`\n🟠🟠🟠🟠🟠🟠🟠🟠🟠🟠🟠🟠🟠🟠🟠🟠🟠🟠🟠🟠🟠🟠🟠🟠🟠🟠🟠🟠`);
    console.log(`\n🟠🟠🟠🟠🟠🟠🟠🟠🟠🟠🟠🟠🟠🟠🟠🟠🟠🟠🟠🟠🟠🟠🟠🟠🟠🟠🟠🟠`);
    console.log(`\n🟠🟠🟠🟠🟠🟠🟠🟠🟠🟠🟠🟠🟠🟠🟠🟠🟠🟠🟠🟠🟠🟠🟠🟠🟠🟠🟠🟠`);
    // // if(!daFileNPathName && saveToFileName) daFileNPathName = saveToFileName
    // console.log(
    //   '🔴🟠🟡🟢🔵🟣 | file: Chart.svelte | line 54 | ipcRenderer.on | stringSnapshot',
    //   stringSnapshot
    // );
    // console.log(
    //   '🔴🟠🟡🟢🔵🟣 | file: Chart.svelte | line 57 | ipcRenderer.on | $saveToFileName',
    //   saveToFileName
    // );
    // console.log(
    //   '🔴🟠🟡🟢🔵🟣 | file: Chart.svelte | line 57 | ipcRenderer.on | daFileNPathName',
    //   daFileNPathName
    // );
    // console.log(
    //   '🔴🟠🟡🟢🔵🟣 | file: Chart.svelte | line 57 | ipcRenderer.on | daFileNPathName',
    //   daFileNPathName2
    // );
    // fs.writeFileSync('/Users/jimtermini/Desktop/OSPProjects/SvelteStorm4/Snaps_svelte-demo_1.0.0_2022-07-29_14-08-59.snaps', '[\n' + stringSnapshot + ']\n');
    fs.writeFileSync(FileNPathNameToStoreSnapshots, '[\n' + stringSnapshot + ']\n');

    // myWriteStream = fs.createWriteStream($saveToFileName, {
    //   encoding: 'utf8',
    //   autoClose: true,
    // })
    // myWriteStream.write(stringSnapshot);
    // writeSnapToDisk(singleCapturedSnapshot);
    // writeSnapToDisk(collectionOfAllSnapshots);
    console.log('🔴🟠🟡🟢🔵🟣 | AFTER WRITE SNAP FUNC CALL ');
  });

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
      // const myFileHandle = fs.openSync($saveToFileName, 'a+')

      // const myWriteStream = myFileHandle.createWriteStream({
      // myWriteStream = fs.createWriteStream($saveToFileName, {
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

    // if(fs.existsSync($saveToFileName) ){
    //   console.log('🔴🟠🟡🟢🔵🟣 | INSIDE IF EXIST ');

    //   console.log('🔴🟠🟡🟢🔵🟣 | file: Chart.svelte | line 51 | INSIDE APPEND IF | saveToFileName', $saveToFileName);
    //   // Open file for READ & WRITE and APPEND access. (WriteFileSync method)
    //   fs.appendFileSync($saveToFileName, "," + stringSnapshot + "]\n")
    //   console.log('🔴🟠🟡🟢🔵🟣 | APPEND COMNPLETE ');

    //     // If the file DOES exist ... read the last x characters
    //     // Looking for ",]]\n" or ",]]\r" or "]]\r" or

    //     // console.log the stringified state to ensure we are storing what we think we are.

    //     // write

    //   } else {
    //     console.log('🔴🟠🟡🟢🔵🟣 | INSIDE ELSE ');
    //     // If file DOES NOT exist write "[\n" to start the file.
    //     fs.writeFileSync($saveToFileName, "[\n" + stringSnapshot + "]\n")
    //     console.log('🔴🟠🟡🟢🔵🟣 | POAST WFS ');

    //     console.log('🔴🟠🟡🟢🔵🟣 | file: Chart.svelte | line 51 | INSIDE NEW FILE IF | saveToFileName', $saveToFileName);
    // }
    // write single captured snapshot to the captured snapshots file in public dir and send to server

    // Naming convention for file yyyy-mm-dd HH-mm-ss appname appversion.snap
    // fs.closeSync($saveToFileName);

    console.log('🔴🟠🟡🟢🔵🟣 | FUNC B DONE ');
  }

  // User chooses to display previously saved snapshots
  function displaySavedSnapshots(fileName) {
    const stringSavedSnapshots = fs.readFileSync(
      path.join(__dirname, `../public/CapturedSnaps/${fileName}`)
    );
    const savedSnapshots = JSON.parse(stringSavedSnapshots);
    snapshots.update(() => {
      return savedSnapshots;
    });
  }

  // user clicks snapshot button - send message to browser to display that specific snapshot
  function updateWindow(index) {
    ipcRenderer.send('TIME_TRAVEL', index);
  }
</script>

<!-- /*
* ==================================================
*   Display the State "Snapshorts"
* ==================================================
*/ -->

{#if collectionOfAllSnapshots.length}
  <div class="buttonContainer">
    {#each collectionOfAllSnapshots as snapshot, idx}
      <button
        on:click={() => {
          activeIndex = idx;
          updateWindow(activeIndex);
        }}>Snapshot {idx + 1}</button
      >
    {/each}
  </div>
  <div class="container">
    <div class="block">
      <Snap {compState} />
    </div>
  </div>
{/if}

<style>
  .buttonContainer {
    display: flex;
    justify-content: space-around;
    flex-wrap: wrap;
  }
  .block {
    width: 180px;
  }
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
  .container {
    display: flex;
    flex-direction: row;
    align-items: flex-start;
    justify-content: space-evenly;
  }
</style>
