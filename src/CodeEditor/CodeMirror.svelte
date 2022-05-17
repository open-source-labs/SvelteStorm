<script>
  import { afterUpdate, beforeUpdate, onMount } from "svelte";
  import CodeMirror from "codemirror";
  import "codemirror/lib/codemirror.css";
  import "codemirror/theme/dracula.css";
  import "codemirror/mode/javascript/javascript.js";
  import "codemirror/mode/handlebars/handlebars.js";
  import "codemirror/mode/css/css.js";
  import "codemirror/mode/htmlmixed/htmlmixed.js";
  import "codemirror/mode/markdown/markdown.js";
  import "codemirror/addon/hint/css-hint.js";
  import "codemirror/addon/hint/show-hint.js";
  import "codemirror/addon/hint/javascript-hint.js";
  import "codemirror/addon/hint/html-hint.js";
  import "codemirror/addon/hint/show-hint.css";
  import "codemirror/addon/edit/matchbrackets.js";
  import "codemirror/addon/edit/closebrackets.js";
  import "codemirror/addon/edit/matchtags.js";
  import "codemirror/addon/edit/closetag.js";
  import {
    editorCache,
    codeMirrorEditor,
    openTabs,
    currentTabFilePath,
  } from "../Utilities/DirectoryStore.js";
  import Editor from "./Editor.svelte";

  const fs = require("fs");
  const { ipcRenderer } = require("electron");

  export let value;
  export let language;
  export let filePath;
  let messageObj;

  // export let handleClick;
  // let codeMirrorEditor;
  let containerElt;

  onMount(async () => {
    //console.log('before creating codemirror obj', language, filePath);
    //console.log(codeMirrorEditor);

    $codeMirrorEditor = await CodeMirror.fromTextArea(containerElt, {
      mode: language,
      lineNumbers: true,
      tabSize: 2,
      matchBrackets: true,
      theme: "dracula",
      scrollbarStyle: "native",
      extraKeys: {
        "Ctrl-Space": "autocomplete",
      },
      matchBrackets: true,
      autoCloseBrackets: true,
      matchTags: true,
      autoCloseTags: true,
    });

    $codeMirrorEditor.setValue(value);
    $codeMirrorEditor.setSize("100%", "100%");

    if (!$editorCache[filePath]) {
      // $editorCache[filePath] = value;
      $editorCache[currentTabFilePath] = value;
    }
    console.log("onMount: ", $editorCache);
    console.log("onMount compelte ");
  });

  beforeUpdate(() => {
    //handleClick(tab.tabId)
    //console.log('beforeUpdate cache: ', editorCache);
    //if (!editorCache[filePath]) {editorCache[filePath] = value};
    //  console.log('beforeUpdate: ', $openTabs[tabId].editorValue);
    //console.log('beforeUpdate: ', tabId);
    //console.log('beforeUpdate: ', $openTabs);
  });

  afterUpdate(async () => {
    if (codeMirrorEditor) {
      // // 2022-05-CR: editorCache.filePath below looks to the editorCache object in DirectoryStore.svelte, accesses the key that matches the file name, and uses that key's value to populate the editor. This provides a cache to temporarily store code as a user writes it, rather than reloading from the source file each time a tab is clicked (which would cause all unsaved code to be lost upon every tab switch).

      // if file isn't cached
      const cacheCode = $editorCache[$currentTabFilePath]; 
      console.log('before if: ', cacheCode);
      if (!cacheCode) {
        // cache the file and it's value (value=the raw that'll appear in the editor)
        $editorCache[currentTabFilePath] = value; 
        // set value of current editor to display the current code
        $codeMirrorEditor.setValue(value);
      } else {
      // if file already exists in the cache
        $codeMirrorEditor.setValue(cacheCode);
        $codeMirrorEditor.setOption("mode", language); 
      }
    }
    console.log("afterUpdate complete"); 
  });

  ipcRenderer.on("save-markdown", function () {
    messageObj = { content: $codeMirrorEditor.getValue(), file: filePath };
    ipcRenderer.send("synchronous-message", messageObj);
    console.log("ipcRenderer complete");
  });

  // //console.log('filePath: ', filePath);
      // console.log('afterUpdate currentTabPath: ', $currentTabFilePath);
      // console.log('afterUpdate cache 0: ', $editorCache);

      // if(!$editorCache[$currentTabFilePath]) {
      //   $editorCache[$currentTabFilePath] = value;
      // console.log('afterUpdate cach 1: ', $editorCache[$currentTabFilePath], 'value: ', value);
      // // await $codeMirrorEditor.setValue($editorCache[$currentTabFilePath]);
      // await $codeMirrorEditor.setValue($editorCache[$currentTabFilePath]);
      // await $codeMirrorEditor.setOption('mode', language);
      // } else {
      //   await $codeMirrorEditor.setValue($editorCache[$currentTabFilePath]);
      // }
      // console.log('afterUpdate cach 2: ', $editorCache[$currentTabFilePath]);
</script>

<svelte:head />
<textarea class={$$props.class} bind:this={containerElt} />