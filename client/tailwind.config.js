/** @type {import('tailwindcss').Config} */
module.exports = {
  content: ['./src/**/*.{js,ts,jsx,tsx,mdx}'],
  theme: {
    extend: {},
  },
  plugins: [
    function ({ addBase, config }) {
      addBase({
        body: {
          backgroundColor: config('theme.colors.gray.50'),
          color: config('theme.colors.gray.800'),
        },
        'html.dark body': {
          backgroundColor: config('theme.colors.zinc.900'),
          color: config('theme.colors.zinc.300'),
        },
      });
    },
  ],
};
