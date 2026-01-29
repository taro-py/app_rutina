/** @type {import('tailwindcss').Config} */
module.exports = {
  content: ["./app/**/*.{ts,tsx}", "./src/**/*.{ts,tsx}"],
  theme: {
    extend: {
      colors: {
        // Paleta pastel suave (minimalista tipo Notion/Apple Calendar)
        coral: {
          50: "#fff1f0",
          100: "#ffe2df",
          200: "#ffc6be",
          300: "#ffa69a",
          400: "#ff7e6c",
          500: "#ff5a3f"
        },
        sky: {
          50: "#eff7ff",
          100: "#dfefff",
          200: "#bddfff",
          300: "#93caff",
          400: "#67b3ff",
          500: "#3b9bff"
        },
        mint: {
          50: "#effbf7",
          100: "#d9f5ea",
          200: "#b6ecd8",
          300: "#86ddc1",
          400: "#4ccaa6",
          500: "#1fb489"
        },
        lilac: {
          50: "#f6f1ff",
          100: "#ece3ff",
          200: "#d9c6ff",
          300: "#c2a2ff",
          400: "#a872ff",
          500: "#8f45ff"
        },
        beige: {
          50: "#fbf7f0",
          100: "#f3eadc",
          200: "#e7d2b4",
          300: "#d8b686",
          400: "#c89855",
          500: "#b98134"
        }
      }
    }
  },
  plugins: []
};

