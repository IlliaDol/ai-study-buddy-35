/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    './pages/**/*.{js,ts,jsx,tsx,mdx}',
    './components/**/*.{js,ts,jsx,tsx,mdx}',
    './app/**/*.{js,ts,jsx,tsx,mdx}',
    './hooks/**/*.{js,ts,jsx,tsx,mdx}',
    './services/**/*.{js,ts,jsx,tsx,mdx}',
    './utils/**/*.{js,ts,jsx,tsx,mdx}',
  ],
  theme: {
    extend: {
      // Custom color palette
      colors: {
        coffee: {
          50: '#fef7f0',
          100: '#fdecd8',
          200: '#fbd5b0',
          300: '#f8b87d',
          400: '#f5934a',
          500: '#f2751a',
          600: '#e35d0f',
          700: '#bc460d',
          800: '#963810',
          900: '#7a3010',
          950: '#421605',
        },
        cream: {
          50: '#fefefe',
          100: '#fefefe',
          200: '#fdfdfd',
          300: '#fbfbfb',
          400: '#f8f8f8',
          500: '#f5f5f5',
          600: '#e8e8e8',
          700: '#d1d1d1',
          800: '#a8a8a8',
          900: '#8a8a8a',
          950: '#5c5c5c',
        },
        mystic: {
          50: '#f6f8fa',
          100: '#edf2f6',
          200: '#dce7f0',
          300: '#c1d5e6',
          400: '#9bbdd4',
          500: '#6fa0c0',
          600: '#5a8bb0',
          700: '#4b7293',
          800: '#406078',
          900: '#375165',
          950: '#243447',
        },
      },
      
      // Custom font families
      fontFamily: {
        mystic: ['var(--font-mystic)', 'serif'],
        sans: ['Inter', 'system-ui', 'sans-serif'],
        mono: ['JetBrains Mono', 'monospace'],
      },
      
      // Custom spacing scale
      spacing: {
        '18': '4.5rem',
        '88': '22rem',
        '128': '32rem',
        '144': '36rem',
      },
      
      // Custom animation durations
      animation: {
        'fade-in': 'fadeIn 0.5s ease-in-out',
        'fade-out': 'fadeOut 0.5s ease-in-out',
        'slide-up': 'slideUp 0.3s ease-out',
        'slide-down': 'slideDown 0.3s ease-out',
        'scale-in': 'scaleIn 0.2s ease-out',
        'scale-out': 'scaleOut 0.2s ease-out',
        'bounce-gentle': 'bounceGentle 2s infinite',
        'float': 'float 3s ease-in-out infinite',
        'pulse-slow': 'pulse 3s cubic-bezier(0.4, 0, 0.6, 1) infinite',
      },
      
      // Custom keyframes
      keyframes: {
        fadeIn: {
          '0%': { opacity: '0' },
          '100%': { opacity: '1' },
        },
        fadeOut: {
          '0%': { opacity: '1' },
          '100%': { opacity: '0' },
        },
        slideUp: {
          '0%': { transform: 'translateY(100%)', opacity: '0' },
          '100%': { transform: 'translateY(0)', opacity: '1' },
        },
        slideDown: {
          '0%': { transform: 'translateY(-100%)', opacity: '0' },
          '100%': { transform: 'translateY(0)', opacity: '1' },
        },
        scaleIn: {
          '0%': { transform: 'scale(0.9)', opacity: '0' },
          '100%': { transform: 'scale(1)', opacity: '1' },
        },
        scaleOut: {
          '0%': { transform: 'scale(1)', opacity: '1' },
          '100%': { transform: 'scale(0.9)', opacity: '0' },
        },
        bounceGentle: {
          '0%, 100%': { transform: 'translateY(0)' },
          '50%': { transform: 'translateY(-10px)' },
        },
        float: {
          '0%, 100%': { transform: 'translateY(0px)' },
          '50%': { transform: 'translateY(-20px)' },
        },
      },
      
      // Custom backdrop filters
      backdropBlur: {
        xs: '2px',
      },
      
      // Custom box shadows
      boxShadow: {
        'inner-lg': 'inset 0 2px 4px 0 rgba(0, 0, 0, 0.06)',
        'glow': '0 0 20px rgba(242, 117, 42, 0.3)',
        'glow-lg': '0 0 40px rgba(242, 117, 42, 0.4)',
        'glow-xl': '0 0 60px rgba(242, 117, 42, 0.5)',
      },
      
      // Custom gradients
      backgroundImage: {
        'gradient-radial': 'radial-gradient(var(--tw-gradient-stops))',
        'gradient-conic': 'conic-gradient(from 180deg at 50% 50%, var(--tw-gradient-stops))',
        'gradient-mystic': 'linear-gradient(135deg, #f6f8fa 0%, #c1d5e6 100%)',
        'gradient-coffee': 'linear-gradient(135deg, #f2751a 0%, #bc460d 100%)',
        'gradient-cream': 'linear-gradient(135deg, #fefefe 0%, #f5f5f5 100%)',
      },
      
      // Custom border radius
      borderRadius: {
        '4xl': '2rem',
        '5xl': '2.5rem',
      },
      
      // Custom z-index scale
      zIndex: {
        '60': '60',
        '70': '70',
        '80': '80',
        '90': '90',
        '100': '100',
      },
      
      // Custom transition timing functions
      transitionTimingFunction: {
        'bounce-in': 'cubic-bezier(0.68, -0.55, 0.265, 1.55)',
        'smooth': 'cubic-bezier(0.4, 0, 0.2, 1)',
        'spring': 'cubic-bezier(0.175, 0.885, 0.32, 1.275)',
      },
      
      // Custom scale values
      scale: {
        '102': '1.02',
        '103': '1.03',
        '105': '1.05',
        '110': '1.1',
        '125': '1.25',
      },
      
      // Custom rotate values
      rotate: {
        '15': '15deg',
        '25': '25deg',
        '35': '35deg',
        '45': '45deg',
      },
      
      // Custom skew values
      skew: {
        '12': '12deg',
        '15': '15deg',
        '20': '20deg',
      },
    },
  },
  
  // Plugins for additional functionality
  plugins: [
    // Custom plugin for coffee-themed utilities
    function({ addUtilities, theme }) {
      const newUtilities = {
        '.text-shadow': {
          textShadow: '0 2px 4px rgba(0, 0, 0, 0.1)',
        },
        '.text-shadow-lg': {
          textShadow: '0 4px 8px rgba(0, 0, 0, 0.15)',
        },
        '.text-shadow-none': {
          textShadow: 'none',
        },
        '.backdrop-blur-xs': {
          backdropFilter: 'blur(2px)',
        },
        '.filter-coffee': {
          filter: 'sepia(0.8) saturate(1.5) hue-rotate(15deg)',
        },
        '.filter-mystic': {
          filter: 'brightness(1.1) contrast(1.1) saturate(1.2)',
        },
      };
      
      addUtilities(newUtilities);
    },
    
    // Custom plugin for responsive variants
    function({ addVariant }) {
      addVariant('hocus', '&:hover, &:focus');
      addVariant('hocus-visible', '&:hover, &:focus-visible');
      addVariant('supports-grid', '@supports (display: grid)');
      addVariant('supports-flexbox', '@supports (display: flex)');
    },
  ],
  
  // Core plugins configuration
  corePlugins: {
    // Disable preflight for custom CSS reset
    preflight: true,
    
    // Enable all other core plugins
    container: true,
    accessibility: true,
  },
  
  // Variants configuration
  variants: {
    extend: {
      // Extend existing variants
      opacity: ['disabled'],
      cursor: ['disabled'],
      backgroundColor: ['disabled', 'hocus'],
      borderColor: ['disabled', 'hocus'],
      textColor: ['disabled', 'hocus'],
      scale: ['hocus', 'group-hover'],
      rotate: ['hocus', 'group-hover'],
      translate: ['hocus', 'group-hover'],
      animation: ['hocus', 'group-hover'],
      transitionProperty: ['hocus'],
    },
  },
  
  // Future configuration
  future: {
    hoverOnlyWhenSupported: true,
    respectDefaultRingColor: true,
    disableColorOpacityUtilitiesByDefault: false,
    relativeContentPathsByDefault: true,
  },
  
  // Experimental features
  experimental: {
    optimizeUniversalDefaults: true,
  },
};
