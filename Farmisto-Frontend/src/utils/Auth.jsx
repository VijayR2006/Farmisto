import { createContext, useContext, useState, useEffect, useCallback } from "react";
import {jwtDecode} from "jwt-decode";
import axios from "./axios";

const AuthContext = createContext();

export const useAuth = () => {
  return useContext(AuthContext);
};

const AuthProvider = ({ children }) => {
  const [authToken, setAuthToken] = useState(null);
  const [userDetails, setUserDetails] = useState(null);
  const [isReady, setIsReady] = useState(false);

  useEffect(() => {
    const token = localStorage.getItem("authToken");

    if (token) {
      try {
        const decoded = jwtDecode(token);
        const isTokenExpired = !decoded.exp || decoded.exp * 1000 < Date.now();
        
        if (isTokenExpired || !decoded.id) {
          localStorage.removeItem("authToken");
        } else {
          setAuthToken(token);
          setUserDetails(decoded);
        }
      } catch {
        localStorage.removeItem("authToken");
      }
    }
    setIsReady(true);
  }, []);

  const login = (token) => {
    const decoded = jwtDecode(token);
    if (!decoded.id || !decoded.exp || decoded.exp * 1000 <= Date.now()) {
      throw new Error("The server returned an invalid authentication token.");
    }
    localStorage.setItem("authToken", token);
    setAuthToken(token);
    setUserDetails(decoded);
  };


  const logout = useCallback(() => {
    const token = authToken || localStorage.getItem("authToken");
    localStorage.removeItem("authToken");
    setAuthToken(null);
    setUserDetails(null);
    if (token) {
      axios.post("/user/logout", {}, { headers: { Authorization: `Bearer ${token}` } })
        .catch(() => console.error("The session could not be invalidated on the server."));
    }
  }, [authToken]);

  const value = {
    authToken,
    userDetails,
    login,
    logout,
    isAuthenticated: !!authToken,
    isReady,
  };

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
};

export default AuthProvider;
