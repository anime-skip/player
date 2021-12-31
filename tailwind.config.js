/** @type {import('tailwindcss/tailwind-config').TailwindConfig} */
module.exports = {
  presets: [require('@anime-skip/ui/tailwind.preset')],
  prefix: 'as-',
  content: [
    './src/**/*.html',
    './src/**/*.vue',
    './src/**/*.jsx',
    './src/**/*.tsx',
    './node_modules/@anime-skip/ui/ui.*.js',
  ],
  theme: {
    extend: {
      width: {
        'popup-sm': '20rem',
        'popup-lg': '38rem',
      },
    },
  },
};
