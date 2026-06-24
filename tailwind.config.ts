import type { Config } from "tailwindcss";

const config: Config = {
  content: [
    "./app/**/*.{js,ts,jsx,tsx,mdx}",
    "./components/**/*.{js,ts,jsx,tsx,mdx}",
    "./data/**/*.{js,ts,jsx,tsx,mdx}",
  ],
  theme: {
    extend: {
      colors: {
        night: {
          900: "#04060f",
          800: "#070b1a",
          700: "#0b1124",
          600: "#101a36",
        },
        midnight: "#0a1128",
        gold: {
          DEFAULT: "#d4af37",
          light: "#f5e6a8",
          dark: "#9c7c1f",
        },
        bordeaux: {
          DEFAULT: "#5b0e1a",
          light: "#7c1f2e",
        },
        parchment: {
          DEFAULT: "#e8dcc0",
          dark: "#c9b88a",
          deep: "#a8916a",
        },
      },
      fontFamily: {
        display: ["var(--font-display)", "Cinzel", "serif"],
        serif: ["var(--font-serif)", "Cormorant Garamond", "Georgia", "serif"],
        body: ["var(--font-serif)", "Georgia", "serif"],
      },
      keyframes: {
        flicker: {
          "0%, 100%": { opacity: "1", transform: "scale(1)" },
          "25%": { opacity: "0.85", transform: "scale(0.98)" },
          "50%": { opacity: "0.95", transform: "scale(1.02)" },
          "75%": { opacity: "0.8", transform: "scale(0.97)" },
        },
        float: {
          "0%, 100%": { transform: "translateY(0)" },
          "50%": { transform: "translateY(-18px)" },
        },
        shimmer: {
          "0%": { backgroundPosition: "-200% center" },
          "100%": { backgroundPosition: "200% center" },
        },
        glow: {
          "0%, 100%": { filter: "drop-shadow(0 0 6px rgba(212,175,55,0.5))" },
          "50%": { filter: "drop-shadow(0 0 22px rgba(212,175,55,0.9))" },
        },
        shake: {
          "0%, 100%": { transform: "translateX(0)" },
          "20%": { transform: "translateX(-10px) rotate(-1deg)" },
          "40%": { transform: "translateX(10px) rotate(1deg)" },
          "60%": { transform: "translateX(-8px) rotate(-0.6deg)" },
          "80%": { transform: "translateX(8px) rotate(0.6deg)" },
        },
        spinslow: {
          "0%": { transform: "rotate(0deg)" },
          "100%": { transform: "rotate(360deg)" },
        },
      },
      animation: {
        flicker: "flicker 3.5s ease-in-out infinite",
        float: "float 6s ease-in-out infinite",
        shimmer: "shimmer 6s linear infinite",
        glow: "glow 3s ease-in-out infinite",
        shake: "shake 0.6s ease-in-out",
        spinslow: "spinslow 24s linear infinite",
      },
    },
  },
  plugins: [],
};

export default config;
