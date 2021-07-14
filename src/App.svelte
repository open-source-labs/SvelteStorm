<script>
    import FileDir from './Directory/FileDir.svelte'
    import XTerm from './XTerm.svelte';
    import Editor from './MonacoComponents/Editor.svelte';
    import StateManager from './StateManager/StateManager.svelte'
    export let orientation = 'columns';
    export let localhost;

    let value = ""
	  let submit = false
  
	
	const handleSubmit = () => {
		submit = false
    return false
	}
	
	const handleKeyup = () => {
		submit = false
		
		if (event.code == 'Enter') {
			event.preventDefault()
			event.target.value
			value = event.target.value
      localhost = `http://127.0.0.1:${value}/`
			return false
		}
	}

  </script>
  
  <style>
  
  body {
    height: 100%;
    width: 100%;
  }

  .wrapper {
      height: 100%;
      display: grid;
      border: 1px solid rgb(228, 81, 13);
      grid-template-columns: min-content;
      grid-template-rows: 1fr;
      background-color: rgb(39, 38, 38);
      color: #444;
  }
  
  .box {
    background-color: rgb(39, 38, 38);
    border: 1px solid rgb(228, 81, 13);
    color: rgb(226, 142, 45);
    border-radius: 0px;
    padding: 10px;
    font-size: 150%;
  }

  .a {
    overflow: auto;
    resize: horizontal;
    min-width: 15%;
    max-width: 150%;
    min-height: 10%;
    max-height: 150%;
    grid-column: 1 ;
    grid-row: 1;
  }
  
  .b {
    overflow: scroll;
    min-width: 10%;
    max-width: 150%;
    min-height: 10%;
    max-height: 150%;
    grid-column: 2;
    grid-row: 1;
  }

  .c {
    overflow: auto;
    min-width: 10%;
    max-width: 150%;
    min-height: 10%;
    max-height: 150%;
    grid-column: 1 ;
    grid-row: 2 ;
  }
  
  .d {
    overflow: auto;
    resize: vertical;
    min-width: 10%;
    min-height: 10%;
    max-height: 150%;
    padding: 0px;
    text-align: center;
    grid-column: 3;
    grid-row: 1;
  }

  .d input {
    margin: auto;
    margin-top: 0;
    margin-bottom: 0;
    height: 20px;
    font-size: 15px;
  }
  
  .e {
    overflow: auto;
    min-width: 10%;
    max-width: 150%;
    min-height: 100%;
    grid-column: 2 / 4;
    grid-row: 2;
  }
  
  .webpage {
    height: 90%;
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
  <body class:orientation>
  <main class="wrapper" >
    
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
          <input placeholder="Local Host Port" type="text" on:keyup|preventDefault={handleKeyup}>
        </form>
        {#if submit === true} 
          <iframe  class="webpage" title="local host" src={localhost}></iframe>
        {/if}
          <iframe  class="webpage" title="local host" src={localhost}></iframe>
        </div>
      <div class="box e"> 
          <XTerm />
      </div>

  </main>
  </body>



