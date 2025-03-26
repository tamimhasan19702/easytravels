/** @format */

// src/context/TripRequestContext.js

import { createContext, useContext, useState, useEffect } from "react";
import { useUser } from "./UserContext";

// Create the TripRequestContext
const TripRequestContext = createContext();

// Create a provider component
export const TripRequestProvider = ({ children }) => {
  const { user } = useUser();

  // Trip state
  const [trip, setTrip] = useState({
    user: user ? { email: user.email, uid: user.uid } : null,
    startDate: "",
    endDate: "",
    travelType: "Solo",
    maleCount: 0,
    femaleCount: 0,
    kidsCount: 0,
    destination: "",
    accommodation: "No",
    transportation: "No",
    foodPreference: "No",
    interests: "",
    remarks: "",
    termsAgreed: false,
  });

  // Sidebar state
  const [locations, setLocations] = useState(["Dhaka"]);
  const [accommodationType, setAccommodationType] = useState("Hotel");
  const [transportationType, setTransportationType] = useState("Car");
  const [foodPrefs, setFoodPrefs] = useState("Halal Food, Vegetarian, Meat");

  // Function to add a new location
  const handleAddLocation = () => {
    setLocations([...locations, ""]);
  };

  // Function to update a specific location
  const updateLocation = (index, value) => {
    const updatedLocations = [...locations];
    updatedLocations[index] = value;
    setLocations(updatedLocations);
  };

  // Save trip state to localStorage whenever it changes
  useEffect(() => {
    if (user) {
      localStorage.setItem(`trip_${user.email}`, JSON.stringify(trip));
    }
  }, [trip, user]);

  // Function to handle form submission
  const handleSubmit = (e) => {
    e.preventDefault();
    if (!trip.termsAgreed) {
      alert("Please agree to the terms and conditions.");
      return;
    }
    console.log("Form submitted:", trip);
  };

  // Context value
  const value = {
    trip,
    setTrip,
    locations,
    setLocations,
    accommodationType,
    setAccommodationType,
    transportationType,
    setTransportationType,
    foodPrefs,
    setFoodPrefs,
    handleAddLocation,
    updateLocation,
    handleSubmit,
  };

  return (
    <TripRequestContext.Provider value={value}>
      {children}
    </TripRequestContext.Provider>
  );
};

// Custom hook to use the TripRequestContext
export const useTripRequest = () => {
  const context = useContext(TripRequestContext);
  if (!context) {
    throw new Error("useTripRequest must be used within a TripRequestProvider");
  }
  return context;
};
