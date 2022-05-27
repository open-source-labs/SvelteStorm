<script lang="ts">
  import { afterUpdate, onMount } from "svelte";
  import CodeMirror from "codemirror";
  import { scale } from "svelte/transition";
  import { quintOut } from "svelte/easing";
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
  import searchDoc from "../SearchProgram.js";

  const fs = require("fs");
  const { ipcRenderer } = require("electron");
  export let word;
  import {
    editorCache,
    codeMirrorEditor,
    currentTabFilePath,
  } from "../Utilities/DirectoryStore.ts";

  export let value;
  export let language;
  export let filePath;
  let tipContent = "";
  let messageObj;
  let stillMouse = false;
  let hoverCounter = 0;
  let lastHoverCounter = 0;
  let lastWord;
  let src = `https://svelte.dev/docs#`;
  let containerElt;
  let popupTopMargin;
  let popupLeftMargin;
  let clientX;
  let clientY;
  let showToolTripTransition = false;
  let noUpdate = false;
  //5-23-22 ZR this searches the documentation object and sets tooltip value
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

  //5-23-22 ZR this runs when hoverTest realizes the mouse is hovering
  //it finds the word at the cursor, and if it's a keyword it will set the content and link
  function onHover() {
    let word;
    //checks if mouse is still and keyword is valid
    if (stillMouse && searchDocumentation(lastWord) !== false) {
      let searchObj = searchDocumentation(lastWord);
      //sets url
      src = `https://svelte.dev/docs#${searchObj.url}`;
      //sets content
      tipContent = `${searchObj.tip}`;
      noUpdate = true;
      lastWord = word;
    }
    //this whole process is to get the value of the word
    var A1 = $codeMirrorEditor.getCursor().line;
    var A2 = $codeMirrorEditor.getCursor().ch;

    var B1 = $codeMirrorEditor.findWordAt({ line: A1, ch: A2 }).anchor.ch;
    var B2 = $codeMirrorEditor.findWordAt({ line: A1, ch: A2 }).head.ch;

    word = $codeMirrorEditor.getRange(
      { line: A1, ch: B1 },
      { line: A1, ch: B2 }
    );
    // console.log("A1", A1, "A2", A2, "B1", B1, "B2", B2);
    lastWord = word;
  }
  //5-23-22 ZR this is running in the background to check if the mouse is hovering, it checks for a lack of mousemove
  function hoverTest() {
    if (hoverCounter > lastHoverCounter) {
      lastHoverCounter = hoverCounter;
      return;
    }
    //if hoverCounter is not greater than lastHoverCounter, it means the mouse is hovering
    onHover();
    stillMouse = true;
    return;
  }

  setInterval(() => {
    hoverTest();
  }, 600);

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
    console.log("onMount complete, code editor ", codeMirrorEditor);
  });

  afterUpdate(async () => {
    if (!noUpdate && !showToolTripTransition) {
      if (codeMirrorEditor) {
        // retrieve code from DirectoryStore.js and store cached code of the tab that the user clicked on
        let cacheCode;
        if ($editorCache[$currentTabFilePath])
          cacheCode = $editorCache[$currentTabFilePath];
        // if file hasn't been cached yet
        if (!cacheCode) {
          // cache the file and it's value (value=the raw code that'll appear in the editor)
          $editorCache[$currentTabFilePath] = value;
          console.log("afterUpdate If: value: ", value);
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
  //5-23-22 ZR this tracks mousemovement to inform hoverTest and get mouse position. If there are more than 12 mouse "movements" the toolTips reset
  //some of these variables are probably unneccessary
  function handleMousMove(e) {
    if (hoverCounter - lastHoverCounter > 12) {
      console.log("this is handleMousMove, still mouse should now be false");
      stillMouse = false;
      showToolTripTransition = true;
      tipContent = " ";
      popupLeftMargin = clientX;
      popupTopMargin = clientY;
      let domPop = document.getElementById("popup");
      domPop.setAttribute(
        "style",
        `min-height:2.7em; max-height: 7em; font-size: 65%; margin-top : ${popupTopMargin}px; margin-left : ${popupLeftMargin}px; position:absolute; cursor: help; max-width:300px; background:rgba(0, 0, 0, 0.452); z-index: 1`
      );
    }
    clientX = e.clientX - 150;
    clientY = e.clientY - 25;
    hoverCounter++;
  }
  //5-23-22 ZR this opens up the docs on click
  function onClick() {
    window.open(
      `${src}`,
      "_blank",
      "top=900,left=200,frame=true,nodeIntegration=no"
    );
  }
  //5-23-22 ZR this simulates mousemove to get rid of the tool tip once the user types
  function onType() {
    hoverCounter += 13;
    console.log("this is from onType hoverCounter is now", hoverCounter);
  }
</script>

<svelte:head />
<div in:scale={{ duration: 1500, easing: quintOut }} id="popup">
  <p class="paragraph" on:click={onClick}>
    {tipContent}
  </p>
</div>
<div on:mousemove={handleMousMove} on:keydown={onType}>
  <textarea id="textarea" class={$$props.class} bind:this={containerElt} />
</div>

<style>
  .paragraph {
    font-size: small;
    z-index: 1 !important;
    background: rgb(33, 34, 34);
    box-shadow: 3px;
    border-style: solid;
    border-color: grey;
    border: 2px;
  }
  #popup {
    min-height: 2.7em;
    max-height: 7em;
    font-size: 45%;
    margin-left: 50px;
    margin-top: 0px;
    position: absolute;
    cursor: help;
    max-width: 300px;
    background: rgb(33, 34, 34);
    z-index: 1 !important;
    height: 100%;
  }
  #textarea {
    position: relative;
    z-index: 0;
  }
</style>
