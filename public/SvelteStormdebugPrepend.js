/*
* =========================================================
*   The following is SvelteStorm 4.0 Debug Monitoring Code.
* =========================================================
*/
const { ipcRenderer } = require('electron')
const parse = (event) => JSON.parse(JSON.stringify(event));
let cacheState = JSON.stringify([]);
const components = [];
let lastIndex = 0;
let firstTime = true;

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
  components.push(e.detail.component);
});
setTimeout(saveAndDispatchState, 0);

function checkIfChanged(componentState, i) {
  // console.log("checkIfChanged: i: ", i)
  // console.log("checkIfChanged: componentState: ", componentState)
  // console.log("checkIfChanged: cacheState:", cacheState);
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
  // if (
  //   !cacheState.length ||
  //   (JSON.stringify(cacheState[cacheState.length - 1][i][1]) !==
  //     JSON.stringify(componentState[1]) &&
  //     JSON.stringify(cacheState[lastIndex][i][1]) !==
  //       JSON.stringify(componentState[1]))
  // ) {
  //   return true;
  // }
  // return false;
}

function checkIfChanged2(componentState, i) {
  // console.log("checkIfChanged: i: ", i)
  // console.log("checkIfChanged: componentState: ", componentState)
  // console.log("checkIfChanged: cacheState:", cacheState);
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
function saveAndDispatchState() {
  const curState = [];
  components.forEach((component) => {
    curState.push([
      component,
      component.$capture_state(),
      component.constructor.name,
    ]);
  });

  // TEST CHECK IF CHANGED 
  // console.log("first time", firstTime);
  // if (firstTime) {
    // cacheState = JSON.stringify([]);
    // console.log("cacheState in IF block", cacheState);
  // }
  // console.log("saveAndDispatchState: curState: ", firstTime, curState)
  // console.log("saveAndDispatchState: cacheState:", firstTime, cacheState);
  // firstTime = false;
  cacheState = JSON.parse(cacheState);
  const compCacheState = JSON.stringify(cacheState[cacheState.length - 1])
  let lastCacheStateLength;
  if (cacheState[cacheState.length - 1]) {
    lastCacheStateLength = cacheState[cacheState.length - 1].length;
  }
  cacheState = JSON.stringify(cacheState);
  // console.log("lastCacheStateLength", lastCacheStateLength);
  // console.log("curState.length", curState.length);
  
  if (JSON.stringify(curState) != compCacheState && lastCacheStateLength != curState.length) {
    // console.log("IF:saveAndDispatchState: curState: ", firstTime, curState)
    // console.log("IF:saveAndDispatchState: cacheState:", firstTime, cacheState);
    if (cacheState.length > lastIndex) {
      cacheState = JSON.parse(cacheState);
      cacheState = cacheState.slice(0, lastIndex + 1);
      cacheState = JSON.stringify(cacheState);
    }
    sendMessages(parse(curState));
    cacheState = JSON.parse(cacheState);
    cacheState.push([...curState]);
    lastIndex = cacheState.length - 1;
    cacheState = JSON.stringify(cacheState);
    // console.log("cacheState after push:", cacheState);
  }

  // // currState = [[component 1],[component 2], etc...] | component 1 = [component, component.capture state, name]
  // if (curState.some(checkIfChanged)) {
  //   console.log("DELOREAN RECOGNIZED STATE CHANGE");
  //   console.log("DELOREAN curState: ", curState);
  //   // If cacheState is logner than the last index, we are back in time and should start a new branch
  //   if (cacheState.length > lastIndex) {
  //     // cacheState = cacheState.slice(0, lastIndex);
  //     cacheState = cacheState.slice(0, lastIndex + 1);
  //   }
  //   sendMessages(parse(curState));
  //   cacheState.push([...curState]);
  //   lastIndex = cacheState.length - 1;
  // }
}

function setupListeners(root) {
  root.addEventListener('SvelteRegisterBlock', (e) => saveAndDispatchState());
  root.addEventListener('SvelteDOMSetData', (e) => saveAndDispatchState());
  root.addEventListener('SvelteDOMInsert', (e) => saveAndDispatchState());
  /*
   * These event listeners aren't being used in this version, but could provide valuable data for future versions of this product
   * root.addEventListener('SvelteDOMRemove', (e) => (e) => sendMessages(parseEvent(e.detail)));
   * root.addEventListener('SvelteDOMAddEventListener', (e) => sendMessages(parseEvent(e.detail)));
   * root.addEventListener('SvelteDOMRemoveEventListener',(e) => sendMessages(parseEvent(e.detail)));
   * root.addEventListener('SvelteDOMSetProperty', (e) => sendMessages(parseEvent(e.detail)));
   * root.addEventListener('SvelteDOMSetAttribute', (e) => sendMessages(parseEvent(e.detail)));
   * root.addEventListener('SvelteDOMRemoveAttribute', (e) => sendMessages(parseEvent(e.detail)));
   */
}

// activate event listeners
setTimeout(() => setupListeners(window.document));

/*
* =========================================================
*   The Above is SvelteStorm 4.0 Debug Monitoring Code.
* =========================================================
*/

