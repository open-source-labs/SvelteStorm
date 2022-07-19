function updateRollupConfig () {
  console.log('🔴🟠🟡🟢🔵🟣🔴🟠🟡🟢🔵🟣 | file: FileDir.svelte | line 145 | FileTree | fs.readdirSync | file🔴🟠🟡🟢🔵🟣', file);
    
    /*
    * ==================================================
    * Rename rollup.config.js to rollup.config.original.js
    * 
    * Make copy of projects current rollup config file
    * 
    * Add two lines to beginning of rollup.config.js
    *   import path
    *   import rollup plugin
    * 
    * Add banner needed lines in plugin section
    * 
    * ==================================================
    */
   
    const myFileContent = fs.readFileSync(file, 'utf8')
    const myFileAsArray = myFileContent.split('\n');
    
    // As each line is examined we either push it to a new array OR add our lines THEN continue loop and pushing to new Array
    // When done new Array will be written to new file.
    const newMyFileAsArray = [];
    let addedImports = false;
    
    for(let i = 0; i < myFileAsArray.length; i++) {
      const daLine = myFileAsArray[i].split(' ');
      if (daLine[0] !== 'import' && !addedImports) {
        newMyFileAsArray.push(`import banner from '${myPath.resolve(__dirname, '../src/StateManager/SvelteStormUtils/rollup-plugin-pre-app-end')}';`);
        newMyFileAsArray.push(`const path = require('path');`);
        newMyFileAsArray.push(myFileAsArray[i]);
        addedImports = true;
      } else if (myFileAsArray[i].trim() === 'plugins: [') {
      newMyFileAsArray.push(myFileAsArray[i]);
      newMyFileAsArray.push(`banner({`);
        newMyFileAsArray.push(`prependFile: '${myPath.resolve(__dirname, 'SvelteStormdebugPrepend.js')}',`);
        newMyFileAsArray.push(`appendFile: '${myPath.resolve(__dirname, 'SvelteStormdebugAppend.js')}',`);
        newMyFileAsArray.push(`encoding: 'utf-8', // default is utf-8`);
        newMyFileAsArray.push(` }),`);
        
      } else {
        newMyFileAsArray.push(myFileAsArray[i]);
      }
    }
    console.log('🔴🟠🟡🟢🔵🟣 | file: FileDir.svelte | line 176 | FileTree | fs.readdirSync | newMyFileAsArray', newMyFileAsArray);

    const textToWrite = newMyFileAsArray.join('\n');
    console.log('🔴🟠🟡🟢🔵🟣 | file: FileDir.svelte | line 208 | FileTree | fs.readdirSync | textToWrite', textToWrite);


    const myNewFileName = myPath.resolve(__dirname, '../rollup.config.new.js');
      console.log('🔴🟠🟡🟢🔵🟣 | file: FileDir.svelte | line 221 | FileTree | fs.readdirSync | myNewFileName', myNewFileName);
        
        fs.writeFileSync(myNewFileName, textToWrite, {encoding: "utf8", flag: "w", mode: 0o666 } );
  }
