import type { Config } from "tailwindcss";

const config: Config = {
  content: [
    "./src/pages/**/*.{js,ts,jsx,tsx,mdx}",
    "./src/components/**/*.{js,ts,jsx,tsx,mdx}",
    "./src/app/**/*.{js,ts,jsx,tsx,mdx}",
  ],
  darkMode: "class",
  theme: {
    extend: {
      colors: {
        parchment: {
          50: "#fbfaf8",
          100: "#f6f3ee",
          200: "#eee7dd",
          300: "#e0d3c1",
          400: "#cfbba2",
          500: "#bf9e80",
          600: "#b08968",
          700: "#937053",
          800: "#785b45",
          900: "#624a3a",
        },
        ink: {
          50: "#f4f5f7",
          100: "#e4e7eb",
          200: "#cbd1d8",
          300: "#a5b0be",
          400: "#798ba1",
          500: "#5b6e85",
          600: "#46566b",
          700: "#384556",
          800: "#27313d",
          900: "#131922",
          950: "#0b0f15",
        },
        gilded: {
          400: "#dfb15b",
          500: "#c89b3c",
          600: "#a97d26",
        }
      },
      fontFamily: {
        serif: ["Merriweather", "Georgia", "Cambria", "serif"],
        sans: ["system-ui", "-apple-system", "BlinkMacSystemFont", "Segoe UI", "Roboto", "sans-serif"],
        mono: ["ui-monospace", "SFMono-Regular", "Menlo", "Monaco", "Consolas", "monospace"],
      },
    },
  },
  plugins: [],
};
export default config;
