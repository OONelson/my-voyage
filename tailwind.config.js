/** @type {import('tailwindcss').Config} */
export default {
  content: ["./src/**/*.{html,js,ts,jsx,tsx,vue}"],
  darkMode: "class", // Enable class-based dark mode

  theme: {
    screens: {
      xs: "375px",
      sm: "425px",
      md: "760px",
      lg: "1024px",
      xl: "1380px",
    },
    extend: {
      colors: {
        // Light theme colors
        background100: "#fcfcfc",
        background200: "#fbf9f5",
        text: "#717171",
        textblack50: "#4c4c4c",
        textblack100: "#272727",
        textblack200: "#121212",
        textblack300: "#020202",
        buttonLightcolor: "#f4f4f4",
        inputColor100: "#f3f3f3",
        inputColor200: "#ececec",
        accent10: "#a4c3bd",
        accent30: "#81aca4",
        accent50: "#498a80",
        accent100: "#006e63",
        accent200: "#005b52",
        accent300: "#002925",
        highlight: "#FFB400",
        border100: "#e0e0e0",
        border200: "#c3c3c3",
        border300: "#272727",
        skeleton: "#c7c9cc",

        // Dark theme colors
        dark: {
          background100: "#121212",
          background200: "#1a1a1a",
          text: "#e0e0e0",
          textblack50: "#b0b0b0",
          textblack100: "#d0d0d0",
          textblack200: "#f0f0f0",
          textblack300: "#ffffff",
          buttonLightcolor: "#2a2a2a",
          inputColor100: "#2a2a2a",
          inputColor200: "#333333",
          accent10: "#4a6b66",
          accent30: "#5a7b76",
          accent50: "#6a8b86",
          accent100: "#7a9b96",
          accent200: "#8aaba6",
          accent300: "#9abbb6",
          highlight: "#FFB400",
          border100: "#333333",
          border200: "#404040",
          border300: "#666666",
          skeleton: "#4a4a4a",
        },
      },
    },
  },
};
