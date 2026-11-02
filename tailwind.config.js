/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        rbx: {
          bg: '#08090C',
          card: '#101218',
          cardHover: '#161922',
          border: '#232734',
          borderRed: 'rgba(239, 68, 68, 0.35)',
          red: {
            DEFAULT: '#FF2A3A',
            hover: '#E50914',
            dark: '#99000B',
            light: '#FF5C69',
            glow: 'rgba(255, 42, 58, 0.45)',
          },
          dark: {
            900: '#07080A',
            800: '#0E1015',
            700: '#151821',
            600: '#1E222E',
            500: '#2C3243',
            400: '#4E576F',
            300: '#8792AE',
            200: '#C2C9DB',
            100: '#EDF1FA',
          }
        }
      },
      fontFamily: {
        sans: ['"Outfit"', 'system-ui', '-apple-system', 'sans-serif'],
        display: ['"Space Grotesk"', '"Outfit"', 'sans-serif'],
      },
      boxShadow: {
        'glow-red': '0 0 25px -5px rgba(255, 42, 58, 0.45)',
        'glow-red-lg': '0 0 45px -5px rgba(255, 42, 58, 0.55)',
        'glow-subtle': '0 0 15px -3px rgba(255, 42, 58, 0.25)',
        'card-dark': '0 10px 30px -10px rgba(0, 0, 0, 0.8)',
      },
      backgroundImage: {
        'radial-gradient': 'radial-gradient(circle at 50% 0%, rgba(255, 42, 58, 0.15) 0%, transparent 70%)',
        'grid-pattern': "linear-gradient(to right, rgba(255, 255, 255, 0.03) 1px, transparent 1px), linear-gradient(to bottom, rgba(255, 255, 255, 0.03) 1px, transparent 1px)",
      },
      animation: {
        'pulse-subtle': 'pulse 3s cubic-bezier(0.4, 0, 0.6, 1) infinite',
        'float': 'float 6s ease-in-out infinite',
      },
      keyframes: {
        float: {
          '0%, 100%': { transform: 'translateY(0px)' },
          '50%': { transform: 'translateY(-8px)' },
        }
      }
    },
  },
  plugins: [],
}
