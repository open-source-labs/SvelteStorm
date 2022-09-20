<script lang="ts">
  import {onMount} from 'svelte';
  import {FitAddon} from 'xterm-addon-fit';
  import { appBeingDebugedPath, saveToFileName } from '../DataStore/SvelteStormDataStore';
  import moment from 'moment';
  const path = require('path');

  // const mainProcess = require('./index');
  import './xterm.css';

  // import { Terminal } from 'xterm';
  const {ipcRenderer, BrowserWindow} = require('electron');
  const Terminal = require('xterm').Terminal;

  const regex = /localhost:(\d{4,}$)/gm;
  let localhostToUse;

  function findLocalhost(ptyReceivedString) {
    let m;

    while ((m = regex.exec(ptyReceivedString)) !== null) {
      // This is necessary to avoid infinite loops with zero-width matches
      if (m.index === regex.lastIndex) {
        regex.lastIndex++;
      }

      // The result can be accessed through the `m`-variable.
      if(!$saveToFileName){
      m.forEach((match, groupIndex) => {

          localhostToUse = match;
          const pjson = require(`${$appBeingDebugedPath}/package.json`);

          // Format date string for file name
          let filename = `Snaps_${pjson.name}_${pjson.version}_${moment().format(
            'YYYY-MM-DD_HH-mm-ss'
          )}.snaps`;

          // Set the name of the file in which we will store our states for THIS debug session.
          $saveToFileName = path.resolve(__dirname, `./CapturedSnaps/${filename}`);
          // ipcRenderer.send('openDebugAppWindow', localhostToUse);
        });
      }
      ipcRenderer.send('openDebugAppWindow', localhostToUse);
    }
  }

  const fitAddon = new FitAddon();
  const term = new Terminal({
    fontFamily: 'Fira Code, courier-new, courier, monospace',
    scrollback: 1000,
    allowProposedApi: true,
    rightClickSelectsWord: true,
    lineHeight: 1,
  });

  const fitOnTheGo = (): void => {
    fitAddon.fit();
  };

  onMount(() => {
    term.options.cursorStyle = 'block';
    term.options.cursorBlink = true;
    term.options.fontSize = 12;

    term.loadAddon(fitAddon);
    term.open(document.getElementById('xterm'));
    fitAddon.fit();

    //2022-ST-AJ prompt appears after welcome message
    //2022-ST-AJ immediately call resize to have proper prompt in, and have node-pty adjust to correct size.

    term.prompt = () => {
      ipcRenderer.send('terminal-into', '\r');
    };

    term.writeln('Welcome to SvelteStorm 5.0');
    // ipcRenderer.send("terminal-into", "ls -ila\r");

    term.prompt();
    term.focus();

    term.onData((e) => {
      ipcRenderer.send('terminal-into', e);
    });

    term.onResize((size) => {
      ipcRenderer.send('terminal-resize', size);
    });

    ipcRenderer.on('terminal-incData', (event, data) => {
      term.write(data);
      findLocalhost(data);
    });
  });

  //2022-ST-AJ listens to resize event and invokes fitAddOn on the go. Otherwise terminal will not resize.
  window.addEventListener('resize', fitOnTheGo);
</script>

<main>
  <div id="xterm" />
</main>