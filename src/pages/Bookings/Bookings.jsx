/** @format */
import DashboardLayout from "@/components/DashboardLayout";
import { useUser } from "@/context/UserContext";
import { useNavigate } from "react-router-dom";
import { useEffect } from "react";

function Bookings() {
  const { user, loading } = useUser();
  const navigate = useNavigate();
  //const { trip } = useTripRequest();

  useEffect(() => {
    if (!loading && !user && !user?.role === "Traveler") {
      navigate("/");
    }
    console.log(user);
  }, [user, loading, navigate]);

  return (
    <DashboardLayout>
      <div>Bookings</div>
    </DashboardLayout>
  );
}

export default Bookings;
