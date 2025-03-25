/** @format */

import { Link } from "react-router-dom";
import { useUser } from "../context/UserContext"; // Adjust path as needed
import brand from "../assets/images/1.png";

const Header = () => {
  const { user } = useUser(); // Get user from context to check if logged in

  return (
    <header className="fixed backdrop-blur-md inset-x-0 w-[100vw] border-b-[1px] border-[#EAE8F3] z-[100] lg:py-2 py-5 bg-white/5">
      <div className="container flex items-center justify-between">
        {/* Logo */}
        <Link to="/">
          <img src={brand} alt="logo" className="w-[400px]" />
        </Link>

        {/* Conditional Buttons based on user authentication */}
        <div className="flex items-center gap-5">
          {user ? (
            // Show Dashboard button if user is logged in
            <Link to="/dashboard" className="btn primary_btn !py-4">
              DASHBOARD
            </Link>
          ) : (
            // Show Log In and Sign Up buttons if user is not logged in
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
  );
};

export default Header;
