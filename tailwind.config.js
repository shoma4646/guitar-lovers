/** @type {import('tailwindcss').Config} */
/**
 * NativeWind v4 + Stitch DESIGN.md（modern_guitarist）準拠のテーマ拡張。
 *
 * 値の正本は `src/shared/theme/` 配下にあるが、Tailwind 設定は CSS 命名規則の都合で
 * kebab-case のキーを採用する。値が乖離しないよう、変更時は theme と config の両方を更新する。
 */
module.exports = {
  content: ["./src/**/*.{js,jsx,ts,tsx}"],
  presets: [require("nativewind/preset")],
  theme: {
    extend: {
      colors: {
        // ===== Surface =====
        surface: "#fff8f7",
        "surface-dim": "#edd5d1",
        "surface-bright": "#fff8f7",
        "surface-container-lowest": "#ffffff",
        "surface-container-low": "#fff0ee",
        "surface-container": "#ffe9e6",
        "surface-container-high": "#fce3df",
        "surface-container-highest": "#f6ddda",
        "surface-variant": "#f6ddda",
        "surface-tint": "#ae3026",
        "inverse-surface": "#3c2d2b",
        "inverse-on-surface": "#ffedea",
        background: "#fff8f7",

        // ===== On Surface =====
        "on-surface": "#251817",
        "on-surface-variant": "#59413e",
        "on-background": "#251817",

        // ===== Primary（Coral） =====
        primary: "#ae3026",
        "on-primary": "#ffffff",
        "primary-container": "#ff6b5b",
        "on-primary-container": "#6d0003",
        "inverse-primary": "#ffb4aa",
        "primary-fixed": "#ffdad5",
        "primary-fixed-dim": "#ffb4aa",
        "on-primary-fixed": "#410001",
        "on-primary-fixed-variant": "#8c1712",

        // ===== Secondary（Amber） =====
        secondary: "#855300",
        "on-secondary": "#ffffff",
        "secondary-container": "#fea619",
        "on-secondary-container": "#684000",
        "secondary-fixed": "#ffddb8",
        "secondary-fixed-dim": "#ffb95f",
        "on-secondary-fixed": "#2a1700",
        "on-secondary-fixed-variant": "#653e00",

        // ===== Tertiary（Green） =====
        tertiary: "#006b57",
        "on-tertiary": "#ffffff",
        "tertiary-container": "#00af8f",
        "on-tertiary-container": "#003a2e",
        "tertiary-fixed": "#74f9d5",
        "tertiary-fixed-dim": "#54dcba",
        "on-tertiary-fixed": "#002019",
        "on-tertiary-fixed-variant": "#005141",

        // ===== Error =====
        error: "#ba1a1a",
        "on-error": "#ffffff",
        "error-container": "#ffdad6",
        "on-error-container": "#93000a",

        // ===== Outline =====
        outline: "#8c716d",
        "outline-variant": "#e0bfba",

        // ===== Status utility =====
        success: "#10B981",
        info: "#2979FF",
      },

      spacing: {
        base: "4px",
        xs: "8px",
        sm: "12px",
        md: "16px",
        lg: "24px",
        xl: "32px",
        "margin-mobile": "20px",
        "gutter-mobile": "16px",
      },

      borderRadius: {
        DEFAULT: "0.5rem",
        sm: "0.25rem",
        md: "0.75rem",
        lg: "1rem",
        xl: "1.5rem",
        full: "9999px",
      },

      fontFamily: {
        // expo-font で `Inter` 名で登録する想定
        inter: ["Inter"],
        "display-numeric": ["Inter"],
        "headline-xl": ["Inter"],
        "headline-lg": ["Inter"],
        "body-lg": ["Inter"],
        "body-md": ["Inter"],
        "label-sm": ["Inter"],
      },

      fontSize: {
        "display-numeric": [
          "64px",
          {
            lineHeight: "1",
            letterSpacing: "-0.04em",
            fontWeight: "800",
          },
        ],
        "headline-xl": [
          "32px",
          {
            lineHeight: "1.2",
            letterSpacing: "-0.02em",
            fontWeight: "700",
          },
        ],
        "headline-lg": ["24px", { lineHeight: "1.3", fontWeight: "700" }],
        "body-lg": ["18px", { lineHeight: "1.5", fontWeight: "400" }],
        "body-md": ["16px", { lineHeight: "1.5", fontWeight: "400" }],
        "label-sm": [
          "13px",
          {
            lineHeight: "1",
            letterSpacing: "0.02em",
            fontWeight: "600",
          },
        ],
      },

      boxShadow: {
        // Level 1 — カード
        layered: "0 4px 12px rgba(0,0,0,0.03), 0 1px 2px rgba(0,0,0,0.02)",
        // Level 2 — モーダル
        elevated: "0 12px 32px rgba(0,0,0,0.08)",
      },
    },
  },
  plugins: [],
};
