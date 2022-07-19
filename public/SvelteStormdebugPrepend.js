

/*
* =========================================================
*   The following is SvelteStorm 4.0 Debug Monitoring Code.
* =========================================================
*/
const {ipcRenderer} = require('electron')
const parse = (event) => JSON.parse(JSON.stringify(event));
let cacheState = [];
const components = [];
let lastIndex = 0;

const sendMessages = (componentStates) => {
  ipcRenderer.send('SNAPSHOT', {
    body: {
      componentStates,
      cacheLength: cacheState.length,
    },
  });

  window.postMessage({
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
  /*
   * If caches state is empty... or the most recent cache state is different
   * and the state at the last sent index is different, then state has truly changed
   */
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

function saveAndDispatchState() {
  const curState = [];
  components.forEach((component) => {
    curState.push([
      component,
      component.$capture_state(),
      component.constructor.name,
    ]);
  });
  console.log(
    '🔴🟠🟡🟢🔵🟣 | file: main.js | line 142 | components.forEach | components',
    components
  );
  // Only add to cache & send messages if any state has actually changed

  if (curState.some(checkIfChanged)) {
    // If cacheState is logner than the last index, we are back in time and should start a new branch
    if (cacheState.length > lastIndex) {
      cacheState = cacheState.slice(0, lastIndex + 1);
    }
    sendMessages(parse(curState));
    cacheState.push([...curState]);
    lastIndex = cacheState.length - 1;
  }
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

setTimeout(() => setupListeners(window.document));


/*
* =========================================================
*   The Above is SvelteStorm 4.0 Debug Monitoring Code.
* =========================================================
*/

