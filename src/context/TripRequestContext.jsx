/** @format */

import { createContext, useContext, useState } from "react";
import { useUser } from "./UserContext";
import { db } from "../../firebase.config";
import { doc, setDoc } from "firebase/firestore";
import PropTypes from "prop-types";
import { useNavigate } from "react-router-dom";

// Create the TripRequestContext
const TripRequestContext = createContext();

// Create a provider component
export const TripRequestProvider = ({ children }) => {
  const { user } = useUser();
  const navigate = useNavigate();

  // Trip state with nested structure
  const [trip, setTrip] = useState({
    userData: {
      user: user ? { email: user.email, uid: user.uid } : null,
      role: user ? user.role : "",
      tripDetails: {
        startDate: "",
        endDate: "",
        destinations: [], // Updated to array
        travelType: "",
        maleCount: 0,
        femaleCount: 0,
        kidsCount: 0,
        accommodation: "No",
        accommodationDetails: {
          type: "Hotel",
          starRating: "5 Star",
        },
        transportation: "No",
        transportationDetails: {
          type: "Car",
          methods: [], // Updated to array
        },
        foodPreference: "No",
        foodPreferenceDetails: {
          preferences: [], // Updated to array
        },
        interests: "",
        remarks: "",
        termsAgreed: false,
        additionalOptions: {},
        locations: [],
      },
    },
    createdAt: null,
    status: "pending",
  });

  // Sidebar state (not used in this case, but kept for consistency)
  const [locations, setLocations] = useState([]);

  // Function to update a specific location
  const updateLocation = (index, value) => {
    const updatedLocations = [...locations];
    updatedLocations[index] = value;
    setLocations(updatedLocations);
    setTrip((prev) => ({
      ...prev,
      userData: {
        ...prev.userData,
        tripDetails: {
          ...prev.userData.tripDetails,
          locations: updatedLocations,
        },
      },
    }));
  };

  // Save to Firestore (now only called from FinalTripRequest)
  const saveToFirestore = async (tripData) => {
    if (!user) return;

    try {
      const tripWithMetadata = {
        ...tripData,
        userData: {
          ...tripData.userData,
          user: {
            email: user.email,
            uid: user.uid,
          },
        },
        createdAt: new Date().toISOString(),
        status: "pending",
      };

      const tripRef = doc(db, "tripRequests", user.uid);
      await setDoc(tripRef, tripWithMetadata);
      console.log("Trip saved successfully to Firestore");
      return tripRef.id;
    } catch (error) {
      console.error("Error saving trip to Firestore:", error);
      throw error;
    }
  };

  // Function to handle form submission (only updates state and redirects)
  const handleSubmit = (e) => {
    e.preventDefault();
    if (!trip.userData.tripDetails.termsAgreed) {
      alert("Please agree to the terms and conditions.");
      return;
    }
    // No Firestore save here, just redirect
    navigate("/final-tripreq");
  };

  // Context value
  const value = {
    trip,
    setTrip,
    locations,
    setLocations,
    updateLocation,
    handleSubmit,
    saveToFirestore, // Expose this for FinalTripRequest
  };

  return (
    <TripRequestContext.Provider value={value}>
      {children}
    </TripRequestContext.Provider>
  );
};

TripRequestProvider.propTypes = {
  children: PropTypes.node.isRequired, // Changed to node to be more permissive
};

// Custom hook to use the TripRequestContext
export const useTripRequest = () => {
  const context = useContext(TripRequestContext);
  if (!context) {
    throw new Error("useTripRequest must be used within a TripRequestProvider");
  }
  return context;
};
