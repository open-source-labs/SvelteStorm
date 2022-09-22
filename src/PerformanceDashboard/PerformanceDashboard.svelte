<script> 
//importingh DirectoryData from DataStore to access stateObj & componenetRElationships
  import { appBeingDebugedPath } from "../DataStore/SvelteStormDataStore"; 
  import RerenderChart from "./RerenderChart.svelte";
  import WebVitals from "./WebVitals.svelte";
  const cmd = require('node-cmd');
  const process = require('process');
  const {ipcRenderer} = require('electron');


/* **NOTE: The commented out code below was intended to run the 'npm run performanceSS' script in SvelteStorm. This 
would help direct the User's flow (since the Dashboard needs to be open before the script runs to capture all the data).
The idea was that on click of the start button, the script would run and on click of the End button, ctl C would run to
end the session. More time is needed to ensure the commands are running for the application running in SvelteStorm 
and not SvelteStorm itself.
*/
// const path = appBeingDebugedPath; 

// const startSession = (err, data, stderr) => {
//   console.log('Start session has been clicked!')
//   try {
//     // Change the directory
//     process.chdir(path);
//     ipcRenderer.send('terminal-into', `cd ${path}\r`);

//   } catch (err) {
//     // Printing error if occurs
//     console.error('error while changing directory in PeformanceDashboard: ', {err});
//   }
//   cmd.run(`npm run performanceSS`, (err) => console.log('An error occurred while starting Perf Monitoring: ', {err}));
// }

// const endSession = (err, data, stderr) => {
//   console.log('Peformance endSession has been clicked!');
//   cmd.run('^C', () => console.log('An error occurred while ending Performance Monitoring: ', {err}))

// }

</script>

<main> 
    <div class="state-container">
        <div class="h5Container">
          <h4 class="title">PERFORMANCE DASHBOARD</h4>
        </div>
        <!-- <div>
          <button>Start</button>
          <button>End</button>
        </div> -->
        <div class="component-holder">
          <RerenderChart />
        </div>

        <div class="component-holder">
          <WebVitals />
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

  .component-holder {
    padding: 5px; 
  }
</style>