/** @type {import('tailwindcss/tailwind-config').TailwindConfig} */
module.exports = {
  presets: [require('@anime-skip/ui/tailwind.preset')],
  prefix: 'as-',
  content: [
    './src/**/*.{vue,js,ts,jsx,tsx}',
    '../player-ui/src/**/*.{vue,js,ts,jsx,tsx}',
    './node_modules/@anime-skip/ui/ui.*.js',
  ],
};
