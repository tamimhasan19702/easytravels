/** @format */

import DashboardLayout from "@/components/DashboardLayout";
import { useNavigate } from "react-router-dom";
import { useTripRequest } from "@/context/TripRequestContext";
import illustration from "../../assets/images/undraw_vintage_q09n.svg";
import { FaArrowLeft } from "react-icons/fa";

const ViewDetails = () => {
  const navigate = useNavigate();
  const { trip } = useTripRequest();

  // Navigate back to MyTrips if no trip is selected
  if (!trip || !trip.userInfo) {
    navigate("/my-trips");
    return null;
  }

  const { tripDetails, userInfo, createdAt, deadline, status, bids } = trip;

  // Format dates and timestamps
  const formatDate = (date) => (date ? date : "Not set");
  const formatTimestamp = (timestamp) => {
    if (!timestamp) return "Not set";
    const date = timestamp.toDate ? timestamp.toDate() : new Date(timestamp);
    return date.toLocaleString();
  };

  // Format additional options
  const formatAdditionalOptions = () => {
    return Object.entries(tripDetails.additionalOptions)
      .filter(([_, value]) => value)
      .map(([key]) => key.split("_")[1])
      .join(", ");
  };

  // Calculate trip duration
  const tripDuration =
    tripDetails.startDate && tripDetails.endDate
      ? Math.ceil(
          (new Date(tripDetails.endDate) - new Date(tripDetails.startDate)) /
            (1000 * 60 * 60 * 24)
        )
      : 0;

  // Calculate total people
  const totalPeople =
    tripDetails.travelType === "Solo"
      ? 1
      : tripDetails.maleCount + tripDetails.femaleCount + tripDetails.kidsCount;

  return (
    <DashboardLayout>
      <div className="min-h-screen bg-[#F5F6F5] p-6">
        {/* Header Section */}
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-6">
          <div className="flex items-center gap-4">
            <button
              onClick={() => navigate("/my-trips")}
              className="text-[#2E4A47] hover:text-[#1F3634] transition-colors duration-200">
              <FaArrowLeft size={24} />
            </button>
            <h1 className="text-3xl md:text-5xl font-bold text-[#2E4A47]">
              Trip Details
            </h1>
          </div>
          <img
            src={illustration}
            alt="Travel Illustration"
            className="w-full max-w-xs md:w-1/3"
          />
        </div>

        {/* Trip Details Section */}
        <div className="mt-8 bg-white p-6 rounded-lg shadow-md space-y-6">
          {/* User Info */}
          <div>
            <h2 className="text-lg font-semibold text-[#2E4A47] mb-2">
              Contact Information
            </h2>
            <p className="text-gray-700">
              Email: {userInfo?.email || "Not available"} <br />
              Role: {userInfo?.role || "Traveler"}
            </p>
          </div>

          {/* Travel Dates and Time */}
          <div>
            <h2 className="text-lg font-semibold text-[#2E4A47] mb-2">
              Travel Dates and Time
            </h2>
            <p className="text-gray-700">
              Start Date: {formatDate(tripDetails.startDate)} <br />
              End Date: {formatDate(tripDetails.endDate)} <br />
              Preferred Time: {tripDetails.preferredTime || "Not set"}
            </p>
          </div>

          {/* Trip Duration */}
          <div>
            <h2 className="text-lg font-semibold text-[#2E4A47] mb-2">
              Trip Duration
            </h2>
            <p className="text-gray-700">
              {tripDuration} {tripDuration === 1 ? "day" : "days"}
            </p>
          </div>

          {/* Travel Type */}
          <div>
            <h2 className="text-lg font-semibold text-[#2E4A47] mb-2">
              Travel Type
            </h2>
            <p className="text-gray-700">
              {tripDetails.travelType || "Not set"}
              {tripDetails.travelType === "Group" && (
                <span>
                  {" - Male: " +
                    tripDetails.maleCount +
                    ", Female: " +
                    tripDetails.femaleCount +
                    ", Kids: " +
                    tripDetails.kidsCount}
                </span>
              )}
              {tripDetails.travelType === "Solo" && (
                <span> - {totalPeople} person</span>
              )}
            </p>
          </div>

          {/* Destinations */}
          <div>
            <h2 className="text-lg font-semibold text-[#2E4A47] mb-2">
              Destinations
            </h2>
            <p className="text-gray-700">
              {tripDetails.destinations.length > 0
                ? tripDetails.destinations.join(", ")
                : "Not set"}
            </p>
          </div>

          {/* Custom Locations */}
          <div>
            <h2 className="text-lg font-semibold text-[#2E4A47] mb-2">
              Places to Visit
            </h2>
            {tripDetails.locations.length > 0 ? (
              <ul className="list-disc list-inside text-gray-700">
                {tripDetails.locations.map((location, index) => (
                  <li key={index}>{location}</li>
                ))}
              </ul>
            ) : (
              <p className="text-gray-700">No custom locations added.</p>
            )}
            {formatAdditionalOptions() && (
              <p className="text-gray-700 mt-2">
                Additional Options: {formatAdditionalOptions()}
              </p>
            )}
          </div>

          {/* Accommodation */}
          <div>
            <h2 className="text-lg font-semibold text-[#2E4A47] mb-2">
              Accommodation
            </h2>
            <p className="text-gray-700">
              {tripDetails.accommodation === "Yes"
                ? `${tripDetails.accommodationDetails.type} (${tripDetails.accommodationDetails.starRating}) - ${tripDuration} days`
                : "Not required"}
            </p>
          </div>

          {/* Transportation */}
          <div>
            <h2 className="text-lg font-semibold text-[#2E4A47] mb-2">
              Transportation
            </h2>
            <p className="text-gray-700">
              {tripDetails.transportation === "Yes"
                ? `${tripDetails.transportationDetails.type}${
                    tripDetails.transportationDetails.methods.length > 0
                      ? " + " +
                        tripDetails.transportationDetails.methods.join(", ")
                      : ""
                  }`
                : "Not required"}
            </p>
          </div>

          {/* Food Preference */}
          <div>
            <h2 className="text-lg font-semibold text-[#2E4A47] mb-2">
              Food Preference
            </h2>
            <p className="text-gray-700">
              {tripDetails.foodPreference === "Yes" &&
              tripDetails.foodPreferenceDetails.preferences.length > 0
                ? tripDetails.foodPreferenceDetails.preferences.join(", ")
                : "No preferences"}
            </p>
          </div>

          {/* Interests */}
          <div>
            <h2 className="text-lg font-semibold text-[#2E4A47] mb-2">
              Interests & Activities
            </h2>
            <p className="text-gray-700">
              {tripDetails.interests || "None provided"}
            </p>
          </div>

          {/* Remarks */}
          <div>
            <h2 className="text-lg font-semibold text-[#2E4A47] mb-2">
              Special Requests
            </h2>
            <p className="text-gray-700">
              {tripDetails.remarks || "None provided"}
            </p>
          </div>

          {/* Created At and Deadline */}
          <div>
            <h2 className="text-lg font-semibold text-[#2E4A47] mb-2">
              Timeline
            </h2>
            <p className="text-gray-700">
              Created At: {formatTimestamp(createdAt)} <br />
              Bidding Deadline: {formatTimestamp(deadline)}
            </p>
          </div>

          {/* Status */}
          <div>
            <h2 className="text-lg font-semibold text-[#2E4A47] mb-2">
              Status
            </h2>
            <p className="text-gray-700 capitalize">{status || "Not set"}</p>
          </div>

          {/* Bids */}
          <div>
            <h2 className="text-lg font-semibold text-[#2E4A47] mb-2">Bids</h2>
            <p className="text-gray-700">
              {bids.length > 0 ? `${bids.length} bids received` : "No bids yet"}
            </p>
            {bids.length > 0 && (
              <ul className="list-disc list-inside text-gray-700 mt-2">
                {bids.map((bid, index) => (
                  <li key={index}>
                    Bid {index + 1}: Agent: {bid.agentEmail}, Amount:{" "}
                    {bid.bidAmount}, Message: {bid.message || "None"}
                  </li>
                ))}
              </ul>
            )}
          </div>

          {/* Terms */}
          <div className="flex items-center gap-2">
            <input
              type="checkbox"
              checked={tripDetails.termsAgreed}
              readOnly
              className="text-[#2E4A47] focus:ring-[#2E4A47]"
            />
            <label className="text-sm text-gray-700">
              I agree to the Terms & Conditions.
            </label>
          </div>
        </div>
      </div>
    </DashboardLayout>
  );
};

export default ViewDetails;
