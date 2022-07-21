<script>
  const { ipcRenderer } = require("electron");
  import { snapshots } from "./stores.js";
  import Snap from "./Snap.svelte";
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

  let ifClicked = false;

  function handleClick(idx) {
    activeIndex = idx;
    ifClicked = !ifClicked;
    console.log('*****************', compState.componentStates[0][0]['$$'].props)
  }

  console.log(snapshotList);
</script>

<ul>
  {#if snapshotList.length}
    {#each snapshotList as snapshot, idx}
      <button on:click={()=>activeIndex = idx}>Snapshot {idx + 1}</button>
    {/each}
      <Snap {compState} />
  {/if}
</ul>
