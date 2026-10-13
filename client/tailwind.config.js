/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        primary: {
          DEFAULT: '#2563EB',
          50: '#EFF6FF',
          100: '#DBEAFE',
          200: '#BFDBFE',
          500: '#2563EB',
          600: '#1D4ED8',
          700: '#1E40AF',
          800: '#1E3A8A',
        },
        secondary: {
          DEFAULT: '#0F766E',
          50: '#F0FDFA',
          100: '#CCFBF1',
          500: '#0F766E',
          600: '#0D9488',
          700: '#115E59',
        },
        navy: {
          DEFAULT: '#0F172A',
          700: '#334155',
          800: '#1E293B',
          900: '#0F172A',
          950: '#090D16',
        },
        background: '#F8FAFC',
        card: '#FFFFFF',
        'primary-text': '#0F172A',
        'muted-text': '#64748B',
        success: {
          DEFAULT: '#16A34A',
          50: '#F0FDF4',
          100: '#DCFCE7',
          600: '#15803D',
          700: '#166534',
        },
        warning: {
          DEFAULT: '#D97706',
          50: '#FFFBEB',
          100: '#FEF3C7',
          600: '#D97706',
          700: '#B45309',
        },
        danger: {
          DEFAULT: '#DC2626',
          50: '#FEF2F2',
          100: '#FEE2E2',
          600: '#DC2626',
          700: '#B91C1C',
        },
        border: '#E2E8F0',
        slate: {
          150: '#E9EEF4',
        }
      },
      fontFamily: {
        sans: ['Plus Jakarta Sans', 'Inter', 'system-ui', '-apple-system', 'sans-serif'],
      },
      boxShadow: {
        'card': '0 1px 3px 0 rgba(15, 23, 42, 0.04), 0 1px 2px -1px rgba(15, 23, 42, 0.03)',
        'card-hover': '0 4px 12px -2px rgba(15, 23, 42, 0.06), 0 2px 6px -2px rgba(15, 23, 42, 0.04)',
        'dropdown': '0 10px 25px -3px rgba(15, 23, 42, 0.08), 0 4px 8px -2px rgba(15, 23, 42, 0.04)',
        'modal': '0 25px 50px -12px rgba(15, 23, 42, 0.18)',
      }
    },
  },
  plugins: [],
}
