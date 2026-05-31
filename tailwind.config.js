/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        background: '#1E1B1D',
        card: '#292528',
        text: '#F3E9EC',
        accent: '#FE8DAF',
        orchid: '#EA76DF',
        success: '#4AF626',
      },
    },
  },
  plugins: [],
}
