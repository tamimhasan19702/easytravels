/** @format */

import React from "react";
import { FaMapMarkerAlt, FaCalendarAlt, FaUser } from "react-icons/fa";

const TripCard = ({ trip, onClick }) => {
  return (
    <div
      className="bg-white p-5 rounded-xl shadow-md hover:shadow-lg transition-shadow duration-200 cursor-pointer"
      onClick={onClick}>
      {/* Destination & Date */}
      <div className="flex items-center justify-between mb-3">
        <h2 className="text-xl font-semibold text-[#2E4A47]">
          {trip?.location || "Unknown Destination"}
        </h2>
        <span className="text-sm text-gray-500 flex items-center gap-1">
          <FaCalendarAlt />
          {trip?.date || "N/A"}
        </span>
      </div>

      {/* Traveler Info */}
      <div className="flex items-center gap-2 text-gray-700 mb-2">
        <FaUser className="text-[#FFB547]" />
        <p className="text-sm">
          {trip?.userInfo?.fullName || "Traveler"} &mdash;{" "}
          {trip?.userInfo?.email || "N/A"}
        </p>
      </div>

      {/* Additional Details */}
      <div className="text-sm text-gray-600 mt-3">
        <p>
          <strong>Purpose:</strong> {trip?.purpose || "Not specified"}
        </p>
        <p>
          <strong>Duration:</strong> {trip?.duration || "Unknown"}
        </p>
        <p>
          <strong>Travel Type:</strong> {trip?.type || "N/A"}
        </p>
      </div>

      {/* Marker Icon + City */}
      <div className="mt-4 flex items-center gap-2 text-[#2E4A47] font-medium">
        <FaMapMarkerAlt />
        <span>{trip?.city || "City not specified"}</span>
      </div>
    </div>
  );
};

export default TripCard;
