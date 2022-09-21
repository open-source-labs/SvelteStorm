<script>
  import { vitals } from "../DataStore/SvelteStormDataStore"; 
    import FileDir from "../Directory/FileDir.svelte";
  const { ipcRenderer } = require('electron');

  ipcRenderer.on('web-vitals', (event, args) => {
    vitals.update((currVal) => {
    currVal[args.name] = args;
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
          <p>{$vitals.LCP === undefined ? "TBD" : ($vitals.LCP.value).toFixed(3) + 's'}</p>
          {#if $vitals.LCP}
            <p>Rating: 
              <span class={$vitals.LCP.rating[0]}>{$vitals.LCP.rating.toUpperCase()}
              </span>
            </p>
          {/if}
        </div>
        <div class='individual-vital'>
          <h5>First Input Delay</h5>
          <p>{$vitals.FID === undefined ? "TBD" : ($vitals.FID.value).toFixed(3) + 'ms'}</p>
          {#if $vitals.FID}
            <p>Rating: 
              <span class={$vitals.FID.rating[0]}>{$vitals.FID.rating.toUpperCase()}
              </span>
            </p>
          {/if}
        </div>
        <div class='individual-vital'>
          <h5>Cumulative Layout Shift</h5>
          <p>{$vitals.CLS === undefined ? "TBD" : ($vitals.CLS.value).toFixed(3)}</p>
          {#if $vitals.CLS}
            <p>Rating: 
              <span class={$vitals.CLS.rating[0]}>{$vitals.CLS.rating.toUpperCase()}
              </span>
            </p>
          {/if}
        </div>
      </div>
      <div class='vitals-right'>
        <div class='individual-vital'>
          <h5>First Contentful Paint</h5>
          <p>{$vitals.FCP === undefined ? "TBD" : ($vitals.FCP.value).toFixed(3) + 's'}</p>
          {#if $vitals.FCP}
            <p>Rating: 
              <span class={$vitals.FCP.rating[0]}>{$vitals.FCP.rating.toUpperCase()}
              </span>
            </p>
          {/if}
        </div>
        <div class='individual-vital'>
          <h5>Time To First Byte</h5>
          <p>{$vitals.TTFB === undefined ? "TBD" : ($vitals.TTFB.value).toFixed(3) + 'ms'}</p>
          {#if $vitals.TTFB}
            <p>Rating: 
              <span class={$vitals.TTFB.rating[0]}>{$vitals.TTFB.rating.toUpperCase()}
              </span>
            </p>
          {/if}
        </div>
        <div class='individual-vital'>
          <h5>Interaction to Next Paint</h5>
          <p>{$vitals.INP === undefined ? "TBD" : ($vitals.INP.value).toFixed(3) + 'ms'}</p>
          {#if $vitals.INP}
            <p>Rating: 
              <span class={$vitals.INP.rating[0]}>{$vitals.INP.rating.toUpperCase()}
              </span>
            </p>
          {/if}
        </div>
      </div>
    </div> 
  </div>

</main>
  
<style>
/* Below code applies only to web vitals rating color */
  .g, .n, .p {
    font-weight: bold;
  }

  .g {
    color: rgb(0, 154, 0);
  }

  .n {
    color: rgb(243, 197, 80);
  }

  .p {
    color: rgb(240, 38, 38);
  }
/* Above code applies only to web vitals rating color */

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