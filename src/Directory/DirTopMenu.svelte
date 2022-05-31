<script lang="ts">
  import { DirectoryData } from "../Utilities/DirectoryStore";
  import type { FileState } from "../types";
  import { get } from "svelte/store";
  // import type { KeyboardEvent, KeyboardInputEvent } from "electron";
  const fs = require("fs");
  let mainDir: string = "";
  let createMainFile: boolean = false;
  let createMainFolder: boolean = false;
  let reload: boolean = false;
  let newName: string = "";
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
    console.log("clickig now");
    DirectoryData.update((currentData) => {
      return {
        ...currentData,
        reload: true,
      };
    });
  };
  const addFolder = (): void => {
    console.log("clicking addFolder", DirectoryData);
    DirectoryData.update((currentData) => {
      return {
        ...currentData,
        createMainFolder: true,
        activeFile: "",
      };
    });
    console.log("Directory Data after update ", DirectoryData);
  };
  const addFile = (): void => {
    console.log("clicking addFile");
    DirectoryData.update((currentData) => {
      return {
        ...currentData,
        createMainFile: true,
        activeFile: "",
      };
    });
  };
  const createFileHandler = (e: KeyboardEvent, path: string): void => {
    DirectoryData.update((currentData) => {
      return {
        ...currentData,
        activeDir: path,
        activeFile: "",
      };
    });
    if (e.key !== "Enter") return;
    // (e.target as HTMLInputElement).value;
    newName = (e.target as HTMLInputElement).value;

    fs.writeFileSync(path + "/" + newName, "", (err) => {
      if (err) throw err;
    });
    DirectoryData.update((currentData) => {
      return {
        ...currentData,
        createMainFile: false,
        rename: false,
        activeFile: "",
      };
    });

    newName = "";
  };
  const createFolderHandler = (e: KeyboardEvent, path: string): void => {
    DirectoryData.update((currentData) => {
      return {
        ...currentData,
        activeDir: path,
        activeFile: "",
      };
    });
    if (e.key !== "Enter") return;

    try {
      if (!fs.existsSync(path + "/" + newName)) {
        fs.mkdirSync(path + "/" + newName);
      }
    } catch (err) {
      console.error(err);
    }
    DirectoryData.update((currentData) => {
      return {
        ...currentData,
        createMainFolder: false,
        rename: false,
        activeFile: "",
      };
    });

    newName = "";
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
  <div
    class="fileArea"
    on:click={createMainFile || createMainFolder ? resetStatus : undefined}
  >
    {process.platform === "win32"
      ? mainDir.substring(mainDir.lastIndexOf("\\") + 1)
      : mainDir.substring(mainDir.lastIndexOf("/") + 1)}
  </div>
  <div class="refresh" on:click={refreshDir} />
  <div class="addFile" on:click={addFile} />
  <div class="addFolder" on:click={addFolder} />
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
    background-color: rgba(28, 28, 36, 0.678);
    padding-right: 10px;
    padding-top: 2px;
    padding-bottom: 2px;
    width: 100%;
    font-size: 10px;
  }
  .fileArea {
    float: left;
    height: 20px;
    font-size: 14px;
    color: white;
  }
  .refresh {
    float: right;
    background-image: url("../src/icons/refresh.png");
    height: 20px;
    width: 20px;
    background-repeat: no-repeat;
    background-size: 20px;
  }
  .addFile {
    float: right;
    background-image: url("../src/icons/addFile.png");
    height: 20px;
    width: 20px;
    background-repeat: no-repeat;
    background-size: 20px;
    margin-right: 5px;
  }
  .addFolder {
    float: right;
    background-image: url("../src/icons/add_folder2.png");
    height: 20px;
    width: 20px;
    background-repeat: no-repeat;
    background-size: 20px;
    margin-right: 5px;
  }
  .textBox {
    margin-left: 10px;
    padding: 10px 10px 10px 10px;
    font-size: 12px;
    width: 150px;
  }
</style>
