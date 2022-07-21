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


  {#if snapshotList.length}
  <div class="buttonContainer">
    {#each snapshotList as snapshot, idx}
      <button on:click={()=>activeIndex = idx}>Snapshot {idx + 1}</button>
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
    /* border: 5px solid; */
    /* border-color: aqua; */
    width: 200px;
    /* color: white; */
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
    align-items: center;
    justify-content: center;
  }
</style>