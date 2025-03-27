/** @format */

import DashboardLayout from "@/components/DashboardLayout";
import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { useUser } from "../../context/UserContext";
import { useTripRequest } from "../../context/TripRequestContext";
import { db } from "../../../firebase.config";
import { collection, query, where, getDocs } from "firebase/firestore";
import tripRequest from "../../assets/images/trip.svg";

function TripRequest() {
  const { user } = useUser();
  const navigate = useNavigate();
  const [dbUser, setDbUser] = useState(null);
  const [error, setError] = useState(null);
  const [isLoading, setIsLoading] = useState(true);

  // Use the TripRequestContext
  const {
    trip,
    setTrip,
    locations,
    setLocations,
    accommodationType,
    setAccommodationType,
    transportationType,
    setTransportationType,
    foodPrefs,
    setFoodPrefs,
    handleAddLocation,
    updateLocation,
    handleSubmit,
  } = useTripRequest();

  useEffect(() => {
    const fetchUserData = async () => {
      if (!user || !user.email) {
        setError("User not authenticated or email not available.");
        setIsLoading(false);
        navigate("/");
        return;
      }

      try {
        setIsLoading(true);
        setError(null);

        const usersRef = collection(db, "users");
        const q = query(usersRef, where("email", "==", user.email));
        const querySnapshot = await getDocs(q);

        if (querySnapshot.empty) {
          setError("No user found with this email in the database.");
          setIsLoading(false);
          return;
        }

        const userData = querySnapshot.docs[0].data();
        setDbUser(userData);
        setIsLoading(false);
      } catch (err) {
        console.error("Error fetching user data from Firestore:", err);
        setError("Failed to fetch user data. Please try again later.");
        setIsLoading(false);
      }
    };

    fetchUserData();
  }, [user, navigate]);

  if (!user) {
    navigate("/");
    return null;
  }

  if (isLoading) {
    return <div>Loading...</div>;
  }

  if (error) {
    return <div className="text-red-500">{error}</div>;
  }

  // Helper function to update the trip state
  const updateTripField = (field, value) => {
    setTrip((prevTrip) => ({
      ...prevTrip,
      [field]: value,
    }));
  };

  return (
    <DashboardLayout>
      <div className="bg-[#F5F6F5] min-h-screen p-6">
        {/* Header Section */}
        <div className="flex flex-col md:flex-row md:items-center md:space-x-8">
          <div className="md:w-2/3">
            <h1 className="text-5xl font-bold text-[#2E4A47] mb-6">
              MAKE YOUR TRAVEL PLAN WITH US
            </h1>
          </div>
          <div className="md:w-1/3 flex justify-center md:justify-end">
            <img
              src={tripRequest}
              alt="Travel Illustration"
              className="w-full max-w-xs h-auto"
            />
          </div>
        </div>

        {/* Form Section */}
        <div className="mt-8 px-4">
          <form onSubmit={handleSubmit} className="space-y-6">
            {/* Start and End Date */}
            <div className="flex space-x-4">
              <div className="w-1/2">
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Start Date
                </label>
                <input
                  type="date"
                  value={trip.startDate}
                  onChange={(e) => updateTripField("startDate", e.target.value)}
                  className="w-full p-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#868D07]"
                />
              </div>
              <div className="w-1/2">
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  End Date
                </label>
                <input
                  type="date"
                  value={trip.endDate}
                  onChange={(e) => updateTripField("endDate", e.target.value)}
                  className="w-full p-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#868D07]"
                />
              </div>
            </div>

            {/* Travel Type */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Travel Type
              </label>
              <div className="flex space-x-4">
                <label className="flex items-center">
                  <input
                    type="radio"
                    name="travelType"
                    value="Solo"
                    checked={trip.travelType === "Solo"}
                    onChange={() => updateTripField("travelType", "Solo")}
                    className="mr-2 text-[#868D07] focus:ring-[#868D07]"
                  />
                  Solo
                </label>
                <label className="flex items-center">
                  <input
                    type="radio"
                    name="travelType"
                    value="Group"
                    checked={trip.travelType === "Group"}
                    onChange={() => updateTripField("travelType", "Group")}
                    className="mr-2 text-[#868D07] focus:ring-[#868D07]"
                  />
                  Group
                </label>
              </div>

              {trip.travelType === "Group" && (
                <div className="mt-2 flex space-x-4">
                  <div className="w-1/3 relative">
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      Male
                    </label>
                    <div className="flex items-center">
                      <button
                        onClick={() =>
                          updateTripField(
                            "maleCount",
                            Math.max(0, trip.maleCount - 1)
                          )
                        }
                        className="w-6 h-6 flex items-center justify-center border border-gray-300 rounded-full focus:outline-none focus:ring-2 focus:ring-[#868D07]">
                        <span className="material-icons text-[#868D07]">
                          remove
                        </span>
                      </button>
                      <input
                        type="number"
                        value={trip.maleCount}
                        onChange={(e) =>
                          updateTripField(
                            "maleCount",
                            parseInt(e.target.value) || 0
                          )
                        }
                        className="w-full p-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#868D07]"
                      />
                      <button
                        onClick={() =>
                          updateTripField("maleCount", trip.maleCount + 1)
                        }
                        className="w-6 h-6 flex items-center justify-center border border-gray-300 rounded-full focus:outline-none focus:ring-2 focus:ring-[#868D07]">
                        <span className="material-icons text-[#868D07]">
                          add
                        </span>
                      </button>
                    </div>
                  </div>
                  <div className="w-1/3 relative">
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      Female
                    </label>
                    <div className="flex items-center">
                      <button
                        onClick={() =>
                          updateTripField(
                            "femaleCount",
                            Math.max(0, trip.femaleCount - 1)
                          )
                        }
                        className="w-6 h-6 flex items-center justify-center border border-gray-300 rounded-full focus:outline-none focus:ring-2 focus:ring-[#868D07]">
                        <span className="material-icons text-[#868D07]">
                          remove
                        </span>
                      </button>
                      <input
                        type="number"
                        value={trip.femaleCount}
                        onChange={(e) =>
                          updateTripField(
                            "femaleCount",
                            parseInt(e.target.value) || 0
                          )
                        }
                        className="w-full p-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#868D07]"
                      />
                      <button
                        onClick={() =>
                          updateTripField("femaleCount", trip.femaleCount + 1)
                        }
                        className="w-6 h-6 flex items-center justify-center border border-gray-300 rounded-full focus:outline-none focus:ring-2 focus:ring-[#868D07]">
                        <span className="material-icons text-[#868D07]">
                          add
                        </span>
                      </button>
                    </div>
                  </div>
                  <div className="w-1/3 relative">
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      Children
                    </label>
                    <div className="flex items-center">
                      <button
                        onClick={() =>
                          updateTripField(
                            "kidsCount",
                            Math.max(0, trip.kidsCount - 1)
                          )
                        }
                        className="w-6 h-6 flex items-center justify-center border border-gray-300 rounded-full focus:outline-none focus:ring-2 focus:ring-[#868D07]">
                        <span className="material-icons text-[#868D07]">
                          remove
                        </span>
                      </button>
                      <input
                        type="number"
                        value={trip.kidsCount}
                        onChange={(e) =>
                          updateTripField(
                            "kidsCount",
                            parseInt(e.target.value) || 0
                          )
                        }
                        className="w-full p-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#868D07]"
                      />
                      <button
                        onClick={() =>
                          updateTripField("kidsCount", trip.kidsCount + 1)
                        }
                        className="w-6 h-6 flex items-center justify-center border border-gray-300 rounded-full focus:outline-none focus:ring-2 focus:ring-[#868D07]">
                        <span className="material-icons text-[#868D07]">
                          add
                        </span>
                      </button>
                    </div>
                  </div>
                </div>
              )}
            </div>

            {/* Destination */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Destination
              </label>
              <select
                value={trip.destination}
                onChange={(e) => updateTripField("destination", e.target.value)}
                className="w-full p-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#868D07]">
                <option value="">Select Your Desired Country</option>
                <option value="france">France</option>
                <option value="italy">Italy</option>
                <option value="japan">Japan</option>
                <option value="usa">USA</option>
                {/* Add more options as needed */}
              </select>
            </div>

            {/* Accommodation Preferences */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Want to handle the accommodation?
              </label>
              <div className="flex space-x-4">
                <label className="flex items-center">
                  <input
                    type="radio"
                    name="accommodation"
                    value="Yes"
                    checked={trip.accommodation === "Yes"}
                    onChange={() => updateTripField("accommodation", "Yes")}
                    className="mr-2 text-[#868D07] focus:ring-[#868D07]"
                  />
                  Yes
                </label>
                <label className="flex items-center">
                  <input
                    type="radio"
                    name="accommodation"
                    value="No"
                    checked={trip.accommodation === "No"}
                    onChange={() => updateTripField("accommodation", "No")}
                    className="mr-2 text-[#868D07] focus:ring-[#868D07]"
                  />
                  No
                </label>
              </div>
            </div>

            {/* Transportation Preferences */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Want to handle your transportation?
              </label>
              <div className="flex space-x-4">
                <label className="flex items-center">
                  <input
                    type="radio"
                    name="transportation"
                    value="Yes"
                    checked={trip.transportation === "Yes"}
                    onChange={() => updateTripField("transportation", "Yes")}
                    className="mr-2 text-[#868D07] focus:ring-[#868D07]"
                  />
                  Yes
                </label>
                <label className="flex items-center">
                  <input
                    type="radio"
                    name="transportation"
                    value="No"
                    checked={trip.transportation === "No"}
                    onChange={() => updateTripField("transportation", "No")}
                    className="mr-2 text-[#868D07] focus:ring-[#868D07]"
                  />
                  No
                </label>
              </div>
            </div>

            {/* Food Preferences */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                What’s your food preference?
              </label>
              <div className="flex space-x-4">
                <label className="flex items-center">
                  <input
                    type="radio"
                    name="foodPreference"
                    value="Yes"
                    checked={trip.foodPreference === "Yes"}
                    onChange={() => updateTripField("foodPreference", "Yes")}
                    className="mr-2 text-[#868D07] focus:ring-[#868D07]"
                  />
                  Yes
                </label>
                <label className="flex items-center">
                  <input
                    type="radio"
                    name="foodPreference"
                    value="No"
                    checked={trip.foodPreference === "No"}
                    onChange={() => updateTripField("foodPreference", "No")}
                    className="mr-2 text-[#868D07] focus:ring-[#868D07]"
                  />
                  No
                </label>
              </div>
            </div>

            {/* Interests & Activities */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Share your Interests & Activities
              </label>
              <textarea
                value={trip.interests}
                onChange={(e) => updateTripField("interests", e.target.value)}
                placeholder="What activities do you enjoy?"
                className="w-full p-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#868D07]"
                rows="3"
              />
            </div>

            {/* Remarks/Request */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Remarks/Request
              </label>
              <textarea
                value={trip.remarks}
                onChange={(e) => updateTripField("remarks", e.target.value)}
                placeholder="Do you have any special request in mind?"
                className="w-full p-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#868D07]"
                rows="3"
              />
            </div>

            {/* Terms and Conditions */}
            <div className="flex items-center">
              <input
                type="checkbox"
                checked={trip.termsAgreed}
                onChange={(e) =>
                  updateTripField("termsAgreed", e.target.checked)
                }
                className="mr-2 text-[#868D07] focus:ring-[#868D07]"
              />
              <label className="text-sm text-gray-700">
                By Continuing this, you agree with the{" "}
                <a href="#" className="text-[#868D07] underline">
                  Terms & Conditions
                </a>
              </label>
            </div>
            <button className="w-[250px] primary_btn !py-3 rounded-md flex items-center justify-center">
              Plan your Trip with us
            </button>
          </form>
        </div>
      </div>
    </DashboardLayout>
  );
}

export default TripRequest;
