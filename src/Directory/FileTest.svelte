<script>

    export let fileTree;
    const fileState = {};
    const toggleVisibility = (path) => {
        if(!fileState[path]) fileState[path]= true;
        else fileState[path] = false;
    }
 
</script>
{#each fileTree as {path,name, items}}
<ul>
    {#if items.length > 0}
    <li on:click={toggleVisibility(path)} class={!fileState[path] ? "liFolderClosed" : "liFolderOpen"}>{name}</li>
    {:else}
    <li on:click={toggleVisibility(path)} class="liFiles">{name}</li>
    {/if}
    {#if fileState[path] && items.length > 0}
      
      <svelte:self fileTree={items.sort((a,b) => {
          return b.items.length - a.items.length
      })} />
    {/if}
</ul>
{/each}

<style>
    .liFolderClosed {
        margin: 0;
        padding: 10px 0 10px 25px;
        list-style: none;
        background-image: url('../img/folder.png');
        background-repeat: no-repeat;
        background-position: left;
        background-size: 20px;
    }
    .liFolderOpen {
        margin: 0;
        padding: 10px 0 10px 25px;
        list-style: none;
        background-image: url('../img/folder.png');
        background-repeat: no-repeat;
        background-position: left;
        background-size: 20px;
        border: 1px solid black;
    }


    .liFiles {
        margin-left: 10px;
        list-style: none;
    }
    
</style>