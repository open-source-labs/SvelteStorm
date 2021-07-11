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
  
}

.title {
  background-color: rgb(223, 123, 30);
  color: rgb(231, 227, 219);
  margin-bottom: 0;
  
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





</style>