import { _electron as electron } from "playwright";
import { test, expect } from "@playwright/test";

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

  test("Check version number: APP", async () => {
    const versionNumberApp = await firstWindow.innerText("data-testid=version-number-app");
    expect(versionNumberApp).not.toBe("-");
    const isValidNumberApp = semver.valid(semver.coerce(versionNumberApp));
    expect(semver.valid(isValidNumberApp)).not.toBeNull();
  });

  test.afterAll(async () => {
    await electronApp.close();
  });

});