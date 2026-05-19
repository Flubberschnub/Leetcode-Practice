const BASE_THEME_COLORS = {
  light: {
    page: "#f8fafc",
    surface: "#ffffff",
    subtle: "#f8fafc",
    input: "#ffffff",
    border: "#e2e8f0",
    text: "#020617",
    muted: "#64748b",
    shadow: "0 1px 2px rgb(15 23 42 / 0.05)",
  },
  dark: {
    page: "#0b1120",
    surface: "#111827",
    subtle: "#1f2937",
    input: "#0f172a",
    border: "#334155",
    text: "#f8fafc",
    muted: "#94a3b8",
    shadow: "0 1px 2px rgb(0 0 0 / 0.2)",
  },
};

export const ACCENT_COLORS = [
  { value: "blue", label: "Blue", swatch: "#2563eb" },
  { value: "emerald", label: "Emerald", swatch: "#059669" },
  { value: "violet", label: "Violet", swatch: "#7c3aed" },
  { value: "rose", label: "Rose", swatch: "#e11d48" },
  { value: "amber", label: "Amber", swatch: "#d97706" },
  { value: "cyan", label: "Cyan", swatch: "#0891b2" },
];

const ACCENT_THEME_COLORS = {
  blue: { soft: "#dbeafe", text: "#1d4ed8", strong: "#2563eb", hover: "#1d4ed8" },
  emerald: { soft: "#d1fae5", text: "#047857", strong: "#059669", hover: "#047857" },
  violet: { soft: "#ede9fe", text: "#6d28d9", strong: "#7c3aed", hover: "#6d28d9" },
  rose: { soft: "#ffe4e6", text: "#be123c", strong: "#e11d48", hover: "#be123c" },
  amber: { soft: "#fef3c7", text: "#92400e", strong: "#d97706", hover: "#b45309" },
  cyan: { soft: "#cffafe", text: "#0e7490", strong: "#0891b2", hover: "#0e7490" },
};

export function getThemeStyle(config = {}) {
  const base = BASE_THEME_COLORS[config.themeBase] || BASE_THEME_COLORS.light;
  const accent = ACCENT_THEME_COLORS[config.accentColor] || ACCENT_THEME_COLORS.blue;

  return {
    "--color-page": base.page,
    "--color-surface": base.surface,
    "--color-subtle": base.subtle,
    "--color-input": base.input,
    "--color-border": base.border,
    "--color-text": base.text,
    "--color-muted": base.muted,
    "--shadow-panel": base.shadow,
    "--accent-soft": accent.soft,
    "--accent-text": accent.text,
    "--accent-strong": accent.strong,
    "--accent-hover": accent.hover,
  };
}
