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
          light: "#fff1f2",
          DEFAULT: "#fb7185",
          dark: "#e11d48",
        },
        blue: {
          light: "#f0f9ff",
          DEFAULT: "#38bdf8",
          dark: "#0284c7",
        },
      },
      backgroundImage: {
        "gradient-radial": "radial-gradient(var(--tw-gradient-stops))",
        "gradient-conic":
          "conic-gradient(from 180deg at 50% 50%, var(--tw-gradient-stops))",
        "subtle-reveal": "linear-gradient(135deg, #fff1f2 0%, #f0f9ff 100%)",
      },
    },
  },
  plugins: [],
};

export default config;
