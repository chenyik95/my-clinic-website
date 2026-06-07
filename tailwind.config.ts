import type { Config } from 'tailwindcss';

const config: Config = {
  content: [
    './pages/**/*.{js,ts,jsx,tsx,mdx}',
    './components/**/*.{js,ts,jsx,tsx,mdx}',
    './app/**/*.{js,ts,jsx,tsx,mdx}',
  ],
  theme: {
    extend: {
      colors: {
        // Zen Pulse - Calming Medical Palette
        background: '#F8FAF9',
        'card-muted': '#F0F7F6',
        primary: {
          DEFAULT: '#2A9D8F',
          dark: '#1F7A6E',
        },
        secondary: '#264653',
        accent: '#5BB9A6',
        text: {
          primary: '#1E2937',
          secondary: '#475569',
        },
      },
      borderRadius: {
        '2xl': '1rem',
        '3xl': '1.5rem',
      },
    },
  },
  plugins: [],
};

export default config;
