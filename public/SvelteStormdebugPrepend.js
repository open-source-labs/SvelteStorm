/*
* =========================================================
*   The following is SvelteStorm 4.0 Debug Monitoring Code.
* =========================================================
*/
const { on } = require('codemirror');
const { ipcRenderer } = require('electron')
const { onLCP, onTTFB, onCLS, onFCP, onFID, onINP } = require('web-vitals')
const parse = (event) => JSON.parse(JSON.stringify(event));
let cacheState = [];
let components = [];
let compComponents = [];
let compCTX = [];
let lastIndex = 0;
let eventCounter = 0;

//variables for performance dashboard Component Rerender Count that are a part of SS 5.0 
let nextId = 1;
let first = true; 
let isFirstAfterUpdate = true;
const componentsForRenderCount = [];
const compCounts = {};
const compInstance = {}; 

// sends SNAPSHOT message to ipcMain, with all data needed for debugging visualization
const sendMessages = (componentStates) => {
  ipcRenderer.send('SNAPSHOT', {
    body: {
      componentStates,
      cacheLength: cacheState.length,
    },
  });
};

//sends PERFORMANCE to IPCMain with the component count object
const sendCounts = (compObj) => {1
  ipcRenderer.send('PERFORMANCE', {
    body: {
      compCounts, 
      compInstance,
      componentsForRenderCount, 
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

   //peformance dashboard render tracker 
  // console.log('trackComponentRenders has fired')

  const { component, tagName } = e.detail;
  
  component.$$['tag_name'] = tagName;
  component.$$['id'] = tagName + nextId;
  component.$$['renderCount'] = 0; 
  nextId += 1; 
  console.log('nextID is now: ', nextId); 
  const curId = component.$$.id;
  compCounts[curId] = 1;
  componentsForRenderCount.push({component: e.detail.component.$$.id, count: e.detail.component.$$.renderCount})
  // console.log('componentsForRenderCount is now: ', componentsForRenderCount);
  // capturing all instance of components
  if(!compInstance[tagName]){
    compInstance[tagName] = 1;
  } else {
    compInstance[tagName] += 1;
  }

  if (first) {
    component.$$.on_mount.push(() => {
      const curId = component.$$.id;
      compCounts[curId] = 1;
      component.$$.renderCount +=1; 
      // console.log('renderCount onMount is: ', {comp: component.$$.id, renderCount: component.$$.renderCount})
    })
  }

  component.$$.on_destroy.push(() => {
    compInstance[tagName] -= 1;
    component.$$.renderCount = 0; 
    delete compCounts[curId];
  });

  component.$$.after_update.push(() => {
    const curId = component.$$.id;
    if (isFirstAfterUpdate) { return isFirstAfterUpdate = false;}
    compCounts[curId] += 1;
    component.$$.renderCount += 1
    // console.log('after_update comp renderCount is now: ', {comp: component.$$.id, renderCount: component.$$.renderCount})
    // console.log('componentsForRenderCount after update is now: ', componentsForRenderCount);
    
  });

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
  }

    sendCounts({compCounts, compInstance, componentsForRenderCount}); 

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

/*
* =========================================================
*   The Below is SvelteStorm 5.0 App Health Monitoring Code.
* =========================================================
*/

// sendMetrics helper function for web-vitals functions
function sendMetrics({ name, value }) {
  ipcRenderer.send('web-vitals', { name, value });
};

// JO 9/3 attempt to call the web vitals - we'll need to store these if we can get them
onLCP(sendMetrics);
onFID(sendMetrics);
onCLS(sendMetrics);
onFCP(sendMetrics);
onTTFB(sendMetrics);
onINP(sendMetrics);

/*
* =========================================================
*   The Above is SvelteStorm 5.0 App Health Monitoring Code.
* =========================================================
*/
