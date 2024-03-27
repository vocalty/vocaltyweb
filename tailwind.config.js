/** @type {import('tailwindcss').Config} */
const withMT = require("@material-tailwind/react/utils/withMT");
module.exports = withMT({
  content: ["./src/**/*.{js,jsx,ts,tsx}"],
  theme: {
    extend: {
      backgroundImage: {
        "home-bg": "url('/assets/home-bg.jpg')",
      },
    },
    variants: {
      extend: {
        // Add 'group-hover' to the variants
        scale: ["group-hover"],
        duration: ["300"],
      },
    },
    // fontFamily: {
    //   'sans': ['ui-sans-serif', 'system-ui'],
    //   'serif': ['ui-serif', 'Georgia'],
    //   'mono': ['ui-monospace', 'SFMono-Regular'],
    //   'display': ['Oswald'],
    //   'body': ['"Open Sans"'],
    // }
    screens: {
      'tablet': '850px',
      // => @media (min-width: 640px) { ... }
    }
  },
  plugins: [require('tailwind-scrollbar'),],
});
