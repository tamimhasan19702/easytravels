/** @format */

import { useEffect, useState } from "react";
import { useUser } from "@/context/UserContext";
import { useTripRequest } from "@/context/TripRequestContext";
import { useNavigate } from "react-router-dom";
import TripCard from "../dashcomponents/TripCard";

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
  const tripsPerPage = 6;

  // Fetch all trips on mount
  useEffect(() => {
    const loadTrips = async () => {
      if (!user || user.role !== "agent") {
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

  // Handle trip click to navigate to view-details
  const handleTripClick = (trip) => {
    try {
      if (trip.deadline && new Date(trip.deadline) < new Date()) {
        setError("Bidding is closed for this trip.");
        return;
      }
      if (trip.status !== "pending") {
        setError("This trip is not open for bidding.");
        return;
      }
      setTrip(trip);
      console.log("Selected trip:", trip);
      navigate("/view-details");
    } catch (error) {
      console.error("Error selecting trip:", error);
      setError("Failed to view trip details.");
    }
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
    </div>
  );
}

export default AgDashboard;
