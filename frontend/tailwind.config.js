/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    './src/**/*.{html,ts}',
  ],
  theme: {
    extend: {},
    colors: {
      'clr-text': '#333333',
      'clr-text-light': '#828282',
      'clr-primary': '#2F80ED',
      'clr-gray': '#BDBDBD',
      'clr-gray-light':'#F8F8F8',
      'clr-white': '#FFFFFF',
      'clr-error': '#EE4A44',
    },
  },
  plugins: [],
};

