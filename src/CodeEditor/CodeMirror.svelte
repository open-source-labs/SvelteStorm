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
  import searchDoc from "/Users/zacharyradford/Desktop/Codesmith/Projects/SvelteStorm/src/SearchProgram.js";

  const fs = require("fs");
  const { ipcRenderer } = require("electron");
  export let word;
  import {
    editorCache,
    codeMirrorEditor,
    currentTabFilePath,
  } from "../Utilities/DirectoryStore.js";

  export let value;
  export let language;
  export let filePath;
  let tipContent = "";
  let messageObj;
  let stillMouse = false;
  let hoverCounter = 0;
  let lastHoverCounter = 0;
  let lastWord;
  let src;
  let showToolTip;
  let containerElt;
  let showToolTripTransition = false;
  let noUpdate = false;

  function searchDocumentation(value) {
    if (!value || value === " ") {
      tipContent = " ";
      return false;
    }
    // console.log("first console.log of search", value);
    for (let item in searchDoc) {
      // console.log("here is each item of search", item);
      if (searchDoc[item][0].includes(value)) {
        // console.log("here is each item, value", item, value);
        let result = {};
        result.tip = searchDoc[item][1][0];
        result.url = item;
        return result;
      }
    }
    tipContent = " ";
    // console.log(value, "is not in the docs!");
    return false;
  }

  // let toolTipDiv;
  src = `https://svelte.dev/docs#`;
  function onHover() {
    let word;
    if (stillMouse && searchDocumentation(lastWord) !== false) {
      let searchObj = searchDocumentation(lastWord);
      src = `https://svelte.dev/docs#${searchObj.url}`;
      showToolTip = true;
      tipContent = `${searchObj.tip}`;
      // console.log("this is tipcont", tipContent);
      noUpdate = true;
      lastWord = word;
    }

    var A1 = $codeMirrorEditor.getCursor().line;
    var A2 = $codeMirrorEditor.getCursor().ch;

    var B1 = $codeMirrorEditor.findWordAt({ line: A1, ch: A2 }).anchor.ch;
    var B2 = $codeMirrorEditor.findWordAt({ line: A1, ch: A2 }).head.ch;

    word = $codeMirrorEditor.getRange(
      { line: A1, ch: B1 },
      { line: A1, ch: B2 }
    );

    lastWord = word;
  }

  function hoverTest() {
    if (hoverCounter > lastHoverCounter) {
      lastHoverCounter = hoverCounter;
      return;
    }
    stillMouse = true;
    // console.log("hovering", hoverCounter, lastHoverCounter);
    showToolTip = true;
    // console.log("showToolTip is now true TOOLTIP should appear");

    return;
  }

  setInterval(() => {
    hoverTest();
    onHover();
    // console.log("this is the mouse hover console.log ", word, obj);
  }, 700);

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
    if (!noUpdate && !showToolTripTransition) {
      if (codeMirrorEditor) {
        // retrieve code from DirectoryStore.js and store cached code of the tab that the user clicked on
        const cacheCode = $editorCache[$currentTabFilePath];

        // if file hans't been cached yet
        if (!cacheCode) {
          // cache the file and it's value (value=the raw code that'll appear in the editor)
          $editorCache[currentTabFilePath] = value;
          // set value of current editor to display the current code
          $codeMirrorEditor.setValue(value);
        } else {
          // if file already exists in the cache
          $codeMirrorEditor.setValue(cacheCode);
          $codeMirrorEditor.setOption("mode", language);
        }
      }
    }
    noUpdate = false;
    showToolTripTransition = false;

    console.log("afterUpdate complete");
  });

  ipcRenderer.on("save-markdown", function () {
    messageObj = { content: $codeMirrorEditor.getValue(), file: filePath };
    ipcRenderer.send("synchronous-message", messageObj);
    console.log("ipcRenderer complete");
  });

  function handleMousMove(e) {
    // console.log("here is the event listener in handleMouseMove", e);
    if (hoverCounter - lastHoverCounter > 12) {
      stillMouse = false;
      showToolTripTransition = true;
      showToolTip = false;
      tipContent = " ";
    }
    hoverCounter++;
    // console.log("this is hover counter", hoverCounter);
  }
  function onClick() {
    window.open(
      `${src}`,
      "_blank",
      "top=900,left=200,frame=true,nodeIntegration=no"
    );
  }
  function onType() {
    // console.log("this is the key down event");
    hoverCounter += 13;
  }
</script>

<svelte:head />
<div data-tooltip="tooltip" id="div_span" on:click={onClick}>
  {tipContent}
</div>
<div on:mousemove={handleMousMove} on:keydown={onType}>
  <textarea id="textarea" class={$$props.class} bind:this={containerElt} />
</div>

<style>
  /* [data-tooltip] */
  #div_span {
    min-height: 2.7em;
    max-height: 2.7em;
    font-size: 65%;
    position: relative;
    cursor: help;
    background-color: rgba(35, 35, 65, 0.452);
    z-index: 2 !important;
    /* box-shadow: 2px 2px; */
  }

  #textarea {
    /* width: 100%; */
    position: relative;
    z-index: 1;
  }
</style>
