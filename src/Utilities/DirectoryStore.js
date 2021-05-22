import {writable} from 'svelte/store';

const DirectoryData = writable({
    fileTree: [],
    openFilePath :'',
    fileRead: false,
    activeFile: '',
    rename: false,
});


export default DirectoryData; 