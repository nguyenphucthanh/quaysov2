import { ElectronAPI } from "@electron-toolkit/preload";

interface ExtendedElectronAPI extends ElectronAPI {
  selectImage: () => Promise<string>;
  loadImage: (filePath: string) => Promise<string>;
}

declare global {
  interface Window {
    electron: ExtendedElectronAPI;
    api: unknown;
  }
}
