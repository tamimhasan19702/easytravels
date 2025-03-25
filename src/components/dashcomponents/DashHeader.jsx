/** @format */

import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { useUser } from "../../context/UserContext"; // Adjust path as needed
import DashSidebar from "./DashSidebar";

const DashHeader = () => {
  const { user, logout } = useUser(); // Get user and logout from context
  const navigate = useNavigate();
  const [isDropdownOpen, setIsDropdownOpen] = useState(false); // State for dropdown visibility

  const handleLogout = async () => {
    await logout(); // Call logout from context
    navigate("/"); // Redirect to home after logout
  };

  const toggleDropdown = () => {
    setIsDropdownOpen(!isDropdownOpen);
  };

  return (
    <>
      {/* Fixed Top Bar */}
      <header className="fixed top-0 left-0 md:left-64 w-full md:w-[calc(100%-16rem)] h-16 bg-[#e2e6bd] flex items-center justify-between px-6 border-b border-gray-200 z-30">
        {/* Center the text on mobile, align left on larger screens */}
        <div className="text-[#2E4A47] text-lg font-semibold text-center md:text-left flex-1">
          Dashboard
        </div>

        {/* User Icon with Dropdown */}
        <div className="relative">
          <button
            onClick={toggleDropdown}
            className="flex items-center text-[#2E4A47] focus:outline-none">
            <span className="material-icons text-2xl">account_circle</span>
            <span className="ml-2 hidden md:inline">
              {user?.email || "User"}
            </span>
          </button>

          {/* Dropdown Menu */}
          {isDropdownOpen && (
            <div className="absolute right-0 mt-2 w-48 bg-white rounded-md shadow-lg z-40">
              <Link
                to="/profile"
                className="block px-4 py-2 text-[#2E4A47] hover:bg-[#A8C686] hover:text-white transition-colors"
                onClick={() => setIsDropdownOpen(false)}>
                Profile
              </Link>
              <Link
                to="/settings"
                className="block px-4 py-2 text-[#2E4A47] hover:bg-[#A8C686] hover:text-white transition-colors"
                onClick={() => setIsDropdownOpen(false)}>
                Settings
              </Link>
            </div>
          )}
        </div>
      </header>

      {/* Fixed Sidebar */}
      <DashSidebar />
    </>
  );
};

export default DashHeader;
