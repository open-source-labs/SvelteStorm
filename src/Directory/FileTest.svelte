<script>

  export let fileTree;
  import { DirectoryData } from '../Utilities/DirectoryStore';
  import CreateMenu from './CreateMenu.svelte';
  const fs = require('fs');
  const fileState = {};
  let rename = false;
  let deleteFile = false;
  let rightClickStatus = false;
  let activeFile = '';
  let newName = '';
  let createFile= false;
  let createFolder = false;
  let activeDir = '';
  let activeFolder = '';
  let fileName;
  
    
  const unsub = DirectoryData.subscribe(data =>{
    activeFile = data.activeFile;
    rename = data.rename;
    createFile = data.createFile;
    createFolder = data.createFolder; 
    activeDir = data.activeDir;     
    activeFolder = data.activeFolder;    
  });

  const toggleVisibility = (path) => {
    if(!fileState[path]) fileState[path]= true;
    else fileState[path] = false;
  }


  const dblClickHandler = (path) => {
    const openFilePath = path; 
    console.log(openFilePath)     
    DirectoryData.update(currentData =>{
      return {
        ...currentData,
        openFilePath,
        fileRead:true};
    })
  }

  const rightClickHandler = (path) => {    
    const openFilePath = path;
    const fullPath = path.substring(0, path.lastIndexOf('/'));      
    DirectoryData.update(currentData =>{
      return {
        ...currentData, 
        activeFile: openFilePath, 
        rename: false,
        activeDir:fullPath,
        activeFolder: path
      };
    })  

  }

  const renameHandler = (e,path) => {
    if (e.key !== 'Enter') return;    
    
    const fullPath = path.substring(0, path.lastIndexOf('/'));
    fs.renameSync(path, fullPath+'/'+newName);
    DirectoryData.update( currentData => {
      return {
      ...currentData, 
      rename:false, 
      activeFile: '',
      activeDir: fullPath
      };
    })
    
    newName = '';  
    
  }

  const createFileHandler = (e,path) => {
    DirectoryData.update( currentData => {
      return {
      ...currentData, 
      activeDir: path,
      activeFile: '',   
      };
     })
    
    if (e.key !== 'Enter') return;          
    
    fs.writeFileSync(path+'/'+newName, '', (err) => {
      if(err) throw err;        
    })
    DirectoryData.update( currentData => {
      return {
      ...currentData,         
      createFile: false,
      rename:false, 
      activeFile: '',
      };
    })

    fileState[path]= true;
    newName = '';
      
    
  }

  const createFolderHandler = (e,path) => {
    DirectoryData.update( currentData => {
      return {
      ...currentData, 
      activeDir: path,
      activeFile: '',   
      };
     })

    if (e.key !== 'Enter') return;  
         
    
    try {
      if (!fs.existsSync(path+'/'+newName)) {
        fs.mkdirSync(path+'/'+newName)
      }
    } catch (err) {
      console.error(err)
    }
    DirectoryData.update( currentData => {
      return {
      ...currentData,         
      createFolder: false,
      rename:false, 
      activeFile: '',
      };
    })
    fileState[path]= true;
    newName = '';
    
  }

  const resetRename = () => {
    DirectoryData.update( currentData => {
      return {
        ...currentData, 
        rename: false, 
        activeFile: '',
        createFile: false,
        createFolder:false
      };
    })
  }

</script>


<!-- Components -->
<div class=directory >
  {#if fileTree}
    {#each fileTree as {path,name, items}}
    <ul>
      {#if fs.statSync(path).isDirectory()}        
        {#if rename && activeFile === path}
          <span>
            <input 
            class='textBox'
            bind:this={fileName}
            on:keydown={(e) => renameHandler(e,path)} 
            bind:value={newName}
            placeholder={name}
            type="text"/>
          </span>
        {:else}
          <li on:click={toggleVisibility(path)} class={!fileState[path] ? "liFolderClosed" : "liFolderOpen"} on:contextmenu|preventDefault="{rightClickHandler(path)}" 
          on:click={activeFile || createFile || createFolder ? resetRename : undefined}>{name}</li>
          {#if activeFolder === path && createFile}
          <span>
            <input 
            class='textBox'
            bind:this={fileName}
            on:keydown={(e) => createFileHandler(e,path)} 
            bind:value={newName}
            placeholder='New File Name'
            type="text"/>
          </span>
        {/if}
        {#if activeFolder === path && createFolder}
          <span>
            <input 
            class='textBox'
            bind:this={fileName}
            on:keydown={(e) => createFolderHandler(e,path)} 
            bind:value={newName}
            placeholder='New Folder Name'
            type="text"/>
          </span>
        {/if}
          {#if activeFile === path}
          <CreateMenu filePath={path} />
          {/if}
        {/if}             
      {:else}        
        {#if rename && activeFile === path}
          <span>
            <input 
            class="textBox"   
            bind:this={fileName}         
            on:keydown={(e) => renameHandler(e,path)} 
            bind:value={newName}
            placeholder={name}
            type="text"/>
          </span>
        {:else}
          <li  on:contextmenu|preventDefault="{rightClickHandler(path)}" on:dblclick={dblClickHandler(path)} class="liFiles" on:click={activeFile ? resetRename : undefined}>
            
            <img src={fs.existsSync(`src/icons/file_type_${name.split('.').pop()}.svg`) ? `../src/icons/file_type_${name.split('.').pop()}.svg` : '../src/icons/file_type_exclam.svg'}  
            alt={''} />
            
            {name} </li>
          {#if activeFile === path}
              <CreateMenu filePath={path} />
          {/if}
        {/if}
      {/if}

      {#if fileState[path] && fs.statSync(path).isDirectory()}      
        <svelte:self fileTree={items.sort((a,b) => {
          return (fs.statSync(a.path).isDirectory() === fs.statSync(b.path).isDirectory() ? 0 : fs.statSync(a.path).isDirectory() ? -1 : 1)
        })}/>
      {/if}
    </ul>
    {/each}
  {/if}
</div>

<!-- CSS Styling -->
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
  }

  .liFiles {
    font-size: 15px;
    cursor: pointer;
    /* padding-left: 25px; */
    /* margin-left: 20px; */
    margin-top: 1px;
    list-style: none;
    /* background-image: url('./img/document.png'); */
    background-repeat: no-repeat;
    background-position: left;
    /* background-size: 15px; */
  }
  
  .directory{
    display: flex;
    flex-direction: column;
    align-items: flex-start;    
  }

  ul{
    padding-left: 10px;
    margin: 5px;
  }

  input{
    background-color: white;
  }

  .textBox {
    margin-left: 10px;
    padding: 10px 10px 10px 10px;
    font-size: 14px;
    width: 150px;
    
  }

img {
  width: 15px;
  margin-top: 10px;
}
</style>
