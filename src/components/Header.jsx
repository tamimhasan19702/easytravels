/** @format */

import { useState } from "react";
import { Link } from "react-router-dom";
import brand from "../assets/images/1.png"; // adjust accordingly
import MenuIcon from "@mui/icons-material/Menu"; // MUI Material Icon
import CloseIcon from "@mui/icons-material/Close"; // Close icon
import { useUser } from "@/context/UserContext";

export default function Header() {
  const { user } = useUser();
  const [sidebarOpen, setSidebarOpen] = useState(false);

  const toggleSidebar = () => {
    setSidebarOpen(!sidebarOpen);
  };

  return (
    <>
      <header className="fixed backdrop-blur-md inset-x-0 w-[100vw] border-b-[1px] border-[#EAE8F3] z-[100] lg:py-2 py-5 bg-white/5">
        <div className="container flex items-center justify-between">
          {/* Logo */}
          <div className="lg:hidden">
            <Link to="/">
              <img src={brand} alt="logo" className="w-[200px]" />
            </Link>
          </div>

          <div className="hidden lg:block">
            <Link to="/">
              <img src={brand} alt="logo" className="w-[400px]" />
            </Link>
          </div>

          {/* Hamburger Icon for mobile */}
          <button onClick={toggleSidebar} className="lg:hidden text-black">
            <MenuIcon fontSize="large" />
          </button>

          {/* Desktop Navigation */}
          <div className="hidden lg:flex items-center gap-5">
            {user ? (
              <Link to="/dashboard" className="btn primary_btn !py-4">
                DASHBOARD
              </Link>
            ) : (
              <>
                <Link to="/login" className="btn white_btn !py-4">
                  LOG IN
                </Link>
                <Link to="/signup" className="btn primary_btn !py-4">
                  SIGN UP
                </Link>
              </>
            )}
          </div>
        </div>
      </header>

      {/* Overlay for Mobile (to handle white space click) */}
      {sidebarOpen && (
        <div
          className="fixed inset-0 bg-black bg-opacity-50 z-[998] transition-opacity duration-300 ease-in-out"
          onClick={toggleSidebar}
        />
      )}

      {/* Sidebar for Mobile */}
      <div
        className={`fixed top-0 left-0 h-full w-[250px] bg-white z-[999] transform transition-transform duration-300 ease-in-out ${
          sidebarOpen ? "translate-x-0" : "-translate-x-full"
        }`}>
        <div className="flex justify-between items-center p-5 border-b">
          <span className="font-bold text-lg">Menu</span>
          <button onClick={toggleSidebar}>
            <CloseIcon />
          </button>
        </div>
        <div className="flex flex-col gap-4 p-5">
          {user ? (
            <Link
              to="/dashboard"
              onClick={toggleSidebar}
              className="btn primary_btn">
              DASHBOARD
            </Link>
          ) : (
            <>
              <Link
                to="/login"
                onClick={toggleSidebar}
                className="btn white_btn">
                LOG IN
              </Link>
              <Link
                to="/signup"
                onClick={toggleSidebar}
                className="btn primary_btn">
                SIGN UP
              </Link>
            </>
          )}
        </div>
      </div>
    </>
  );
}
