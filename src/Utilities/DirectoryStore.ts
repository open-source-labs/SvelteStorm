import { writable } from 'svelte/store';
import type { Writable } from 'svelte/store';
//Move to separate TypeScript file

import type { NewFile, EditorCacheType, State } from '../types';

type EditorObj = {
  getCursor?: Function
  findWordAt?: Function
  getRange?: Function
  setValue?: Function
  setSize?: Function
  setOption?: Function
  getValue?: Function
}

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

const openTabs: Writable<NewFile[]> = writable<NewFile[]>([]);

const currentTabFilePath: Writable<string> = writable<string>('');

const editorCache: Writable<EditorCacheType> = writable<EditorCacheType>({});

//CodeMirror.fromTextArea is object being submitted in CodeMirror.svelte to this store
const codeMirrorEditor: Writable<EditorObj> = writable<object>(undefined);

export {
  DirectoryData,
  openTabs,
  editorCache,
  codeMirrorEditor,
  currentTabFilePath,
};
