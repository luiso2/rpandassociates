import type { Config } from 'tailwindcss'
import forms from '@tailwindcss/forms'
import typography from '@tailwindcss/typography'

const config: Config = {
  content: [
    './src/**/*.{js,ts,jsx,tsx,mdx}',
  ],
  theme: {
    container: {
      center: true,
      padding: { DEFAULT: '1rem', md: '1.5rem' },
      screens: { sm: '640px', md: '768px', lg: '1024px', xl: '1280px' },
    },
    extend: {
      colors: {
        primary: {
          DEFAULT: '#0029cc',
          dark: '#001a8a',
          light: '#4466ff',
          glow: 'rgba(0,41,204,0.35)',
        },
        gold: {
          DEFAULT: '#C9A84C',
          light: '#DFC06A',
          dark: '#A68B30',
          glow: 'rgba(201,168,76,0.3)',
        },
        accent: {
          red: '#b91c1c',
          'red-light': '#dc2626',
          'red-dark': '#991b1b',
        },
        ink: {
          DEFAULT: '#060610',
          body: '#1a1a2e',
          muted: '#4a4a64',
          light: '#7a7a96',
        },
        surface: {
          white: '#ffffff',
          light: '#f5f6fb',
          section: '#eaecf5',
          dark: '#06060e',
          footer: '#04040a',
        },
      },
      fontFamily: {
        heading: ['var(--font-heading)', 'system-ui', 'sans-serif'],
        body: ['var(--font-body)', 'system-ui', 'sans-serif'],
        sans: ['var(--font-body)', 'system-ui', 'sans-serif'],
      },
      borderRadius: {
        sm: '12px',
        md: '16px',
        lg: '24px',
        xl: '32px',
        pill: '50px',
      },
      boxShadow: {
        'soft-sm': '0 2px 8px rgba(0,0,0,0.05),0 1px 2px rgba(0,0,0,0.04)',
        'soft-md': '0 16px 48px rgba(0,0,0,0.1),0 4px 12px rgba(0,0,0,0.06)',
        'soft-lg': '0 32px 72px rgba(0,0,0,0.16),0 8px 24px rgba(0,0,0,0.08)',
        primary: '0 16px 48px rgba(0,41,204,0.2)',
        gold: '0 12px 36px rgba(201,168,76,0.25)',
      },
      transitionTimingFunction: {
        ease: 'cubic-bezier(.4,0,.2,1)',
        spring: 'cubic-bezier(.22,1,.36,1)',
        bounce: 'cubic-bezier(.68,-.55,.27,1.55)',
      },
      keyframes: {
        fadeInUp: {
          from: { opacity: '0', transform: 'translateY(30px)' },
          to: { opacity: '1', transform: 'translateY(0)' },
        },
        fadeIn: {
          from: { opacity: '0' },
          to: { opacity: '1' },
        },
        pulseRing: {
          '0%, 100%': { boxShadow: '0 0 0 0 rgba(0,35,204,0.3)' },
          '70%': { boxShadow: '0 0 0 12px rgba(0,35,204,0)' },
        },
        shimmer: {
          '0%': { backgroundPosition: '-200% 0' },
          '100%': { backgroundPosition: '200% 0' },
        },
        countPulse: {
          '0%, 100%': { transform: 'scale(1)' },
          '50%': { transform: 'scale(1.05)' },
        },
        pageLoad: {
          to: { opacity: '1' },
        },
        marquee: {
          from: { transform: 'translate3d(0, 0, 0)' },
          to: { transform: 'translate3d(-50%, 0, 0)' },
        },
      },
      animation: {
        'fade-in-up': 'fadeInUp 0.5s cubic-bezier(.22,1,.36,1) forwards',
        'fade-in': 'fadeIn 0.4s ease forwards',
        'pulse-ring': 'pulseRing 2s ease-in-out infinite',
        shimmer: 'shimmer 2s linear infinite',
        'count-pulse': 'countPulse 0.6s ease',
        'page-load': 'pageLoad 0.4s ease forwards',
        marquee: 'marquee 45s linear infinite',
      },
      backdropBlur: {
        glass: '24px',
      },
    },
  },
  plugins: [forms, typography],
}

export default config
