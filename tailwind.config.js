/** @type {import('tailwindcss').Config} */
export default {
  content: ["./index.html", "./src/**/*.{js,ts,jsx,tsx}"],
  theme: {
    extend: {
      fontFamily: {
        sans: ["Open Sans", "sans-serif"],
      },
      colors: {
        primary: {
          DEFAULT: "#0D9488",
          foreground: "#FAFAFA",
        },
        secondary: {
          DEFAULT: "#99F6E4",
          foreground: "#134E4A",
        },
        muted: {
          DEFAULT: "#FAFAFA",
          foreground: "#64748B",
        },
        accent: {
          DEFAULT: "#134E4A",
          foreground: "#FAFAFA",
        },
        background: "#FAFAFA",
      },
    },
  },
  plugins: [],
};
