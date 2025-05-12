/** @format */

import {
  createContext,
  useState,
  useEffect,
  useCallback,
  useContext,
} from "react";
import { db } from "firebase.config";
import PropTypes from "prop-types";
import {
  collection,
  addDoc,
  onSnapshot,
  query,
  orderBy,
  serverTimestamp,
} from "firebase/firestore";

const MessagingContext = createContext();

/**
 * Provides messaging context for real-time chat between traveler and agent.
 * @param {Object} props
 * @param {React.ReactNode} props.children - The child components to render within the provider.
 */
export const MessagingProvider = ({ children }) => {
  const [messages, setMessages] = useState([]);
  const [messageRoomId, setMessageRoomId] = useState(null);
  const [error, setError] = useState(null);

  // Initialize message room for a specific trip and agent
  const initMessageRoom = useCallback((tripId, agencyId) => {
    if (!tripId || !agencyId) {
      setError("Invalid trip or agency ID");
      return;
    }
    const roomId = `trip_${tripId}_agent_${agencyId}`; // e.g., trip_abc123xyz_agent_007
    setMessageRoomId(roomId);
    setError(null);
  }, []);

  // Send a message
  const sendMessage = useCallback(
    async (messageText, senderId, senderRole) => {
      if (!messageRoomId) {
        setError("No message room initialized");
        return;
      }
      if (!messageText.trim()) {
        setError("Message cannot be empty");
        return;
      }
      try {
        await addDoc(collection(db, "chatRooms", messageRoomId, "messages"), {
          senderId, // e.g., user_001 or agent_007
          senderRole, // Traveler or Agent
          message: messageText,
          timestamp: serverTimestamp(), // Use server timestamp for consistency
          isRead: false,
        });
        setError(null);
      } catch (err) {
        setError("Failed to send message: " + err.message);
        console.error(err);
      }
    },
    [messageRoomId]
  );

  // Listen for real-time message updates
  useEffect(() => {
    if (!messageRoomId) return;

    const q = query(
      collection(db, "chatRooms", messageRoomId, "messages"),
      orderBy("timestamp", "asc")
    );

    const unsubscribe = onSnapshot(
      q,
      (snapshot) => {
        const updatedMessages = snapshot.docs.map((doc) => ({
          id: doc.id,
          ...doc.data(),
        }));
        setMessages(updatedMessages);
        setError(null);
      },
      (err) => {
        setError("Failed to fetch messages: " + err.message);
        console.error(err);
      }
    );

    return () => unsubscribe(); // Cleanup listener on unmount
  }, [messageRoomId]);

  // Clear message room
  const clearMessageRoom = useCallback(() => {
    setMessageRoomId(null);
    setMessages([]);
    setError(null);
  }, []);

  return (
    <MessagingContext.Provider
      value={{
        messages,
        messageRoomId,
        initMessageRoom,
        sendMessage,
        clearMessageRoom,
        error,
      }}>
      {children}
    </MessagingContext.Provider>
  );
};

MessagingProvider.propTypes = {
  children: PropTypes.node.isRequired,
};

export const useMessaging = () => useContext(MessagingContext);
