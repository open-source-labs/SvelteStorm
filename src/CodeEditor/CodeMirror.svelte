<script lang="ts">
  import { afterUpdate, onMount } from "svelte";
  import CodeMirror from "codemirror";
  import { scale } from "svelte/transition";
  import { quintOut } from "svelte/easing";
  import "codemirror/lib/codemirror.css";
  import "codemirror/theme/dracula.css";
  import "codemirror/mode/javascript/javascript";
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
  // add linters
  import "codemirror/addon/lint/lint";
  import "codemirror/addon/lint/lint.css"
  import "codemirror/addon/lint/javascript-lint";
  import "codemirror/addon/lint/css-lint"
  import "codemirror/addon/lint/html-lint"

  const JSHINT = require('jshint').JSHINT;
  (window as any).JSHINT = JSHINT;  
  const HTMLHINT = require('htmlhint');
  (window as any).HTMLHint = HTMLHINT;

  import searchDoc from "../SearchProgram.js";

  const { ipcRenderer } = require("electron");

  import {
    editorCache,
    codeMirrorEditor,
    currentTabFilePath,
  } from "../DataStore/SvelteStormDataStore";

  export let value;
  export let language;
  export let filePath;
  
  let lastWord: string;
  let tipContent: string = "";
  let messageObj: MessageObj;
  let stillMouse: boolean = false;
  let hoverCounter: number = 0;
  let lastHoverCounter: number = 0;
  let src: string = `https://svelte.dev/docs#`;
  let containerElt: HTMLTextAreaElement;
  let showToolTripTransition: boolean = false;
  let noUpdate: boolean = false;
  let popupTopMargin;
  let popupLeftMargin;
  let clientX;
  let clientY;
  let word;

  type MessageObj = {
    content: string;
    file: string;
  };
  type ToolTip = {
    tip: string;
    url: string;
  };

  //5-23-22 ZR this searches the documentation object and sets tooltip value
  function searchDocumentation(value: string): ToolTip {
    if (!value || value === " ") {
      tipContent = " ";
      return {tip:'N/A',url:'N/A'};
    }
 
    for (let item in searchDoc) {
      if (searchDoc[item][0].includes(value)) {
        let result:ToolTip = {
        tip: searchDoc[item][1][0],
        url: item}
        return result;
      }
    }
    tipContent = " "; // space between quotes is required for tooltip functionality
    return {tip:'N/A',url:'N/A'};
  }

  function onHover(): void {
    
    if (stillMouse && searchDocumentation(lastWord).tip !== 'N/A') {
      let searchObj: boolean | ToolTip = searchDocumentation(lastWord);
      src = `https://svelte.dev/docs#${searchObj.url}`;

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
    lastWord = word;
  }

  function hoverTest(): void {
    if (hoverCounter > lastHoverCounter) {
      lastHoverCounter = hoverCounter;
      return;
    }
    //if hoverCounter is not greater than lastHoverCounter, it means the mouse is hovering
    onHover();
    stillMouse = true;
    return;
  }

  setInterval((): void => {
    hoverTest();
  }, 600);

  onMount(async (): Promise<void> => {
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
      lineWrapping: true,
      autoCloseBrackets: true,
      matchTags: true,
      autoCloseTags: true,
      lint: true,
    });

    $codeMirrorEditor.setSize("100%", "100%");

    if (!$editorCache[filePath]) {
      $editorCache[$currentTabFilePath] = value;
    }
  });

  afterUpdate(async (): Promise<void> => {
    if (!noUpdate && !showToolTripTransition) {
      if (codeMirrorEditor) {
      // retrieve code from DirectoryStore.js and store cached code of the tab that the user clicked on
      let cacheCode: string;
      if($editorCache[$currentTabFilePath]) cacheCode = $editorCache[$currentTabFilePath];
      // if file hasn't been cached yet 
      if (!cacheCode) {
        // cache the file and it's value (value=the raw code that'll appear in the editor)
        $editorCache[$currentTabFilePath] = await value;
        // set value of current editor to display the current code
        $codeMirrorEditor.setValue(value);
      } else {
        // if file already exists in the cache
        $codeMirrorEditor.setValue(cacheCode);
        $codeMirrorEditor.setOption("mode", language);
        // // retrieve code from DirectoryStore.js and store cached code of the tab that the user clicked on
        // let cacheCode: string;
        // if ($editorCache[$currentTabFilePath])
        //   cacheCode = $editorCache[$currentTabFilePath];
        // // if file hasn't been cached yet
        // if (!cacheCode) {
        //   // cache the file and it's value (value=the raw code that'll appear in the editor)
        //   $editorCache[$currentTabFilePath] = value;
        //   // set value of current editor to display the current code
        //   $codeMirrorEditor.setValue(value);
        // } else {
        //   // if file already exists in the cache
        //   $codeMirrorEditor.setValue(cacheCode);
        //   $codeMirrorEditor.setOption("mode", language);
        }
      }
    }
    noUpdate = false;
    showToolTripTransition = false;

  });

  ipcRenderer.on("save-markdown", function (): void {
    messageObj = { content: $codeMirrorEditor.getValue(), file: filePath };
    ipcRenderer.send("synchronous-message", messageObj);
  });

  function handleMouseMove(e): void {
    if (hoverCounter - lastHoverCounter > 12) {
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
  function onClick(): void {
    window.open(
      `${src}`,
      "_blank",
      "top=900,left=200,frame=true,nodeIntegration=no"
    ); 
  }
  function onType(): void {
    hoverCounter += 13;
  }
</script>

<svelte:head />
<div in:scale={{ duration: 1500, easing: quintOut }} id="popup">
  <p class="paragraph" on:click={onClick}>
    {tipContent}
  </p>
</div>
<div on:mousemove={handleMouseMove} on:keydown={onType}>
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
