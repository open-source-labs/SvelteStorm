<script>
  import FileDir from "./Directory/FileDir.svelte";
  import XTerm from "./XTerm.svelte";
  import Editor from "./CodeEditor/Editor.svelte";
  import StateManager from "./StateManager/StateManager.svelte";
  import { onMount } from "svelte";

  export let orientation = "columns";
  export let localhost;
  
  let value = "";
  let submit = false;

  //Testing code for window resize
 
  

  // let leftWidth;
  // let mainWidth;

    // function handleLeftResize(node) {
    //     leftWidth = node.clientWidth;
    // }

    // function handleMainResize(node) {
    //     mainWidth = node.clientWidth;
    // }
  let x = 0;
  let y = 0;


  let isResizing = {'upperPanel': false, 'editorPanel': false};
  let inResizeRange = {'upperPanel': false, 'editorPanel': false};
  let onBorder = false;

  onMount(async () => {
  
  let mdown_posx;
  let mdown_posy;
  let x_pos;
  let y_pos;
  let upperPanel = document.getElementById('wrapper-upper');
  let editorPanel = document.getElementById('editor-window');
  let fileDirPanel = document.getElementById('file-dir');

  function resize(e, panel){
    console.log('resizing');
    const dx = mdown_posx - e.x; //difference in x coordinates (current mouse position versus where mousedown began)
    const dy = mdown_posy - e.y;

    if (panel === upperPanel){
      upperPanel.style.height = (parseInt(getComputedStyle(upperPanel).height) - dy) + "px"; //Resizing height of upper/lower
    }

    if (panel === editorPanel){
      editorPanel.style.width = (parseInt(getComputedStyle(editorPanel).width) - dx) + "px"; //Resizing width of  //Resizing height of upper/lower
    }
    //Update mousedown coordinates for next resizing event (curor moves again while mouse is down)
    mdown_posx = e.x; 
    mdown_posy = e.y;
  }

  upperPanel.addEventListener('mousedown', function(e) {
    e.preventDefault(); //stop selection of text during mouse move / mouse down event 
    mdown_posx = e.x; //Initial mouse position saved on mousedown of div....only the border is exposed
    mdown_posy = e.y;
    isResizing.upperPanel=true;
    
  });

  editorPanel.addEventListener('mousedown', function(e) {
    e.preventDefault(); //stop selection of text during mouse move / mouse down event 
    mdown_posx = e.x; //Initial mouse position saved on mousedown of div....only the border is exposed
    mdown_posy = e.y;
    isResizing.editorPanel=true;
    
  });

  upperPanel.addEventListener('mousemove', function(e) {
    e.preventDefault(); //stop selection of text during mouse move / mouse down event 
    y_pos = e.y;
    // console.log(`ypos: ${y_pos}`);
    if (y_pos > parseInt(getComputedStyle(upperPanel).height) -20  && y_pos < parseInt(getComputedStyle(upperPanel).height) +20) {
      inResizeRange.upperPanel = true;
      e.target.style.cursor = 'row-resize'
    } else {
      inResizeRange.upperPanel = false;
      isResizing.upperPanel = false;
        if (inResizeRange.upperPanel === false && inResizeRange.editorPanel === false) {
        e.target.style.cursor = 'auto';
        }   
    }
    if (isResizing.upperPanel === true) {
      resize(e, upperPanel);
    }});

  editorPanel.addEventListener('mousemove', function(e) {
    e.preventDefault(); //stop selection of text during mouse move / mouse down event 
    x_pos = e.x;
    // console.log(`xpos: ${x_pos}`);
    if (x_pos > parseInt(getComputedStyle(editorPanel).width) + parseInt(getComputedStyle(fileDirPanel).width) -20  && x_pos < parseInt(getComputedStyle(editorPanel).width) + parseInt(getComputedStyle(fileDirPanel).width)+20) {
      inResizeRange.editorPanel = true;
      e.target.style.cursor = 'col-resize'
    } else {
      inResizeRange.editorPanel = false;
      if (inResizeRange.upperPanel === false && inResizeRange.editorPanel === false) {
        e.target.style.cursor = 'auto';
      }
        isResizing.editorPanel = false;
    }
    if (isResizing.editorPanel === true) {
      resize(e, editorPanel);
  }});

  //Including mouse leave events to avoid resizing stuck on leave and auto-resume on reentry
  upperPanel.addEventListener('mouseleave', function(e) {
    isResizing.upperPanel = false;
    isResizing.editorPanel = false;
    inResizeRange.upperPanel = false;
    inResizeRange.editorPanel = false;
  })

  editorPanel.addEventListener('mouseleave', function(e) {
    isResizing.upperPanel = false;
    isResizing.editorPanel = false;
    inResizeRange.upperPanel = false;
    inResizeRange.editorPanel = false;
  })


  // window.addEventListener('mouseup', function(e) {
  // console.log('MOUSE UP');
  // if (isResizing.upperPanel === true || isResizing.editorPanel === true) {
  //   isResizing.upperPanel = false;
  //   isResizing.editorPanel = false;
    
  // }
  // // isResizing.upperPanel = false;
  // // isResizing.editorPanel = false;
 
  // console.log('Svelte.app has mounted');

  // });
});


  //Testing code for window resize end
 

  const handleSubmit = () => {
    submit = false;
    return false;
  };

  const handleKeyup = (event) => {
    submit = false;

    if (event.code == "Enter") {
      event.preventDefault();
      event.target.value;
      value = event.target.value;
      localhost = `http://127.0.0.1:${value}/`;
      return false;
    }
  };


</script>

<body class:orientation>
  <main class="wrapper">
    <!-- <div class="box wrapper-upper" id="wrapper-upper" use:watchResize={handleLeftResize}> -->
    <div class="box wrapper-upper" id="wrapper-upper">
      <div class="box a target" id="file-dir">
        <FileDir />
      </div>
      <div class="box b" id="editor-window">
        <!-- svelte-ignore missing-declaration -->
        <div class="editor-wrapper">
          <Editor class="childClass" />
        </div>

      </div>
      <div class="box d root">
        <form class="render-wrapper" on:submit|preventDefault={handleSubmit}>
          <input
            placeholder="Local Host Port"
            type="text"
            on:keyup|preventDefault={handleKeyup}
          />
          {#if submit === true}
            <iframe class="webpage" title="local host" src={localhost} />
          {/if}
          <iframe class="webpage" title="local host" src={localhost} />
        </form>
      </div>
    </div>
    <div class="middle-separator" />
    <div class="box wrapper-bottom">
      <div class="box c root">
        <StateManager />
      </div>
      <div class="box e">
        <XTerm />
      </div>
    </div>
  </main>
</body>

<style>
  body {
    height: 100%;
    width: 100%;
  }
  /*2022-ST-RJ Restructured CSS to use flex rather than grid so dynamic window resizing works appropriately /*
  /* Wrapper Window - SvelteTeam */
  .wrapper {
    height: 100%;
    width: 100%;
    display: flex;
    flex-direction: column;
    background-color: rgb(39, 38, 38);
    color: #444;
  }

  .editor-wrapper {
    height: 100%;
    width: 100%;
    z-index: 1;
    /* display: flex;
    flex-direction: column;
    background-color: rgb(39, 38, 38);
    color: #444; */
  }

  .wrapper-upper {
    height: 65%;
    display: flex;
    flex-direction: row;
    width: 98%;
    resize: vertical;
    overflow: auto;
    background-color: rgb(39, 38, 38);
    color: #444;
    padding: 5px;
    z-index:0;
  }
  .wrapper-bottom {
    min-height: 10%;
    height: 35%;
    flex-grow: 1;
    display: flex;
    flex-direction: row;
    width: 98%;
    background-color: rgb(39, 38, 38);
    color: #444;
  }

  .render-wrapper {
    background-color: #252532;
    display: flex;
    flex-direction: column;
    height: 100%;
  }

  .middle-separator {
    padding: 2px;
  }

  .box {
    background-color: rgb(39, 38, 38);
    color: rgb(245, 242, 239);
    border-radius: 0px;
    /* padding: 5px; */
  }
  /* File Directory - SvelteTeam */
  .a {
    font-size: 10px;
    overflow: auto;
    resize: horizontal;
    width: 10%;
    min-width: 10%;
    max-width: 30%;
    background-color: rgba(28, 28, 36, 0.678);
    border-right: 1px solid #3d3d3d;
    border-bottom: 1px solid #3d3d3d;
  }

  /* Text Editor - SvelteTeam */
  .b {
    overflow: auto;
    width: 45%;
    resize: horizontal;
    background-color: rgba(35, 35, 65, 0.452);
    border-bottom: 1px solid #3d3d3d;
    border-right: 1px solid #3d3d3d;
    padding-right: 5px;
  }
  /* State Management Window - SvelteTeam */
  .c {
    overflow: auto;
    width: 10%;
    min-width: 10%;
    background-color: rgba(28, 28, 36, 0.678);
    border-right: 1px solid #3d3d3d;
    padding: 0;
  }

  /* Browser Render Window - SvelteTeam */
  .d {
    min-width: 30%;
    flex-direction: column;
    flex-grow: 1; /*Let render window take up remaining space in the flexbox */
    padding: 0px;
    text-align: center;
    background-color: rgba(35, 35, 65, 0.452);
    border-bottom: 1px solid #3d3d3d;
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
    width: 100%;
    background-color: rgba(35, 35, 65, 0.452);
  }

  /* Webpage Render - SvelteTeam */
  .webpage {
    overflow: auto;
    /* resize: vertical; */
    height: 98%;
    width: 98%;
  }

  .b :global(.childClass) {
    overflow: scroll;
    display: flex;
  }

  iframe:focus {
    outline: none;
  }
</style>
