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

                {/* publicroute */}

                <Route element={<PublicRoute />}>
                  <Route path="/signup" element={<Signup />} />
                  <Route path="/login" element={<Login />} />
                </Route>

                {/* protectedroute */}

                <Route element={<ProtectedRoute />}>
                  <Route path="dashboard" element={<Dashboard />} />
                  <Route path="trip-request" element={<TripRequest />} />
                  <Route path="trips" element={<div>Bookings Page</div>} />
                  <Route path="profile" element={<div>Profile Page</div>} />
                  <Route path="settings" element={<div>Settings Page</div>} />
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
