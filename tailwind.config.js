/** @type {import('tailwindcss').Config} */
export default {
  content: ['./index.html', './src/**/*.{js,jsx}'],
  theme: {
    extend: {
      colors: {
        base: '#0C0C12',
        surface: '#14141C',
        line: '#262633',
        ink: '#F3F3F7',
        muted: '#9C9CB0',
        accent: { DEFAULT: '#7C6CFF', soft: '#9B8FFF', button: '#6653D8', hover: '#5746C5' },
      },
      fontFamily: {
        display: ['Manrope', 'system-ui', 'sans-serif'],
        sans: ['"DM Sans"', 'system-ui', 'sans-serif'],
      },
    },
  },
  plugins: [],
}
