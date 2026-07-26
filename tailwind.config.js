/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        bgMain: '#FFFFFF',
        bgSec: '#F8F9FA',
        cardBg: '#FFFFFF',
        borderSubtle: '#E5E7EB',
        textPrimary: '#111827',
        textSecondary: '#6B7280',
        primaryAccent: '#2563EB',
        statusSuccess: '#16A34A',
        statusWarning: '#D97706',
        statusError: '#DC2626',
      }
    },
  },
  plugins: [],
}
