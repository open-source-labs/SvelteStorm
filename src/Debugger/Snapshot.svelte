<script>
 export let compState;

 let activeIndex = 0;
 let components = compState.componentStates;
 let variables = compState.componentStates[activeIndex][0]['$$'].props

</script>



{#each components as component, idx}
     <!-- Component Name -->
     <div>{component[2]}
     <!-- Variable and their values -->
          {#each Object.keys(component[1]) as key}
               <li>
                    {key}: {component[1][key]}
               </li>
          {/each}
     </div>

{/each}
