<script lang="ts">
  import FileTest from './FileTest.svelte';  
  import DirTopMenu from './DirTopMenu.svelte'  
  import { afterUpdate, onDestroy } from 'svelte';
  import {get} from 'svelte/store';
  import {DirectoryData, appBeingDebugedPath, appPerformanceMonitoredPath} from '../DataStore/SvelteStormDataStore';
  import type { Filetree } from '../types';
  import { updatePackageJson, updateRollupConfig } from '../Version4UtilityFunctions/wrap-app-functions'
  
  const {ipcRenderer} = require('electron');
  const fs = require('fs');
    
  export let activeDir = '';
  export let reload = false;
  
  let savedTree: string[];
  let updateRollupConfigRun = false;
  let directory;
  let rename;
  let stateObj = {};
  let fsTimeout;
  const svelteFileArray = [];
  let mainDir = '';

  const unsub = DirectoryData.subscribe((data) => {
    rename = data.rename;
    activeDir = data.activeDir;
    mainDir = data.mainDir;
    reload = data.reload;
  });

  afterUpdate(() => {
    if (reload) {
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
          let files: string = readfiles.filter((file) => file !== '.git' && file !== '.DS_Store');
          if (files.length) {
            var fileTree: Filetree = new FileTree(directory);
            fileTree.build();
            savedTree = fileTree.items;
            savedTree.sort((a: any, b: any) => {
              return (fs.statSync(a.path).isDirectory() === fs.statSync(b.path).isDirectory() ? 0 : fs.statSync(a.path).isDirectory() ? -1 : 1)
            });

            DirectoryData.update((currentData) => {
              return {
                ...currentData,
                fileTree: savedTree,
                currentDir: directory,
                mainDir: directory,
              }
            })
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

  //method to read all the files inside the directory
  const readFileNames = (mainDir) => {
    if (mainDir) {
      var fileTree: Filetree = new FileTree(mainDir);
      fileTree.build();
      savedTree = fileTree.items;
      savedTree.sort((a: any, b: any) => {
        return (fs.statSync(a.path).isDirectory() === fs.statSync(b.path).isDirectory() ? 0 : fs.statSync(a.path).isDirectory() ? -1 : 1)
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
      var fileArray = [];

      if (!updateRollupConfigRun) {
        // Reads current rollup.config.js file and writes it to rollup.config.new.js with two additions: 1-imports custom rollup plug-in and path 2-adds banner to plugin section
        // The purpose of this is to "wrap" the app being debugged in our code to add event listeners to report state changes back to Svelte Storm (using append and prepend files within pubic)
        updateRollupConfig(path);
        updatePackageJson(path);
        // Builds componentRelationships (nested objects to represent what components are imported into each component) which is used to build the d3 representation of state
        getComponentRelationships();
        $appBeingDebugedPath = path;
        $appPerformanceMonitoredPath = path; 
        updateRollupConfigRun = true;
      }


      fs.readdirSync(path).forEach((file) => {
        var fileInfo:Filetree = new FileTree(`${path}/${file}`, file);
        var stat = fs.statSync(fileInfo.path);
        //2022-ST-RJ reading svelte files to help construct state management tree. storing info in the stateObj of the DirectoryStore aliased as DirectoryData

        if (file.split('.').pop() === 'svelte') {
          if (path.includes('node_modules') !== true) {
            var content: string = fs.readFileSync(`${path}/${file}`).toString();
            var stateArr: string[] = [];
            const parentName = file.split('.')[0];
            svelteFileArray.push([parentName, content]);

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

        if (fileInfo.name !== '.git' && fileInfo.name !== '.DS_Store') {
          fileArray.push(fileInfo);
        }
      });

      // adds componentRelationships to store
      async function getComponentRelationships() {
        const fileArr = await svelteFileArray;
        const componentRelationships = {};
        const relationships = {};

        // adds all component relationships to relationships array
        fileArr.forEach((file) => {
          const [fileName, fileContent] = file;
          const newRelationship = getRelationship(fileName, fileContent);
          if (newRelationship) {
            relationships[fileName] = newRelationship;
          }
        });

        // recursively starts at App to loop through relationships to build componentRelationships to be added to store
        function buildComponentRelationships(placeInTree, currFile) {
          if (relationships.hasOwnProperty(currFile)) {
            const insertObject = {};
            const relationshipReference = relationships[currFile][currFile];
            for (let element in relationshipReference) {
              insertObject[element] = relationshipReference[element][element];
            }
            placeInTree[currFile] = insertObject;
            for (let element in insertObject) {
              buildComponentRelationships(placeInTree[currFile], element);
            }
          } else {
            placeInTree[currFile] = {};
            return;
          }
        }

        // invocation of above buildComponentRelationships function on App
        buildComponentRelationships(componentRelationships, 'App');

        // add relationship tree to store
        DirectoryData.update((currentData) => {
          return {
            ...currentData,
            componentRelationships: componentRelationships,
          };
        });
      }

      // helper function for buildComponentRelationships to get parent child relationship within a Svelte component file
      function getRelationship(file, content) {
        const regexImports = /\bimport\s+.+\.svelte\'\;*$/gm
        const importsArray = content.match(regexImports);
        if (importsArray) {
          const relationship = {};
          relationship[file] = {};

          for (let element of importsArray) {
            let importArray = element.split(' ');
            let compName = importArray[1];
            relationship[file][compName] = {};
          }
          return relationship;
        } else return;
      }

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
