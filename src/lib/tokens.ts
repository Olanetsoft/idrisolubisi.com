/**
 * The colour tokens TypeScript needs (the browser address-bar colour, and the
 * share image when it is redrawn), kept equal to :root and [data-theme="light"]
 * in globals.css. Change both together.
 */
export const COLORS = {
  dark: { bg: "#000000", text: "#ece9e2", text2: "#c7c2b8", text3: "#9a958b", accent: "#e9b44c" },
  light: { bg: "#f5f3ee", text: "#1c1b19", text2: "#4a4741", text3: "#625e57", accent: "#8f5a0a" },
} as const;
