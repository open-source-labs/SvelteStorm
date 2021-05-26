<script>
  import {  afterUpdate, onMount } from 'svelte';
  import * as monaco from 'monaco-editor';
  const fs = require('fs');

  const { remote, ipcRenderer } = require('electron');
  
  export let value;
  export let language;
  export let filePath;

  let monEditor;
  let containerElt;

  onMount(() => {
    // monaco.editor.setModelLanguage(monEditor.getModel(), language)
    // createEditor();
    // model = monaco.editor.createModel(
    //   value,
    // )
    monEditor = monaco.editor.create(containerElt, {
      value: value.join('\n'),
      language: language,
      theme: 'vs-dark',
      wordWrap: 'on',
      automaticLayout: true,
    })
  })

	afterUpdate(() => {
    console.log(value)
    if(monEditor) {
        fs.readFile(filePath, 'utf8', (err, res) => {
          if (!err) {
            monEditor.setModel(monaco.editor.createModel(res, language));
          }
        })
        monEditor.onDidChangeModelContent(() => {
          console.log(monEditor.getValue())
        })
      }
	});

  ipcRenderer.on('save-markdown',  function (file, content) {
    ipcRenderer.send('synchronous-message', monEditor.getValue())
  });

</script>

<svelte:head />
<div class={$$props.class} bind:this={containerElt} />

  
