/** @type {import('tailwindcss').Config} */
export default {
  content: ['./index.html', './src/**/*.{js,jsx}'],
  theme: {
    extend: {
      colors: {
        brand: {
          50: '#eef4ff',
          100: '#dbe6ff',
          200: '#bccfff',
          300: '#8dabff',
          400: '#577dff',
          500: '#3355f5',
          600: '#213ce0',
          700: '#1b2fb8',
          800: '#1c2c94',
          900: '#1c2b75',
        },
        accent: {
          400: '#22d3ee',
          500: '#06b6d4',
          600: '#0891b2',
        },
        ink: {
          900: '#0b1020',
          800: '#111834',
          700: '#1c274c',
        },
      },
      fontFamily: {
        sans: ['Inter', 'ui-sans-serif', 'system-ui', 'sans-serif'],
      },
      boxShadow: {
        soft: '0 10px 30px -12px rgba(28, 44, 148, 0.25)',
        glow: '0 0 0 1px rgba(51,85,245,0.08), 0 20px 40px -16px rgba(51,85,245,0.35)',
      },
      backgroundImage: {
        'grid-fade':
          'radial-gradient(circle at 1px 1px, rgba(51,85,245,0.10) 1px, transparent 0)',
      },
      keyframes: {
        'fade-up': {
          '0%': { opacity: '0', transform: 'translateY(12px)' },
          '100%': { opacity: '1', transform: 'translateY(0)' },
        },
        float: {
          '0%,100%': { transform: 'translateY(0)' },
          '50%': { transform: 'translateY(-8px)' },
        },
      },
      animation: {
        'fade-up': 'fade-up 0.5s ease-out both',
        float: 'float 6s ease-in-out infinite',
      },
    },
  },
  plugins: [],
};
