import path from "node:path";
import { fileURLToPath } from "node:url";
import { FlatCompat } from "@eslint/eslintrc";
import js from "@eslint/js";

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const compat = new FlatCompat({
  baseDirectory: __dirname,
  recommendedConfig: js.configs.recommended,
  allConfig: js.configs.all,
});

export default [
  ...compat.config({
    root: true,
    env: { browser: true, es2020: true },
    extends: [
      "eslint:recommended",
      "plugin:@typescript-eslint/recommended-type-checked",
      "plugin:react-hooks/recommended",
      "plugin:@typescript-eslint/stylistic-type-checked",
      "plugin:react/recommended",
      "plugin:react/jsx-runtime",
    ],
    ignorePatterns: [
      "dist",
      "out",
      ".eslintrc.cjs",
      "eslint.config.js",
      "forge.config.cjs",
      "postcss.config.js",
      "tailwind.config.js",
      "electron.vite.config.ts",
    ],
    parser: "@typescript-eslint/parser",
    parserOptions: {
      ecmaVersion: "latest",
      sourceType: "module",
      project: ["./tsconfig.json", "./tsconfig.node.json"],
      tsconfigRootDir: __dirname,
    },
    settings: {
      react: {
        version: "detect",
      },
    },
    rules: {
      "@typescript-eslint/consistent-type-definitions": ["off"],
      "react-hooks/purity": "off",
    },
    overrides: [
      {
        // react-three-fiber uses three.js props the DOM-oriented rule cannot infer.
        files: ["src/renderer/src/components/ballot-scene/**/*.tsx"],
        rules: { "react/no-unknown-property": "off" },
      },
    ],
  }),
];
