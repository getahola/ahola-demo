/** @type {import('tailwindcss').Config} */
export default {
  content: ['./index.html', './src/**/*.{ts,tsx}'],
  theme: {
    extend: {
      colors: {
        brand: {
          50: '#f0fdfa',
          100: '#ccfbf1',
          500: '#14b8a6',
          600: '#0d9488',
          700: '#0f766e',
          800: '#115e59',
        },
        // ahola brand palette
        koralle: {
          DEFAULT: '#D85A30',
          600: '#c24d27',
        },
        creme: '#FAF3EA',
        tinte: '#2C2C2A',
        teal: '#0F6E56',
      },
    },
  },
  plugins: [],
}
