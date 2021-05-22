<script>
    export let filePath;
    import DirectoryData from '../Utilities/DirectoryStore';
    const fs = require('fs');
    const unsub = DirectoryData.subscribe(data =>{
    });

    const renameHandler = () => {
        console.log('Rename handler is clicked!')
        //store.rename = true;
        DirectoryData.update( currentData => {
            return {...currentData, rename :true};
        })
    }

    const deleteHandler = () => {
        console.log('Delete Handler is clicked!');
        fs.unlinkSync(filePath);
        DirectoryData.update( currentData => {
            return {...currentData, deleteFile:true};
            
        })

    }

</script>

<!-- Svelte -->
<div class=createMenuWrapper>
    <button class=create-button on:click={renameHandler}>Rename</button>
    <button class=create-button on:click={deleteHandler}>Delete</button>
</div>






<!-- Style -->
<style>

.createMenuWrapper{
    background-color: white;
    font-size: 15px;
    width:100px;
    height: 100px;
}
.create-button {
    width: 90%;
    height: 20px;
    text-align: center;
    margin-left: auto;
    margin-right: auto;
    display: block;
    margin-top: 5px;
  /* border-radius: 10px; */
}

.create-button:hover {
    background-color: rgb(33, 37, 43);
    color: white;
    font-weight: 550;
}
</style>

