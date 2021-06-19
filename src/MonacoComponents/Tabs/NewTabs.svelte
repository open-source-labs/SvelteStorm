<script>
  import Monaco from '../Monaco.svelte';
  import DirectoryData from '../../Utilities/DirectoryStore';

  const { remote, ipcRenderer } = require('electron');
  const fs = require('fs');
  const path = require('path');
  const currentWindow = remote.getCurrentWindow();
  
  export let tabs = [];
  let activeTabValue = 0;
  let activeEditor = 0;

  let value = ['This', 'is', 'SvelteStorm'];
  let language = 'html';
  let [filePath, fileName, readData] = ['', '', ''];
  let title = 'Svelte Storm';
  let count = 0;

  function addTab(value = [''], editorLang = 'html', fileName='NewTab.html', filePath, language='html') {
    count = count + 1;
    let duplicate = false;
    tabs.map((tab) => {
      if (tab.filePath === filePath) {
        duplicate = true;
        count = count-1;
      }
    })
    if (!duplicate) {
      tabs = [ ...tabs, { editorValue: value, editorLang: getLanguage(editorLang), fileName: fileName, filePath: filePath, tabId: count, ext: language }];
    }
  };

  function deleteTab(targetId) {
    console.log('deleteTab input: ', targetId);
    tabs = tabs.filter((t) => t.tabId != targetId)
    activeTabValue = (tabs[0].tabId);
    activeEditor = activeTabValue;

  }

  const getIndex = (tab) => {
    let ind; 
    tabs.forEach((el, i) => { 
      console.log(el.tabId, i, tab)
      if (el.tabId === tab) {
        ind = i;
      }
    });
    return ind
  }

  const handleClick = (tabId) => () => {
    console.log('handleClick input', tabId)
    console.log('tabs: ', tabs)
    activeTabValue = tabId;
    activeEditor = activeTabValue;
    console.log('handletab activeeditor:', activeEditor)
  }
  
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

  ipcRenderer.on('file-opened', function (evt, file, content) {
    console.log('ipcRenderer')
      value = content.split(/\r?\n/);
      filePath = (file);
      fileName = file.slice().split('/').pop();
      language = file.slice().split('.').pop();
      addTab(value, language, fileName, filePath, language);
      if (file) { title = `${path.basename(file)} - Svelte Storm`; }
      currentWindow.setTitle(title);
  });

  const unsub = DirectoryData.subscribe(data => {
      console.log('Directory Opened')
      if (data.fileRead) {
        readData = fs.readFileSync(data.openFilePath).toString();
        value = readData.split(/\r?\n/);
        fileName = data.openFilePath.slice().split('/').pop();
        language = path.basename(data.openFilePath).split('.').pop();
        if (data.openFilePath) { title = `${path.basename(data.openFilePath)} - Svelte Storm`; }
        currentWindow.setTitle(title);
        addTab(value, language, fileName, data.openFilePath, language);
      }
  });

</script>

  <ul>
    {#each tabs as tab}
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
  
  {#if activeEditor >= 0 && tabs.length}
    <div class="editor-body">
      {console.log(tabs[activeEditor], activeEditor)}
        <Monaco
          class="childClass current"
          bind:value={tabs[(activeEditor-1)].editorValue}
          bind:language={tabs[(activeEditor-1)].editorLang}
          bind:filePath={tabs[(activeEditor-1)].filePath} 
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
