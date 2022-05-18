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
  export { Tooltip, hoverTooltip } from "@codemirror/view";

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

  let messageObj;
  let counter = 0;
  let containerElt;
  function searchDocumentation(value) {
    // console.log("first console.log of search", value);
    for (let item in searchDoc) {
      // console.log("here is each item of search", item);
      if (searchDoc[item].includes(value)) {
        console.log("congrats!");
        return item;
      }
    }
    console.log(value, "is not in the docs!");
    return false;
  }

  let hoverCounter = 0;
  let lastHoverCounter = 0;
  let lastWord;
  let toolTip = true;
  let src;
  let tester;
  let toolTipDiv;
  // src = `https://svelte.dev/docs#${searchDocumentation(lastWord)}`;
  function onHover() {
    let word;
    console.log("counter ", counter);
    if (counter > 6 && searchDocumentation(lastWord) !== false) {
      let url = searchDocumentation(lastWord);
      src = `https://svelte.dev/docs#${url}`;
      toolTip = true;
      counter = 0;
      toolTipDiv = `THIS IS WHERE THE TOOL TIP WIL BE ABOUT: ${lastWord}`;
    }
    if (counter > 6 && word !== lastWord) {
      counter = 0;
    }

    var A1 = $codeMirrorEditor.getCursor().line;
    var A2 = $codeMirrorEditor.getCursor().ch;

    var B1 = $codeMirrorEditor.findWordAt({ line: A1, ch: A2 }).anchor.ch;
    var B2 = $codeMirrorEditor.findWordAt({ line: A1, ch: A2 }).head.ch;
    searchDocumentation(
      $codeMirrorEditor.getRange({ line: A1, ch: B1 }, { line: A1, ch: B2 })
    );
    word = $codeMirrorEditor.getRange(
      { line: A1, ch: B1 },
      { line: A1, ch: B2 }
    );
    // console.log("this is the word right after the document search", word);
    if (lastWord !== word) {
      counter = 0;
    }
    counter++;
    lastWord = word;
  }
  function hoverTest() {
    if (hoverCounter > lastHoverCounter) {
      lastHoverCounter = hoverCounter;
      return;
    }
    // console.log("hovering", hoverCounter, lastHoverCounter);
    if (counter > 4) {
      tester = true;
      console.log("tester is now true TOOLTIP should appear");
    }
    return;
  }
  setInterval(() => {
    //   // word = codeMirrorEditor.findWordAt(codeMirrorEditor.getCursor());
    //   // codeMirrorEditor.getRange(word.anchor, word.head);
    hoverTest();
    onHover();
    // console.log("this is the mouse hover console.log ", word, obj);
  }, 2000);
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
    console.log("afterUpdate complete");
  });

  ipcRenderer.on("save-markdown", function () {
    messageObj = { content: $codeMirrorEditor.getValue(), file: filePath };
    ipcRenderer.send("synchronous-message", messageObj);
    console.log("ipcRenderer complete");
  });

  // afterUpdate(() => {
  //   if (codeMirrorEditor) {
  //     console.log(filePath, language);
  //     codeMirrorEditor.setValue(value);
  // codeMirrorEditor.setOption("mode", language);
  // console.log("afterUpdate()", codeMirrorEditor.getOption("mode"));
  // counter = 0;
  //   }
  // });

  ipcRenderer.on("save-markdown", function () {
    messageObj = { content: codeMirrorEditor.getValue(), file: filePath };
    ipcRenderer.send("synchronous-message", messageObj);
  });

  function handleMousMove() {
    if (hoverCounter - lastHoverCounter > 10) {
      tester = false;
    }
    hoverCounter++;
    console.log("this is hover counter", hoverCounter);
  }
  function onClick() {
    window.open(
      `${src}`,
      "_blank",
      "top=900,left=200,frame=true,nodeIntegration=no"
    );
  }
</script>

<svelte:head />
<!-- {#if tester && searchDocumentation(lastWord)} -->
<div data-tooltip="tooltip" id="div_span" on:click={onClick}>
  THIS IS THE TOOLTIP ABOUT {lastWord}
</div>
<!-- {/if} -->
<div on:mousemove={handleMousMove}>
  <textarea class={$$props.class} bind:this={containerElt} />
</div>

<style>
  /* [data-tooltip] */
  #div_span {
    position: relative;
    cursor: help;
    background-color: rgb(6, 6, 6);
    z-index: 10 !important;
    box-shadow: 2px 2px;
  }
  #div_span ::after {
    position: absolute;
    width: 140px;
    left: calc(50% - 70px);
    bottom: 125%;
    text-align: center;
    box-sizing: border-box;
    content: attr(data-tooltip);
    color: white;
    background: rgb(224, 7, 7);
    padding: 8px;
    border-radius: 10px;
    font-size: 0.9em;
    font-weight: bold;

    visibility: hidden;
    opacity: 0;
    transform: translateY(10px);
    transition: opacity 0.3s, transform 0.2s;
  }

  #div_span :hover ::after {
    opacity: 1;
    visibility: visible;
  }
</style>
