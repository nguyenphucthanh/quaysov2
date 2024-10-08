import { app, shell, BrowserWindow, dialog, ipcMain, Tray, nativeImage } from "electron";
import { join, dirname, basename } from "path";
import { electronApp, optimizer, is } from "@electron-toolkit/utils";
// import icon from '../../resources/icon.png?asset'
import fs from "fs-extra";

function createWindow(): void {
  const icon = nativeImage.createFromPath(join(__dirname, "../icon.png"));
  // Create the browser window.
  const mainWindow = new BrowserWindow({
    width: 1600,
    height: 1200,
    show: false,
    autoHideMenuBar: true,
    // ...(process.platform === 'linux' ? { icon } : {}),
    webPreferences: {
      preload: join(__dirname, "../preload/preload.mjs"),
      sandbox: false,
    },
    icon,
    title: "Quay số",
  });

  const tray = new Tray(icon);
  tray.setToolTip("Quay số");

  mainWindow.on("ready-to-show", () => {
    mainWindow.show();
  });

  mainWindow.webContents.setWindowOpenHandler((details) => {
    shell
      .openExternal(details.url)
      .then(() => {
        console.log("open external success");
      })
      .catch((error) => {
        console.log("open external error", error);
      });
    return { action: "deny" };
  });

  // HMR for renderer base on electron-vite cli.
  // Load the remote URL for development or the local html file for production.
  if (is.dev && process.env.ELECTRON_RENDERER_URL) {
    mainWindow
      .loadURL(process.env.ELECTRON_RENDERER_URL)
      .then(() => {
        console.log("load url success");
      })
      .catch((error) => {
        console.log("load url error", error);
      });
  } else {
    mainWindow
      .loadFile(join(__dirname, "../renderer/index.html"))
      .then(() => {
        console.log("load file success");
      })
      .catch((error) => {
        console.log("load file error", error);
      });
  }
}

// This method will be called when Electron has finished
// initialization and is ready to create browser windows.
// Some APIs can only be used after this event occurs.
app
  .whenReady()
  .then(() => {
    // Set app user model id for windows
    electronApp.setAppUserModelId("com.electron");

    // Default open or close DevTools by F12 in development
    // and ignore CommandOrControl + R in production.
    // see https://github.com/alex8088/electron-toolkit/tree/master/packages/utils
    app.on("browser-window-created", (_, window) => {
      optimizer.watchWindowShortcuts(window);
    });

    // IPC test
    ipcMain.on("ping", () => console.log("pong"));

    createWindow();

    app.on("activate", function () {
      // On macOS it's common to re-create a window in the app when the
      // dock icon is clicked and there are no other windows open.
      if (BrowserWindow.getAllWindows().length === 0) createWindow();
    });
  })
  .catch((error) => {
    console.log("app error", error);
  });

// Quit when all windows are closed, except on macOS. There, it's common
// for applications and their menu bar to stay active until the user quits
// explicitly with Cmd + Q.
app.on("window-all-closed", () => {
  if (process.platform !== "darwin") {
    app.quit();
  }
});

// In this file you can include the rest of your app"s specific main process
// code. You can also put them in separate files and require them here.

ipcMain.handle("select-image", async () => {
  const result = await dialog.showOpenDialog({
    properties: ["openFile"],
    filters: [{ name: "Images", extensions: ["jpg", "jpeg", "png", "gif"] }],
  });

  if (result.canceled) {
    return null;
  }

  const selectedFilePath = result.filePaths[0];
  const savePath = join(
    app.getPath("userData"),
    "images",
    basename(selectedFilePath)
  );
  await fs.ensureDir(dirname(savePath));
  await fs.copy(selectedFilePath, savePath);
  return savePath;
});

ipcMain.handle("load-image", async (_event, filePath: string) => {
  const file = await fs.readFile(filePath);

  // convert image to base64
  const base64 = file.toString("base64");
  const data = `data:image/png;base64,${base64}`;

  return data;
});
