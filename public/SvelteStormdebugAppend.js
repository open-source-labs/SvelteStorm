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
      cacheState = JSON.parse(cacheState);
      if (cacheState[i]) {
        cacheState[i].forEach((componentState) => {
          componentState[0].$inject_state(componentState[1]);
        });
      }
      cacheState = JSON.stringify(cacheState);
    }
})

/*
* =========================================================
*   The Above is SvelteStorm 4.0 Debug Monitoring Code.
* =========================================================
*/