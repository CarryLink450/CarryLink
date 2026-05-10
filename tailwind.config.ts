import type { Config } from "tailwindcss";

const config: Config = {
  content: [
    "./app/**/*.{js,ts,jsx,tsx,mdx}",
    "./components/**/*.{js,ts,jsx,tsx,mdx}",
    "./data/**/*.{js,ts,jsx,tsx,mdx}",
    "./lib/**/*.{js,ts,jsx,tsx,mdx}"
  ],
  theme: {
    extend: {
      colors: {
        ink: "#172126",
        trust: "#146C67",
        skywash: "#EAF4F2",
        coral: "#D96C53",
        wheat: "#F7E9CF"
      },
      boxShadow: {
        soft: "0 16px 40px rgba(23, 33, 38, 0.08)"
      }
    }
  },
  plugins: []
};

export default config;
