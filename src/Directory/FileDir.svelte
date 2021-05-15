<script>  
    var remote = window.require('electron').remote;
    var electronFs = remote.require('fs');
    var {dialog} = remote;
    import { onMount, onDestroy} from 'svelte';
    import { dataset_dev } from 'svelte/internal';
    import DirectoryData from '../Utilities/DirectoryStore';
    import FileTest from './FileTest.svelte';
    let savedTree = [];

const unsub = DirectoryData.subscribe(data =>{
    // console.log('File Directory Store Subscription');
    // console.log('data',data);
});

// store 
onMount (()=>{
    // console.log('Directory mounted')
});

onDestroy(()=>{
    unsub();
    // console.log('component destroyed');
});


// Directory.update(current => {
//     return [data ... data];
// })




const handleOpenFolder = () => {
        //console.log('saved Tree', savedTree)
        let dialogOption =  {properties: ['openDirectory']};
        //console.log(dialog)
        dialog.showOpenDialog(dialogOption)
        .then( filenames => {
        var directory = filenames.filePaths;
        
        if (directory && directory[0]){        
            var fileTree = new FileTree(directory[0]);        
            fileTree.build();
            fileTree.items.sort((a,b) => {
                return b.items.length - a.items.length;
            })
            savedTree = fileTree.items;
            // console.log('file tree:',fileTree);
            const updateTree = {fileTree: fileTree.items};
            console.log('updateTree:', updateTree);
            DirectoryData.update(currentData =>{
                return updateTree;
            })
        }
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
    <button class=directoryButton on:click={handleOpenFolder}>Get Files</button>
    <FileTest fileTreeTest={savedTree}/>
</div>

<style>
    .directoryContainer{
        /* border: 1px solid red; */
        overflow: auto;
        display: flex;
        flex-direction: column;
        align-content: flex-start;
    }

    .directoryButton{
        width:25%;
        margin:2px;
    }
</style>