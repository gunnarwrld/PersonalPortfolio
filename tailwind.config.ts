import type { Config } from "tailwindcss";
import animate from "tailwindcss-animate";

/** A palette colour, stored in src/index.css as an "r g b" triplet so opacity modifiers work. */
const ink = (name: string) => `rgb(var(--${name}) / <alpha-value>)`;

export default {
  content: ["./index.html", "./src/**/*.{ts,tsx}"],
  theme: {
    container: {
      center: true,
      padding: { DEFAULT: "1.25rem", sm: "1.5rem", lg: "2rem" },
      screens: { sm: "640px", md: "768px", lg: "1024px", xl: "1216px" },
    },
    extend: {
      colors: {
        // The palette. Each colour has one job; see the token notes in src/index.css.
        mahogany: ink("mahogany"),
        espresso: ink("espresso"),
        russet: ink("russet"),
        ivory: ink("ivory"),
        parchment: ink("parchment"),
        cocoa: ink("cocoa"),
        stone: ink("stone"),
        tangerine: ink("tangerine"),
        amber: ink("amber"),
        rust: ink("rust"),

        // shadcn/ui role names, mapped onto the palette.
        border: ink("ivory"),
        input: ink("ivory"),
        ring: ink("ivory"),
        background: ink("mahogany"),
        foreground: ink("ivory"),
        primary: { DEFAULT: ink("tangerine"), foreground: ink("espresso") },
        secondary: { DEFAULT: ink("parchment"), foreground: ink("espresso") },
        destructive: { DEFAULT: ink("rust"), foreground: ink("espresso") },
        muted: { DEFAULT: ink("russet"), foreground: ink("parchment") },
        accent: { DEFAULT: ink("russet"), foreground: ink("ivory") },
        popover: { DEFAULT: ink("espresso"), foreground: ink("ivory") },
        card: { DEFAULT: ink("espresso"), foreground: ink("ivory") },
      },
      fontFamily: {
        display: ['"Alfa Slab One"', '"Alfa Slab One Fallback"', "Georgia", "serif"],
        sans: ['"Work Sans"', '"Work Sans Fallback"', "ui-sans-serif", "system-ui", "sans-serif"],
        mono: ['"Courier Prime"', "ui-monospace", '"Courier New"', "monospace"],
      },
      borderRadius: {
        lg: "var(--radius)",
        md: "var(--radius)",
        sm: "var(--radius)",
      },
    },
  },
  plugins: [animate],
} satisfies Config;
