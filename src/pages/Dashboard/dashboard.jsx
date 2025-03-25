/** @format */

import { useNavigate } from "react-router-dom";
import { useUser } from "../../context/UserContext";
import DashboardLayout from "../../components/DashboardLayout"; // Adjust path as needed

function Dashboard() {
  const { user, logout } = useUser();
  const navigate = useNavigate();

  const handleLogout = async () => {
    await logout();
    navigate("/"); // Redirect to home after logout
  };

  if (!user) {
    navigate("/"); // Redirect to home if user is not authenticated
  }

  return (
    <DashboardLayout>
      <h1 className=" mb-10 ">Welcome to the Dashboard</h1>
      <p className="text-[#2E4A47] mb-2">Email: {user.email}</p>
      <p className="text-[#2E4A47] mb-4">Role: {user.role}</p>

      {/* Optional: Add more content to test scrolling */}
      <div className="h-[150vh] bg-white p-4 rounded-md shadow">
        <p className="text-[#2E4A47]">
          This is a placeholder to test scrolling. Add more content here to see
          the scroll behavior while the header and sidebar remain fixed.
        </p>
      </div>
    </DashboardLayout>
  );
}

export default Dashboard;
