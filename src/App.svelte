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
  /* Wrapper Window - SvelteTeam */
  .wrapper {
    height: 100%;
    display: flex;
    flex-direction: column;
    width: 100%;
    /* flex-wrap: wrap; */
    /* grid-template-areas: "a b b b b b b"
                         "c e e e e e e"; */
    /* grid-template-areas: "a a a a a a a"
                         "b b b b b b b"; */
    /* grid-template-columns: min-content; */
    /* grid-template-rows: 1fr; */
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
    /* grid-template-columns: min-content; */
    grid-template-rows: 1fr;
    background-color: rgb(39, 38, 38);
    color: #444;
    grid-area: a;
  }
  .wrapper-bottom {
    min-height: 10%;
    /* max-height: 35%; */
    height: 35%;
    flex-grow: 1;
    display: flex;
    /* flex: 1 1 auto; */
    flex-direction: row;
    width: 98%;
    /* grid-template-columns: min-content; */
    grid-template-rows: 1fr;
    background-color: rgb(39, 38, 38);
    color: #444;
    grid-area: b;
  }

  .render-wrapper {
    background-color: blue;
    display:flex;
    flex-direction:column;
    height: 100%;
  }
  /* .render-frame {
    background-color: red;
    display:flex;
    flex-direction:column;
    height: 100%;
  } */
  .box {
    background-color: rgb(39, 38, 38);
    color: rgb(245, 242, 239);
    border-radius: 0px;
    padding: 5px;
  }
  /* File Directory - SvelteTeam */
  .a {
    font-size: 10px;
    overflow: auto;
    resize: horizontal;
    width:10%;
    min-width:10%;
    /* min-width: 10%;
    max-width: 150%;
    min-height: 10%;
    max-height: 150%; */
    /* grid-column: 1; */
    /* grid-row: 1; */
    padding: 0;
    background-color: rgba(28, 28, 36, 0.678);
    border-right: 1px solid #3d3d3d;
    border-bottom: 1px solid #3d3d3d;
    grid-area: a;
  }
  
  /* Text Editor - SvelteTeam */
  .b {
  
      /* RJ Setting overflow to auto from scroll so resize handlers show - SvelteTeam */
      /* overflow: scroll; */
      overflow: auto;
      width:45%;
      /* min-width: 500px; */
      /* max-width: 50vw; */
      /* min-width: 10%; */
      
      /* width:90%; */
      /* RJ Adding resize property for text editor so resize handlers show - SvelteTeam */
      resize: horizontal;
      grid-template-columns: 3fr;
    /* min-width: 10%; */
      /* RJ Adjusting min-width to 30% - SvelteTeam */
    /* min-width: 30%;
    max-width: 150%;
    min-height: 10%;
    max-height: 150%; */
    /* grid-column: 2; */
    /* grid-row: 1; */
    background-color: rgba(35, 35, 65, 0.452);
    border-bottom: 1px solid #3d3d3d;
    border-right: 1px solid #3d3d3d;
    /* grid-area: b; */
  }
    /* State Management Window - SvelteTeam */
  .c {
    overflow: auto;
    width:10%;
    min-width:10%;
    /* min-width: 10%; */
    /* max-width: 150%; */
    /* min-height: 10%; */
    /* max-height: 150%; */
    /* grid-column: 1;
    grid-row: 2; */
    /* resize: both; */
    /* width:10%; */
    background-color: rgba(28, 28, 36, 0.678);
    border-right: 1px solid #3d3d3d;
    padding: 0;
    /* grid-area: c; */
  }

    /* Browser Render Window - SvelteTeam */
  .d {
    /* overflow: auto; */
    /* resize: both; RJ added to resize renderer window vertically */
    /* min-width: 10%;
    min-height: 10%;
    max-height: 150%; */
    flex-direction: column;
    flex-grow: 1; /*Let render window take up remaining space in the flexbox */
    /* width:45%; */
    padding: 0px;
    text-align: center;
    /* grid-column: 3;
    grid-row: 1; */
    background-color: rgba(35, 35, 65, 0.452);
    border-bottom: 1px solid #3d3d3d;

    /* grid-area: d; */
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
    /* min-width: 300%; */
    /* min-height: 100%; */
    /* grid-column: 2 / 5;
    grid-row: 2; */
    display: flex;
    flex-direction: column;
    background-color: rgba(35, 35, 65, 0.452);
    grid-area: e;
  }

      /* Webpage Render - SvelteTeam */
    .webpage {
    overflow: auto;
    resize: vertical;
    height: 100%;
    width: 100%;
    /* min-width: 10%;
    min-height: 10%;
    max-height: 150%; */
    /* padding: 0px;
    grid-row: 1;
    height: 500px;
    width: 95%; */
  }

  .b :global(.childClass) {
    overflow: scroll;
    display: flex;
    /* height: 100%;
    width: 100%; */
  }

  iframe:focus {
    outline: none;
  }
</style>
