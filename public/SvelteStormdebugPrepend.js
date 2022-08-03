/*
* =========================================================
*   The following is SvelteStorm 4.0 Debug Monitoring Code.
* =========================================================
*/
const { ipcRenderer } = require('electron')
const parse = (event) => JSON.parse(JSON.stringify(event));
let cacheState = [];
let components = [];
let compComponents = [];
let compCTX = [];
let lastIndex = 0;
let eventCounter = 0;

// sends SNAPSHOT message to ipcMain, with all data needed for debugging visualization
const sendMessages = (componentStates) => {
  ipcRenderer.send('SNAPSHOT', {
    body: {
      componentStates,
      cacheLength: cacheState.length,
    },
  });
};

// Add all Svelte components to array
window.document.addEventListener('SvelteRegisterComponent', (e) => {

  const currentComponent = e.detail.component;
  let strippedCTX = parse(e.detail.component.$$.ctx);
  const stringifiedEventComp = JSON.stringify(e.detail.component);
  strippedCTX = strippedCTX.filter((element) => !Array.isArray(element));
  if (!compComponents.includes(stringifiedEventComp) && !compCTX.includes(JSON.stringify(strippedCTX))) {
    compComponents.push(stringifiedEventComp);
    components.push(currentComponent);
    compCTX.push(JSON.stringify(strippedCTX));
  }

});

setTimeout(saveAndDispatchState, 0);

// unused Delorean check
function checkIfChanged(componentState, i) {
  if (
    !cacheState.length ||
    (JSON.stringify(cacheState[cacheState.length - 1][i][1]) !==
      JSON.stringify(componentState[1]) &&
      JSON.stringify(cacheState[lastIndex][i][1]) !==
        JSON.stringify(componentState[1]))
  ) {
    return true;
  }
  return false;
}

// invoked whenever there is a perceived state change
function saveAndDispatchState(e) {
  eventCounter++;
  
  const curState = [];
  components.forEach((component) => {
    // only push components to curState if they are still on the page (ensures removed elements are removed from the snapshot)
    if(component.$$.on_destroy !== null){
      curState.push([
        component,
        component.$capture_state(),
        component.constructor.name,
      ]);
    }
  });

  const compCacheState = JSON.stringify(cacheState[cacheState.length - 1])
  let lastCacheStateLength;
  if (cacheState[cacheState.length - 1]) {
    lastCacheStateLength = cacheState[cacheState.length - 1].length;
  }

  if (JSON.stringify(curState) != compCacheState && lastCacheStateLength != curState.length) {

    sendMessages(parse(curState));
    cacheState.push([...curState]);
    lastIndex = cacheState.length - 1;
    console.log("cacheState after snapshot added:", cacheState);
  }

}

// listeners that detect state changes in svelte components.
function setupListeners(root) {
  root.addEventListener('SvelteRegisterBlock', (e) => {
    saveAndDispatchState()
  });
  root.addEventListener('SvelteDOMSetData', (e) => saveAndDispatchState(e));
  root.addEventListener('SvelteDOMInsert', (e) => saveAndDispatchState(e));
}

// activate event listeners
setTimeout(() => setupListeners(window.document));

/*
* =========================================================
*   The Above is SvelteStorm 4.0 Debug Monitoring Code.
* =========================================================
*/
