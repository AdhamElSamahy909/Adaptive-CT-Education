/** @type {import('tailwindcss').Config} */
export default {
  content: ["./index.html", "./src/**/*.{js,ts,jsx,tsx}"],
  theme: {
    extend: {
      colors: {
        offwite: "#F9F7F7",
        light_blue: "#DBE2EF",
        medium_blue: "#3F72AF",
        dark_blue: "#112D4E",
      },
    },
  },
  plugins: [],
};
