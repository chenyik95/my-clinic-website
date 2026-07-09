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
        // Zen Pulse — Dual Beige Pairing
        // Pairing 1: Soft cream & sand beige
        background: '#f7f2ea',
        'card-muted': '#efe6d8',
        beige: {
          DEFAULT: '#e4d4be',
          dark: '#c9b498',
        },
        // Pairing 2: Taupe beige & mocha
        mocha: {
          DEFAULT: '#6b5544',
          dark: '#534233',
          light: '#f3ebe0',
          muted: '#d9ccb8',
          soft: '#8a7360',
        },
        primary: {
          DEFAULT: '#6b5544',
          dark: '#534233',
        },
        secondary: '#3d3229',
        accent: '#e4d4be',
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
