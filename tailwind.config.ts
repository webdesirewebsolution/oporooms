import type { Config } from "tailwindcss";
import plugin from 'tailwindcss/plugin';
import tailwindcss_animate from 'tailwindcss-animate'

export default {
  content: [
    "./src/pages/**/*.{js,ts,jsx,tsx,mdx}",
    "./src/components/**/*.{js,ts,jsx,tsx,mdx}",
    "./src/app/**/*.{js,ts,jsx,tsx,mdx}",

    './src/**/*.{js,ts,jsx,tsx,mdx}',
  ],
  theme: {
    extend: {
      colors: {
        background: "var(--background)",
        foreground: "var(--foreground)",
      },
    },
  },
  plugins: [tailwindcss_animate, plugin(({ addUtilities }) => {
    addUtilities({
      '.no-scrollbar::-webkit-scrollbar': {
        display: 'none'
      },
      '.no-scrollbar': {
        '-ms-overflow-style': 'none',  /* IE and Edge */
        'scrollbar-width': 'none'  /* Firefox */
      }
    })
  })
  ],
  important: true
} satisfies Config;
