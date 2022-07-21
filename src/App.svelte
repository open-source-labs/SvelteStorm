<script lang="ts">
  import FileDir from "./Directory/FileDir.svelte";
  import XTerm from "./XTerm.svelte";
  import Editor from "./CodeEditor/Editor.svelte";
  import StateManager from "./StateManager/StateManager.svelte";
  const { app, ipcMain, remote, ipcRenderer, BrowserWindow } = require("electron");
  import Chart from "./Debugger/Chart.svelte";
  // import IceChart from "./Debugger/IceChart.svelte";
  // import myData from "./Debugger/2019.js";

  import searchDoc from "./SearchProgram.js";
  import { onMount, SvelteComponent } from "svelte";





  export let orientation = "columns";
  export let localhost;








  let value: string = "";
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
        console.log("congrats!");
        result = item;
        return result;
      }
    }
  }



  onMount(async (): Promise<void> => {
    //ST-2022-RJ==========BEGINNING - WORKING CODE FOR RESIZING DOM ELEMENTS USING DIVIDERS===========//
    let leftPanel: HTMLElement = document.getElementById("wrapper-left");
    let rightPanel: HTMLElement = document.getElementById("wrapper-right");
    let upperPanel: HTMLElement = document.getElementById("wrapper-upper");
    let editorPanel: HTMLElement = document.getElementById("editor-window");
    let filedirPanel: HTMLElement = document.getElementById("file-dir");
    // let statemgrPanel: HTMLElement = document.getElementById("state-mgr");
    let mdown_posx: number;
    let mdown_posy: number;
    let x_pos: number;
    let y_pos: number;
    let resizeObj: object = {
      "horizontal-divider": { isResizing: false },
      // "editor-divider": { isResizing: false },
      "filedir-divider": { isResizing: false },
      // "statemgr-divider": { isResizing: false },
      "visualization-divider": { isResizing: false },
    };

    function resize(e: MouseEvent, panel: string): void {
      const dx: number = mdown_posx - e.x; //difference in x coordinates (current mouse position versus where mousedown began)
      const dy: number = mdown_posy - e.y;

      if (panel === "horizontal-divider") {
        upperPanel.style.height =
          parseInt(getComputedStyle(upperPanel).height) - dy + "px";
      // } else if (panel === "editor-divider") {
      //   editorPanel.style.width =
      //     parseInt(getComputedStyle(editorPanel).width) - dx + "px"; //Resizing width of edit panel
      } else if (panel === "visualization-divider") {
        leftPanel.style.width =
          parseInt(getComputedStyle(leftPanel).width) - dx + "px"; //Resizing width of edit panel
      } else if (panel === "filedir-divider") {
        filedirPanel.style.width =
          parseInt(getComputedStyle(filedirPanel).width) - dx + "px"; //Resizing width of edit panel
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
      if (panel === "horizontal-divider") {
        (e.target as HTMLElement).style.cursor = "row-resize";
      } else {
        (e.target as HTMLElement).style.cursor = "col-resize";
      }
    }

    function dragStart(e: MouseEvent, panel: string): void {
      e.preventDefault(); //stop selection of text during mouse move / mouse down event

      //Need this so window events continue tracking on top of iframe
      let iframeList: HTMLCollection =
        document.getElementsByClassName("webpage");
      console.log(iframeList);
      for (const item of iframeList) {
        item.setAttribute("style", "pointer-events: none");
      }
      //defining function here so can remove event listener (unable to remove it with parameters - here it'll have closure access to panel)
      const trackMouseMove = (e: MouseEvent) => {
        // console.log(`ex: ${e.x}`)
        dragMovement(e, panel);
      };

      const trackMouseUp = (e: MouseEvent): void => {
        // console.log('Mouse Up');
        dragEnd(e, panel);
        window.removeEventListener("mousemove", trackMouseMove, true);
        window.removeEventListener("mouseup", trackMouseUp, true);

        //Removing no pointer events from iframes on mouse up
        let iframeList: HTMLCollection =
          document.getElementsByClassName("webpage");
        for (const item of iframeList) {
          item.setAttribute("style", "");
        }
      };
      window.addEventListener("mousemove", trackMouseMove, true);
      window.addEventListener("mouseup", trackMouseUp, true);

      if (panel === "horizontal-divider") {
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

      if (panel === "horizontal-divider") {
        if (resizeObj[panel].isResizing === true) {
          resize(e, "horizontal-divider");
        }
      // } else if (panel === "editor-divider") {
      //   if (resizeObj[panel].isResizing === true) {
      //     resize(e, "editor-divider");
      //   }
      } else if (panel === "visualization-divider") {
        if (resizeObj[panel].isResizing === true) {
          resize(e, "visualization-divider");
        }
      } else if (panel === "filedir-divider") {
        if (resizeObj[panel].isResizing === true) {
          resize(e, "filedir-divider");
        }
      // } else if (panel === "statemgr-divider") {
      //   if (resizeObj[panel].isResizing === true) {
      //     resize(e, "statemgr-divider");
      //   }
      } else {
      }
    }

    function dragEnd(e: MouseEvent, panel: string) {
      e.preventDefault(); //stop selection of text during mouse move / mouse down event
      resizeObj[panel].isResizing = false;
    }

    
    
    /*
    * ==================================================
    *   Just a Test... 
    * ==================================================
    */
   // editorDivider.style.background = 'blue';
   
    //* End of test
    
    let horizDivider: HTMLElement = document.getElementById("horizontal-divider");
    let editorDivider: HTMLElement = document.getElementById("editor-divider");
    let filedirDivider: HTMLElement =  document.getElementById("filedir-divider");
    // let statemgrDivider: HTMLElement = document.getElementById("statemgr-divider");
    let visualizationDivider: HTMLElement = document.getElementById("visualization-divider");

    horizDivider.addEventListener("mouseover", (e) =>
      chgCursor(e, "horizontal-divider")
    );
    horizDivider.addEventListener("mousedown", (e) =>
      dragStart(e, "horizontal-divider")
    );

    // editorDivider.addEventListener("mouseover", (e) =>
    //   chgCursor(e, "editor-divider")
    // );
    // editorDivider.addEventListener("mousedown", (e) =>
    //   dragStart(e, "editor-divider")
    // );

    visualizationDivider.addEventListener("mouseover", (e) =>
      chgCursor(e, "visualization-divider")
    );
    visualizationDivider.addEventListener("mousedown", (e) =>
      dragStart(e, "visualization-divider")
    );

    filedirDivider.addEventListener("mouseover", (e) =>
      chgCursor(e, "filedir-divider")
    );
    filedirDivider.addEventListener("mousedown", (e) =>
      dragStart(e, "filedir-divider")
    );

    // statemgrDivider.addEventListener("mouseover", (e) =>
    //   chgCursor(e, "statemgr-divider")
    // );
    // statemgrDivider.addEventListener("mousedown", (e) =>
    //   dragStart(e, "statemgr-divider")
    // );

    //==========END - WORKING CODE FOR RESIZING DOM ELEMENTS USING DIVIDERS===========//

    //ST-2022-RJ Setting xterm layers to have 100% width so risizing able to be dynamic - overwriting default styles onMount and
    function xtermRestyle(className: string): void {
      let domElement = document.getElementsByClassName(className);
      for (const item of domElement) {
        let currentStyle: string[] = item.getAttribute("style").split(";"); //Array of each style attribute string
        for (let i = 0; i < currentStyle.length; i++) {
          const style: string = currentStyle[i];

          if (style.indexOf("width") !== -1) currentStyle[i] = "width: 100%";
        }
        item.setAttribute("style", currentStyle.join(";"));
      }
    }

    function xtermSetWidth(): void {
      xtermRestyle("xterm-screen");
      xtermRestyle("xterm-text-layer");
      xtermRestyle("xterm-selection-layer");
      xtermRestyle("xterm-link-layer");
      xtermRestyle("xterm-cursor-layer");
    }

    xtermSetWidth();
    //Need to trigger this after resize so that it follows xterm's fittaddon resize
    window.addEventListener("resize", xtermSetWidth);
  }); //End of onMount

  const handleSubmit = (): boolean => {
    submit = false;
    return false;
  };
  export const handleDocuments = () => {
    // submit = false;
    console.log("the handleDocs is firing");
    docsBool = !docsBool;
    // return false;
  };

  const handleKeyup = (e: KeyboardEvent) => {
    submit = false;

    if (e.code == "Enter") {
      console.log("Enter submitted");
      e.preventDefault();
      (e.target as HTMLInputElement).value;
      value = (e.target as HTMLInputElement).value;
      localhost = `http://localhost:${value}/`;
      return false;
    }
  };
  const handleKeyup2 = (e: KeyboardEvent) => {
    submit = true;
    console.log("handlekeyup 2", textVal);
    url = searchDocumentation(textVal);
    console.log("this is the url", searchDocumentation(textVal));
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






                          <div class="box b" id="editor-window">
                            <!-- svelte-ignore missing-declaration -->
                            <div class="editor-wrapper">
                              <Editor class="childClass" />
                            </div>
                          </div>

                















            </div>







        <div class="dividers-h" id="horizontal-divider" />





                <div class="box wrapper-bottom">



                                <!-- <div class="box c root" id="state-mgr">
                                  <StateManager />
                                </div>




                      <div class="dividers-v" id="statemgr-divider" /> -->





                                <div class="box e" id="terminal-window">
                                  <XTerm />
                                </div>




                </div>


      </div>


      <!-- <div class="dividers-v" id="editor-divider" /> -->


  <!-- <div class="dividers-v" id="statemgr-divider" /> -->




  <div class="dividers-v" id="visualization-divider" />
  
  <div class="box wrapper-right" id="wrapper-right">
    
              

        <!-- <div class="box d root"> -->
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
                
                <!-- <input
                  class="child"
                  placeholder={value === "" ? "Local Host Port" : value}
                  type="text"
                  on:keyup|preventDefault={handleKeyup}
                  /> -->
            
                  <button
                  type="button"
                  class="childButton"
                  on:click={handleDocuments}>Docs?</button
                  >

              </div>
              <!-- <iframe
                class="webpage"
                title="local host"
                src={localhost}
                frameBorder="0"
              /> -->

              <!-- ------------------------------------------- -->
              <!-- <div class="box c root" id="state-mgr"> -->
              <StateManager />
              <!-- </div> -->
              <!-- ------------------------------------------- -->
              <div id="dummyGraph">
                <Chart />
              </div>

            {/if}
          </form>
        </div>






      </div>
            
            




  </main>










</body>

<style>
  #dummyGraph {
    background-color: #0d1117;
    width: 100%;
    height: 100%;
  }
  
  body {
    height: 100%;
    width: 100%;
  }
  .grid-parent {
    /* display: grid;
    grid-template-columns: 1fr 1fr; */
    float: left;
  }
  /* .inline-flex-parent {
    display: inline-flex;
    justify-content: flex-start;
  }
  .search1 {
    justify-content: center;
    /* padding-left: 200px; */
  /* } */
  /* .search2 {
    padding-right: 150px;
  } */
  
  /*2022-ST-RJ Restructured CSS to use flex rather than grid so dynamic window resizing works appropriately /*
  /* Wrapper Window - SvelteTeam */
  .wrapper {
    height: 100%;
    width: 100%;
    display: flex;
    flex-direction: row;
    /* background-color: rgb(39, 38, 38); */
    background-color: #0d1117;
    color: #444;
  
  
  
  
    /* min-height: 1%;
    height: 20%; */
    flex-grow: 1;
    /* display: flex;
    flex-direction: row; */
    /* width: 100%; */
    /* background-color: rgb(39, 38, 38); */
    /* background-color: #344867;
    color: #444; */
    position: relative;
    /* margin-top: -8px; */
  
  }
  
  
    .wrapper-left {
      height: 100%;
      width: 60%;
      display: flex;
      flex-direction: column;
      /* background-color: rgb(39, 38, 38); */
      background-color: #0d1117;
      color: #444;
  
  
  
  
      overflow: auto;
      max-width: 90%;
      /* width: 15%; */
      /* min-width: 12.8%; */
      min-width: 30%;
      /* background-color: rgba(28, 28, 36, 0.678); */
      /* background-color: #070a0f; */
      border-right: 1px solid #444;
      padding: 0;
      /* margin-right: -8px; */
  
  
  
  
    }
  
  .wrapper-right {
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
  }
  .editor-wrapper {
    height: 100%;
    width: 100%;
    z-index: 1;
  }
  .docs {
    overflow: auto;
    color: white;
    /* resize: vertical; */
    height: 90%;
    width: 98%;
    color: "grey";
  }
  
  .render-wrapper {
    /* background-color: #252532; */
    background-color: #0d1117;
    display: flex;
    flex-direction: column;
    height: 100%;
    overflow-y: scroll;
  }
  
  /*Dividers used for resizing events*/
  /* #horizontal-divider {
    width: 100%;
    height: 2px;
    /* padding-top: 3px; */
  /* padding-bottom: 3px; */
  
  /* #filedir-divider {
    height: 100%;
    width: 3px;
  }
  
  #editor-divider {
    height: 100%;
    width: 3px;
  }
  
  #statemgr-divider {
    height: 100%;
    width: 3px;
  } */
  
  .dividers-h {
    /* height: 1px; */
    z-index: 9999;
    /* background-clip: content-box; */
    padding-top: 4px;
    padding-bottom: 4px;
    /* position: relative; */
    /* top: -5px; */
  }
  
  .dividers-v {
    z-index: 9999;
    /* background-clip: content-box; */
    padding-left: 4px;
    padding-right: 4px;
    /* position: relative; */
    height: 100%;
  
    /* left: -5px; */
  }
  
  /* .dividers-h:hover {
    cursor: ns-resize;
  }
  
  .dividers-v:hover {
    cursor: ew-resize;
  } */
  
  .box {
    background-color: rgb(102, 217, 132);
    color: rgb(245, 242, 239);
    border-radius: 0px;
    /* padding: 5px; */
  }
  
  
  /* File Directory - SvelteTeam */
  .a {
    font-size: 10px;
    overflow: auto;
    /* resize: horizontal; */
    max-width: 50%;
    width: 20%;
    /* min-width: 12.5%; */
    min-width: 20%;
    /* max-width: 30%; */
    background-color: #070a0f;
    border-right: 1px solid #3d3d3d;
    border-bottom: 1px solid #3d3d3d;
  }
  
  
  /* Text Editor - SvelteTeam */
  .b {
    overflow: auto;
    overflow: auto;
    /* width: 100%; */
    flex-grow: 1;

    /* width: 100%; */
    /* resize: horizontal; */
    background-color: #0d1117;
    border-bottom: 1px solid #3d3d3d;
    border-right: 1px solid #3d3d3d;
    position: relative;
    /* left: -8px; */
    margin-left: -8px;
    margin-right: -8px;
    padding-right: 8px;
  }
  
  
  /* State Management Window - SvelteTeam */
  .c {
    overflow: auto;
    max-width: 50%;
    width: 15%;
    /* min-width: 12.8%; */
    min-width: 10%;
    /* background-color: rgba(28, 28, 36, 0.678); */
    background-color: #070a0f;
    border-right: 1px solid #3d3d3d;
    padding: 0;
    margin-right: -8px;
  }
  
  /* Browser Render Window - SvelteTeam */
  .d {
    min-width: 1%;
    flex-direction: column;
    flex-grow: 1; /*Let render window take up remaining space in the flexbox */
    padding: 0px;
    text-align: center;
    background-color: #0d1117;
    border-bottom: 1px solid #3d3d3d;
    position: relative;
  
    /* left: -16px; */
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
    overflow: auto;
    /* width: 100%; */
    flex-grow: 1;
    /* background-color: rgba(35, 35, 65, 0.452); */
    background-color: #0d1117;
    position: relative;
  }
  
  /* Webpage Render - SvelteTeam */
  .webpage {
    /* overflow: auto; */
    /* resize: vertical; */
    height: 100%;
    width: 100%;
    background-color: #0d1117;
    /* pointer-events: none; */
  }
  .docs {
    overflow: auto;
    /* resize: vertical; */
    height: 100%;
    width: 98%;
    color: "grey";
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
  
  
  iframe:focus {
    outline: none;
  }


  :root{
    --syntax_normal:#1b1e23;
    --syntax_comment:#a9b0bc;
    --syntax_number:#20a5ba;
    --syntax_keyword:#c30771;
    --syntax_atom:#10a778;
    --syntax_string:#008ec4;
    --syntax_error:#ffbedc;
    --syntax_unknown_variable:#838383;
    --syntax_known_variable:#005f87;
    --syntax_matchbracket:#20bbfc;
    --syntax_key:#6636b4;
    --mono_fonts:82%/1.5 Menlo,Consolas,monospace
  }
    
    .observablehq--collapsed,.observablehq--expanded,.observablehq--function,.observablehq--gray,.observablehq--import,.observablehq--string:after,.observablehq--string:before{
      color:var(--syntax_normal)
    }
    
    .observablehq--collapsed,.observablehq--inspect a{
      cursor:pointer
    }
    
    .observablehq--field{
      text-indent:-1em;
      margin-left:1em
    }
    
    .observablehq--empty{
      color:var(--syntax_comment)
    }
    
    .observablehq--blue,.observablehq--keyword{
      color:#3182bd
    }
    
    .observablehq--forbidden,.observablehq--pink{
      color:#e377c2
    }
    
    .observablehq--orange{
      color:#e6550d
    }
    
    .observablehq--boolean,.observablehq--null,.observablehq--undefined{
      color:var(--syntax_atom)
    }
    
    .observablehq--bigint,.observablehq--date,.observablehq--green,.observablehq--number,.observablehq--regexp,.observablehq--symbol{
      color:var(--syntax_number)
    }
    
    .observablehq--index,.observablehq--key{
      color:var(--syntax_key)
    }
    
    .observablehq--prototype-key{
      color:#aaa
    }
    
    .observablehq--empty{
      font-style:oblique
    }
    
    .observablehq--purple,.observablehq--string{
      color:var(--syntax_string)
    }
    
    .observablehq--error,.observablehq--red{
      color:#e7040f
    }
    
    .observablehq--inspect{
      font:var(--mono_fonts);
      overflow-x:auto;
      display:block;
      white-space:pre
    }
    
    .observablehq--error .observablehq--inspect{
      word-break:break-all;
      white-space:pre-wrap
    }
  
  

  </style>
  