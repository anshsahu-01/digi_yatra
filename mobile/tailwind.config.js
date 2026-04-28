/** @type {import('tailwindcss').Config} */
module.exports = {
  content: ["./app/**/*.{js,jsx,ts,tsx}", "./src/**/*.{js,jsx,ts,tsx}"],
  presets: [require("nativewind/preset")],
  theme: {
    extend: {
      colors: {
        // Light theme matching website branding
        bg: '#f1f5f9',         // slate-100
        surface: '#ffffff',    // white cards/surfaces
        card: '#ffffff',
        'card-alt': '#d9edff', // light blue accent card (from website login)
        muted: '#f8fafc',      // slate-50

        primary: { DEFAULT: '#467EE5', light: '#6B9BF2', dark: '#3566C0', soft: 'rgba(70,126,229,0.08)', bg: 'rgba(70,126,229,0.1)' },
        accent: { DEFAULT: '#22C55E', light: '#4ADE80', dark: '#16A34A', soft: 'rgba(34,197,94,0.08)' },

        heading: '#102a4f',    // dark navy from website
        body: '#1e293b',       // slate-800
        secondary: '#64748b',  // slate-500
        hint: '#94a3b8',       // slate-400
        placeholder: '#94a3b8',

        border: '#e2e8f0',     // slate-200
        'border-focus': '#467EE5',
        divider: '#f1f5f9',

        success: { DEFAULT: '#22C55E', soft: 'rgba(34,197,94,0.1)' },
        warning: { DEFAULT: '#F59E0B', soft: 'rgba(245,158,11,0.1)' },
        danger: { DEFAULT: '#EF4444', soft: 'rgba(239,68,68,0.08)' },
        info: { DEFAULT: '#3B82F6', soft: 'rgba(59,130,246,0.1)' },
      },
    },
  },
  plugins: [],
};
