/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  darkMode: 'class',
  theme: {
    extend: {
      colors: {
        claude: {
          bg: {
            primary: 'var(--claude-bg-primary)',
            secondary: 'var(--claude-bg-secondary)',
            tertiary: 'var(--claude-bg-tertiary)',
            surface: 'var(--claude-bg-surface)',
          },
          text: {
            primary: 'var(--claude-text-primary)',
            secondary: 'var(--claude-text-secondary)',
            tertiary: 'var(--claude-text-tertiary)',
          },
          accent: {
            DEFAULT: '#DA7756',
            hover: '#C96A4B',
            light: 'var(--claude-accent-light)',
          },
          border: {
            DEFAULT: 'var(--claude-border)',
            focus: '#DA7756',
          },
          success: '#2E7D57',
          error: '#D64545',
        },
      },
      fontFamily: {
        sans: ['system-ui', '-apple-system', 'BlinkMacSystemFont', 'Segoe UI', 'Roboto', 'sans-serif'],
        mono: ['SF Mono', 'Monaco', 'Inconsolata', 'Fira Code', 'monospace'],
      },
      boxShadow: {
        'claude-sm': '0 1px 2px rgba(0,0,0,0.05)',
        'claude-md': '0 4px 12px rgba(0,0,0,0.08)',
        'claude-lg': '0 8px 24px rgba(0,0,0,0.12)',
      },
      borderRadius: {
        'claude-sm': '6px',
        'claude-md': '8px',
        'claude-lg': '12px',
      },
    },
  },
  plugins: [],
}
