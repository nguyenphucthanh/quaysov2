declare global {
  interface Window {
    electron: {
      selectImage: () => Promise<string | null>;
    };
  }
}
