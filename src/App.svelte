<script>
    import Monaco from './components/monaco/monaco-editor.svelte';
    import SplitPane from './SplitPlane.svelte';
    import FileDir from './Directory/FileDir.svelte'
    const {ipcRenderer} = require('electron');

    export let name;
    export let orientation = 'columns';
    export let fixed = false;
    export let fixedPos = 50;
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
    grid-template-columns: repeat(3, 1fr);
    grid-template-columns: repeat(3, 1fr);
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
    grid-column: 1 / 2;
    grid-row: 1 / 3;
  }
  .b {
    grid-column: 2 / 4 ;
    grid-row: 1 / 3;
  }
  .c {
    grid-column: 1 / 2 ;
    grid-row: 3 ;
  }

  .d {
    grid-column: 4 / 5;
    grid-row: 1 / 3;
  }
  .e {
    grid-column: 2 / 5;
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
            <div>
                <div>
                    <h1>Hello {name}!</h1>
                </div>
            </div>
        </div>
        <div class="box e"> 
            <div>
                <h1>Terminal</h1>
            </div>
        </div>
    </main>
    </body>
  
