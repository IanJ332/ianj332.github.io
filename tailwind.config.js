/** @type {import('tailwindcss').Config} */
export default {
    content: [
        "./index.html",
        "./src/**/*.{js,ts,jsx,tsx}",
    ],
    darkMode: 'class',
    theme: {
        extend: {
            fontFamily: {
                display: ['"Playfair Display"', 'serif'],
                body: ['"Inter"', 'sans-serif'],
                mono: ['"JetBrains Mono"', 'monospace'],
            },
            colors: {
                black: '#000000',
                surface: '#080808',
                card: '#111111',
                border: '#2a2a2a',
                indigo: {
                    DEFAULT: '#5e6ad2', // Linear's signature indigo
                    glow: 'rgba(94, 106, 210, 0.3)'
                },
                offwhite: '#f7f8f8',
                dim: '#8a8f98'
            }
        },
    },
    plugins: [],
}
