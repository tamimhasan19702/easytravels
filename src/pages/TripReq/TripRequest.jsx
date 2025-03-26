/** @format */

import DashboardLayout from "@/components/DashboardLayout";
import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { useUser } from "../../context/UserContext";
import { useTripRequest } from "../../context/TripRequestContext"; // Import the custom hook
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
    startDate,
    setStartDate,
    endDate,
    setEndDate,
    travelType,
    setTravelType,
    maleCount,
    setMaleCount,
    femaleCount,
    setFemaleCount,
    kidsCount,
    setKidsCount,
    destination,
    setDestination,
    accommodation,
    setAccommodation,
    transportation,
    setTransportation,
    foodPreference,
    setFoodPreference,
    interests,
    setInterests,
    remarks,
    setRemarks,
    termsAgreed,
    setTermsAgreed,
    locations,
    updateLocation,
    accommodationType,
    setAccommodationType,
    transportationType,
    setTransportationType,
    foodPrefs,
    setFoodPrefs,
    handleAddLocation,
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

  return (
    <DashboardLayout>
      <div className="bg-[#F5F6F5] min-h-screen p-6">
        {/* Header Section */}
        <div className="flex flex-col md:flex-row md:items-center md:space-x-8">
          <div className="md:w-2/3">
            <h1 className="text-4xl font-bold text-[#2E4A47] mb-6">
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

        {/* Main Content Section */}
        <div className="flex flex-col md:flex-row md:space-x-8 mt-6">
          {/* Left Side: Form */}
          <div className="md:w-2/3 bg-white p-6 rounded-lg shadow-md">
            <form onSubmit={handleSubmit}>
              {/* Start and End Date */}
              <div className="flex space-x-4 mb-6">
                <div className="w-1/2">
                  <label className="block text-[#2E4A47] font-medium mb-2">
                    Start Date
                  </label>
                  <input
                    type="date"
                    value={startDate}
                    onChange={(e) => setStartDate(e.target.value)}
                    className="w-full p-2 border rounded-md"
                    required
                  />
                </div>
                <div className="w-1/2">
                  <label className="block text-[#2E4A47] font-medium mb-2">
                    End Date
                  </label>
                  <input
                    type="date"
                    value={endDate}
                    onChange={(e) => setEndDate(e.target.value)}
                    className="w-full p-2 border rounded-md"
                    required
                  />
                </div>
              </div>

              {/* Travel Type */}
              <div className="mb-6">
                <label className="block text-[#2E4A47] font-medium mb-2">
                  Travel Type
                </label>
                <div className="flex space-x-4">
                  <label className="flex items-center">
                    <input
                      type="radio"
                      value="Solo"
                      checked={travelType === "Solo"}
                      onChange={(e) => setTravelType(e.target.value)}
                      className="mr-2"
                    />
                    Solo
                  </label>
                  <label className="flex items-center">
                    <input
                      type="radio"
                      value="Group"
                      checked={travelType === "Group"}
                      onChange={(e) => setTravelType(e.target.value)}
                      className="mr-2"
                    />
                    Group
                  </label>
                </div>
                {travelType === "Group" && (
                  <div className="mt-4 flex space-x-4">
                    <div>
                      <label className="block text-[#2E4A47] font-medium">
                        Male
                      </label>
                      <div className="flex items-center space-x-2">
                        <button
                          type="button"
                          onClick={() => setMaleCount(maleCount + 1)}
                          className="p-1 bg-[#9DAE11] text-white rounded">
                          +
                        </button>
                        <span>{maleCount}</span>
                        <button
                          type="button"
                          onClick={() =>
                            setMaleCount(maleCount > 0 ? maleCount - 1 : 0)
                          }
                          className="p-1 bg-[#9DAE11] text-white rounded">
                          -
                        </button>
                      </div>
                    </div>
                    <div>
                      <label className="block text-[#2E4A47] font-medium">
                        Female
                      </label>
                      <div className="flex items-center space-x-2">
                        <button
                          type="button"
                          onClick={() => setFemaleCount(femaleCount + 1)}
                          className="p-1 bg-[#9DAE11] text-white rounded">
                          +
                        </button>
                        <span>{femaleCount}</span>
                        <button
                          type="button"
                          onClick={() =>
                            setFemaleCount(
                              femaleCount > 0 ? femaleCount - 1 : 0
                            )
                          }
                          className="p-1 bg-[#9DAE11] text-white rounded">
                          -
                        </button>
                      </div>
                    </div>
                    <div>
                      <label className="block text-[#2E4A47] font-medium">
                        Kids
                      </label>
                      <div className="flex items-center space-x-2">
                        <button
                          type="button"
                          onClick={() => setKidsCount(kidsCount + 1)}
                          className="p-1 bg-[#9DAE11] text-white rounded">
                          +
                        </button>
                        <span>{kidsCount}</span>
                        <button
                          type="button"
                          onClick={() =>
                            setKidsCount(kidsCount > 0 ? kidsCount - 1 : 0)
                          }
                          className="p-1 bg-[#9DAE11] text-white rounded">
                          -
                        </button>
                      </div>
                    </div>
                  </div>
                )}
              </div>

              {/* Destination */}
              <div className="mb-6">
                <label className="block text-[#2E4A47] font-medium mb-2">
                  Destination
                </label>
                <select
                  value={destination}
                  onChange={(e) => setDestination(e.target.value)}
                  className="w-full p-2 border rounded-md"
                  required>
                  <option value="">Select Country</option>
                  <option value="Dhaka">Dhaka</option>
                  <option value="Fandpur">Fandpur</option>
                  <option value="Jasmin Uddin er bari">
                    Jasmin Uddin er bari
                  </option>
                  <option value="Others">Others</option>
                </select>
              </div>

              {/* Accommodation Preferences */}
              <div className="mb-6">
                <label className="block text-[#2E4A47] font-medium mb-2">
                  Want us to handle your accommodation?
                </label>
                <div className="flex space-x-4">
                  <label className="flex items-center">
                    <input
                      type="radio"
                      value="Yes"
                      checked={accommodation === "Yes"}
                      onChange={(e) => setAccommodation(e.target.value)}
                      className="mr-2"
                    />
                    Yes
                  </label>
                  <label className="flex items-center">
                    <input
                      type="radio"
                      value="No"
                      checked={accommodation === "No"}
                      onChange={(e) => setAccommodation(e.target.value)}
                      className="mr-2"
                    />
                    No
                  </label>
                </div>
              </div>

              {/* Transportation Preferences */}
              <div className="mb-6">
                <label className="block text-[#2E4A47] font-medium mb-2">
                  Want us to handle your transportation?
                </label>
                <div className="flex space-x-4">
                  <label className="flex items-center">
                    <input
                      type="radio"
                      value="Yes"
                      checked={transportation === "Yes"}
                      onChange={(e) => setTransportation(e.target.value)}
                      className="mr-2"
                    />
                    Yes
                  </label>
                  <label className="flex items-center">
                    <input
                      type="radio"
                      value="No"
                      checked={transportation === "No"}
                      onChange={(e) => setTransportation(e.target.value)}
                      className="mr-2"
                    />
                    No
                  </label>
                </div>
              </div>

              {/* Food Preferences */}
              <div className="mb-6">
                <label className="block text-[#2E4A47] font-medium mb-2">
                  Want us to handle your food preference?
                </label>
                <div className="flex space-x-4">
                  <label className="flex items-center">
                    <input
                      type="radio"
                      value="Yes"
                      checked={foodPreference === "Yes"}
                      onChange={(e) => setFoodPreference(e.target.value)}
                      className="mr-2"
                    />
                    Yes
                  </label>
                  <label className="flex items-center">
                    <input
                      type="radio"
                      value="No"
                      checked={foodPreference === "No"}
                      onChange={(e) => setFoodPreference(e.target.value)}
                      className="mr-2"
                    />
                    No
                  </label>
                </div>
              </div>

              {/* Share your Interests & Activities */}
              <div className="mb-6">
                <label className="block text-[#2E4A47] font-medium mb-2">
                  Share your Interests & Activities
                </label>
                <textarea
                  value={interests}
                  onChange={(e) => setInterests(e.target.value)}
                  className="w-full p-2 border rounded-md"
                  rows="4"
                  placeholder="What activities do you enjoy?"
                />
              </div>

              {/* Remarks/Request */}
              <div className="mb-6">
                <label className="block text-[#2E4A47] font-medium mb-2">
                  Remarks/Request
                </label>
                <textarea
                  value={remarks}
                  onChange={(e) => setRemarks(e.target.value)}
                  className="w-full p-2 border rounded-md"
                  rows="4"
                  placeholder="Do you have any special request or notes?"
                />
              </div>

              {/* Terms Agreement */}
              <div className="mb-6">
                <label className="flex items-center">
                  <input
                    type="checkbox"
                    checked={termsAgreed}
                    onChange={(e) => setTermsAgreed(e.target.checked)}
                    className="mr-2"
                  />
                  <span className="text-[#2E4A47]">
                    By continuing this, you agree with the Terms & Conditions.
                  </span>
                </label>
              </div>

              {/* Submit Button */}
              <button
                type="submit"
                className="bg-[#9DAE11] text-white py-2 px-4 rounded-md font-medium hover:bg-[#8C9A0F] transition-colors">
                CREATE YOUR TRAVEL PLAN
              </button>
            </form>
          </div>

          {/* Right Side: Sidebar */}
          <div className="md:w-1/3 space-y-6">
            {/* Destination */}
            <div className="bg-white p-4 rounded-lg shadow-md">
              <h3 className="text-[#2E4A47] font-medium mb-2">Destination</h3>
              {locations.map((location, index) => (
                <div key={index} className="mb-2">
                  <input
                    type="text"
                    value={location}
                    onChange={(e) => updateLocation(index, e.target.value)}
                    className="w-full p-2 border rounded-md"
                    placeholder="Enter destination"
                  />
                </div>
              ))}
              <button
                onClick={handleAddLocation}
                className="text-[#9DAE11] text-sm">
                Add your custom location
              </button>
              <button
                type="button"
                className="w-full bg-[#9DAE11] text-white py-2 rounded-md mt-2">
                SUBMIT
              </button>
            </div>

            {/* Choose your accommodation */}
            <div className="bg-white p-4 rounded-lg shadow-md">
              <h3 className="text-[#2E4A47] font-medium mb-2">
                Choose your accommodation
              </h3>
              <select
                value={accommodationType}
                onChange={(e) => setAccommodationType(e.target.value)}
                className="w-full p-2 border rounded-md mb-2">
                <option value="Hotel">Hotel</option>
                <option value="5 Star">5 Star</option>
              </select>
              <button
                type="button"
                className="w-full bg-[#9DAE11] text-white py-2 rounded-md">
                SUBMIT
              </button>
            </div>

            {/* Choose your transportation */}
            <div className="bg-white p-4 rounded-lg shadow-md">
              <h3 className="text-[#2E4A47] font-medium mb-2">
                Choose your transportation
              </h3>
              <select
                value={transportationType}
                onChange={(e) => setTransportationType(e.target.value)}
                className="w-full p-2 border rounded-md mb-2">
                <option value="Car">Car</option>
                <option value="Bus">Bus</option>
              </select>
              <button
                type="button"
                className="text-[#9DAE11] text-sm mb-2 block">
                Add a new method
              </button>
              <button
                type="button"
                className="w-full bg-[#9DAE11] text-white py-2 rounded-md">
                SUBMIT
              </button>
            </div>

            {/* Your Food Preferences */}
            <div className="bg-white p-4 rounded-lg shadow-md">
              <h3 className="text-[#2E4A47] font-medium mb-2">
                Your Food Preferences
              </h3>
              <input
                type="text"
                value={foodPrefs}
                onChange={(e) => setFoodPrefs(e.target.value)}
                className="w-full p-2 border rounded-md mb-2"
                placeholder="E.g., Halal Food, Vegetarian, Meat"
              />
              <button
                type="button"
                className="w-full bg-[#9DAE11] text-white py-2 rounded-md">
                SUBMIT
              </button>
            </div>
          </div>
        </div>
      </div>
    </DashboardLayout>
  );
}

export default TripRequest;
