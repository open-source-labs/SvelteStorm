<script>
  import FileDir from "./Directory/FileDir.svelte";
  import XTerm from "./XTerm.svelte";
  import Editor from "./CodeEditor/Editor.svelte";
  import StateManager from "./StateManager/StateManager.svelte";
  // import DocsBool from "src/index.js";
  export let orientation = "columns";
  export let localhost;
  export let docsBool = false;
  let value = "";
  let submit = false;
  let documentation = "https://svelte.dev/docs#";

  const handleSubmit = () => {
    submit = false;
    return false;
  };
  const handleDocuments = () => {
    // submit = false;
    docsBool = !docsBool;
    // return false;
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
  const handleKeyup2 = (event) => {
    submit = false;

    if (event.code == "Enter") {
      event.preventDefault();
      event.target.value;
      value = event.target.value;
      console.log("this is the handlekey2 event", event);
      documentation = `https://svelte.dev/docs#"${value}/`;
      documentation = documentation;
      return false;
    }
  };
</script>

<body class:orientation>
  <main class="wrapper">
    <div class="box wrapper-upper">
      <div class="box a target">
        <FileDir />
      </div>
      <div class="box b">
        <!-- svelte-ignore missing-declaration -->
        <Editor class="childClass" />
      </div>
      <div class="box d root">
        <form class="render-wrapper" on:submit|preventDefault={handleSubmit}>
          {#if docsBool === true}
            <input
              placeholder="Search Documentation"
              type="text"
              on:keyup={handleKeyup2}
            />
            <button on:click={handleKeyup2}>Search</button>
            <iframe class="docs" title="test" src={documentation} />
          {/if}
          {#if docsBool === false}
            <input
              placeholder="Local Host Port"
              type="text"
              on:keyup|preventDefault={handleKeyup}
            />
            {#if submit === true && docsBool === false}
              <iframe class="webpage" title="local host" src={localhost} />
            {/if}

            <iframe class="webpage" title="local host" src={localhost} />
          {/if}
          <button on:click={handleDocuments}>Documentation</button>
        </form>
      </div>
      <div />
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

  .wrapper-upper {
    height: 65%;
    display: flex;
    flex-direction: row;
    width: 98%;
    resize: vertical;
    overflow: auto;
    background-color: rgb(39, 38, 38);
    color: #444;
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
    padding: 0;
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
    height: 100%;
    width: 98%;
  }
  .docs {
    overflow: auto;
    /* resize: vertical; */
    height: 100%;
    width: 98%;
    color: "grey";
  }

  .b :global(.childClass) {
    overflow: scroll;
    display: flex;
  }

  iframe:focus {
    outline: none;
  }
</style>
