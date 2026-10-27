import { COLORS } from "./tokens";

/** Page background for each theme, also used for the browser's address-bar colour. */
export const THEME_COLOR = { light: COLORS.light.bg, dark: COLORS.dark.bg } as const;

export type Theme = keyof typeof THEME_COLOR;
