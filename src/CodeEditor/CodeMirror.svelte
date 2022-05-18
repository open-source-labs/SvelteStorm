<script>
  import { afterUpdate, onMount } from "svelte";
  import * as CodeMirror from "codemirror";
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
  // import docsBool from "./application-men
  export { Tooltip, hoverTooltip } from "@codemirror/view";

  const fs = require("fs");
  const { ipcRenderer } = require("electron");
  export let word;
  export let value;
  export let language;
  export let filePath;

  // onload = function () {
  //   var bsDiv = document.getElementById("docs");
  //   var x, y;
  // On mousemove use event.clientX and event.clientY to set the location of the div to the location of the cursor:
  //   window.addEventListener(
  //     "mousemove",
  //     function (event) {
  //       x = event.clientX;
  //       y = event.clientY;
  //       if (typeof x !== "undefined") {
  //         bsDiv.style.left = x + "px";
  //         bsDiv.style.top = y + "px";
  //       }
  //     },
  //     false
  //   );
  // };
  let messageObj;
  let counter = 0;
  let codeMirrorEditor;
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
  // const wordHover = hoverTooltip((view, pos, side) => {
  //   let { from, to, text } = view.state.doc.lineAt(pos);
  //   let start = pos,
  //     end = pos;
  //   while (start > from && /\w/.test(text[start - from - 1])) start--;
  //   while (end < to && /\w/.test(text[end - from])) end++;
  //   if ((start == pos && side < 0) || (end == pos && side > 0)) return null;
  //   return {
  //     pos: start,
  //     end,
  //     above: true,
  //     create(view) {
  //       let dom = document.createElement("div");
  //       dom.textContent = text.slice(start - from, end - from);
  //       return { dom };
  //     },
  //   };
  // });

  // let hoverCounter = 0;
  // let lastHoverCounter = 0;
  // let lastWord;
  // let toolTip = false;
  // let src;
  // let tester;
  // let toolTipDiv;
  // // src = `https://svelte.dev/docs#${searchDocumentation(lastWord)}`;
  // function onHover() {
  //   let word;
  //   console.log("counter ", counter);
  //   if (counter > 6 && searchDocumentation(lastWord) !== false) {
  //     let url = searchDocumentation(lastWord);
  //     src = `https://svelte.dev/docs#${url}`;
  //     // toolTip = true;
  //     counter = 0;
  //     // toolTipDiv = `THIS IS WHERE THE TOOL TIP WIL BE ABOUT: ${lastWord}`;
  //   }
  //   if (counter > 6 && word !== lastWord) {
  //     counter = 0;
  //   }

  //   var A1 = codeMirrorEditor.getCursor().line;
  //   var A2 = codeMirrorEditor.getCursor().ch;

  var B1 = codeMirrorEditor.findWordAt({ line: A1, ch: A2 }).anchor.ch;
  var B2 = codeMirrorEditor.findWordAt({ line: A1, ch: A2 }).head.ch;
  searchDocumentation(
    codeMirrorEditor.getRange({ line: A1, ch: B1 }, { line: A1, ch: B2 })
  );
  word = codeMirrorEditor.getRange({ line: A1, ch: B1 }, { line: A1, ch: B2 });
  console.log("this is the word right after the document search", word);
  if (lastWord !== word) {
    counter = 0;
  }
  counter++;
  lastWord = word;
  console.log(
    "this is the last console log of tooltips",
    codeMirrorEditor.getRange({ line: A1, ch: B1 }, { line: A1, ch: B2 })
  );

  function hoverTest() {
    if (hoverCounter > lastHoverCounter) {
      lastHoverCounter = hoverCounter;
      return;
    }
    // console.log("hovering", hoverCounter, lastHoverCounter);
    if (counter > 4) {
      tester = true;
    }
    return;
  }
  setInterval(() => {
    //   // word = codeMirrorEditor.findWordAt(codeMirrorEditor.getCursor());
    //   // codeMirrorEditor.getRange(word.anchor, word.head);
    hoverTest();
    onHover();
    // console.log("this is the mouse hover console.log ", word, obj);
  }, 500);

  onMount(async () => {
    console.log("before creating codemirror obj", language, filePath);

    codeMirrorEditor = await CodeMirror.fromTextArea(containerElt, {
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

    codeMirrorEditor.setValue(value);
    codeMirrorEditor.setSize("100%", "100%");
    console.log("codeMirrorEditor", codeMirrorEditor);
  });

  afterUpdate(() => {
    if (codeMirrorEditor) {
      console.log(filePath, language);
      codeMirrorEditor.setValue(value);
      codeMirrorEditor.setOption("mode", language);
      console.log("afterUpdate()", codeMirrorEditor.getOption("mode"));
      // counter = 0;
    }
  });

  ipcRenderer.on("save-markdown", function () {
    messageObj = { content: codeMirrorEditor.getValue(), file: filePath };
    ipcRenderer.send("synchronous-message", messageObj);
  });

  function handleMouseOver() {
    // tester = !tester;
    console.log("mouseover");
    return;
  }
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

{#if tester}
  <span
    data-tooltip="tooltip"
    id="div_span"
    title={toolTipDiv}
    on:click={onClick}
    >THIS IS THE TOOLTIP ABOUT {lastWord}
  </span>
{/if}
<div on:mouseenter={handleMouseOver} on:mousemove={handleMousMove}>
  <textarea class={$$props.class} bind:this={containerElt} />
</div>

<style>
  /* [data-tooltip] */
  #div_span {
    position: relative;
    cursor: help;
    background-color: rgb(6, 6, 6);
    /* z-index: 10 !important; */
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
  #docs {
    /* /* position: absolute; */
    width: 200px;
    height: 200px;
    /* top: 50%;
    left: 50%;
    margin: -50px 0 0 -50px; */
    /* background: rgb(236, 4, 4); */
    /* border-radius: 80%; */
    /* backface-visibility: hidden; */
  }
</style>
