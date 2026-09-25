/** Page background for each theme, also used for the browser's address-bar colour. */
export const THEME_COLOR = { light: "#faf9f6", dark: "#000000" } as const;

export type Theme = keyof typeof THEME_COLOR;
