/** @format */

import { useEffect, useState } from "react";
import { Navigate, Outlet } from "react-router-dom";
import { auth } from "../../firebase.config"; // Adjust path as needed
import { onAuthStateChanged } from "firebase/auth";
import { useUser } from "../context/UserContext"; // Adjust path as needed
import Preloader from "./Preloader";

function PublicRoute() {
  const [isLoading, setIsLoading] = useState(true);
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const { user } = useUser();

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, (firebaseUser) => {
      try {
        if (firebaseUser && user) {
          setIsAuthenticated(true);
        } else {
          setIsAuthenticated(false);
        }
      } catch (error) {
        console.error("Error checking public route:", error);
        setIsAuthenticated(false);
      } finally {
        setIsLoading(false);
      }
    });

    return () => unsubscribe();
  }, [user]);

  if (isLoading) {
    return <Preloader />;
  }

  // If user is authenticated, redirect to /dashboard; otherwise, allow access to the route
  return isAuthenticated ? <Navigate to="/dashboard" replace /> : <Outlet />;
}

export default PublicRoute;
