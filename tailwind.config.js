/** @type {import('tailwindcss').Config} */
export default {
  content: ['./index.html', './src/**/*.{js,jsx}'],
  theme: {
    extend: {
      colors: {
        // HONDATI Brand Colors
        brand: {
          orange: '#E85D04',
          'orange-light': '#FF7043',
          'orange-dark': '#BF4A00',
          charcoal: '#1C1C1E',
          'charcoal-light': '#2C2C2E',
          'charcoal-muted': '#3A3A3C',
          gray: '#8A8A8E',
          'gray-light': '#C7C7CC',
          'gray-bg': '#F5F5F5',
          'gray-border': '#E5E5EA',
        },
      },
      fontFamily: {
        // Clean modern font stack
        sans: ['DM Sans', 'system-ui', 'sans-serif'],
        display: ['Sora', 'DM Sans', 'sans-serif'],
      },
      borderRadius: {
        xl: '16px',
        '2xl': '20px',
      },
      boxShadow: {
        card: '0 2px 12px rgba(0,0,0,0.08)',
        'card-hover': '0 8px 28px rgba(0,0,0,0.14)',
        orange: '0 4px 16px rgba(232,93,4,0.30)',
      },
    },
  },
  plugins: [],
}
