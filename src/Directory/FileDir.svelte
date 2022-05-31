<script lang="ts">  
    import FileTest from './FileTest.svelte';  
    import DirTopMenu from './DirTopMenu.svelte'  
    import { onMount, onDestroy, afterUpdate} from 'svelte';
    import { DirectoryData } from '../Utilities/DirectoryStore';
    import type { Filetree } from '../types'
    const fs = require('fs');
    let savedTree:string[];
    const {ipcRenderer} = require('electron');

    let directory;
    let rename;
    let stateObj = {};
    let resultArr:[] = [];
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
      fs.watch(activeDir, (eventType) => {
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

  ipcRenderer.on('folder-opened', function (evt, file:string, content:string) {
    directory = Array.isArray(content) ? content[0] : content;      
    if(directory) {       
      fs.readdir(directory, (error,readfiles) => {     
        let files:string = readfiles.filter(file => file !== '.git');        
        if (files.length ){
          var fileTree:Filetree = new FileTree(directory);        
          fileTree.build();                
          savedTree = fileTree.items;
          savedTree.sort((a:any, b:any) => {
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
      var fileTree:Filetree = new FileTree(mainDir);        
      fileTree.build();                
      savedTree = fileTree.items;
      savedTree.sort((a:any,b:any) => {
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
    constructor (path: string, name:string | null = null){        
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
    build (this:Filetree) {
      this.items = FileTree.readDir(this.path);
    }
    
    static readDir(path) {
      var fileArray = [];

      fs.readdirSync(path).forEach(file => {
        var fileInfo:Filetree = new FileTree(`${path}/${file}`, file);
        var stat = fs.statSync(fileInfo.path);
        //2022-ST-RJ reading svelte files to help construct state management tree. storing info in the stateObj of the DirectoryStore aliased as DirectoryData
        if (file.split('.').pop() === 'svelte'){
          
          if(path.includes('node_modules') !== true) {
            var content:string = fs.readFileSync(`${path}/${file}`).toString();                    
            var stateArr:string[] = [];
            //splitting contents of svelte files at carriage returns and newline. The ? signifies once or none occurrence...look for carriage return and split if it exists, otherwise split at newline?
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
                DirectoryData.update(currentData => {
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
  <FileTest fileTree={savedTree} />
  {/if}
</div>
<!-- CSS -->
<style>
.directoryContainer{
    max-height: 70vh;
    overflow-y: scroll;
    display: flex;
    flex-direction: column;
    align-content: flex-start;
}
.directoryContainer::-webkit-scrollbar {
  width: 12px;
}
.directoryContainer::-webkit-scrollbar-thumb:hover {
    background-color: rgba(28, 28, 36, 0.678); 
    transition: background-color 2s ease-in-out;
}

</style>