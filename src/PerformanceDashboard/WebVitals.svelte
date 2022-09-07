<script>
  import { vitals } from "../DataStore/SvelteStormDataStore"; 
  const { ipcRenderer } = require('electron');

  ipcRenderer.on('web-vitals', (event, args) => {
    vitals.update((currVal) => {
    console.log('before adding anything', currVal);
    currVal[args.name] = args.value;
    console.log('after adding vitals', currVal);
    return currVal;
    });
  });  
  
</script>

<main>
  
  <div class='web-vitals-parent-container'>
    <h3>Web Vitals</h3>
    <div class='web-vitals-individual-parent-container'>
      <div class='individual-vital'>
        <h4>Largest Contentful Paint</h4>
        <p>{$vitals.LCP === undefined ? "TBD" : ($vitals.LCP).toFixed(3)}</p>
      </div>
      <div class='individual-vital'>
        <h4>First Input Delay</h4>
        <p>{$vitals.FID === undefined ? "TBD" : ($vitals.FID).toFixed(3)}</p>
      </div>
      <div class='individual-vital'>
        <h4>Cumulative Layout Shift</h4>
        <p>{$vitals.CLS === undefined ? "TBD" : ($vitals.CLS).toFixed(3)}</p>
      </div>
      <div class='individual-vital'>
        <h4>First Contentful Paint</h4>
        <p>{$vitals.FCP === undefined ? "TBD" : ($vitals.FCP).toFixed(3)}</p>
      </div>
      <div class='individual-vital'>
        <h4>Time To First Byte</h4>
        <p>{$vitals.TTFB === undefined ? "TBD" : ($vitals.TTFB).toFixed(3)}</p>
      </div>
      <div class='individual-vital'>
        <h4>Iteraction to Next Paint</h4>
        <p>{$vitals.INP === undefined ? "TBD" : ($vitals.INP).toFixed(3)}</p>
      </div>
    </div> 
  </div>

</main>
  
<style>
  .web-vitals-parent-container {
    display: flex;
    justify-content: center;
    align-items: center;
  }

  .web-vitals-individual-parent-container {
    display: flex;
  }
</style>