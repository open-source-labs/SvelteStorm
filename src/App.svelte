<script>
    import Monaco from './components/monaco/monaco-editor.svelte';
    import FileDir from './Directory/FileDir.svelte'
    import { onMount } from 'svelte';
    import './xterm.css'
    const {ipcRenderer} = require('electron');
    const Terminal = require('xterm').Terminal
    import { FitAddon } from 'xterm-addon-fit'
    const fitAddon = new FitAddon();
    const term = new Terminal({cursorBlink: true});
    onMount(() => {
		console.log('the component has mounted');
		 // get dom element by id
		//intervals functions
        // Open the terminal in #terminal-container
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

    export let name;
    export let orientation = 'columns';
    export let monacoValue = ''
    export let monacoLanguage = ''

    ipcRenderer.on('file-opened', function (evt, file, content) {
        monacoValue = content.split(/\r?\n/);
    });

    let monaco;
    window['monaco'] = monaco;

    name = "World"
  
  </script>

<style>
body {
  height: 100%;
  width: 100%
}
.wrapper {
    height: 100%;
    display: grid;
    grid-gap: 10px;
    grid-template-columns: repeat(5, 1fr);
    grid-template-rows: repeat(3, 1fr);
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
    grid-row: 1 / 3;
  }
  .b {
    grid-column: 2 / 4 ;
    grid-row: 1 / 3;
  }
  .c {
    grid-column: 1 / 3 ;
    grid-row: 3 ;
  }

  .d {
    grid-column: 4 / 6;
    grid-row: 1 / 3;
  }
  .e {
    grid-column: 3 / 6;
    grid-row: 3;
  }
</style>

    <body  class:orientation>
    <main class="wrapper" >
        <div class="box a">
            <FileDir />
        </div>
        <div class="box b">
            {#if monacoValue !== ''}
            <Monaco bind:this={monaco} value={monacoValue} language={monacoLanguage} />
            {:else}
                <p>Get A File</p>
            {/if}
        </div>
        <div class="box c">
            <h1>State Manager</h1>
        </div>
        <div class="box d"> 
            <webview src="http://localhost:3000/" nodeintegration></webview>
        </div>
        <div class="box e" > 
            <div id="xterm">
                
            </div>
        </div>
    </main>
    </body>
  
