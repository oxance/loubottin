import type { Config } from 'tailwindcss'
import { fontFamily } from 'tailwindcss/defaultTheme';
import animate from "tailwindcss-animate";

export default {
    content: [
        "./index.html",
        "./src/**/*.{js,ts,jsx,tsx}",
    ],
    theme: {
        extend: {
            fontFamily: {
                sans: ['"Inter"', ...fontFamily.sans],
                loubottin: '"Russo One"'
            },
            colors: {
                primary: {
                    50: '#ecfdf6',
                    100: '#d1fae8',
                    200: '#a7f3d6',
                    300: '#6ee7c1',
                    400: '#34d3a6',
                    500: '#0ea781',
                    600: '#059675',
                    700: '#047861',
                    800: '#065f4d',
                    900: '#064e41',
                    950: '#022c25',
                },
            }
        },
    },
    plugins: [
        animate
    ],
    darkMode: "class"
} satisfies Config

