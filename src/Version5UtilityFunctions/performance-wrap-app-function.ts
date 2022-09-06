// import type {Filetree} from '../types';

const {ipcRenderer} = require('electron');
const myPath = require('node:path');
const npmAddScript = require('npm-add-script');
const process = require('process');
const fs = require('fs');

/*
 * ==================================================
 *   Hard coded file paths & names
 * ==================================================
 */

export function updatePackageJson(path) {
  const currentDir = process.cwd();
  try {
    // Change the directory
    process.chdir(path);
    ipcRenderer.send('terminal-into', `cd ${path}\r`);

  } catch (err) {
    // Printing error if occurs
    console.error('error while changing directory');
  }
  var content: string = fs.readFileSync(`package.json`).toString();
  if (!content.match(/performance/gm)) {
    try {
      npmAddScript({
        key: 'performance',
        value: 'rollup --config rollup.config.new.js -w',
        force: true,
      });
    } catch (err) {
      console.error(`${err}error while adding sdebug script to package.json`);
    }
  }
  process.chdir(currentDir);
}

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
export function updateRollupConfig(path) {
  const originalConfig = path + '/rollup.config.js';
  const newConfig = path + '/rollup.config.new.js';

  const myFileContent = fs.readFileSync(originalConfig, 'utf8');
  const myFileAsArray = myFileContent.split('\n');

  // As each line is examined we either push it to a new array OR add our lines THEN continue loop and pushing to new Array
  // When done new Array will be written to new file.
  const newMyFileAsArray = [];
  let addedImports = false;

  for (let i = 0; i < myFileAsArray.length; i++) {
    const daLine = myFileAsArray[i].split(' ');
    if (daLine[0] !== 'import' && !addedImports) {
      newMyFileAsArray.push(
        `import banner from '${myPath.resolve(
          __dirname,
          '../src/Version5UtilityFunctions/rollup-plugin-pre-app-end'
        )}';`
      );
      newMyFileAsArray.push(`const path = require('path');`);
      newMyFileAsArray.push(myFileAsArray[i]);
      addedImports = true;
    } else if (myFileAsArray[i].trim() === 'plugins: [') {
      newMyFileAsArray.push(myFileAsArray[i]);
      newMyFileAsArray.push(`    banner({`);
      newMyFileAsArray.push(`      prependFile: '${myPath.resolve(__dirname, 'SvelteStormPerformancePrepend.js')}',` );
      newMyFileAsArray.push(`      appendFile: '${myPath.resolve(__dirname, 'SvelteStormPerformanceAppend.js')}',`);
      newMyFileAsArray.push(`      encoding: 'utf-8', // default is utf-8`);
      newMyFileAsArray.push(`    }),`);
    } else {
      newMyFileAsArray.push(myFileAsArray[i]);
    }
  }

  const textToWrite = newMyFileAsArray.join('\n');

  fs.writeFileSync(newConfig, textToWrite, {
    encoding: 'utf8',
    flag: 'w',
    mode: 0o666,
  });
}
