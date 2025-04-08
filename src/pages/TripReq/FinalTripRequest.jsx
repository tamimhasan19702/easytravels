/** @format */

import { useNavigate } from "react-router-dom";
import { useTripRequest } from "../../context/TripRequestContext";
import DashboardLayout from "@/components/DashboardLayout";

const FinalTripRequest = () => {
  const { trip, setTrip, saveToFirestore } = useTripRequest();
  const navigate = useNavigate();

  const handleFinalRequest = async () => {
    try {
      await saveToFirestore(trip);
      // Clear the trip context
      setTrip({
        userData: {
          user: trip.userData.user,
          role: trip.userData.role,
          tripDetails: {
            startDate: "",
            endDate: "",
            destinations: [],
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
              methods: [],
            },
            foodPreference: "No",
            foodPreferenceDetails: {
              preferences: [],
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
      alert("Trip request submitted successfully!");
      navigate("/dashboard");
    } catch (error) {
      console.error("Error submitting final request:", error);
      alert("Failed to submit final request. Please try again.");
    }
  };

  const { tripDetails } = trip.userData;

  // Helper to format additional options
  const formatAdditionalOptions = () => {
    return Object.entries(tripDetails.additionalOptions)
      .filter(([_, value]) => value)
      .map(([key]) => key.split("_")[1])
      .join(", ");
  };

  return (
    <DashboardLayout>
      <div className="min-h-screen bg-[#F5F6F5] p-6">
        <h1 className="text-4xl md:text-5xl font-bold text-[#2E4A47] mb-8">
          View My Plan
        </h1>

        <div className="bg-white p-6 rounded-lg shadow-md space-y-6">
          {/* Travel Type */}
          <div>
            <h2 className="text-lg font-semibold text-[#2E4A47] mb-2">
              Travel Type: {tripDetails.travelType || "Not set"}
            </h2>
            {tripDetails.travelType === "Group" && (
              <p className="text-gray-700">
                Male: {tripDetails.maleCount}, Female: {tripDetails.femaleCount}
                , Kids: {tripDetails.kidsCount}
              </p>
            )}
          </div>

          {/* Region/Country */}
          <div>
            <h2 className="text-lg font-semibold text-[#2E4A47] mb-2">
              Region/Country:{" "}
              {tripDetails.destinations.length > 0
                ? tripDetails.destinations.join(", ")
                : "Not set"}
            </h2>
          </div>

          {/* Places to Visit */}
          <div>
            <h2 className="text-lg font-semibold text-[#2E4A47] mb-2">
              Places to Visit
            </h2>
            {tripDetails.locations.length > 0 ? (
              <ul className="list-decimal list-inside text-gray-700">
                {tripDetails.locations.map((location, index) => (
                  <li key={index}>
                    Location {index + 1}: {location}
                  </li>
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

          {/* Accommodation Preference */}
          <div>
            <h2 className="text-lg font-semibold text-[#2E4A47] mb-2">
              Accommodation Preference: {tripDetails.accommodation}
            </h2>
            {tripDetails.accommodation === "Yes" && (
              <p className="text-gray-700">
                {tripDetails.accommodationDetails.type} (
                {tripDetails.accommodationDetails.starRating} star) - For{" "}
                {Math.ceil(
                  (new Date(tripDetails.endDate) -
                    new Date(tripDetails.startDate)) /
                    (1000 * 60 * 60 * 24)
                )}{" "}
                Days
              </p>
            )}
          </div>

          {/* Travel Plan */}
          <div>
            <h2 className="text-lg font-semibold text-[#2E4A47] mb-2">
              Travel Plan
            </h2>
            <p className="text-gray-700">
              <strong>Day 1 - Morning:</strong> Arrive at Changi Airport, check
              into the hotel in Marina Bay.
              <br />
              <strong>Day 1 - Afternoon:</strong> Visit Marina Bay Sands and the
              SkyPark Observation Deck. Evening, explore the Spectra light show.
              <br />
              <strong>Day 2 - Morning:</strong> Head to Little India, visit Sri
              Veeramakaliamman Temple. Afternoon, explore the Mustafa Centre for
              shopping and try Indian food at a local restaurant.
              <br />
              <strong>Day 2 - Evening:</strong> Night Safari at the Singapore
              Zoo. Return to central area.
              <br />
              <strong>Day 3 - Morning:</strong> Visit Kampong Glam, explore the
              Sultan Mosque. Afternoon, visit the Singapore River, starting from
              Clarke Quay.
              <br />
              <strong>Day 3 - Evening:</strong> Sentosa Island, including
              Universal Studios Singapore.
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
                : "No preferences specified"}
            </p>
          </div>

          {/* Activities & Interests */}
          <div>
            <h2 className="text-lg font-semibold text-[#2E4A47] mb-2">
              Activities & Interests
            </h2>
            <p className="text-gray-700">
              {tripDetails.interests || "None provided"}
            </p>
          </div>

          {/* Special Requests */}
          <div>
            <h2 className="text-lg font-semibold text-[#2E4A47] mb-2">
              Special Requests
            </h2>
            <p className="text-gray-700">
              {tripDetails.remarks || "None provided"}
            </p>
          </div>

          {/* Pick Up / Drop Off */}
          <div>
            <h2 className="text-lg font-semibold text-[#2E4A47] mb-2">
              Pick Up / Drop Off
            </h2>
            <p className="text-gray-700">
              {tripDetails.transportation === "Yes"
                ? `Pick Up: ${tripDetails.transportationDetails.type} at Changi Airport, Singapore. Drop Off: ${tripDetails.transportationDetails.type} at Narita Airport, Japan.`
                : "Not specified"}
            </p>
            {tripDetails.transportation === "Yes" &&
              tripDetails.transportationDetails.methods.length > 0 && (
                <p className="text-gray-700">
                  Additional Methods:{" "}
                  {tripDetails.transportationDetails.methods.join(", ")}
                </p>
              )}
          </div>

          {/* Contact Information */}
          <div>
            <h2 className="text-lg font-semibold text-[#2E4A47] mb-2">
              Contact Information
            </h2>
            <p className="text-gray-700">
              Email: {trip.userData.user?.email || "Not available"}
              <br />
              Phone Number: +65-65785432
            </p>
          </div>

          {/* Terms Checkbox */}
          <div className="flex items-center gap-2">
            <input
              type="checkbox"
              checked={tripDetails.termsAgreed}
              readOnly
              className="text-[#2E4A47] focus:ring-[#2E4A47]"
            />
            <label className="text-sm text-gray-700">
              Your travel request will only be visible to agency dashboard for
              24 hours. There is no refund in the moment you submit your travel
              plan.
            </label>
          </div>

          {/* Submit Button */}
          <button
            onClick={handleFinalRequest}
            className="w-full py-3 rounded-lg primary_btn font-semibold transition duration-300">
            Submit My Travel Plan
          </button>
        </div>
      </div>
    </DashboardLayout>
  );
};

export default FinalTripRequest;
