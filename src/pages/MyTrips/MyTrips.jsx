/** @format */

import DashboardLayout from "@/components/DashboardLayout";
import { useEffect, useState } from "react";
import { useUser } from "@/context/UserContext";
import { useTripRequest } from "@/context/TripRequestContext";
import { db } from "../../../firebase.config";
import { collection, query, where, getDocs } from "firebase/firestore";
import illustration from "../../assets/images/undraw_vintage_q09n.svg";
import TripCard from "@/components/dashcomponents/TripCard";
import { useNavigate } from "react-router-dom";

function MyTrips() {
  const { user } = useUser();
  const { setTrip } = useTripRequest();
  const navigate = useNavigate();

  const [trips, setTrips] = useState([]);
  const [filteredTrips, setFilteredTrips] = useState([]);
  const [searchTerm, setSearchTerm] = useState(""); // For destination search
  const [startDateFilter, setStartDateFilter] = useState(""); // For start date filter
  const [travelTypeFilter, setTravelTypeFilter] = useState(""); // For traveler type filter
  const [currentPage, setCurrentPage] = useState(1);
  const tripsPerPage = 6;

  // Fetch trips from Firestore
  useEffect(() => {
    const fetchTrips = async () => {
      if (!user?.email || !user?.uid) {
        console.log("User not authenticated or missing email/uid.");
        return;
      }

      try {
        const tripsRef = collection(db, "tripRequests");
        const q = query(
          tripsRef,
          where("userInfo.email", "==", user.email),
          where("userInfo.uid", "==", user.uid)
        );
        const querySnapshot = await getDocs(q);
        const tripsData = querySnapshot.docs.map((doc) => ({
          id: doc.id,
          ...doc.data(),
        }));
        setTrips(tripsData);
        setFilteredTrips(tripsData);
      } catch (err) {
        console.error("Error fetching trips:", err);
      }
    };

    fetchTrips();
  }, [user]);

  // Apply filters whenever searchTerm, startDateFilter, or travelTypeFilter changes
  useEffect(() => {
    let filtered = trips;

    // Filter by destination (search term)
    if (searchTerm.trim() !== "") {
      filtered = filtered.filter((trip) =>
        trip?.tripDetails?.destinations
          ?.join(", ")
          .toLowerCase()
          .includes(searchTerm.toLowerCase())
      );
    }

    // Filter by start date
    if (startDateFilter) {
      filtered = filtered.filter(
        (trip) => trip?.tripDetails?.startDate === startDateFilter
      );
    }

    // Filter by traveler type
    if (travelTypeFilter && travelTypeFilter !== "Traveler's type") {
      filtered = filtered.filter(
        (trip) => trip?.tripDetails?.travelType === travelTypeFilter
      );
    }

    setFilteredTrips(filtered);
    setCurrentPage(1); // Reset to first page when filters change
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

  const handleTripClick = (selectedTrip) => {
    try {
      // Verify that the authenticated user matches the trip creator
      if (
        !selectedTrip.userInfo ||
        selectedTrip.userInfo.email !== user.email ||
        selectedTrip.userInfo.uid !== user.uid
      ) {
        throw new Error("You do not have permission to view this trip.");
      }

      // Set the trip in context and navigate
      setTrip(selectedTrip);
      console.log("Selected trip:", selectedTrip);
      navigate("/view-details");
    } catch (error) {
      console.error("Error accessing trip:", error.message);
      alert(error.message || "You do not have permission to view this trip.");
    }
  };

  // Handle Refresh button (reloads the page)
  const handleRefresh = () => {
    window.location.reload(); // Reloads the page to reset filters and fetch fresh data
  };

  return (
    <DashboardLayout>
      <div className="min-h-screen bg-[#F5F6F5] p-6">
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-6">
          <div>
            <h1 className="text-3xl md:text-5xl font-bold text-[#2E4A47]">
              Explore Your Travel Requests
            </h1>
          </div>
          <img
            src={illustration}
            alt="Travel Illustration"
            className="w-full max-w-xs md:w-1/3"
          />
        </div>

        <div className="mt-8 flex flex-col md:flex-row gap-4">
          {/* Destination Search Input */}
          <input
            type="text"
            placeholder="Search by destination..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="w-full md:w-1/3 p-3 border rounded-lg"
          />

          {/* Start Date Filter */}
          <div className="w-full md:w-1/3">
            <input
              type="date"
              value={startDateFilter}
              onChange={(e) => setStartDateFilter(e.target.value)}
              className="w-full p-3 border rounded-lg"
              placeholder="Select start date"
            />
          </div>

          {/* Traveler Type Filter */}
          <select
            value={travelTypeFilter}
            onChange={(e) => setTravelTypeFilter(e.target.value)}
            className="p-3 rounded-lg border w-full md:w-1/3">
            <option value="">Traveler's type</option>
            <option value="Solo">Solo</option>
            <option value="Group">Group</option>
          </select>

          {/* Refresh Button */}
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
                key={trip.id}
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
                  key={page}
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
    </DashboardLayout>
  );
}

export default MyTrips;
