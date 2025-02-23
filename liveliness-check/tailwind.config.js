
/** @type {import('tailwindcss').Config} */
export default {
  content: ["./index.html", "./src/**/*.{js,ts,jsx,tsx}"],
  darkMode: "class",
  theme: {
    extend: {
      colors: {
        primary: "#002564",
        darkPrimary: "#9BC0FF",
        secondary: "#528DC2",
        darkSecondary: "#002E57",
        tertiary: "#CCCCCC",
        accent: "#EA8A13",
        error: "#FF3B30",
        softDark: "#333333",
        softDark2: "#3B3B3B",
        dark: "#0D0D0D",
        dark2: "#1A1A1A",
        dark3: "#121212",
        softLight: "#FFFFFF80",
        softLight2: "#FFFFFFB2",
        light: "#D4D4D4",
        light2: "#E1E1E1",
        softPurple: "#CFCBE6E5",
        softPurple2: "#DED0F3",
        purple: "#9790C9",
      },
      fontSize: {
        tiny: ["0.625rem", { lineHeight: "0.875rem" }],
        micro: ["0.525rem", { lineHeight: "0.4375rem" }],
      },
      fontFamily: {
        inter: ["Inter", "sans-serif"],
      },
      boxShadow: {
        sharp: "0 3px 10px rgba(0, 0, 0, 0.2)",
        custom: "0px 4px 40px 0px #00000033",
        custom1:
          "rgba(0, 0, 0, 0.25) 0px 0.0625em 0.0625em, rgba(0, 0, 0, 0.25) 0px 0.125em 0.5em, rgba(255, 255, 255, 0.1) 0px 0px 0px 1px inset",
        custom2: "0px 4px 15px 0px #00000033",
        custom3: "0px 0px 1px 0px #0000000A",
        custom4: "0px 4px 8px 0px #0000000A",
        custom5: "0px 16px 24px 0px #0000000A",
        custom6: "0px 24px 32px 0px #0000000A",
      },
      gridTemplateColumns: {
        "auto-fit-minmax": "repeat(auto-fit, minmax(261px, 1fr))",
      },
      backgroundImage: {
        "custom-nuban-bg":
          "linear-gradient(102.87deg, #002564 35.14%, #000000 116.75%)",
      },
      keyframes: {
        fadeIn: {
          "0%": { opacity: "0" },
          "100%": { opacity: "1" },
        },
        glow: {
          "0%": { textShadow: "0 0 4px rgba(255, 0, 0, 0.5)" },
          "100%": { textShadow: "0 0 12px rgba(255, 0, 0, 1)" },
        },
      },
      animation: {
        fadeIn: "fadeIn 0.5s ease-in-out",
        glow: "glow 1.5s infinite alternate",
      },
    },
  },
  plugins: [],
};
