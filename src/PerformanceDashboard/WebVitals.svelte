<script>
  import { vitals } from "../DataStore/SvelteStormDataStore"; 
  const { ipcRenderer } = require('electron');

  console.log('Web Vitals Exists', vitals);
  ipcRenderer.on('web-vitals', (event, args) => {
    vitals.update((currVal) => {
    currVal[args.name] = args.value;
    // console.log('vitals', currVal);
    return currVal;
    });
  });  

  
</script>

<main>
  
  <div class='web-vitals-parent-container'>
    <h5 class='web-vitals-title'>Web Vitals</h5>
    <div class='web-vitals-columns-container'>
      <div class='vitals-left'>
        <div class='individual-vital'>
          <h5>Largest Contentful Paint</h5>
          <p>{$vitals.LCP === undefined ? "TBD" : ($vitals.LCP).toFixed(3)}</p>
        </div>
        <div class='individual-vital'>
          <h5>First Input Delay</h5>
          <p>{$vitals.FID === undefined ? "TBD" : ($vitals.FID).toFixed(3)}</p>
        </div>
        <div class='individual-vital'>
          <h5>Cumulative Layout Shift</h5>
          <p>{$vitals.CLS === undefined ? "TBD" : ($vitals.CLS).toFixed(3)}</p>
        </div>
      </div>
      <div class='vitals-right'>
        <div class='individual-vital'>
          <h5>First Contentful Paint</h5>
          <p>{$vitals.FCP === undefined ? "TBD" : ($vitals.FCP).toFixed(3)}</p>
        </div>
        <div class='individual-vital'>
          <h5>Time To First Byte</h5>
          <p>{$vitals.TTFB === undefined ? "TBD" : ($vitals.TTFB).toFixed(3)}</p>
        </div>
        <div class='individual-vital'>
          <h5>Interaction to Next Paint</h5>
          <p>{$vitals.INP === undefined ? "TBD" : ($vitals.INP).toFixed(3)}</p>
        </div>
      </div>
    </div> 
  </div>

</main>
  
<style>

  .web-vitals-parent-container {
    display: flex;
    justify-content: center;
    align-items: center;
    flex-direction: column;
  }

  .web-vitals-columns-container {
    display: flex;
    flex-wrap: wrap;
  }

  .vitals-left, .vitals-right {
    display: flex;
    flex-direction: column;
  }

  .individual-vital {
    padding: 1em;
    text-align: center;
  }

</style>