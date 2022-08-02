import { writable } from 'svelte/store';
import type { Writable } from 'svelte/store';

import type { NewFile, EditorCacheType, EditorObj, State, componentStateObj } from '../types';

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
  parentChildTree: {},
});

const openTabs: Writable<NewFile[]> = writable<NewFile[]>([]);

const currentTabFilePath: Writable<string> = writable<string>('');

const editorCache: Writable<EditorCacheType> = writable<EditorCacheType>({});

//CodeMirror.fromTextArea is object being submitted in CodeMirror.svelte to this store
const codeMirrorEditor: Writable<EditorObj> = writable<object>(undefined);

const snapshots = writable([]);

let showEditorBackground: Writable<boolean> = writable<boolean>(true);

let appBeingDebugedPath: Writable<string> = writable<string>('');

let saveToFileName: Writable<string> = writable<string>('');

// const collectedSnap: Writable<SnapForPassingAround> = writable<SnapForPassingAround>([]);

const collectionOfSnaps: Writable<State> = writable<State>({

})

// const collectionOfAllSnaps: Writable<Array> = writable<Array>([]);
// const collectionOfAllSnaps: Writable = writable([]);
const collectionOfAllSnaps = writable([]);


export {
  DirectoryData,
  openTabs,
  editorCache,
  codeMirrorEditor,
  currentTabFilePath,
  showEditorBackground,
  appBeingDebugedPath,
  saveToFileName,
  snapshots,
  collectionOfSnaps,
  collectionOfAllSnaps,
};


/*
* ==================================================
*   THIS IS WHAT THE DATA INSIDE SNAPSHOTS LOOKS LIKE
* ==================================================

data.body
{
    componentStates: [ [ [Object], [Object], 'Task' ], [ [Object], [Object], 'Task' ] ],
    cacheLength: 2
}

componentStates => [component, componentState, component Constructor]
data.body.componentStates
[
    [
      { '$$': [Object] },
      {
        toDoList: {},
        taskDate: '9/22/2022',
        task: 'Phone Screen',
        idx: 1,
        list: [Array]
      },
      'Task'
    ],
    [
      { '$$': [Object] },
      {
        toDoList: {},
        taskDate: '9/23/2022',
        task: 'Job Interview',
        idx: 2,
        list: [Array]
      },
      'Task'
    ]
  ]


​
​
data.body.componentStates[0]
[
    {
      '$$': {
        fragment: {},
        ctx: [Array],
        props: [Object],
        bound: {},
        on_mount: [],
        on_destroy: [],
        on_disconnect: [],
        before_update: [],
        after_update: [],
        context: {},
        callbacks: {},
        dirty: [Array],
        skip_bound: false,
        root: {}
      }
    },
    {
      toDoList: {},
      taskDate: '9/22/2022',
      task: 'Phone Screen',
      idx: 1,
      list: [ [Object], [Object] ]
    },
    'Task'
  ]
​
data.body.componentStates[0][0]['$$'].props
{ taskDate: 0, task: 1, idx: 2 }
*/
