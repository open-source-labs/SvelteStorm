<script>   

    import DirectoryData from '../Utilities/DirectoryStore';
    export let stateObj = {};
        
        const unsub = DirectoryData.subscribe(data =>{
            stateObj = data.stateObj;
            console.log('stateObj', stateObj)
        })
    
    </script>
    
    <style>
    
    </style>
    
    <div class="state-container">
        <h5>State Manager Component</h5>
        <ul>
            <!-- {#if stateObj && stateObj.length > 0}
                {#each stateObj as state}
                <li>{state.file} : {state.state}</li>
                {/each}
            {/if} -->
            {#each Object.entries(stateObj) as [file,state]}
                <li>{file} : {state}</li>
            {/each}
        </ul>
    </div>