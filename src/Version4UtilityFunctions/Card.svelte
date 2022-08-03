<script>
    export let component;
    let ifOpened = false;

    let listOfKeys = Object.keys(component[Object.keys(component)[0]]);
    let componentName = Object.keys(component)[0];

    function openCardInfo(){
        ifOpened = !ifOpened;
    }
  
</script>

<!-- THE FOLLOW CODE ATTEMPS TO DISPLAY MORE INFOR FORM COMPONENT CARD. COULD BE USEFUL FOR FUTURE ITERATIONS -->
<!-- <div class="cardContainer"> 

    <div class="componentName">    
      <strong>{componentName}<strong/>      
    </div>

    <div class="componentProps">
    {#each listOfKeys as key} -->

<!--   
    {compState =  component[Object.keys(component)[0]][key]} -->
  
    <!-- <span>
      {#if component[Object.keys(component)[0]][key] === undefined}
      <span />

      {:else if Array.isArray(component[Object.keys(component)[0]][key])}
      <strong>{key}: [</strong> 
      <div>
       {#each component[Object.keys(component)[0]][key] as state}
       {state}
       <div>{state} </div>
       {/each}  
       <span>]</span>
      </div>  -->

      <!-- {:else if typeof component[Object.keys(component)[0]][key] === 'object'}
        <div class="object">
        {#each Object.entries(component[Object.keys(component)[0]][key]) as [key, value]}
          <strong>{key}:</strong> {value}
        {/each}
        </div>   -->
<!-- 
      {:else}
      <strong>{key}:</strong> : {component[Object.keys(component)[0]][key]}
        <br />
      {/if}
    </span>

    {/each}
  </div>
    
 </div> -->



<div class="cardContainer">
  <div class="componentName">    
    <button class="compName" on:click={openCardInfo}> <strong>{componentName}<strong/> </button>
  </div>

  
    <div class="componentStates">
      {#each listOfKeys as key}
      {#if ifOpened}
      <div>
          {key}: {component[Object.keys(component)[0]][key]}
      </div> 
      {/if}   
      {/each}
    </div>
 
</div>

<style>
    .cardContainer {
        display: flex;
        flex-direction: column;
        align-items: center;
        background-color: rgba(51, 34, 97, 0.524);
        opacity: 80%;
        color: whitesmoke;
        border: 1px solid rgb(253, 252, 252);
        border-radius: 5px;
        padding: 3px;
        margin: 3px;
        min-width: 200px;
        max-width: 300px;
    }

    .compName {
      background: none;
      color: inherit;
      border: none;
      padding: 0;
      font: inherit;
      cursor: pointer;
      outline: inherit;
    }

    .componentStates {
        /* text-align: center; */
        word-break: break-all; 
        border-top: 1px solid white;
        margin: 0;

    }

</style>