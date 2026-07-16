/** @type {import('tailwindcss').Config} */
export default {
  content: ['./index.html', './src/**/*.{js,ts,jsx,tsx}'],
  theme: {
    extend: {
      colors: {
        forest: {
          DEFAULT: '#1E3A1E',
          50:  '#f0f5ef',
          100: '#dde8da',
          200: '#bcd4b6',
          300: '#9bba91',
          400: '#7a9f6d',
          500: '#5a854a',
          600: '#4A7A2E',
          700: '#3d6b2e',
          800: '#2D6B3A',
          900: '#1E3A1E',
        },
        olive: { DEFAULT: '#4A7A2E' },
        sage:  { DEFAULT: '#6B9B4A' },
        earth: { DEFAULT: '#7A5C2B', light: '#9a7c4b' },
        gold: {
          DEFAULT: '#E8943C',
          light:   '#f0a85c',
          dark:    '#c97a22',
        },
      },
      fontFamily: {
        display: ['"Playfair Display"', 'Georgia', 'serif'],
        body:    ['Inter', 'system-ui', 'sans-serif'],
      },
      animation: {
        'fade-in-up':      'fadeInUp 0.6s ease-out both',
        'fade-in':         'fadeIn 0.6s ease-out both',
        'slide-in-right':  'slideInRight 0.45s ease-out both',
      },
      keyframes: {
        fadeInUp: {
          '0%':   { opacity: '0', transform: 'translateY(24px)' },
          '100%': { opacity: '1', transform: 'translateY(0)' },
        },
        fadeIn: {
          '0%':   { opacity: '0' },
          '100%': { opacity: '1' },
        },
        slideInRight: {
          '0%':   { opacity: '0', transform: 'translateX(30px)' },
          '100%': { opacity: '1', transform: 'translateX(0)' },
        },
      },
    },
  },
  plugins: [],
};
