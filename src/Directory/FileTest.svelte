<script>
    import DirectoryData from '../Utilities/DirectoryStore';
    import { onMount, onDestroy} from 'svelte';
    export let fileTreeTest;
    const fileState = {};
    
    const toggleVisibility = (path) => {
        if(!fileState[path]) fileState[path]= true;
        else fileState[path] = false;
        console.log('fileState',fileState);
    }

    let fileTree;
    const unsub = DirectoryData.subscribe(data =>{
    console.log('File Test Store Subscription');
    fileTree = data.fileTree;
    console.log('FileTree:', fileTree)
    });

 
    // store 
    onMount (()=>{
        console.log('FileTree mounted')
    });

    onDestroy(()=>{
        unsub();
        console.log('FileTree destroyed');
    }); 

    const getSubArray = (array) => {
        return array.slice(0,2);
    }
</script>

<div class=directory>
{#if fileTreeTest}
{#each fileTreeTest as {path,name, items}}
<ul>
    {#if items.length > 0}
    <li on:click={toggleVisibility(path)} class={!fileState[path] ? "liFolderClosed" : "liFolderOpen"}>{name}</li>
    {:else}
    <li class="liFiles">{name}</li>
    {/if}
    {#if fileState[path] && items.length > 0}
      
      <svelte:self fileTreeTest={items.sort((a,b) => {
        return b.items.length - a.items.length
    })} />
    {/if}
</ul>
{/each}
{/if}
</div>

<style>
    .liFolderClosed {
        cursor: pointer;
        padding: 0px 0 5px 25px;
        list-style: none;
        background-image: url("/home/svrchi/Desktop/Svelte Project/SvelteStorm/public/img/folderClosed.svg");
        background-repeat: no-repeat;
        background-position: left;
        background-size: 20px;
        /* border: 1px solid red; */
    }
    .liFolderOpen {
        cursor: pointer;
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
        cursor: pointer;
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
