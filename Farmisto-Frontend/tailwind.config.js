/** @type {import('tailwindcss').Config} */
export default {
  content: ["./src/**/*.{html,js,jsx}"],
  theme: {
    extend: {
      colors: {
        cream: "#F5F0E8",
        "cream-dark": "#EDE6D4",
        orange: "#E8621A",
        "orange-hover": "#d05515",
        dark: "#1A1A1A",
        muted: "#6B6560",
        card: {
          yellow: "#E8C547",
          blue: "#5B8EE6",
          green: "#6CC24A",
          pink: "#F4A4B5",
        },
      },
      fontFamily: {
        serif: ["'Playfair Display'", "Georgia", "serif"],
        sans: ["'Inter'", "sans-serif"],
      },
      clipPath: {
        hexagon: "polygon(50% 0%, 100% 25%, 100% 75%, 50% 100%, 0% 75%, 0% 25%)",
      },
    },
  },
  daisyui: {
    styled: false,
    base: false,
    logs: false,
  },
  plugins: [
    require("tailwind-clip-path"),
    require("tailwind-scrollbar"),
    require("daisyui"),
  ],
};
