/** @type {import('tailwindcss').Config} */
export default {
  content: ["index.html", "./src/**/*.jsx"],
  theme: {
    colors: {
      transparent: 'transparent',
      current: 'currentColor',
      'p_orange': '#B13D14',
      'p_orangeDark': '#9C1A04',
      'p_cake': '#FCE7D2',
      'p_dark': '#340701',
      'p_silver': '#484848',
      'p_silverDark': '#262626',
      'p_white': '#FDFFFC',
    },
    fontFamily: {
      'title': 'Righteous, cursive',
      'text': 'Urbanist, sans-serif'

    },
    extend: {},
  },
  plugins: [],
}

