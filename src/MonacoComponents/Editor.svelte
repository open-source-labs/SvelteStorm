<script>
  import Monaco from './Monaco.svelte';
  import { DirectoryData, openTabs } from '../Utilities/DirectoryStore';

  const { remote, ipcRenderer } = require('electron');
  const fs = require('fs');
  const path = require('path');
  const currentWindow = remote.getCurrentWindow();
  
  export let activeTabValue = 0;
  let activeEditor = 0;

  let value = [''];
  let language = 'html';
  let [filePath, fileName, readData] = ['', '', ''];
  let title = 'Svelte Storm';
  let count = 0;

  function addTab(newFile) {
  
    let duplicate = false;
    $openTabs.map((tab) => {
      if (tab.filePath === newFile.filePath) {
        duplicate = true;
      }
    })

    if (!duplicate) {
      $openTabs = [ ...$openTabs, newFile]
      count = count + 1;
    }
  };
  // remove and reset tab order
  function deleteTab(targetId) {

    $openTabs = $openTabs.filter((t) => t.tabId != targetId).map((t, i) => ({
      editorValue: t.editorValue,
      ext: t.ext,
      editorLang: t.editorLang,
      filePath: t.filePath,
      fileName: t.fileName,
      tabId: i,
    }))

    count = count - 1;
    activeTabValue = 0;
    activeEditor = activeTabValue;
  }

  const handleClick = (tabId) => () => {
    activeTabValue = tabId;
    activeEditor = activeTabValue;
  }
  // convert file extension to monaco language
  const getLanguage = (lang) => {
      switch (lang) {
        case 'js':
          return 'javascript';
        case 'jsx':
          return 'javascript';
        case 'ts':
          return 'typescript';
        case 'json':
          return 'json';
        case 'css':
          return 'css';
        case 'html':
          return 'html';
        case 'md':
          return 'markdown';
        case 'svelte':
          return 'html';
        default:
          return undefined;
      }
  }
  // render file on open and add to store
  ipcRenderer.on('file-opened', function (evt, file, content) {
      const newTab = {}
      filePath = (file);
      process.platform === "win32" ? fileName = file.slice().split('\\').pop() : fileName = file.slice().split('/').pop();
      language = file.slice().split('.').pop();
      newTab.editorValue = content.split(/\r?\n/);
      newTab.ext = language;
      newTab.editorLang = getLanguage(language);
      newTab.filePath = filePath;
      newTab.fileName = fileName;
      newTab.tabId = count;
      addTab(newTab);
      if (file) { title = `${path.basename(file)} - ${title}`; }
  });

  const unsub = DirectoryData.subscribe(data => {
    console.log(data.openFilePath)
    const newTab = {};
      if (data.fileRead) {
        readData = fs.readFileSync(data.openFilePath).toString();
        value = readData.split(/\r?\n/);
        fileName = data.openFilePath.slice().split('/').pop();
        language = path.basename(data.openFilePath).split('.').pop();
        if (data.openFilePath) { title = `${path.basename(data.openFilePath)} - Svelte Storm`; }
        newTab.editorValue = value;
        newTab.ext = language;
        newTab.editorLang = getLanguage(language);
        newTab.filePath = data.openFilePath;
        newTab.fileName = fileName;
        newTab.tabId = count;
        currentWindow.setTitle(title);
        addTab(newTab);
      }
  });

</script>

  <ul>
    {#each $openTabs as tab}
    <li class={activeTabValue === tab.tabId ? 'active' : ''}>
      <span class="tab-span"
        on:click={handleClick(tab.tabId)}
      >
        <img src="../src/icons/file_type_{tab.ext}.svg" 
          alt={''}
        />
        {tab.fileName}
        <span
          class="delete-button" 
          value={tab.tabId}
          on:click={(value) => deleteTab(tab.tabId)}
        >
          &times
        </span>
      </span>
    </li>
    {/each}
  </ul>
  
  {#if $openTabs.length > 0}
    <div class="editor-body">
        <Monaco
          class="childClass current"
          bind:value={$openTabs[(activeEditor)].editorValue}
          bind:language={$openTabs[(activeEditor)].editorLang}
          bind:filePath={$openTabs[(activeEditor)].filePath}
        />
    </div>
  {/if}

<style>

  .editor-body {
    width: 100%;
    height: 100vh;
    overflow: scroll;
  }

  ul {
    display: flex;
    flex-direction: row;
    overflow: scroll;
    padding-left: 0;
    margin-top: 0;
    margin-bottom: 0;
    list-style: none;
    border-bottom: 1px solid #dee2e6;
    border-radius: 5px;
  }

	li {
		margin-bottom: -1px;
    background-color: black;
    color: #fff;
	}

  .tab-span {
    border: 1px solid transparent;
    border-top-left-radius: 0.25rem;
    border-top-right-radius: 0.25rem;
    display: flex;
    flex-direction: row;
    padding: 0 1rem;
    cursor: pointer;
    font-size: 1em;
  }

  .tab-span:hover {
    border-color: #e9ecef #e9ecef #dee2e6;
  }

  li.active > span {
    color: #495057;
    background-color: #fff;
    border-color: #dee2e6 #dee2e6 #fff;
  }

  img {
    height: 1em;
    background-color: inherit;
    margin-top: 3px;
    /* margin-bottom: 0; */
  }
  .delete-button {
    margin-left: 5px;
    border-right: black;
    border-left: black;
  }

</style>
