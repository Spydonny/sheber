import type { Config } from "tailwindcss";

export default {
  content: ["./index.html", "./src/**/*.{ts,tsx}"],
  theme: {
    extend: {
      colors: {
        // Тёплая «мастерская»: бумага, чернила, глина, степное золото
        paper: "#f7f1e6",
        card: "#fffcf5",
        ink: "#2d221b",
        clay: {
          DEFAULT: "#bc5b35",
          dark: "#9c4526",
        },
        gold: "#b8862b",
        line: "#e7dcc8",
      },
      fontFamily: {
        display: ["Prata", "Georgia", "serif"],
        sans: ["Manrope", "system-ui", "sans-serif"],
      },
      boxShadow: {
        warm: "0 1px 2px rgba(45,34,27,.06), 0 8px 24px -12px rgba(45,34,27,.18)",
        "warm-lg": "0 2px 4px rgba(45,34,27,.07), 0 20px 44px -16px rgba(188,91,53,.28)",
      },
    },
  },
  plugins: [],
} satisfies Config;
