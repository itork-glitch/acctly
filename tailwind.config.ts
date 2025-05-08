/** @type {import('tailwindcss').Config} */
module.exports = {
  darkMode: ['class'], // używamy klasy .dark zamiast media query :contentReference[oaicite:5]{index=5}
  content: [
    './app/**/*.{js,ts,jsx,tsx}',
    './components/**/*.{js,ts,jsx,tsx}',
    // ...inne ścieżki
  ],
  theme: {
    extend: {},
  },
  plugins: [],
};
