<script>
    export let component;

    // let component = {Task: {
    //   idx: 1,
    //   ifSubTask: false,
    //   list: [
    //     {date: '9/20/2022', task: 'apply to job', subTasksList: []},
    //     {subTasksList: []},
    //     {subTasksList: []}
    //   ],
    //   subTasksList: [],
    //   task: "apply to job",
    //   taskDate: "9/20/2022",
    //   toDoList: {}
    // }}

    let listOfKeys = Object.keys(component[Object.keys(component)[0]]);
    // console.log(listOfKeys) 

    let componentName = Object.keys(component)[0];
  
</script>


<!-- <div class="cardContainer"> 

    <div class="componentName">    
      <strong>{componentName}<strong/>      
    </div>

    <div class="componentProps">
    {#each listOfKeys as key}

  
    {compState =  component[Object.keys(component)[0]][key]} -->
  
    <!-- <span>
      {#if component[Object.keys(component)[0]][key] === undefined}
      <span />

      {:else if Array.isArray(component[Object.keys(component)[0]][key])}
      <strong>{key}: [</strong> 
      <div>
       {#each component[Object.keys(component)[0]][key] as state}
       {state}
       <div><svelte:self component[Object.keys(component)[0]][key]={state}/> </div>
       {/each}  
       <span>]</span>
      </div> 
      
      

      {:else if typeof component[Object.keys(component)[0]][key] === 'object'}
        <div class="object">
        {#each Object.entries(component[Object.keys(component)[0]][key]) as [key, value]}
          <strong>{key}:</strong> {value}
        {/each}
        </div> 

      {:else}
      <strong>{key}:</strong> : {component[Object.keys(component)[0]][key]}
        <br />
      {/if}
    </span>

    {/each}
 
  </div>
    
 </div>
  -->



<div class="cardContainer">
    <div class="componentName">    
        <strong>{componentName}<strong/>
    </div>
    <div class="componentStates">
        {#each listOfKeys as key}
        <p>
            {key}: {component[Object.keys(component)[0]][key]}
        </p>
        
        {/each}
    </div>

</div>
    
<style>
    .cardContainer {
        display: flex;
        flex-direction: column;
        align-items: center;
        background-color: rgba(28, 17, 59, 0.524);
        opacity: 80%;
        color: whitesmoke;
        border: 1px solid rgb(253, 252, 252);
        border-radius: 5px;
        padding: 3px;
        margin: 3px;

    }


    .componentStates {
        text-align: center;
        border: 1px solid white;
        margin: 0;

    }

</style>
