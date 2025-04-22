/** @format */

import { useEffect, useState } from "react";
import { useUser } from "@/context/UserContext";
import { useTripRequest } from "@/context/TripRequestContext";
import { useNavigate } from "react-router-dom";
import TripCard from "../dashcomponents/TripCard";
import { doc, updateDoc, arrayUnion } from "firebase/firestore";
import { db } from "../../../firebase.config";

function AgDashboard() {
  const { user } = useUser();
  const { fetchAllTrips, setTrip } = useTripRequest();
  const navigate = useNavigate();

  const [trips, setTrips] = useState([]);
  const [filteredTrips, setFilteredTrips] = useState([]);
  const [searchTerm, setSearchTerm] = useState("");
  const [startDateFilter, setStartDateFilter] = useState("");
  const [travelTypeFilter, setTravelTypeFilter] = useState("");
  const [currentPage, setCurrentPage] = useState(1);
  const [error, setError] = useState(null);
  const [showBidModal, setShowBidModal] = useState(false);
  const [selectedTrip, setSelectedTrip] = useState(null);
  const [bidData, setBidData] = useState({
    proposedItinerary: "",
    pricingTotal: "",
    accommodationPlan: "",
    transportationPlan: "",
    foodPlan: "",
  });
  const tripsPerPage = 6;

  // Fetch all trips on mount
  useEffect(() => {
    const loadTrips = async () => {
      if (!user || user.role !== "Agency") {
        setError("You do not have permission to access the agency dashboard.");
        return;
      }

      try {
        const tripsData = await fetchAllTrips();
        const normalizedTrips = tripsData.map((trip) => ({
          ...trip,
          id: trip.id || `trip_${Math.random().toString(36).substr(2, 9)}`, // Fallback ID
          createdAt:
            typeof trip.createdAt === "string"
              ? trip.createdAt
              : trip.createdAt?.toDate().toISOString(),
          deadline: trip.deadline
            ? typeof trip.deadline === "string"
              ? trip.deadline
              : trip.deadline?.toDate().toISOString()
            : undefined,
        }));
        setTrips(normalizedTrips);
        setFilteredTrips(normalizedTrips);
      } catch (err) {
        console.error("Error fetching trips:", err);
        setError("Failed to load trips.");
      }
    };

    loadTrips();
  }, [user, fetchAllTrips]);

  // Apply filters
  useEffect(() => {
    let filtered = trips;

    if (searchTerm.trim() !== "") {
      filtered = filtered.filter(
        (trip) =>
          trip?.tripDetails?.destinations &&
          Array.isArray(trip.tripDetails.destinations) &&
          trip.tripDetails.destinations
            .join(", ")
            .toLowerCase()
            .includes(searchTerm.toLowerCase())
      );
    }

    if (startDateFilter) {
      filtered = filtered.filter(
        (trip) =>
          trip?.tripDetails?.startDate &&
          trip.tripDetails.startDate === startDateFilter
      );
    }

    if (travelTypeFilter && travelTypeFilter !== "Traveler's type") {
      filtered = filtered.filter(
        (trip) =>
          trip?.tripDetails?.travelType &&
          trip.tripDetails.travelType === travelTypeFilter
      );
    }

    setFilteredTrips(filtered);
    setCurrentPage(1);
  }, [searchTerm, startDateFilter, travelTypeFilter, trips]);

  // Pagination logic
  const indexOfLastTrip = currentPage * tripsPerPage;
  const indexOfFirstTrip = indexOfLastTrip - tripsPerPage;
  const currentTrips = filteredTrips.slice(indexOfFirstTrip, indexOfLastTrip);
  const totalPages = Math.ceil(filteredTrips.length / tripsPerPage);

  const handlePageChange = (pageNumber) => {
    if (pageNumber >= 1 && pageNumber <= totalPages) {
      setCurrentPage(pageNumber);
    }
  };

  // Open bid modal
  const handleTripClick = (trip) => {
    if (trip.deadline && new Date(trip.deadline) < new Date()) {
      setError("Bidding is closed for this trip.");
      return;
    }
    if (trip.status !== "pending") {
      setError("This trip is not open for bidding.");
      return;
    }
    setSelectedTrip(trip);
    setTrip(trip);
    setShowBidModal(true);
  };

  // Handle bid form input changes
  const handleBidChange = (e) => {
    const { name, value } = e.target;
    setBidData((prev) => ({ ...prev, [name]: value }));
  };

  // Submit bid to Firestore
  const handleBidSubmit = async (e) => {
    e.preventDefault();
    if (
      !bidData.proposedItinerary ||
      !bidData.pricingTotal ||
      !bidData.accommodationPlan ||
      !bidData.transportationPlan ||
      !bidData.foodPlan
    ) {
      setError("All bid fields are required.");
      return;
    }

    const bid = {
      bidId: `bid_${Math.random().toString(36).substr(2, 9)}`,
      agencyId: user.uid,
      agencyName: user.name || "Unknown Agency", // Adjust based on user data
      proposedItinerary: bidData.proposedItinerary,
      pricing: {
        total: parseFloat(bidData.pricingTotal),
        breakdown: {}, // Add breakdown if needed
      },
      accommodationPlan: bidData.accommodationPlan,
      transportationPlan: bidData.transportationPlan,
      foodPlan: bidData.foodPlan,
      submittedAt: new Date().toISOString(),
      status: "pending",
    };

    try {
      const tripRef = doc(db, "tripRequests", selectedTrip.id);
      await updateDoc(tripRef, {
        bids: arrayUnion(bid),
      });
      setShowBidModal(false);
      setBidData({
        proposedItinerary: "",
        pricingTotal: "",
        accommodationPlan: "",
        transportationPlan: "",
        foodPlan: "",
      });
      setError(null);
      window.location.reload(); // Refresh to update trip list
    } catch (err) {
      console.error("Error submitting bid:", err);
      setError("Failed to submit bid.");
    }
  };

  // Close bid modal
  const handleCloseModal = () => {
    setShowBidModal(false);
    setBidData({
      proposedItinerary: "",
      pricingTotal: "",
      accommodationPlan: "",
      transportationPlan: "",
      foodPlan: "",
    });
    setError(null);
  };

  // Handle Refresh button
  const handleRefresh = () => {
    window.location.reload();
  };

  return (
    <div className="min-h-screen bg-[#F5F6F5] p-6">
      <h1 className="text-2xl md:text-4xl my-6">Agency Dashboard</h1>
      {error && <div className="text-red-500 text-center py-4">{error}</div>}

      <div className="mt-8 flex flex-col md:flex-row gap-4">
        <input
          type="text"
          placeholder="Search by destination..."
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
          className="w-full md:w-1/3 p-3 border rounded-lg"
        />
        <div className="w-full md:w-1/3">
          <input
            type="date"
            value={startDateFilter}
            onChange={(e) => setStartDateFilter(e.target.value)}
            className="w-full p-3 border rounded-lg"
            placeholder="Select start date"
          />
        </div>
        <select
          value={travelTypeFilter}
          onChange={(e) => setTravelTypeFilter(e.target.value)}
          className="p-3 rounded-lg border w-full md:w-1/3">
          <option value="">Traveler's type</option>
          <option value="Solo">Solo</option>
          <option value="Group">Group</option>
        </select>
        <button
          className="bg-[#2E4A47] px-4 py-2 rounded-lg text-white"
          onClick={handleRefresh}>
          Refresh
        </button>
      </div>

      <div className="mt-8 grid grid-cols-1 md:grid-cols-1 lg:grid-cols-1 gap-6 w-full">
        {currentTrips.length > 0 ? (
          currentTrips.map((trip) => (
            <TripCard
              key={trip.id} // Ensure unique key
              trip={trip}
              onClick={() => handleTripClick(trip)}
            />
          ))
        ) : (
          <p className="text-gray-600 text-center w-full">No trips found.</p>
        )}
      </div>

      {totalPages > 1 && (
        <div className="flex justify-center items-center gap-3 mt-10">
          <button
            className="bg-[#2E4A47] text-white px-3 py-1 rounded disabled:opacity-50"
            onClick={() => handlePageChange(currentPage - 1)}
            disabled={currentPage === 1}>
            Previous
          </button>
          {Array.from({ length: totalPages }, (_, index) => index + 1).map(
            (page) => (
              <button
                key={`page-${page}`} // Unique key with prefix
                className={`px-3 py-1 rounded ${
                  currentPage === page
                    ? "bg-[#2E4A47] text-white"
                    : "bg-white border border-[#2E4A47] text-[#2E4A47]"
                }`}
                onClick={() => handlePageChange(page)}>
                {page}
              </button>
            )
          )}
          <button
            className="bg-[#2E4A47] text-white px-3 py-1 rounded disabled:opacity-50"
            onClick={() => handlePageChange(currentPage + 1)}
            disabled={currentPage === totalPages}>
            Next
          </button>
        </div>
      )}

      {/* Bid Modal */}
      {showBidModal && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white p-6 rounded-lg w-full max-w-md">
            <h2 className="text-xl font-bold mb-4">Submit Bid for Trip</h2>
            <form onSubmit={handleBidSubmit}>
              <div className="mb-4">
                <label className="block text-sm font-medium mb-1">
                  Proposed Itinerary
                </label>
                <textarea
                  name="proposedItinerary"
                  value={bidData.proposedItinerary}
                  onChange={handleBidChange}
                  className="w-full p-2 border rounded-lg"
                  rows="4"
                  required
                />
              </div>
              <div className="mb-4">
                <label className="block text-sm font-medium mb-1">
                  Total Price (USD)
                </label>
                <input
                  type="number"
                  name="pricingTotal"
                  value={bidData.pricingTotal}
                  onChange={handleBidChange}
                  className="w-full p-2 border rounded-lg"
                  required
                />
              </div>
              <div className="mb-4">
                <label className="block text-sm font-medium mb-1">
                  Accommodation Plan
                </label>
                <input
                  type="text"
                  name="accommodationPlan"
                  value={bidData.accommodationPlan}
                  onChange={handleBidChange}
                  className="w-full p-2 border rounded-lg"
                  required
                />
              </div>
              <div className="mb-4">
                <label className="block text-sm font-medium mb-1">
                  Transportation Plan
                </label>
                <input
                  type="text"
                  name="transportationPlan"
                  value={bidData.transportationPlan}
                  onChange={handleBidChange}
                  className="w-full p-2 border rounded-lg"
                  required
                />
              </div>
              <div className="mb-4">
                <label className="block text-sm font-medium mb-1">
                  Food Plan
                </label>
                <input
                  type="text"
                  name="foodPlan"
                  value={bidData.foodPlan}
                  onChange={handleBidChange}
                  className="w-full p-2 border rounded-lg"
                  required
                />
              </div>
              {error && (
                <div className="text-red-500 text-sm mb-4">{error}</div>
              )}
              <div className="flex justify-end gap-2">
                <button
                  type="button"
                  onClick={handleCloseModal}
                  className="px-4 py-2 bg-gray-300 rounded-lg">
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-4 py-2 bg-[#2E4A47] text-white rounded-lg">
                  Submit Bid
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}

export default AgDashboard;
