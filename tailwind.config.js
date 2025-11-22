/** @type {import('tailwindcss').Config} */
export default {
  content: ["./index.html", "./src/**/*.{js,ts,jsx,tsx}"],
  theme: {
    extend: {
      fontFamily: {
        sans: ["Open Sans", "sans-serif"],
      },
      colors: {
        primaria: {
          DEFAULT: "#0D9488",
          foreground: "#FAFAFA",
        },
        secundaria: {
          DEFAULT: "#99F6E4",
          foreground: "#134E4A",
        },
        neutro: {
          DEFAULT: "#FAFAFA",
          foreground: "#64748B",
        },
        forte: {
          DEFAULT: "#134E4A",
          foreground: "#FAFAFA",
        },
        background: "#FAFAFA",
      },
    },
  },
  plugins: [],
};
