<script lang="ts">
    import FileTest from './FileTest.svelte';  
    import DirTopMenu from './DirTopMenu.svelte'  
    import { onMount, onDestroy, afterUpdate} from 'svelte';
    import { DirectoryData } from '../Utilities/DirectoryStore';
    import type { Filetree } from '../types'
    import {get} from 'svelte/store'
    const myPath = require('node:path');
    const npmAddScript = require('npm-add-script');
    const process = require('process');

  const fs = require('fs');
  let savedTree: string[];
  let updateRollupConfigRun = false;
  const {ipcRenderer} = require('electron');

  let directory;
  let rename;
  let stateObj = {};
  let parentChildTree = {};
  let resultArr: [] = [];
  let fsTimeout;
  let removeLater;
  export let activeDir = '';
  let mainDir = '';
  export let reload = false;

  DirectoryData.subscribe((data) => {
    removeLater = data.parentChildTree;
  });

  const unsub = DirectoryData.subscribe((data) => {
    rename = data.rename;
    activeDir = data.activeDir;
    mainDir = data.mainDir;
    reload = data.reload;
  });

  afterUpdate(() => {
    if (reload) {
      console.log('reloading now');
      readFileNames(directory);
      DirectoryData.update((currentData) => {
        return {
          ...currentData,
          reload: false,
        };
      });
    }
    if (activeDir) {
      fs.watch(activeDir, (eventType) => {
        console.log('directory', directory);
        if (eventType === 'rename' && !fsTimeout) {
          readFileNames(mainDir);
        }
        if (!fsTimeout) {
          fsTimeout = setTimeout(function () {
            fsTimeout = null;
          }, 3000);
        }
      });
    }
  });

  onDestroy(() => {
    unsub();
  });

  ipcRenderer.on(
    'folder-opened',
    function (evt, file: string, content: string) {
      directory = Array.isArray(content) ? content[0] : content;
      if (directory) {
        fs.readdir(directory, (error, readfiles) => {
          let files: string = readfiles.filter((file) => file !== '.git');
          if (files.length) {
            var fileTree: Filetree = new FileTree(directory);
            fileTree.build();
            savedTree = fileTree.items;
            savedTree.sort((a: any, b: any) => {
              return fs.statSync(a.path).isDirectory() ===
                fs.statSync(b.path).isDirectory()
                ? 0
                : fs.statSync(a.path).isDirectory()
                ? -1
                : 1;
            });

            DirectoryData.update((currentData) => {
              return {
                ...currentData,
                fileTree: savedTree,
                currentDir: directory,
                mainDir: directory,
              };
            });
          } else {
            DirectoryData.update((currentData) => {
              return {
                ...currentData,
                activeDir: directory,
                mainDir: directory,
              };
            });
          }
        });
      }
    }
  );

  //
  //method to read all the files inside the directory
  const readFileNames = (mainDir) => {
    if (mainDir) {
      var fileTree: Filetree = new FileTree(mainDir);
      fileTree.build();
      savedTree = fileTree.items;
      savedTree.sort((a: any, b: any) => {
        return fs.statSync(a.path).isDirectory() ===
          fs.statSync(b.path).isDirectory()
          ? 0
          : fs.statSync(a.path).isDirectory()
          ? -1
          : 1;
      });

      DirectoryData.update((currentData) => {
        return {
          ...currentData,
          fileTree: savedTree,
        };
      });
    }
  };

  class FileTree {
    constructor(path: string, name: string | null = null) {
      this.path = path;
      this.name = name;
      this.items = [];
      this.state = {
        path: path,
        name: name,
        items: [],
        color: 'white',
        isOpen: false,
      };
    }
    //method to build file tree
    build(this: Filetree) {
      this.items = FileTree.readDir(this.path);
    }

    static readDir(path) {
      console.log('🔴🟠🟡🟢🔵🟣 | file: FileDir.svelte | line 136 | FileTree | readDir | path', path);
      var fileArray = [];

      /*
       * ==================================================
       *   2022-07-19 Jim White & Ryan Huie
       *
       *   Read current rollup.config.js file and write it
       *   to rollup.config.new.js.
       *
       *   The new file will contain two additional
       *   import statements:
       *     o  One for importing a custom rollup pluging
       *     o  One for importing path
       *
       *   The new file will also contain a new
       *   plugin section.
       *
       *         banner({
       *           prependFile: '${myPath.resolve(__dirname, 'SvelteStormdebugPrepend.js')}',
       *           appendFile: '${myPath.resolve(__dirname, 'SvelteStormdebugAppend.js')}',
       *           encoding: 'utf-8', // default is utf-8
       *         }),
       *
       *   This will result in SvelteStorm "wrapping" the
       *   app being debugged in our code which adds event
       *   listeners to report state changes back to
       *   SvelteStorm.
       *
       * ==================================================
       */

      if (!updateRollupConfigRun) {
        updateRollupConfig(path);
        updatePackageJson(path);
        updateRollupConfigRun = true;
      }

      function updatePackageJson(path) {
        try {
          // Change the directory
          process.chdir(path);
          ipcRenderer.send("terminal-into", `cd ${path}\r`);

          console.log('directory has successfully been changed');
        } catch (err) {
          // Printing error if occurs
          console.error('error while changing directory');
        }
        var content: string = fs.readFileSync(`package.json`).toString();
        if(!content.match(/sdebug/gm)){

            try {
              npmAddScript({
                key: 'sdebug',
                value: 'rollup --config rollup.config.new.js -w',
                force: true,
              });
              console.log('Added sdebug script to package.json');
            } catch (err) {
              console.error(`${err}error while adding sdebug script to package.json`);
            }
          }
        }

      function updateRollupConfig(path) {
        // console.log('🔴🟠🟡🟢🔵🟣🔴🟠🟡🟢🔵🟣🔴🟠🟡🟢🔵🟣🔴🟠🟡🟢🔵🟣🔴🟠🟡🟢🔵🟣🔴🟠🟡🟢🔵🟣🔴🟠🟡🟢🔵🟣🔴🟠🟡🟢🔵🟣');
        // console.log('🔴🟠🟡🟢🔵🟣 | file: FileDir.svelte | line 144 | FileTree | updateRollupConfig | path', path);
        // console.log('🔴🟠🟡🟢🔵🟣🔴🟠🟡🟢🔵🟣 | file: FileDir.svelte | line 145 | FileTree | fs.readdirSync | file🔴🟠🟡🟢🔵🟣', file);
        // console.log('🔴🟠🟡🟢🔵🟣🔴🟠🟡🟢🔵🟣🔴🟠🟡🟢🔵🟣🔴🟠🟡🟢🔵🟣🔴🟠🟡🟢🔵🟣🔴🟠🟡🟢🔵🟣🔴🟠🟡🟢🔵🟣🔴🟠🟡🟢🔵🟣');
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
                '../src/StateManager/SvelteStormUtils/rollup-plugin-pre-app-end'
              )}';`
            );
            newMyFileAsArray.push(`const path = require('path');`);
            newMyFileAsArray.push(myFileAsArray[i]);
            addedImports = true;
          } else if (myFileAsArray[i].trim() === 'plugins: [') {
            newMyFileAsArray.push(myFileAsArray[i]);
            newMyFileAsArray.push(`banner({`);
            newMyFileAsArray.push(
              `prependFile: '${myPath.resolve(
                __dirname,
                'SvelteStormdebugPrepend.js'
              )}',`
            );
            newMyFileAsArray.push(
              `appendFile: '${myPath.resolve(
                __dirname,
                'SvelteStormdebugAppend.js'
              )}',`
            );
            newMyFileAsArray.push(`encoding: 'utf-8', // default is utf-8`);
            newMyFileAsArray.push(` }),`);
          } else {
            newMyFileAsArray.push(myFileAsArray[i]);
          }
        }
        // console.log('🔴🟠🟡🟢🔵🟣 | file: FileDir.svelte | line 176 | FileTree | fs.readdirSync | newMyFileAsArray', newMyFileAsArray);

        const textToWrite = newMyFileAsArray.join('\n');
        // console.log('🔴🟠🟡🟢🔵🟣 | file: FileDir.svelte | line 208 | FileTree | fs.readdirSync | textToWrite', textToWrite);

        // const myNewFileName = myPath.resolve(__dirname, '../rollup.config.new.js');
        //   console.log('🔴🟠🟡🟢🔵🟣 | file: FileDir.svelte | line 221 | FileTree | fs.readdirSync | myNewFileName', myNewFileName);

        fs.writeFileSync(newConfig, textToWrite, {
          encoding: 'utf8',
          flag: 'w',
          mode: 0o666,
        });
      }

      fs.readdirSync(path).forEach((file) => {
        var fileInfo: Filetree = new FileTree(`${path}/${file}`, file);
        var stat = fs.statSync(fileInfo.path);
        //2022-ST-RJ reading svelte files to help construct state management tree. storing info in the stateObj of the DirectoryStore aliased as DirectoryData

        if (file.split('.').pop() === 'svelte') {
          if (path.includes('node_modules') !== true) {
            var content: string = fs.readFileSync(`${path}/${file}`).toString();
            var stateArr: string[] = [];

            /*
             * ==================================================
             *   2022-07-20 Jim White & Ryan Huie
             *
             *   When SvelteStorm opens a Folder ... it builds a
             *   file tree of all the files in the project
             *   (including node_modules).  As it builds this
             *   tree it also opens and examines all the .svelte
             *   files looking to identify the Svelte Data Store
             *   within each file (Existing feature in
             *   SvelteStore 3.0).  We (SvelteStorm 4.0 team) are
             *   piggy backing on this existing file scrapping
             *   to also scrape for Parent Child relationships.
             *
             *   We assume that the 'name of the file' is the
             *   'Parent' component and that any
             *   'import *.svelte' files represent the  children
             *   of that parent.
             *
             *
             * ==================================================
             */

            const regexImports = /\bimport\s+.+\.svelte\'\;$/gm;
            const importsArray = content.match(regexImports);

            if (importsArray) {
              let tParentChildTree = {};

              tParentChildTree[file] = {};

              for (let i = 0; i < importsArray.length; i++) {
                let foundComp = importsArray[i].split(' ');
                let reallyFoundComp = foundComp[1];
                tParentChildTree[file][reallyFoundComp] = {};
              }

              console.log(
                '🔴🟠🟡🟢🔵🟣 | file: FileDir.svelte | line 30 | FileTree | fs.readdirSync | tParentChildTree',
                tParentChildTree
              );

              // parentChildTree[file] =
              DirectoryData.update((currentData) => {
                return {
                  ...currentData,
                  ParentChildTree: tParentChildTree,
                };
              });

              const thereYet = get(DirectoryData);
              console.log(
                '🔴🟠🟡🟢🔵🟣 | file: FileDir.svelte | line 325 | FileTree | fs.readdirSync | thereYet',
                thereYet
              );
            }

            /*
             * ==================================================
             *   StelteStorm 3.0 Team
             *
             *   Looking in each .svelte file for either
             *     export let ...
             *     export const ...
             *   to determine the Data Stores in each file.
             *
             *   Splitting contents of svelte files at carriage
             *   returns and newline. The ? signifies once or
             *   none occurrence...look for carriage return and
             *   split if it exists, otherwise split at newline?
             *
             * ==================================================
             */

            var value = content.split(/\r?\n/);
            if (value !== ['']) {
              value.forEach((el) => {
                if (el && el.includes('export')) {
                  el = el.replace(/\s/g, '');
                  if (el.includes('exportlet')) {
                    el = el.replace('exportlet', '');
                    stateArr.push(el.replace(';', ''));
                  }
                  if (el.includes('exportconst')) {
                    el = el.replace('exportconst', '');
                    stateArr.push(el.replace(';', ''));
                  }

                  stateObj[file] = stateArr;
                }
                DirectoryData.update((currentData) => {
                  return {
                    ...currentData,
                    stateObj: stateObj,
                  };
                });
              });
            }
          }
        }
        if (stat.isDirectory()) {
          fileInfo.items = FileTree.readDir(fileInfo.path);
        }

        if (fileInfo.name !== '.git') {
          fileArray.push(fileInfo);
        }
      });

      return fileArray;
    }
  }
</script>

<!-- HTML -->

<div class="directoryContainer">
  <DirTopMenu />
  {#if directory}
    <FileTest fileTree={savedTree} />
  {/if}
</div>

<!-- CSS -->
<style>
  .directoryContainer {
    max-height: 70vh;
    overflow-y: scroll;
    display: flex;
    flex-direction: column;
    align-content: flex-start;
  }
  .directoryContainer::-webkit-scrollbar {
    width: 12px;
  }
  .directoryContainer::-webkit-scrollbar-thumb:hover {
    background-color: rgba(28, 28, 36, 0.678);
    transition: background-color 2s ease-in-out;
  }
</style>
