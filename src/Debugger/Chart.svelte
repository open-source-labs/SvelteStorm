<script>
  import Snap from "./Snap.svelte"
  import {snapshots} from '../DataStore/SvelteStormDataStore.js';
  import {saveToFileName} from '../DataStore/SvelteStormDataStore';
  const {ipcRenderer, BrowserWindow} = require('electron');
  const fs = require('fs');
  const path = require('path');
  // import { indexes } from "d3";
  let snapshotList;
  let activeIndex = 0;
  let collectionOfAllSnapshots;
  $: compState = collectionOfAllSnapshots[activeIndex];
  let myWriteStream;
  let FileNPathNameToStoreSnapshots = '';


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
    const singleCapturedSnapshot = createSnapshot(data);
    console.log('🔴🟠🟡🟢🔵🟣 | SNAP BE MADE ');
    // Update the store with newest snapshot
    snapshots.update(() => {
      return [...collectionOfAllSnapshots, singleCapturedSnapshot];
    });
        console.log(`\n🟢🟢🟢🟢🟢🟢🟢🟢🟢🟢🟢🟢🟢🟢🟢🟢🟢🟢🟢🟢🟢🟢🟢🟢🟢🟢🟢🟢`);
      console.log('🔴🟠🟡🟢🔵🟣 | file: Chart.svelte | line 54 | snapshots.update | collectionOfAllSnapshots', collectionOfAllSnapshots);
    
    console.log('🔴🟠🟡🟢🔵🟣 | BEFORE WRITE SNAP FUNC CALL ');

    const stringSnapshot = JSON.stringify(collectionOfAllSnapshots);
    fs.writeFileSync(FileNPathNameToStoreSnapshots, '[\n' + stringSnapshot + ']\n');
    console.log('🔴🟠🟡🟢🔵🟣 | AFTER WRITE SNAP FUNC CALL ');
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
    console.log(collectionOfAllSnapshots)
        console.log(`\n🟣🟣🟣🟣🟣🟣🟣🟣🟣🟣🟣🟣🟣🟣🟣🟣🟣🟣🟣🟣🟣🟣🟣🟣🟣🟣🟣🟣`);
    snapshots.update(() => {
      return collectionOfAllSnapshots;
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
  }
</script>

<!-- /*
* ==================================================
*   Display the State "Snapshorts"
* ==================================================
*/ -->

{#if collectionOfAllSnapshots.length}
  <div class="buttonContainer">
    <button
          on:click={() => {
            displaySavedSnapshots('Snaps_svelte-demo_1.0.0_2022-07-29_17-25-20.snaps');
          }}>Upload Snapshots</button>
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


<!-- /*
* ==================================================
*   Style for this display states component
* ==================================================
*/ -->
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
