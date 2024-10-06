import { defineConfig } from "vite";
import react from "@vitejs/plugin-react";
import * as path from "path";

// https://vitejs.dev/config/
export default defineConfig({
  plugins: [react()],
  resolve: {
    alias: [
      {
        find: "@components",
        replacement: path.resolve(__dirname, "src/renderer/src/components"),
      },
      {
        find: "@store",
        replacement: path.resolve(__dirname, "src/renderer/src/store"),
      },
      {
        find: "@lib",
        replacement: path.resolve(__dirname, "src/renderer/src/lib"),
      },
      {
        find: "@hooks",
        replacement: path.resolve(__dirname, "src/renderer/src/hooks"),
      },
      {
        find: "@",
        replacement: path.resolve(__dirname, "src/renderer/src"),
      },
    ],
  },
});
