/** @type {import('tailwindcss').Config} */
export default {
  content: [
    './index.html',
    './src/**/*.{js,ts}',
  ],
  theme: {
    extend: {
      fontFamily: {
        sans: ['Montserrat', 'sans-serif'],
        serif: ['Cormorant Garamond', 'serif'],
      },
      colors: {
        dark: '#050505',
        light: '#F5F5F0',
        accent: '#8C8C8C'
      }
    }
  },
  plugins: [],
}
