/** @type {import('tailwindcss').Config} */
module.exports = {
  darkMode: ['class'],
  content: [
    './pages/**/*.{ts,tsx}',
    './components/**/*.{ts,tsx}',
    './app/**/*.{ts,tsx}',
    './src/**/*.{ts,tsx}',
  ],
  theme: {
    extend: {
      colors: {
        // Core palette
        cyan: {
          DEFAULT: '#00E5FF',
          50: '#E0FBFF',
          100: '#B3F5FF',
          200: '#80EFFF',
          300: '#4DE8FF',
          400: '#1AE2FF',
          500: '#00E5FF',
          600: '#00B8CC',
          700: '#008A99',
          800: '#005C66',
          900: '#002E33',
          dim: 'rgba(0, 229, 255, 0.12)',
          glow: 'rgba(0, 229, 255, 0.35)',
        },
        violet: {
          DEFAULT: '#7C3AED',
          dim: 'rgba(124, 58, 237, 0.12)',
          glow: 'rgba(124, 58, 237, 0.4)',
        },
        neon: {
          orange: '#FF6B2B',
          pink: '#FF2D9C',
          green: '#00FF87',
          yellow: '#FFE500',
        },
        surface: {
          1: '#020209',
          2: '#0A0A18',
          3: '#0F0F22',
          4: '#141428',
          5: '#1A1A32',
        },
        glass: {
          DEFAULT: 'rgba(255, 255, 255, 0.04)',
          medium: 'rgba(255, 255, 255, 0.07)',
          strong: 'rgba(255, 255, 255, 0.10)',
          border: 'rgba(255, 255, 255, 0.08)',
          hover: 'rgba(255, 255, 255, 0.12)',
        },
        text: {
          primary: '#F0F0FF',
          secondary: '#8B8BA7',
          tertiary: '#4B4B6A',
          muted: '#2E2E4A',
        },
      },
      fontFamily: {
        display: ['var(--font-display)', 'Syne', 'sans-serif'],
        body: ['var(--font-body)', 'Plus Jakarta Sans', 'sans-serif'],
        mono: ['var(--font-mono)', 'JetBrains Mono', 'monospace'],
      },
      fontSize: {
        '10xl': ['10rem', { lineHeight: '0.85' }],
        '9xl': ['8rem', { lineHeight: '0.9' }],
        '8xl': ['6rem', { lineHeight: '0.95' }],
        '7xl': ['4.5rem', { lineHeight: '1' }],
      },
      backgroundImage: {
        'gradient-primary': 'linear-gradient(135deg, #00E5FF 0%, #7C3AED 100%)',
        'gradient-warm': 'linear-gradient(135deg, #FF6B2B 0%, #FF2D9C 100%)',
        'gradient-cool': 'linear-gradient(135deg, #00FF87 0%, #00E5FF 100%)',
        'gradient-dark': 'linear-gradient(135deg, #020209 0%, #0F0F22 50%, #020209 100%)',
        'gradient-radial-cyan': 'radial-gradient(circle at center, rgba(0,229,255,0.15) 0%, transparent 70%)',
        'gradient-radial-violet': 'radial-gradient(circle at center, rgba(124,58,237,0.15) 0%, transparent 70%)',
        'grid-pattern': 'linear-gradient(rgba(0, 229, 255, 0.04) 1px, transparent 1px), linear-gradient(90deg, rgba(0, 229, 255, 0.04) 1px, transparent 1px)',
        'noise': "url(\"data:image/svg+xml,%3Csvg viewBox='0 0 200 200' xmlns='http://www.w3.org/2000/svg'%3E%3Cfilter id='n'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='0.85' numOctaves='3'/%3E%3C/filter%3E%3Crect width='100%25' height='100%25' filter='url(%23n)' opacity='0.04'/%3E%3C/svg%3E\")",
      },
      backgroundSize: {
        'grid': '64px 64px',
      },
      boxShadow: {
        'cyan-sm': '0 0 10px rgba(0, 229, 255, 0.2)',
        'cyan': '0 0 20px rgba(0, 229, 255, 0.3), 0 0 60px rgba(0, 229, 255, 0.1)',
        'cyan-lg': '0 0 40px rgba(0, 229, 255, 0.4), 0 0 80px rgba(0, 229, 255, 0.15)',
        'violet-sm': '0 0 10px rgba(124, 58, 237, 0.2)',
        'violet': '0 0 20px rgba(124, 58, 237, 0.4), 0 0 60px rgba(124, 58, 237, 0.1)',
        'glass': '0 8px 32px rgba(0, 0, 0, 0.5), inset 0 1px 0 rgba(255,255,255,0.06)',
        'glass-lg': '0 16px 48px rgba(0, 0, 0, 0.6), inset 0 1px 0 rgba(255,255,255,0.08)',
        'card': '0 4px 24px rgba(0, 0, 0, 0.4)',
        'inner-cyan': 'inset 0 0 30px rgba(0, 229, 255, 0.05)',
      },
      animation: {
        'float': 'float 6s ease-in-out infinite',
        'float-delayed': 'float 6s ease-in-out 2s infinite',
        'pulse-glow': 'pulse-glow 2.5s ease-in-out infinite',
        'pulse-glow-violet': 'pulse-glow-violet 2.5s ease-in-out 1s infinite',
        'rotate-slow': 'rotate-slow 25s linear infinite',
        'rotate-reverse': 'rotate-slow 20s linear infinite reverse',
        'scan': 'scan-line 4s linear infinite',
        'shimmer': 'shimmer 2s linear infinite',
        'border-glow': 'border-glow 3s ease infinite',
        'fade-in-up': 'fade-in-up 0.7s ease forwards',
        'fade-in': 'fade-in 0.5s ease forwards',
        'slide-in-right': 'slide-in-right 0.5s ease forwards',
        'blink': 'blink 1s step-end infinite',
        'ping-slow': 'ping 3s cubic-bezier(0, 0, 0.2, 1) infinite',
      },
      keyframes: {
        float: {
          '0%, 100%': { transform: 'translateY(0px)' },
          '50%': { transform: 'translateY(-18px)' },
        },
        'pulse-glow': {
          '0%, 100%': { opacity: '0.5', boxShadow: '0 0 15px rgba(0, 229, 255, 0.2)' },
          '50%': { opacity: '1', boxShadow: '0 0 35px rgba(0, 229, 255, 0.5)' },
        },
        'pulse-glow-violet': {
          '0%, 100%': { opacity: '0.5', boxShadow: '0 0 15px rgba(124, 58, 237, 0.2)' },
          '50%': { opacity: '1', boxShadow: '0 0 35px rgba(124, 58, 237, 0.5)' },
        },
        'rotate-slow': {
          from: { transform: 'rotate(0deg)' },
          to: { transform: 'rotate(360deg)' },
        },
        'scan-line': {
          '0%': { transform: 'translateY(-100%)' },
          '100%': { transform: 'translateY(200vh)' },
        },
        shimmer: {
          '0%': { backgroundPosition: '-200% 0' },
          '100%': { backgroundPosition: '200% 0' },
        },
        'border-glow': {
          '0%, 100%': { backgroundPosition: '0% 50%' },
          '50%': { backgroundPosition: '100% 50%' },
        },
        'fade-in-up': {
          '0%': { opacity: '0', transform: 'translateY(40px)' },
          '100%': { opacity: '1', transform: 'translateY(0)' },
        },
        'fade-in': {
          '0%': { opacity: '0' },
          '100%': { opacity: '1' },
        },
        'slide-in-right': {
          '0%': { opacity: '0', transform: 'translateX(30px)' },
          '100%': { opacity: '1', transform: 'translateX(0)' },
        },
        blink: {
          '0%, 50%': { opacity: '1' },
          '51%, 100%': { opacity: '0' },
        },
      },
      backdropBlur: {
        xs: '2px',
        '4xl': '80px',
      },
      transitionTimingFunction: {
        'spring': 'cubic-bezier(0.34, 1.56, 0.64, 1)',
        'smooth': 'cubic-bezier(0.4, 0, 0.2, 1)',
        'in-expo': 'cubic-bezier(0.95, 0.05, 0.795, 0.035)',
        'out-expo': 'cubic-bezier(0.19, 1, 0.22, 1)',
      },
      borderRadius: {
        '4xl': '2rem',
        '5xl': '3rem',
      },
      spacing: {
        '18': '4.5rem',
        '88': '22rem',
        '100': '25rem',
        '112': '28rem',
        '128': '32rem',
      },
      zIndex: {
        '60': '60',
        '70': '70',
        '80': '80',
        '90': '90',
        '100': '100',
      },
    },
  },
  plugins: [require('tailwindcss-animate')],
}
