<script>
  import { vitals } from "../DataStore/SvelteStormDataStore"; 
  const { ipcRenderer } = require('electron');

  ipcRenderer.on('web-vitals', (event, args) => {
    vitals.update((currVal) => {
    currVal[args.name] = args.value;
    return currVal;
    });
  });  

  
</script>

<main>
  
  <div class='web-vitals-parent-container'>
    <h5 class='web-vitals-title' data-Tooltip="Web Vitals are graded on a 'Good', 'Needs Improvement', and 'Poor' scale.">Web Vitals</h5>
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
  /* CODE BELOW CREATES TOOLTIP UNDER WEB VITALS TITLE*/
  .web-vitals-title {
    position: relative;
  }

  .web-vitals-title::before,
  .web-vitals-title::after {
    --scale: 0;
    --arrow-size: 10px;
    --tooltip-color: #F3EFEE;

    position: absolute;
    bottom: -.10rem;
    left: 50%;
    transform: translateX(-50%) translateY(var(--translate-y, 0)) scale(var(--scale));
    transition: 150ms transform;
    transform-origin: top center;
  }

  .web-vitals-title::before {
    --translate-y: calc(100% + var(--arrow-size));

    content: attr(data-tooltip);
    font-size: .9rem;
    color: rgb(20, 20, 20);
    padding: .5rem;
    border-radius: .3rem;
    text-align: center;
    width: max-content;
    max-width: 300%;
    background: var(--tooltip-color);
  }

  .web-vitals-title:hover::before,
  .web-vitals-title:hover::after {
    --scale: .8;
  }

  .web-vitals-title::after {
    --translate-y: calc(1 * var(--arrow-size));

    content: '';
    border: var(--arrow-size) solid transparent;
    border-bottom-color: var(--tooltip-color);
    transform-origin: bottom center;
  }
</style>