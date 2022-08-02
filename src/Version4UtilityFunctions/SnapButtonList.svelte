<script>
  import {
    collectionOfAllSnaps,
  } from '../DataStore/SvelteStormDataStore';

  // import Card from './Card.svelte';
  import CardHolder from './CardHolder.svelte';
// let $collectionOfAllSnaps;
  console.log(`\n🟣🟣🟣🟣🟣🟣🟣🟣🟣🟣🟣🟣🟣🟣🟣🟣🟣🟣🟣🟣🟣🟣🟣🟣🟣🟣🟣🟣`);
  console.log(`\n🟣🟣🟣🟣🟣🟣🟣🟣🟣🟣🟣🟣🟣🟣🟣🟣🟣🟣🟣🟣🟣🟣🟣🟣🟣🟣🟣🟣`);
  // console.log('🔴🟠🟡🟢🔵🟣 | file: CardHolder.svelte | line 5 | snapshot', snapshot);
      
</script>

<div id="buttonsAndTree">
  <!-- /*
    * ==================================================
    *   Display the State "Snapshorts"
    * ==================================================
    */ -->

  {#if $collectionOfAllSnaps.length}
    <div class="buttonContainer">
      {#each $collectionOfAllSnaps as snapshot, idx}
        <button
          on:click={() => {
            // activeIndex = idx;
            // updateWindow(activeIndex);
          }}>Snapshot {idx + 1}</button
        >
        <CardHolder {snapshot} />
      {/each}
    </div>
  {/if}
</div>


<style>
    
    .buttonContainer {
        background-color: rgb(0, 244, 195);
        padding: 3px;
        margin: 3px;
    }

    .buttonContainer {
    margin-left: 10px;
    display: flex;
    flex-direction: column;
    justify-content: start;
    flex-wrap: wrap;
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


</style>
