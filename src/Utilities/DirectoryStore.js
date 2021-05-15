import {writable} from 'svelte/store';

const DirectoryData = writable({
    fileTree: [],
});


export default DirectoryData; 