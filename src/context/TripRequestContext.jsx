/** @format */

import { createContext, useContext, useState } from "react";
import { useUser } from "./UserContext";
import { db } from "../../firebase.config";
import {
  doc,
  addDoc,
  collection,
  Timestamp,
  getDocs,
  updateDoc,
  arrayUnion,
  getDoc,
} from "firebase/firestore";
import PropTypes from "prop-types";

// Create the TripRequestContext
const TripRequestContext = createContext();

export const TripRequestProvider = ({ children }) => {
  const { user } = useUser();

  // Initialize trip state with user info and bids field
  const [trip, setTrip] = useState({
    userInfo: null,
    tripDetails: {
      startDate: "",
      endDate: "",
      preferredTime: "",
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
    deadline: null,
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
        createdAt,
        deadline,
        status: "pending",
        bids: tripData.bids || [],
      };

      const docRef = await addDoc(collection(db, "tripRequests"), tripToSave);
      setTrip({ ...tripToSave, id: docRef.id });
      console.log("New trip request added with ID:", docRef.id);
      return docRef.id;
    } catch (error) {
      console.error("Error adding trip request to Firestore:", error);
      throw error;
    }
  };

  // Handle form submission (updates state and redirects to final review)
  const handleSubmit = (e, callback) => {
    e.preventDefault();
    const details = trip.tripDetails;

    if (!details.termsAgreed) {
      alert("You must agree to the Terms & Conditions.");
      return;
    }
    if (!details.startDate || !details.endDate) {
      alert("Please select a date range for your trip.");
      return;
    }
    if (details.destinations.length === 0) {
      alert("Please select at least one destination.");
      return;
    }
    if (callback) callback();
  };

  // Check if agency already submitted a bid
  const hasAgencyBid = async (tripId, agencyId) => {
    try {
      const tripRef = doc(db, "tripRequests", tripId);
      const tripDoc = await getDoc(tripRef);
      if (!tripDoc.exists()) throw new Error("Trip does not exist.");

      const tripData = tripDoc.data();
      const bids = tripData.bids || [];
      return bids.some((bid) => bid.agencyId === agencyId);
    } catch (error) {
      console.error("Error checking existing bids:", error);
      throw error;
    }
  };

  // Submit a bid from an agent
  const addBid = async (tripId, agentBid) => {
    if (!user || user.role !== "agent") {
      throw new Error("Only agents can submit bids.");
    }

    try {
      const tripRef = doc(db, "tripRequests", tripId);
      const tripDoc = await getDoc(tripRef);

      if (!tripDoc.exists()) {
        throw new Error("Trip does not exist.");
      }

      const tripData = tripDoc.data();
      const existingBid = tripData.bids?.find(
        (bid) => bid.agencyId === user.uid
      );
      if (existingBid) {
        throw new Error("You have already submitted a bid for this trip.");
      }

      const newBid = {
        bidId: `bid_${Math.random().toString(36).substr(2, 9)}`,
        isRead: false,
        amount: parseFloat(agentBid.bidPrice) || 0,
        agencyId: user.uid,
        agencyName: agentBid.agencyName || user.name || "Unknown Agency",
        email: user.email || "Unknown Email",
        number: agentBid.contactNumber || "Unknown Number",
        coverLetter: agentBid.coverLetter || "",
        attachments: agentBid.attachments || [],
        submittedAt: new Date().toISOString(),
        status: "pending",
      };

      await updateDoc(tripRef, {
        bids: arrayUnion(newBid),
      });

      if (trip.id === tripId) {
        setTrip((prev) => ({
          ...prev,
          bids: [...prev.bids, newBid],
        }));
      }

      console.log("Bid added successfully by agent:", user.uid);
      return newBid;
    } catch (error) {
      console.error("Error adding bid to Firestore:", error);
      throw error;
    }
  };

  // Fetch all trip requests from Firestore
  const fetchAllTrips = async () => {
    try {
      const querySnapshot = await getDocs(collection(db, "tripRequests"));
      const trips = querySnapshot.docs.map((doc) => ({
        id: doc.id,
        ...doc.data(),
      }));
      return trips;
    } catch (error) {
      console.error("Error fetching trips:", error);
      throw error;
    }
  };

  const value = {
    trip,
    setTrip,
    handleSubmit,
    saveToFirestore,
    addBid,
    fetchAllTrips,
    hasAgencyBid,
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
