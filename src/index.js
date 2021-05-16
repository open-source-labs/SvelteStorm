const { app, BrowserWindow, dialog, ipcMain } = require('electron');
const createApplicationMenu = require('./application-menu');
const path = require('path');
const fs = require('fs');

require('electron-reload')(__dirname, {
  electron: path.join(__dirname, '../node_modules', '.bin', 'electron'),
  awaitWriteFinish: true
});

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

const createWindow = exports.createWindow = () => {
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

  newWindow.loadURL(`file://${path.join(__dirname, '../public/index.html')}`);
  newWindow.webContents.openDevTools();

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

  newWindow.on('closed', () => {
    windows.delete(newWindow);
    createApplicationMenu();
    newWindow = null;
  });

  windows.add(newWindow);
  return newWindow;
};

const getFileFromUser = exports.getFileFromUser = async (targetWindow) => {
  const files = await dialog.showOpenDialog(targetWindow, {
    properties: ['openFile'],
  });
  
  if(files) {
    if (files) { openFile(targetWindow, files.filePaths[0]); }
  }
}

const openFile = exports.openFile = (targetWindow, file) => {
  const content = fs.readFileSync(file).toString();
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

const openFolder = exports.openFolder = (targetWindow, folder) => {
  const content = folder
  //app.addRecentDocument(folder);
  //targetWindow.setRepresentedFilename(file);
  targetWindow.webContents.send('folder-opened', folder, content);
  createApplicationMenu();
};

ipcMain.handle('getFileFromUser', getFileFromUser)

ipcMain.handle('getFolderFromUser', getFolderFromUser)

