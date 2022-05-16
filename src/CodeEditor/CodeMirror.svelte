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
  // export { hoverTooltip } from "@codemirror/view";

  const fs = require("fs");
  const { ipcRenderer } = require("electron");
  export let word;
  export let value;
  export let language;
  export let filePath;
  let messageObj;

  let codeMirrorEditor;
  let containerElt;
  export const wordHover = hoverTooltip((view, pos, side) => {
    let { from, to, text } = view.state.doc.lineAt(pos);
    let start = pos,
      end = pos;
    while (start > from && /\w/.test(text[start - from - 1])) start--;
    while (end < to && /\w/.test(text[end - from])) end++;
    if ((start == pos && side < 0) || (end == pos && side > 0)) return null;
    return {
      pos: start,
      end,
      above: true,
      create(view) {
        let dom = document.createElement("div");
        dom.textContent = text.slice(start - from, end - from);
        return { dom };
      },
    };
  });
  //Could be used to get value of word on hover over
  //   editor.on('cursorActivity', function() {
  //     var A1 = editor.getCursor().line;
  //     var A2 = editor.getCursor().ch;

  //     var B1 = editor.findWordAt({line: A1, ch: A2}).anchor.ch;
  //     var B2 = editor.findWordAt({line: A1, ch: A2}).head.ch;

  //     console.log(editor.getRange({line: A1,ch: B1}, {line: A1,ch: B2}));
  // });
  //Another example:
  // setInterval(() => {
  //   word = editor.findWordAt(editor.getCursor());
  //   editor.getRange(word.anchor, word.head);
  //   console.log("this is the mouse hover console.log ", word);
  // }, 333);

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
    }
  });

  ipcRenderer.on("save-markdown", function () {
    messageObj = { content: codeMirrorEditor.getValue(), file: filePath };
    ipcRenderer.send("synchronous-message", messageObj);
  });
</script>

<svelte:head />
<textarea class={$$props.class} bind:this={containerElt} />
