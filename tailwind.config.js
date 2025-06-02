/** @type {import('tailwindcss').Config} */
export default {
  content: ["./src/**/*.{html,js,ts,jsx,tsx,vue}"],

  theme: {
    extend: {
      colors: {
        background: "#FAFAFA",
        primary: "#1E1E1E",
        accent: "#009688",
        highlight: "#FFB400",
      },
    },
  },
  // plugins: [require("daisyui")],

  // daisyui: {
  //   themes: ["light", "dark"],
  // },
};
