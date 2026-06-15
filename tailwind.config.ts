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
        // Zen Pulse - Warm Beige Clinic Theme
        background: '#f9f5ed',
        'card-muted': '#f4eee3',
        primary: {
          DEFAULT: '#e5d5bf',
          dark: '#d4c3a8',
        },
        secondary: '#3a2f2a',
        accent: '#e5d5bf',
        text: {
          primary: '#2c2522',
          secondary: '#5c5148',
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
