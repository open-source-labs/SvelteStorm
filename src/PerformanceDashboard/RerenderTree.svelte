<script>
  import * as d3 from 'd3';
  import {ipcRenderer, BrowserWindow} from 'electron'
  import { DirectoryData } from "../DataStore/SvelteStormDataStore";
  export const stateObj = {};
  
  const renderCountObj = {};
  
  //function to create keys in renderCountObj for each component of applciation. Each key initialized to 0.
  const populateRenderCountObj = (stateObj) => {
      for (const key in stateObj) {
          renderCountObj[key] = 0; 
      }
  }
  
  //suscribe to DirectoryData to receive updates to stateObj
  const suscribeToStateUpdates = DirectoryData.subscribe((data) => {
    stateObj = data.stateObj;
    populateRenderCountObj(stateObj);
  });
  
  //for every reload, increment relevant key of renderCountObj
  const handleReloads = (data) => {
      if (data) {
  
      }
  }
  
  console.log("renderCountObj is: ", renderCountObj); 
  
</script>

<main>


</main>

<style>


</style>