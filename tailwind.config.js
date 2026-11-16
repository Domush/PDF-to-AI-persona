/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  darkMode: 'class',
  theme: {
    extend: {
      fontFamily: {
        sans: ['Inter', 'system-ui', '-apple-system', 'BlinkMacSystemFont', 'Segoe UI', 'Roboto', 'sans-serif'],
        serif: ['Merriweather', 'Georgia', 'Cambria', 'serif'],
        mono: ['JetBrains Mono', 'Fira Code', 'Menlo', 'Monaco', 'Courier New', 'monospace'],
      },
      colors: {
        parchment: {
          50: '#fbf9f5',
          100: '#f5f0e6',
          200: '#ebdccb',
          300: '#dec2a8',
          400: '#cca082',
          500: '#be8464',
          600: '#b07154',
          700: '#935b44',
          800: '#774a3b',
          900: '#613e33',
        }
      }
    },
  },
  plugins: [],
}
