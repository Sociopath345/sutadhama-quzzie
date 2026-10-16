/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        maroon: {
          DEFAULT: '#800000',
          hover: '#660000',
          active: '#4d0000',
          dark: '#4A0000',
        },
        saffron: {
          DEFAULT: '#FF9933',
          hover: '#e68a00',
        },
        cream: {
          DEFAULT: '#FAF9F6',
          ivory: '#FFFDF7',
          light: '#FDFBF7',
        },
      },
      fontFamily: {
        burmese: ['Pyidaungsu', 'Padauk', 'Noto Sans Myanmar', 'sans-serif'],
      },
    },
  },
  plugins: [],
}
