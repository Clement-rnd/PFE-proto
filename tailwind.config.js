/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    './app/**/*.{js,jsx,ts,tsx}',
    './src/**/*.{js,jsx,ts,tsx}',
  ],
  presets: [require('nativewind/preset')],
  theme: {
    extend: {
      colors: {
        primary: {
          50:  '#FEF0F2',
          100: '#FCDFE4',
          200: '#FAC0CB',
          300: '#F490A8',
          400: '#EC6488',
          DEFAULT: '#E0587E',
          500: '#E0587E',
          600: '#BF4059',
          700: '#9B2E44',
          800: '#7A1F30',
          900: '#5C1422',
        },
        success: {
          50:  '#EDFAF2',
          DEFAULT: '#52A76A',
          500: '#52A76A',
          600: '#3D8A53',
        },
        warning: {
          50:  '#FFF8EC',
          DEFAULT: '#F5A623',
          500: '#F5A623',
          600: '#D48A0A',
        },
        danger: {
          50:  '#FDECEA',
          DEFAULT: '#C0392B',
          500: '#C0392B',
          600: '#9B2D20',
        },
        info: {
          50:  '#EBF3FD',
          DEFAULT: '#4A90D9',
          500: '#4A90D9',
          600: '#2F74C0',
        },
        neutral: {
          50:  '#F7F6F7',
          100: '#EEECEE',
          200: '#D9D6D9',
          300: '#C0BCC0',
          400: '#A09CA0',
          500: '#7E7A7E',
          600: '#5C585C',
          700: '#3E3B3E',
          800: '#2A272A',
          900: '#1A181A',
          950: '#0D0C0D',
        },
      },
      fontFamily: {
        'massilia-light':   ['Massilia-Light'],
        'massilia':         ['Massilia-Regular'],
        'massilia-bold':    ['Massilia-Bold'],
      },
    },
  },
  plugins: [],
};
