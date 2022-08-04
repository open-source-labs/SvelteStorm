<script>
  let fileInput
</script>

<style>
  input {
    display: none;
  }
</style>

<input 
accept=".snaps"
type="file" 
bind:this={fileInput}
 />
<button on:click={fileInput.click()}>Open File...</button>