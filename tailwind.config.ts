import type { Config } from "tailwindcss";

const config: Config = {
  content: [
    "./app/**/*.{ts,tsx}",
    "./components/**/*.{ts,tsx}",
    "./lib/**/*.{ts,tsx}",
    "./data/**/*.{ts,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        background: "#F6F6F2",
        surface: "#FFFFFF",
        ink: "#20252B",
        muted: "#727780",
        line: "#E5E7EB",
        accent: {
          DEFAULT: "#5367D9",
          soft: "#EEF0FF",
          deep: "#3B4BBF",
        },
      },
      fontFamily: {
        sans: ["var(--font-vazir)", "Vazirmatn", "Tahoma", "sans-serif"],
      },
    },
  },
  plugins: [],
};

export default config;