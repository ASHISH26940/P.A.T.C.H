import type { Config } from "tailwindcss";

const config: Config = {
  content: [
    "./src/pages/**/*.{js,ts,jsx,tsx,mdx}",
    "./src/components/**/*.{js,ts,jsx,tsx,mdx}",
    "./src/app/**/*.{js,ts,jsx,tsx,mdx}",
  ],
  theme: {
      extend: {
        colors: {
        surface: {
          DEFAULT: "#131317",
          dim: "#131317",
          bright: "#39393d",
          lowest: "#0e0e12",
          low: "#1b1b1f",
          mid: "#1f1f23",
          high: "#2a292e",
          highest: "#353439",
          variant: "#353439",
        },
        // Alias names used by the Stitch HTML prototypes.
        // These map 1:1 onto the existing surface scale.
        "surface-container": {
          DEFAULT: "#1f1f23",
          low: "#1b1b1f",
          high: "#2a292e",
          highest: "#353439",
          lowest: "#0e0e12",
        },
        on: {
          surface: "#e4e1e7",
          "surface-variant": "#d8c3ad",
          primary: "#472a00",
          "primary-container": "#613b00",
          secondary: "#303035",
          error: "#690005",
        },
        primary: {
          DEFAULT: "#ffc174",
          container: "#f59e0b",
        },
        secondary: {
          DEFAULT: "#c7c6cb",
          container: "#46464b",
        },
        tertiary: {
          DEFAULT: "#8fd5ff",
          container: "#1abdff",
        },
        error: {
          DEFAULT: "#ffb4ab",
          container: "#93000a",
        },
        outline: {
          DEFAULT: "#a08e7a",
          variant: "#534434",
        },
        glass: {
          border: "rgba(255, 255, 255, 0.08)",
          fill: "rgba(255, 255, 255, 0.04)",
        },
      },
      borderRadius: {
        DEFAULT: "0.125rem",
        lg: "0.25rem",
        xl: "0.5rem",
        "2xl": "0.75rem",
        full: "9999px",
      },
      spacing: {
        // Use rem so spacing scales with root font-size.
        "sidebar-rail": "5.5rem", // 88px
        "sidebar-secondary": "22.5rem", // 360px
        gutter: "1.5rem", // 24px
        "margin-page": "2rem", // 32px
        "stack-sm": "0.5rem", // 8px
        "stack-md": "1rem", // 16px
        "stack-lg": "1.5rem", // 24px
        unit: "0.25rem", // 4px
      },
      boxShadow: {
        glass: "0 8px 32px 0 rgba(0, 0, 0, 0.6)",
        "glow-amber": "0px 0px 20px rgba(245, 158, 11, 0.25)",
      },
      backdropBlur: {
        glass: "12px",
      },
      animation: {
        blink: "blink 1s step-end infinite",
        float: "float 6s ease-in-out infinite",
      },
      keyframes: {
        blink: {
          "from, to": { opacity: "1" },
          "50%": { opacity: "0" },
        },
        float: {
          "0%, 100%": { transform: "translateY(0)" },
          "50%": { transform: "translateY(-20px)" },
        },
      },
      fontFamily: {
        sans: ["Geist", "sans-serif"],
        mono: ["Space Mono", "monospace"],
        heading: ["Space Mono", "monospace"],
        "body-md": ["Geist", "sans-serif"],
        "body-lg": ["Geist", "sans-serif"],
        "label-md": ["Geist", "sans-serif"],
        h1: ["Space Mono", "monospace"],
        h2: ["Space Mono", "monospace"],
        h3: ["Space Mono", "monospace"],
        "mono-code": ["Space Mono", "monospace"],
      },
      fontSize: {
        "h1": ["32px", { lineHeight: "1.2", letterSpacing: "-0.02em", fontWeight: "700" }],
        "h2": ["24px", { lineHeight: "1.3", letterSpacing: "-0.01em", fontWeight: "600" }],
        "h3": ["18px", { lineHeight: "1.4", fontWeight: "600" }],
        "body-lg": ["18px", { lineHeight: "1.6", fontWeight: "400" }],
        "body-md": ["16px", { lineHeight: "1.5", fontWeight: "400" }],
        "body-sm": ["14px", { lineHeight: "1.4", fontWeight: "400" }],
        "label-md": ["14px", { lineHeight: "1", letterSpacing: "0.02em", fontWeight: "600" }],
        "label-sm": ["12px", { lineHeight: "1", letterSpacing: "0.05em", fontWeight: "500" }],
        "mono-code": ["14px", { lineHeight: "1.6", fontWeight: "400" }],
      },
    },
  },
  plugins: [require("@tailwindcss/typography")],
};
export default config;
