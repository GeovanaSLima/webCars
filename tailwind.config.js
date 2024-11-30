/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        primary: {
          100: "#f9cfd7",
          200: "#f3a0af",
          300: "#ed7088",
          400: "#e74160",
          500: "#e11138",
          600: "#c20f30",
          700: "#870a22",
          800: "#5a0716",
          900: "#2d030b"
        },
      }
    },
  },
  plugins: [],
}

