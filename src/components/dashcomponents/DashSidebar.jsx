/** @format */

import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { useUser } from "../../context/UserContext";
import { Link } from "react-router-dom";
import brand from "../../assets/images/1.png";

function DashSidebar() {
  const { logout } = useUser();
  const navigate = useNavigate();
  const [isSidebarOpen, setIsSidebarOpen] = useState(false); // State to toggle sidebar on mobile

  const handleLogout = async () => {
    await logout();
    navigate("/"); // Redirect to home after logout
  };

  const toggleSidebar = () => {
    setIsSidebarOpen(!isSidebarOpen);
  };

  return (
    <>
      {/* Hamburger Menu Button for Mobile */}
      <button
        className="md:hidden fixed top-4 left-4 z-50 text-[#2E4A47]"
        onClick={toggleSidebar}>
        <span className="material-icons text-3xl">
          {isSidebarOpen ? "close" : "menu"}
        </span>
      </button>

      {/* Sidebar */}
      <div
        className={`w-64 bg-[#e2e6bd] fixed top-0 left-0 h-screen p-5 flex flex-col border-r border-gray-200 z-40 transition-transform duration-300 ${
          isSidebarOpen ? "translate-x-0" : "-translate-x-full"
        } md:translate-x-0`}>
        {/* Brand Logo */}
        <Link to="/" className="flex-0 mb-6">
          <img
            src={brand}
            alt="logo"
            className="w-full max-w-[150px] h-auto object-contain"
          />
        </Link>

        {/* Navigation Links */}
        <nav className="flex-1">
          <ul className="list-none p-0">
            <li className="mb-4">
              <Link
                to="/dashboard"
                className="flex items-center text-[#2E4A47] text-base no-underline hover:text-[#A8C686] transition-colors">
                <span className="material-icons mr-2">dashboard</span>
                Dashboard
              </Link>
            </li>
            <li className="mb-4">
              <Link
                to="/trips"
                className="flex items-center text-[#2E4A47] text-base no-underline hover:text-[#A8C686] transition-colors">
                <span className="material-icons mr-2">luggage</span>
                My Trips
              </Link>
            </li>
            <li className="mb-4">
              <Link
                to="/bookings"
                className="flex items-center text-[#2E4A47] text-base no-underline hover:text-[#A8C686] transition-colors">
                <span className="material-icons mr-2">book_online</span>
                Bookings
              </Link>
            </li>
            <li className="mb-4">
              <Link
                to="/profile"
                className="flex items-center text-[#2E4A47] text-base no-underline hover:text-[#A8C686] transition-colors">
                <span className="material-icons mr-2">person</span>
                Profile
              </Link>
            </li>
            <li className="mb-4">
              <Link
                to="/settings"
                className="flex items-center text-[#2E4A47] text-base no-underline hover:text-[#A8C686] transition-colors">
                <span className="material-icons mr-2">settings</span>
                Settings
              </Link>
            </li>
          </ul>
        </nav>

        {/* Logout Button */}
        <button
          onClick={handleLogout}
          className="mt-auto bg-[#A8C686] text-white py-2 rounded-md hover:bg-[#8FAF6D] transition-colors">
          <span className="material-icons mr-2 align-middle">logout</span>
          Logout
        </button>
      </div>
    </>
  );
}

export default DashSidebar;
