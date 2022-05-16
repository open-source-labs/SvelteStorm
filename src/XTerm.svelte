<script>
    import { onMount } from "svelte";
    import { FitAddon } from "xterm-addon-fit";
    import "./xterm.css";
    const { remote, ipcRenderer, BrowserWindow } = require("electron");
    const Terminal = require("xterm").Terminal;

    const fitAddon = new FitAddon();
    const term = new Terminal({ convertEol: true });

    const fitOnTheGo = () => {
        fitAddon.fit();
    };

    onMount(() => {
        term.options.cursorStyle = "block";
        term.options.cursorBlink = true;
        term.options.fontSize = 14;

        term.loadAddon(fitAddon);
        term.open(document.getElementById("xterm"));
        fitAddon.fit();

        //2022-ST-AJ prompt appears after welcome message
        term.prompt = () => {
            term.write("\r\n$ ");
        };

        term.writeln("Welcome to SvelteStorm");
        term.write("\b \b");

        term.prompt();

        term.onData((e) => {
            ipcRenderer.send("terminal-into", e);
        });

        ipcRenderer.on("terminal-incData", (event, data) => {
            term.write(data);
        });
    });

    //2022-ST-AJ listens to resize event and invokes fitAddOn on the go. Otherwise terminal will not resize.
    window.addEventListener("resize", fitOnTheGo);
    //TODO: refactor xterm options for resizing/text wrapping
</script>

<div id="xterm" />
