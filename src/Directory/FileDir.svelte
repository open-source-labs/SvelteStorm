<script>  
    var remote = window.require('electron').remote;
    var electronFs = remote.require('fs');
    var {dialog} = remote;
    import FileTest from './FileTest.svelte';
    let savedTree = [];
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
            //this.setState({fileTree});
            savedTree = fileTree.items;
            savedTree.sort((a,b) => {
                return b.items.length - a.items.length;
            })
            //console.log(Array.isArray(savedTree))
            console.log('fileTree',savedTree);
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


        
        //this.handleToggle = this.handleToggle.bind(this);
        //console.log(this.state.isOpen)
    }

    //method to build file tree
    build () {
        this.items = FileTree.readDir(this.path);
    }
    static readDir(path) {
        var fileArray = [];        
        
        electronFs.readdirSync(path).forEach(file => {
            var fileInfo = new FileTree(`${path}/${file}`,file);
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
    <FileTest fileTree={savedTree} />
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