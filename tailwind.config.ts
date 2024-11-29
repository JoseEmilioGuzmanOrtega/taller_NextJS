import type { Config } from "tailwindcss";
import forms from "@tailwindcss/forms";
import typography from "@tailwindcss/typography";

const config: Config = {
  content: [
    "./pages/**/*.{js,ts,jsx,tsx,mdx}",
    "./components/**/*.{js,ts,jsx,tsx,mdx}",
    "./app/**/*.{js,ts,jsx,tsx,mdx}",
  ],
  theme: {
    extend: {
      colors: {
        primaryBlack: "#1E1E2F", 
        softPink: "#FFAAC1", 
        lightPurple: "#C4A7E7", 
        calmGreen: "#A3D9C9", 
        softYellow: "#FFE9A0", 
        paleBlue: "#A0D7FF", 
        coralAccent: "#FF8C75", 
        lightLavender: "#E7DFF7", 
        lightBlue: "#2A2A72", 
        softGray: "#F5F5F5", 
      },
      fontFamily: {
        Anaheim: ["Anaheim", "sans-serif"],
        custom: ["Roboto", "sans-serif"],
      },
      spacing: {
        72: "18rem", 
        96: "24rem", 
      },
      borderRadius: {
        custom: "12px", 
      },
      boxShadow: {
        custom: "0 6px 12px rgba(0, 0, 0, 0.15)", 
      },
    },
  },
  plugins: [forms, typography],
};

export default config;
