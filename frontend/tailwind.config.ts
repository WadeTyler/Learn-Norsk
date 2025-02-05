import type { Config } from "tailwindcss";
import daisyui from "daisyui";

export default {
  content: [
    "./src/pages/**/*.{js,ts,jsx,tsx,mdx}",
    "./src/components/**/*.{js,ts,jsx,tsx,mdx}",
    "./src/app/**/*.{js,ts,jsx,tsx,mdx}",
  ],
  theme: {
    extend: {
      colors: {
        background: "var(--background)",
        background2: "var(--background-2)",
        background3: "var(--background-3)",
        foreground: "var(--foreground)",
        primary: "var(--primary)",
        accent: "var(--accent)",
        accentLight: "var(--accentLight)",
        accentDark: "var(--accentDark)",
      },
    },
  },
  plugins: [
    daisyui,
  ],
} satisfies Config;
