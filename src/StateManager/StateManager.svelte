<script> 
  import { DirectoryData } from '../Utilities/DirectoryStore';
  export let stateObj = {};
      
  const unsub = DirectoryData.subscribe(data =>{
    stateObj = data.stateObj;      
  })    
</script>    

    
<!-- Components -->

<div class="state-container">
    <h5 class="title">State Manager</h5>
    
    <!-- <ul>
        {#each Object.entries(stateObj) as [file,state]}
            <li class='fileName'>{file}</li>
            <p>States : {'{'}</p>
            {#each state as s} 
              <li class="stateName">{s}</li>
            {/each}
            <p>{'}'}</p>
        {/each}
    </ul> -->
    <ul>
        {#each Object.entries(stateObj) as [file,state]}
            <li class='fileName'>{file}</li> 
            {#each state as s} 
              <li class="stateName">|__ {s}</li>
            {/each}
        {/each}
    </ul>
    
</div>


<!-- CSS Styling -->
<style>
.state-container {
  background-color: rgb(2, 29, 2);
  margin-bottom: 10px;
  padding-bottom: 10px;
  padding-left: 0;
  max-height: 500px;
  
}

.title {
  background-color: rgb(223, 123, 30);
  color: rgb(231, 227, 219);
  margin-bottom: 0;
  
}

p {
  font-size: 14px;
}

.fileName {
  /* background-color: peachpuff; */
  border-radius: 10px;
  font-size: 16px;
  max-width: 150px;
  padding: 5px 5px 5px 5px;
}

.stateName {
  margin-left: 20px;
  margin-top: 5px;
  font-size: 14px;
}

ul {
  list-style: none;
  margin-top: 0;
  
  
}

li {
  margin-top: 5px; 
  margin-left: 0;
}

/* width */
::-webkit-scrollbar {
  width: 10px;
}

/* Track */
::-webkit-scrollbar-track {
  background: #f1f1f1; 
}
 
/* Handle */
::-webkit-scrollbar-thumb {
  background: #888; 
}

/* Handle on hover */
::-webkit-scrollbar-thumb:hover {
  background: #555; 
}

</style>