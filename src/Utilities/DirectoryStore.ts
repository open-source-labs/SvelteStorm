import { writable } from 'svelte/store';
import type { Writable } from 'svelte/store';
//Move to separate TypeScript file

import type { NewFile, EditorCacheType, State } from '../types';

const DirectoryData: Writable<State> = writable<State>({
  mainDir: '',
  fileTree: [],
  openFilePath: '',
  fileRead: false,
  stateObj: {},
  activeFile: '',
  rename: false,
  deleteFile: false,
  activeDir: '',
  createFile: false,
  createFolder: false,
  createMainFile: false,
  createMainFolder: false,
  reload: false,
  activeFolder: '',
});

console.log(DirectoryData);
const openTabs: Writable<NewFile[]> = writable<NewFile[]>([]);

const currentTabFilePath: Writable<string> = writable<string>('');

const editorCache: Writable<EditorCacheType> = writable<EditorCacheType>({});

const codeMirrorEditor = writable(undefined);

export {
  DirectoryData,
  openTabs,
  editorCache,
  codeMirrorEditor,
  currentTabFilePath,
};
