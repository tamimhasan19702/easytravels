/** @format */

import { useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { useUser } from "../../context/UserContext";
import DashboardLayout from "../../components/DashboardLayout"; // Adjust path as needed
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
import { stats, upcomingBookings, recentTrips, graphData } from "@/constant";
import AgDashboard from "@/components/AgencyComponents/AgDashboard";
import { useState } from "react";

// Register Chart.js components
ChartJS.register(
  CategoryScale,
  LinearScale,
  BarElement,
  Title,
  Tooltip,
  Legend
);

function AgentDashboard() {
  const { user, loading } = useUser();
  const navigate = useNavigate();
  const [activeTab, setActiveTab] = useState("Overview"); // State for tabs

  // Redirect if not authenticated or still loading
  useEffect(() => {
    if (!loading && !user && !user?.role === "agent") {
      navigate("/");
    }
    console.log(user);
  }, [user, loading, navigate]);

  // Show loading state while UserContext initializes
  if (loading) {
    return (
      <DashboardLayout>
        <div className="bg-[#F5F6F5] min-h-screen p-6">
          <p className="text-[#2E4A47] text-lg font-medium">Loading...</p>
        </div>
      </DashboardLayout>
    );
  }

  // Redirect if user is not authenticated
  if (!user) {
    return null;
  }

  return (
    <DashboardLayout>
      <div className="bg-[#F5F6F5] min-h-screen p-6">
        {/* Header and User Info Section */}
        <div className="flex flex-col md:flex-row md:items-start md:space-x-8">
          {/* Left Side: User Info */}
          <div className="md:w-1/3">
            <h1 className="text-3xl font-bold text-[#2E4A47] mb-6">
              Welcome to the Agency Dashboard
            </h1>

            {/* Display user data from UserContext */}
            <div className="mb-6">
              <p className="text-[#2E4A47] text-base font-semibold mb-2">
                Full Name: <span className="font-normal">{user.fullName}</span>
              </p>
              <p className="text-[#2E4A47] text-base font-semibold mb-2">
                Email: <span className="font-normal">{user.email}</span>
              </p>
              <p className="text-[#2E4A47] text-base font-semibold mb-2">
                Role: <span className="font-normal">{user.role}</span>
              </p>
              <p className="text-[#2E4A47] text-base font-semibold mb-4">
                Phone Number:{" "}
                <span className="font-normal">{user.phoneNumber}</span>
              </p>

              {user.role === "Traveler" && (
                <button
                  onClick={() => navigate("/trip-request")}
                  className="bg-[#9DAE11] text-white py-2 px-4 rounded-md font-medium hover:bg-[#8C9A0F] transition-colors flex items-center">
                  <span className="material-icons mr-2">add</span>
                  Trip Request
                </button>
              )}
            </div>
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

        {user.role === "agent" && <AgDashboard />}
      </div>
    </DashboardLayout>
  );
}

export default AgentDashboard;
