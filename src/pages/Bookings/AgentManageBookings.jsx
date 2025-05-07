/** @format */

import DashboardLayout from "@/components/DashboardLayout";
import { useUser } from "@/context/UserContext";
import { useNavigate } from "react-router-dom";
import { useTripRequest } from "@/context/TripRequestContext";
import { useEffect } from "react";

function AgentManageBookings() {
  const { user, loading } = useUser();
  const navigate = useNavigate();
  //const { trip } = useTripRequest();

  useEffect(() => {
    if (!loading && !user && !user?.role === "agent") {
      navigate("/");
    }
    console.log(user);
  }, [user, loading, navigate]);

  return (
    <DashboardLayout>
      <div>AgentManageBookings</div>
    </DashboardLayout>
  );
}

export default AgentManageBookings;
