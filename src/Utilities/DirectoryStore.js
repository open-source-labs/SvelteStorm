import {writable} from 'svelte/store';

const DirectoryData = writable({
  mainDir: '',
  fileTree: [],
  openFilePath :'',
  fileRead: false,
  stateObj: {},
  activeFile: '',
  rename: false,
  deleteFile: false,
  activeDir : '',
  createFile: false,
  createFolder: false,
  createMainFile: false,
  createMainFolder: false,
  reload: false,
  activeFolder : ''
});

const openTabs = writable([]);

export { DirectoryData, openTabs }; 