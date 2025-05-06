/** @format */

import { FaUser, FaMapMarkerAlt, FaMoneyBillWave } from "react-icons/fa";
import { motion } from "framer-motion";

const cardVariants = {
  hidden: { y: 50, opacity: 0 },
  visible: { y: 0, opacity: 1, transition: { duration: 0.6, ease: "easeOut" } },
};

function TripCard({ trip, onClick }) {
  const totalPeople =
    trip.tripDetails.travelType === "Solo"
      ? 1
      : trip.tripDetails.maleCount +
        trip.tripDetails.femaleCount +
        trip.tripDetails.kidsCount;

  return (
    <motion.div
      className="bg-white border border-gray-100 rounded-xl p-5 shadow-lg hover:shadow-xl transition-shadow duration-300 flex flex-col gap-4 w-full"
      variants={cardVariants}
      initial="hidden"
      animate="visible">
      <div className="flex flex-col sm:flex-row sm:justify-between sm:items-center gap-3">
        <div className="flex items-center gap-3 overflow-hidden">
          <FaUser className="text-[#2E4A47] flex-shrink-0" />
          <span className="text-gray-700 font-medium truncate">
            <strong>Travel Type:</strong> {trip.tripDetails.travelType} (
            {totalPeople} {totalPeople === 1 ? "person" : "people"} )
          </span>
        </div>
        <div className="flex items-center gap-3 overflow-hidden">
          <FaMapMarkerAlt className="text-[#2E4A47] flex-shrink-0" />
          <span className="text-gray-700 font-medium truncate">
            {trip.tripDetails.destinations.join(", ")}
          </span>
        </div>
      </div>

      <div className="text-gray-700 font-medium truncate">
        <strong>Dates:</strong> {trip.tripDetails.startDate} to{" "}
        {trip.tripDetails.endDate}
      </div>

      <div className="text-gray-700 font-medium truncate">
        <strong>Preferred Time:</strong>{" "}
        {trip.tripDetails.preferredTime || "Not set"}
      </div>

      <div className="text-gray-700 font-medium truncate">
        <strong>Username:</strong> {trip.userInfo.email.split("@")[0]}
      </div>
      <div className="text-gray-700 font-medium truncate">
        <strong>Email:</strong> {trip.userInfo.email}
      </div>

      <div className="flex flex-col sm:flex-row sm:justify-between sm:items-center gap-3 mt-3">
        <motion.button
          className="bg-[#2E4A47] text-white px-5 py-2 rounded-lg flex items-center gap-2 w-full sm:w-auto hover:bg-[#1F3634] transition-colors duration-200"
          whileHover={{ scale: 1.05 }}
          whileTap={{ scale: 0.95 }}
          onClick={onClick}>
          <span className="text-lg">+</span> View Details
        </motion.button>

        <div className="flex items-center gap-3 overflow-hidden">
          <FaMoneyBillWave className="text-[#2E4A47] flex-shrink-0" />
          <span className="text-gray-700 font-medium truncate">
            Bid Status:{" "}
            {trip.bids.length > 0 ? `${trip.bids.length} Bids` : "No Bids Yet"}
          </span>
        </div>
      </div>
    </motion.div>
  );
}

export default TripCard;
