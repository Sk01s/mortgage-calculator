import type { Config } from "tailwindcss";

const config: Config = {
  content: [
    "./src/pages/**/*.{js,ts,jsx,tsx,mdx}",
    "./src/components/**/*.{js,ts,jsx,tsx,mdx}",
    "./src/app/**/*.{js,ts,jsx,tsx,mdx}",
  ],
  theme: {
    extend: {
      backgroundImage: {
        "gradient-radial": "radial-gradient(var(--tw-gradient-stops))",
        "gradient-conic":
          "conic-gradient(from 180deg at 50% 50%, var(--tw-gradient-stops))",
      },
      colors: {
        prime: "hsl(61, 70%, 52%)",
        "lite-prime": "hsl(4, 69%, 50%)",
        white: " hsl(0, 0%, 100%)",
        "lite-100": " hsl(202, 86%, 94%)",
        "lite-300": "hsl(203, 41%, 72%)",
        "lite-500": "hsl(200, 26%, 54%)",
        "lite-700": "hsl(200, 24%, 40%)",
        "lite-900": "hsl(202, 55%, 16%)",
      },
    },
  },
  plugins: [],
};
export default config;
