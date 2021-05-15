<script>  
    import FileTest from './FileTest.svelte';
    var remote = window.require('electron').remote;
    var electronFs = remote.require('fs');
    const {ipcRenderer} = require('electron');

    let savedTree = [];
    let directory;
    ipcRenderer.on('folder-opened', function (evt, file, content) {
        directory = content;
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
    <FileTest fileTree={savedTree} />
</div>

<style>
    .directoryContainer{
        overflow: auto;
        display: flex;
        flex-direction: column;
        align-content: flex-start;
    }
</style>