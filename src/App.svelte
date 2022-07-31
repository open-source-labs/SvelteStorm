<script lang="ts">
  import FileDir from "./Directory/FileDir.svelte";
  import XTerm from "./XTerm.svelte";
  import Editor from "./CodeEditor/Editor.svelte";
  import StateManager from "./StateManager/StateManager.svelte";
  import Chart from "./Debugger/Tree.svelte";
  const { app, ipcMain, ipcRenderer, BrowserWindow } = require("electron");
  import Tree from "./Debugger/Tree.svelte";

  import { showEditorBackground } from './DataStore/SvelteStormDataStore'

  import {onMount} from 'svelte';
  import searchDoc from './SearchProgram.js';

  export let orientation = 'columns';
  export let localhost;

  let value: string = '';
  let submit: boolean = false;
  let docsBool: boolean = false;

  let documentation: string;
  let url: string;
  $: documentation = `https://svelte.dev/docs#${url}`;
  let textVal: string;
  function searchDocumentation(value: string) {
    let result: string;
    for (let item in searchDoc) {
      if (searchDoc[item][0].includes(value)) {
        console.log('congrats!');
        result = item;
        return result;
      }
    }
  }

  onMount(async (): Promise<void> => {
    //ST-2022-RJ==========BEGINNING - WORKING CODE FOR RESIZING DOM ELEMENTS USING DIVIDERS===========//
    let leftPanel: HTMLElement = document.getElementById('wrapper-left');
    let rightPanel: HTMLElement = document.getElementById('wrapper-right');
    let upperPanel: HTMLElement = document.getElementById('wrapper-upper');
    let editorPanel: HTMLElement = document.getElementById('editor-window');
    let filedirPanel: HTMLElement = document.getElementById('file-dir');
    // let statemgrPanel: HTMLElement = document.getElementById("state-mgr");
    let mdown_posx: number;
    let mdown_posy: number;
    let x_pos: number;
    let y_pos: number;
    let resizeObj: object = {
      'horizontal-divider': {isResizing: false},
      // "editor-divider": { isResizing: false },
      'filedir-divider': {isResizing: false},
      // "statemgr-divider": { isResizing: false },
      'visualization-divider': {isResizing: false},
    };

    function resize(e: MouseEvent, panel: string): void {
      const dx: number = mdown_posx - e.x; //difference in x coordinates (current mouse position versus where mousedown began)
      const dy: number = mdown_posy - e.y;

      if (panel === 'horizontal-divider') {
        upperPanel.style.height =
          parseInt(getComputedStyle(upperPanel).height) - dy + 'px';
        // } else if (panel === "editor-divider") {
        //   editorPanel.style.width =
        //     parseInt(getComputedStyle(editorPanel).width) - dx + "px"; //Resizing width of edit panel
      } else if (panel === 'visualization-divider') {
        leftPanel.style.width =
          parseInt(getComputedStyle(leftPanel).width) - dx + 'px'; //Resizing width of edit panel
        /*
         * ==================================================
         *   SvelteStorm 4.0 — Jim White 2022-07-25
         *
         *   Added thefollowing dispatchEvent to force
         *   the terminal panel to adjust to panel size
         *   changes.
         * ==================================================
         */
        window.dispatchEvent(new Event('resize'));
      } else if (panel === 'filedir-divider') {
        filedirPanel.style.width =
          parseInt(getComputedStyle(filedirPanel).width) - dx + 'px'; //Resizing width of edit panel
        // } else if (panel === "statemgr-divider") {
        //   statemgrPanel.style.width =
        //     parseInt(getComputedStyle(statemgrPanel).width) - dx + "px"; //Resizing width of edit panel
        // statemgrPanel.style.width = 500 + "px"; //Direct resize works but not with dragging---think it may be related to xterm sizing...
      } else {
      }
      //Update mousedown coordinates for next resizing event (curor moves again while mouse is down)
      mdown_posx = e.x;
      mdown_posy = e.y;
    }

    function chgCursor(e: MouseEvent, panel: string): void {
      if (panel === 'horizontal-divider') {
        (e.target as HTMLElement).style.cursor = 'row-resize';
      } else {
        (e.target as HTMLElement).style.cursor = 'col-resize';
      }
    }

    function dragStart(e: MouseEvent, panel: string): void {
      e.preventDefault(); //stop selection of text during mouse move / mouse down event

      //Need this so window events continue tracking on top of iframe
      let iframeList: HTMLCollection =
        document.getElementsByClassName('webpage');
      // console.log(
      //   '🔴🔴🔴🔴🔴🔴🔴🔴🔴🔴 | file: App.svelte | line 99 | dragStart | iframeList',
      //   iframeList
      // );
      console.log(iframeList);
      for (const item of iframeList) {
        item.setAttribute('style', 'pointer-events: none');
      }
      //defining function here so can remove event listener (unable to remove it with parameters - here it'll have closure access to panel)
      const trackMouseMove = (e: MouseEvent) => {
        // console.log(`ex: ${e.x}`)
        dragMovement(e, panel);
      };

      const trackMouseUp = (e: MouseEvent): void => {
        // console.log('Mouse Up');
        dragEnd(e, panel);
        window.removeEventListener('mousemove', trackMouseMove, true);
        window.removeEventListener('mouseup', trackMouseUp, true);

        //Removing no pointer events from iframes on mouse up
        let iframeList: HTMLCollection =
          document.getElementsByClassName('webpage');
        for (const item of iframeList) {
          item.setAttribute('style', '');
        }
      };
      window.addEventListener('mousemove', trackMouseMove, true);
      window.addEventListener('mouseup', trackMouseUp, true);

      if (panel === 'horizontal-divider') {
        mdown_posy = e.y;
        resizeObj[panel].isResizing = true;
      } else {
        mdown_posx = e.x;
        resizeObj[panel].isResizing = true;
      }
    }

    function dragMovement(e: MouseEvent, panel: string): void {
      e.preventDefault(); //stop selection of text during mouse move / mouse down event
      x_pos = e.x;
      y_pos = e.y;

      if (panel === 'horizontal-divider') {
        if (resizeObj[panel].isResizing === true) {
          resize(e, 'horizontal-divider');
        }
      } else if (panel === 'visualization-divider') {
        if (resizeObj[panel].isResizing === true) {
          resize(e, 'visualization-divider');
        }
      } else if (panel === 'filedir-divider') {
        if (resizeObj[panel].isResizing === true) {
          resize(e, 'filedir-divider');
        }
      }
    }

    function dragEnd(e: MouseEvent, panel: string) {
      e.preventDefault(); //stop selection of text during mouse move / mouse down event
      resizeObj[panel].isResizing = false;
    }


    
    
    
    let horizDivider: HTMLElement = document.getElementById('horizontal-divider');
    let editorDivider: HTMLElement = document.getElementById('editor-divider');
    let filedirDivider: HTMLElement = document.getElementById('filedir-divider');
    let visualizationDivider: HTMLElement = document.getElementById('visualization-divider');
      
    // horizDivider.style.background = 'blue';
    // filedirDivider.style.background = 'blue';
    // visualizationDivider.style.background = 'blue';

    horizDivider.addEventListener('mouseover', (e) =>
      chgCursor(e, 'horizontal-divider')
    );
    horizDivider.addEventListener('mousedown', (e) =>
      dragStart(e, 'horizontal-divider')
    );

    visualizationDivider.addEventListener('mouseover', (e) =>
      chgCursor(e, 'visualization-divider')
    );
    visualizationDivider.addEventListener('mousedown', (e) =>
      dragStart(e, 'visualization-divider')
    );

    filedirDivider.addEventListener('mouseover', (e) =>
      chgCursor(e, 'filedir-divider')
    );
    filedirDivider.addEventListener('mousedown', (e) =>
      dragStart(e, 'filedir-divider')
    );

    //==========END - WORKING CODE FOR RESIZING DOM ELEMENTS USING DIVIDERS===========//

    //ST-2022-RJ Setting xterm layers to have 100% width so risizing able to be dynamic - overwriting default styles onMount and
    function xtermRestyle(className: string): void {
      let domElement = document.getElementsByClassName(className);
      for (const item of domElement) {
        let currentStyle: string[] = item.getAttribute('style').split(';'); //Array of each style attribute string
        for (let i = 0; i < currentStyle.length; i++) {
          const style: string = currentStyle[i];

          if (style.indexOf('width') !== -1) currentStyle[i] = 'width: 100%';
        }
        item.setAttribute('style', currentStyle.join(';'));
      }
    }

    function xtermSetWidth(): void {
      xtermRestyle('xterm-screen');
      xtermRestyle('xterm-text-layer');
      xtermRestyle('xterm-selection-layer');
      xtermRestyle('xterm-link-layer');
      xtermRestyle('xterm-cursor-layer');
    }

    xtermSetWidth();
    //Need to trigger this after resize so that it follows xterm's fittaddon resize
    window.addEventListener('resize', xtermSetWidth);
  }); //End of onMount

  const handleSubmit = (): boolean => {
    submit = false;
    return false;
  };
  export const handleDocuments = () => {
    // submit = false;
    console.log('the handleDocs is firing');
    docsBool = !docsBool;
    // return false;
  };

  const handleKeyup = (e: KeyboardEvent) => {
    submit = false;

    if (e.code == 'Enter') {
      console.log('Enter submitted');
      e.preventDefault();
      (e.target as HTMLInputElement).value;
      value = (e.target as HTMLInputElement).value;
      localhost = `http://localhost:${value}/`;
      return false;
    }
  };
  const handleKeyup2 = (e: KeyboardEvent) => {
    submit = true;
    console.log('handlekeyup 2', textVal);
    url = searchDocumentation(textVal);
    console.log('this is the url', searchDocumentation(textVal));
    documentation = `https://svelte.dev/docs#"${url}/`;
    documentation = documentation;
    return false;
  };
</script>

<body class:orientation>
  <main class="wrapper">
    <div class="box wrapper-left" id="wrapper-left">
      <div class="box wrapper-upper" id="wrapper-upper">
        <div class="box a target" id="file-dir">
          <FileDir />
        </div>
        <div class="dividers-v" id="filedir-divider" />
        <div class="box b" id="editor-window" >
          <!-- svelte-ignore missing-declaration -->
          {#if $showEditorBackground}
          <div class="backdrop">
          </div>
          {:else}
          <div class="editor-wrapper">
            <!-- <Editor class="childClass" /> -->
            <Editor />
          </div>
        {/if}
        </div>
      </div>
      <div class="dividers-h" id="horizontal-divider" />
      <div class="box wrapper-bottom">
        <div class="box e" id="terminal-window">
          <XTerm />
        </div>
      </div>
    </div>



    <div class="dividers-v" id="visualization-divider" />


    
        <div class="box wrapper-right" id="wrapper-right">
          <div class="box d root">
            <form class="render-wrapper" on:submit|preventDefault={handleSubmit}>
              {#if docsBool === true}
                <div class="parent grid-parent">
                  <input
                    class="child"
                    placeholder="Search Documentation"
                    type="text"
                    bind:value={textVal}
                  />
                  <button
                    class="searchButton"
                    on:click|preventDefault={handleKeyup2}>Search</button
                  >
                  <button class="backButton" on:click={handleDocuments}>Back</button
                  >
                </div>
                <iframe class="docs" title="test" src={documentation} />
              {/if}
              {#if docsBool === false}
                <div class="parent grid-parent">
                  <button
                    type="button"
                    class="childButton"
                    on:click={handleDocuments}>Docs?</button
                  >
                </div>
                <div id="stateManager">
                  <StateManager />
                </div>
                <div class="box" id="dummyGraph">
                  <Tree />
                </div>
              {/if}
            </form>
          </div>
        </div>
  </main>
</body>

<style>

#dummyGraph {
  flex-grow: 1;
  width: 100%;
  height: 100%;
}

  #wrapper-right {
    /* background: url('../public/img/TimeTravel04.jpg') no-repeat center center;
    background-size: cover;
    /* box-shadow: 15px 15px 50px 0 rgb(15, 14, 14) inset, -15px -15px 50px 0 rgb(66, 65, 65) inset; */
    /* box-shadow: 15px 15px 50px 0 rgb(0, 0, 0) inset, -15px -15px 50px 0 rgb(0, 0, 0) inset; */
    /* background-color: #0d1117; */
    /* opacity: 0.3; */
    position: relative;
    /* width: 100%;
    height: 100%; */
  }
  
  
#wrapper-right:before {
  content: ' ';
  display: block;
  position: absolute;
  left: 0;
  top: 0;
  width: 100%;
  height: 100%;
  opacity: 0.3;
  /* background-image: url('../public/img/TimeTravel04.jpg') no-repeat center center;; */
  background-image: url('../public/img/TimeTravel04.jpg');
  box-shadow: 15px 15px 50px 0 rgb(0, 0, 0) inset, -15px -15px 50px 0 rgb(0, 0, 0) inset;
  background-repeat: no-repeat;
  background-position: 50% 0;
  background-size: cover;
}

.root {
  position: relative;
}

  /* #stateManager {
    background: url('../public/img/TimeTravel10.jpg') left top no-repeat;
    background: url('../public/img/TimeTravel10.jpg');
    background-size: contain;
    box-shadow: 15px 15px 50px 0 rgb(15, 14, 14) inset, -15px -15px 50px 0 rgb(66, 65, 65) inset;
    background-color: #0d1117;
    width: 100%;
    height: 100%;
  } 
  */
  .render-wrapper {
    width: 100%;
    height: 100%;
    /* background: url('../public/img/TimeTravel10.jpg') left top no-repeat; */
    /* background: url('../public/img/TimeTravel10.jpg') no-repeat top center; */
    /* background-size: 100vw 100vh; */
    /* box-shadow: 15px 15px 50px 0 rgb(15, 14, 14) inset, -15px -15px 50px 0 rgb(66, 65, 65) inset; */
    /* opacity: 0.5; */
    /* background-size: cover;
    background-size: 100% 8%;
    box-shadow: 15px 15px 50px 0 rgb(0, 0, 0) inset, -15px -15px 50px 0 rgb(0, 0, 0) inset;
    background-color: #0d1117; */
  }

  body {
    height: 100%;
    width: 100%;
  }
  .grid-parent {
    float: left;
  }

  /*2022-ST-RJ Restructured CSS to use flex rather than grid so dynamic window resizing works appropriately /*
  /* Wrapper Window - SvelteTeam */
  .wrapper {
    height: 100%;
    width: 100%;
    display: flex;
    flex-direction: row;
    background-color: #0d1117;
    color: #444;
    flex-grow: 1;
    position: relative;
  }

  .wrapper-left {
    height: 100%;
    width: 60%;
    display: flex;
    flex-direction: column;
    background-color: #0d1117;
    color: #444;
    overflow: auto;
    max-width: 90%;
    min-width: 30%;
    border-right: 1px solid #444;
    padding: 0;
  }

  .wrapper-right {
    /* background-image: url('../public/img/TimeTravel04.jpg'); */
    background-size: contain;
    
    background-blend-mode: normal;
    z-index: 9999;
    height: 100%;
    /* width: 40%; */
    display: flex;
    max-width: 90%;
    /* width: 15%; */
    /* min-width: 12.8%; */
    min-width: 30%;

    /* flex-direction: row;   */
    /* flex-direction: column; */
    flex-grow: 1; /*Let render window take up remaining space in the flexbox */

    /* background-color: rgb(39, 38, 38); */
    background-color: #0d1117;
    color: #444;
  }

  .wrapper-upper {
    height: 80%;
    display: flex;
    flex-direction: row;
    width: 100%;
    /* resize: vertical; */
    overflow: auto;
    /* background-color: rgb(39, 38, 38); */
    background-color: #4e947f;
    color: #444;
    /* padding: 5px; */
    z-index: 0;
  }
  .wrapper-bottom {
    min-height: 1%;
    height: 20%;
    flex-grow: 1;
    display: flex;
    flex-direction: row;
    width: 100%;
    /* background-color: rgb(39, 38, 38); */
    background-color: #344867;
    color: #444;
    position: relative;
    margin-top: -8px;
    overflow-y: scroll;
  }
  .editor-wrapper {
    height: 100%;
    width: 100%;
    z-index: 1;
    margin-left: 30;
    padding-left: 30;
  }
  
  /* .editor-wrapper::before { */
  .backdrop::before {
    box-shadow: 15px 15px 50px 0 rgb(0, 0, 0) inset, -15px -15px 50px 0 rgb(0, 0, 0) inset;
    content: "";
    background: url('../public/img/CodeEditor01.jpeg');
    size: cover;
    opacity: 0.5;
    top: 0;
    left: 0;
    bottom: 0;
    right: 0;
    position: absolute;
    z-index: 1;   
    }


    /* .editor-wrapper::after { */
    .backdrop::after {
      box-shadow: 15px 15px 50px 0 rgb(0, 0, 0) inset, -15px -15px 50px 0 rgb(0, 0, 0) inset;
    content: "";
      background: url('../public/img/Svelte_Logo1.svg') no-repeat center;
      size: contain;
      opacity: 0.4;
      top: 0;
      left: 0;
      bottom: 0;
      right: 0;
      position: absolute;
      z-index: 2;   
}


  .docs {
    overflow: auto;
    color: white;
    /* resize: vertical; */
    height: 90%;
    width: 98%;
    color: 'grey';
  }

  .render-wrapper {
    /* background-color: #252532; */
    /* background-color: #0d1117; */
    display: flex;
    flex-direction: column;
    height: 100%;
    overflow-y: scroll;
  }

  .dividers-h {
    z-index: 9999;
    padding-top: 1px;
    padding-bottom: 1px;
    height: 1px;
    background-color: blue;
    /* margin-top: 20px; */
    margin-bottom: 6px;
  }

  .dividers-v {
    z-index: 9999;
    padding-left: 1px;
    padding-right: 1px;
    width: 1px;
    height: 100%;
    background-color: blue;
  }

  #visualization-divider {
    z-index: 9999;
    padding-left: 1px;
    padding-right: 1px;
    width: 1px;
    height: 100%;
    background-color: blue;
  }

  .box {
    /* background-color: rgb(102, 217, 132); */
    color: rgb(245, 242, 239);
    border-radius: 0px;
    overflow-y: scroll;
  }

  /* File Directory - SvelteTeam */
  .a {
    font-size: 10px;
    overflow: auto;
    max-width: 50%;
    width: 20%;
    min-width: 120px;
    background-color: #070a0f;
    border-right: 1px solid #3d3d3d;
    border-bottom: 1px solid #3d3d3d;
  }

  /* Text Editor - SvelteTeam */
  .b {
    overflow: auto;
    overflow: auto;
    flex-grow: 1;
    background-color: #0d1117;
    border-bottom: 1px solid #3d3d3d;
    border-right: 1px solid #3d3d3d;
    position: relative;
    /* margin-left: -8px; */
    margin-right: -8px;
    padding-right: 8px;
  }

  /* State Management Window - SvelteTeam */
  /* .c {
    overflow: auto;
    max-width: 50%;
    width: 15%;
    min-width: 10%;
    background-color: #070a0f;
    border-right: 1px solid #3d3d3d;
    padding: 0;
    margin-right: -8px;
  } */

  /* Browser Render Window - SvelteTeam */
  .d {
    /* background-image: url('../public/img/TimeTravel04.jpg');
    background-size: contain;
    background-color: #0d1117; */

    min-width: 1%;
    flex-direction: column;
    flex-grow: 1; /*Let render window take up remaining space in the flexbox */
    padding: 0px;
    text-align: center;
    border-bottom: 1px solid #3d3d3d;
    position: relative;
  }

  .d input {
    margin: auto;
    margin-top: 0;
    margin-bottom: 0;
    height: 20px;
    font-size: 12px;
    color: black;
  }
  /* Terminal Window - SvelteTeam */
  .e {
    font: white;
    /* overflow: auto; */
    flex-grow: 1;
    background-color: #0d1117;
    position: relative;
    overflow-y: scroll;
    /* margin-top: 20px; */
    padding-top: 10px;
    padding-left: 10px;

  }

  /* Webpage Render - SvelteTeam */
  /* .webpage {
    height: 100%;
    width: 100%;
    background-color: #0d1117;
  } */
  .docs {
    overflow: auto;
    height: 100%;
    width: 98%;
    color: 'grey';
  }

  .parent.grid-parent button {
    color: white;
  }

  .b :global(.childClass) {
    overflow: scroll;
    display: flex;
  }

  .childButton {
    color: grey;
    background: transparent;
    font-size: small;
    border: none;
  }
  .backButton {
    color: lightgray;
    background: transparent;
    border: 1px;
    font-size: small;
    border-style: inset;
    border-color: grey;
  }
  .searchButton {
    color: lightgray;
    background: transparent;
    border: 1px;
    font-size: small;
    border-style: inset;
    border-color: grey;
  }


  #terminal-window::-webkit-scrollbar , #dummyGraph::-webkit-scrollbar {
  display: block;
  width: 15px;
  overflow: auto;
  border: var(--scrollbar_border);
  margin-top: 20px;
  padding-top: 20px;
}
#terminal-window::-webkit-scrollbar-thumb , #dummyGraph::-webkit-scrollbar-thumb {
  background-color: var(--scrollbar_box_color);
  border: var(--scrollbar_box_border);
}

#terminal-window::-webkit-scrollbar-track, #dummyGraph::-webkit-scrollbar-track {
  background-color: rgb(209, 159, 59);
  margin-top: 2px;
  /* padding-top: 20px; */
}

#terminal-window::-webkit-scrollbar-track-piece, #dummyGraph::-webkit-scrollbar-track-piece {
  border: var(--scrollbar_border);
  background-color: rgb(105, 225, 244);
}

#terminal-window::-webkit-scrollbar-corner, #dummyGraph::-webkit-scrollbar-corner {
  width: 20px;
  height: 20px;
  border: 3px solid white;
  background-color: rgb(209, 59, 179);
}

#terminal-window::-webkit-resizer, #dummyGraph::-webkit-resizer {
  width: 20px;
  height: 20px;
  background-color: rgb(59, 104, 209);
  border: 3px solid white;
  
}



</style>
