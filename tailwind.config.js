/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        brand: {
          navy: '#0b1a30',
          dark: '#12263f',
          teal: '#008290',
          'teal-light': '#00a2b8',
          'teal-dark': '#006b76',
        },
        uc: {
          bg: '#f7f8fa',
          border: '#e0e0e0',
          text: '#1a1a1a',
          muted: '#717171',
          light: '#f0f0f0',
        }
      },
      fontFamily: {
        sans: ['Inter', 'system-ui', '-apple-system', 'sans-serif'],
      },
      borderRadius: {
        'xl': '12px',
        '2xl': '16px',
        '3xl': '20px',
      },
      boxShadow: {
        'card': '0 2px 12px rgba(0,0,0,0.06)',
        'modal': '0 20px 60px rgba(0,0,0,0.18)',
        'nav': '0 2px 10px rgba(0,0,0,0.05)',
      }
    },
  },
  plugins: [],
}
