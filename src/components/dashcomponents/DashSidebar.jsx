/** @format */

import { useState, useEffect, useRef } from "react";
import { useNavigate } from "react-router-dom";
import { useUser } from "../../context/UserContext";
import { Link } from "react-router-dom";
import brand from "../../assets/images/2.png";

function DashSidebar() {
  const { logout } = useUser();
  const navigate = useNavigate();
  const [isSidebarOpen, setIsSidebarOpen] = useState(false); // State to toggle sidebar on mobile
  const sidebarRef = useRef(null); // Ref to track clicks outside the sidebar

  const handleLogout = async () => {
    await logout();
    navigate("/"); // Redirect to home after logout
  };

  const toggleSidebar = () => {
    setIsSidebarOpen(!isSidebarOpen);
  };

  // Close sidebar when clicking outside (on the white space/overlay)
  useEffect(() => {
    const handleClickOutside = (event) => {
      if (
        isSidebarOpen &&
        sidebarRef.current &&
        !sidebarRef.current.contains(event.target) &&
        !event.target.closest(".hamburger-button") // Exclude clicks on the hamburger button
      ) {
        setIsSidebarOpen(false);
      }
    };
    document.addEventListener("mousedown", handleClickOutside);
    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, [isSidebarOpen]);

  return (
    <>
      {/* Hamburger Menu Button for Mobile */}
      <button
        className="md:hidden fixed top-2 left-2 z-50 text-[#2E4A47]  p-2 rounded-md hamburger-button"
        onClick={toggleSidebar}>
        <span className="material-icons text-3xl block">
          {isSidebarOpen ? "close" : "menu"}
        </span>
      </button>

      {/* Overlay for Mobile (to handle white space click) */}
      {isSidebarOpen && (
        <div
          className="md:hidden fixed inset-0 bg-black bg-opacity-50 z-30"
          onClick={() => setIsSidebarOpen(false)}
        />
      )}

      {/* Sidebar */}
      <div
        ref={sidebarRef}
        className={`w-64 bg-[#e2e6bd] fixed top-0 left-0 h-screen p-5 flex flex-col border-r border-gray-200 z-40 transition-transform duration-300 ${
          isSidebarOpen ? "translate-x-0" : "-translate-x-full"
        } md:translate-x-0`}>
        {/* Brand Logo (below the hamburger/close icon in mobile view) */}
        <Link to="/" className="flex-0 mb-6 mt-12 md:mt-0">
          <img
            src={brand}
            alt="logo"
            className="w-full max-w-[50px] h-auto object-contain"
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
                to="/my-trips"
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
          className="w-full primary_btn !py-3 rounded-md flex items-center justify-center">
          <span className="material-icons mr-2 align-middle">logout</span>
          Logout
        </button>
      </div>
    </>
  );
}

export default DashSidebar;
