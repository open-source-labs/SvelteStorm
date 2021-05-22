<script>
    export let fileTree;
    import DirectoryData from '../Utilities/DirectoryStore';
    const fileState = {};
    
    
    const unsub = DirectoryData.subscribe(data =>{
        console.log('File Directory Store Subscription');
        console.log('data',data);
    });

    const toggleVisibility = (path) => {
        if(!fileState[path]) fileState[path]= true;
        else fileState[path] = false;
        console.log('fileState',fileState);
    }
    console.log(fileTree)

    const dblClickHandler = (path) => {
        console.log(`clicking now on ${path}`);  
        const openFilePath = path;      
        DirectoryData.update(currentData =>{
                    return {...currentData,openFilePath,fileRead:true};
                })        
    }

</script>

<div class=directory>
{#if fileTree}
{#each fileTree as {path,name, items}}
<ul>
    {#if items.length > 0}
    <li on:click={toggleVisibility(path)} class={!fileState[path] ? "liFolderClosed" : "liFolderOpen"}>{name}</li>
    {:else}
    <li on:dblclick={dblClickHandler(path)} class="liFiles">{name}</li>
    {/if}
    {#if fileState[path] && items.length > 0}
      
      <svelte:self fileTree={items.sort((a,b) => {
        return b.items.length - a.items.length
    })} />
    {/if}
</ul>
{/each}
{/if}
</div>

<style>
    
    .liFolderClosed {
        font-size: 15px;
        cursor: pointer;
        padding: 0px 0 5px 25px;
        list-style: none;
        background-image: url("./img/folderClosed.svg");
        background-repeat: no-repeat;
        background-position: left;
        background-size: 15px;
        /* border: 1px solid black; */
    }

    .liFolderOpen {
        font-size: 15px;
        cursor: pointer;
        display: flex;
        justify-content: flex-start;
        padding: 10px 0 5px 25px;
        list-style: none;
        background-image: url('./img/folderOpen.svg');
        background-repeat: no-repeat;
        background-position: left;
        background-size: 15px;
        /* border: 1px solid black; */
    }

    .liFiles {
        font-size: 15px;
        cursor: pointer;
        padding-left: 25px;
        margin-left: 20px;
        margin-top: 1px;
        list-style: none;
        background-image: url('./img/document.png');
        background-repeat: no-repeat;
        background-position: left;
        background-size: 15px;
        /* border: 1px solid blue; */
    }
    
    .directory{
        display: flex;
        flex-direction: column;
        align-items: flex-start;
        /* border:1px solid black; */
    }

    ul{
        padding-left: 10px;
        margin: 5px;
    }
</style>
