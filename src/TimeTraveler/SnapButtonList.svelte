    <!-- * ==================================================
    *   Unused Skeleton component to hold snapshot buttons. Could be used in future iterations
    * ================================================== -->

<script>
  import {
    snapshots,
  } from '../DataStore/SvelteStormDataStore';
  import { createEventDispatcher } from 'svelte';

  // import Card from './Card.svelte';
  import CardHolder from './CardHolder.svelte';

  export let collectionOfAllSnapshots;

  // export function updateWindow();
  export let updateWindow = () => {}
  const {ipcRenderer, BrowserWindow} = require('electron');

const dispatch = createEventDispatcher();
// let $collectionOfAllSnaps;

function sendWindowUpdateRequest(idx) {
  dispatch('PleaseUpdateWindowFromSnapButton', {index: idx});
    // ipcRenderer.send('PleaseUpdateWindowFromSnapButton', (event, idx));
  }; 
  
  
</script>

<div id="buttonsAndTree"></div>

    {#if collectionOfAllSnapshots.length}
    <div class="buttonContainer">
    <button
      on:click={() => {
        // refresh();
        }}>Refresh</button
    >
                      {#each collectionOfAllSnapshots as snapshot, idx}
                        <button
                          on:click={() => {
                            // activeIndex = idx;
                            {updateWindow(idx)};
                            // ipcRenderer.send('PleaseUpdateWindowFromSnapButton', idx);

                            // sendWindowUpdateRequest(idx);
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
