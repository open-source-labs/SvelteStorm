import { _electron as electron } from "playwright";
import { test, expect } from "@playwright/test";
import { 
  clickMenuItemById,
  findLatestBuild, 
  ipcMainCallFirstListener, 
  ipcRendererCallFirstListener, 
  parseElectronApp,
  ipcMainInvokeHandler,
  ipcRendererInvoke
} from 'electron-playwright-helpers'

test("Launch electron app", async () => {
  // Launch electron app
  const electronApp = await electron.launch({ args: ["."] });

  const windowState: {
    isVisible: boolean;
    isDevToolsOpened: boolean;
    isCrashed: boolean;
  } = await electronApp.evaluate(async ({ BrowserWindow }) => {
    const mainWindow = BrowserWindow.getAllWindows()[0];

    const getState = () => ({
      isVisible: mainWindow.isVisible(),
      isDevToolsOpened: mainWindow.webContents.isDevToolsOpened(),
      isCrashed: mainWindow.webContents.isCrashed(),
    });

    return new Promise((resolve) => {
      if (mainWindow.isVisible()) {
        resolve(getState());
      } else {
        mainWindow.once("ready-to-show", () =>
          setTimeout(() => resolve(getState()), 0)
        );
      }
    });
  });

  // Expect the following
  expect(windowState.isVisible, "Expect window to be visible").toBeTruthy();
  expect(windowState.isDevToolsOpened, "Expect Dev Tools to be closed").toBeFalsy();
  expect(windowState.isCrashed, "Expect Window to not Crash").toBeFalsy();

  await electronApp.close();
});

test.describe("Check Main Page", async () => {
  let electronApp;
  let firstWindow;

  test.beforeAll(async () => {
    electronApp = await electron.launch({ args: ["."] });
    firstWindow = await electronApp.firstWindow();
  });

  test("Check title", async () => {
    const title = await firstWindow.title();
    expect(title).toBe("SvelteStorm");
  });

  test('Trigger IPC listener via main process', async () => {
    electronApp.evaluate(({ ipcMain }) => {
      ipcMain.emit('new-window')
    })
    const newPage = await electronApp.waitForEvent('window')
    expect(newPage).toBeTruthy()
    firstWindow = newPage
  })

  test('Send IPC message from Renderer to Main and open new window', async () => {
    // evaluate this script in render process
    // requires webPreferences.nodeIntegration true and contextIsolation false
    await firstWindow.evaluate(() => {
      require('electron').ipcRenderer.send('openDebugAppWindow', '8080')
    })
    
    const newPage = await electronApp.waitForEvent('window')
    expect(newPage).toBeTruthy()
    firstWindow = newPage
  })
  
  test('receive synchronous data via ipcMainCallFirstListener()', async () => {
    const data = await ipcMainCallFirstListener(electronApp, 'main-synchronous-data')
    expect(data).toBe('Main Synchronous Data')
  })
  
  test('receive asynchronous data via ipcMainCallFirstListener()', async () => {
    const data = await ipcMainCallFirstListener(electronApp, 'main-asynchronous-data')
    expect(data).toBe('Main Asynchronous Data')
  })

  test.afterAll(async () => {
    await electronApp.close();
  });

});