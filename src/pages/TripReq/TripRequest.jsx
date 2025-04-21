/** @format */

import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { useUser } from "../../context/UserContext";
import { useTripRequest } from "../../context/TripRequestContext";
import { db } from "../../../firebase.config";
import { collection, query, where, getDocs } from "firebase/firestore";
import tripRequestImg from "../../assets/images/trip.svg";
import DashboardLayout from "@/components/DashboardLayout";
import Preloader from "@/components/Preloader";
import {
  SelectField,
  TextAreaField,
  RadioGroup,
  DestinationModal,
  DateRangePicker,
  GroupTravelFields,
} from "@/components/dashcomponents/DashTripRequest";

const TripRequest = () => {
  const { user } = useUser();
  const navigate = useNavigate();
  const { trip, setTrip, handleSubmit } = useTripRequest();
  const [dbUser, setDbUser] = useState(null);
  const [error, setError] = useState(null);
  const [isLoading, setIsLoading] = useState(true);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [tempDestinations, setTempDestinations] = useState([]);
  const [customLocations, setCustomLocations] = useState([""]);
  const [additionalOptions, setAdditionalOptions] = useState({});
  const [transportationMethods, setTransportationMethods] = useState([""]);
  const [foodPreferences, setFoodPreferences] = useState([""]);

  // Fetch user data from Firestore and sync with context
  useEffect(() => {
    const fetchUserData = async () => {
      if (!user?.email) {
        setError("User not authenticated.");
        setIsLoading(false);
        navigate("/");
        return;
      }

      try {
        setIsLoading(true);
        const usersRef = collection(db, "users");
        const q = query(usersRef, where("email", "==", user.email));
        const querySnapshot = await getDocs(q);

        if (querySnapshot.empty) {
          setError("No user found with this email.");
          setIsLoading(false);
          return;
        }

        const userData = querySnapshot.docs[0].data();
        setDbUser(userData);
        setTrip((prev) => ({
          ...prev,
          userInfo: {
            email: user.email,
            uid: user.uid,
            role: userData.role || "traveler",
          },
        }));
      } catch (err) {
        console.error("Error fetching user data:", err);
        setError("Failed to fetch user data.");
      } finally {
        setIsLoading(false);
      }
    };

    fetchUserData();
  }, [user, navigate, setTrip]);

  // Update trip field helper
  const updateTripField = (field, value) => {
    setTrip((prev) => ({
      ...prev,
      tripDetails: { ...prev.tripDetails, [field]: value },
    }));
  };

  // Custom location handlers
  const handleAddCustomLocation = () =>
    setCustomLocations([...customLocations, ""]);
  const handleCustomLocationChange = (index, value) => {
    const updated = [...customLocations];
    updated[index] = value;
    setCustomLocations(updated);
  };
  const handleDeleteCustomLocation = (index) => {
    if (customLocations.length > 1) {
      setCustomLocations(customLocations.filter((_, i) => i !== index));
    }
  };

  // Transportation handlers
  const handleAddTransportation = () =>
    setTransportationMethods([...transportationMethods, ""]);
  const handleTransportationChange = (index, value) => {
    const updated = [...transportationMethods];
    updated[index] = value;
    setTransportationMethods(updated);
    updateTripField("transportationDetails", {
      ...trip.tripDetails.transportationDetails,
      methods: updated,
    });
  };
  const handleDeleteTransportation = (index) => {
    if (transportationMethods.length > 1) {
      const updated = transportationMethods.filter((_, i) => i !== index);
      setTransportationMethods(updated);
      updateTripField("transportationDetails", {
        ...trip.tripDetails.transportationDetails,
        methods: updated,
      });
    }
  };

  // Food preference handlers
  const handleAddFoodPreference = () =>
    setFoodPreferences([...foodPreferences, ""]);
  const handleFoodPreferenceChange = (index, value) => {
    const updated = [...foodPreferences];
    updated[index] = value;
    setFoodPreferences(updated);
    updateTripField("foodPreferenceDetails", { preferences: updated });
  };
  const handleDeleteFoodPreference = (index) => {
    if (foodPreferences.length > 1) {
      const updated = foodPreferences.filter((_, i) => i !== index);
      setFoodPreferences(updated);
      updateTripField("foodPreferenceDetails", { preferences: updated });
    }
  };

  // Modal handlers
  const handleSelectDestinations = () => setIsModalOpen(true);
  const handleModalClose = () => {
    updateTripField("destinations", tempDestinations);
    updateTripField("additionalOptions", additionalOptions);
    updateTripField(
      "locations",
      customLocations.filter((loc) => loc !== "")
    );
    setIsModalOpen(false);
  };

  // Handle form submission with delay and redirect
  const onSubmit = (e) => {
    handleSubmit(e, async () => {
      setIsSubmitting(true);
      await new Promise((resolve) => setTimeout(resolve, 1000));
      setIsSubmitting(false);
      navigate("/final-tripreq");
    });
  };

  // Render states
  if (isLoading) return <Preloader />;
  if (error)
    return <div className="text-red-500 text-center py-10">{error}</div>;
  if (!user) {
    navigate("/");
    return null;
  }

  if (isSubmitting) return <Preloader />;

  return (
    <DashboardLayout>
      <div className="min-h-screen bg-[#F5F6F5] p-6">
        <div className="flex flex-col md:flex-row md:items-center gap-8">
          <h1 className="text-4xl md:text-5xl font-bold text-[#2E4A47] md:w-2/3">
            MAKE YOUR TRAVEL PLAN WITH US
          </h1>
          <img
            src={tripRequestImg}
            alt="Travel Illustration"
            className="w-full max-w-xs mx-auto md:w-1/3"
          />
        </div>

        <form onSubmit={onSubmit} className="mt-8 space-y-6 w-full">
          <DateRangePicker
            startDate={trip.tripDetails.startDate}
            endDate={trip.tripDetails.endDate}
            updateTripField={updateTripField}
          />

          {/* New Time Field */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Preferred Time
            </label>
            <input
              type="time"
              value={trip.tripDetails.preferredTime}
              onChange={(e) => updateTripField("preferredTime", e.target.value)}
              className="w-full p-3 border rounded-lg focus:ring-2 focus:ring-[#2E4A47] bg-[#F5F6F5]"
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Destinations
            </label>
            <button
              type="button"
              onClick={handleSelectDestinations}
              className="w-full p-3 border rounded-lg bg-[#F5F6F5] text-left text-gray-700">
              {tempDestinations.length > 0
                ? tempDestinations.join(", ")
                : "Select Destinations"}
            </button>
          </div>

          <RadioGroup
            label="Travel Type"
            name="travelType"
            value={trip.tripDetails.travelType}
            onChange={(value) => updateTripField("travelType", value)}
            options={["Solo", "Group"]}
          />

          {trip.tripDetails.travelType === "Group" && (
            <GroupTravelFields
              trip={trip.tripDetails}
              updateTripField={updateTripField}
            />
          )}

          <RadioGroup
            label="Handle Accommodation?"
            name="accommodation"
            value={trip.tripDetails.accommodation}
            onChange={(value) => updateTripField("accommodation", value)}
            options={["Yes", "No"]}
          />

          {trip.tripDetails.accommodation === "Yes" && (
            <div className="border rounded-lg p-4 bg-white shadow-md">
              <h3 className="text-lg font-semibold text-[#2E4A47] mb-4">
                Choose Accommodation
              </h3>
              <SelectField
                label="Accommodation Type"
                value={trip.tripDetails.accommodationDetails.type}
                onChange={(e) =>
                  updateTripField("accommodationDetails", {
                    ...trip.tripDetails.accommodationDetails,
                    type: e.target.value,
                  })
                }
                options={[
                  { value: "Hotel", label: "Hotel" },
                  { value: "Apartment", label: "Apartment" },
                  { value: "Hostel", label: "Hostel" },
                  { value: "Resort", label: "Resort" },
                ]}
              />
              <SelectField
                label="Star Rating"
                value={trip.tripDetails.accommodationDetails.starRating}
                onChange={(e) =>
                  updateTripField("accommodationDetails", {
                    ...trip.tripDetails.accommodationDetails,
                    starRating: e.target.value,
                  })
                }
                options={[
                  { value: "5 Star", label: "5 Star" },
                  { value: "4 Star", label: "4 Star" },
                  { value: "3 Star", label: "3 Star" },
                  { value: "2 Star", label: "2 Star" },
                  { value: "1 Star", label: "1 Star" },
                ]}
              />
            </div>
          )}

          <RadioGroup
            label="Handle Transportation?"
            name="transportation"
            value={trip.tripDetails.transportation}
            onChange={(value) => updateTripField("transportation", value)}
            options={["Yes", "No"]}
          />

          {trip.tripDetails.transportation === "Yes" && (
            <div className="border rounded-lg p-4 bg-white shadow-md">
              <h3 className="text-lg font-semibold text-[#2E4A47] mb-4">
                Choose Transportation
              </h3>
              <SelectField
                label="Primary Transportation Type"
                value={trip.tripDetails.transportationDetails.type}
                onChange={(e) =>
                  updateTripField("transportationDetails", {
                    ...trip.tripDetails.transportationDetails,
                    type: e.target.value,
                  })
                }
                options={[
                  { value: "Car", label: "Car" },
                  { value: "Bus", label: "Bus" },
                  { value: "Train", label: "Train" },
                  { value: "Plane", label: "Plane" },
                ]}
              />
              {transportationMethods.map((method, index) => (
                <div key={index} className="mt-2 flex items-center gap-2">
                  <input
                    type="text"
                    value={method}
                    onChange={(e) =>
                      handleTransportationChange(index, e.target.value)
                    }
                    placeholder={`Additional Method ${index + 1}`}
                    className="w-full p-3 border rounded-lg focus:ring-2 focus:ring-[#2E4A47] bg-[#F5F6F5]"
                  />
                  {transportationMethods.length > 1 && (
                    <button
                      type="button"
                      onClick={() => handleDeleteTransportation(index)}
                      className="text-red-500 hover:text-red-700">
                      Delete
                    </button>
                  )}
                </div>
              ))}
              <button
                type="button"
                onClick={handleAddTransportation}
                className="mt-2 text-[#2E4A47] hover:underline">
                + Add Another Method
              </button>
            </div>
          )}

          <RadioGroup
            label="Food Preference?"
            name="foodPreference"
            value={trip.tripDetails.foodPreference}
            onChange={(value) => updateTripField("foodPreference", value)}
            options={["Yes", "No"]}
          />

          {trip.tripDetails.foodPreference === "Yes" && (
            <div className="border rounded-lg p-4 bg-white shadow-md">
              <h3 className="text-lg font-semibold text-[#2E4A47] mb-4">
                Food Preferences
              </h3>
              {foodPreferences.map((pref, index) => (
                <div key={index} className="mt-2 flex items-center gap-2">
                  <SelectField
                    value={pref}
                    onChange={(e) =>
                      handleFoodPreferenceChange(index, e.target.value)
                    }
                    options={[
                      { value: "", label: "Select preference" },
                      { value: "Halal Food", label: "Halal Food" },
                      { value: "Vegetarian", label: "Vegetarian" },
                      { value: "Vegan", label: "Vegan" },
                      { value: "Gluten-Free", label: "Gluten-Free" },
                      { value: "No Preference", label: "No Preference" },
                    ]}
                  />
                  {foodPreferences.length > 1 && (
                    <button
                      type="button"
                      onClick={() => handleDeleteFoodPreference(index)}
                      className="text-red-500 hover:text-red-700">
                      Delete
                    </button>
                  )}
                </div>
              ))}
              <button
                type="button"
                onClick={handleAddFoodPreference}
                className="mt-2 text-[#2E4A47] hover:underline">
                + Add Another Preference
              </button>
            </div>
          )}

          <TextAreaField
            label="Interests & Activities"
            value={trip.tripDetails.interests}
            onChange={(e) => updateTripField("interests", e.target.value)}
            placeholder="What activities do you enjoy?"
          />

          <TextAreaField
            label="Remarks/Request"
            value={trip.tripDetails.remarks}
            onChange={(e) => updateTripField("remarks", e.target.value)}
            placeholder="Any special requests?"
          />

          <div className="flex items-center gap-2">
            <input
              type="checkbox"
              checked={trip.tripDetails.termsAgreed}
              onChange={(e) => updateTripField("termsAgreed", e.target.checked)}
              className="text-[#2E4A47] focus:ring-[#2E4A47]"
            />
            <label className="text-sm text-gray-700">
              I agree to the{" "}
              <a href="#" className="text-[#2E4A47] underline">
                Terms & Conditions
              </a>
              .
            </label>
          </div>

          <button
            type="submit"
            className="w-full py-3 primary_btn rounded-lg bg-[#2E4A47] text-white font-semibold hover:bg-[#1F3634] transition duration-300">
            REVIEW YOUR TRAVEL PLAN
          </button>
        </form>

        {isModalOpen && (
          <DestinationModal
            tempDestinations={tempDestinations}
            setTempDestinations={setTempDestinations}
            customLocations={customLocations}
            handleCustomLocationChange={handleCustomLocationChange}
            handleAddCustomLocation={handleAddCustomLocation}
            handleDeleteCustomLocation={handleDeleteCustomLocation}
            additionalOptions={additionalOptions}
            setAdditionalOptions={setAdditionalOptions}
            onClose={handleModalClose}
          />
        )}
      </div>
    </DashboardLayout>
  );
};

export default TripRequest;
