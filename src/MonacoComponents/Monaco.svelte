<script>
  import {  onMount, beforeUpdate, afterUpdate } from 'svelte'
  // import * as monaco from 'monaco-editor/esm/vs/editor/editor.api'
  import * as monaco from 'monaco-editor';
  import DirectoryData from '../Utilities/DirectoryStore';
  const { remote, ipcRenderer } = require('electron');
  const currentWindow = remote.getCurrentWindow();
  const fs = require('fs');
  const path = require('path')

  export let value;
  let language;
  let monEditor;
  let containerElt;
  let file;
  let messageObj; 

  let readData = '';
  const unsub = DirectoryData.subscribe(data =>{
      file = data.openFilePath
      if(data.fileRead){
        readData = fs.readFileSync(data.openFilePath).toString();
        value = readData.split(/\r?\n/);
        language = path.basename(data.openFilePath).split('.').pop()
        let title = 'Svelte Storm';
        if (data.openFilePath) { title = `${path.basename(data.openFilePath)} - ${title}`; }
        currentWindow.setTitle(title);
        monEditor.setValue(value.join('\n'))
        monaco.editor.setModelLanguage(monEditor.getModel(),getLanguage(language))
      }
  });

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

  ipcRenderer.on('file-opened', function (evt, file, content) {
      console.log(content)
      value = content.split(/\r?\n/);
      language = file.split('.').pop();
      let title = 'Svelte Storm';
      if (file) { title = `${path.basename(file)} - ${title}`; }
      currentWindow.setTitle(title);
      console.log(value)
      monEditor.setValue(value.join('\n'))
      monaco.editor.setModelLanguage(monEditor.getModel(),getLanguage(language))
      console.log(monEditor.getValue())
  });

  const createEditor = () => {
    monEditor = monaco.editor.create(containerElt, {
      value: value.join('\n'),
      language: getLanguage(language),
      theme: 'vs-dark',
      wordWrap: 'on',
      fontSize: "16px",
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
  
  ipcRenderer.on('save-markdown',  function () {
      messageObj = {content : monEditor.getValue(), file : file }
      ipcRenderer.send('synchronous-message', messageObj)
    });
</script>

<svelte:head />
<div class={$$props.class} bind:this={containerElt} />

  