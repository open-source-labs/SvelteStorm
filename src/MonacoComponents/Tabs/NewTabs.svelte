<script>
import { onMount } from 'svelte';

  // import { afterUpdate, onMount } from "svelte";
  // import { addTab } from '../EditorStore';
  import Monaco from '../Monaco.svelte';
  const { remote, ipcRenderer } = require('electron');
  const fs = require('fs');
  const path = require('path')
  const currentWindow = remote.getCurrentWindow();
  export let tabs = [];
  export let activeTabValue = 0;
  let activeEditor = 0;

  let value = ['This', 'is', 'SvelteStorm'];
  let language = 'html';
  let filePath;
  let count = 0;
  function addTab(value = [''], editorLang = 'html', fileName='NewTab.html') {
    
    count = count + 1;
    tabs = [ ...tabs, { editorValue: value, editorLang: editorLang, fileName: fileName, count: count }];
    // console.log('addTab', tabs)
  };

  const handleClick = (tabValue) => () => { 
   
    activeTabValue = tabValue;
    activeEditor = tabValue;
    console.log('handleClick', tabValue, activeEditor);
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
      value = content.split(/\r?\n/);
      filePath = path.basename(file);
      let fileName = file.slice().split('/').pop();
      language = file.slice().split('.').pop();
      let title = 'Svelte Storm';
      addTab(value, language, fileName)
      if (file) { title = `${path.basename(file)} - ${title}`; }
      currentWindow.setTitle(title);
      // monEditor.setValue(value.join('\n'))
  });

  onMount(() => {
    addTab(['welcome', 'to', 'sveltestorm'], 'html', 'svelte.html');
    addTab(['//', 'welcome', 'to', 'sveltestorm'], 'js', 'svelte.js');
    addTab([,'welcome', 'to', 'sveltestorm'], 'css', 'svelte.css');
  });

</script>


  
  <ul>
    {#each tabs as tab}
    <li class={activeTabValue === tab.count ? 'active' : ''}>
      <span on:click={handleClick(tab.count)}>{tab.fileName}</span>
    </li>
    {/each}
  </ul>
  
  {#if activeEditor}
  <!-- {#each tabs as tab} -->
    <div class="editor-body">
      <!-- {console.log(tab)} -->
      <!-- {#if activeTabValue == tab.count} -->
        <Monaco class="childClass current" bind:value={tabs[activeEditor - 1].editorValue} bind:language={tabs[activeEditor-1].editorLang} />
      <!-- {:else}
        <Monaco style={{display: 'none'}} bind:value={tab.value} bind:language={tab.editorLang} id={tab.count}/>
      {/if} -->
    </div>
  <!-- {/each} -->
  {/if}

<style>
  .editor-body {
    /* display: flex; */
    /* height: 100%; */
    /* width: 100%; */
    height: 100vh;
    overflow: scroll;
  }
  /* .tab-list {
    display: inline-block;
    flex-wrap: wrap;
    padding-left: 0;
    background-color: white;
    margin-bottom: 0;
    list-style: none;
    border: 5px solid #dee2e6;
  } */
  ul {
    display: flex;
    flex-direction: row;
    overflow: scroll;
    /* flex-wrap: wrap; */
    padding-left: 0;
    margin-bottom: 0;
    list-style: none;
    border-bottom: 1px solid #dee2e6;
  }
	li {
		margin-bottom: -1px;
	}

  span {
    border: 1px solid transparent;
    border-top-left-radius: 0.25rem;
    border-top-right-radius: 0.25rem;
    display: block;
    padding: 0 1rem;
    cursor: pointer;
  }

  span:hover {
    border-color: #e9ecef #e9ecef #dee2e6;
  }

  li.active > span {
    color: #495057;
    background-color: #fff;
    border-color: #dee2e6 #dee2e6 #fff;
  }

  /* .hidden {
    display: none;
  } */
</style>