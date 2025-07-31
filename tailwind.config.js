/** @type {import('tailwindcss').Config} */
export default {
  content: ["./src/**/*.{html,js,ts,jsx,tsx,vue}"],

  theme: {
    screens: {
      xs: "375px",
      sm: "425px",
      md: "760px",
      lg: "1024px",
      xl: "1380px",
    },
    extend: {
      backgroundImage: {
        "hero-image": "url('/src/assets/images/bg3.jpg')",
      },
      colors: {
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
        skeleton: "#c7c9cc ",
      },
    },
  },
};
