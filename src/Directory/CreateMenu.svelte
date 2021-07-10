<script>
  export let filePath;
  import { DirectoryData } from '../Utilities/DirectoryStore';
  const fs = require('fs');
  let fileStat = fs.statSync(filePath)
  
  

  const unsub = DirectoryData.subscribe(data =>{
  });

  const renameHandler = () => {
    DirectoryData.update( currentData => {
      return {...currentData, rename :true};
    })
  }

  const deleteHandler = () => {   
    let stats = fs.statSync(filePath); 
    if(stats.isFile()){
      fs.unlinkSync(filePath);
    }

    if(stats.isDirectory()) {
      fs.rmdir(filePath, { recursive: true }, (err) => {
        if (err) {
          throw err;
        }
      });
    }
    
    DirectoryData.update( currentData => {
      return {...currentData, deleteFile:true};        
    })
  }

  const createFileHandler = () => {
    DirectoryData.update( currentData => {
      return {...currentData, createFile :true, activeFile:''};
    })
  }

  const createFolderHandler = () => {
    DirectoryData.update( currentData => {
      return {...currentData, createFolder :true, activeFile:''};
    })
  }

</script>

<!-- Svelte -->
<div class=createMenuWrapper>
  {#if fileStat.isFile()}
    <p class='items' on:click={renameHandler}>Rename</p>
    <p class='items'on:click={deleteHandler}>Delete</p>
  {/if}
  {#if fileStat.isDirectory()}
    <p  class='items' on:click={createFileHandler}>New File</p>
    <p  class='items' on:click={createFolderHandler}>New Folder</p>
    <p  class='items' on:click={renameHandler}>Rename</p>
    <p  class='items' on:click={deleteHandler}>Delete</p>    
  {/if}

</div>




<!-- Style -->
<style>
.createMenuWrapper{
  background-color: rgb(126, 107, 89);
  color: rgb(238, 227, 221);
  font-size: 15px;
  width:100px;
  height: auto;
  padding: 10px 10px 10px 10px;
}

.items:hover {
  color: rgb(250, 198, 164);
  cursor: pointer;
}
</style>
