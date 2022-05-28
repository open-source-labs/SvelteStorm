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
  export interface editorCache {
    [key: string]: string;
  }