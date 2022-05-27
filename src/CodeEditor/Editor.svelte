<script lang="ts">
  import CodeMirror from "./CodeMirror.svelte";
  import {
    DirectoryData,
    openTabs,
    codeMirrorEditor,
    currentTabFilePath,
  } from "../Utilities/DirectoryStore.js";
  import { editorCache } from "../Utilities/DirectoryStore";

  const { ipcRenderer } = require("electron");
  const fs = require("fs");
  const path = require("path");

  let activeTabValue: number = 0;
  let activeEditor: number = 0;

  let language: string = "html";
  let filePath: string= ""; 
  let fileName: string= ""; 
  let readData: string = "";
  let title: string = "Svelte Storm";
  let count: number = 0;

  // define typescript types for the mode obj. (used in newFile)
  type Mode = {
    name: string,
    json?: boolean
    highlightFormatting?: boolean,
    fencedCodeBlockHighlighting?: boolean,
    base?: string
  }

  // define typescript types for newFile
  type NewFile = {
    editorValue: string
    ext: string
    editorLang: Mode
    filePath: string 
    fileName: string
    tabId: number
  }

  // creates a new tab when a new file is opened
  function addTab(newFile: NewFile): void {
    let duplicate: boolean = false;
    let focusTabId: number = newFile.tabId;
    $openTabs.map((tab) => {
      if (tab.filePath === newFile.filePath) {
        duplicate = true;
        focusTabId = tab.tabId;
      }
    });

    if (!duplicate) {
      $openTabs = [...$openTabs, newFile];
      count = count + 1;
    }

    activeTabValue = focusTabId;
    activeEditor = activeTabValue;

    // When a new file is opened, check if the editorCache cache in DirectoryStore.js contains a key equal to the current file path. If not, assign a new key with its value being the raw code contained within that file.
    if (!editorCache[$currentTabFilePath]) {editorCache[$currentTabFilePath] = newFile.editorValue};
    console.log('addTab complete');
  };


  // remove and reset tab order 
  function deleteTab(tab): void {
    //console.log('delete tab: ', tab);
    $openTabs = $openTabs.filter((t) => t.tabId != tab.tabId).map((t, i) => ({
      editorValue: t.editorValue,
      ext: t.ext,
      editorLang: t.editorLang,
      filePath: t.filePath,
      fileName: t.fileName, 
      tabId: i,
    }))

    count = count - 1;
    activeTabValue = count - 1;
    activeEditor = activeTabValue;

    // if at least 1 tab still open, update currentTabFilePath to the next tab over
    if(count > 0) {
      $currentTabFilePath = $openTabs[activeEditor].filePath;
    } else {
      $currentTabFilePath = '';
    }
  }


  // event listener for when a tab within the editor is clicked
  const handleClick = async (tab: NewFile) => {
    // update current tab in DirectoryStore.js to whichever tab was just clicked
    $currentTabFilePath = tab.filePath;

    // save current code inside the editor to a variable
    const currentUserCode: string = await $codeMirrorEditor.getValue();

    // update cache in DirectoryStore to reflect current code in the editor
    $editorCache[$openTabs[activeEditor].filePath] = currentUserCode;

    activeTabValue = tab.tabId;
    activeEditor = activeTabValue;

    console.log("handleClick complete");
  };

  type Modes = {
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

  const modes: Modes = {
    js: {
      name: "javascript",
      json: false,
    },
    json: {
      name: "javascript",
      json: true,
    },
    svelte: {
      name: "htmlmixed",
    },
    md: {
      name: "markdown",
      highlightFormatting: true,
      fencedCodeBlockHighlighting: true,
      base: "text/x-markdown",
    },
    css: {
      name: "css",
    },
    html: {
      name: "htmlmixed",
    },
  };


  // render file on open and add to store
  ipcRenderer.on("file-opened", function (evt:any, file: string, content) {
    filePath = file;
    process.platform === "win32"
      ? (fileName = file.slice().split("\\").pop())
      : (fileName = file.slice().split("/").pop());
    language = file.slice().split(".").pop();
    const newTab: NewFile = {
      editorValue : "content",
      ext : language,
      editorLang : modes[language],
      filePath : filePath,
      fileName : fileName,
      tabId : count
    }

    console.log("ipcRnderer: new tab added");
    addTab(newTab);
    if (file) {
      title = `${path.basename(file)} - ${title}`;
    }
  });

  
  // takes care of opening a file from within the file directory
    DirectoryData.subscribe(async data => {
    console.log('subscribing to the store');
 
    // if at least 1 tab is already open, grab the current code and save it to the cache before switching to a new tab
    if($currentTabFilePath !== ''){
    const currentUserCode = await $codeMirrorEditor.getValue();
    // update cache in DirectoryStore to reflect current code in the editor
    $editorCache[$openTabs[(activeEditor)].filePath] = currentUserCode;
    }

    readData = fs.readFileSync(data.openFilePath).toString();
    fileName = data.openFilePath.slice().split('/').pop();
    language = path.basename(data.openFilePath).split('.').pop();

    const newTab = {};
    if (data.fileRead) {
      const newTab: NewFile = {
        editorValue: '',
        ext: language,
        editorLang: modes[language],
        filePath: data.openFilePath, 
        fileName: fileName,
        tabId: count
      }

      
      if (data.openFilePath) { title = `${path.basename(data.openFilePath)} - Svelte Storm`; }
      // if file path in cache exists then retrieve cached code, else create a new file path in cache
      if($editorCache[data.openFilePath]) {
        newTab.editorValue = $editorCache[data.openFilePath];
      } else {newTab.editorValue = readData}

      $currentTabFilePath = newTab.filePath;
      addTab(newTab);
    }
  });


// </script>

<!--==========================================MARKUP==========================================-->
<ul>
  {#each $openTabs as tab}
    <li class={activeTabValue === tab.tabId ? "active" : ""}>
      <span class="tab-span" on:click={() => handleClick(tab)}>
        <img src="../src/icons/file_type_{tab.ext}.svg" alt={""} />
        {tab.fileName}
        <span
          class="delete-button"
          value={tab}
          on:click={() => deleteTab(tab)}
        >
          X
        </span>
      </span>
    </li>
  {/each}
</ul>

{#if $openTabs.length > 0}
  <div class="editor-body">

    <CodeMirror
      class="childClass current"
      bind:value={$openTabs[activeEditor].editorValue}
      bind:language={$openTabs[activeEditor].editorLang}
      bind:filePath={$openTabs[activeEditor].filePath}
    />
  </div>
{/if}

<style>
  .editor-body {
    width: 100%;
    /* height: 100vh; */
    height: 97%; /*2022-ST-RJ modified height of editor so resize handler still shows and is not covered by editor */
    overflow: scroll;
  }

  ul {
    font-size: 10px;
    display: flex;
    flex-direction: row;
    overflow: auto;
    white-space: nowrap;
    scrollbar-width: thin;
    height: 30px;
    padding-left: 0;
    margin-top: 0;
    margin-bottom: 0;
    list-style: none;
    border-bottom: 1px solid #dee2e6;
    background-color: rgb(
      27,
      26,
      26
    ); /* this is the background color of the tab zone*/
    /* border-radius: 5px; */
  }

  li {
    margin-bottom: -1px;
    background-color: rgb(37, 37, 37);
    color: #fff;
  }

  .tab-span {
    border: 1px solid transparent;
    border-top-left-radius: 0.25rem;
    border-top-right-radius: 0.25rem;
    display: flex;
    flex-direction: row;
    height: 30px;
    align-items: center;
    padding: 0 1rem;
    cursor: pointer;
    font-size: 12px;
  }
  .tab-span:hover {
    border-color: #e9ecef #e9ecef #dee2e6;
  }

  li.active > span {
    color: #ffffff;
    background-color: rgb(53, 50, 50);
    border-color: #dee2e6 #dee2e6 #fff;
  }

  img {
    height: 1em;
    background-color: inherit;
    margin-top: 3px;
    /* margin-bottom: 0; */
  }
  .delete-button {
    height: 10px;
    width: 10px;
    margin-left: 5px;
    padding-bottom: 4px;
    border-right: black;
    border-left: black;
    color: rgb(90, 90, 90);
  }

  .delete-button:hover {
    color: #f1f1f1;
  }
</style>
