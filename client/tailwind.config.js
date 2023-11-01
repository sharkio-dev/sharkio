/** @type {import('tailwindcss').Config} */
export default {
  content: ["./index.html", "./src/**/*.{js,ts,jsx,tsx}"],
  theme: {
    extend: {
      colors: {
        primary: "#181818",
        secondary: "#1d1d1d",
        tertiary: "#232323",
        "border-color": "#3a3a3a",
      },
    },
  },
  plugins: [],
};
