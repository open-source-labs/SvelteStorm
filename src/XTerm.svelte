<script>
    import { onMount } from 'svelte';
    import { FitAddon } from 'xterm-addon-fit'
    import './xterm.css';
    const { remote, ipcRenderer } = require('electron');
    const Terminal = require('xterm').Terminal

    const fitAddon = new FitAddon();
    const term = new Terminal();

    onMount(() => {
        // term.setOption('cursorStyle', 'block');
        // term.setOption('cursorBlink', true);
        // term.setOption('fontSize', 14);

        term.options.cursorStyle = 'block';
        term.options.cursorBlink = true;
        term.options.fontSize = 14;

        term.loadAddon(fitAddon);
        term.open(document.getElementById('xterm'));
        fitAddon.fit();

        term.write('\x1b[32mWelcome to Svelte Storm!\x1b[m\r\n');

        term.onData(e => {
            ipcRenderer.send("terminal-into", e);
        });
        
        ipcRenderer.on('terminal-incData', (event, data) => {
            term.write(data);
        });
    });

</script>

<div id="xterm">

</div>