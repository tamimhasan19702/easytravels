/** @format */

import { createContext, useContext, useState } from "react";
import { useUser } from "./UserContext";
import { db } from "../../firebase.config";
import { doc, setDoc, addDoc, collection, Timestamp } from "firebase/firestore";
import PropTypes from "prop-types";
import { useNavigate } from "react-router-dom";

// Create the TripRequestContext
const TripRequestContext = createContext();

export const TripRequestProvider = ({ children }) => {
  const { user } = useUser();
  const navigate = useNavigate();

  // Initialize trip state with user info and bids field
  const [trip, setTrip] = useState({
    userInfo: null,
    tripDetails: {
      startDate: "",
      endDate: "",
      preferredTime: "", // New field for preferred time
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
    deadline: null, // New field for 24-hour deadline
    status: "pending",
    bids: [],
  });

  // Save to Firestore (called only from FinalTripRequest)
  const saveToFirestore = async (tripData) => {
    try {
      const createdAt = Timestamp.now();
      const deadline = Timestamp.fromMillis(
        new Date().getTime() + 24 * 60 * 60 * 1000
      );

      const tripToSave = {
        ...tripData,
        createdAt: createdAt,
        deadline: deadline,
        status: "pending",
        bids: tripData.bids || [],
      };

      const docRef = await addDoc(collection(db, "tripRequests"), tripToSave);
      console.log("New trip request added with ID: ", docRef.id);
      return docRef.id;
    } catch (error) {
      console.error("Error adding trip request to Firestore: ", error);
      throw error;
    }
  };

  // Handle form submission (updates state and redirects to final review)
  const handleSubmit = (e, callback) => {
    e.preventDefault();
    if (!trip.tripDetails.termsAgreed) {
      alert("You must agree to the Terms & Conditions.");
      return;
    }
    if (!trip.tripDetails.startDate || !trip.tripDetails.endDate) {
      alert("Please select a date range for your trip.");
      return;
    }
    if (trip.tripDetails.destinations.length === 0) {
      alert("Please select at least one destination.");
      return;
    }
    if (callback) callback();
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
      setTrip(updatedTrip);
      console.log("Bid added successfully by agent:", user.uid);
      return newBid;
    } catch (error) {
      console.error("Error adding bid to Firestore:", error);
      throw error;
    }
  };

  // Add a validation function when setting the trip

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
