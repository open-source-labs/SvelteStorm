<script>  
    import FileTest from './FileTest.svelte';    
    import { onMount, onDestroy, afterUpdate} from 'svelte';
    import DirectoryData from '../Utilities/DirectoryStore';
    const fs = require('fs');
    let savedTree = [];
    var remote = window.require('electron').remote;
    var electronFs = remote.require('fs');
    const {ipcRenderer} = require('electron');

    
    let directory;
    let rename;
    

    const unsub = DirectoryData.subscribe(data =>{
        rename = data.rename;
    });

    // store 
    onMount (()=>{
    });

    afterUpdate(() => {
        console.log(directory)
        if(directory) {
        // console.log('directory', directory);
        fs.watch(directory[0], (eventType, filename) => {
            console.log("eventType", eventType)
            if(eventType === 'rename'){  
                console.log(' IN RUN BUILD');
                readFileNames(directory);              
            }
        })
        }
    });
 
    onDestroy(()=>{
        unsub();
    });

    ipcRenderer.on('folder-opened', function (evt, file, content) {
        directory = content;
        if (directory && directory[0]){           
            readFileNames(directory);
        }
    })



    


    //method to read all the files inside the directory
    const readFileNames = (directory) => {
        var fileTree = new FileTree(directory[0]);        
        fileTree.build();
        
        savedTree = fileTree.items;
        savedTree.sort((a,b) => {
            return b.items.length - a.items.length;
        })
        DirectoryData.update(currentData =>{
            return savedTree;
        })
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
            //this.handleToggle = this.handleToggle.bind(this);
            //console.log(this.state.isOpen)
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

                if (stat.isDirectory()){
                    fileInfo.items = FileTree.readDir(fileInfo.path);
                }

                fileArray.push(fileInfo);
            })   
            return fileArray;
        }
    }
</script>

<!-- HTML -->

<div class=directoryContainer>
    {#if directory} 
    <FileTest directory={directory[0]} fileTree={savedTree} />
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

/* .directoryContainer::-webkit-scrollbar-track:hover {
    -webkit-box-shadow: inset 0 0 3px rgba(0, 0, 0, 0.3); 
    border-radius: 0px;
} */

.directoryContainer::-webkit-scrollbar-thumb:hover {
    background-color: #e28e2d;
    transition: background-color 2s ease-in-out;
}
</style>
