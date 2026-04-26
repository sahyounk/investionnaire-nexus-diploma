/** @type {import('tailwindcss').Config} */
export default {
  content: ["./index.html", "./src/**/*.{ts,tsx}"],
  theme: {
    extend: {
      fontFamily: {
        sans: ["Inter", "system-ui", "sans-serif"],
      },
      colors: {
        brand: {
          emerald: "#10b981",
          emeraldDark: "#059669",
          blue: "#3b82f6",
          blueLight: "#60a5fa",
          amber: "#f59e0b",
          amberLight: "#fbbf24",
          mint: "#F0FAF7",
          ink: "#111827",
        },
      },
      backgroundImage: {
        "brand-gradient": "linear-gradient(90deg, #10b981 0%, #3b82f6 100%)",
        "brand-gradient-soft":
          "linear-gradient(180deg, #ecfdf5 0%, #eff6ff 100%)",
      },
      boxShadow: {
        card: "0 10px 30px -12px rgba(16, 185, 129, 0.18)",
      },
    },
  },
  plugins: [],
};
