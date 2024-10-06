import { contextBridge, ipcRenderer } from "electron";
import { electronAPI } from "@electron-toolkit/preload";
import { ExtendedElectronAPI } from ".";

// Custom APIs for renderer
const api = {};

if (process.contextIsolated) {
  try {
    contextBridge.exposeInMainWorld("electron", {
      selectImage: () => ipcRenderer.invoke("select-image"),
      loadImage: (filePath: string) =>
        ipcRenderer.invoke("load-image", filePath),
    });
    contextBridge.exposeInMainWorld("api", api);
  } catch (error) {
    console.error(error);
  }
} else {
  window.electron = electronAPI as ExtendedElectronAPI;
  window.api = api;
}
