const { themeColors, themeFontFamily } = require("./src/config/design-tokens");

/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    "./app/**/*.{js,jsx,ts,tsx}",
    "./src/**/*.{js,jsx,ts,tsx}",
  ],
  darkMode: "class",
  presets: [require("nativewind/preset")],
  theme: {
    extend: {
      colors: themeColors,
      // Only "sans" is safe to expose as a Tailwind fontFamily utility here.
      // themeFontFamily.medium/bold intentionally reuse the "medium"/"bold"
      // names for RN inline styles (e.g. tab bar labels), but as Tailwind
      // classes they'd collide with the built-in font-weight utilities of
      // the same name (font-medium/font-bold), so don't spread them in.
      fontFamily: { sans: themeFontFamily.sans },
    },
  },
  plugins: [],
}

