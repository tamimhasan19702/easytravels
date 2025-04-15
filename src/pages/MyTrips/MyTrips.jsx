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
        setFilteredTrips(tripsData); // show all initially
      } catch (err) {
        console.log("Error fetching trips:", err);
      }
    };

    fetchTrips();
  }, [user]);

  // Run filtering only when user types something
  const handleSearchChange = (e) => {
    const value = e.target.value;
    setSearchTerm(value);
    setFilterActivated(true);

    if (value.trim() === "") {
      setFilterActivated(false);
      setFilteredTrips(trips);
    } else {
      const filtered = trips.filter((trip) =>
        trip?.location?.toLowerCase().includes(value.toLowerCase())
      );
      setFilteredTrips(filtered);
    }
  };

  return (
    <DashboardLayout>
      <div className="min-h-screen bg-[#F5F6F5] p-6">
        {/* Header */}
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-6">
          <div>
            <h1 className="text-3xl md:text-5xl font-bold text-[#2E4A47]">
              Explore New Travel Requests
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
          {/* Future Filters */}
          <select className="p-3 rounded-lg border w-full md:w-1/4">
            <option>Destination</option>
          </select>
          <select className="p-3 rounded-lg border w-full md:w-1/4">
            <option>Traveler's type</option>
          </select>
          <div className="flex gap-2">
            <button
              className="bg-[#FFB547] px-4 py-2 rounded-lg text-white"
              onClick={() => {
                // Reset everything
                setSearchTerm("");
                setFilterActivated(false);
                setFilteredTrips(trips);
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
          {(filterActivated ? filteredTrips : trips).length > 0 ? (
            (filterActivated ? filteredTrips : trips).map((trip) => (
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

        {/* Pagination (UI only) */}
        <div className="flex justify-center items-center gap-3 mt-10">
          <button className="bg-[#FFB547] text-white px-3 py-1 rounded">
            1
          </button>
          <button className="bg-white border border-[#FFB547] text-[#FFB547] px-3 py-1 rounded">
            2
          </button>
          <button className="bg-white border border-[#FFB547] text-[#FFB547] px-3 py-1 rounded">
            3
          </button>
          <button className="bg-black text-white px-5 py-2 rounded">
            View more
          </button>
        </div>
      </div>
    </DashboardLayout>
  );
}

export default MyTrips;
