<script>
  import {  afterUpdate, onMount } from 'svelte'
  // import * as monaco from 'monaco-editor/esm/vs/editor/editor.api'
  import * as monaco from 'monaco-editor';
  const {ipcRenderer} = require('electron');
  
  // export const value;
  // export const language;
  let containerElt;
  export let monacoValue;
  export let monacoLang;

  ipcRenderer.on('file-opened', function (evt, file, content) {
      monacoValue = content.split(/\r?\n/);
      monacoLang = file.split('.').pop();
      console.log(monacoValue, monacoLang)
  });
 
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
  };

  afterUpdate(() => {
    monaco.editor.create(containerElt, {
      value: monacoValue ? monacoValue.join('\n') : '[]',
      language: monacoLang ? getLanguage(monacoLang) : 'html',
      theme: 'vs-dark',
      // model: monaco.editor.createModel(this.getAttribute("value"), this.getAttribute("language")),
      wordWrap: 'on',
    })
  })

</script>
  
<style>
  .monaco {
    position: relative;
    width: 100%;
    height: auto;
  }
</style>

<svelte:head />
<div class="monaco" bind:this={containerElt} />
