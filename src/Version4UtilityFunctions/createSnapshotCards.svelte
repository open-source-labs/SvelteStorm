<script>
  import Card from './Card.svelte';
export function createSnapshotCards(receivedSingleAppSnapshot) {
  console.log(`\n🟢🟢🟢🟢🟢🟢🟢🟢🟢🟢🟢🟢🟢🟢🟢🟢🟢🟢🟢🟢🟢🟢🟢🟢🟢🟢🟢🟢`);
  console.log(`\n🟢🟢🟢🟢🟢🟢🟢🟢🟢🟢🟢🟢🟢🟢🟢🟢🟢🟢🟢🟢🟢🟢🟢🟢🟢🟢🟢🟢`);
  console.log(receivedSingleAppSnapshot);
  console.log(`\n🟡🟡🟡🟡🟡🟡🟡🟡🟡🟡🟡🟡🟡🟡🟡🟡🟡🟡🟡🟡🟡🟡🟡🟡🟡🟡🟡🟡`);
  console.log(`\n🟡🟡🟡🟡🟡🟡🟡🟡🟡🟡🟡🟡🟡🟡🟡🟡🟡🟡🟡🟡🟡🟡🟡🟡🟡🟡🟡🟡`);



//* Iterate thru array of components (objects) that make up receivedSingleAppSnapshot
  for (let component of receivedSingleAppSnapshot){
    //get the key of each component
    let componentName = Objects.keys(component)[0];
    let componentState = component[componentName]; // object
    //for each componentName, create a new card

      //for each key-value pair in componentState, create a new p tag
  }
  


}

</script>

<div>
  {#each receivedSingleAppSnapshot as component, idx}
   <Card
    componentName = {Objects.keys(component)[0]}
   />
  {/each}
</div>


