import type { Config } from "tailwindcss";

const config: Config = {
  content: [
    "./pages/**/*.{js,ts,jsx,tsx,mdx}",
    "./components/**/*.{js,ts,jsx,tsx,mdx}",
    "./app/**/*.{js,ts,jsx,tsx,mdx}",
  ],
  theme: {
    extend: {
      colors: {
        cream: "var(--cream)",
        ink: {
          DEFAULT: "var(--ink)",
          light: "var(--ink-light)",
        },
        stone: "var(--stone)",
        paper: "var(--paper)",
        electric: "var(--electric)",
        grid: "var(--grid)",
      },
      fontFamily: {
        mono: ["var(--font-geist-mono)"],
        serif: ["var(--font-instrument-serif)"],
      },
      animation: {
        marquee: "marquee 25s linear infinite",
      },
      keyframes: {
        marquee: {
          "0%": { transform: "translateX(0%)" },
          "100%": { transform: "translateX(-100%)" },
        },
      },
    },
  },
  plugins: [],
};
export default config;
