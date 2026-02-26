import type { Config } from "tailwindcss";

const config: Config = {
  content: [
    "./src/pages/**/*.{js,ts,jsx,tsx,mdx}",
    "./src/components/**/*.{js,ts,jsx,tsx,mdx}",
    "./src/app/**/*.{js,ts,jsx,tsx,mdx}",
  ],
  theme: {
    extend: {
      colors: {
        background: "var(--background)",
        foreground: "var(--foreground)",
        card: "var(--card)",
        "card-hover": "var(--card-hover)",
        border: "var(--border)",
        muted: "var(--muted)",
        accent: {
          DEFAULT: "#6366F1",
          light: "rgba(99, 102, 241, 0.1)",
        },
        success: "#22C55E",
        danger: "#EF4444",
        warning: "#F59E0B",
        agent: {
          orchestrator: "#6366F1",
          retail: "#EC4899",
          influencer: "#F59E0B",
          content: "#8B5CF6",
          events: "#14B8A6",
          budget: "#22C55E",
          performance: "#EF4444",
        },
      },
      fontFamily: {
        sans: ["var(--font-geist-sans)", "system-ui", "sans-serif"],
        mono: ["var(--font-geist-mono)", "monospace"],
      },
    },
  },
  plugins: [],
};
export default config;
