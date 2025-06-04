import defaultTheme from 'tailwindcss/defaultTheme';

/** @type {import('tailwindcss').Config} */
module.exports = {
  content: ['./src/**/*.{js,ts,jsx,tsx,mdx,css}'],
  theme: {
    extend: {
      fontFamily: { sans: ['Inter', ...defaultTheme.fontFamily.sans] },
      colors: {
        background: '#f3f4f6',
        onBackground: '#4b5563',
        surface: '#ffffff',
        onSurface: '#1f2937',
        outline: '#e5e7eb',
        primary: {
          50: '#f5f3ff',
          100: '#ede9fe',
          200: '#ddd6fe',
          300: '#c4b5fd',
          400: '#a78bfa',
          500: '#8b5cf6',
          600: '#7c3aed',
          700: '#6d28d9',
          800: '#5b21b6',
          900: '#4c1d95',
          950: '#2e1065',
        },
      },
      keyframes: {
        fadeIn: { '0%': { opacity: '0' }, '100%': { opacity: '1' } },
        fadeOut: { '0%': { opacity: '1' }, '100%': { opacity: '0' } },
        scaleIn: {
          from: { opacity: 0, transform: 'translate(-50%, -48%) scale(0.96)' },
          to: { opacity: 1, transform: 'translate(-50%, -50%) scale(1)' },
        },
        scaleOut: {
          from: { opacity: 1, transform: 'translate(-50%, -50%) scale(1)' },
          to: { opacity: 0, transform: 'translate(-50%, -48%) scale(0.96)' },
        },
        slideDownAndFade: {
          from: { opacity: 0, transform: 'translateY(-2px)' },
          to: { opacity: 1, transform: 'translateY(0)' },
        },
        slideUpAndFade: {
          from: { opacity: 0, transform: 'translateY(2px)' },
          to: { opacity: 1, transform: 'translateY(0)' },
        },
      },
      animation: {
        fadeIn: 'fadeIn 0.15s ease-out',
        fadeOut: 'fadeOut 0.15s ease-out',
        scaleIn: 'scaleIn 0.15s ease-out',
        scaleOut: 'scaleOut 0.15s ease-out',
        slideDownAndFade: 'slideDownAndFade 0.4s cubic-bezier(0.16, 1, 0.3, 1)',
        slideUpAndFade: 'slideUpAndFade 0.4s cubic-bezier(0.16, 1, 0.3, 1)',
      },
    },
  },
  plugins: [
    function ({ addBase, config }) {
      addBase({
        body: {
          backgroundColor: config('theme.colors.gray.100'),
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
