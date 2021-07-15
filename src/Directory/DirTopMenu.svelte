<script>
  import { DirectoryData } from '../Utilities/DirectoryStore';
  const fs = require('fs');
  let mainDir = '';
  let createMainFile= false;
  let createMainFolder = false;
  let reload = false;
  let newName = '';
  let fileState = {}
  let fileName;
  const unsub = DirectoryData.subscribe(data =>{
      mainDir = data.mainDir;
      reload = data.reload; 
      createMainFile = data.createMainFile;
      createMainFolder = data.createMainFolder;
      fileState = data.fileState;
  });
  const refreshDir = () => {
    console.log('clickig now');
    DirectoryData.update( currentData => {
      return {
        ...currentData, 
        reload: true
      };
    })
  }
  const addFolder = () => {
    console.log('clicking addFolder');
    DirectoryData.update( currentData => {
      return {
        ...currentData, 
        createMainFolder: true,
        activeFile: ''
      };
    })
  }
  const addFile = () => {
    console.log('clicking addFile');
    DirectoryData.update( currentData => {
      return {
        ...currentData, 
        createMainFile: true,
        activeFile: ''
      };
    })
  }
  const createFileHandler = (e,path) => {
    DirectoryData.update( currentData => {
      return {
      ...currentData, 
      activeDir: path,
      activeFile: '',   
      };
     })
    if(e.key !== 'Enter') return;
       
    newName = e.target.value;      
    
    fs.writeFileSync(path+'/'+newName, '', (err) => {
      if(err) throw err;        
    });
    DirectoryData.update( currentData => {
      return {
      ...currentData,         
      createMainFile: false,
      rename:false, 
      activeFile: '',
      };
    })      
    
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
    if(e.key !== 'Enter') return;
    
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
      createMainFolder: false,
      rename:false, 
      activeFile: '',
      };
    })   
    
    newName = '';
    
  }
  const resetStatus = () => {
    DirectoryData.update( currentData => {
        return {
        ...currentData,         
        createMainFolder: false,
        createMainFile:false,
        };
      })   
  }
</script>
  <div class='fileMenu'>
    <div class='fileArea' on:click={createMainFile || createMainFolder ? resetStatus : undefined}>{process.platform === "win32" ?  mainDir.substring(mainDir.lastIndexOf('\\')+1) : mainDir.substring(mainDir.lastIndexOf('/')+1)}</div>
    <div class='refresh' on:click={refreshDir}></div>
    <div class='addFile' on:click = {addFile}></div>
    <div class='addFolder'on:click = {addFolder}></div> 
  </div>
  {#if createMainFile}
    <span>      
      <input 
        class='textBox'
        bind:this={fileName}
        on:keydown={(e) => createFileHandler(e,mainDir)} 
        bind:value={newName}
        placeholder='New File Name'
        type="text"/>      
    </span>
  {/if}

  {#if createMainFolder}
    <span>
      <input 
        class='textBox'
        bind:this={fileName}
        on:keydown={(e) => createFolderHandler(e,mainDir)} 
        bind:value={newName}
        placeholder='New File Name'
        type="text"/>
    </span>
  {/if}


<style>
  .fileMenu {
    background-color: rgb(27, 27, 26);
    /* border-radius: 10px; */
    /* padding-left: 2px; */
    padding-right: 10px;
    padding-top : 2px;
    padding-bottom: 2px;
    width: 100%;
  }
  .fileArea {    
    float: left;    
    height: 20px;
    font-size: 14px;
    color: white;
  }
  .refresh {
    float: right;
    background-image: url('../src/icons/refresh.png');
    height: 20px;    
    width: 20px;
    background-repeat: no-repeat;
    background-size: 20px;
  }
  .addFile {
    float: right;
    background-image: url('../src/icons/addFile.png');
    height: 20px;
    width: 20px;
    background-repeat: no-repeat;
    background-size: 20px;
    margin-right: 5px;
  }
  .addFolder {
    float: right;
    background-image: url('../src/icons/add_folder2.png');
    height: 20px;
    width: 20px;
    background-repeat: no-repeat;
    background-size: 20px;
    margin-right: 5px;
  }
  .textBox {
    margin-left: 10px;
    padding: 10px 10px 10px 10px;
    font-size: 14px;
    width: 150px;    
  }
</style>