/** @format */

import { createContext, useContext, useEffect, useState } from "react";
import { auth, db } from "../../firebase.config";
import { onAuthStateChanged, signOut, updateProfile } from "firebase/auth";
import { doc, getDoc } from "firebase/firestore";
import PropTypes from "prop-types";

// Create the User Context
const UserContext = createContext();

export const UserProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true); // Track auth initialization

  // Sync with Firebase Authentication and Firestore
  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, async (firebaseUser) => {
      if (firebaseUser) {
        try {
          // Refresh token
          await firebaseUser.getIdToken(true);

          // Fetch user data from Firestore
          const userRef = doc(db, "users", firebaseUser.uid);
          const userDoc = await getDoc(userRef);
          if (!userDoc.exists()) {
            console.error("User document not found:", firebaseUser.uid);
            await signOut(auth);
            setUser(null);
            setLoading(false);
            return;
          }

          const userData = userDoc.data();
          // Map "Agency" to "agent" for consistency
          const role = userData.role === "Agency" ? "agent" : userData.role;
          const contextUser = {
            uid: firebaseUser.uid,
            email: firebaseUser.email,
            role, // "agent" or "Traveler"
            fullName: userData.fullName || "",
            phoneNumber: userData.phoneNumber || "",
          };
          setUser(contextUser);
          console.log("User synced:", contextUser);

          // Set user fullname to the user state
          await updateProfile(firebaseUser, {
            displayName: contextUser.fullName,
          });
        } catch (error) {
          console.error("Error syncing user:", error);
          await signOut(auth);
          setUser(null);
        }
      } else {
        setUser(null);
      }
      setLoading(false);
    });

    return () => unsubscribe();
  }, []);

  const login = (userData) => {
    setUser(userData);
    console.log("User logged in:", userData);
  };

  const logout = async () => {
    try {
      await signOut(auth);
      setUser(null);
      console.log("User logged out");
    } catch (error) {
      console.error("Logout error:", error);
    }
  };

  const value = {
    user,
    login,
    logout,
    isAuthenticated: !!user,
    loading,
  };

  return <UserContext.Provider value={value}>{children}</UserContext.Provider>;
};

UserProvider.propTypes = {
  children: PropTypes.node.isRequired,
};

export const useUser = () => {
  const context = useContext(UserContext);
  if (context === undefined) {
    throw new Error("useUser must be used within a UserProvider");
  }
  return context;
};
