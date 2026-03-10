/** @type {import('tailwindcss').Config} */
export default {
  content: ["./index.html", "./src/**/*.{js,ts,jsx,tsx}"],
  theme: {
    extend: {
      colors: {
        // Backgrounds
        "bg-dark": "#0f1115",
        "bg-panel": "#1a1d24",
        "bg-input": "#0b0c10",

        // Primary Brand
        primary: {
          DEFAULT: "#d32f2f",
          hover: "#b71c1c",
          light: "#f44336",
        },

        // Text Colors
        "text-main": "#e0e0e0",
        "text-muted": "#8a8d98",

        // Borders
        "border-default": "#303642",
        "border-focus": "#4b5563",
      },

      fontFamily: {
        sans: ["Inter", "sans-serif"],
        serif: ["Cinzel", "serif"],
        cinzel: ["Cinzel", "serif"], // Alias para compatibilidade
      },

      borderRadius: {
        sm: "4px",
        md: "8px",
      },

      animation: {
        "gradient-x": "gradient-x 3s ease infinite",
        shimmer: "shimmer 2s linear infinite",
        mistDrift: "mistDrift 30s linear infinite alternate",
      },

      keyframes: {
        "gradient-x": {
          "0%, 100%": {
            "background-size": "200% 200%",
            "background-position": "left center",
          },
          "50%": {
            "background-size": "200% 200%",
            "background-position": "right center",
          },
        },
        shimmer: {
          "0%": { transform: "translateX(-100%)" },
          "100%": { transform: "translateX(100%)" },
        },
        mistDrift: {
          "0%": { transform: "rotate(0deg) scale(1) translateX(0px)" },
          "50%": { transform: "rotate(1deg) scale(1.02) translateX(-20px)" },
          "100%": { transform: "rotate(-1deg) scale(1) translateX(20px)" },
        },
      },
    },
  },
  plugins: [],
};
