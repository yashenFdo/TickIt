import type { Config } from 'tailwindcss'

export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        luxury: {
          gold: '#C5A059',
          'gold-light': '#E6CA65',
          black: '#0B0B0B',
          dark: '#161616',
          muted: '#A0A0A0',
          white: '#FFFFFF',
        },
        netflix: {
          red: '#E50914',
          black: '#000000',
          'dark-grey': '#141414',
          'light-grey': '#B3B3B3',
          white: '#FFFFFF',
        },
      },
      fontFamily: {
        sans: ['Inter', 'serif', 'system-ui', 'sans-serif'],
      },
    },
  },
  plugins: [],
} satisfies Config
