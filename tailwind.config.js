/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    "./app/**/*.{js,ts,jsx,tsx,mdx}",
    "./components/**/*.{js,ts,jsx,tsx,mdx}",
  ],
  theme: {
    extend: {
      colors: {
        bg: "#090A0A",
        surface: "#0E1010",
        "surface-2": "#131515",
        "surface-3": "#171919",
        border: "#252929",
        "border-subtle": "#1C2020",
        mint: "#BCEDE2",
        "mint-strong": "#9FE4D7",
        cream: "#F4F4EF",
        muted: "#9A9E9B",
        "muted-2": "#626866",
        danger: "#E47E7E",
        success: "#73D6A5",
        warning: "#E5C46A",
        info: "#8EB8E8",
      },
      fontFamily: {
        sans: ["var(--font-space)", "sans-serif"],
        mono: ["var(--font-mono)", "monospace"],
      },
      letterSpacing: {
        label: "0.1em",
      },
      borderRadius: {
        sm: "8px",
        DEFAULT: "10px",
        md: "10px",
        lg: "14px",
        xl: "18px",
      },
    },
  },
  plugins: [],
};
