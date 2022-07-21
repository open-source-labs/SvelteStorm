
/*
* =========================================================
*   The following is SvelteStorm 4.0 Debug Monitoring Code.
* =========================================================
*/

window.addEventListener(
  'message',
  (messageEvent) => {
    if (messageEvent.data.body === 'TIME_TRAVEL') {
      const i = messageEvent.data.ctxIndex;
      lastIndex = i;
      if (cacheState[i]) {
        cacheState[i].forEach((componentState) => {
          componentState[0].$inject_state(componentState[1]);
        });
      }
    }
  },
  false
);

/* inside visualization file
const instance = {
  message: "TIME_TRAVEL",
  ctxIndex: the index of the snapshot (button clicked)
}
const visualizationWindow = BrowserWindow.getFocusedWindow();
visualizationWindow.webContents.send('TIME_TRAVEL', instance)

THEN CHANGE THIS EVENT LISTENER TO ------->
 ipcRender.on('TIME_TRAVEL', (event, data) => {
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
*/
/*
* =========================================================
*   The Above is SvelteStorm 4.0 Debug Monitoring Code.
* =========================================================
*/

