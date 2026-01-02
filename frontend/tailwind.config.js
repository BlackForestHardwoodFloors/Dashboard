/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        boardroom: {
          background: '#1B1C1D',
          accent: '#C9A049',
          text: '#FFFFFF',
          sidebar: '#252627'
        }
      }
    },
  },
  plugins: [],
}