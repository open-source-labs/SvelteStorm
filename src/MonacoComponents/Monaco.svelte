<script>
  import {  onMount, beforeUpdate, afterUpdate } from 'svelte'
  // import * as monaco from 'monaco-editor/esm/vs/editor/editor.api'
  import * as monaco from 'monaco-editor';
  const { ipcRenderer } = require('electron');
  // const path = window.require('path');
  // const fs = window.require('fs');
  
  export let value;
  export let language;
  let monEditor;
  let containerElt;
 

  const getLanguage = (lang) => {
    console.log(lang)
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

    const createEditor = () => {

      monEditor = monaco.editor.create(containerElt, {
        value: value.join('\n'),
        language: getLanguage(language),
        theme: 'vs-dark',
        wordWrap: 'on',
      })

    }

    onMount(() => {
        createEditor()
    })
        
	afterUpdate(() => {
    if(monEditor) {
          monEditor.onDidChangeModelContent(() => {
          console.log(monEditor.getValue())
        })
      }
	});

  ipcRenderer.on('save-markdown',  function (file, content) {
      ipcRenderer.send('synchronous-message', monEditor.getValue())
    });
</script>
  
<style>
  .monaco {
    position: relative;
    width: 100%;
    height: 100%;
  }
</style>

<svelte:head />
<div class="monaco" bind:this={containerElt} />

  