/** @format */

import { useState } from "react";
import { useUser } from "@/context/UserContext";
import { useTripRequest } from "@/context/TripRequestContext";
import { storage } from "../../../firebase.config";
import { ref, uploadBytes, getDownloadURL } from "firebase/storage";
import { useNavigate } from "react-router-dom";
import Lottie from "lottie-react";
import tickmark from "../../assets/tickmark.json";

function AgBidRequest() {
  const { user } = useUser();
  const { trip, addBid, hasAgencyBid } = useTripRequest();
  const navigate = useNavigate();
  const [isModalOpen, setIsModalOpen] = useState(false);

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

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

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
    setError(null);
  };

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

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError(null);
    setIsSubmitting(true);

    if (!user || user.role !== "agent") {
      setError("You do not have permission to submit a bid.");
      setIsSubmitting(false);
      return;
    }

    if (!trip || !trip.id) {
      setError("No trip selected for bidding.");
      setIsSubmitting(false);
      return;
    }

    if (trip.status !== "pending") {
      setError("This trip is not open for bidding.");
      setIsSubmitting(false);
      return;
    }

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

    if (parseFloat(formData.bidPrice) <= 0) {
      setError("Bid price must be positive.");
      setIsSubmitting(false);
      return;
    }

    try {
      const fileUrls = await uploadFiles();

      const agentBid = {
        agencyName: formData.agencyName,
        coverLetterSubject: formData.coverLetterSubject,
        agencyInfo: formData.agencyInfo,
        bidPrice: formData.bidPrice,
        pricingBreakdown: formData.pricingBreakdown || "",
        documents: fileUrls,
      };

      await addBid(trip.id, agentBid);

      setFormData({
        coverLetterSubject: "",
        agencyName: user?.name || "",
        agencyInfo: "",
        bidPrice: "",
        pricingBreakdown: "",
      });
      setFiles([]);
      setIsSubmitting(false);
      setIsModalOpen(true); // Show success modal
    } catch (err) {
      console.error("Error submitting bid:", err);
      setError("Failed to submit bid. Please try again later.");
      setIsSubmitting(false);
    }
  };

  return (
    <div className="bg-[#F5F6F5] mt-6 min-h-screen px-4 pb-10">
      <h2 className="text-2xl font-semibold text-[#2E4A47] mb-4">
        Agency Bid Request
      </h2>

      {error && <div className="text-red-500 text-center py-2">{error}</div>}

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
        </div>
      )}

      <form
        onSubmit={handleSubmit}
        className="bg-white p-6 rounded-lg shadow max-w-full w-full mx-auto">
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
            placeholder="Proposal for Japan Trip"
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
            rows="4"
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
            <ul className="mt-2 text-sm text-gray-600 space-y-1">
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

        <div className="flex justify-end gap-2 mt-6">
          <button
            type="button"
            onClick={() => navigate("/agency-dashboard")}
            className="px-4 py-2 bg-gray-300 rounded-lg text-gray-700 hover:bg-gray-400">
            Cancel
          </button>
          <button
            type="submit"
            disabled={isSubmitting}
            className={`px-6 py-2 rounded-lg text-white ${
              isSubmitting ? "bg-gray-400 cursor-not-allowed" : "bg-[#2E4A47]"
            }`}>
            {isSubmitting ? "Submitting..." : "Submit Bid"}
          </button>
        </div>
      </form>

      {/* Success Modal with Lottie Animation */}
      {isModalOpen && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex justify-center items-center z-50">
          <div className="bg-white rounded-lg p-6 w-full max-w-md text-center shadow-lg">
            <Lottie
              animationData={tickmark}
              loop={false}
              className="w-36 mx-auto"
            />
            <h2 className="text-xl font-semibold text-[#2E4A47] mt-4 mb-2">
              Bid Submitted Successfully!
            </h2>
            <p className="text-gray-600 mb-4">Thank you for your submission.</p>
            <button
              onClick={() => {
                setIsModalOpen(false);
                navigate("/agent-dashboard");
              }}
              className="px-4 py-2 bg-[#2E4A47] text-white rounded-lg hover:bg-[#243835]">
              Go to Dashboard
            </button>
          </div>
        </div>
      )}
    </div>
  );
}

export default AgBidRequest;
