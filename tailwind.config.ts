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
        sans: ["IBM Plex Sans", "system-ui", "sans-serif"],
      },
      boxShadow: {
        warm: "0 1px 2px rgba(45,34,27,.06), 0 8px 24px -12px rgba(45,34,27,.18)",
        "warm-lg": "0 2px 4px rgba(45,34,27,.07), 0 20px 44px -16px rgba(188,91,53,.28)",
      },
      // Анимации — точечно для лендинга (see Landing.tsx, Reveal.tsx). Никакая другая
      // страница эти классы не использует, поэтому глобальная регистрация в конфиге
      // не «протекает» на каталог/карточку товара.
      keyframes: {
        "fade-up": {
          "0%": { opacity: "0", transform: "translateY(18px)" },
          "100%": { opacity: "1", transform: "translateY(0)" },
        },
        float: {
          "0%, 100%": { transform: "translateY(0)" },
          "50%": { transform: "translateY(-12px)" },
        },
        "glow-pulse": {
          "0%, 100%": { opacity: "0.18" },
          "50%": { opacity: "0.32" },
        },
      },
      animation: {
        "fade-up": "fade-up 800ms cubic-bezier(0.16,1,0.3,1) both",
        float: "float 8s ease-in-out infinite",
        "float-slow": "float 12s ease-in-out infinite",
        "glow-pulse": "glow-pulse 6s ease-in-out infinite",
      },
    },
  },
  plugins: [],
} satisfies Config;
