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

let eventCounter = 0;

// sends SNAPSHOT message to ipcMain, with all data needed for debugging visualization
const sendMessages = (componentStates) => {
      console.log(`\n🟡🟡🟡🟡🟡🟡🟡🟡🟡🟡🟡🟡🟡🟡🟡🟡🟡🟡🟡🟡🟡🟡🟡🟡🟡🟡🟡🟡`);
      console.log(`\n🟡🟡🟡🟡🟡🟡🟡🟡🟡🟡🟡🟡🟡🟡🟡🟡🟡🟡🟡🟡🟡🟡🟡🟡🟡🟡🟡🟡`);
      console.log('🔴🟠🟡🟢🔵🟣 | file: SvelteStormdebugPrepend.js | line 21 | sendMessages | eventCounter', eventCounter);
      console.log('🔴🟠🟡🟢🔵🟣 | file: SvelteStormdebugPrepend.js | line 22 | sendMessages | componentStates', componentStates);
      console.log(`\n🟡🟡🟡🟡🟡🟡🟡🟡🟡🟡🟡🟡🟡🟡🟡🟡🟡🟡🟡🟡🟡🟡🟡🟡🟡🟡🟡🟡`);
      console.log(`\n🟡🟡🟡🟡🟡🟡🟡🟡🟡🟡🟡🟡🟡🟡🟡🟡🟡🟡🟡🟡🟡🟡🟡🟡🟡🟡🟡🟡`);

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
  console.log("SvelteRegisterComponent Event:", e);
  strippedCTX = strippedCTX.filter((element) => typeof(element) === 'number' || typeof(element) === 'string');
  // console.log("====================");
  // console.log("strippedCTX", strippedCTX);
  // console.log("compCTX:", compCTX);
  if (!compComponents.includes(stringifiedEventComp) && !compCTX.includes(JSON.stringify(strippedCTX))) {
    console.log("got into IF ... adding new stripped CTX");
    console.log("components after svelteRegisterComponent");
    compComponents.push(stringifiedEventComp);
    components.push(currentComponent);
    compCTX.push(JSON.stringify(strippedCTX));
  }

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
}

// invoked whenever there is a perceived state change
function saveAndDispatchState(e) {
  eventCounter++;
  console.log(`\n🟢🟢🟢🟢🟢🟢🟢🟢🟢🟢🟢🟢🟢🟢🟢🟢🟢🟢🟢🟢🟢🟢🟢🟢🟢🟢🟢🟢`);
  console.log(`\n🟢🟢🟢🟢🟢🟢🟢🟢🟢🟢🟢🟢🟢🟢🟢🟢🟢🟢🟢🟢🟢🟢🟢🟢🟢🟢🟢🟢`);
  console.log('🔴🟠🟡🟢🔵🟣 | file: SvelteStormdebugPrepend.js | line 69 | saveAndDispatchState | eventCounter', eventCounter);
      console.log('🔴🟠🟡🟢🔵🟣 | file: SvelteStormdebugPrepend.js | line 68 | saveAndDispatchState | e', e);
      console.log(`\n🟢🟢🟢🟢🟢🟢🟢🟢🟢🟢🟢🟢🟢🟢🟢🟢🟢🟢🟢🟢🟢🟢🟢🟢🟢🟢🟢🟢`);
      console.log(`\n🟢🟢🟢🟢🟢🟢🟢🟢🟢🟢🟢🟢🟢🟢🟢🟢🟢🟢🟢🟢🟢🟢🟢🟢🟢🟢🟢🟢`);
  
  const curState = [];
  components.forEach((component) => {
    curState.push([
      component,
      component.$capture_state(),
      component.constructor.name,
    ]);
  });

  const compCacheState = JSON.stringify(cacheState[cacheState.length - 1])
  let lastCacheStateLength;
  if (cacheState[cacheState.length - 1]) {
    lastCacheStateLength = cacheState[cacheState.length - 1].length;
  }
  if (JSON.stringify(curState) != compCacheState && lastCacheStateLength != curState.length) {
    // if (cacheState.length > lastIndex) {
    //   cacheState = cacheState.slice(0, lastIndex + 1);
    // }

    sendMessages(parse(curState));
    cacheState.push([...curState]);
    lastIndex = cacheState.length - 1;
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
  root.addEventListener('SvelteRegisterBlock', (e) => {
    // somthing(e)
    saveAndDispatchState()
  });
  root.addEventListener('SvelteDOMSetData', (e) => saveAndDispatchState(e));
  root.addEventListener('SvelteDOMInsert', (e) => saveAndDispatchState(e));
  root.addEventListener('SvelteDOMRemove', (e) => saveAndDispatchState(e));
  root.addEventListener('SvelteDOMAddEventListener', (e) => saveAndDispatchState(e));
  
  /*
   * These event listeners aren't being used in this version, but could provide valuable data for future versions of this product
   * root.addEventListener('SvelteDOMRemove', (e) => (e) => sendMessages(parseEvent(e.detail)));
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
