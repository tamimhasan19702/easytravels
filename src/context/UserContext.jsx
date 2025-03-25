/** @format */

import { createContext, useContext, useEffect, useState } from "react";
import { signOut } from "firebase/auth"; // Import signOut from Firebase
import { auth } from "../../firebase.config"; // Adjust path as needed

// Create the User Context
const UserContext = createContext();

// Session expiration time (e.g., 24 hours in milliseconds)
const SESSION_DURATION = 120 * 60 * 1000; // 24 hours

export const UserProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [sessionExpiry, setSessionExpiry] = useState(null);

  useEffect(() => {
    const storedUser = localStorage.getItem("user");
    const storedExpiry = localStorage.getItem("sessionExpiry");

    if (storedUser && storedExpiry) {
      const expiryTime = parseInt(storedExpiry);
      if (Date.now() < expiryTime) {
        setUser(JSON.parse(storedUser));
        setSessionExpiry(expiryTime);
      } else {
        logout();
      }
    }
  }, []);

  useEffect(() => {
    if (sessionExpiry) {
      const checkSession = setInterval(() => {
        if (Date.now() >= sessionExpiry) {
          logout();
        }
      }, 1000 * 60); // Check every minute

      return () => clearInterval(checkSession);
    }
  }, [sessionExpiry]);

  const login = (userData) => {
    const expiryTime = Date.now() + SESSION_DURATION;
    setUser(userData);
    setSessionExpiry(expiryTime);

    localStorage.setItem("user", JSON.stringify(userData));
    localStorage.setItem("sessionExpiry", expiryTime.toString());
  };

  const logout = async () => {
    try {
      await signOut(auth); // Sign out from Firebase Authentication
      setUser(null);
      setSessionExpiry(null);
      localStorage.removeItem("user");
      localStorage.removeItem("sessionExpiry");
    } catch (error) {
      console.error("Logout error:", error);
    }
  };

  const value = {
    user,
    login,
    logout,
    isAuthenticated: !!user,
  };

  return <UserContext.Provider value={value}>{children}</UserContext.Provider>;
};

export const useUser = () => {
  const context = useContext(UserContext);
  if (context === undefined) {
    throw new Error("useUser must be used within a UserProvider");
  }
  return context;
};
