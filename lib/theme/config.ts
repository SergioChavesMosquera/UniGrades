export const themes = ["light", "dark"] as const;
export type Theme = (typeof themes)[number];

export const THEME_COOKIE = "unigrades_theme";
