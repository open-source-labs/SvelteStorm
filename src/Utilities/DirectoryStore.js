import {writable} from 'svelte/store';

const DirectoryData = writable({
    fileTree: [],
    openFilePath :'',
    fileRead: false,
});


export default DirectoryData; 