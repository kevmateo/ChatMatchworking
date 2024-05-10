/** @type {import('tailwindcss').Config} */
export default {
  darkMode: 'class',
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      boxShadow: {
        '3xl': 'rgba(50, 50, 105, 0.15) 0px 2px 5px 0px, rgba(0, 0, 0, 0.05) 0px 1px 1px 0px',
      },
      colors: {
        'light': {
          100: '#F5F5F5',
          200: '#F0F0F0',
          300: '#ECECEC',
        },
        'dark': {
          100: '#EBEBEB',
          200: '#768289',
          300: '#011A27',
        },
        'principal': {
          100: 'rgb(1, 26, 39)',
          200: 'rgba(6, 56, 82, 80%)',
          300: 'rgb(240, 129, 15)',
          400: '#E6DF44',
          500: 'rgba(240, 129, 15, 90%)',
          600: '#D9D9D9',
        },
      },
      spacing: {
        '97': '25rem',
      },
    },
  },
  plugins: [
    function ({ addUtilities }) {
      const newUtilities = {
        '.no-scrollbar::-webkit-scrollbar': {
          display: 'none',
        },
        '.no.scrollbar': {
          '-ms-overflow-style': 'none',
          'scrollbar-width': 'none',
        },
      };
      addUtilities(newUtilities);
    },
  ],
}

