<script lang="ts">
  import { DirectoryData } from "../DataStore/SvelteStormDataStore";
  import type { FileState } from "../types";
  import FolderPlusOutline from 'svelte-material-icons/FolderPlusOutline.svelte'
  import FilePlusOutline from 'svelte-material-icons/FilePlusOutline.svelte'
  import FolderRefreshOutline from 'svelte-material-icons/FolderRefreshOutline.svelte'
  import { get } from "svelte/store";

  export let size = "40px";
  export let width = size;
  export let height = size;
  export let color = "#9300ff";
  export let viewBox = "-8 -8 40 40";

  const fs = require('fs');
  let mainDir: string = '';
  let createMainFile: boolean = false;
  let createMainFolder: boolean = false;
  let reload: boolean = false;
  let newName: string = '';
  let fileState: FileState = {};
  let fileName;
  const unsub = DirectoryData.subscribe((data) => {
    mainDir = data.mainDir;
    reload = data.reload;
    createMainFile = data.createMainFile;
    createMainFolder = data.createMainFolder;
    fileState = data.fileState;
  });
  const refreshDir = (): void => {
    DirectoryData.update((currentData) => {
      return {
        ...currentData,
        reload: true,
      };
    });
  };
  const addFolder = (): void => {
    DirectoryData.update((currentData) => {
      return {
        ...currentData,
        createMainFolder: true,
        activeFile: '',
      };
    });
  };
  const addFile = (): void => {
    DirectoryData.update((currentData) => {
      return {
        ...currentData,
        createMainFile: true,
        activeFile: '',
      };
    });
  };
  const createFileHandler = (e: KeyboardEvent, path: string): void => {
    DirectoryData.update((currentData) => {
      return {
        ...currentData,
        activeDir: path,
        activeFile: '',
      };
    });
    if (e.key !== 'Enter') return;
    newName = (e.target as HTMLInputElement).value;

    fs.writeFileSync(path + '/' + newName, '', (err) => {
      if (err) throw err;
    });
    DirectoryData.update((currentData) => {
      return {
        ...currentData,
        createMainFile: false,
        rename: false,
        activeFile: '',
      };
    });

    newName = '';
  };
  const createFolderHandler = (e: KeyboardEvent, path: string): void => {
    DirectoryData.update((currentData) => {
      return {
        ...currentData,
        activeDir: path,
        activeFile: '',
      };
    });
    if (e.key !== 'Enter') return;

    try {
      if (!fs.existsSync(path + '/' + newName)) {
        fs.mkdirSync(path + '/' + newName);
      }
    } catch (err) {
      console.error(err);
    }
    DirectoryData.update((currentData) => {
      return {
        ...currentData,
        createMainFolder: false,
        rename: false,
        activeFile: '',
      };
    });

    newName = '';
  };
  const resetStatus = (): void => {
    DirectoryData.update((currentData) => {
      return {
        ...currentData,
        createMainFolder: false,
        createMainFile: false,
      };
    });
  };
</script>

<div class="fileMenu">

  <div class="refresh" on:click={refreshDir}>
    <FolderRefreshOutline {color} {size} {width} {height} {viewBox} />
  </div>

  <div class="addFile" on:click={addFile}>
    <FilePlusOutline {color} {size} {width} {height} {viewBox} />
  </div>

  <div class="addFolder" on:click={addFolder}>
    <FolderPlusOutline {color} {size} {width} {height} {viewBox} />
  </div>

</div>

{#if createMainFile}
  <span>
    <input
      class="textBox"
      bind:this={fileName}
      on:keydown={(e) => createFileHandler(e, mainDir)}
      bind:value={newName}
      placeholder="New File Name"
      type="text"
    />
  </span>
{/if}

{#if createMainFolder}
  <span>
    <input
      class="textBox"
      bind:this={fileName}
      on:keydown={(e) => createFolderHandler(e, mainDir)}
      bind:value={newName}
      placeholder="New File Name"
      type="text"
    />
  </span>
{/if}

<style>
  .fileMenu {
    display: flex;
    flex-direction: row;
    flex-wrap: nowrap;
    justify-content: space-evenly;
    background-color: #27263a;
    margin-top: 1px;
    width: 100%;
    font-size: 10px;
  }
  /* .fileArea {
    float: left;
    height: 30px;
    font-size: 14px;
    color: white;
  } */

  .refresh:hover,
  .addFile:hover,
  .addFolder:hover
  {
    background-color: rgba(175, 175, 175, 0.5);
    border-radius: 8px;
    cursor: pointer;
  }

  .refresh {
    /* float: right; */
    /* height: 40px;
   width: 40px;
   position: center center; */
    /* 
    background-repeat: no-repeat;
    background-size: 24px; */
    /* filter: hue-rotate(180deg); */
    /* filter: brightness(255);
    filter:hue-rotate(25); */
  }
  .addFile {
    /* float: right; */
    /* background-image: url("../src/icons/addFile.png"); */
    /* height: 30px;
    width: 30px;
    background-position: center center;
    background-repeat: no-repeat;
    background-size: 24px;
    filter: brightness(255);
    color: white; */
    /* margin-right: 5px; */
  }
  .addFolder {
    /* float: right; */
    /* import CreateNewFolderTwoToneIcon from '@mui/icons-material/CreateNewFolderTwoTone'; */
    /* background-image: url("@mui/icons-material/CreateNewFolderTwoTone"); */
    /* background-image: url("../src/icons/add_folder2.svg"); */
    /* height: 30px;
    width: 30px;
    background-position: center center;
    background-repeat: no-repeat;
    background-size: 24px;
    filter: brightness(255);
    fill: blue; */
    /* margin-right: 5px; */
  }
</style>
