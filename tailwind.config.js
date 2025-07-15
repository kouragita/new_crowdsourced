/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    "./src/**/*.{js,jsx,ts,tsx}",
    "./index.html"
  ],
  darkMode: 'class',
  theme: {
    extend: {
      colors: {
        // Custom brand colors
        brand: {
          50: '#eff6ff',
          100: '#dbeafe',
          200: '#bfdbfe',
          300: '#93c5fd',
          400: '#60a5fa',
          500: '#3b82f6',
          600: '#2563eb',
          700: '#1d4ed8',
          800: '#1e40af',
          900: '#1e3a8a',
        },
        // Custom success colors
        success: {
          50: '#f0fdf4',
          100: '#dcfce7',
          200: '#bbf7d0',
          300: '#86efac',
          400: '#4ade80',
          500: '#22c55e',
          600: '#16a34a',
          700: '#15803d',
          800: '#166534',
          900: '#14532d',
        },
        // Custom warning colors
        warning: {
          50: '#fffbeb',
          100: '#fef3c7',
          200: '#fde68a',
          300: '#fcd34d',
          400: '#fbbf24',
          500: '#f59e0b',
          600: '#d97706',
          700: '#b45309',
          800: '#92400e',
          900: '#78350f',
        },
        // Custom error colors
        error: {
          50: '#fef2f2',
          100: '#fee2e2',
          200: '#fecaca',
          300: '#fca5a5',
          400: '#f87171',
          500: '#ef4444',
          600: '#dc2626',
          700: '#b91c1c',
          800: '#991b1b',
          900: '#7f1d1d',
        }
      },
      fontFamily: {
        sans: ['Inter', 'system-ui', 'sans-serif'],
        display: ['Poppins', 'system-ui', 'sans-serif'],
      },
      fontSize: {
        '2xs': ['0.625rem', { lineHeight: '0.75rem' }],
        '3xl': ['1.953rem', { lineHeight: '2.25rem' }],
        '4xl': ['2.441rem', { lineHeight: '2.75rem' }],
        '5xl': ['3.052rem', { lineHeight: '3.25rem' }],
        '6xl': ['3.815rem', { lineHeight: '4rem' }],
        '7xl': ['4.769rem', { lineHeight: '5rem' }],
      },
      spacing: {
        '18': '4.5rem',
        '88': '22rem',
        '100': '25rem',
        '112': '28rem',
        '128': '32rem',
      },
      borderRadius: {
        '4xl': '2rem',
        '5xl': '2.5rem',
      },
      boxShadow: {
        'soft': '0 2px 15px -3px rgba(0, 0, 0, 0.07), 0 10px 20px -2px rgba(0, 0, 0, 0.04)',
        'medium': '0 4px 25px -5px rgba(0, 0, 0, 0.1), 0 10px 20px -5px rgba(0, 0, 0, 0.04)',
        'large': '0 10px 40px -10px rgba(0, 0, 0, 0.1), 0 20px 25px -5px rgba(0, 0, 0, 0.04)',
        'glow': '0 0 20px rgba(59, 130, 246, 0.5)',
        'glow-lg': '0 0 40px rgba(59, 130, 246, 0.3)',
        'inner-soft': 'inset 0 2px 4px 0 rgba(0, 0, 0, 0.06)',
      },
      backdropBlur: {
        'xs': '2px',
      },
      animation: {
        // Bouncing animations
        'bounce-slow': 'bounce 3s infinite',
        'bounce-x': 'bounce-x 1s infinite',
        
        // Pulse animations
        'pulse-fast': 'pulse 1s infinite',
        'pulse-slow': 'pulse 3s infinite',
        
        // Fade animations
        'fade-in': 'fade-in 0.5s ease-out',
        'fade-in-up': 'fade-in-up 0.6s ease-out',
        'fade-in-down': 'fade-in-down 0.6s ease-out',
        'fade-in-left': 'fade-in-left 0.6s ease-out',
        'fade-in-right': 'fade-in-right 0.6s ease-out',
        
        // Slide animations
        'slide-in-up': 'slide-in-up 0.5s ease-out',
        'slide-in-down': 'slide-in-down 0.5s ease-out',
        'slide-in-left': 'slide-in-left 0.5s ease-out',
        'slide-in-right': 'slide-in-right 0.5s ease-out',
        
        // Scale animations
        'scale-in': 'scale-in 0.3s ease-out',
        'scale-out': 'scale-out 0.3s ease-out',
        
        // Rotation animations
        'rotate-slow': 'spin 8s linear infinite',
        'rotate-reverse': 'spin-reverse 1s linear infinite',
        
        // Floating animation
        'float': 'float 3s ease-in-out infinite',
        'float-delayed': 'float 3s ease-in-out infinite 1.5s',
        
        // Wiggle animation
        'wiggle': 'wiggle 1s ease-in-out infinite',
        
        // Shake animation
        'shake': 'shake 0.5s ease-in-out',
        
        // Gradient animation
        'gradient': 'gradient 3s ease infinite',
        
        // Loading animations
        'loading-dots': 'loading-dots 1.4s ease-in-out infinite',
        'loading-bar': 'loading-bar 2s ease-in-out infinite',
        
        // Notification animations
        'notification-in': 'notification-in 0.3s ease-out',
        'notification-out': 'notification-out 0.3s ease-in',
        
        // Typewriter animation
        'typewriter': 'typewriter 2s steps(40) infinite',
        
        // Heart beat animation
        'heartbeat': 'heartbeat 1.5s ease-in-out infinite',
        
        // Glow animation
        'glow': 'glow 2s ease-in-out infinite alternate',
      },
      keyframes: {
        // Bounce X
        'bounce-x': {
          '0%, 100%': { transform: 'translateX(0)' },
          '50%': { transform: 'translateX(-25%)' },
        },
        
        // Fade animations
        'fade-in': {
          '0%': { opacity: '0' },
          '100%': { opacity: '1' },
        },
        'fade-in-up': {
          '0%': { opacity: '0', transform: 'translateY(30px)' },
          '100%': { opacity: '1', transform: 'translateY(0)' },
        },
        'fade-in-down': {
          '0%': { opacity: '0', transform: 'translateY(-30px)' },
          '100%': { opacity: '1', transform: 'translateY(0)' },
        },
        'fade-in-left': {
          '0%': { opacity: '0', transform: 'translateX(-30px)' },
          '100%': { opacity: '1', transform: 'translateX(0)' },
        },
        'fade-in-right': {
          '0%': { opacity: '0', transform: 'translateX(30px)' },
          '100%': { opacity: '1', transform: 'translateX(0)' },
        },
        
        // Slide animations
        'slide-in-up': {
          '0%': { transform: 'translateY(100%)' },
          '100%': { transform: 'translateY(0)' },
        },
        'slide-in-down': {
          '0%': { transform: 'translateY(-100%)' },
          '100%': { transform: 'translateY(0)' },
        },
        'slide-in-left': {
          '0%': { transform: 'translateX(-100%)' },
          '100%': { transform: 'translateX(0)' },
        },
        'slide-in-right': {
          '0%': { transform: 'translateX(100%)' },
          '100%': { transform: 'translateX(0)' },
        },
        
        // Scale animations
        'scale-in': {
          '0%': { transform: 'scale(0)' },
          '100%': { transform: 'scale(1)' },
        },
        'scale-out': {
          '0%': { transform: 'scale(1)' },
          '100%': { transform: 'scale(0)' },
        },
        
        // Reverse spin
        'spin-reverse': {
          '0%': { transform: 'rotate(360deg)' },
          '100%': { transform: 'rotate(0deg)' },
        },
        
        // Float animation
        'float': {
          '0%, 100%': { transform: 'translateY(0px)' },
          '50%': { transform: 'translateY(-10px)' },
        },
        
        // Wiggle animation
        'wiggle': {
          '0%, 100%': { transform: 'rotate(-3deg)' },
          '50%': { transform: 'rotate(3deg)' },
        },
        
        // Shake animation
        'shake': {
          '0%, 100%': { transform: 'translateX(0)' },
          '10%, 30%, 50%, 70%, 90%': { transform: 'translateX(-10px)' },
          '20%, 40%, 60%, 80%': { transform: 'translateX(10px)' },
        },
        
        // Gradient animation
        'gradient': {
          '0%, 100%': { backgroundPosition: '0% 50%' },
          '50%': { backgroundPosition: '100% 50%' },
        },
        
        // Loading animations
        'loading-dots': {
          '0%, 80%, 100%': { transform: 'scale(0)' },
          '40%': { transform: 'scale(1)' },
        },
        'loading-bar': {
          '0%': { width: '0%' },
          '100%': { width: '100%' },
        },
        
        // Notification animations
        'notification-in': {
          '0%': { transform: 'translateX(100%)', opacity: '0' },
          '100%': { transform: 'translateX(0)', opacity: '1' },
        },
        'notification-out': {
          '0%': { transform: 'translateX(0)', opacity: '1' },
          '100%': { transform: 'translateX(100%)', opacity: '0' },
        },
        
        // Typewriter animation
        'typewriter': {
          '0%': { width: '0ch' },
          '50%': { width: '15ch' },
          '100%': { width: '0ch' },
        },
        
        // Heartbeat animation
        'heartbeat': {
          '0%, 100%': { transform: 'scale(1)' },
          '50%': { transform: 'scale(1.1)' },
        },
        
        // Glow animation
        'glow': {
          '0%': { boxShadow: '0 0 5px rgba(59, 130, 246, 0.5)' },
          '100%': { boxShadow: '0 0 20px rgba(59, 130, 246, 0.8)' },
        },
      },
      backgroundImage: {
        'gradient-radial': 'radial-gradient(var(--tw-gradient-stops))',
        'gradient-conic': 'conic-gradient(from 180deg at 50% 50%, var(--tw-gradient-stops))',
        'gradient-mesh': 'linear-gradient(45deg, #667eea 0%, #764ba2 100%)',
        'gradient-sunset': 'linear-gradient(45deg, #ff6b6b 0%, #feca57 100%)',
        'gradient-ocean': 'linear-gradient(45deg, #667eea 0%, #764ba2 100%)',
      },
      screens: {
        'xs': '475px',
        '3xl': '1600px',
      },
      zIndex: {
        '60': '60',
        '70': '70',
        '80': '80',
        '90': '90',
        '100': '100',
      }
    },
  },
  plugins: [
    // Plugin for additional utilities
    function({ addUtilities, addComponents, theme }) {
      // Custom utilities
      addUtilities({
        '.perspective-1000': {
          perspective: '1000px',
        },
        '.preserve-3d': {
          transformStyle: 'preserve-3d',
        },
        '.backface-hidden': {
          backfaceVisibility: 'hidden',
        },
        '.scroll-smooth': {
          scrollBehavior: 'smooth',
        },
        '.text-shadow': {
          textShadow: '2px 2px 4px rgba(0, 0, 0, 0.1)',
        },
        '.text-shadow-lg': {
          textShadow: '4px 4px 8px rgba(0, 0, 0, 0.2)',
        },
      });

      // Custom components
      addComponents({
        '.btn-primary': {
          '@apply bg-gradient-to-r from-blue-600 to-purple-600 text-white px-6 py-3 rounded-lg font-medium hover:from-blue-700 hover:to-purple-700 transform hover:scale-105 transition-all duration-200 shadow-lg hover:shadow-xl': {},
        },
        '.btn-secondary': {
          '@apply bg-white text-blue-600 border-2 border-blue-600 px-6 py-3 rounded-lg font-medium hover:bg-blue-50 transform hover:scale-105 transition-all duration-200': {},
        },
        '.card': {
          '@apply bg-white rounded-xl shadow-soft hover:shadow-medium transition-all duration-300 p-6': {},
        },
        '.card-interactive': {
          '@apply card hover:scale-105 cursor-pointer': {},
        },
        '.input-field': {
          '@apply w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all duration-200': {},
        },
        '.navbar-item': {
          '@apply text-gray-700 hover:text-blue-600 px-3 py-2 rounded-md text-sm font-medium transition-colors duration-200': {},
        },
        '.sidebar-item': {
          '@apply flex items-center space-x-3 px-4 py-3 rounded-lg text-gray-700 hover:bg-blue-50 hover:text-blue-600 transition-all duration-200': {},
        },
        '.badge': {
          '@apply inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium': {},
        },
        '.badge-primary': {
          '@apply badge bg-blue-100 text-blue-800': {},
        },
        '.badge-success': {
          '@apply badge bg-green-100 text-green-800': {},
        },
        '.badge-warning': {
          '@apply badge bg-yellow-100 text-yellow-800': {},
        },
        '.badge-error': {
          '@apply badge bg-red-100 text-red-800': {},
        },
      });
    }
  ],
}