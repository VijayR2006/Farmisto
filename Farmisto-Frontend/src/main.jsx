import { createRoot } from "react-dom/client";
import "./index.css";
import App from "./App.jsx";
import { BrowserRouter } from "react-router-dom";
import "animate.css";
import AuthProvider from "./utils/Auth.jsx";
import CartProvider from "./utils/CartContext.jsx";

createRoot(document.getElementById("root")).render(
  <AuthProvider>
    <CartProvider>
      <BrowserRouter>
        <App />
      </BrowserRouter>
    </CartProvider>
  </AuthProvider>
);
