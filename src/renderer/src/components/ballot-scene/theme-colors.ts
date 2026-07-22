import * as THREE from "three";

// daisyui stores theme colors as space-separated HSL numbers, e.g. "262 80% 50%".
// Read them off :root and build a THREE.Color.
const readVar = (name: string): string =>
  getComputedStyle(document.documentElement).getPropertyValue(name).trim();

export const themeColor = (name: string, fallback: string): THREE.Color => {
  const raw = readVar(name);
  if (!raw) return new THREE.Color(fallback);
  const [h, s, l] = raw.split(/\s+/);
  try {
    return new THREE.Color(`hsl(${h}, ${s}, ${l})`);
  } catch {
    return new THREE.Color(fallback);
  }
};

export type ScenePalette = {
  paper: THREE.Color;
  primary: THREE.Color;
  secondary: THREE.Color;
  accent: THREE.Color;
  fog: THREE.Color;
};

// `dep` (the current theme string) is only here to bust useMemo when the theme changes.
export const readPalette = (): ScenePalette => ({
  paper: themeColor("--b1", "#fffacd"),
  primary: themeColor("--p", "#ff0000"),
  secondary: themeColor("--s", "#ffd700"),
  accent: themeColor("--a", "#ffa500"),
  fog: themeColor("--b2", "#f5e9c8"),
});
