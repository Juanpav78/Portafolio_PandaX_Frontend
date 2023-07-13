/** @type {import('tailwindcss').Config} */
export default {
  content: ["index.html", "./src/**/*.jsx"],
  theme: {
    colors: {
      transparent: 'transparent',
      current: 'currentColor',
      'p_orange': '#e86743',
      'p_orangeDark': '#cc4220',
      'p_cake': '#ed853a',
      'p_dark': '#340701',
      'p_silver': '#484848',
      'p_silverDark': '#262626',
      'p_white': '#FDFFFC',
    },
    fontFamily: {
      'title': 'Righteous, cursive',
      'text': 'Urbanist, sans-serif'

    },
    extend: {

      dropShadow: {
        'Dark': '#121212c2 0px 9px 6px;'
      }
    },
  },
  plugins: [],
}

