<script> 
//importingh DirectoryData from DataStore to access stateObj & componenetRElationships
  import { DirectoryData } from "../DataStore/SvelteStormDataStore";
  import { performanceBool, handlePerformance } from '../App.svelte'; 

const startSession = () => {

}

const endSession = () => {

}

</script>

<main> 
    <div class="state-container">
        <div class="h5Container">
          <h5 class="title">PERFORMANCE DASHBOARD</h5>
        </div>
        <div>
            <span>
                <button
                type="button"
                class="childButton"
                on:click={startSession}>Start</button>
                <button
                type="button"
                class="childButton"
                on:click={endSession}>Stop</button>
            </span>
        </div>
    </div>
</main>

<style> 
  .state-container {
    margin-bottom: 10px;
    padding-bottom: 10px;
    padding-left: 0;
    margin-top: 0;
    padding-top: 0;
    display: flex;
    flex-direction: column;
    height: 30%;
    width: 100%;
  }

  .h5Container {
    background-color: rgb(22, 27, 34);
    /* color: rgb(139, 148, 158); */
    height: 20px;
    width: 100%;
    padding-left: 7px;
    line-height: 20px;
  }

  .title {
    color: whitesmoke;
    margin-bottom: 0;
    margin-top: 0;
    padding-top: 0;
    font-size: 12px;
  }
</style>