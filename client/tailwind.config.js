/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        brand: {
          light: '#ff8a5c',
          DEFAULT: '#ff4d00',
          dark: '#cc3d00',
        },
        navy: {
          light: '#2d2d50',
          DEFAULT: '#1a1a2e',
          dark: '#0f0f23',
        },
      },
    },
  },
  plugins: [],
}
