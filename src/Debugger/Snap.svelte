<script>
    export let compState;
    console.log(compState);
  </script>
  
  <span>
    {#if compState === undefined}
    <span />
    {:else if Array.isArray(compState)}
    <ul>
      {#each compState as state}
      <li><svelte:self compState={state}/></li>
      {/each}
    </ul>
    {:else if typeof compState === 'object'}
      <div class="object">
      {#each Object.entries(compState) as [key, value]}
        <strong>{key}:</strong> <svelte:self compState={value} />
      {/each}
    </div>
    {:else}
      {compState}
      <br />
    {/if}
  </span>
  
  <style>
    li {
      color: black;
      font-family: monospace;
    }
    .object {
      background-color: whitesmoke;
      width: 90vh;
      /* margin: 2px; */
    }
  </style>
  