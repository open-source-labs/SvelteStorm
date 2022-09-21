const {
  app,
  BrowserWindow,
  dialog,
  ipcMain,
  nativeTheme,
  webContents,
  Menu
} = require('electron');
const createApplicationMenu = require('./application-menu');
const path = require('path');
const fs = require('fs');
const os = require('os');
const pty = require('node-pty');

//dialog is basically an electron modal pop up displaying an error message
//ipcMain is an event emitter that handles messages from the renderer processes
//pty returns a terminal object which allows reading and writing (used with xterm)
require('@electron/remote/main').initialize();
require('@electron/remote/main').enable(webContents);

//hot reload for electron development
// try {
//   require('electron-reloader')(module);
// } catch (err) {
//   console.log(err);
// }

let userFile = '';

// Handle creating/removing shortcuts on Windows when installing/uninstalling.
if (require('electron-squirrel-startup')) {
  // eslint-disable-line global-require
  app.quit();
}

const windows = new Set();
const openFiles = new Map();

// init newWindow - newWindow is the name of the entire Svelte Storm window (created in the creatWindow function)
let newWindow;
// init browser - window name of the developers app they open in Svelte Storm (created in the openBrowserWindow function)
let browser;

//app.on is a start of the main process that controls the lifecycle events
//Fires once when app is ready..
app.on('ready', () => {
  createWindow();
});

//testing to see if on mac, don't close all the windows
app.on('window-all-closed', () => {
  if (process.platform === 'darwin') {
    //darwin for mac and win32 for windows
    return false;
  }
});

//activate occurs when the application is activated or run for the first time
//returns an event
app.on('activate', (event, hasVisibleWindows) => {
  if (!hasVisibleWindows) {
    createWindow();
  }
});

const increaseFontSize = (exports.increaseFontSize = () => {
  fontSize++;
});

const decreaseFontSize = (exports.decreaseFontSize = () => {
  fontSize--;
});

//still in development mode
const createWindow = (exports.createWindow = () => {
  process.env.NODE_ENV = 'development';

  let x, y;
  //getFocusedWindow returns the browser window or null
  const currentWindow = BrowserWindow.getFocusedWindow();

  if (currentWindow) {
    const [currentWindowX, currentWindowY] = currentWindow.getPosition();
    x = currentWindowX + 10;
    y = currentWindowY + 10;
  }

  // But if you want to keep the abilities of using Node.js and Electron APIs,
  // you have to rename the symbols in the page before including other libraries:
  //window.nodeRequire = require; in html file

  /*
   * =================== SS4 ==========================
   *   Create a new Browser Window for display in
   *   Electron, but don't show it yet. This function
   *   created the window the contains all of
   *   SvelteStorm
   * ==================================================
   */
  newWindow = new BrowserWindow({
    width: 1400,
    height: 1300,
    x: 20,
    y: 20,
    show: false,
    webPreferences: {
      nodeIntegration: true,
      contextIsolation: false,
      experimentalFeatures: true,
      allowRunningInsecureContent: true,
      webSecurity: false,
      nodeIntegrationInSubFrames: true,
      nodeIntegrationInWorker: true,
      enableRemoteModule: true,
    },
    //add electron app icon
    icon: path.join(__dirname, '../public/img/icon.ico'),
  });

  //theme for the menu bar on top
  nativeTheme.themeSource = 'dark';

  /*
   * ==================================================
   *   Load the initial HTML file into the window.
   * ==================================================
   */
  //loading index.html into the app
  // newWindow.loadURL(`file://${path.join(__dirname, '../public/index.html')}`);
  newWindow.loadFile(path.join(__dirname, '../public/index.html'));

  // newWindow.webContents.openDevTools();
  // let watcher;

  //show window by calling the listener once
  newWindow.on('ready-to-show', () => {
    newWindow.show();
  });
  newWindow.on('focus', createApplicationMenu);

  //save changes dialog modal message
  newWindow.on('close', (event) => {
    if (newWindow.isDocumentEdited()) {
      event.preventDefault();

      const result = dialog.showMessageBox(newWindow, {
        type: 'warning',
        title: 'Quit with Unsaved Changes?',
        message: 'Your changes will be lost permanently if you do not save.',
        buttons: ['Quit Anyway', 'Cancel'],
        cancelId: 1,
        defaultId: 0,
      });

      if (result === 0) newWindow.destroy();
    }
  });

  newWindow.on('closed', () => {
    windows.delete(newWindow);
    createApplicationMenu();
    newWindow = null;
  });
<<<<<<< HEAD

  var shell = os.platform() === 'win32' ? 'powershell.exe' : 'zsh';

  // this spawns the terminal window space
  var ptyProcess = pty.spawn(shell, [], {
    name: 'xterm-color',
    cols: 80,
    rows: 24,
    cwd: process.env.HOME,
    // cwd: cwdFilePath,
    env: process.env,
  });

  //2022-ST-AJ sends to renderer cwd for it to display on prompt
  // ipcMain.on('cwd', (event, data) => {
  //   event.reply('cwdreply', process.env.PWD);
  // });

  // add ipc listen for open folder and reassign ptyProcess.cwd to actual cwd
  ipcMain.on('openFolder', (event, data) => {
    ptyProcess.cwd = cwdFilePath[0];
  });

  //2022-ST-AJ node-pty listens to data and send whatever it receives back to xterm to render
  ptyProcess.onData((data) => {
    newWindow.webContents.send('terminal-incData', data);
  });

  //2022-ST-AJ ipcMain listens on data passed from xterm to write to shell
  ipcMain.on('terminal-into', (event, data) => {
    ptyProcess.write(data);
  });

  //2022-ST-AJ ipcMain listens to resizing event from renderer and calls resize on node-pty to align size between node-pty and xterm. They need to align otherwise there are wierd bugs everywhere.
  ipcMain.on('terminal-resize', (event, size) => {
    const cols = size.cols;
    const rows = size.rows;
    ptyProcess.resize(cols, rows);
  });

  require('electron-reload')(__dirname, {
    electron: path.join(__dirname, '../node_modules', '.bin', 'electron'),
    awaitWriteFinish: true,
  });

=======
>>>>>>> dev
  windows.add(newWindow);

});

/* 
  * Below code (shell and ptyProcess) was previously inside createWindow fxn but 
  * was causing issues w/ re-activation. Moving it outside of the fxn below
  * allows re-activation app but still not perfect implementation
*/
const shell = os.platform() === 'win32' ? 'powershell.exe' : 'zsh';
// this spawns the terminal window space
const ptyProcess = pty.spawn(shell, [], {
  name: 'xterm-color',
  cols: 80,
  rows: 24,
  cwd: process.env.HOME,
  // cwd: cwdFilePath,
  env: process.env,
});

//2022-ST-AJ sends to renderer cwd for it to display on prompt
// ipcMain.on('cwd', (event, data) => {
//   event.reply('cwdreply', process.env.PWD);
// });

// add ipc listen for open folder and reassign ptyProcess.cwd to actual cwd
ipcMain.on('openFolder', (event, data) => {
  ptyProcess.cwd = cwdFilePath[0];
});

//2022-ST-AJ node-pty listens to data and send whatever it receives back to xterm to render
ptyProcess.onData((data) => {
  newWindow.webContents.send('terminal-incData', data);
});

//2022-ST-AJ ipcMain listens on data passed from xterm to write to shell
ipcMain.on('terminal-into', (event, data) => {
  ptyProcess.write(data);
});

//2022-ST-AJ ipcMain listens to resizing event from renderer and calls resize on node-pty to align size between node-pty and xterm. They need to align otherwise there are wierd bugs everywhere.
ipcMain.on('terminal-resize', (event, size) => {
  const cols = size.cols;
  const rows = size.rows;
  ptyProcess.resize(cols, rows);
});

require('electron-reload')(__dirname, {
  electron: path.join(__dirname, '../node_modules', '.bin', 'electron'),
  awaitWriteFinish: true,
});

 /*
   * ==================================================
   *   Create a new Browers Window for displaying the users app.
   *   Note that the web preferences allow the browser window to read and run the injected debugging script
   * ==================================================
 */

const openBrowserWindow = (exports.openBrowserWindow = (portToOpen) => {
  browser = new BrowserWindow({
    width: 650,
    height: 1100,
    x: 1440,
    y: 20,
    webPreferences: {
      nodeIntegration: true,
      contextIsolation: false,
      experimentalFeatures: true,
      allowRunningInsecureContent: true,
      webSecurity: false,
      nodeIntegrationInSubFrames: true,
      nodeIntegrationInWorker: true,
      enableRemoteModule: true,
    },
  });
  browser.webContents.loadURL(`http://localhost:${portToOpen}`);
});

// gets and opens the file that the user selects from the File menu
const getFileFromUser = (exports.getFileFromUser = async (targetWindow) => {
  const files = await dialog.showOpenDialog(targetWindow, {
    properties: ['openFile'],
  });

  userFile = files;

  if (files) {
    if (files) {
      openFile(targetWindow, files.filePaths[0]);
    }
  }
});

const openFile = (exports.openFile = (targetWindow, file) => {
  try {
  const content = fs.readFileSync(file).toString();
  app.addRecentDocument(file);
  targetWindow.webContents.send('file-opened', file, content);
  createApplicationMenu();
  } catch (err) {
    console.log('Error occured while opening the file: ', {err})
  }
});

let cwdFilePath;

// gets and opens the folder that the user selects from the File menu
const getFolderFromUser = (exports.getFolderFromUser = async (targetWindow) => {
  const files = await dialog.showOpenDialog(targetWindow, {
    properties: ['openDirectory'],
  });

  if (files) {
    cwdFilePath = files.filePaths;
    if (files) {
      openFolder(targetWindow, files.filePaths);
    }
  }
});

const createProjectFromUser = (exports.createProjectFromUser = async (
  targetWindow
) => {
  const folderName = await dialog.showSaveDialog(targetWindow, {
    title: 'Create Project',
    properties: ['createDirectory'],
  });

  if (folderName.filePath && !fs.existsSync(folderName.filePath)) {
    await fs.mkdirSync(folderName.filePath);

    openFolder(targetWindow, folderName.filePath);
  }
});

const openFolder = (exports.openFolder = (targetWindow, folder) => {
  const content = folder;
  targetWindow.webContents.send('folder-opened', folder, content);
  createApplicationMenu(app);
});

const saveFile = (exports.saveFile = (targetWindow) => {
  ipcMain.on('synchronous-message', (event, arg) => {
    if (arg.file === undefined) {
      fs.writeFileSync(userFile.filePaths[0], arg.content);
      openFile(targetWindow, userFile.filePaths[0]);
    } else {
      fs.writeFileSync(arg.file, arg.content);
      openFile(targetWindow, arg.file);
    }
  });
});

// handlers for various operations
ipcMain.handle('saveFileFromUser', saveFile);

ipcMain.handle('getFileFromUser', getFileFromUser);

ipcMain.handle('getFolderFromUser', getFolderFromUser);

ipcMain.handle('increaseFontSize', increaseFontSize);

ipcMain.handle('decreaseFontSize', decreaseFontSize);

ipcMain.handle('createProjectFromUser', createProjectFromUser);

ipcMain.on('openDebugAppWindow', (event, localhostToUse)=> {
  if(localhostToUse.length === 4 || localhostToUse.length === 5) openBrowserWindow(localhostToUse);
});

/*
   * ==================================================
   *   The injected debugging script uses the ipcRenderer in the browser window to send snapshots when there are state changes
   *   The snapshots are sent to ipcMain and then are fowarded to the Chart.svelte file
   * ==================================================
*/

ipcMain.on('SNAPSHOT', (event, data) => {
  newWindow.webContents.send('SNAPSHOT', data);
});

/*
   * ==================================================
   *   The injected app health monitoring script uses the ipcRenderer in the browser window to emit a signal with web-vitals data.
   *   That data is then sent to ipcMain (received below) and is then fowarded to the WebVitals component where an
   *   ipcRenderer listens for the "web-vitals" signal to take in the web-vitals data.
   * ==================================================
*/
ipcMain.on('web-vitals', (event, args) => {
  // console.log(args);
  newWindow.webContents.send('web-vitals', args)
});

ipcMain.on('PERFORMANCE', (event, args) => {
  newWindow.webContents.send('PERFORMANCE', args);
});

// close app when quiting
ipcMain.on('quit-app', () => {
  app.quit();
});

/*
   * ==================================================
   *   When the user selects a specific snapshot to display, a message is sent to ipcMain called 'TIME_TRAVEL'
   *   When that message is received, we forward the data to the browser window.
   * ==================================================
*/

ipcMain.on('TIME_TRAVEL', (event, data) => {
  const instance = {
    message: "TIME_TRAVEL",
    ctxIndex: data
  };
  // Use browser window to send time-travel message
  browser.webContents.send('TIME_TRAVEL', instance);
})

/*
   * ==================================================
   *   When the user selects reset button, a message is sent to ipcMain called 'REFRESH'
   *   When that message is received, we forward the data to the browser window.
   * ==================================================
*/

ipcMain.on('REFRESH', (event, data) => {
  const instance = {
    message: "REFRESH",
    ctxIndex: data
  };
  // Use browser window to send REFRESH message
  browser.webContents.send('REFRESH', instance);
})

//--------------- FOR TESTING -----------------
ipcMain.on('new-window', () => {
  createWindow()
})

// testing main synchronous data passing
function mainSynchronousData() {
  return 'Main Synchronous Data'
}

ipcMain.on('main-synchronous-data', (event, arg) => {
  return mainSynchronousData()
})

// testing main asynchronous data passing
async function mainAsynchronousData() {
  return new Promise(resolve => {
    setTimeout(() => {
      resolve('Main Asynchronous Data')
    }, 1000)
  })
}

ipcMain.on('main-asynchronous-data', async (event, arg) => {
  return await mainAsynchronousData()
})
