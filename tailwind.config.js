export default {
    content: [
        "./index.html",
        "./src/**/*.{js,ts,jsx,tsx}",
    ],
    darkMode: 'class',
    theme: {
        extend: {
            fontFamily: {
                display: ['"Space Grotesk"', 'sans-serif'],
                body: ['"Inter"', 'sans-serif'],
                mono: ['"JetBrains Mono"', 'monospace'],
            },
            colors: {
                black: '#000000',
                surface: '#080808',
                card: '#111111',
                border: '#2a2a2a',
                indigo: {
                    DEFAULT: '#5e6ad2',
                    glow: 'rgba(94, 106, 210, 0.3)'
                },
                offwhite: '#f7f8f8',
                dim: '#8a8f98',
                glass: {
                    DEFAULT: 'rgba(255, 255, 255, 0.55)',
                    dark: 'rgba(10, 10, 14, 0.45)',
                    border: 'rgba(255, 255, 255, 0.08)'
                }
            },
            keyframes: {
                themeTransition: {
                    '0%': { opacity: '0' },
                    '100%': { opacity: '1' }
                }
            },
            animation: {
                theme: 'themeTransition 0.6s cubic-bezier(0.4, 0, 0.2, 1)'
            }
        },
    },
    plugins: [],
}
