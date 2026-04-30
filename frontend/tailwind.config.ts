import type { Config } from "tailwindcss";

export default {
  content: ["./index.html", "./src/**/*.{js,ts,jsx,tsx}"],
  theme: {
    extend: {
      colors: {
        background: "#FFF8F0",
        primary: "#6C5CE7",
        secondary: "#FAB1A0",
        accent: "#FFD93D",
        success: "#00B894",
        error: "#E17055",
      },
      fontFamily: {
        display: ["Quicksand", "sans-serif"],
        body: ["Nunito", "sans-serif"],
      },
      fontSize: {
        h1: ["2.5rem", { lineHeight: "1.2" }],
        h2: ["1.75rem", { lineHeight: "1.3" }],
        h3: ["1.25rem", { lineHeight: "1.4" }],
        body: ["1rem", { lineHeight: "1.5" }],
        small: ["0.875rem", { lineHeight: "1.5" }],
      },
      borderRadius: {
        DEFAULT: "0.75rem",
        card: "1rem",
        input: "0.5rem",
      },
      spacing: {
        base: "0.5rem",
      },
    },
  },
  plugins: [],
} satisfies Config;
