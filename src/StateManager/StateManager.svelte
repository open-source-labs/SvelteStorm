<script> 
  import { DirectoryData } from '../Utilities/DirectoryStore';
  export let stateObj = {};
      
  const unsub = DirectoryData.subscribe(data =>{
    stateObj = data.stateObj;      
  })    
</script>    

    
<!-- Components -->

<div class="state-container">
  <div class="h5Container">
    <h5 class="title">State Management Tree</h5> 
  </div>   
    <ul>
        {#each Object.entries(stateObj) as [file,state]}
            <li class='fileName'>{file} : <span class='stateName'>{'{ '}{state.join()}{' }'}</span> </li>                 
        {/each}
    </ul>    
</div>


<!-- CSS Styling -->
<style>
.state-container {
  /* background-color: rgb(2, 29, 2); */
  background-color: rgba(28, 28, 36, 0.678); 
  margin-bottom: 10px;
  padding-bottom: 10px;
  padding-left: 0;
  /* max-height: 500px; */
  margin-top: 0;
  padding-top: 0;
  display: flex;
  flex-direction: column;  
}
.h5Container {
/* background-color: rgb(27, 27, 26); */
background-color: rgba(28, 28, 36, 0.678); 
height: 20px;
width: 100%;
padding-left: 7px;

}

.title {  
  color: rgb(133, 165, 201);
  margin-bottom: 0;
  margin-top: 0;
  padding-top: 0;
  font-size: 12px;
  
}

span {
  font-size: 12px;
}

.fileName {
  /* background-color: peachpuff; */ 
  border-radius: 10px;
  font-size: 14px;
  /* max-width: 150px; */
  padding: 0px 0 5px 25px;
  background-image: url('../src/icons/arrow_head.svg');
  background-repeat: no-repeat;
  background-position: left;
  background-size: 15px;  
}

.stateName {
  font-size: 12px;
  color: rgb(151, 181, 221);
}

ul {
  list-style: none;
  margin-top: 0;
  margin: 0;
  padding: 0;
  
  
}

li {
  margin-top: 5px; 
  margin-left: 0;
  
}



</style>