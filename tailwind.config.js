/** @type {import('tailwindcss').Config} */
export default {
  content: ["./index.html","./src/**/*.{js,jsx}"],
  theme: {
    extend: {
      colors: {
        primary: { 50:'#f0faf4', 100:'#dcf5e7', 200:'#bbebd1', 300:'#8ddcb4', 400:'#57c68f', 500:'#32a86d', 600:'#258a57', 700:'#1e6e46', 800:'#1b5839', 900:'#174830' },
        medical: { blue:'#2563eb', teal:'#0891b2', slate:'#475569' }
      },
      fontFamily: { sans: ['DM Sans','system-ui','sans-serif'], mono: ['DM Mono','monospace'] }
    }
  },
  plugins: []
}
