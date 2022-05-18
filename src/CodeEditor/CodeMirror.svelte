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

  let hoverCounter = 0;
  let lastHoverCounter = 0;
  let lastWord;
  let toolTip = false;
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
      // toolTip = true;
      counter = 0;
      // toolTipDiv = `THIS IS WHERE THE TOOL TIP WIL BE ABOUT: ${lastWord}`;
    }
    if (counter > 6 && word !== lastWord) {
      counter = 0;
    }

    var A1 = codeMirrorEditor.getCursor().line;
    var A2 = codeMirrorEditor.getCursor().ch;

    var B1 = codeMirrorEditor.findWordAt({ line: A1, ch: A2 }).anchor.ch;
    var B2 = codeMirrorEditor.findWordAt({ line: A1, ch: A2 }).head.ch;
    searchDocumentation(
      codeMirrorEditor.getRange({ line: A1, ch: B1 }, { line: A1, ch: B2 })
    );
    word = codeMirrorEditor.getRange(
      { line: A1, ch: B1 },
      { line: A1, ch: B2 }
    );
    // console.log("this is the word right after the document search", word);
    if (lastWord !== word) {
      counter = 0;
    }
    counter++;
    lastWord = word;
    // console.log(
    //   "this is the last console log of tooltips",
    //   codeMirrorEditor.getRange({ line: A1, ch: B1 }, { line: A1, ch: B2 })
    // );
  }
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
</script>

<svelte:head />
<textarea class={$$props.class} bind:this={containerElt} />
