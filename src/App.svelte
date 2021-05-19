<script>
    //import Monaco from './components/monaco/monaco-editor.svelte';
    import FileDir from './Directory/FileDir.svelte'
    import Monaco from './Monaco.svelte'
    import { FitAddon } from 'xterm-addon-fit'
    import { onMount } from 'svelte';
    import './xterm.css';
    import DirectoryData from './Utilities/DirectoryStore';
    const fs = require('fs');

    const {ipcRenderer} = require('electron');
    const Terminal = require('xterm').Terminal

    const fitAddon = new FitAddon();
    const term = new Terminal({cursorBlink: true});
    let counter =0;

  export let orientation = 'columns';
  export let monacoValue;


    let readData = '';
    const unsub = DirectoryData.subscribe(data =>{
        console.log('File Directory Store Subscription');
        console.log('data here',data)
        if(data.fileRead){
          readData = fs.readFileSync(data.openFilePath).toString();
          monacoValue = readData.split(/\r?\n/);
          console.log(readData);
          counter++;
        }
    });



    onMount(() => {
		console.log('the component has mounted');
        term.loadAddon(fitAddon);
        term.open(document.getElementById('xterm'));
        fitAddon.fit();
        term.onData(e => {
            ipcRenderer.send("terminal-into", e);
        } );
        ipcRenderer.on('terminal-incData', (event, data) => {
            term.write(data);
        })
    });

    ipcRenderer.on('file-opened', function (evt, file, content) {
        monacoValue = content.split(/\r?\n/);
        counter++;
    });


    
    
  

</script>

<style>
body {
  height: 50vh;
  width: 100vw;
}
.wrapper {
    height: 100%;
    display: grid;
    grid-gap: 10px;
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

  <body  class:orientation>
  <main class="wrapper" >
      <div class="box a">
          <FileDir />
      </div>
      <div class="box b">
        {#if monacoValue}
          <Monaco bind:value={monacoValue}/>
        {:else}
            <Monaco value={[]}/>
        {/if}
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

