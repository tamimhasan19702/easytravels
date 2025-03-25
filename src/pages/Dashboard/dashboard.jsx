/** @format */

import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { useUser } from "../../context/UserContext";
import DashboardLayout from "../../components/DashboardLayout"; // Adjust path as needed
import { db } from "../../../firebase.config";
import { collection, query, where, getDocs } from "firebase/firestore";
import travelIllustration from "../../assets/images/dashboard.svg"; // Adjust path to your illustration
import { Bar } from "react-chartjs-2"; // For the graph
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  BarElement,
  Title,
  Tooltip,
  Legend,
} from "chart.js";

// Register Chart.js components
ChartJS.register(
  CategoryScale,
  LinearScale,
  BarElement,
  Title,
  Tooltip,
  Legend
);

function Dashboard() {
  const { user, logout } = useUser();
  const navigate = useNavigate();
  const [dbUser, setDbUser] = useState(null);
  const [error, setError] = useState(null);
  const [isLoading, setIsLoading] = useState(true);
  const [activeTab, setActiveTab] = useState("Overview"); // State for tabs

  useEffect(() => {
    const fetchUserData = async () => {
      if (!user || !user.email) {
        setError("User not authenticated or email not available.");
        setIsLoading(false);
        navigate("/");
        return;
      }

      try {
        setIsLoading(true);
        setError(null);

        const usersRef = collection(db, "users");
        const q = query(usersRef, where("email", "==", user.email));
        const querySnapshot = await getDocs(q);

        if (querySnapshot.empty) {
          setError("No user found with this email in the database.");
          setIsLoading(false);
          return;
        }

        const userData = querySnapshot.docs[0].data();
        setDbUser(userData);
        setIsLoading(false);
      } catch (err) {
        console.error("Error fetching user data from Firestore:", err);
        setError("Failed to fetch user data. Please try again later.");
        setIsLoading(false);
      }
    };

    fetchUserData();
  }, [user, navigate]);

  const handleLogout = async () => {
    await logout();
    navigate("/");
  };

  if (!user) {
    navigate("/");
    return null;
  }

  // Demo data for the graph (trips per month)
  const graphData = {
    labels: ["Jan", "Feb", "Mar", "Apr", "May", "Jun"],
    datasets: [
      {
        label: "Trips Booked",
        data: [5, 3, 7, 4, 6, 2],
        backgroundColor: "#9DAE11",
        borderColor: "#8C9A0F",
        borderWidth: 1,
      },
    ],
  };

  // Demo data for recent trips
  const recentTrips = [
    {
      id: 1,
      destination: "Paris, France",
      date: "2025-04-10",
      status: "Completed",
    },
    {
      id: 2,
      destination: "Tokyo, Japan",
      date: "2025-05-15",
      status: "Upcoming",
    },
    {
      id: 3,
      destination: "New York, USA",
      date: "2025-03-01",
      status: "Completed",
    },
  ];

  // Demo data for upcoming bookings
  const upcomingBookings = [
    {
      id: 1,
      destination: "Tokyo, Japan",
      date: "2025-05-15",
      status: "Confirmed",
    },
    {
      id: 2,
      destination: "Sydney, Australia",
      date: "2025-06-20",
      status: "Pending",
    },
  ];

  // Demo stats
  const stats = {
    totalTrips: 15,
    totalSpent: "$5,230",
    favoriteDestination: "Paris, France",
  };

  return (
    <DashboardLayout>
      <div className="bg-[#F5F6F5] min-h-screen p-6">
        {/* Header and User Info Section */}
        <div className="flex flex-col md:flex-row md:items-start md:space-x-8">
          {/* Left Side: User Info */}
          <div className="md:w-1/3">
            <h1 className="text-3xl font-bold text-[#2E4A47] mb-6">
              Welcome to the Dashboard
            </h1>

            {/* Display loading state */}
            {isLoading && (
              <p className="text-[#2E4A47] text-lg font-medium mb-4">
                Loading user data...
              </p>
            )}

            {/* Display error if any */}
            {error && (
              <p className="text-red-500 text-lg font-medium mb-4">{error}</p>
            )}

            {/* Display user data if available */}
            {dbUser && !isLoading && !error && (
              <div className="mb-6">
                <p className="text-[#2E4A47] text-base font-semibold mb-2">
                  Full Name:{" "}
                  <span className="font-normal">{dbUser.fullName}</span>
                </p>
                <p className="text-[#2E4A47] text-base font-semibold mb-2">
                  Email: <span className="font-normal">{dbUser.email}</span>
                </p>
                <p className="text-[#2E4A47] text-base font-semibold mb-2">
                  Role: <span className="font-normal">{dbUser.role}</span>
                </p>
                <p className="text-[#2E4A47] text-base font-semibold mb-4">
                  Phone Number:{" "}
                  <span className="font-normal">{dbUser.phoneNumber}</span>
                </p>

                {/* Trip Request Button */}
                <button
                  onClick={() => navigate("/trip-request")}
                  className="bg-[#9DAE11] text-white py-2 px-4 rounded-md font-medium hover:bg-[#8C9A0F] transition-colors flex items-center">
                  <span className="material-icons mr-2">add</span>
                  Trip Request
                </button>
              </div>
            )}
          </div>

          {/* Right Side: Illustration */}
          <div className="md:w-2/3 flex justify-center md:justify-end">
            <img
              src={travelIllustration}
              alt="Travel Illustration"
              className="w-full max-w-md h-auto"
            />
          </div>
        </div>

        {/* Tabs Section */}
        <div className="mt-8">
          <div className="flex border-b border-gray-200">
            <button
              onClick={() => setActiveTab("Overview")}
              className={`py-2 px-4 font-medium ${
                activeTab === "Overview"
                  ? "border-b-2 border-[#9DAE11] text-[#2E4A47]"
                  : "text-gray-500"
              }`}>
              Overview
            </button>
            <button
              onClick={() => setActiveTab("RecentTrips")}
              className={`py-2 px-4 font-medium ${
                activeTab === "RecentTrips"
                  ? "border-b-2 border-[#9DAE11] text-[#2E4A47]"
                  : "text-gray-500"
              }`}>
              Recent Trips
            </button>
            <button
              onClick={() => setActiveTab("UpcomingBookings")}
              className={`py-2 px-4 font-medium ${
                activeTab === "UpcomingBookings"
                  ? "border-b-2 border-[#9DAE11] text-[#2E4A47]"
                  : "text-gray-500"
              }`}>
              Upcoming Bookings
            </button>
          </div>

          {/* Tab Content */}
          <div className="mt-6">
            {activeTab === "Overview" && (
              <div>
                {/* Quick Stats */}
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-6">
                  <div className="bg-white p-4 rounded-lg shadow-md">
                    <h3 className="text-[#2E4A47] font-semibold">
                      Total Trips
                    </h3>
                    <p className="text-2xl font-bold text-[#9DAE11]">
                      {stats.totalTrips}
                    </p>
                  </div>
                  <div className="bg-white p-4 rounded-lg shadow-md">
                    <h3 className="text-[#2E4A47] font-semibold">
                      Total Spent
                    </h3>
                    <p className="text-2xl font-bold text-[#9DAE11]">
                      {stats.totalSpent}
                    </p>
                  </div>
                  <div className="bg-white p-4 rounded-lg shadow-md">
                    <h3 className="text-[#2E4A47] font-semibold">
                      Favorite Destination
                    </h3>
                    <p className="text-2xl font-bold text-[#9DAE11]">
                      {stats.favoriteDestination}
                    </p>
                  </div>
                </div>

                {/* Graph: Trips Per Month */}
                <div className="bg-white p-6 rounded-lg shadow-md">
                  <h3 className="text-[#2E4A47] font-semibold mb-4">
                    Trips Per Month
                  </h3>
                  <div className="h-64">
                    <Bar
                      data={graphData}
                      options={{
                        responsive: true,
                        maintainAspectRatio: false,
                        scales: {
                          y: {
                            beginAtZero: true,
                            title: {
                              display: true,
                              text: "Number of Trips",
                            },
                          },
                          x: {
                            title: {
                              display: true,
                              text: "Month",
                            },
                          },
                        },
                      }}
                    />
                  </div>
                </div>
              </div>
            )}

            {activeTab === "RecentTrips" && (
              <div className="bg-white p-6 rounded-lg shadow-md">
                <h3 className="text-[#2E4A47] font-semibold mb-4">
                  Recent Trips
                </h3>
                <div className="overflow-x-auto">
                  <table className="w-full text-left">
                    <thead>
                      <tr className="border-b">
                        <th className="py-2 px-4 text-[#2E4A47] font-semibold">
                          Destination
                        </th>
                        <th className="py-2 px-4 text-[#2E4A47] font-semibold">
                          Date
                        </th>
                        <th className="py-2 px-4 text-[#2E4A47] font-semibold">
                          Status
                        </th>
                      </tr>
                    </thead>
                    <tbody>
                      {recentTrips.map((trip) => (
                        <tr key={trip.id} className="border-b">
                          <td className="py-2 px-4 text-[#2E4A47]">
                            {trip.destination}
                          </td>
                          <td className="py-2 px-4 text-[#2E4A47]">
                            {trip.date}
                          </td>
                          <td className="py-2 px-4">
                            <span
                              className={`inline-block py-1 px-3 rounded-full text-sm ${
                                trip.status === "Completed"
                                  ? "bg-green-100 text-green-700"
                                  : "bg-yellow-100 text-yellow-700"
                              }`}>
                              {trip.status}
                            </span>
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              </div>
            )}

            {activeTab === "UpcomingBookings" && (
              <div className="bg-white p-6 rounded-lg shadow-md">
                <h3 className="text-[#2E4A47] font-semibold mb-4">
                  Upcoming Bookings
                </h3>
                <div className="overflow-x-auto">
                  <table className="w-full text-left">
                    <thead>
                      <tr className="border-b">
                        <th className="py-2 px-4 text-[#2E4A47] font-semibold">
                          Destination
                        </th>
                        <th className="py-2 px-4 text-[#2E4A47] font-semibold">
                          Date
                        </th>
                        <th className="py-2 px-4 text-[#2E4A47] font-semibold">
                          Status
                        </th>
                      </tr>
                    </thead>
                    <tbody>
                      {upcomingBookings.map((booking) => (
                        <tr key={booking.id} className="border-b">
                          <td className="py-2 px-4 text-[#2E4A47]">
                            {booking.destination}
                          </td>
                          <td className="py-2 px-4 text-[#2E4A47]">
                            {booking.date}
                          </td>
                          <td className="py-2 px-4">
                            <span
                              className={`inline-block py-1 px-3 rounded-full text-sm ${
                                booking.status === "Confirmed"
                                  ? "bg-green-100 text-green-700"
                                  : "bg-yellow-100 text-yellow-700"
                              }`}>
                              {booking.status}
                            </span>
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              </div>
            )}
          </div>
        </div>
      </div>
    </DashboardLayout>
  );
}

export default Dashboard;
