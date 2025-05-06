/** @format */

import React, { useState } from "react";
import { useUser } from "@/context/UserContext";
import { useTripRequest } from "@/context/TripRequestContext";
import { storage } from "../../../firebase.config";
import { ref, uploadBytes, getDownloadURL } from "firebase/storage";
import { useNavigate } from "react-router-dom";

function AgBidRequest() {
  const { user } = useUser();
  const { trip, addBid, hasAgencyBid } = useTripRequest();
  const navigate = useNavigate();

  const [formData, setFormData] = useState({
    coverLetterSubject: "",
    agencyName: user?.name || "",
    agencyInfo: "",
    bidPrice: "",
    pricingBreakdown: "",
  });
  const [files, setFiles] = useState([]);
  const [error, setError] = useState(null);
  const [isSubmitting, setIsSubmitting] = useState(false);

  // Handle text input changes
  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  // Handle file input changes
  const handleFileChange = (e) => {
    const selectedFiles = Array.from(e.target.files);
    if (selectedFiles.length > 5) {
      setError("Maximum 5 files allowed.");
      return;
    }
    const maxSize = 5 * 1024 * 1024; // 5MB
    if (selectedFiles.some((file) => file.size > maxSize)) {
      setError("Each file must be under 5MB.");
      return;
    }
    setFiles(selectedFiles);
  };

  // Upload files to Firebase Storage and get URLs
  const uploadFiles = async () => {
    const fileUrls = [];
    for (const file of files) {
      const storageRef = ref(
        storage,
        `bid-documents/${user.uid}/${file.name}-${Date.now()}`
      );
      await uploadBytes(storageRef, file);
      const url = await getDownloadURL(storageRef);
      fileUrls.push({ name: file.name, url });
    }
    return fileUrls;
  };

  // Handle form submission
  const handleSubmit = async (e) => {
    e.preventDefault();
    setError(null);
    setIsSubmitting(true);

    // Validate user role
    if (!user || user.role !== "Agency") {
      setError("You do not have permission to submit a bid.");
      setIsSubmitting(false);
      return;
    }

    // Validate trip existence and bidding eligibility
    if (!trip || !trip.id) {
      setError("No trip selected for bidding.");
      setIsSubmitting(false);
      return;
    }
    if (trip.deadline && new Date(trip.deadline) < new Date()) {
      setError("Bidding is closed for this trip.");
      setIsSubmitting(false);
      return;
    }
    if (trip.status !== "pending") {
      setError("This trip is not open for bidding.");
      setIsSubmitting(false);
      return;
    }

    // Check for existing bid
    try {
      const alreadyBid = await hasAgencyBid(trip.id, user.uid);
      if (alreadyBid) {
        setError("You have already submitted a bid for this trip.");
        setIsSubmitting(false);
        return;
      }
    } catch (err) {
      console.error("Error checking existing bids:", err);
      setError("Failed to verify bid status. Please try again later.");
      setIsSubmitting(false);
      return;
    }

    // Validate required fields
    if (
      !formData.coverLetterSubject ||
      !formData.agencyName ||
      !formData.agencyInfo ||
      !formData.bidPrice
    ) {
      setError("All fields are required except pricing breakdown.");
      setIsSubmitting(false);
      return;
    }

    // Validate bid price
    if (parseFloat(formData.bidPrice) <= 0) {
      setError("Bid price must be positive.");
      setIsSubmitting(false);
      return;
    }

    try {
      // Upload files (if any)
      const fileUrls = await uploadFiles();

      // Create bid data
      const agentBid = {
        agencyName: formData.agencyName,
        coverLetterSubject: formData.coverLetterSubject,
        agencyInfo: formData.agencyInfo,
        bidPrice: formData.bidPrice,
        pricingBreakdown: formData.pricingBreakdown || "",
        documents: fileUrls,
      };

      // Submit bid
      await addBid(trip.id, agentBid);

      // Reset form and navigate back
      setFormData({
        coverLetterSubject: "",
        agencyName: user?.name || "",
        agencyInfo: "",
        bidPrice: "",
        pricingBreakdown: "",
      });
      setFiles([]);
      setIsSubmitting(false);
      navigate("/dashboard");
    } catch (err) {
      console.error("Error submitting bid:", err);
      setError("Failed to submit bid. Please try again later.");
      setIsSubmitting(false);
    }
  };

  return (
    <div className="bg-[#F5F6F5] mt-6 min-h-screen">
      <h2 className="text-2xl font-semibold text-[#2E4A47] mb-4">
        Agency Bid Request
      </h2>
      {error && <div className="text-red-500 text-center py-4">{error}</div>}
      {trip && (
        <div className="mb-6 bg-white p-4 rounded-lg shadow">
          <h3 className="text-lg font-medium text-[#2E4A47]">Trip Details</h3>
          <p>
            <strong>Destinations:</strong>{" "}
            {trip.tripDetails.destinations.join(", ")}
          </p>
          <p>
            <strong>Dates:</strong> {trip.tripDetails.startDate} to{" "}
            {trip.tripDetails.endDate}
          </p>
          <p>
            <strong>Travel Type:</strong> {trip.tripDetails.travelType}
          </p>
          <p>
            <strong>Status:</strong> {trip.status}
          </p>
          {trip.deadline && (
            <p>
              <strong>Bidding Deadline:</strong>{" "}
              {new Date(trip.deadline).toLocaleString()}
            </p>
          )}
        </div>
      )}
      <form
        onSubmit={handleSubmit}
        className="bg-white p-6 rounded-lg shadow max-w-full mx-auto w-full">
        <div className="mb-4">
          <label className="block text-sm font-medium text-[#2E4A47] mb-1">
            Cover Letter Subject
          </label>
          <input
            type="text"
            name="coverLetterSubject"
            value={formData.coverLetterSubject}
            onChange={handleInputChange}
            className="w-full p-3 border rounded-lg focus:outline-none focus:ring-2 focus:ring-[#2E4A47]"
            placeholder="Enter bid subject (e.g., Proposal for Japan Trip)"
            required
          />
        </div>
        <div className="mb-4">
          <label className="block text-sm font-medium text-[#2E4A47] mb-1">
            Agency Name
          </label>
          <input
            type="text"
            name="agencyName"
            value={formData.agencyName}
            onChange={handleInputChange}
            className="w-full p-3 border rounded-lg focus:outline-none focus:ring-2 focus:ring-[#2E4A47]"
            placeholder="Enter agency name"
            required
          />
        </div>
        <div className="mb-4">
          <label className="block text-sm font-medium text-[#2E4A47] mb-1">
            Agency Information
          </label>
          <textarea
            name="agencyInfo"
            value={formData.agencyInfo}
            onChange={handleInputChange}
            className="w-full p-3 border rounded-lg focus:outline-none focus:ring-2 focus:ring-[#2E4A47]"
            rows="5"
            placeholder="Provide agency details, experience, or certifications"
            required
          />
        </div>
        <div className="mb-4">
          <label className="block text-sm font-medium text-[#2E4A47] mb-1">
            Bid Price (USD)
          </label>
          <input
            type="number"
            name="bidPrice"
            value={formData.bidPrice}
            onChange={handleInputChange}
            className="w-full p-3 border rounded-lg focus:outline-none focus:ring-2 focus:ring-[#2E4A47]"
            placeholder="Enter total bid price"
            min="0"
            step="0.01"
            required
          />
        </div>
        <div className="mb-4">
          <label className="block text-sm font-medium text-[#2E4A47] mb-1">
            Pricing Breakdown (Optional)
          </label>
          <textarea
            name="pricingBreakdown"
            value={formData.pricingBreakdown}
            onChange={handleInputChange}
            className="w-full p-3 border rounded-lg focus:outline-none focus:ring-2 focus:ring-[#2E4A47]"
            rows="3"
            placeholder="Break down costs (e.g., accommodation, transport)"
          />
        </div>
        <div className="mb-4">
          <label className="block text-sm font-medium text-[#2E4A47] mb-1">
            Upload Documents (Optional, max 5 files, 5MB each)
          </label>
          <input
            type="file"
            multiple
            onChange={handleFileChange}
            className="w-full p-3 border rounded-lg"
            accept=".pdf,.doc,.docx,.jpg,.png"
          />
          {files.length > 0 && (
            <ul className="mt-2 text-sm text-gray-600">
              {files.map((file, index) => (
                <li key={index} className="flex items-center gap-2">
                  {file.type.startsWith("image/") && (
                    <img
                      src={URL.createObjectURL(file)}
                      alt={file.name}
                      className="w-12 h-12 object-cover"
                    />
                  )}
                  <span>{file.name}</span>
                </li>
              ))}
            </ul>
          )}
        </div>
        <div className="flex justify-end gap-2">
          <button
            type="button"
            onClick={() => navigate("/agency-dashboard")}
            className="px-4 py-2 bg-gray-300 rounded-lg text-gray-700"
            disabled={isSubmitting}>
            Cancel
          </button>
          <button
            type="submit"
            className="px-4 py-2 bg-[#2E4A47] text-white rounded-lg disabled:opacity-50"
            disabled={isSubmitting}>
            {isSubmitting ? "Submitting..." : "Submit Bid"}
          </button>
        </div>
      </form>
    </div>
  );
}

export default AgBidRequest;
