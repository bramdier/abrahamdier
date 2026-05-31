/** @type {import('tailwindcss').Config} */
export default {
  content: ["./index.html", "./header.html", "./footer.html", "./templates/**/*.html", "./admin/**/*.html"],
  darkMode: "class",
  theme: {
    extend: {
      colors: {
        secondary: "#9a442d",
        "secondary-container": "#fc9174",
        "on-primary": "#ffffff",
        "on-surface": "#1a1c1c",
        "on-surface-variant": "#44474c",
        "outline-variant": "#c4c6cd",
        primary: "#041627",
        "primary-container": "#1a2b3c",
        surface: "#faf9f8",
        "surface-container-low": "#f4f3f2",
        "surface-container-lowest": "#ffffff",
      },
      fontFamily: {
        headline: ["Manrope", "sans-serif"],
        body: ["Inter", "sans-serif"],
        label: ["Space Grotesk", "sans-serif"],
      },
      borderRadius: {
        DEFAULT: "0.125rem",
        lg: "0.25rem",
        xl: "0.5rem",
        full: "0.75rem",
      },
    },
  },
};
