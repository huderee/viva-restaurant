/** @type {import('tailwindcss').Config} */
export default {
  content: [
    './index.html',
    './public/index.html',
    './src/**/*.{js,jsx,ts,tsx}'
  ],
  // ✅ 'class' — <html> дээр .dark class байхад dark mode идэвхждэг
  darkMode: 'class',
  theme: {
    extend: {
      colors: {
        primary: {
          50:  '#ecfdf5',
          100: '#d1fae5',
          200: '#a7f3d0',
          300: '#6ee7b7',
          400: '#34d399',
          500: '#10b981',
          600: '#059669',
          700: '#047857',
          800: '#065f46',
          900: '#064e3b',
        },
        dark: {
          DEFAULT: '#0A101A',
          100: '#0f172a',
          200: '#1e293b',
          300: '#334155',
          400: '#475569',
          500: '#64748b',
          600: '#94a3b8',
        },
        light: {
          DEFAULT: '#f8fafc',
          100: '#f1f5f9',
          200: '#e2e8f0',
          300: '#cbd5e1',
          400: '#94a3b8',
          500: '#64748b',
        },
      },
      fontFamily: {
        'sans':  ['Inter', 'system-ui', '-apple-system', 'BlinkMacSystemFont', 'Segoe UI', 'Roboto', 'sans-serif'],
        'serif': ['Playfair Display', 'Georgia', 'Cambria', 'Times New Roman', 'serif'],
        'mono':  ['JetBrains Mono', 'Fira Code', 'Menlo', 'Monaco', 'monospace'],
      },
      animation: {
        'float-slow':   'float 6s ease-in-out infinite',
        'pulse-slow':   'pulse 3s ease-in-out infinite',
        'bounce-slow':  'bounce 2s infinite',
        'slide-down':   'slideDown 0.3s ease-out',
        'glow':         'glow 2s ease-in-out infinite',
        'theme-pop':    'theme-pop 0.3s cubic-bezier(0.34, 1.4, 0.64, 1) forwards',
        'fade-in':      'fadeIn 0.5s ease-out',
        'slide-up':     'slideUp 0.4s ease-out',
        'scale-in':     'scaleIn 0.3s ease-out',
      },
      keyframes: {
        float: {
          '0%, 100%': { transform: 'translateY(0)' },
          '50%':      { transform: 'translateY(-20px)' },
        },
        slideDown: {
          from: { opacity: '0', transform: 'translateY(-10px)' },
          to:   { opacity: '1', transform: 'translateY(0)' },
        },
        slideUp: {
          from: { opacity: '0', transform: 'translateY(20px)' },
          to:   { opacity: '1', transform: 'translateY(0)' },
        },
        fadeIn: {
          from: { opacity: '0' },
          to:   { opacity: '1' },
        },
        scaleIn: {
          from: { opacity: '0', transform: 'scale(0.95)' },
          to:   { opacity: '1', transform: 'scale(1)' },
        },
        glow: {
          '0%, 100%': { boxShadow: '0 0 20px rgba(16, 185, 129, 0.5)' },
          '50%':      { boxShadow: '0 0 40px rgba(16, 185, 129, 0.8)' },
        },
        'theme-pop': {
          '0%':   { transform: 'scale(0.7) rotate(-30deg)', opacity: '0' },
          '60%':  { transform: 'scale(1.15) rotate(5deg)' },
          '100%': { transform: 'scale(1) rotate(0deg)', opacity: '1' },
        },
      },
      backdropBlur: {
        'xs':    '2px',
        'sm':    '4px',
        'md':    '8px',
        'lg':    '12px',
        'xl':    '16px',
        '2xl':   '24px',
        'heavy': '16px',
      },
      backgroundImage: {
        'gradient-radial':  'radial-gradient(var(--tw-gradient-stops))',
        'gradient-conic':   'conic-gradient(from 180deg at 50% 50%, var(--tw-gradient-stops))',
        'gradient-glass':   'linear-gradient(135deg, rgba(255,255,255,0.1) 0%, rgba(255,255,255,0.05) 100%)',
        'gradient-emerald': 'linear-gradient(135deg, #10b981 0%, #059669 100%)',
        'gradient-dark':    'linear-gradient(135deg, #0A101A 0%, #0c1421 100%)',
        'gradient-light':   'linear-gradient(135deg, #f8fafc 0%, #ffffff 100%)',
      },
      boxShadow: {
        'glass':        '0 8px 32px rgba(0, 0, 0, 0.2)',
        'glass-lg':     '0 12px 40px rgba(0, 0, 0, 0.3)',
        'glass-sm':     '0 4px 16px rgba(0, 0, 0, 0.1)',
        'glow-emerald': '0 0 40px rgba(16, 185, 129, 0.4)',
        'glow-green':   '0 0 40px rgba(34, 197, 94, 0.4)',
        'inner-glow':   'inset 0 0 20px rgba(16, 185, 129, 0.1)',
      },
      borderRadius: {
        'glass':    '1rem',
        'glass-lg': '1.5rem',
        'glass-xl': '2rem',
        '4xl':      '2rem',
        '5xl':      '2.5rem',
      },
      transitionDuration: {
        'theme': '300ms',
      },
      transitionProperty: {
        'theme': 'background-color, border-color, color, fill, stroke, opacity, box-shadow, transform',
      },
    },
  },
  plugins: [],
}