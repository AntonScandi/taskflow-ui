import { heroui } from "@heroui/react";

/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
    "./node_modules/@heroui/theme/dist/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        "task-low": "#22c55e",
        "task-medium": "#f59e0b",
        "task-high": "#ef4444",
      },
    },
  },
  darkMode: "class",
  plugins: [heroui()],
};
