  // define typescript types for the mode obj. (used in newFile in types.ts line 40)
  export type Mode = {
    name: string;
    json?: boolean;
    highlightFormatting?: boolean;
    fencedCodeBlockHighlighting?: boolean;
    base?: string;
  };

  // used in Editor.svelte
  export type Modes = {
    js: {
      name: string;
      json: boolean;
    };
    json: {
      name: string;
      json: boolean;
    };
    svelte: {
      name: string;
    }; 
    md: {
      name: string;
      highlightFormatting: boolean;
      fencedCodeBlockHighlighting: boolean;
      base: string
    },
    css: {
      name: string
    },
    html: {
      name: string;
    },
  }

  // define typescript types for newFile
  export type NewFile = {
    editorValue: string;
    ext: string;
    editorLang: Mode;
    filePath: string;
    fileName: string;
    tabId: number;
  };
  
  // used in FileDir.svelte
  export type Filetree = {
    build?:Function
    items?: any,
    path?:string,
    name?:string,
  }

  export interface StateObjInterface {
    [key: string]: string[];
  }
  export interface EditorCacheType {
    [key: string]: string;
  }

  //fileState obj type
export type FileState = {
  [key: string]: boolean;
  }

  //state object type
export type State = {
  mainDir?: string,
  fileTree?: string[],
  openFilePath? :string,
  fileRead?: boolean,
  stateObj?: StateObjInterface,
  activeFile?: string,
  rename?: boolean,
  deleteFile?: boolean,
  activeDir?: string,
  createFile?: boolean,
  createFolder?: boolean,
  createMainFile?: boolean,
  createMainFolder?: boolean,
  reload?: boolean,
  activeFolder?: string,
  fileState?: FileState
}

// imported in DirectoryStore.ts. EditorObj is used in 
export type EditorObj = {
  getCursor?: Function
  findWordAt?: Function
  getRange?: Function
  setValue?: Function
  setSize?: Function
  setOption?: Function
  getValue?: Function
}