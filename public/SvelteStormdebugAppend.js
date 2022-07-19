
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

/*
* =========================================================
*   The Above is SvelteStorm 4.0 Debug Monitoring Code.
* =========================================================
*/

