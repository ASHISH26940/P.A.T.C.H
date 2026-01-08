// tailwind.config.ts
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
        brand: {
          light: "#DAD7CD",
          sage: "#A3B18A",
          green: "#588157",
          fern: "#588157",
          hunter: "#3A5A40",
          deep: "#344E41",
          dark: "#344E41", // Mapping dark to deep for now
        },
        // Direct map from user snippet
        bone: "#DAD7CD",
        sage: "#A3B18A",
        fern: "#588157",
        hunter: "#3A5A40",
        deep: "#344E41",
      },
      animation: {
        blob: "blob 7s infinite",
        float: "float 6s ease-in-out infinite",
        "float-delayed": "float 6s ease-in-out 3s infinite",
      },
      keyframes: {
        blob: {
          "0%": {
            transform: "translate(0px, 0px) scale(1)",
          },
          "33%": {
            transform: "translate(30px, -50px) scale(1.1)",
          },
          "66%": {
            transform: "translate(-20px, 20px) scale(0.9)",
          },
          "100%": {
            transform: "translate(0px, 0px) scale(1)",
          },
        },
        float: {
          "0%, 100%": { transform: "translateY(0)" },
          "50%": { transform: "translateY(-20px)" },
        },
      },
      fontFamily: {
        sans: ["var(--font-inter)", "sans-serif"], // Assuming we have Inter set up or will use standard sans
        mono: ["var(--font-space-mono)", "monospace"], // Need to ensure fonts are loaded or fallback
      },
    },
  },
  plugins: [require("@tailwindcss/typography")],
};
export default config;
