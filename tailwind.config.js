/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    "./src/**/*.{js,jsx,ts,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        'game-pink': '#FFB6C1',
        'game-pink-dark': '#FF69B4',
        'game-bg': '#FFF5F7',
      },
    },
  },
  plugins: [],
}