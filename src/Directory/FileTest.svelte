<script>
    export let fileTree;
    const fileState = {};
    const toggleVisibility = (path) => {
        if(!fileState[path]) fileState[path]= true;
        else fileState[path] = false;
    }

    // console.log()
 
</script>
<div class=directory>
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
</div>

<style>
    .liFolderClosed {
        padding: 0px 0 5px 25px;
        list-style: none;
        background-image: url("/home/svrchi/Desktop/Svelte Project/SvelteStorm/public/img/folderClosed.svg");
        background-repeat: no-repeat;
        background-position: left;
        background-size: 20px;
        border: 1px solid red;
    }
    .liFolderOpen {
        display: flex;
        justify-content: flex-start;
        padding: 10px 0 5px 25px;
        list-style: none;
        background-image: url('/home/svrchi/Desktop/Svelte Project/SvelteStorm/public/img/folderOpen.svg');
        background-repeat: no-repeat;
        background-position: left;
        background-size: 20px;
        /* border: 1px solid black; */
    }


    .liFiles {
        padding-left: 25px;
        margin-left: 20px;
        margin-top: 3px;
        list-style: none;
        background-image: url('/home/svrchi/Desktop/Svelte Project/SvelteStorm/public/img/document.png');
        background-repeat: no-repeat;
        background-position: left;
        background-size: 20px;
        /* border: 1px solid blue; */
    }
    
    .directory{
        display: flex;
        flex-direction: column;
        align-items: flex-start;
        /* border:1px solid black; */
    }
</style>
