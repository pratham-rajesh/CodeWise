/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    './app/**/*.{js,ts,jsx,tsx,mdx}',
    './components/**/*.{js,ts,jsx,tsx,mdx}',
  ],
  theme: {
    extend: {
      colors: {
        notion: {
          bg: '#FFFFFF',
          'bg-secondary': '#FAFAFA',
          text: '#37352F',
          'text-secondary': '#787774',
          border: '#E9E9E7',
          primary: '#2383E2',
          success: '#0F7B6C',
          warning: '#D9730D',
          error: '#E03E3E',
        },
      },
      fontFamily: {
        sans: ['Inter', 'system-ui', '-apple-system', 'sans-serif'],
        mono: ['JetBrains Mono', 'Fira Code', 'monospace'],
      },
      boxShadow: {
        'notion': '0 1px 3px rgba(0, 0, 0, 0.05)',
        'notion-hover': '0 4px 12px rgba(0, 0, 0, 0.08)',
      },
      borderRadius: {
        'notion': '8px',
      },
    },
  },
  plugins: [],
}
