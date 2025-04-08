/** @format */

import { createContext, useContext, useState, useEffect } from "react";
import { useUser } from "./UserContext";
import { db } from "../../firebase.config";
import { doc, setDoc, getDoc } from "firebase/firestore";

// Create the TripRequestContext
const TripRequestContext = createContext();

// Create a provider component
export const TripRequestProvider = ({ children }) => {
  const { user } = useUser();

  // Trip state with nested structure
  const [trip, setTrip] = useState({
    userData: {
      user: user ? { email: user.email, uid: user.uid } : null,
      role: user ? user.role : "",
      tripDetails: {
        startDate: "",
        endDate: "",
        destination: "",
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
          customMethod: "",
        },
        foodPreference: "No",
        foodPreferenceDetails: {
          preference: "Halal Food, Vegetarian, Meat",
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

  // Sidebar state
  const [locations, setLocations] = useState([]);
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

  // Save to Firestore
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
      const docSnap = await getDoc(tripRef);

      if (docSnap.exists()) {
        await setDoc(tripRef, tripWithMetadata, { merge: true });
      } else {
        await setDoc(tripRef, tripWithMetadata);
      }

      console.log("Trip saved successfully to Firestore");
      return tripRef.id;
    } catch (error) {
      console.error("Error saving trip to Firestore:", error);
      throw error;
    }
  };

  // Load from Firestore when user logs in
  useEffect(() => {
    const loadTripData = async () => {
      if (!user) return;

      try {
        const tripRef = doc(db, "tripRequests", user.uid);
        const docSnap = await getDoc(tripRef);

        if (docSnap.exists()) {
          setTrip((prev) => ({
            ...prev,
            ...docSnap.data(),
          }));
          if (docSnap.data().userData?.tripDetails?.locations) {
            setLocations(docSnap.data().userData.tripDetails.locations);
          }
        }
      } catch (error) {
        console.error("Error loading trip data:", error);
      }
    };

    loadTripData();
  }, [user]);

  // Save to localStorage and Firestore when trip changes
  useEffect(() => {
    if (user) {
      localStorage.setItem(`trip_${user.email}`, JSON.stringify(trip));
      saveToFirestore(trip);
    }
  }, [trip, user]);

  // Function to handle form submission
  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!trip.userData.tripDetails.termsAgreed) {
      alert("Please agree to the terms and conditions.");
      return;
    }

    try {
      const tripId = await saveToFirestore(trip);
      console.log("Trip submitted successfully with ID:", tripId);
    } catch (error) {
      console.error("Error submitting trip:", error);
      alert("Failed to submit trip request. Please try again.");
    }
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
