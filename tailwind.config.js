/** @type {import('tailwindcss').Config} */
module.exports = {
  content: ["./src/**/*.{ts,tsx}"],
  theme: {
    extend: {},
  },
  plugins: [require("tailwindcss-animate"), require("daisyui")],
  daisyui: {
    themes: [
      "light",
      "dark",
      "cupcake",
      "bumblebee",
      "emerald",
      "corporate",
      "synthwave",
      "retro",
      "cyberpunk",
      "valentine",
      "halloween",
      "garden",
      "forest",
      "aqua",
      "lofi",
      "pastel",
      "fantasy",
      "wireframe",
      "black",
      "luxury",
      "dracula",
      "cmyk",
      "autumn",
      "business",
      "acid",
      "lemonade",
      "night",
      "coffee",
      "winter",
      "dim",
      "nord",
      "sunset",
      {
        newYear: {
          primary: "#FF0000", // Red for primary
          secondary: "#FFD700", // Golden yellow for secondary
          accent: "#FFA500", // Orange for accent
          neutral: "#FF6347", // Tomato red for neutral
          "base-100": "#FFFACD", // Lemon chiffon for base background
          info: "#FF4500", // Orange red for info
          success: "#FF8C00", // Dark orange for success
          warning: "#FFFF00", // Yellow for warning
          error: "#B22222", // Firebrick red for error
        },
        golden: {
          primary: "#DAA520", // Goldenrod for primary
          secondary: "#FFD700", // Gold for secondary
          accent: "#B8860B", // Dark Goldenrod for accent
          neutral: "#8B4513", // Saddle Brown for neutral
          "base-100": "#F5DEB3", // Wheat for base background
          info: "#D2B48C", // Tan for info
          success: "#C5B358", // Khaki for success
          warning: "#FFD700", // Gold for warning
          error: "#B22222", // Firebrick red for error
        },
        sakura: {
          primary: "#FFB7C5", // Sakura pink for primary
          secondary: "#00FF7F", // Spring green for secondary
          accent: "#FFD700", // Golden yellow for accent
          neutral: "#FFFFFF", // White for neutral
          "base-100": "#F0FFF0", // Honeydew for base background
          info: "#87CEEB", // Sky blue for info
          success: "#32CD32", // Lime green for success
          warning: "#FFA07A", // Light salmon for warning
          error: "#FF6347", // Tomato red for error
        },
        kiddo: {
          "primary": "#FF5733",  // Crayon red for primary
          "secondary": "#FFBD33",  // Crayon yellow for secondary
          "accent": "#33FF57",  // Crayon green for accent
          "neutral": "#FFFFFF",  // White for neutral
          "base-100": "#F0F8FF",  // Alice blue for base background
          "info": "#33A1FF",  // Crayon blue for info
          "success": "#FFC300",  // Crayon gold for success
          "warning": "#FF5733",  // Crayon red-orange for warning
          "error": "#C70039"  // Crayon dark red for error
        }
      },
    ],
  },
};
