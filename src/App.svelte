<script>
    import Monaco from './components/monaco/monaco-editor.svelte';
    import SplitPane from './SplitPlane.svelte';
    import FileDir from './Directory/FileDir.svelte';
    const {ipcRenderer} = window.require('electron'); 

    export let name;
    export let orientation = 'columns';
    export let fixed = false;
    export let fixedPos = 50;
    export let monacoValue = '';
    export let monacoLanguage = '';

    const onClick = () => { ipcRenderer.invoke('getFileFromUser',).then(() => {

    ipcRenderer.on('file-opened', (event, file, content) => {
         monacoLanguage = file.split('.').pop();
         monacoValue = content.split(/\r?\n/);
         console.log(monacoValue);

        })
    })}

    let monaco;
    window['monaco'] = monaco;

    name = "World";
  
  </script>

<style>

    main {
        text-align: center;
        padding: 1em;
        max-width: 240px;
        margin: 0 auto;
        height: 100%;
    }

    h1 {
        color: #ff3e00;
        text-transform: uppercase;
        font-size: 4em;
        font-weight: 100;
    }
    @media (min-width: 640px) {
        main {
            max-width: none;
        }
    }
    .container {
      position: relative;
      width: 100%;
      height: 100%;
  }

  .container section {
      position: relative;
      padding: 42px 0 0 0;
      height: 100%;
      box-sizing: border-box;
  }

  .container section > :global(*):first-child {
      position: absolute;
      top: 0;
      left: 0;
      width: 100%;
      height: 100%;
      box-sizing: border-box;
  }

  .container section > :global(*):last-child {
      width: 100%;
      height: 100%;
  } 

  .directory {
      height: 100vh;
      width: 100%;
      min-width: 300px;
      /* border: 1px solid black */
  }
</style>






    <body class="container" class:orientation>
        <main>
        <button on:click={onClick}>Get File</button> 
        <SplitPane
		type="{orientation === 'rows' ? 'vertical' : 'horizontal'}"
		pos="{fixed ? fixedPos : orientation === 'rows' ? 50 : 60}"
		{fixed}
	>
   
    <section slot=a>
        {#if monacoValue !== ''}
            <Monaco bind:this={monaco} value={monacoValue} language={monacoLanguage} />
        {:else}
            <p>Get A File</p>
        {/if}
    </section>
    <section  slot=b style='height: 100%;'> 
        <div>
            <div>
                <h1>Hello {name}!</h1>
            </div>
        </div>
    </section>
    <section slot=c style='height: 100%;'>
        <div class="directory">
        <FileDir />
       </div>
    </section>
	</SplitPane>
</main>
</body>
  
