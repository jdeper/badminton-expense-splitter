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
        'badminton-green': '#22c55e',
        'badminton-dark': '#0f172a',
        'badminton-light': '#1e293b',
      },
    },
  },
  plugins: [],
};
export default config;
