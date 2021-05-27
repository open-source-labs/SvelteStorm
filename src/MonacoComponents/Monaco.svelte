<script>
  import {  afterUpdate, onMount } from 'svelte';
  import * as monaco from 'monaco-editor';
  const fs = require('fs');

  const { remote, ipcRenderer } = require('electron');
  
  export let value;
  export let language;
  export let filePath;
  let messageObj;

  let monEditor;
  let containerElt;

  onMount(() => {

    monEditor = monaco.editor.create(containerElt, {
      value: value.join('\n'),
      language: language,
      theme: 'vs-dark',
      wordWrap: 'on',
      fontSize: "16px",
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
  
  ipcRenderer.on('save-markdown',  function () {
      console.log('HELLO SAVING')
      messageObj = {content : monEditor.getValue(), file : filePath }
      ipcRenderer.send('synchronous-message', messageObj)
    });
</script>

<svelte:head />
<div class={$$props.class} bind:this={containerElt} />

  
