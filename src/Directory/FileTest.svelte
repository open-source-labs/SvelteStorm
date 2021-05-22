<script>
    export let fileTree;
    export let directory;
    import { onMount , afterUpdate} from 'svelte';
    import DirectoryData from '../Utilities/DirectoryStore';
    import CreateMenu from './CreateMenu.svelte';
    const fs = require('fs');
    const fileState = {};
    let rename = false;

    console.log('first console for directory', directory)
        
    let rightClickStatus = false;
    let activeFile = '';
    let newName = '';
    // console.log('newName', newName) 


    // onMount(() => {
    //     if(directory) {
    //     console.log('directory', directory);
    //     fs.watch(directory, (eventType, filename) => {
    //         console.log("eventType", eventType)
    //         if(eventType === 'rename'){
    //             console.log('file name was change!')
    //         }
    //     })
    // }

    // });

    // afterUpdate(() => {
    //     if(directory) {
    //     console.log('directory', directory);
    //     fs.watch(directory, (eventType, filename) => {
    //         console.log("eventType", eventType)
    //         if(eventType === 'rename'){
    //             console.log('file name was change!')
    //         }
    //     })
    // }

    // });

    if(directory) {
        console.log('directory', directory);
        // fs.watch(directory, (eventType, filename) => {
        //     console.log("eventType", eventType)
        //     if(eventType === 'rename'){
        //         console.log('file name was change!')
        //     }
        // })
    }

    
    const unsub = DirectoryData.subscribe(data =>{
        // console.log('File Test Store Subscription');
        activeFile = data.activeFile;
        rename = data.rename;
    });

    const toggleVisibility = (path) => {
        if(!fileState[path]) fileState[path]= true;
        else fileState[path] = false;
        // console.log('fileState',fileState);
    }
    // console.log(fileTree)

    const dblClickHandler = (path) => {
        // console.log(`clicking now on ${path}`);  
        const openFilePath = path;      
        DirectoryData.update(currentData =>{
            return {...currentData,openFilePath,fileRead:true};
        })      
    }

    const rightClickHandler = (path) => {
        // console.log('right clicking now!'); 
        const openFilePath = path;      
        DirectoryData.update(currentData =>{
            return {...currentData, activeFile: openFilePath, rename: false};
        })   
    }

    const renameHandler = (e,path) => {
        console.log('key', e.key);
         if(e.key === 'Enter') {
         newName = e.target.value;
        //  console.log("new Name inside renameHandler", newName);
        //  console.log("path inside renameHandler", path);
         const fullPath = path.substring(0, path.lastIndexOf('/'));
        //  console.log('just the path', fullPath);
        //  console.log('just the path', fullPath+'/'+newName);
         fs.renameSync(path, fullPath+'/'+newName);
         rename = false;
         activeFile = '';
         }
    }

    // a = "www.example.com/hi/test/home.html";
    // b = a.substr(0, a.lastIndexOf('/'));
 
 

</script>

<div class=directory>
{#if fileTree}
{#each fileTree as {path,name, items}}
<ul>
    {#if items.length > 0}
    <li on:click={toggleVisibility(path)} class={!fileState[path] ? "liFolderClosed" : "liFolderOpen"}>{name}</li>
    {:else}
    <!-- if rename:true <input> 
    
    else, <li> -->
        {#if rename && activeFile === path}
            <span>
                <input 
                on:keypress={(e) => renameHandler(e,path)} 
                value={newName}
                type="text"/>
            </span>
        {:else}
    <li  on:contextmenu|preventDefault="{rightClickHandler(path)}" on:dblclick={dblClickHandler(path)} class="liFiles">{name}</li>
        {#if activeFile === path}
        <CreateMenu filePath={path} />
        {/if}
        <!-- if remame===true
            render this rename component , pass this {path } as props
         -->
         <!-- inside rename componet
            - path from fileTest
            - input newnamedata
            - store.newName = path + input name

         -->
         {/if}
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

input{
    background-color: white;
}

</style>
