<script>
  import {  afterUpdate, onMount } from 'svelte';
  import * as monaco from 'monaco-editor';


  const { remote, ipcRenderer } = require('electron');
  
  export let value;
  export let language;
  // export let fileName;

  let monEditor;
  let containerElt;
  
  
  // const createEditor = () => {
  //   console.log(value, language)
  //   monEditor = monaco.editor.create(containerElt, {
  //     value: value.join('\n'),
  //     language: language,
  //     theme: 'vs-dark',
  //     wordWrap: 'on',
  //     automaticLayout: true,
  //   })
   
  // }

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
          monEditor.onDidChangeModelContent(() => {
          // console.log(monEditor.getValue())
        })
        monEditor.setValue(value.join('\n'));
        console.log(monEditor);
        // let model = monEditor.getModel();
        // console.log(model)
        monEditor.updateOptions({
          language: language,
        });
      }
	});

  ipcRenderer.on('save-markdown',  function (file, content) {
    ipcRenderer.send('synchronous-message', monEditor.getValue())
  });

</script>

<svelte:head />
<div class={$$props.class} bind:this={containerElt} />

  
