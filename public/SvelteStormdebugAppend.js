/*
* =========================================================
*   The following is SvelteStorm 4.0 Debug Monitoring Code.
* =========================================================
*/

/* once the TIME_TRAVEL message is received, 
then loop through cache state and inject the specified 
state into each component. */

ipcRenderer.on('TIME_TRAVEL', (event, data) => {
  if (data.message === 'TIME_TRAVEL') {
      const i = data.ctxIndex;
      lastIndex = i;
      if (cacheState[i]) {
        cacheState[i].forEach((componentState) => {
          componentState[0].$inject_state(componentState[1]);
        });
      }
    }
})

// once the REFRESH message is received, reset cache state to the initial state

ipcRenderer.on('REFRESH', (event, data) => {
  if (data.message === 'REFRESH') {
      const i = 0;
      lastIndex = i;
      components = [];
      compComponents = [];
      compCTX = [];

      cacheState = cacheState.slice(0, 1);

      if (cacheState[i]) {
        cacheState[i].forEach((componentState) => {
          componentState[0].$inject_state(componentState[1]);

          // rebuild components, compComponents, and compCTX
          const currentComponent = componentState[0];
          let strippedCTX = parse(currentComponent.$$.ctx);
          const stringifiedEventComp = JSON.stringify(currentComponent);
          strippedCTX = strippedCTX.filter((element) => !Array.isArray(element));
          compComponents.push(stringifiedEventComp);
          components.push(currentComponent);
          compCTX.push(JSON.stringify(strippedCTX));
        });
      }
    }
})

/*
* =========================================================
*   The Above is SvelteStorm 4.0 Debug Monitoring Code.
* =========================================================
*/