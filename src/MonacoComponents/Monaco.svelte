<script>
  import {  onMount } from 'svelte'
  // import * as monaco from 'monaco-editor/esm/vs/editor/editor.api'
  import * as monaco from 'monaco-editor';
  // const path = window.require('path');
  // const fs = window.require('fs');
  
  export let value;
  export let language;
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
<<<<<<< HEAD
    onMount(() => {
      
      monaco.editor.create(containerElt, {
        value: value.join('\n'),
        language: getLanguage(language),
        theme: 'vs-dark',
        // model: monaco.editor.createModel(this.getAttribute("value"), this.getAttribute("language")),
        wordWrap: 'on',
      })
=======

  onMount(() => {
    monaco.editor.create(containerElt, {
      value: value.join('\n'),
      language: getLanguage(language),
      theme: 'vs-dark',
      // model: monaco.editor.createModel(this.getAttribute("value"), this.getAttribute("language")),
      wordWrap: 'on',
>>>>>>> afc91f269f64bd4b698d3400fe9c92e51a2c7512
    })
  })

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

  