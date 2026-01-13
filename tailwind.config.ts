import type { Config } from "tailwindcss";

const config: Config = {
  content: [
    "./pages/**/*.{js,ts,jsx,tsx,mdx}",
    "./components/**/*.{js,ts,jsx,tsx,mdx}",
    "./app/**/*.{js,ts,jsx,tsx,mdx}",
  ],
  theme: {
    extend: {
      colors: {
        pink: {
          light: '#FFB6C1',
          DEFAULT: '#FF69B4',
          dark: '#FF1493',
        },
        blue: {
          light: '#87CEEB',
          DEFAULT: '#4169E1',
          dark: '#0000CD',
        },
      },
      backgroundImage: {
        'gradient-radial': 'radial-gradient(var(--tw-gradient-stops))',
        'gradient-conic': 'conic-gradient(from 180deg at 50% 50%, var(--tw-gradient-stops))',
        'gender-reveal': 'linear-gradient(135deg, #FFB6C1 0%, #87CEEB 100%)',
      },
    },
  },
  plugins: [],
};

export default config;
