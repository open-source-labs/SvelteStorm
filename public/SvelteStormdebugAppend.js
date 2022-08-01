/*
* =========================================================
*   The following is SvelteStorm 4.0 Debug Monitoring Code.
* =========================================================
*/

// once the TIME_TRAVEL message is recieved, then loop through cache state and inject the specified state into each component

ipcRenderer.on('TIME_TRAVEL', (event, data) => {
  if (data.message === 'TIME_TRAVEL') {
      const i = data.ctxIndex;
      lastIndex = i;
      console.log("TIME_TRAVEL =======================");
      if (cacheState[i]) {
        cacheState[i].forEach((componentState) => {
          console.log("componentState:", componentState);
          componentState[0].$inject_state(componentState[1]);
        });
      }
    }
})

/*
* =========================================================
*   The Above is SvelteStorm 4.0 Debug Monitoring Code.
* =========================================================
*/