/*
* =========================================================
*   The following is SvelteStorm 4.0 Debug Monitoring Code.
* =========================================================
*/
const { ipcRenderer } = require('electron')
const parse = (event) => JSON.parse(JSON.stringify(event));
let cacheState = [];
const components = [];
const compComponents = [];
const compCTX = [];
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
  const currentComponent = e.detail.component;
  let strippedCTX = parse(e.detail.component.$$.ctx);
  const stringifiedEventComp = JSON.stringify(e.detail.component);
  console.log("Component CTX:", e.detail.component.$$.ctx);
  strippedCTX = strippedCTX.filter((element) => typeof(element) === 'number' || typeof(element) === 'string');
  console.log("====================");
  console.log("strippedCTX", strippedCTX);
  console.log("compCTX:", compCTX);
  if (!compComponents.includes(stringifiedEventComp) && !compCTX.includes(JSON.stringify(strippedCTX))) {
    console.log("got into IF ... adding new stripped CTX")
    compComponents.push(stringifiedEventComp);
    components.push(currentComponent);
    compCTX.push(JSON.stringify(strippedCTX));
  }
});
setTimeout(saveAndDispatchState, 0);


// invoked whenever there is a perceived state change
function saveAndDispatchState() {
  const curState = [];
  components.forEach((component) => {
    curState.push([
      component,
      component.$capture_state(),
      component.constructor.name,
    ]);
    // console.log('🔴🟠🟡🟢🔵🟣 | file: SvelteStormdebugPrepend.js | line 50 | components.forEach | component', component);
    // console.log('🔴🟠🟡🟢🔵🟣 | file: SvelteStormdebugPrepend.js | line 51 | components.forEach | component.$capture_state()', component.$capture_state());
    // console.log('🔴🟠🟡🟢🔵🟣 | file: SvelteStormdebugPrepend.js | line 53 | components.forEach | component.constructor.name', component.constructor.name);
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

// activate event listeners
setTimeout(() => setupListeners(window.document));

/*
* =========================================================
*   The Above is SvelteStorm 4.0 Debug Monitoring Code.
* =========================================================
*/

