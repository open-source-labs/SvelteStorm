const {ipcRenderer} = require('electron');

export default ipcRenderer.on('file-opened', function (evt, message) {
    console.log(message); // Returns: {'SAVED': 'File Saved'}
});