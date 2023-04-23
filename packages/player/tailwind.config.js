import daisyui from 'daisyui';

/** @type {import('tailwindcss').Config} */
export default {
  content: ['./src/**/*.vue', './src/components/**/*'],
  theme: {
    extend: {},
    // fontFamily: {
    //   sans: ['Inter', ...defaultTheme.fontFamily.sans],
    //   overpass: ['Overpass', 'Inter', ...defaultTheme.fontFamily.sans],
    // },
  },
  plugins: [daisyui],
  daisyui: {
    themes: [
      {
        'anime-skip': {
          primary: '#32B5F2',
          secondary: '#A875EB',
          accent: '#A875EB',
          neutral: '#171A1C',
          'base-100': '#282F37',
          info: '#FFFFFF',
          success: '#B7DE7D',
          warning: '#EEC762',
          error: '#FF808F',
          '--rounded-box': '4px',
          '--rounded-badge': '3px',
          '--rounded-btn': '4px',
        },
      },
    ],
    logs: false,
  },
};
