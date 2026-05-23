/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    "./app/**/*.{js,ts,jsx,tsx,mdx}",
    "./components/**/*.{js,ts,jsx,tsx,mdx}",
  ],
  theme: {
    extend: {
      colors: {
        bg: "#141414",
        surface: "#1c1c1a",
        "surface-2": "#242420",
        border: "#2a2a26",
        mint: "#BBEBE1",
        cream: "#E8E3D5",
        muted: "#6b6760",
        danger: "#e57373",
      },
      fontFamily: {
        sans: ["var(--font-space)", "sans-serif"],
        mono: ["var(--font-mono)", "monospace"],
      },
    },
  },
  plugins: [],
};
