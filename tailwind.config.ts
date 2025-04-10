import type { Config } from "tailwindcss";

const config = {
  darkMode: ["class"],
  content: [
    "./pages/**/*.{ts,tsx}",
    "./components/**/*.{ts,tsx}",
    "./app/**/*.{ts,tsx}",
    "./src/**/*.{ts,tsx}",
  ],
  prefix: "",
  theme: {
    container: {
      center: true,
      padding: "2rem",
      screens: {
        "2xl": "1400px",
      },
    },
    extend: {
      colors: {
        border: "hsl(var(--border))",
        input: "hsl(var(--input))",
        ring: "hsl(var(--ring))",
        background: "hsl(var(--background))",
        foreground: "hsl(var(--foreground))",
        primary: {
          DEFAULT: "hsl(var(--primary))",
          foreground: "hsl(var(--primary-foreground))",
        },
        secondary: {
          DEFAULT: "hsl(var(--secondary))",
          foreground: "hsl(var(--secondary-foreground))",
        },
        destructive: {
          DEFAULT: "hsl(var(--destructive))",
          foreground: "hsl(var(--destructive-foreground))",
        },
        muted: {
          DEFAULT: "hsl(var(--muted))",
          foreground: "hsl(var(--muted-foreground))",
        },
        accent: {
          DEFAULT: "hsl(var(--accent))",
          foreground: "hsl(var(--accent-foreground))",
        },
        popover: {
          DEFAULT: "hsl(var(--popover))",
          foreground: "hsl(var(--popover-foreground))",
        },
        card: {
          DEFAULT: "hsl(var(--card))",
          foreground: "hsl(var(--card-foreground))",
        },
      },
      borderRadius: {
        lg: "var(--radius)",
        md: "calc(var(--radius) - 2px)",
        sm: "calc(var(--radius) - 4px)",
      },
      keyframes: {
        "accordion-down": {
          from: { height: "0" },
          to: { height: "var(--radix-accordion-content-height)" },
        },
        "accordion-up": {
          from: { height: "var(--radix-accordion-content-height)" },
          to: { height: "0" },
        },
        float: {
          '0%': { transform: 'translateY(0) rotate(0deg)', opacity: '0' },
          '10%': { opacity: '1' },
          '90%': { opacity: '1' },
          '100%': { transform: 'translateY(-100vh) rotate(720deg)', opacity: '0' }
        },
        // 'pulse-fade': {
        //   '0%, 100%': { transform: 'scale(1)', opacity: '0.3' },
        //   '50%': { transform: 'scale(1.5)', opacity: '1' }
        // },
        confetti: {
          '0%': { transform: 'translate(0, 0) rotate(0deg)', opacity: '1' },
          '100%': {
            transform: 'translate(var(--confetti-x, 100px), var(--confetti-y, 100px)) rotate(720deg)',
            opacity: '0'
          }
        },
        'pulse-fade': {
          '0%, 100%': { transform: 'scale(1)', opacity: '0.3' },
          '50%': { transform: 'scale(1.5)', opacity: '1' }
        },
        'sparkle-drift': {
          '0%': { transform: 'translateY(0) translateX(0) rotate(0deg)', opacity: '0.3' },
          '50%': { transform: 'translateY(-10px) translateX(5px) rotate(180deg)', opacity: '1' },
          '100%': { transform: 'translateY(0) translateX(0) rotate(360deg)', opacity: '0.3' }
        }

      },
      animation: {
        "accordion-down": "accordion-down 0.2s ease-out",
        "accordion-up": "accordion-up 0.2s ease-out",
        'float': 'float 30s linear infinite',
        'float-slow': 'float 60s linear infinite',
        
        'bounce-once': 'bounce 1s ease-in-out 1',
        'confetti': 'confetti 3s ease-in-out forwards',
        'pulse-fade': 'pulse-fade 4s ease-in-out infinite',
        'sparkle-drift': 'sparkle-drift 5s ease-in-out infinite',
      },

    },

  },
  plugins: [require("tailwindcss-animate")],
} satisfies Config;

export default config;
