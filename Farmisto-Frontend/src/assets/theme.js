const theme = {
    colors: {
      primary: {
        base: "#34D399", // Emerald 400
        hover: "#10B981", // Emerald 500
      },
      secondary: {
        base: "#06B6D4", // Cyan 400
        hover: "#0891B2", // Cyan 500
      },
      background: {
        light: "#F0FDF4", // Emerald 50
        dark: "#FFFFFF", // White
      },
      text: {
        dark: "#1F2937", // Gray 800
        light: "#6B7280", // Gray 600
      },
      border: {
        base: "#A7F3D0", // Emerald 100
      },
      alert: {
        success: "#34D399", // Emerald 400
        error: "#EF4444", // Red 400
      },
    },
    typography: {
      heading: {
        base: "text-2xl font-bold",
        large: "text-3xl md:text-4xl font-bold",
      },
      body: {
        base: "text-gray-600",
        emphasis: "text-gray-800 font-semibold",
      },
    },
    buttons: {
      primary: "bg-gradient-to-r from-green-400 to-teal-400 text-white rounded-full shadow-lg hover:from-green-500 hover:to-teal-500 transition-all duration-300 transform hover:-translate-y-1",
      secondary: "bg-gray-100 p-2 rounded-full hover:bg-gray-200",
      cart: "bg-emerald-500 hover:bg-emerald-600 text-white px-4 py-2 rounded-lg flex items-center gap-2",
    },
    badges: {
      online: "bg-emerald-400",
      offline: "bg-red-400",
    },
  };
  
  export default theme;
  