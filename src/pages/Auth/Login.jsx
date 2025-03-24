/** @format */

import { useState } from "react";
import { useForm } from "react-hook-form";
import { Link, useNavigate } from "react-router-dom";
import Header from "../../components/Header";

function Login() {
  const [activeTab, setActiveTab] = useState("Traveler"); // State for tab switching (role selection)
  const [showPassword, setShowPassword] = useState(false); // State for password visibility
  const {
    register,
    handleSubmit,
    formState: { errors },
    setValue, // Added to dynamically set the role value
  } = useForm({
    defaultValues: {
      role: "Traveler", // Default role
    },
  });
  const navigate = useNavigate();

  // Update the role value in the form whenever the activeTab changes
  const handleTabChange = (tab) => {
    setActiveTab(tab);
    setValue("role", tab); // Update the role field in the form
  };

  const onSubmit = (data) => {
    console.log(data); // Will include { email, password, remember, role }
    // Add your sign-in logic here (e.g., API call with data.role)
    navigate("/"); // Redirect to home after successful sign-in
  };

  return (
    <>
      <Header />
      <div className="container flex items-center justify-start h-screen">
        {/* Left Side: Title */}
        <div className="w-1/2">
          <h1 className="text-center">login</h1>
        </div>

        {/* Right Side: Form */}
        <div className="w-1/2">
          <div className="bg-white p-8 rounded-lg shadow_1 w-full max-w-md">
            {/* Tabs */}
            <div className="flex mb-6">
              <button
                onClick={() => handleTabChange("Traveler")}
                className={`flex-1 py-3 text-center rounded-l-lg font-medium ${
                  activeTab === "Traveler"
                    ? "bg-[#9DAE11] text-white"
                    : "bg-light_gray_2 text-light_gray"
                }`}>
                Traveler
              </button>
              <button
                onClick={() => handleTabChange("Agency")}
                className={`flex-1 py-3 text-center rounded-r-lg font-medium ${
                  activeTab === "Agency"
                    ? "bg-[#9DAE11] text-white"
                    : "bg-light_gray_2 text-light_gray"
                }`}>
                Agency
              </button>
            </div>

            {/* Form Title */}
            <h2 className="text-2xl font-bold text-center mb-6 dark_gray">
              Sign in Form
            </h2>

            {/* Form */}
            <form onSubmit={handleSubmit(onSubmit)}>
              {/* Hidden Role Input */}
              <input
                type="hidden"
                {...register("role")} // Stores "Traveler" or "Agency"
              />

              {/* Email Input */}
              <div className="mb-4">
                <input
                  type="email"
                  placeholder="Enter your email"
                  className="w-full p-3 bg_1 rounded-lg light_gray focus:outline-none focus:ring-2 focus:ring-gray"
                  {...register("email", { required: "Email is required" })}
                />
                {errors.email && (
                  <p className="text-red-500 text-sm mt-1">
                    {errors.email.message}
                  </p>
                )}
              </div>

              {/* Password Input */}
              <div className="mb-4 relative">
                <input
                  type={showPassword ? "text" : "password"}
                  placeholder="Password"
                  className="w-full p-3 bg_1 rounded-lg light_gray focus:outline-none focus:ring-2 focus:ring-gray"
                  {...register("password", {
                    required: "Password is required",
                  })}
                />
                <span
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute right-3 top-1/2 transform -translate-y-1/2 light_gray cursor-pointer material-icons">
                  {showPassword ? "visibility_off" : "visibility"}
                </span>
                {errors.password && (
                  <p className="text-red-500 text-sm mt-1">
                    {errors.password.message}
                  </p>
                )}
              </div>

              {/* Remember Me Checkbox */}
              <div className="flex items-center mb-6">
                <input
                  type="checkbox"
                  id="remember"
                  className="mr-2 h-5 w-5"
                  {...register("remember")}
                />
                <label htmlFor="remember" className="dark_gray">
                  Remember me
                </label>
              </div>

              {/* Sign In Button */}
              <button
                type="submit"
                className="w-full primary_btn !py-3 rounded-md">
                Sign in
              </button>

              {/* Create New Account Link */}
              <p className="text-center mt-4 light_gray">
                Don’t have an account?{" "}
                <Link to="/signup" className="text-[#9DAE11] hover:underline">
                  Create a New Account
                </Link>
              </p>
            </form>
          </div>
        </div>
      </div>
    </>
  );
}

export default Login;
