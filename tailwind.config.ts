/** @type {import('tailwindcss').Config} */
module.exports = {
  darkMode: ['class'], // używamy klasy .dark zamiast media query :contentReference[oaicite:5]{index=5}
  content: [
    './app/**/*.{js,ts,jsx,tsx}',
    './components/**/*.{js,ts,jsx,tsx}',
    // ...inne ścieżki
  ],
  theme: {
    extend: {
      backgroundImage: {
        'fancy-gradient': `linear-gradient(
             135deg,
             rgba(238,174,202,0.8) 0%,
             rgba(148,187,233,0.8) 100%
           )`,
      },
    },
  },
  plugins: [],
};
