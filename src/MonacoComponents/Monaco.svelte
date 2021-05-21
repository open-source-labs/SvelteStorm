<script>
    import { afterUpdate, onMount } from 'svelte'
    import * as monaco from 'monaco-editor/esm/vs/editor/editor.api'
    import * as monacoEditor from 'monaco-editor';
    // const path = window.require('path');
    // const fs = window.require('fs');
    
    export let value;
    let containerElt;

    // monaco.languages.typescript.javascriptDefaults.setDiagnosticsOptions({
    //     noSemanticValidation: true,
    //     noSyntaxValidation: true
    // });
  // const compilerOptions = {
  //   allowJs: true,
  //   allowSyntheticDefaultImports: true,
  //   alwaysStrict: true,
  //   jsx: 'React',
  //   jsxFactory: 'React.createElement',
  // };

  // monacoEditor.languages.typescript.typescriptDefaults.setEagerModelSync(true);
  // monacoEditor.languages.typescript.javascriptDefaults.setEagerModelSync(true);
  // monacoEditor.languages.typescript.typescriptDefaults.setCompilerOptions(compilerOptions);
  // monacoEditor.languages.typescript.javascriptDefaults.setCompilerOptions(compilerOptions);
 

  // const getLanguage = (path) => {
  //   if (path.includes('.')) {
  //     switch (path.split('.').pop()) {
  //       case 'js':
  //         return 'javascript';
  //       case 'jsx':
  //         return 'javascript';
  //       case 'ts':
  //         return 'typescript';
  //       case 'json':
  //         return 'json';
  //       case 'css':
  //         return 'css';
  //       case 'html':
  //         return 'html';
  //       case 'md':
  //         return 'markdown';
  //       default:
  //         return undefined;
  //     }
  //   }
  // };
    onMount(() => {
      monacoEditor.editor.create(containerElt, {
        value: value.join('\n'),
        language: 'javascript',
        theme: 'vs',
        model: monaco.editor.createModel(this.getAttribute("value"), this.getAttribute("language")),
        wordWrap: 'on',
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

  