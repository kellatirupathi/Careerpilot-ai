/** @type {import('tailwindcss').Config} */
export default {
  content: ['./index.html', './src/**/*.{js,jsx}'],
  theme: {
    extend: {
      colors: {
        // Confident single-hue indigo. Used deliberately, not everywhere.
        brand: {
          50: '#f2f3ff',
          100: '#e6e8ff',
          200: '#d0d4ff',
          300: '#adb2ff',
          400: '#8286ff',
          500: '#5a5cf5',
          600: '#4c46e8',
          700: '#3f37cc',
          800: '#3530a4',
          900: '#2f2d82',
        },
        // Warm gray neutrals (not the default cold slate) — feels human-designed.
        sand: {
          50: '#faf9f7',
          100: '#f4f2ee',
          200: '#e8e5df',
          300: '#d6d1c7',
          400: '#a8a294',
          500: '#7c7668',
          600: '#5c5749',
          700: '#443f34',
          800: '#2b2822',
          900: '#1a1813',
        },
        ink: '#17151f',
      },
      fontFamily: {
        sans: ['Inter', 'ui-sans-serif', 'system-ui', 'sans-serif'],
        display: ['Fraunces', 'Georgia', 'serif'],
      },
      boxShadow: {
        card: '0 1px 2px rgba(26,24,19,0.04), 0 8px 24px -16px rgba(26,24,19,0.20)',
        lift: '0 2px 4px rgba(26,24,19,0.04), 0 18px 40px -20px rgba(79,55,204,0.30)',
      },
      keyframes: {
        'fade-up': {
          '0%': { opacity: '0', transform: 'translateY(10px)' },
          '100%': { opacity: '1', transform: 'translateY(0)' },
        },
      },
      animation: {
        'fade-up': 'fade-up 0.45s cubic-bezier(0.22,1,0.36,1) both',
      },
    },
  },
  plugins: [],
};
