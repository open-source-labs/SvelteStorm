<script>
  const { ipcRenderer, BrowserWindow } = require("electron");
  import { snapshots } from "./stores.js";
  import Snap from "./Snap.svelte";
  import { indexes } from "d3";
  let snapshotList;
  let activeIndex = 0;
  let states = [];
  $: compState = states[activeIndex];
  // let compState = snapshotList

  snapshots.subscribe((arr) => {
    snapshotList = arr;
  });

  ipcRenderer.on("JIMSHOT", (event, data) => {
    console.log("DATA JIMSHOT ", data);
    snapshots.update(() => {
      return [...snapshotList, data.body];
    });
    console.log("after update: ", snapshotList);
    const componentStateArray = []
    data.body.componentStates.forEach(comp => {
      const componentStateObj = {}
      componentStateObj[comp[2]] = comp[1];
      componentStateArray.push(componentStateObj)
    })
    states = [...states.slice(0, data.body.cacheLength), componentStateArray]
  });


  function updateWindow (index) {
    ipcRenderer.send('TIME_TRAVEL', index)
  }

</script>

<ul>
  {#if snapshotList.length}
    {#each snapshotList as snapshot, idx}
      <button on:click={()=> {
        activeIndex = idx;
        updateWindow(activeIndex);
        }}>Snapshot {idx + 1}</button>
    {/each}
      <Snap {compState} />
  {/if}
</ul>
