<script>
  import CodeMirror from './CodeMirror.svelte';
  import { DirectoryData, openTabs } from '../Utilities/DirectoryStore';

  const { ipcRenderer } = require('electron');
  const fs = require('fs');
  const path = require('path');

  export let activeTabValue = 0;
  let activeEditor = 0;

  let value = [''];
  let language = 'html';
  let [filePath, fileName, readData] = ['', '', ''];
  let title = 'Svelte Storm';
  let count = 0;


  function addTab(newFile) {
  
    let duplicate = false;
    let focusTabId = newFile.tabId;
    $openTabs.map((tab) => {
      if (tab.filePath === newFile.filePath) {
        duplicate = true;
        focusTabId = tab.tabId;
      }
    })

    if (!duplicate) {
      $openTabs = [ ...$openTabs, newFile]
      count = count + 1;
    }

    activeTabValue = focusTabId;
    activeEditor = activeTabValue;
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

  const modes = {
		js: {
			name: 'javascript',
			json: false
		},
		json: {
			name: 'javascript',
			json: true
		},
		svelte: {
			name: 'htmlmixed',
		},
		md: {
			name: 'markdown',
      highlightFormatting: true,
      fencedCodeBlockHighlighting: true,
      base: 'text/x-markdown',
		},
    css: {
      name: 'css',
    },
    html: {
      name: 'htmlmixed',
    },
	};


  // render file on open and add to store
  ipcRenderer.on('file-opened', function (evt, file, content) {

    const newTab = {}
    filePath = (file);
    process.platform === "win32" ? fileName = file.slice().split('\\').pop() : fileName = file.slice().split('/').pop();
    language = file.slice().split('.').pop();
    newTab.editorValue = content;
    newTab.ext = language;
    newTab.editorLang = modes[language]; 
    newTab.filePath = filePath;
    newTab.fileName = fileName;
    newTab.tabId = count;
    console.log('NEW TAB', newTab);
    addTab(newTab);
    if (file) { title = `${path.basename(file)} - ${title}`; }
  });

  // takes care of opening a file from within the file directory
  const unsub = DirectoryData.subscribe(data => {
    console.log('subscribing to the store', data.openFilePath)
    const newTab = {};
    if (data.fileRead) {
      readData = fs.readFileSync(data.openFilePath).toString();
      fileName = data.openFilePath.slice().split('/').pop();
      language = path.basename(data.openFilePath).split('.').pop();
      if (data.openFilePath) { title = `${path.basename(data.openFilePath)} - Svelte Storm`; }
      newTab.editorValue = readData;
      newTab.ext = language;
      newTab.editorLang = modes[language]; 
      newTab.filePath = data.openFilePath;
      newTab.fileName = fileName;
      newTab.tabId = count;
      console.log('NEW TAB', newTab);
      addTab(newTab);
    }
  });

</script>



<!--==========================================MARKUP==========================================-->
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
      <CodeMirror
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
    font-size: 10px;
    display: flex;
    flex-direction: row;
    overflow: auto;
    white-space: nowrap;
    scrollbar-width: thin;
    padding-left: 0;
    margin-top: 0;
    margin-bottom: 0;
    list-style: none;
    border-bottom: 1px solid #dee2e6;
    background-color: rgb(27, 27, 26);
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
    padding: 0 1rem;
    cursor: pointer;
    font-size: 12px;
  }
  ç
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
    margin-left: 5px;
    border-right: black;
    border-left: black;
  }

</style>