<script>
    export let compState;
  </script>
  
  <!-- The Following recurses through compState and creates different html elements based on the data type -->
  <div class="card">
    {#if compState === undefined}
    <span />
    {:else if Array.isArray(compState)}
    
        {#each compState as state}
        <p><svelte:self compState={state}/></p>
        <br>
        {/each}
      
 
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
  </div>
  
  <style>
    .card{
      color: white;
      font-family: monospace;
      background-color: #0d1117;
      list-style: none;
    }
    /* .item {
      color: white;
      font-family: monospace;
      background-color: #0d1117;
      list-style: none;
    } */
    /* li {
      color: white;
      font-family: monospace;
      background-color: #0d1117;
      list-style: none;
    } */
    span {
      /* background-color: #0d1117; */
    }

    .card ul {
      background-color: #0d1117;
    }

    ul {
      list-style: none;
    }

    .object {
      background-color: #0d1117;
      border: 1px solid #444;
      border-radius: 4px;
      text-align: center;
      /* width: 90vh; */
      
      /* margin: 2px; */
    }

   


  </style>
  