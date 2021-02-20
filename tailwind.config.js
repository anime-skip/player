module.exports = {
  presets: [require('@anime-skip/ui/tailwind.preset')],
  // purge: ['./index.html', './src/**/*.{vue,js,ts,jsx,tsx}'],
  purge: [],
  theme: {
    extend: {
      width: {
        'popup-sm': '20rem',
        'popup-lg': '38rem',
      },
    },
  },
};
