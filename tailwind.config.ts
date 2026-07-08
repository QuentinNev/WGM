import type { Config } from "tailwindcss"

const config: Config = {
  content: [
    "./app/**/*.{js,ts,jsx,tsx,mdx}",
    "./components/**/*.{js,ts,jsx,tsx,mdx}",
  ],
  theme: {
    extend: {
      colors: {
        screen: {
          bg:      "#050905",
          surface: "#0a130a",
          border:  "#1a341a",
          muted:   "#3a663a",
          base:    "#7dc97d",
          bright:  "#b0ffb0",
          glow:    "#39ff14",
          amber:   "#e8a000",
          red:     "#ff2a2a",
        },
      },
      fontFamily: {
        mono:    ["var(--font-mono)", "monospace"],
        display: ["var(--font-display)", "monospace"],
      },
    },
  },
  plugins: [],
}

export default config
