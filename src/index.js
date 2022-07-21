console.log(`\n🟢🟢🟢🟢🟢🟢🟢🟢🟢🟢🟢🟢🟢🟢🟢🟢🟢🟢🟢🟢🟢🟢🟢🟢🟢🟢🟢🟢`);
const {
  app,
  BrowserWindow,
  dialog,
  ipcMain,
  nativeTheme,
  webContents,
} = require('electron');
// const handleDocuments = require('./App.svelte')
const createApplicationMenu = require('./application-menu');
const path = require('path');
const fs = require('fs');
const os = require('os');
const pty = require('node-pty');
// const { require } = require('@electron/remote');

//dialog is basically an electron modal pop up displaying an error message
//ipcMain is an event emitter that handles messages from the a renderer process
//pty returns a terminal object which allows reading and writing (used with xterm)
require('@electron/remote/main').initialize();
require('@electron/remote/main').enable(webContents);

//hot reload for electron development
try {
  require('electron-reloader')(module);
} catch (err) {
  console.log(err);
}

let userFile = '';

// Handle creating/removing shortcuts on Windows when installing/uninstalling.
if (require('electron-squirrel-startup')) {
  // eslint-disable-line global-require
  app.quit();
}

const windows = new Set();
const openFiles = new Map();

let newWindow;
//app.on is a start of the main process that controls the lifecycle events
//Fires once when app is ready..
app.on('ready', () => {
  createApplicationMenu();
  newWindow = createWindow();
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
   * ==================================================
   *   Create a new Browers Window for display in Electron, but don't show it yet.
   * ==================================================
   */
  let newWindow = new BrowserWindow({
    x,
    y,
    show: false,
    webPreferences: {
      nodeIntegration: true,
      contextIsolation: false,
      enableRemoteModule: true, 
    },
  });

  //theme for the menu bar on top
  nativeTheme.themeSource = 'dark';

  /*
   * ==================================================
   *   Load the initial HTML file into the window.
   * ==================================================
   */
  //loading index.html into the app
  newWindow.loadURL(`file://${path.join(__dirname, '../public/index.html')}`);

  // newWindow.webContents.openDevTools();

  //show window by calling the listener once
  newWindow.once('ready-to-show', () => {
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

  //chokidar is a library that watches the files
  let watcher;
  if (process.env.NODE_ENV === 'development') {
    watcher = require('chokidar').watch(path.join(__dirname, '../public'), {
      ignoreInitial: true,
    });
    watcher.on('change', () => {
      newWindow.reload();
    });
  }

  newWindow.on('closed', () => {
    if (watcher) {
      watcher.close();
    }
    windows.delete(newWindow);
    createApplicationMenu();
    newWindow = null;
  });

  var shell = os.platform() === 'win32' ? 'powershell.exe' : 'bash';

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
    console.log('pty before:', ptyProcess);
    ptyProcess.cwd = cwdFilePath[0];
    console.log(
      '🔴🟠🟡🟢🔵🟣 | file: index.js | line 192 | ipcMain.on | cwdFilePath[0]',
      cwdFilePath[0]
    );
    console.log('pty after:', ptyProcess);
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
    console.log('pty resizing to cols and rows', cols, rows);
    ptyProcess.resize(cols, rows);
  });

  require('electron-reload')(__dirname, {
    electron: path.join(__dirname, '../node_modules', '.bin', 'electron'),
    awaitWriteFinish: true,
  });

  windows.add(newWindow);
  return newWindow;
});

// open browser window when user selects open brower window from file menu
const openBrowserWindow = (exports.openBrowserWindow = () => {
  const browser = new BrowserWindow({
    width: 800,
    height: 600,
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
  browser.webContents.loadURL('http://localhost:8080');
  browser.webContents.openDevTools();
});

//Opening docs in ide browser
// const openDocs = (exports.openDocs = () => {

// })

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
  const content = fs.readFileSync(file).toString();
  app.addRecentDocument(file);
  targetWindow.webContents.send('file-opened', file, content);
  createApplicationMenu();
});

let cwdFilePath;

const getFolderFromUser = (exports.getFolderFromUser = async (targetWindow) => {
  const files = await dialog.showOpenDialog(targetWindow, {
    properties: ['openDirectory'],
  });

  if (files) {
    console.log('files.filePaths:', files.filePaths);
    cwdFilePath = files.filePaths;
    if (files) {
      openFolder(targetWindow, files.filePaths);
    }
  }
});

const createProjectFromUser = (exports.createProjectFromUser = async (
  targetWindow
) => {
  console.log('running createProject method');
  const folderName = await dialog.showSaveDialog(targetWindow, {
    title: 'Create Project',
    properties: ['createDirectory'],
  });

  if (folderName.filePath && !fs.existsSync(folderName.filePath)) {
    await fs.mkdirSync(folderName.filePath);

    openFolder(targetWindow, folderName.filePath);
  }
});

const testFunc = (exports.testFunc = () => {
  // const content = folder;
  console.log('testFunc');
  // targetWindow.webContents.send('folder-opened', folder, content);
  // createApplicationMenu();
});

const openFolder = (exports.openFolder = (targetWindow, folder) => {
  const content = folder;
  console.log('contents', content);
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

ipcMain.handle('saveFileFromUser', saveFile);

ipcMain.handle('getFileFromUser', getFileFromUser);

ipcMain.handle('getFolderFromUser', getFolderFromUser);

ipcMain.handle('increaseFontSize', increaseFontSize);

ipcMain.handle('decreaseFontSize', decreaseFontSize);

ipcMain.handle('createProjectFromUser', createProjectFromUser);

ipcMain.handle('testFunc', testFunc);

ipcMain.on('SNAPSHOT', (event, data) => {
  console.log(BrowserWindow.getAllWindows());
  console.log('DATA SNAPSHOT ', data);
  console.log(`\n🟣🟣🟣🟣🟣🟣🟣🟣🟣🟣🟣🟣🟣🟣🟣🟣🟣🟣🟣🟣🟣🟣🟣🟣🟣🟣🟣🟣`);
  console.log(`\n🔵🔵🔵🔵🔵🔵🔵🔵🔵🔵🔵🔵🔵🔵🔵🔵🔵🔵🔵🔵🔵🔵🔵🔵🔵🔵🔵🔵`);
  console.log('🔴🟠🟡🟢🔵🟣 | file: index.js | line 345 | ipcMain.on | data', data);
  console.log('🔴🟠🟡🟢🔵🟣 | file: index.js | line 351 | ipcMain.on | newWindow', newWindow);
  newWindow.webContents.send('JIMSHOT', data);
});
ipcMain.on('quit-app', () => {
  app.quit();
});
