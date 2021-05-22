<script>
  import {  afterUpdate, onMount } from 'svelte';
  import * as monaco from 'monaco-editor';
  const { remote, ipcRenderer } = require('electron');
  const currentWindow = remote.getCurrentWindow();
  const fs = require('fs');
  const path = require('path')

  export let value;
  export let language;
  let monEditor;
  let containerElt;
  // export let monacoValue;
  // export let monacoLang;
 
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
      language = file.split('.').pop();
      let title = 'Svelte Storm';
      if (file) { title = `${path.basename(file)} - ${title}`; }
      currentWindow.setTitle(title);
      monEditor.setValue(value.join('\n'))
      monaco.editor.setModelLanguage(monEditor.getModel(),getLanguage(language))
  });

  const createEditor = () => {
    monEditor = monaco.editor.create(containerElt, {
      value: value.join('\n'),
      language: getLanguage(language),
      theme: 'vs-dark',
      wordWrap: 'on',
      automaticLayout: true,
    })
  }

  onMount(() => {
     createEditor()
  })
        
	afterUpdate(() => {
    if(monEditor) {
          monEditor.onDidChangeModelContent(() => {
          // console.log(monEditor.getValue())
        })
      }
	});

  ipcRenderer.on('save-markdown',  function (file, content) {
    ipcRenderer.send('synchronous-message', monEditor.getValue())
  });

</script>

<svelte:head />
<div class={$$props.class} bind:this={containerElt} />

  
