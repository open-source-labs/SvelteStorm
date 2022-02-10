<script>
  import {  afterUpdate, onMount } from 'svelte';
  import * as CodeMirror from 'codemirror';
  import 'codemirror/lib/codemirror.css';
  import 'codemirror/theme/dracula.css';
  import 'codemirror/mode/javascript/javascript.js';

  const fs = require('fs');
  const { ipcRenderer } = require('electron');
  
  export let value;
  export let language;
  export let filePath;
  let messageObj;

  let codeMirrorEditor;
  let containerElt;

  onMount( async() => {
    codeMirrorEditor = await CodeMirror.fromTextArea(containerElt, {
      lineNumbers: true,
      tabSize: 2,
      matchBrackets: true,
      theme: 'dracula',
      mode: 'javascript',
    });
  })

	afterUpdate(() => {
    if(codeMirrorEditor) {
        console.log('afterUpdate()')
      }
	});
  
  ipcRenderer.on('save-markdown',  function () {
    messageObj = {content : codeMirrorEditor.getValue(), file : filePath }
    ipcRenderer.send('synchronous-message', messageObj)
  });
</script>

<svelte:head />
<textarea class={$$props.class} bind:this={containerElt} />

  
