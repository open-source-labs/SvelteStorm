<script>
  const { ipcRenderer, BrowserWindow } = require("electron");
  import { snapshots } from "./stores.js";
  import Snap from "./Snap.svelte";
  // import { indexes } from "d3";
  let snapshotList;
  let activeIndex = 0;
  let states = [];
  $: compState = states[activeIndex];

  snapshots.subscribe((arr) => {
    snapshotList = arr;
  });

/*
   * ==================================================
   *   When the snapshot data is received, update the snapshots in the store
   *   Then, loop through the data to get the individual component states
   *   States holds the component and component states
   * ==================================================
*/

  ipcRenderer.on("SNAPSHOT", (event, data) => {
    // console.log("DATA SNAPSHOT ", data);
    snapshots.update(() => {
      return [...snapshotList, data.body];
    });
    const componentStateArray = []
    data.body.componentStates.forEach(comp => {
      const componentStateObj = {}
      componentStateObj[comp[2]] = comp[1];
      componentStateArray.push(componentStateObj)
    })
    states = [...states.slice(0, data.body.cacheLength), componentStateArray]
  });

// user clicks snapshot button - send message to browser to display that specific snapshot
  function updateWindow (index) {
    ipcRenderer.send('TIME_TRAVEL', index)
  }

</script>


  {#if snapshotList.length}
  <div class="buttonContainer">
    {#each snapshotList as snapshot, idx}
      <button on:click={()=> {
        activeIndex = idx;
        updateWindow(activeIndex);
        }}>Snapshot {idx + 1}</button>
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
  .container {
    display: flex;
    flex-direction: row;
    align-items: flex-start;
    justify-content: space-evenly;
  }
</style>