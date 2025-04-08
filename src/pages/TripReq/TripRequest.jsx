/** @format */

import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { useUser } from "../../context/UserContext";
import { useTripRequest } from "../../context/TripRequestContext";
import { db } from "../../../firebase.config";
import { collection, query, where, getDocs } from "firebase/firestore";
import tripRequestImg from "../../assets/images/trip.svg";
import DashboardLayout from "@/components/DashboardLayout";
import DateRangePicker from "@/components/triprequestcomponents/DateRangePicker";
import Preloader from "@/components/Preloader";
import { destinationData } from "@/constant/destinationData";

const TripRequest = () => {
  const { user } = useUser();
  const navigate = useNavigate();
  const [dbUser, setDbUser] = useState(null);
  const [error, setError] = useState(null);
  const [isLoading, setIsLoading] = useState(true);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [tempDestinations, setTempDestinations] = useState([]);
  const [customLocations, setCustomLocations] = useState([""]);
  const [additionalOptions, setAdditionalOptions] = useState({});
  const [transportationMethods, setTransportationMethods] = useState([""]);
  const [foodPreferences, setFoodPreferences] = useState([""]);

  const { trip, setTrip, locations, updateLocation, handleSubmit } =
    useTripRequest();

  // Fetch user data from Firestore
  useEffect(() => {
    const fetchUserData = async () => {
      if (!user?.email) {
        setError("User not authenticated or email not available.");
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

        setDbUser(querySnapshot.docs[0].data());
      } catch (err) {
        console.error("Error fetching user data:", err);
        setError("Failed to fetch user data.");
      } finally {
        setIsLoading(false);
      }
    };

    fetchUserData();
  }, [user, navigate]);

  // Helper functions
  const updateTripField = (field, value) => {
    setTrip((prev) => ({
      ...prev,
      userData: {
        ...prev.userData,
        tripDetails: {
          ...prev.userData.tripDetails,
          [field]: value,
        },
      },
    }));
  };

  const handleAddCustomLocation = () => {
    setCustomLocations([...customLocations, ""]);
  };

  const handleCustomLocationChange = (index, value) => {
    const updatedLocations = [...customLocations];
    updatedLocations[index] = value;
    setCustomLocations(updatedLocations);
  };

  const handleDeleteCustomLocation = (index) => {
    if (customLocations.length > 1) {
      const updatedLocations = customLocations.filter((_, i) => i !== index);
      setCustomLocations(updatedLocations);
    }
  };

  const handleAddTransportation = () => {
    setTransportationMethods([...transportationMethods, ""]);
  };

  const handleTransportationChange = (index, value) => {
    const updatedMethods = [...transportationMethods];
    updatedMethods[index] = value;
    setTransportationMethods(updatedMethods);
    updateTripField("transportationDetails", {
      ...trip.userData.tripDetails.transportationDetails,
      methods: updatedMethods,
    });
  };

  const handleDeleteTransportation = (index) => {
    if (transportationMethods.length > 1) {
      const updatedMethods = transportationMethods.filter(
        (_, i) => i !== index
      );
      setTransportationMethods(updatedMethods);
      updateTripField("transportationDetails", {
        ...trip.userData.tripDetails.transportationDetails,
        methods: updatedMethods,
      });
    }
  };

  const handleAddFoodPreference = () => {
    setFoodPreferences([...foodPreferences, ""]);
  };

  const handleFoodPreferenceChange = (index, value) => {
    const updatedPrefs = [...foodPreferences];
    updatedPrefs[index] = value;
    setFoodPreferences(updatedPrefs);
    updateTripField("foodPreferenceDetails", { preferences: updatedPrefs });
  };

  const handleDeleteFoodPreference = (index) => {
    if (foodPreferences.length > 1) {
      const updatedPrefs = foodPreferences.filter((_, i) => i !== index);
      setFoodPreferences(updatedPrefs);
      updateTripField("foodPreferenceDetails", { preferences: updatedPrefs });
    }
  };

  const handleSelectDestinations = () => {
    setIsModalOpen(true);
  };

  const handleModalClose = () => {
    updateTripField("destinations", tempDestinations);
    updateTripField("additionalOptions", additionalOptions);
    updateTripField(
      "locations",
      customLocations.filter((loc) => loc !== "")
    );
    setIsModalOpen(false);
  };

  const onSubmit = async (e) => {
    e.preventDefault();
    try {
      await handleSubmit(e);
      navigate("/dashboard");
    } catch (error) {
      console.error("Submission error:", error);
      setError("Failed to submit trip request. Please try again.");
    }
  };

  // Render states
  if (isLoading) return <Preloader />;
  if (error)
    return <div className="text-red-500 text-center py-10">{error}</div>;
  if (!user) {
    navigate("/");
    return null;
  }

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
            startDate={trip.userData.tripDetails.startDate}
            endDate={trip.userData.tripDetails.endDate}
            updateTripField={updateTripField}
          />

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Destinations
            </label>
            <button
              type="button"
              onClick={handleSelectDestinations}
              className="w-full p-3 border rounded-lg bg-[#F5F6F5] text-left">
              {tempDestinations.length > 0
                ? tempDestinations.join(", ")
                : "Select Destinations"}
            </button>
          </div>

          <RadioGroup
            label="Travel Type"
            name="travelType"
            value={trip.userData.tripDetails.travelType}
            onChange={(value) => updateTripField("travelType", value)}
            options={["Solo", "Group"]}
          />

          {trip.userData.tripDetails.travelType === "Group" && (
            <GroupTravelFields
              trip={trip.userData.tripDetails}
              updateTripField={updateTripField}
            />
          )}

          <RadioGroup
            label="Want to handle the accommodation?"
            name="accommodation"
            value={trip.userData.tripDetails.accommodation}
            onChange={(value) => updateTripField("accommodation", value)}
            options={["Yes", "No"]}
          />

          {trip.userData.tripDetails.accommodation === "Yes" && (
            <div className="border rounded-lg p-4 bg-white shadow-md">
              <h3 className="text-lg font-semibold text-[#2E4A47] mb-4">
                Choose your accommodation
              </h3>
              <SelectField
                label="Accommodation Type"
                value={trip.userData.tripDetails.accommodationDetails.type}
                onChange={(e) =>
                  updateTripField("accommodationDetails", {
                    ...trip.userData.tripDetails.accommodationDetails,
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
                value={
                  trip.userData.tripDetails.accommodationDetails.starRating
                }
                onChange={(e) =>
                  updateTripField("accommodationDetails", {
                    ...trip.userData.tripDetails.accommodationDetails,
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
            label="Want to handle your transportation?"
            name="transportation"
            value={trip.userData.tripDetails.transportation}
            onChange={(value) => updateTripField("transportation", value)}
            options={["Yes", "No"]}
          />

          {trip.userData.tripDetails.transportation === "Yes" && (
            <div className="border rounded-lg p-4 bg-white shadow-md">
              <h3 className="text-lg font-semibold text-[#2E4A47] mb-4">
                Choose your transportation
              </h3>
              <SelectField
                label="Primary Transportation Type"
                value={trip.userData.tripDetails.transportationDetails.type}
                onChange={(e) =>
                  updateTripField("transportationDetails", {
                    ...trip.userData.tripDetails.transportationDetails,
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
                + Add Another Transportation Method
              </button>
            </div>
          )}

          <RadioGroup
            label="What’s your food preference?"
            name="foodPreference"
            value={trip.userData.tripDetails.foodPreference}
            onChange={(value) => updateTripField("foodPreference", value)}
            options={["Yes", "No"]}
          />

          {trip.userData.tripDetails.foodPreference === "Yes" && (
            <div className="border rounded-lg p-4 bg-white shadow-md">
              <h3 className="text-lg font-semibold text-[#2E4A47] mb-4">
                Your food preferences
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
                + Add Another Food Preference
              </button>
            </div>
          )}

          <TextAreaField
            label="Share your Interests & Activities"
            value={trip.userData.tripDetails.interests}
            onChange={(e) => updateTripField("interests", e.target.value)}
            placeholder="What activities do you enjoy?"
          />

          <TextAreaField
            label="Remarks/Request"
            value={trip.userData.tripDetails.remarks}
            onChange={(e) => updateTripField("remarks", e.target.value)}
            placeholder="Do you have any special request in mind?"
          />

          <div className="flex items-center gap-2">
            <input
              type="checkbox"
              checked={trip.userData.tripDetails.termsAgreed}
              onChange={(e) => updateTripField("termsAgreed", e.target.checked)}
              className="text-[#2E4A47] focus:ring-[#2E4A47]"
            />
            <label className="text-sm text-gray-700">
              By continuing, you agree with the{" "}
              <a href="#" className="text-[#2E4A47] underline">
                Terms & Conditions
              </a>
              .
            </label>
          </div>

          <button
            type="submit"
            className="w-full py-3 rounded-lg primary_btn transition duration-300">
            CREATE YOUR TRAVEL PLAN
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

// Reusable Components
const SelectField = ({ label, value, onChange, options }) => (
  <div>
    {label && (
      <label className="block text-sm font-medium text-gray-700 mb-1">
        {label}
      </label>
    )}
    <select
      value={value}
      onChange={onChange}
      className="w-full p-3 border rounded-lg focus:ring-2 focus:ring-[#2E4A47] bg-[#F5F6F5]">
      {options.map((opt) => (
        <option key={opt.value} value={opt.value}>
          {opt.label}
        </option>
      ))}
    </select>
  </div>
);

const RadioGroup = ({ label, name, value, onChange, options }) => (
  <div>
    <label className="block text-sm font-medium text-gray-700 mb-1">
      {label}
    </label>
    <div className="flex gap-4">
      {options.map((option) => (
        <label key={option} className="flex items-center">
          <input
            type="radio"
            name={name}
            value={option}
            checked={value === option}
            onChange={() => onChange(option)}
            className="mr-2 text-[#2E4A47] focus:ring-[#2E4A47]"
          />
          {option}
        </label>
      ))}
    </div>
  </div>
);

const CounterField = ({ label, value, onChange }) => (
  <div className="flex items-center justify-between">
    <label className="text-sm font-medium text-gray-700">{label}</label>
    <div className="flex items-center gap-2">
      <button
        type="button"
        onClick={() => onChange(Math.max(0, value - 1))}
        className="w-8 h-8 border rounded-full text-[#2E4A47] hover:bg-[#2E4A47] hover:text-white transition">
        −
      </button>
      <span className="w-12 text-center">{value}</span>
      <button
        type="button"
        onClick={() => onChange(value + 1)}
        className="w-8 h-8 border rounded-full text-[#2E4A47] hover:bg-[#2E4A47] hover:text-white transition">
        +
      </button>
    </div>
  </div>
);

const GroupTravelFields = ({ trip, updateTripField }) => (
  <div className="space-y-4 mt-4">
    <CounterField
      label="Male"
      value={trip.maleCount}
      onChange={(value) => updateTripField("maleCount", value)}
    />
    <CounterField
      label="Female"
      value={trip.femaleCount}
      onChange={(value) => updateTripField("femaleCount", value)}
    />
    <CounterField
      label="Kids"
      value={trip.kidsCount}
      onChange={(value) => updateTripField("kidsCount", value)}
    />
  </div>
);

const TextAreaField = ({ label, value, onChange, placeholder }) => (
  <div>
    <label className="block text-sm font-medium text-gray-700 mb-1">
      {label}
    </label>
    <textarea
      value={value}
      onChange={onChange}
      placeholder={placeholder}
      className="w-full p-3 border rounded-lg focus:ring-2 focus:ring-[#2E4A47]"
      rows="3"
    />
  </div>
);

const DestinationModal = ({
  tempDestinations,
  setTempDestinations,
  customLocations,
  handleCustomLocationChange,
  handleAddCustomLocation,
  handleDeleteCustomLocation,
  additionalOptions,
  setAdditionalOptions,
  onClose,
}) => {
  const handleDestinationToggle = (destination) => {
    setTempDestinations((prev) =>
      prev.includes(destination)
        ? prev.filter((d) => d !== destination)
        : [...prev, destination]
    );
  };

  // Handler for overlay click
  const handleOverlayClick = (e) => {
    // Check if the click target is the overlay itself (not its children)
    if (e.target === e.currentTarget) {
      onClose();
    }
  };

  return (
    <div
      className="fixed inset-0 bg-black/50 flex items-center justify-center z-50"
      onClick={handleOverlayClick}>
      <div className="bg-white p-6 rounded-lg shadow-lg w-full max-w-md">
        <h2 className="text-lg font-semibold text-[#2E4A47] mb-4">
          Select Destinations
        </h2>

        <div className="space-y-2 mb-4">
          {Object.keys(destinationData).map((country) => (
            <label key={country} className="flex items-center">
              <input
                type="checkbox"
                checked={tempDestinations.includes(country)}
                onChange={() => handleDestinationToggle(country)}
                className="mr-2 text-[#2E4A47] focus:ring-[#2E4A47]"
              />
              {country.charAt(0).toUpperCase() + country.slice(1)}
            </label>
          ))}
        </div>

        {tempDestinations.map((dest) => (
          <div key={dest} className="mb-4">
            <h3 className="text-md font-medium text-[#2E4A47]">
              {dest} Additional Options
            </h3>
            {destinationData[dest].additionalOptions.map((option) => (
              <label key={option.key} className="flex items-center">
                <input
                  type="checkbox"
                  checked={additionalOptions[`${dest}_${option.key}`] || false}
                  onChange={(e) =>
                    setAdditionalOptions({
                      ...additionalOptions,
                      [`${dest}_${option.key}`]: e.target.checked,
                    })
                  }
                  className="mr-2 text-[#2E4A47] focus:ring-[#2E4A47]"
                />
                {option.label}
              </label>
            ))}
          </div>
        ))}

        <div className="mb-4">
          <h3 className="text-md font-medium text-[#2E4A47] mb-2">
            Custom Locations
          </h3>
          {customLocations.map((location, index) => (
            <div key={index} className="flex items-center gap-2 mb-2">
              <input
                type="text"
                value={location}
                onChange={(e) =>
                  handleCustomLocationChange(index, e.target.value)
                }
                placeholder={`Custom Location ${index + 1}`}
                className="w-full p-3 border rounded-lg focus:ring-2 focus:ring-[#2E4A47]"
              />
              {customLocations.length > 1 && (
                <button
                  type="button"
                  onClick={() => handleDeleteCustomLocation(index)}
                  className="text-red-500 hover:text-red-700">
                  Delete
                </button>
              )}
            </div>
          ))}
          <button
            type="button"
            onClick={handleAddCustomLocation}
            className="text-[#2E4A47] hover:underline">
            + Add Another Location
          </button>
        </div>

        <div className="flex justify-end">
          <button
            onClick={onClose}
            className="px-4 py-2 bg-gray-300 text-gray-700 rounded-lg hover:bg-gray-400 transition">
            Save & Close
          </button>
        </div>
      </div>
    </div>
  );
};

export default TripRequest;
