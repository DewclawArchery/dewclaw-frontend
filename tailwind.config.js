/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    "./pages/**/*.{js,jsx,ts,tsx}",
    "./components/**/*.{js,jsx,ts,tsx}",
    "./styles/**/*.css",
  ],
  theme: {
    extend: {
      colors: {
        "dew-gold": "#f9a51a",
        "dew-bg": "#0c0c0c",
      },
    },
  },
  plugins: [],
};
