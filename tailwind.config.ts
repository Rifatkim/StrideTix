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
          50: "#FFF7ED",
          100: "#FFEDD5",
          200: "#FED7AA",
          300: "#FDBA74",
          400: "#FB923C",
          500: "#F97316",
          600: "#EA580C",
          700: "#C2410C", // Brand Race Orange
          800: "#9A3412",
          900: "#7C2D12",
          DEFAULT: "#C2410C",
        },
        surface: {
          DEFAULT: "#FFFFFF",
          main: "#FFFCF8",
          soft: "#FFF8EE",
          muted: "#F7EFE3",
        },
        sand: {
          border: "#E8DDD0",
          "border-strong": "#CDBEAE",
        },
        espresso: {
          primary: "#241C17",
          secondary: "#665C54",
          muted: "#8C8178",
          DEFAULT: "#241C17",
        },
        accent: {
          ai: "#7C3AED",
          strava: "#FC4C02",
          success: "#18864B",
          warning: "#B76A00",
          "warning-bg": "#FFF4DD",
          "warning-border": "#E3A008",
          error: "#C83232",
          info: "#5B4DB7",
        },
      },
      fontFamily: {
        sans: ["var(--font-plus-jakarta)", "sans-serif"],
      },
      borderRadius: {
        btn: "12px",
        input: "12px",
        card: "18px",
        ticket: "20px",
        modal: "24px",
      },
      boxShadow: {
        warm: "0 6px 24px rgba(58, 39, 24, 0.08)",
        "warm-hover": "0 14px 36px rgba(58, 39, 24, 0.14)",
        "warm-modal": "0 24px 64px rgba(36, 28, 23, 0.18)",
      },
    },
  },
  plugins: [],
};

export default config;
