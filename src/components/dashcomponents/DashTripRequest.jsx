/** @format */

import { destinationData } from "@/constant/destinationData";

export const SelectField = ({ label, value, onChange, options }) => (
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

export const RadioGroup = ({ label, name, value, onChange, options }) => (
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

export const CounterField = ({ label, value, onChange }) => (
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

export const GroupTravelFields = ({ trip, updateTripField }) => (
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

export const TextAreaField = ({ label, value, onChange, placeholder }) => (
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

export const DestinationModal = ({
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
