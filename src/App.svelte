<script>
    import FileDir from './Directory/FileDir.svelte'
    import Monaco from './MonacoComponents/Monaco.svelte'
    import { FitAddon } from 'xterm-addon-fit'
    import { afterUpdate, onMount } from 'svelte';
    import './xterm.css';
    import DirectoryData from './Utilities/DirectoryStore';
    import { Tabs, TabList, TabPanel, Tab } from './MonacoComponents/Tabs/tabs';
    const fs = require('fs');

    const {ipcRenderer} = require('electron');
    const Terminal = require('xterm').Terminal

    const fitAddon = new FitAddon();
    const term = new Terminal();
    let counter = 0;

    export let orientation = 'columns';
    export let monacoValue = [];
    export let monacoLang = 'html';
    let fileName;

    let readData = '';
    const unsub = DirectoryData.subscribe(data =>{
        if(data.fileRead){
          readData = fs.readFileSync(data.openFilePath).toString();
          monacoValue = readData.split(/\r?\n/);
          monacoLang = data.openFilePath.split('.').pop();
          counter++;
        }
    });

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
        } );
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

  iframe:focus {
    outline: none;
  }
  
  
</style>

  <body class:orientation>
  <main class="wrapper" >
      <div class="box a">
          <FileDir />
      </div>
      <div class="box b">
        <Tabs class="tabs">
          <TabList>
            <Tab>{monacoLang}</Tab>
            <!-- <Tab>two</Tab>
            <Tab>three</Tab> -->
          </TabList>
        
          <TabPanel>
            <Monaco bind:value={monacoValue} bind:language={monacoLang} />
          </TabPanel>
        
          <!-- <TabPanel>
            <h2>Second panel</h2>
          </TabPanel>
        
          <TabPanel>
            <h2>Third panel</h2>
          </TabPanel> -->
        
        </Tabs>
        <!-- {#if monacoValue} -->
          <!-- <Monaco bind:value={monacoValue} bind:language={monacoLang} /> -->
        <!-- {:else}
            <Monaco value={[]}/>
        {/if} -->
        </div>
      <div class="box c">
          <h1>State Manager</h1>
      </div>
      <div class="box d"> 
          <iframe class="webpage" title="local host" src="http://localhost:5000/"></iframe>
      </div>
      <div class="box e" > 
          <div id="xterm">
              
          </div>
      </div>
  </main>
  </body>

