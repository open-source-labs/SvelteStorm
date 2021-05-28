<script>
    import FileDir from './Directory/FileDir.svelte'
    import NewTabs from './MonacoComponents/Tabs/NewTabs.svelte';
    import XTerm from './XTerm.svelte';
    
    export let orientation = 'columns';
  
    let localhost = "http://localhost:5000/"
    let refreshed = false

    const { remote, ipcRenderer } = require('electron');
  
    function onClick() {
      refreshed = true
      localhost = "http://localhost:5000/"
    }


  onMount(() => {

      

       console.log('the component has mounted');
       term.setOption('cursorStyle', 'block');
       term.setOption('cursorBlink', true);
       term.setOption('fontSize', 14);
       
       term.loadAddon(fitAddon);
        term.open(document.getElementById('xterm'));
        fitAddon.fit();

        term.write('\x1b[32mWelcome to Svelte Storm!\x1b[m\r\n');

        term.onData(e => {
            ipcRenderer.send("terminal-into", e);
        });

        ipcRenderer.on('terminal-incData', (event, data) => {
            term.write(data);
        })
    });

  </script>
  
  <style>
  
  body {
    height: 100vh;
    width: 100vw;
  }

  .wrapper {
      height: 100%;
      display: grid;
      grid-gap: 1px;
      grid-template-columns: repeat(5, 1fr);
      grid-template-rows: repeat(5, 1fr);
      background-color: #fff;
      color: #444;
  }
  
  .box {
    background-color: rgb(233, 217, 186);
    color: rgb(226, 142, 45);
    border-radius: 5px;
    padding: 10px;
    font-size: 150%;
  }

  .a {
    grid-column: 1 ;
    grid-row: 1 / 5;
  }
  
  .b {
    overflow: scroll;
    grid-column: 2 / 4 ;
    grid-row: 1 / 5;
  }

  .c {
    grid-column: 1 / 3 ;
    grid-row: 5 ;
  }
  
  .d {
    grid-column: 4 / 6;
    grid-row: 1 / 5;
  }
  
  .e {
    grid-column: 3 / 6;
    grid-row: 5;
  }
  
  .webpage {
    height: 100%;
    width: 100%;
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

  <body class:orientation>
  <main class="wrapper" >
      <div class="box a target">
          <FileDir />
      </div>
      <div class="box b">
          <NewTabs class="childClass" {tabs} />
      </div>
      <div class="box c root">
          <h1>State Manager</h1>
      </div>
      <div on:click={onClick}  class="box d root"> 
        {#if refreshed}
        <iframe class="webpage" title="local host" src={localhost}></iframe>
        {:else}
        <iframe class="webpage" title="local host" src={localhost}></iframe>
        {/if}
        </div>
      <div class="box e" > 
          <XTerm />
      </div>

  </main>
  </body>

