<script>
  export let filePath;
  import DirectoryData from '../Utilities/DirectoryStore';
  const fs = require('fs');
  let fileStat = fs.statSync(filePath)
  console.log('isfile',fileStat.isFile())
  console.log('isFolder', fileStat.isDirectory())
  

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
      return {...currentData, createFile :true};
    })
  }

  const createFolderHandler = () => {
    DirectoryData.update( currentData => {
      return {...currentData, createFolder :true};
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
.create-button {
  width: 90%;
  height: 20px;
  text-align: center;
  margin-left: auto;
  margin-right: auto;
  display: block;
  margin-top: 5px;
  /* border-radius: 10px; */
}

.create-button:hover {
  background-color: rgb(33, 37, 43);
  color: white;
  font-weight: 550;
}

.items:hover {
  color: rgb(250, 198, 164);
  cursor: pointer;
}
</style>

