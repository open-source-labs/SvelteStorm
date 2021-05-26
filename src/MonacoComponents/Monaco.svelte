<script>
  import {  afterUpdate, onMount } from 'svelte';
  import * as monaco from 'monaco-editor';
<<<<<<< HEAD
  import DirectoryData from '../Utilities/DirectoryStore';
  const { remote, ipcRenderer } = require('electron');
  const currentWindow = remote.getCurrentWindow();
=======
>>>>>>> tabbedBrowsing
  const fs = require('fs');

  const { remote, ipcRenderer } = require('electron');
  
  export let value;
  export let language;
  export let filePath;

  let monEditor;
  let containerElt;
<<<<<<< HEAD
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
=======
>>>>>>> tabbedBrowsing

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
      fontSize: "16px",
    })
<<<<<<< HEAD

    

  }
  onMount(() => {
     createEditor()
=======
>>>>>>> tabbedBrowsing
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
<<<<<<< HEAD
  
  ipcRenderer.on('save-markdown',  function () {
      messageObj = {content : monEditor.getValue(), file : file }
      ipcRenderer.send('synchronous-message', messageObj)
    });
=======

  ipcRenderer.on('save-markdown',  function (file, content) {
    ipcRenderer.send('synchronous-message', monEditor.getValue())
  });

>>>>>>> tabbedBrowsing
</script>

<svelte:head />
<div class={$$props.class} bind:this={containerElt} />

  
