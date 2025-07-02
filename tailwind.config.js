/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      // 1. Define your keyframes here
      keyframes: {
        fadeIn: {
          '0%': { opacity: '0' },
          '100%': { opacity: '1' },
        },
        slideInRight: {
          '0%': { transform: 'translateX(20px)', opacity: '0' },
          '100%': { transform: 'translateX(0)', opacity: '1' },
        },
      },
      // 2. Register them as animation utilities
      animation: {
        'fade-in': 'fadeIn 0.3s ease-in',
        'slide-in-right': 'slideInRight 0.3s ease-out',
      },
    },
  },
  plugins: [],
}