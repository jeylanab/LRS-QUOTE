/** @type {import('tailwindcss').Config} */
export default {
  content: ['./index.html', './src/**/*.{js,ts,jsx,tsx}'],
  theme: {
    extend: {
      colors: {
        // LRS Brand Colours
        navy:     '#002664',   // primary text, buttons, badges
        'navy-light': '#003580',
        sky:      '#6EC6F0',   // accent / header bg
        'sky-light': '#EAF6FD', // card backgrounds / page bg
        'sky-mid':   '#C8E9F8', // borders, hover tints
        white:    '#FFFFFF',
        // Utility
        success:  '#16a34a',
        error:    '#dc2626',
        muted:    '#94a3b8',
      },
      fontFamily: {
        sans: ['Outfit', 'sans-serif'],
        display: ['Outfit', 'sans-serif'],
      },
      borderRadius: {
        '2xl': '1rem',
        '3xl': '1.5rem',
        '4xl': '2rem',
      },
      boxShadow: {
        card:   '0 2px 16px 0 rgba(0,38,100,0.07)',
        active: '0 4px 24px 0 rgba(0,38,100,0.15)',
        btn:    '0 2px 8px 0 rgba(0,38,100,0.18)',
      },
      animation: {
        'drop-in':     'dropIn 0.5s cubic-bezier(0.22,1,0.36,1) both',
        'shake':       'shake 0.4s ease both',
        'shimmer':     'shimmer 1.6s infinite ease-out',
        'bounce-soft': 'bounceSoft 1s infinite',
        'fade-up':     'fadeUp 0.45s cubic-bezier(0.22,1,0.36,1) both',
      },
      keyframes: {
        dropIn: {
          '0%':   { opacity: '0', transform: 'translateY(-18px)' },
          '100%': { opacity: '1', transform: 'translateY(0)' },
        },
        shake: {
          '0%,100%': { transform: 'translateX(0)' },
          '20%':     { transform: 'translateX(-6px)' },
          '40%':     { transform: 'translateX(6px)' },
          '60%':     { transform: 'translateX(-4px)' },
          '80%':     { transform: 'translateX(4px)' },
        },
        shimmer: {
          '0%':   { transform: 'translateX(-100%)' },
          '100%': { transform: 'translateX(200%)' },
        },
        bounceSoft: {
          '0%,100%': { transform: 'translateY(0)' },
          '50%':     { transform: 'translateY(-6px)' },
        },
        fadeUp: {
          '0%':   { opacity: '0', transform: 'translateY(12px)' },
          '100%': { opacity: '1', transform: 'translateY(0)' },
        },
      },
    },
  },
  plugins: [],
};
