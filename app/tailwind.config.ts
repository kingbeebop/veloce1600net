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
        background: "#000000", // Black background
        foreground: "#FFFFFF", // White text for contrast
        primary: "#4A90E2", // Example primary color (blue)
        secondary: "#E94E77", // Example secondary color (pink)
        muted: "#B0B0B0", // Muted text color for less emphasis
        // You can add more colors as needed
      },
      backgroundColor: {
        page: "#000000", // Custom background for pages
      },
      textColor: {
        page: "#FFFFFF", // Custom text color for pages
      },
    },
  },
  plugins: [],
};

export default config;
