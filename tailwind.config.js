/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    './pages/**/*.{js,ts,jsx,tsx,mdx}',
    './components/**/*.{js,ts,jsx,tsx,mdx}',
    './app/**/*.{js,ts,jsx,tsx,mdx}',
  ],
  theme: {
    extend: {
      colors: {
        coffee: {
          50: '#fef7f0',
          100: '#fdecd8',
          200: '#fbd5b0',
          300: '#f8b77a',
          400: '#f5934a',
          500: '#f2752a',
          600: '#e35a1f',
          700: '#bc441c',
          800: '#96361e',
          900: '#7a2f1c',
        },
        cream: {
          50: '#fefefe',
          100: '#fdfcfb',
          200: '#faf7f4',
          300: '#f5f0ea',
          400: '#ede4d9',
          500: '#e2d4c3',
          600: '#d1c0a8',
          700: '#b8a589',
          800: '#9c8b6f',
          900: '#7f735c',
        },
        mystic: {
          50: '#f8fafc',
          100: '#f1f5f9',
          200: '#e2e8f0',
          300: '#cbd5e1',
          400: '#94a3b8',
          500: '#64748b',
          600: '#475569',
          700: '#334155',
          800: '#1e293b',
          900: '#0f172a',
        }
      },
      fontFamily: {
        'mystic': ['Crimson Text', 'serif'],
        'modern': ['Inter', 'sans-serif'],
      },
      animation: {
        'steam': 'steam 3s ease-in-out infinite',
        'float': 'float 6s ease-in-out infinite',
        'glow': 'glow 2s ease-in-out infinite alternate',
      },
      keyframes: {
        steam: {
          '0%, 100%': { opacity: '0', transform: 'translateY(0) scale(1)' },
          '50%': { opacity: '0.6', transform: 'translateY(-20px) scale(1.1)' },
        },
        float: {
          '0%, 100%': { transform: 'translateY(0px)' },
          '50%': { transform: 'translateY(-10px)' },
        },
        glow: {
          '0%': { boxShadow: '0 0 20px rgba(242, 117, 42, 0.3)' },
          '100%': { boxShadow: '0 0 30px rgba(242, 117, 42, 0.6)' },
        },
      },
    },
  },
  plugins: [],
}
