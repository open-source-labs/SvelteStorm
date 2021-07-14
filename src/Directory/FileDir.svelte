<script>  
    import FileTest from './FileTest.svelte';  
    import DirTopMenu from './DirTopMenu.svelte'  
    import { onMount, onDestroy, afterUpdate} from 'svelte';
    import { DirectoryData } from '../Utilities/DirectoryStore';

    const fs = require('fs');
    let savedTree = [];
    var remote = window.require('electron').remote;
    var electronFs = remote.require('fs');
    const {ipcRenderer} = require('electron');

    
    let directory;
    let rename;
    let stateObj = {};
    let resultArr = [];
    let fsTimeout;
    export let activeDir = '';
    let mainDir = '';
    export let reload = false; 
  
  const unsub = DirectoryData.subscribe(data =>{
    rename = data.rename;      
    activeDir = data.activeDir;
    mainDir = data.mainDir;
    reload = data.reload;
    
    
  });
  // store 
  onMount (()=>{
  
  });
  afterUpdate(() => {
    if(reload){
      console.log('reloading now')
      readFileNames(directory);
      DirectoryData.update(currentData =>{
        return {
            ...currentData,
            reload: false
        }
      })
    }
    if(activeDir) {              
      fs.watch(activeDir, (eventType, filename) => {
        console.log('directory',directory)
        if(eventType === 'rename' && !fsTimeout){  
          readFileNames(mainDir);              
        }
        if(!fsTimeout){
          fsTimeout = setTimeout(function() { fsTimeout=null }, 3000);
        }        
      });
    }    
  });

  onDestroy(()=>{
      unsub();
  });
  ipcRenderer.on('folder-opened', function (evt, file, content) {
    directory = Array.isArray(content) ? content[0] : content;      
    console.log('directory',directory)
    if(directory) {       
      fs.readdir(directory, (error,readfiles) => {     
        let files = readfiles.filter(file => file !== '.git');        
        if (files.length ){
          var fileTree = new FileTree(directory);        
          fileTree.build();                
          savedTree = fileTree.items;
          savedTree.sort((a,b) => {
            return (fs.statSync(a.path).isDirectory() === fs.statSync(b.path).isDirectory() ? 0 : fs.statSync(a.path).isDirectory() ? -1 : 1)
          })

          
          DirectoryData.update(currentData =>{
            return {
                ...currentData,
                fileTree: savedTree,
                currentDir: directory,
                mainDir: directory              
            }
          })
        }
        else {
          DirectoryData.update(currentData =>{
            return {
                ...currentData,                  
                activeDir: directory,
                mainDir: directory
            }
          })
        }
      })
      
    }      
  });
  
  
  //method to read all the files inside the directory
  const readFileNames = (mainDir) => {
    if(mainDir) {       
      var fileTree = new FileTree(mainDir);        
      fileTree.build();                
      savedTree = fileTree.items;
      savedTree.sort((a,b) => {
        return (fs.statSync(a.path).isDirectory() === fs.statSync(b.path).isDirectory() ? 0 : fs.statSync(a.path).isDirectory() ? -1 : 1)
      })
      
      DirectoryData.update(currentData =>{
        return {
            ...currentData,
            fileTree: savedTree,              
        }
      })
    }
       
    
    
  }
  
  class FileTree {
    constructor(path, name = null){        
      this.path = path;
      this.name = name;
      this.items = [];
      this.state = {
          path : path,
          name: name,
          items: [],
          color : 'white',
          isOpen : false
      }   
    }
  //method to build file tree
    build () {
               
        this.items = FileTree.readDir(this.path,'',0);
      
    }
    static readDir(path) {
      var fileArray = [];        
      
      electronFs.readdirSync(path).forEach(file => {
               
        var fileInfo = new FileTree(`${path}/${file}`, file);
        var stat = electronFs.statSync(fileInfo.path);
        if (file.split('.').pop() === 'svelte'){
          
          if(path.includes('node_modules') !== true) {
            var content = fs.readFileSync(`${path}/${file}`).toString();                    
            var stateArr = [];
            var value = content.split(/\r?\n/);
            if(value !==[""]) {
              value.forEach( el => {
                if(el && el.includes('export')) {                       
                  el = el.replace(/\s/g, '');
                  if(el.includes('exportlet')) {
                    el = el.replace('exportlet','');
                    stateArr.push(el.replace(';',''));
                  }
                  if(el.includes('exportconst')) {
                    el = el.replace('exportconst','');
                    stateArr.push(el.replace(';',''));
                  }
                               
                  stateObj[file] = stateArr;                                 
                }
                DirectoryData.update(currentData =>{
                  return {
                    ...currentData,
                      stateObj: stateObj
                  };
                })                        
                      
              })
            }                
          }                
        }
        if (stat.isDirectory()){          
          fileInfo.items = FileTree.readDir(fileInfo.path);
        }

        if (fileInfo.name !== '.git') {
          fileArray.push(fileInfo);
        }
      })
    return fileArray;
    }
  }
</script>

<!-- HTML -->

<div class=directoryContainer>
  <DirTopMenu></DirTopMenu>
  {#if directory}     
  <FileTest directory={mainDir} fileTree={savedTree} />
  {/if}
</div>
<!-- CSS -->
<style>
.directoryContainer{
    max-height: 50vh;
    overflow-y: scroll;
    display: flex;
    flex-direction: column;
    align-content: flex-start;
}
.directoryContainer::-webkit-scrollbar {
width: 12px;
}
.directoryContainer::-webkit-scrollbar-thumb:hover {
    background-color: #e28e2d;
    transition: background-color 2s ease-in-out;
}

</style>