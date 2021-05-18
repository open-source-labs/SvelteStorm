<script>
    import { onMount } from 'svelte'
    import * as monaco from 'monaco-editor/esm/vs/editor/editor.api'
    export let value;
    let containerElt;
    onMount(() => {
      monaco.editor.create(containerElt, {
        value: value.join('\n'),
        language: 'html',
        theme:"vs",
      })
    })
</script>
  
<style>
  .monaco {
    position: relative;
    width: 100%;
    height: 100%;
  }
</style>
  
<svelte:head />
<div class="monaco" bind:this={containerElt} />

  