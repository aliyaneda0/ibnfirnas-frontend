/** @type {import('tailwindcss').Config} */
module.exports = {
  content: ["./app/**/*.{js,jsx,ts,tsx}","./components/**/*.{js,jsx,ts,tsx}"],
  presets: [require("nativewind/preset")],
  theme: {
    extend: {
      colors: {
                primary: "#0E4D92",
                accent: "#E63946",
                card: "#FFFFFF",
                background: "#F8FAFC",
                text: "#1E293B",
                subText: "#64748B",
                border: "#E5E7EB",
              },

      fontFamily: {
                sans: ["Poppins_400Regular"],
                medium: ["Poppins_500Medium"],
                bold: ["Poppins_700Bold"],
              },
    },
  },
  plugins: [],
}

