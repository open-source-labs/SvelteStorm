<script>
  import Card from './Card.svelte';
  export let snapshot;
      
</script>
<div class="cardHolder">

  {#each snapshot as component, idx}
  <div class="card">
    <Card {component} />
    </div>
  {/each}
    
</div>

<style>
    .cardHolder {
        padding: 3px;
        margin: 3px;
    }
</style>
