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

// Demo data for destinations
const destinationData = {
  france: {
    locations: [
      { value: "Paris", label: "Paris" },
      { value: "Nice", label: "Nice" },
      { value: "Lyon", label: "Lyon" },
      { value: "Marseille", label: "Marseille" },
    ],
    additionalOptions: [
      { key: "eiffelTower", label: "Eiffel Tower" },
      { key: "louvreMuseum", label: "Louvre Museum" },
      { key: "notreDame", label: "Notre-Dame Cathedral" },
    ],
  },
  italy: {
    locations: [
      { value: "Rome", label: "Rome" },
      { value: "Venice", label: "Venice" },
      { value: "Florence", label: "Florence" },
      { value: "Milan", label: "Milan" },
    ],
    additionalOptions: [
      { key: "colosseum", label: "Colosseum" },
      { key: "venetianCanals", label: "Venetian Canals" },
      { key: "duomoFlorence", label: "Duomo in Florence" },
    ],
  },
  japan: {
    locations: [
      { value: "Tokyo", label: "Tokyo" },
      { value: "Osaka", label: "Osaka" },
      { value: "Kyoto", label: "Kyoto" },
      { value: "Hokkaido", label: "Hokkaido" },
    ],
    additionalOptions: [
      { key: "mountFuji", label: "Mount Fuji" },
      { key: "fushimiInari", label: "Fushimi Inari Shrine" },
      { key: "shibuyaCrossing", label: "Shibuya Crossing" },
    ],
  },
  usa: {
    locations: [
      { value: "New York", label: "New York" },
      { value: "Los Angeles", label: "Los Angeles" },
      { value: "Chicago", label: "Chicago" },
      { value: "Miami", label: "Miami" },
    ],
    additionalOptions: [
      { key: "statueOfLiberty", label: "Statue of Liberty" },
      { key: "grandCanyon", label: "Grand Canyon" },
      { key: "hollywood", label: "Hollywood" },
    ],
  },
};

const TripRequest = () => {
  const { user } = useUser();
  const navigate = useNavigate();
  const [dbUser, setDbUser] = useState(null);
  const [error, setError] = useState(null);
  const [isLoading, setIsLoading] = useState(true);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [tempDestination, setTempDestination] = useState("");
  const [additionalOptions, setAdditionalOptions] = useState({});
  const [customLocation, setCustomLocation] = useState("");
  const [accommodationDetails, setAccommodationDetails] = useState({
    type: "Hotel",
    starRating: "5 Star",
  });
  const [transportationDetails, setTransportationDetails] = useState({
    type: "Car",
    customMethod: "",
  });
  const [foodPreferenceDetails, setFoodPreferenceDetails] = useState({
    preference: "Halal Food, Vegetarian, Meat",
  });

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

  // Automatically open modal when a destination is selected and reset additional options
  useEffect(() => {
    if (tempDestination) {
      setIsModalOpen(true);
      // Reset additional options based on the selected destination
      const initialOptions = {};
      if (destinationData[tempDestination]) {
        destinationData[tempDestination].additionalOptions.forEach((opt) => {
          initialOptions[opt.key] = false;
        });
      }
      setAdditionalOptions(initialOptions);
    }
  }, [tempDestination]);

  // Update trip state whenever accommodationDetails changes
  useEffect(() => {
    if (trip.accommodation === "Yes") {
      updateTripField("accommodationDetails", accommodationDetails);
    }
  }, [accommodationDetails]);

  // Update trip state whenever transportationDetails changes
  useEffect(() => {
    if (trip.transportation === "Yes") {
      updateTripField("transportationDetails", transportationDetails);
    }
  }, [transportationDetails]);

  // Update trip state whenever foodPreferenceDetails changes
  useEffect(() => {
    if (trip.foodPreference === "Yes") {
      updateTripField("foodPreferenceDetails", foodPreferenceDetails);
    }
  }, [foodPreferenceDetails]);

  // Helper functions
  const updateTripField = (field, value) => {
    setTrip((prev) => ({ ...prev, [field]: value }));
  };

  const handleDestinationChange = (e) => {
    const value = e.target.value;
    setTempDestination(value);
  };

  const handleModalClose = () => {
    // Save the data when the modal is closed
    updateTripField("destination", tempDestination);
    updateTripField("additionalOptions", additionalOptions);
    if (customLocation)
      updateTripField("locations", [...locations, customLocation]);
    setIsModalOpen(false);
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
        {/* Header */}
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

        {/* Form */}
        <form onSubmit={handleSubmit} className="mt-8 space-y-6 w-full">
          <DateRangePicker
            startDate={trip.startDate}
            endDate={trip.endDate}
            updateTripField={updateTripField}
          />

          <SelectField
            label="Destination"
            value={tempDestination}
            onChange={handleDestinationChange}
            options={[
              { value: "", label: "Select Your Desired Country" },
              { value: "france", label: "France" },
              { value: "italy", label: "Italy" },
              { value: "japan", label: "Japan" },
              { value: "usa", label: "USA" },
            ]}
          />

          <RadioGroup
            label="Travel Type"
            name="travelType"
            value={trip.travelType}
            onChange={(value) => updateTripField("travelType", value)}
            options={["Solo", "Group"]}
          />

          {trip.travelType === "Group" && (
            <GroupTravelFields trip={trip} updateTripField={updateTripField} />
          )}

          <RadioGroup
            label="Want to handle the accommodation?"
            name="accommodation"
            value={trip.accommodation}
            onChange={(value) => updateTripField("accommodation", value)}
            options={["Yes", "No"]}
          />

          {/* Conditional Accommodation Details Section */}
          {trip.accommodation === "Yes" && (
            <div className="border rounded-lg p-4 bg-white shadow-md">
              <h3 className="text-lg font-semibold text-[#2E4A47] mb-4">
                Choose your accommodation
              </h3>
              <SelectField
                label="Accommodation Type"
                value={accommodationDetails.type}
                onChange={(e) =>
                  setAccommodationDetails((prev) => ({
                    ...prev,
                    type: e.target.value,
                  }))
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
                value={accommodationDetails.starRating}
                onChange={(e) =>
                  setAccommodationDetails((prev) => ({
                    ...prev,
                    starRating: e.target.value,
                  }))
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
            value={trip.transportation}
            onChange={(value) => updateTripField("transportation", value)}
            options={["Yes", "No"]}
          />

          {/* Conditional Transportation Details Section */}
          {trip.transportation === "Yes" && (
            <div className="border rounded-lg p-4 bg-white shadow-md">
              <h3 className="text-lg font-semibold text-[#2E4A47] mb-4">
                Choose your transportation
              </h3>
              <SelectField
                label="Transportation Type"
                value={transportationDetails.type}
                onChange={(e) =>
                  setTransportationDetails((prev) => ({
                    ...prev,
                    type: e.target.value,
                  }))
                }
                options={[
                  { value: "Car", label: "Car" },
                  { value: "Bus", label: "Bus" },
                  { value: "Train", label: "Train" },
                  { value: "Plane", label: "Plane" },
                ]}
              />
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Add a new method
                </label>
                <input
                  type="text"
                  value={transportationDetails.customMethod}
                  onChange={(e) =>
                    setTransportationDetails((prev) => ({
                      ...prev,
                      customMethod: e.target.value,
                    }))
                  }
                  placeholder="Add a new method"
                  className="w-full p-3 border rounded-lg focus:ring-2 focus:ring-[#2E4A47] bg-[#F5F6F5]"
                />
              </div>
            </div>
          )}

          <RadioGroup
            label="What’s your food preference?"
            name="foodPreference"
            value={trip.foodPreference}
            onChange={(value) => updateTripField("foodPreference", value)}
            options={["Yes", "No"]}
          />

          {/* Conditional Food Preference Details Section */}
          {trip.foodPreference === "Yes" && (
            <div className="border rounded-lg p-4 bg-white shadow-md">
              <h3 className="text-lg font-semibold text-[#2E4A47] mb-4">
                Your food preference
              </h3>
              <SelectField
                label="Food Preference"
                value={foodPreferenceDetails.preference}
                onChange={(e) =>
                  setFoodPreferenceDetails((prev) => ({
                    ...prev,
                    preference: e.target.value,
                  }))
                }
                options={[
                  {
                    value: "Halal Food, Vegetarian, Meat",
                    label: "Halal Food, Vegetarian, Meat",
                  },
                  { value: "Vegetarian", label: "Vegetarian" },
                  { value: "Vegan", label: "Vegan" },
                  { value: "Gluten-Free", label: "Gluten-Free" },
                  { value: "No Preference", label: "No Preference" },
                ]}
              />
            </div>
          )}

          <TextAreaField
            label="Share your Interests & Activities"
            value={trip.interests}
            onChange={(e) => updateTripField("interests", e.target.value)}
            placeholder="What activities do you enjoy?"
          />

          <TextAreaField
            label="Remarks/Request"
            value={trip.remarks}
            onChange={(e) => updateTripField("remarks", e.target.value)}
            placeholder="Do you have any special request in mind?"
          />

          <div className="flex items-center gap-2">
            <input
              type="checkbox"
              checked={trip.termsAgreed}
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
            className="w-full  py-3 rounded-lg primary_btn transition duration-300">
            CREATE YOUR TRAVEL PLAN
          </button>
        </form>

        {/* Modal */}
        {isModalOpen && (
          <DestinationModal
            tempDestination={tempDestination}
            setTempDestination={setTempDestination}
            locations={locations}
            updateLocation={updateLocation}
            additionalOptions={additionalOptions}
            setAdditionalOptions={setAdditionalOptions}
            customLocation={customLocation}
            setCustomLocation={setCustomLocation}
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
  tempDestination,
  setTempDestination,
  locations,
  updateLocation,
  additionalOptions,
  setAdditionalOptions,
  customLocation,
  setCustomLocation,
  onClose,
}) => {
  const selectedDestinationData = tempDestination
    ? destinationData[tempDestination]
    : null;

  return (
    <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50">
      <div className="bg-white p-6 rounded-lg shadow-lg w-full max-w-md">
        <h2 className="text-lg font-semibold text-[#2E4A47] mb-4">
          Destination
        </h2>

        <SelectField
          value={tempDestination}
          onChange={(e) => setTempDestination(e.target.value)}
          options={[
            { value: "", label: "Select Your Desired Country" },
            { value: "france", label: "France" },
            { value: "italy", label: "Italy" },
            { value: "japan", label: "Japan" },
            { value: "usa", label: "USA" },
          ]}
        />

        {selectedDestinationData && (
          <>
            {locations.map((location, index) => (
              <SelectField
                key={index}
                value={location}
                onChange={(e) => updateLocation(index, e.target.value)}
                options={[
                  { value: "", label: "Select a location" },
                  ...selectedDestinationData.locations,
                ]}
              />
            ))}

            <div className="space-y-2 mb-4">
              {selectedDestinationData.additionalOptions.map((option) => (
                <label key={option.key} className="flex items-center">
                  <input
                    type="checkbox"
                    checked={additionalOptions[option.key] || false}
                    onChange={(e) =>
                      setAdditionalOptions({
                        ...additionalOptions,
                        [option.key]: e.target.checked,
                      })
                    }
                    className="mr-2 text-[#2E4A47] focus:ring-[#2E4A47]"
                  />
                  {option.label}
                </label>
              ))}
            </div>
          </>
        )}

        <input
          type="text"
          value={customLocation}
          onChange={(e) => setCustomLocation(e.target.value)}
          placeholder="Add your custom location"
          className="w-full p-3 border rounded-lg focus:ring-2 focus:ring-[#2E4A47] mb-4"
        />

        <div className="flex justify-end">
          <button
            onClick={onClose}
            className="px-4 py-2 bg-gray-300 text-gray-700 rounded-lg hover:bg-gray-400 transition">
            Close
          </button>
        </div>
      </div>
    </div>
  );
};

export default TripRequest;
