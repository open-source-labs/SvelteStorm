<script>
  import { afterUpdate, onMount } from "svelte";
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
    currentTabFilePath,
  } from "../Utilities/DirectoryStore.js";

  const fs = require("fs");
  const { ipcRenderer } = require("electron");

  export let value;
  export let language;
  export let filePath;
  let messageObj;
  let containerElt;

  onMount(async () => {
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
      $editorCache[currentTabFilePath] = value;
    }
    console.log("onMount complete ");
  });

  afterUpdate(async () => {
    if (codeMirrorEditor) {
      // retrieve code from DirectoryStore.js and store cached code of the tab that the user clicked on
      let cacheCode;
      if($editorCache[$currentTabFilePath]) cacheCode = $editorCache[$currentTabFilePath];
      console.log('afterUpdate currentTabPath: ', $currentTabFilePath);
      console.log('afterUpdate cacheCode: ', cacheCode);
      // if file hasn't been cached yet 
      if (!cacheCode) {
        // cache the file and it's value (value=the raw code that'll appear in the editor)
        $editorCache[$currentTabFilePath] = value;
        console.log('afterUpdate If: value: ', value)
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

</script>

<svelte:head />
<textarea class={$$props.class} bind:this={containerElt} />
