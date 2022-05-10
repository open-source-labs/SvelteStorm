<script>
  import FileDir from "./Directory/FileDir.svelte";
  import XTerm from "./XTerm.svelte";
  import Editor from "./CodeEditor/Editor.svelte";
  import StateManager from "./StateManager/StateManager.svelte";
  export let orientation = "columns";
  export let localhost;

  let value = "";
  let submit = false;

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
    <div class="box a target">
      <FileDir />
    </div>
    <div class="box b">
      <!-- svelte-ignore missing-declaration -->
      <Editor class="childClass" />
    </div>
    <div class="box c root">
      <StateManager />
    </div>
    <div class="box d root">
      <form on:submit|preventDefault={handleSubmit}>
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

    <div class="box e">
      <XTerm />
    </div>
  </main>
</body>

<style>
  body {
    height: 100%;
    width: 100%;
  }
  /* Wrapper Window - SvelteTeam */
  .wrapper {
    height: 100%;
    display: grid;
    grid-template-columns: min-content;
    grid-template-rows: 1fr;
    background-color: rgb(39, 38, 38);
    color: #444;
  }

  .box {
    background-color: rgb(39, 38, 38);
    color: rgb(245, 242, 239);
    border-radius: 0px;
    padding: 10px;
  }
  /* File Directory - SvelteTeam */
  .a {
    font-size: 10px;
    overflow: auto;
    resize: horizontal;
    min-width: 10%;
    max-width: 150%;
    min-height: 10%;
    max-height: 150%;
    grid-column: 1;
    grid-row: 1;
    padding: 0;
    background-color: rgba(28, 28, 36, 0.678);
    border-right: 1px solid #3d3d3d;
    border-bottom: 1px solid #3d3d3d;
  }
  
  /* Text Editor - SvelteTeam */
  .b {
  
      /* RJ Setting overflow to auto from scroll so resize handlers show - SvelteTeam */
      /* overflow: scroll; */
      overflow: auto;
      /* RJ Adding resize property for text editor so resize handlers show - SvelteTeam */
      resize: both;
    /* min-width: 10%; */
      /* RJ Adjusting min-width to 30% - SvelteTeam */
    min-width: 30%;
    max-width: 150%;
    min-height: 10%;
    max-height: 150%;
    grid-column: 2;
    grid-row: 1;
    background-color: rgba(35, 35, 65, 0.452);
    border-bottom: 1px solid #3d3d3d;
    border-right: 1px solid #3d3d3d;
  }
    /* State Management Window - SvelteTeam */
  .c {
    overflow: auto;
    min-width: 10%;
    max-width: 150%;
    min-height: 10%;
    max-height: 150%;
    grid-column: 1;
    grid-row: 2;
    background-color: rgba(28, 28, 36, 0.678);
    border-right: 1px solid #3d3d3d;
    padding: 0;
  }

    /* Browser Render Window - SvelteTeam */
  .d {
    overflow: auto;
    resize: vertical; /*RJ added to resize renderer window vertically */
    min-width: 10%;
    min-height: 10%;
    max-height: 150%;
    padding: 0px;
    text-align: center;
    grid-column: 3;
    grid-row: 1;
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
    min-width: 300%;
    min-height: 100%;
    grid-column: 2 / 5;
    grid-row: 2;
    background-color: rgba(35, 35, 65, 0.452);
  }

    /* Webpage Render - SvelteTeam */
    .webpage {
    overflow: auto;
    resize: vertical;
    min-width: 10%;
    min-height: 10%;
    max-height: 150%;
    padding: 0px;
    grid-row: 1;
    height: 500px;
    width: 95%;
  }

  .b :global(.childClass) {
    overflow: scroll;
    display: flex;
    height: 100%;
    width: 100%;
  }

  iframe:focus {
    outline: none;
  }
</style>
