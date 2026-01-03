/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,jsx}"
  ],
  theme: {
    extend: {
      boxShadow: {
        neon: "0 0 20px #00fff7",
      },
      colors: {
        neon: "#00fff7",
      },
    },
  },
  plugins: [],
}
