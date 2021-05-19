<script>  
    import FileTest from './FileTest.svelte';    
    import { onMount, onDestroy} from 'svelte';
    // import { dataset_dev } from 'svelte/internal';
    import DirectoryData from '../Utilities/DirectoryStore';
    let savedTree = [];
    var remote = window.require('electron').remote;
    // var {dialog} = remote;
    var electronFs = remote.require('fs');
    const {ipcRenderer} = require('electron');

    
    let directory;

    const unsub = DirectoryData.subscribe(data =>{
        console.log('File Directory Store Subscription');
        console.log('data',data);
    });

    // store 
    onMount (()=>{
        // console.log('Directory mounted')
    });

    onDestroy(()=>{
        unsub();
        // console.log('component destroyed');
    });

    ipcRenderer.on('folder-opened', function (evt, file, content) {
        directory = content;
        if (directory && directory[0]){        
                var fileTree = new FileTree(directory[0]);        
                fileTree.build();
                
                savedTree = fileTree.items;
                savedTree.sort((a,b) => {
                    return b.items.length - a.items.length;
                })
                DirectoryData.update(currentData =>{
                    return savedTree;
                })
                //console.log(Array.isArray(savedTree))
                console.log('fileTree',savedTree);
            }
    })

    
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
    <FileTest fileTree={savedTree} />
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

.directoryContainer::-webkit-scrollbar-track:hover {
    -webkit-box-shadow: inset 0 0 3px rgba(0, 0, 0, 0.3); 
    /* border-radius: 0px; */
}

.directoryContainer::-webkit-scrollbar-thumb:hover {
    /* border-radius: 10px; */
    background-color: #e28e2d;
    transition: background-color 2s ease-in-out;
    /* animation: fadeIn 5s; */
    /* -webkit-box-shadow: inset 0 0 6px rgba(0,0,0,0.5);  */
}
</style>
