/** @type {import('tailwindcss').Config} */
export default {
  content: ["./src/**/*.{html,js,ts,jsx,tsx,vue}"],

  theme: {
    extend: {
      colors: {
        background100: "#fcfcfc",
        background200: "#fbf9f5",
        text: "#838383",
        textblack100: "#272727",
        textblack200: "#121212",
        textblack300: "#020202",
        buttonLightcolor: "#f4f4f4",
        inputColor100: "#f3f3f3",
        inputColor200: "#ececec",
        accent100: "#006e63",
        accent200: "#005b52",
        accent300: "#004941",
        highlight: "#FFB400",
        border100: "#e0e0e0",
        border200: "#c3c3c3",
        border300: "#272727",
      },
    },
  },
  // plugins: [require("daisyui")],

  // daisyui: {
  //   themes: ["light", "dark"],
  // },
};
