import React, { createContext, useContext, useState, useEffect, useCallback } from "react";
import axios from "./axios";
import { useAuth } from "./Auth";

const CartContext = createContext();

export const useCart = () => useContext(CartContext);

const CartProvider = ({ children }) => {
  const { authToken, userDetails, isAuthenticated } = useAuth();
  const [cartCount, setCartCount] = useState(0);

  const fetchCartCount = useCallback(async () => {
    if (!isAuthenticated || !authToken || !userDetails?.id) {
      setCartCount(0);
      return;
    }
    try {
      const response = await axios.post(
        "/cart/user",
        { id: userDetails.id },
        { headers: { Authorization: `Bearer ${authToken}` } }
      );
      if (response.status === 200 && response.data.cart) {
        setCartCount(response.data.cart.length);
      } else {
        setCartCount(0);
      }
    } catch {
      setCartCount(0);
    }
  }, [authToken, userDetails, isAuthenticated]);

  useEffect(() => {
    fetchCartCount();
  }, [fetchCartCount]);

  return (
    <CartContext.Provider value={{ cartCount, refreshCartCount: fetchCartCount, setCartCount }}>
      {children}
    </CartContext.Provider>
  );
};

export default CartProvider;
