/** @format */

import { createContext, useContext, useState } from "react";
import { useUser } from "./UserContext";
import { db } from "../../firebase.config";
import { doc, setDoc } from "firebase/firestore";
import PropTypes from "prop-types";
import { useNavigate } from "react-router-dom";

// Create the TripRequestContext
const TripRequestContext = createContext();

export const TripRequestProvider = ({ children }) => {
  const { user } = useUser();
  const navigate = useNavigate();

  // Initialize trip state with user info and bids field
  const [trip, setTrip] = useState({
    userInfo: user
      ? { email: user.email, uid: user.uid, role: user.role || "traveler" }
      : null,
    tripDetails: {
      startDate: "",
      endDate: "",
      destinations: [],
      travelType: "",
      maleCount: 0,
      femaleCount: 0,
      kidsCount: 0,
      accommodation: "No",
      accommodationDetails: { type: "Hotel", starRating: "5 Star" },
      transportation: "No",
      transportationDetails: { type: "Car", methods: [] },
      foodPreference: "No",
      foodPreferenceDetails: { preferences: [] },
      interests: "",
      remarks: "",
      termsAgreed: false,
      additionalOptions: {},
      locations: [],
    },
    createdAt: null,
    status: "pending",
    bids: [], // Array to store multiple agent bids
  });

  // Save to Firestore (called only from FinalTripRequest)
  const saveToFirestore = async (tripData) => {
    if (!user || !tripData.userInfo?.uid) {
      throw new Error("User not authenticated.");
    }

    try {
      const tripWithMetadata = {
        ...tripData,
        createdAt: tripData.createdAt || new Date().toISOString(),
        status: tripData.status || "pending",
        bids: tripData.bids || [], // Ensure bids array is included
      };

      const tripRef = doc(db, "tripRequests", tripData.userInfo.uid);
      await setDoc(tripRef, tripWithMetadata, { merge: true }); // Merge to preserve existing bids
      console.log(
        "Trip saved successfully to Firestore with ID:",
        tripData.userInfo.uid
      );
      return tripData.userInfo.uid;
    } catch (error) {
      console.error("Error saving trip to Firestore:", error);
      throw error;
    }
  };

  // Handle form submission (updates state and redirects to final review)
  const handleSubmit = (e) => {
    e.preventDefault();
    if (!trip.tripDetails.termsAgreed) {
      alert("Please agree to the terms and conditions.");
      return;
    }
    navigate("/final-tripreq");
  };

  // Function to add a bid (for agents, typically called from an agent-facing component)
  const addBid = async (tripId, agentBid) => {
    if (!user || user.role !== "agent") {
      throw new Error("Only agents can submit bids.");
    }

    const newBid = {
      agentId: user.uid,
      agentEmail: user.email,
      bidAmount: agentBid.bidAmount,
      bidTimestamp: new Date().toISOString(),
      message: agentBid.message || "",
    };

    try {
      const tripRef = doc(db, "tripRequests", tripId);
      const updatedTrip = {
        ...trip,
        bids: [...trip.bids, newBid],
      };
      await setDoc(tripRef, updatedTrip, { merge: true });
      setTrip(updatedTrip); // Update local state
      console.log("Bid added successfully by agent:", user.uid);
      return newBid;
    } catch (error) {
      console.error("Error adding bid to Firestore:", error);
      throw error;
    }
  };

  // Context value
  const value = {
    trip,
    setTrip,
    handleSubmit,
    saveToFirestore,
    addBid, // Expose addBid for agent functionality
  };

  return (
    <TripRequestContext.Provider value={value}>
      {children}
    </TripRequestContext.Provider>
  );
};

TripRequestProvider.propTypes = {
  children: PropTypes.node.isRequired,
};

export const useTripRequest = () => {
  const context = useContext(TripRequestContext);
  if (!context) {
    throw new Error("useTripRequest must be used within a TripRequestProvider");
  }
  return context;
};
