<script>   

    import DirectoryData from '../Utilities/DirectoryStore';
    export let stateObj = {};
        
        const unsub = DirectoryData.subscribe(data =>{
            stateObj = data.stateObj;
            //console.log('stateObj', stateObj)
        })
    
    </script>
    
    <style>
    
    </style>
    
    <div class="state-container">
        <h5>State Manager</h5>
        <ul>
            {#each Object.entries(stateObj) as [file,state]}
                <li>{file} : {state}</li>
            {/each}
        </ul>
    </div>