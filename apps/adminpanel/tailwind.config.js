/** @type {import('tailwindcss').Config} */
const twConfig = {
  darkMode: "class",
  content: [
    "./pages/**/*.{html,jsx,tsx}",
    "./index.html",
    "../../packages/protolib/src/**/*.{html,tsx,jsx}",
  ],
  theme: {
    extend: {
      fontFamily: {
        montserrat: ["Montserrat", "sans-serif", "Roboto"],
      },
      colors: {
        "dark-primary": "#40414f",
      },
    },
  },
  plugins: [],
};

export default twConfig;
