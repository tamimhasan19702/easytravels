/** @format */

import { ReactLenis } from "@studio-freight/react-lenis";
import { useEffect, useState } from "react";
import Preloader from "./components/Preloader";
import Home from "./pages/home/Home";
import { Routes, Route } from "react-router-dom";
import PublicRoute from "./components/PublicRoute";
import ProtectedRoute from "./components/ProtectedRoute";
import { UserProvider } from "./context/UserContext";
import Signup from "./pages/Auth/Signup";
import Login from "./pages/Auth/Login";
import Dashboard from "./pages/Dashboard/dashboard";
import TripRequest from "./pages/TripReq/TripRequest";
import { TripRequestProvider } from "./context/TripRequestContext";
import FinalTripRequest from "./pages/TripReq/FinalTripRequest";
import MyTrips from "./pages/MyTrips/MyTrips";
import ViewDetails from "./pages/Details/ViewDetails";
import AgentDashboard from "./pages/Dashboard/agentDashboard";
import Contact from "./pages/Contact/Contact";
import Bookings from "./pages/Bookings/Bookings";
import Profile from "./pages/Profile/Profile";
import Settings from "./pages/Settings/Settings";
import AgentManageBookings from "./pages/Bookings/AgentManageBookings";
import AgentDestinations from "./pages/MyTrips/AgentDestinations";
import SupportTickets from "./pages/Details/SupportTickets";
import AgentProfile from "./pages/Profile/AgentProfile";
import AgentSettings from "./pages/Settings/AgentSettings";

const App = () => {
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    setTimeout(() => {
      setLoading(false);
    }, 2000);
  }, []);
  return (
    <>
      {loading ? (
        <Preloader />
      ) : (
        <UserProvider>
          <TripRequestProvider>
            <ReactLenis root>
              <Routes>
                <Route path="/" element={<Home />} />
                <Route path="/contact" element={<Contact />} />

                {/* publicroute */}

                <Route element={<PublicRoute />}>
                  <Route path="/signup" element={<Signup />} />
                  <Route path="/login" element={<Login />} />
                </Route>

                {/* protectedroute */}

                <Route element={<ProtectedRoute />}>
                  {/* Traveler */}
                  <Route path="dashboard" element={<Dashboard />} />
                  <Route path="trip-request" element={<TripRequest />} />
                  <Route path="bookings" element={<Bookings />} />
                  <Route path="profile" element={<Profile />} />
                  <Route path="settings" element={<Settings />} />
                  <Route path="final-tripreq" element={<FinalTripRequest />} />
                  <Route path="my-trips" element={<MyTrips />} />
                  <Route path="view-details" element={<ViewDetails />} />
                  {/* agent */}
                  <Route path="agent-dashboard" element={<AgentDashboard />} />
                  <Route
                    path="agent-manage-bookings"
                    element={<AgentManageBookings />}
                  />
                  <Route
                    path="agent-destinations"
                    element={<AgentDestinations />}
                  />
                  <Route
                    path="agent-support-tickets"
                    element={<SupportTickets />}
                  />
                  <Route path="agent-profile" element={<AgentProfile />} />
                  <Route path="agent-settings" element={<AgentSettings />} />
                </Route>
              </Routes>
            </ReactLenis>
          </TripRequestProvider>
        </UserProvider>
      )}
    </>
  );
};

export default App;
