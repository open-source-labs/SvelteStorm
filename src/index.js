const { app, BrowserWindow, dialog, ipcMain, nativeTheme } = require('electron');
const createApplicationMenu = require('./application-menu');
const path = require('path');
const fs = require('fs')
const os = require('os');
const pty = require('node-pty');

let userFile = ''
// Handle creating/removing shortcuts on Windows when installing/uninstalling.
if (require('electron-squirrel-startup')) {
  // eslint-disable-line global-require
  app.quit();
}

const windows = new Set();
const openFiles = new Map();

app.on('ready', () => {
  
  createApplicationMenu();
  createWindow();
});

app.on('window-all-closed', () => {
  if (process.platform === 'darwin') {
    return false;
  }
});

app.on('activate', (event, hasVisibleWindows) => {
  if (!hasVisibleWindows) { createWindow(); }
});

const increaseFontSize = exports.increaseFontSize = () => {
  console.log("increase font");
}  

const decreaseFontSize = exports.decreaseFontSize = () => {
  console.log("decreas font");
} 
const createWindow = exports.createWindow = () => {
  
  process.env.NODE_ENV = 'development';
  

  let x, y;

  const currentWindow = BrowserWindow.getFocusedWindow();

  if (currentWindow) {
    const [currentWindowX, currentWindowY] = currentWindow.getPosition();
    x = currentWindowX + 10;
    y = currentWindowY + 10;
  }

  let newWindow = new BrowserWindow({ x, y, show: false, webPreferences: {
    nodeIntegration: true,
    contextIsolation: false,
    
  }});

  nativeTheme.themeSource = 'dark'

  newWindow.loadURL(`file://${path.join(__dirname, '../public/index.html')}`);

  newWindow.once('ready-to-show', () => {
    newWindow.show();
  });

  newWindow.on('focus', createApplicationMenu);

  newWindow.on('close', (event) => {
    if (newWindow.isDocumentEdited()) {
      event.preventDefault();

      const result = dialog.showMessageBox(newWindow, {
        type: 'warning',
        title: 'Quit with Unsaved Changes?',
        message: 'Your changes will be lost permanently if you do not save.',
        buttons: [
          'Quit Anyway',
          'Cancel',
        ],
        cancelId: 1,
        defaultId: 0
      });

      if (result === 0) newWindow.destroy();
    }
  });

  let watcher;
  if (process.env.NODE_ENV === 'development') {
    watcher = require('chokidar').watch(path.join(__dirname, '../public'), { ignoreInitial: true });
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

  var shell = os.platform() === "win32" ? "powershell.exe" : "bash";
  var ptyProcess = pty.spawn(shell, [], {
          name: 'xterm-color',
          cols: 80,
          rows: 24,
          cwd: process.env.HOME,
          env: process.env
      });
    
    ptyProcess.on("data", (data) => {
      newWindow.webContents.send("terminal-incData", data);
    });

    ipcMain.on("terminal-into", (event, data)=> {
      ptyProcess.write(data);
    })

require('electron-reload')(__dirname, {
  electron: path.join(__dirname, '../node_modules', '.bin', 'electron'),
  awaitWriteFinish: true
});

  windows.add(newWindow);
  return newWindow;
};


const getFileFromUser = exports.getFileFromUser = async (targetWindow) => {
  const files = await dialog.showOpenDialog(targetWindow, {
    properties: ['openFile'],
  });

  userFile = files

  if(files) {
    if (files) { openFile(targetWindow, files.filePaths[0]); }
  }
}

const openFile = exports.openFile = (targetWindow, file) => {
  
  const content = fs.readFileSync(file).toString();
  //console.log(fileContent)
  app.addRecentDocument(file);
  //targetWindow.setRepresentedFilename(file);
  targetWindow.webContents.send('file-opened', file, content);
  createApplicationMenu();
};

const getFolderFromUser = exports.getFolderFromUser = async (targetWindow) => {
  const files = await dialog.showOpenDialog(targetWindow, {
    properties: ['openDirectory'],
  });

  if(files) {
    console.log(files.filePaths)
    if (files) { openFolder(targetWindow, files.filePaths); }
  }
}

const createProjectFromUser = exports.createProjectFromUser = async (targetWindow) => {
  console.log('running createProject method')
  const folderName = await dialog.showSaveDialog(targetWindow, {
    title: 'Create Project',
    properties: ['createDirectory'],
  });

  // if(files) {
  //   console.log(files.filePaths)
  //   if (files) { openFolder(targetWindow, files.filePaths); }
  // }
  if(folderName.filePath && !fs.existsSync(folderName.filePath)){
    await fs.mkdirSync(folderName.filePath);

    openFolder(targetWindow, folderName.filePath);

  }
}

const openFolder = exports.openFolder = (targetWindow, folder) => {
  const content = folder
  console.log('contents',content)
  //app.addRecentDocument(folder);
  //targetWindow.setRepresentedFilename(file);
  targetWindow.webContents.send('folder-opened', folder, content);
  createApplicationMenu();
};

const saveFile = exports.saveFile = (targetWindow) => {


  ipcMain.on('synchronous-message', (event, arg) => {
    //console.log(arg) // prints "ping"
    if(arg.file === undefined) { 
      fs.writeFileSync(userFile.filePaths[0], arg.content)
      openFile(targetWindow, userFile.filePaths[0]);
    } else {
      fs.writeFileSync(arg.file, arg.content)
      openFile(targetWindow, arg.file);
    }
    
  })

 };

ipcMain.handle('saveFileFromUser', saveFile)

ipcMain.handle('getFileFromUser', getFileFromUser)

ipcMain.handle('getFolderFromUser', getFolderFromUser)

ipcMain.handle('increaseFontSize', increaseFontSize)

ipcMain.handle('decreaseFontSize', decreaseFontSize)

ipcMain.handle('createProjectFromUser', createProjectFromUser)