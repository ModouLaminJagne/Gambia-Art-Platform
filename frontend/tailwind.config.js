/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    './pages/**/*.{js,ts,jsx,tsx,mdx}',
    './components/**/*.{js,ts,jsx,tsx,mdx}',
    './app/**/*.{js,ts,jsx,tsx,mdx}',
  ],
  theme: {
    extend: {
      colors: {
        'gambian-red': '#CE1126',
        'gambian-blue': '#0C1C8C',
        'gambian-green': '#009639',
      },
    },
  },
  plugins: [],
}