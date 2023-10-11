/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    `./src/pages/**/*.{js,jsx,ts,tsx}`,
    `./src/components/**/*.{js,jsx,ts,tsx}`,
  ],
  theme: {
    extend: {
      colors: {
        'transparent': 'transparent',
        'black': '#000',
      },
      backgroundImage: theme => ({
        'gradient-to-b': 'linear-gradient(to bottom, var(--tw-gradient-stops))',
      })
    },
  },
  plugins: [],
}
