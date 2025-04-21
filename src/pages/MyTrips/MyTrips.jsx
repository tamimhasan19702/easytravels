/** @format */

import DashboardLayout from "@/components/DashboardLayout";
import { useEffect, useState } from "react";
import { useUser } from "@/context/UserContext";
import { useTripRequest } from "@/context/TripRequestContext";
import TripCard from "@/components/dashcomponents/TripCard";
import { db } from "../../../firebase.config";
import { collection, query, where, getDocs } from "firebase/firestore";
import illustration from "../../assets/images/undraw_vintage_q09n.svg";

function MyTrips() {
  const { user } = useUser();
  const { trip, setTrip } = useTripRequest();

  const [trips, setTrips] = useState([]);
  const [filteredTrips, setFilteredTrips] = useState([]);
  const [searchTerm, setSearchTerm] = useState("");
  const [filterActivated, setFilterActivated] = useState(false);
  // Pagination states
  const [currentPage, setCurrentPage] = useState(1);
  const tripsPerPage = 6; // Number of trips per page

  // Fetch all trips for logged-in user
  useEffect(() => {
    const fetchTrips = async () => {
      if (!user?.email) return;
      try {
        const tripsRef = collection(db, "tripRequests");
        const q = query(tripsRef, where("userInfo.email", "==", user.email));
        const querySnapshot = await getDocs(q);
        const tripsData = querySnapshot.docs.map((doc) => ({
          id: doc.id,
          ...doc.data(),
        }));
        setTrips(tripsData);
        setFilteredTrips(tripsData); // Show all initially
      } catch (err) {
        console.log("Error fetching trips:", err);
      }
    };

    fetchTrips();
  }, [user]);

  // Handle search by destination
  const handleSearchChange = (e) => {
    const value = e.target.value;
    setSearchTerm(value);
    setFilterActivated(true);
    setCurrentPage(1); // Reset to first page on search

    if (value.trim() === "") {
      setFilterActivated(false);
      setFilteredTrips(trips);
    } else {
      const filtered = trips.filter((trip) =>
        trip?.tripDetails?.destinations
          ?.join(", ")
          .toLowerCase()
          .includes(value.toLowerCase())
      );
      setFilteredTrips(filtered);
    }
  };

  // Pagination logic
  const indexOfLastTrip = currentPage * tripsPerPage;
  const indexOfFirstTrip = indexOfLastTrip - tripsPerPage;
  const currentTrips = (filterActivated ? filteredTrips : trips).slice(
    indexOfFirstTrip,
    indexOfLastTrip
  );
  console.log(currentTrips);
  const totalPages = Math.ceil(
    (filterActivated ? filteredTrips : trips).length / tripsPerPage
  );

  const handlePageChange = (pageNumber) => {
    setCurrentPage(pageNumber);
  };

  return (
    <DashboardLayout>
      <div className="min-h-screen bg-[#F5F6F5] p-6">
        {/* Header */}
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

        {/* Search & Filters */}
        <div className="mt-8 flex flex-col md:flex-row gap-4">
          <input
            type="text"
            placeholder="Search by destination..."
            value={searchTerm}
            onChange={handleSearchChange}
            className="w-full md:w-1/3 p-3 border rounded-lg"
          />
          <select className="p-3 rounded-lg border w-full md:w-1/4">
            <option>Destination</option>
            {/* Add destination options dynamically if needed */}
          </select>
          <select className="p-3 rounded-lg border w-full md:w-1/4">
            <option>Traveler's type</option>
            <option>Solo</option>
            <option>Family</option>
            <option>Group</option>
          </select>
          <div className="flex gap-2">
            <button
              className="bg-[#FFB547] px-4 py-2 rounded-lg text-white"
              onClick={() => {
                setSearchTerm("");
                setFilterActivated(false);
                setFilteredTrips(trips);
                setCurrentPage(1); // Reset to first page
              }}>
              Refresh
            </button>
            <button className="bg-[#FFB547] px-4 py-2 rounded-lg text-white">
              Filter
            </button>
          </div>
        </div>

        {/* Trip Cards Grid */}
        <div className="mt-8 grid grid-cols-1 md:grid-cols-2 lg:grid-cols-2 gap-6">
          {currentTrips.length > 0 ? (
            currentTrips.map((trip) => (
              <TripCard
                key={trip.id}
                trip={trip}
                onClick={() => setTrip(trip)}
              />
            ))
          ) : (
            <p className="text-gray-600">No trips found.</p>
          )}
        </div>

        {/* Pagination */}
        {totalPages > 1 && (
          <div className="flex justify-center items-center gap-3 mt-10">
            {Array.from({ length: totalPages }, (_, index) => index + 1).map(
              (page) => (
                <button
                  key={page}
                  className={`px-3 py-1 rounded ${
                    currentPage === page
                      ? "bg-[#FFB547] text-white"
                      : "bg-white border border-[#FFB547] text-[#FFB547]"
                  }`}
                  onClick={() => handlePageChange(page)}>
                  {page}
                </button>
              )
            )}
            <button
              className="bg-black text-white px-5 py-2 rounded"
              onClick={() => handlePageChange(currentPage + 1)}
              disabled={currentPage === totalPages}>
              View more
            </button>
          </div>
        )}
      </div>
    </DashboardLayout>
  );
}

export default MyTrips;
