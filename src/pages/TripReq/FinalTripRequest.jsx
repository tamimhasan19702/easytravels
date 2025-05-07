/** @format */

import { useNavigate } from "react-router-dom";
import { useTripRequest } from "../../context/TripRequestContext";
import DashboardLayout from "@/components/DashboardLayout";
import { useUser } from "@/context/UserContext";
import { useState } from "react";
import Modal from "react-modal";
import Lottie from "lottie-react";
import tickmark from "../../assets/tickmark.json";

// Bind modal to your appElement for accessibility
Modal.setAppElement("#root");

const FinalTripRequest = () => {
  const { trip, setTrip, saveToFirestore } = useTripRequest();
  const navigate = useNavigate();
  const { user } = useUser();
  const [isModalOpen, setIsModalOpen] = useState(false);

  const handleFinalRequest = async () => {
    try {
      const tripToSave = {
        ...trip,
        userInfo: {
          email: user.email,
          uid: user.uid,
          role: user.role || "traveler",
        },
      };

      await saveToFirestore(tripToSave);

      setTrip({
        userInfo: {
          email: user.email,
          uid: user.uid,
          role: user.role || "traveler",
        },
        tripDetails: {
          startDate: "",
          endDate: "",
          preferredTime: "", // Reset preferredTime
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
        deadline: null, // Reset deadline
        status: "pending",
        bids: [],
      });

      setIsModalOpen(true);

      setTimeout(() => {
        setIsModalOpen(false);
        navigate("/dashboard");
      }, 3000);
    } catch (error) {
      console.error("Error submitting final request:", error);
      alert("Failed to submit trip request. Please try again.");
    }
  };

  const closeModal = () => {
    setIsModalOpen(false);
    navigate("/dashboard");
  };

  const { tripDetails } = trip;

  // Format additional options
  const formatAdditionalOptions = () => {
    return (
      Object.entries(tripDetails.additionalOptions)
        // eslint-disable-next-line
        .filter(([_, value]) => value)
        .map(([key]) => key.split("_")[1])
        .join(", ")
    );
  };

  // Calculate trip duration
  const tripDuration =
    tripDetails.startDate && tripDetails.endDate
      ? Math.ceil(
          (new Date(tripDetails.endDate) - new Date(tripDetails.startDate)) /
            (1000 * 60 * 60 * 24)
        )
      : 0;

  // Format deadline for display (if it exists)
  const formatDeadline = (deadline) => {
    if (!deadline) return "Not set";
    const date = deadline.toDate ? deadline.toDate() : new Date(deadline);
    return date.toLocaleString();
  };

  return (
    <DashboardLayout>
      <div className="min-h-screen bg-[#F5F6F5] p-6">
        <h1 className="text-4xl md:text-5xl font-bold text-[#2E4A47] mb-8">
          Review Your Travel Plan
        </h1>

        <div className="bg-white p-6 rounded-lg shadow-md space-y-6">
          {/* User Info */}
          <div>
            <h2 className="text-[20px] font-semibold text-[#2E4A47] mb-2">
              Contact Information
            </h2>
            <p className="text-gray-700">
              Email: {trip.userInfo?.email || "Not available"} <br />
              Role: {trip.userInfo?.role || "Traveler"}
            </p>
          </div>

          {/* Travel Dates and Time */}
          <div>
            <h2 className="text-[20px] font-semibold text-[#2E4A47] mb-2">
              Travel Dates and Time
            </h2>
            <p className="text-gray-700">
              Start Date: {tripDetails.startDate || "Not set"} <br />
              End Date: {tripDetails.endDate || "Not set"} <br />
              Preferred Time: {tripDetails.preferredTime || "Not set"}
            </p>
          </div>

          {/* Deadline */}
          <div>
            <h2 className="text-[20px] font-semibold text-[#2E4A47] mb-2">
              Bidding Deadline
            </h2>
            <p className="text-gray-700">{formatDeadline(trip.deadline)}</p>
          </div>

          {/* Travel Type */}
          <div>
            <h2 className="text-[20px] font-semibold text-[#2E4A47] mb-2">
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
            </p>
          </div>

          {/* Destinations */}
          <div>
            <h2 className="text-[20px] font-semibold text-[#2E4A47] mb-2">
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
            <h2 className="text-[20px] font-semibold text-[#2E4A47] mb-2">
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
            <h2 className="text-[20px] font-semibold text-[#2E4A47] mb-2">
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
            <h2 className="text-[20px] font-semibold text-[#2E4A47] mb-2">
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
            <h2 className="text-[20px] font-semibold text-[#2E4A47] mb-2">
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
            <h2 className="text-[20px] font-semibold text-[#2E4A47] mb-2">
              Interests & Activities
            </h2>
            <p className="text-gray-700">
              {tripDetails.interests || "None provided"}
            </p>
          </div>

          {/* Remarks */}
          <div>
            <h2 className="text-[20px] font-semibold text-[#2E4A47] mb-2">
              Special Requests
            </h2>
            <p className="text-gray-700">
              {tripDetails.remarks || "None provided"}
            </p>
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
              Your travel request will be visible to agencies for 24 hours. No
              refunds after submission.
            </label>
          </div>

          {/* Submit Button */}
          <button
            onClick={handleFinalRequest}
            className="w-full py-3 primary_btn rounded-lg bg-[#2E4A47] text-white font-semibold hover:bg-[#1F3634] transition duration-300">
            SUBMIT MY TRAVEL PLAN
          </button>
        </div>

        {/* Success Modal */}
        <Modal
          isOpen={isModalOpen}
          onRequestClose={closeModal}
          style={{
            content: {
              top: "50%",
              left: "50%",
              right: "auto",
              bottom: "auto",
              marginRight: "-50%",
              transform: "translate(-50%, -50%)",
              padding: "20px",
              borderRadius: "8px",
              backgroundColor: "#fff",
              boxShadow: "0 4px 6px rgba(0, 0, 0, 0.1)",
              textAlign: "center",
              maxWidth: "400px",
              width: "90%",
            },
            overlay: {
              backgroundColor: "rgba(0, 0, 0, 0.5)",
              zIndex: 1000,
            },
          }}>
          <div className="w-16 h-16 mx-auto mb-4">
            <Lottie animationData={tickmark} loop={false} />
          </div>
          <h2 className="text-2xl font-bold text-[#2E4A47] mb-2">Success!</h2>
          <p className="text-gray-700 mb-4">
            Your trip request has been submitted successfully! Please wait for
            some time to receive bid requests from agencies.
          </p>
          <p className="text-sm text-gray-500">Redirecting to dashboard...</p>
        </Modal>
      </div>
    </DashboardLayout>
  );
};

export default FinalTripRequest;
