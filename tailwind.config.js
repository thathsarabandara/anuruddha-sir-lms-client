/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        primary: {
          50: '#e6f2ff',
          100: '#b3d9ff',
          200: '#80bfff',
          300: '#4da6ff',
          400: '#1a8cff',
          500: '#0073e6',
          600: '#005bb3',
          700: '#004280',
          800: '#002a4d',
          900: '#00111a',
        },
        secondary: {
          50: '#e6f7f0',
          100: '#b3e7d1',
          200: '#80d7b2',
          300: '#4dc793',
          400: '#1ab774',
          500: '#00a85a',
          600: '#008347',
          700: '#005e34',
          800: '#003921',
          900: '#00140e',
        },
      },
    },
  },
  plugins: [],
}
