  // define typescript types for the mode obj. (used in newFile)
  export type Mode = {
    name: string;
    json?: boolean;
    highlightFormatting?: boolean;
    fencedCodeBlockHighlighting?: boolean;
    base?: string;
  };

  // define typescript types for newFile
  export type NewFile = {
    editorValue: string;
    ext: string;
    editorLang: Mode;
    filePath: string;
    fileName: string;
    tabId: number;
  };

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