declare global {
  interface Window {
    electron: {
      selectImage: () => Promise<string | null>;
    };
  }

  namespace JSX {
    interface IntrinsicElements {
      sparklesImplMaterial: Record<string, unknown>;
    }
  }
}
export {};
