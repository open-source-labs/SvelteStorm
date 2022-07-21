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
        <br>
        {/each}
      </ul>
 
    {:else if typeof compState === 'object'}
      <div class="object">
      {#each Object.entries(compState) as [key, value]}
     
        <strong>{key}:</strong> <svelte:self compState={value} />
        <br>
    
    
      {/each}
    </div>
    {:else}
      {compState}
      <br />
    {/if}
  </span>
  
  <style>
    li {
      color: white;
      font-family: monospace;
      background-color: rgb(27,26,26);
      list-style: none;
    }
    span {
      /* background-color: #0d1117; */
    }

    span ul {
      background-color: #0d1117;
    }

    ul {
      list-style: none;
    }

    .object {
      background-color: #0d1117;
      border: 1px solid #444;
      border-radius: 4px;
      /* width: 90vh; */
      
      /* margin: 2px; */
    }

   


  </style>
  