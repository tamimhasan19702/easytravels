/** @format */

import { useState, useEffect, useRef } from "react";
import { useParams } from "react-router-dom";
import { useMessaging } from "@/context/MessagingContext";
import { useUser } from "@/context/UserContext";
import DashboardLayout from "@/components/DashboardLayout";
import { doc, getDoc } from "firebase/firestore";
import { db } from "../../../firebase.config";
import { format } from "date-fns";

const UserMessage = () => {
  const { tripId, bidId } = useParams();
  const { user } = useUser();
  const { messages, initMessageRoom, sendMessage, error } = useMessaging();
  const [tripData, setTripData] = useState(null);
  const [bidData, setBidData] = useState(null);
  const [messageText, setMessageText] = useState("");
  const [loading, setLoading] = useState(true);
  const [fetchError, setFetchError] = useState(null);
  const messagesEndRef = useRef(null);

  useEffect(() => {
    const fetchTripAndBid = async () => {
      if (!tripId || !bidId || !user?.uid) {
        setFetchError("Missing trip ID, bid ID, or user.");
        setLoading(false);
        return;
      }

      try {
        const tripRef = doc(db, "tripRequests", tripId);
        const tripSnap = await getDoc(tripRef);

        if (!tripSnap.exists()) {
          throw new Error("Trip not found.");
        }

        const trip = tripSnap.data();
        setTripData(trip);

        if (
          trip.userInfo.uid !== user.uid &&
          !trip.bids?.some(
            (bid) => bid.bidId === bidId && bid.agencyId === user.uid
          )
        ) {
          throw new Error("Unauthorized access to this chat.");
        }

        const bid = trip.bids?.find((b) => b.bidId === bidId);
        if (!bid) {
          throw new Error("Bid not found.");
        }
        setBidData(bid);

        initMessageRoom(tripId, bid.agencyId);
      } catch (err) {
        setFetchError(err.message);
        console.error("Error fetching trip/bid:", err);
      } finally {
        setLoading(false);
      }
    };

    fetchTripAndBid();
  }, [tripId, bidId, user, initMessageRoom]);

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages]);

  const handleSend = async (e) => {
    e.preventDefault();
    if (!messageText.trim() || !user?.uid) return;
    try {
      await sendMessage(
        messageText,
        user.uid,
        user.role || (bidData?.agencyId === user.uid ? "Agent" : "Traveler")
      );
      setMessageText("");
    } catch (err) {
      console.error("Error sending message:", err);
    }
  };

  if (!user) {
    return (
      <DashboardLayout>
        <div className="p-4 text-center text-white bg-gray-900">
          Please log in to view messages.
        </div>
      </DashboardLayout>
    );
  }

  if (loading) {
    return (
      <DashboardLayout>
        <div className="p-4 text-center text-white bg-gray-900">Loading...</div>
      </DashboardLayout>
    );
  }

  if (fetchError) {
    return (
      <DashboardLayout>
        <div className="p-4 text-center text-red-500 bg-gray-900">
          {fetchError}
        </div>
      </DashboardLayout>
    );
  }

  const recipientName =
    user.role === "Traveler"
      ? bidData?.agencyName || "Agency"
      : tripData?.userInfo?.name || "Traveler";

  const userRoleLabel =
    user.role === "Traveler"
      ? `Traveler: ${tripData?.userInfo?.fullName}`
      : `Agency: ${bidData?.agencyName}`;

  return (
    <DashboardLayout>
      <div className="flex flex-col h-[calc(100vh-4rem)] bg-gray-900 text-[#2E4A47]">
        {/* Chat Header */}
        <div className="bg-[#E2E6BD] text-[#2E4A47] p-4 shadow-md">
          <h2 className="text-lg text-[#2E4A47] font-semibold">
            Chat with {recipientName}
          </h2>
          <p className="text-sm text-[#2E4A47]">{userRoleLabel}</p>
          <p className="text-sm text-[#2E4A47]">
            Destination: {tripData?.tripDetails?.destinations?.join(", ")}
          </p>
          {(error || fetchError) && (
            <p className="text-red-300 text-sm mt-2">{error || fetchError}</p>
          )}
        </div>

        {/* Messages Area */}
        <div className="flex-1 p-4 overflow-y-auto bg-white text-[#2E4A47]">
          {messages.length === 0 ? (
            <p className="text-center text-gray-400">No messages yet.</p>
          ) : (
            messages.map((msg) => (
              <div
                key={msg.id}
                className={`mb-4 flex ${
                  msg.senderId === user.uid ? "justify-end" : "justify-start"
                }`}>
                <div
                  className={`max-w-xs p-3 rounded-lg shadow ${
                    msg.senderId === user.uid
                      ? "bg-[#E2E6BD] text-[#2E4A47]"
                      : "bg-gray-700 text-[#2E4A47]"
                  }`}>
                  <p className="text-sm text-[#2E4A47]">{msg.message}</p>
                  <p className="text-xs mt-1 opacity-70 text-[#2E4A47]">
                    {msg.timestamp
                      ? format(msg.timestamp.toDate(), "p, MMM d")
                      : "Sending..."}
                  </p>
                </div>
              </div>
            ))
          )}
          <div ref={messagesEndRef} />
        </div>

        {/* Message Input */}
        <form onSubmit={handleSend} className="p-4 bg-white border-t ">
          <div className="flex gap-2">
            <input
              type="text"
              value={messageText}
              onChange={(e) => setMessageText(e.target.value)}
              placeholder="Type your message..."
              className="flex-1 p-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-[#131313] text-[#2E4A47] placeholder-gray-400"
              aria-label="Message input"
            />
            <button
              type="submit"
              className="bg-[#2E4A47] text-[#ffffff] px-4 py-2 rounded-lg hover:bg-[#2E4A47] transition disabled:opacity-100"
              disabled={!messageText.trim()}>
              Send
            </button>
          </div>
        </form>
      </div>
    </DashboardLayout>
  );
};

export default UserMessage;
