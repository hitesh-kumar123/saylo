/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        ink: '#0A0A0B',
        paper: '#F5F2EC',
        cream: '#EDE9E0',
        warm: '#E8E2D5',
        sayloAccent: '#C8FF00',
        sayloAccent2: '#FF4B2B',
        muted: '#8A8578',
        border: 'rgba(10,10,11,0.12)',
        
        // Keeping legacy primary/accent for backwards compatibility but not using them mostly
        primary: {
          50: '#f0f9ff',
          100: '#e0f2fe',
          200: '#bae6fd',
          300: '#7dd3fc',
          400: '#38bdf8',
          500: '#0ea5e9',
          600: '#0284c7',
          700: '#0369a1',
          800: '#075985',
          900: '#0c4a6e',
          950: '#082f49',
        },
        dark: {
          bg: '#0f172a',
          card: '#1e293b',
          border: '#334155',
        }
      },
      fontFamily: {
        sans: ['Instrument Sans', 'sans-serif'],
        display: ['Bebas Neue', 'sans-serif'],
        serif: ['Instrument Serif', 'serif'],
      },
      animation: {
        'glow': 'glow 2s cubic-bezier(0.4, 0, 0.6, 1) infinite',
        'float': 'float 3s ease-in-out infinite',
      },
      keyframes: {
        glow: {
          '0%, 100%': { opacity: 1 },
          '50%': { opacity: 0.5 },
        },
        float: {
          '0%, 100%': { transform: 'translateY(0)' },
          '50%': { transform: 'translateY(-10px)' },
        }
      }
    },
  },
  plugins: [],
}
