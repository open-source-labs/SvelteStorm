<script lang="ts">
    import { onMount } from "svelte";
    import { FitAddon } from "xterm-addon-fit";
    import "./xterm.css";

    const { ipcRenderer, BrowserWindow } = require("electron");
    const Terminal = require("xterm").Terminal;

    const fitAddon = new FitAddon();
    const term = new Terminal({
        fontFamily: "Fira Code, courier-new, courier, monospace",
    });

    const fitOnTheGo = (): void => {
        fitAddon.fit();
    };

    onMount(() => {
        term.options.cursorStyle = "block";
        term.options.cursorBlink = true;
        term.options.fontSize = 12;

        term.loadAddon(fitAddon);
        term.open(document.getElementById("xterm"));
        fitAddon.fit();

        //2022-ST-AJ prompt appears after welcome message
        //2022-ST-AJ immediately call resize to have proper prompt in, and have node-pty adjust to correct size.

        term.prompt = () => {

            ipcRenderer.send("terminal-into", "\r");
        };

        term.writeln("Welcome to SvelteStorm 4.0");
        // term.writeln("\b \b");

        term.prompt();
        term.focus();

        term.onData((e) => {
            ipcRenderer.send("terminal-into", e);
        });

        term.onResize((size) => {
            // console.log("terminal resized. size:", size);
            ipcRenderer.send("terminal-resize", size);
        });

        ipcRenderer.on("terminal-incData", (event, data) => {
            console.log(data);
            term.write(data);
        });


    });

    //2022-ST-AJ listens to resize event and invokes fitAddOn on the go. Otherwise terminal will not resize.
    window.addEventListener("resize", fitOnTheGo);

</script>

<div id="xterm" />
