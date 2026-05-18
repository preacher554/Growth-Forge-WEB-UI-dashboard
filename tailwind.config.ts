import type { Config } from "tailwindcss";

const config: Config = {
  content: ["./src/**/*.{js,ts,jsx,tsx,mdx}"],
  theme: {
    extend: {
      colors: {
        forge: {
          black: "#050505",
          panel: "#0e0e0e",
          panelSoft: "#151515",
          line: "#242424",
          red: "#ff3b00",
          redSoft: "#ff5b2a",
          smoke: "#a3a3a3",
        },
      },
      boxShadow: {
        forge: "0 0 0 1px rgba(255,59,0,0.18), 0 24px 80px rgba(0,0,0,0.7)",
        glow: "0 0 45px rgba(255,59,0,0.24)",
      },
      backgroundImage: {
        "forge-grid":
          "linear-gradient(rgba(255,255,255,0.035) 1px, transparent 1px), linear-gradient(90deg, rgba(255,255,255,0.035) 1px, transparent 1px)",
      },
    },
  },
  plugins: [],
};

export default config;
