/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    "./src/**/*.{html,ts}",
  ],
  theme: {
    extend: {
      colors: {
        myGreen: '#4CA5A6',
        myBlue: '1D4876',
      },
      fontFamily: {
        Mouthwing: ['Mouthwing', 'sans-serif'],
      },
    },
  },
  plugins: [],
}