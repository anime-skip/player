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
        CRUNCHYROLL_ORANGE: {
          primary: '#f4741f',
          secondary: '#fab818',
          accent: '#548094',
          neutral: '#23252b',
          'base-100': '#000000',
          info: '#FFFFFF',
          success: '#A8FF60',
          warning: '#fab818',
          error: '#FF6060',
          '--rounded-box': '6px',
          '--rounded-badge': '4px',
          '--rounded-btn': '6px',
        },
        VRV_YELLOW: {
          primary: '#FAB818',
          secondary: '#62D1FF',
          accent: '#F47521',
          neutral: '#302E42',
          'base-100': '#1B1A26',
          info: '#FFFFFF',
          success: '#B7DE7D',
          warning: '#EEC762',
          error: '#FF808F',
          '--rounded-box': '0px',
          '--rounded-badge': '0px',
          '--rounded-btn': '0px',
        },
        FUNIMATION_PURPLE: {
          primary: '#6859F0',
          secondary: '#5995F0',
          accent: '#6859F0',
          neutral: '#36303E',
          'base-100': '#26212D',
          info: '#ffffff',
          success: '#68C430',
          warning: '#FFBF0D',
          error: '#F80000',
          '--rounded-box': '0px',
          '--rounded-badge': '0px',
          '--rounded-btn': '0px',
        },
        ZORO_GREEN: {
          primary: '#D1E876',
          secondary: '#F7D07F',
          accent: '#F7D07F',
          neutral: '#121315',
          'base-100': '#202125',
          info: '#ffffff',
          success: '#68C430',
          warning: '#F7D07F',
          error: '#F80000',
          '--rounded-box': '4px',
          '--rounded-badge': '3px',
          '--rounded-btn': '4px',
        },
      },
    ],
    logs: false,
  },
};
