/** @format */

import DashboardLayout from "@/components/DashboardLayout";
import { useEffect, useState } from "react";
import { useUser } from "@/context/UserContext";
import { useTripRequest } from "@/context/TripRequestContext";
import { db } from "../../../firebase.config";
import { collection, query, where, getDocs } from "firebase/firestore";
import illustration from "../../assets/images/undraw_vintage_q09n.svg";
import {
  FaUser,
  FaMapMarkerAlt,
  FaClock,
  FaMoneyBillWave,
} from "react-icons/fa";

// TripCard component
function TripCard({ trip, onClick }) {
  const calculateTimeLeft = (createdAt) => {
    const now = new Date();
    const created = new Date(createdAt);
    const diffMs = now - created;
    const diffHrs = Math.floor(diffMs / (1000 * 60 * 60));
    const diffMins = Math.floor((diffMs % (1000 * 60 * 60)) / (1000 * 60));
    const diffSecs = Math.floor((diffMs % (1000 * 60)) / 1000);
    return `${diffHrs}:${diffMins.toString().padStart(2, "0")}:${diffSecs
      .toString()
      .padStart(2, "0")}`;
  };

  return (
    <div className="bg-[#FFF5E6] border border-gray-200 rounded-lg p-4 shadow-sm flex flex-col gap-3 w-full">
      <div className="flex flex-col sm:flex-row sm:justify-between sm:items-center gap-2">
        <div className="flex items-center gap-2 overflow-hidden">
          <FaUser className="text-gray-600 flex-shrink-0" />
          <span className="text-gray-800 truncate">
            <strong>Travel Type:</strong> {trip.tripDetails.travelType} (
            {trip.tripDetails.maleCount +
              trip.tripDetails.femaleCount +
              trip.tripDetails.kidsCount}{" "}
            people)
          </span>
        </div>
        <div className="flex items-center gap-2 overflow-hidden">
          <FaMapMarkerAlt className="text-gray-600 flex-shrink-0" />
          <span className="text-gray-800 truncate">
            {trip.tripDetails.destinations.join(", ")}
          </span>
        </div>
      </div>
      <div className="text-gray-800 truncate">
        <strong>Dates:</strong> {trip.tripDetails.startDate} to{" "}
        {trip.tripDetails.endDate}
      </div>
      <div className="text-gray-800 truncate">
        <strong>Username:</strong> {trip.userInfo.email.split("@")[0]}
      </div>
      <div className="text-gray-800 truncate">
        <strong>Email:</strong> {trip.userInfo.email}
      </div>
      <div className="flex flex-col sm:flex-row sm:justify-between sm:items-center gap-2 mt-2">
        <button
          className="bg-[#FFB547] text-white px-4 py-2 rounded-lg flex items-center gap-2 w-full sm:w-auto"
          onClick={onClick}>
          <span className="text-lg">+</span> View Details
        </button>
        <div className="flex items-center gap-2 overflow-hidden">
          <FaClock className="text-gray-600 flex-shrink-0" />
          <span className="text-gray-800 truncate">
            Time Left: {calculateTimeLeft(trip.createdAt)}
          </span>
        </div>
        <div className="flex items-center gap-2 overflow-hidden">
          <FaMoneyBillWave className="text-gray-600 flex-shrink-0" />
          <span className="text-gray-800 truncate">
            Bid Status:{" "}
            {trip.bids.length > 0 ? `${trip.bids.length} Bids` : "No Bids Yet"}
          </span>
        </div>
      </div>
    </div>
  );
}

function MyTrips() {
  const { user } = useUser();
  const { trip, setTrip } = useTripRequest();

  const [trips, setTrips] = useState([]);
  const [filteredTrips, setFilteredTrips] = useState([]);
  const [searchTerm, setSearchTerm] = useState("");
  const [filterActivated, setFilterActivated] = useState(false);
  const [currentPage, setCurrentPage] = useState(1);
  const tripsPerPage = 6;

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
        setFilteredTrips(tripsData);
      } catch (err) {
        console.log("Error fetching trips:", err);
      }
    };

    fetchTrips();
  }, [user]);

  const handleSearchChange = (e) => {
    const value = e.target.value;
    setSearchTerm(value);
    setFilterActivated(true);
    setCurrentPage(1);

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

  const indexOfLastTrip = currentPage * tripsPerPage;
  const indexOfFirstTrip = indexOfLastTrip - tripsPerPage;
  const currentTrips = (filterActivated ? filteredTrips : trips).slice(
    indexOfFirstTrip,
    indexOfLastTrip
  );
  const totalPages = Math.ceil(
    (filterActivated ? filteredTrips : trips).length / tripsPerPage
  );

  const handlePageChange = (pageNumber) => {
    if (pageNumber >= 1 && pageNumber <= totalPages) {
      setCurrentPage(pageNumber);
    }
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
          <input
            type="text"
            placeholder="Search by destination..."
            value={searchTerm}
            onChange={handleSearchChange}
            className="w-full md:w-1/3 p-3 border rounded-lg"
          />
          <select
            className="p-3 rounded-lg border w-full md:w-1/4"
            onChange={(e) => {
              const value = e.target.value;
              if (value === "Destination") {
                setFilteredTrips(trips);
              } else {
                setFilteredTrips(
                  trips.filter((trip) =>
                    trip.tripDetails.destinations.includes(value)
                  )
                );
              }
              setFilterActivated(true);
              setCurrentPage(1);
            }}>
            <option>Destination</option>
            {[
              ...new Set(
                trips.flatMap((trip) => trip.tripDetails.destinations)
              ),
            ].map((dest) => (
              <option key={dest} value={dest}>
                {dest}
              </option>
            ))}
          </select>
          <select
            className="p-3 rounded-lg border w-full md:w-1/4"
            onChange={(e) => {
              const value = e.target.value;
              if (value === "Traveler's type") {
                setFilteredTrips(trips);
              } else {
                setFilteredTrips(
                  trips.filter((trip) => trip.tripDetails.travelType === value)
                );
              }
              setFilterActivated(true);
              setCurrentPage(1);
            }}>
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
                setCurrentPage(1);
              }}>
              Refresh
            </button>
            <button className="bg-[#FFB547] px-4 py-2 rounded-lg text-white">
              Filter
            </button>
          </div>
        </div>

        <div className="mt-8 grid grid-cols-1 md:grid-cols-1 lg:grid-cols-1 gap-6 w-full">
          {currentTrips.length > 0 ? (
            currentTrips.map((trip) => (
              <TripCard
                key={trip.id}
                trip={trip}
                onClick={() => setTrip(trip)}
              />
            ))
          ) : (
            <p className="text-gray-600 text-center w-full">No trips found.</p>
          )}
        </div>

        {totalPages > 1 && (
          <div className="flex justify-center items-center gap-3 mt-10">
            <button
              className="bg-[#FFB547] text-white px-3 py-1 rounded disabled:opacity-50"
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
                      ? "bg-[#FFB547] text-white"
                      : "bg-white border border-[#FFB547] text-[#FFB547]"
                  }`}
                  onClick={() => handlePageChange(page)}>
                  {page}
                </button>
              )
            )}
            <button
              className="bg-[#FFB547] text-white px-3 py-1 rounded disabled:opacity-50"
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
