/** @format */

import { useState } from "react";
import { useForm } from "react-hook-form";
import { Link, useNavigate } from "react-router-dom";
import Header from "../../components/Header";
import { auth, db } from "../../../firebase.config"; // Import auth and db from firebase.config
import { createUserWithEmailAndPassword } from "firebase/auth"; // For creating user
import { doc, setDoc } from "firebase/firestore"; // For Firestore operations

function Signup() {
  const [activeTab, setActiveTab] = useState("Traveler"); // State for tab switching (role selection)
  const [showPassword, setShowPassword] = useState(false); // State for password visibility
  const [showConfirmPassword, setShowConfirmPassword] = useState(false); // State for confirm password visibility
  const [firebaseError, setFirebaseError] = useState(null); // State for Firebase errors
  const {
    register,
    handleSubmit,
    formState: { errors },
    setValue,
    watch,
  } = useForm({
    defaultValues: {
      role: "Traveler", // Default role
    },
  });
  const navigate = useNavigate();

  // Watch the password field to compare with confirm password
  const password = watch("password");

  // Update the role value in the form whenever the activeTab changes
  const handleTabChange = (tab) => {
    setActiveTab(tab);
    setValue("role", tab); // Update the role field in the form
  };

  const onSubmit = async (data) => {
    try {
      // Clear any previous Firebase errors
      setFirebaseError(null);

      // Step 1: Create user with email and password using Firebase Authentication
      const userCredential = await createUserWithEmailAndPassword(
        auth,
        data.email,
        data.password
      );
      const user = userCredential.user;

      // Step 2: Store additional user data in Firestore
      await setDoc(doc(db, "users", user.uid), {
        email: data.email,
        phoneNumber: data.phoneNumber,
        role: data.role,
        createdAt: new Date().toISOString(),
      });

      console.log("User created successfully:", user.uid);
      navigate("/"); // Redirect to home after successful signup
    } catch (error) {
      // Handle Firebase-specific errors
      if (error.code === "auth/email-already-in-use") {
        setFirebaseError(
          "This email is already in use. Please use a different email."
        );
      } else if (error.code === "auth/invalid-email") {
        setFirebaseError("Please enter a valid email address.");
      } else if (error.code === "auth/weak-password") {
        setFirebaseError("Password should be at least 6 characters.");
      } else {
        setFirebaseError("An error occurred. Please try again.");
      }
      console.error("Signup error:", error);
    }
  };

  return (
    <>
      <Header />
      <div className="container flex items-center justify-start h-screen">
        {/* Left Side: Title */}
        <div className="w-1/2">
          <h1 className="text-center">Signup</h1>
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
                    : "bg-white text-light_gray"
                }`}>
                Traveler
              </button>
              <button
                onClick={() => handleTabChange("Agency")}
                className={`flex-1 py-3 text-center rounded-r-lg font-medium ${
                  activeTab === "Agency"
                    ? "bg-[#9DAE11] text-white"
                    : "bg-white text-light_gray"
                }`}>
                Agency
              </button>
            </div>

            {/* Form Title */}
            <h2 className="text-2xl font-bold text-center mb-6 dark_gray">
              Sign up Form
            </h2>

            {/* Display Firebase Error */}
            {firebaseError && (
              <p className="text-red-500 text-sm text-center mb-4">
                {firebaseError}
              </p>
            )}

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
                    minLength: {
                      value: 6,
                      message: "Password must be at least 6 characters",
                    },
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

              {/* Confirm Password Input */}
              <div className="mb-4 relative">
                <input
                  type={showConfirmPassword ? "text" : "password"}
                  placeholder="Confirm Password"
                  className="w-full p-3 bg_1 rounded-lg light_gray focus:outline-none focus:ring-2 focus:ring-gray"
                  {...register("confirmPassword", {
                    required: "Please confirm your password",
                    validate: (value) =>
                      value === password || "Passwords do not match",
                  })}
                />
                <span
                  onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                  className="absolute right-3 top-1/2 transform -translate-y-1/2 light_gray cursor-pointer material-icons">
                  {showConfirmPassword ? "visibility_off" : "visibility"}
                </span>
                {errors.confirmPassword && (
                  <p className="text-red-500 text-sm mt-1">
                    {errors.confirmPassword.message}
                  </p>
                )}
              </div>

              {/* Phone Number Input */}
              <div className="mb-4">
                <input
                  type="tel"
                  placeholder="Phone Number"
                  className="w-full p-3 bg_1 rounded-lg light_gray focus:outline-none focus:ring-2 focus:ring-gray"
                  {...register("phoneNumber", {
                    required: "Phone number is required",
                    pattern: {
                      value:
                        /^(\+\d{1,3}[- ]?)?\(?\d{3}\)?[- ]?\d{3}[- ]?\d{4}$/,
                      message: "Please enter a valid phone number",
                    },
                  })}
                />
                {errors.phoneNumber && (
                  <p className="text-red-500 text-sm mt-1">
                    {errors.phoneNumber.message}
                  </p>
                )}
              </div>

              {/* Terms and Conditions Checkbox */}
              <div className="flex items-center mb-6">
                <input
                  type="checkbox"
                  id="terms"
                  className="mr-2 h-5 w-5"
                  {...register("terms", {
                    required: "You must accept terms and conditions",
                  })}
                />
                <label htmlFor="terms" className="dark_gray">
                  Accept Terms and Conditions
                </label>
              </div>
              {errors.terms && (
                <p className="text-red-500 text-sm mt-1">
                  {errors.terms.message}
                </p>
              )}

              {/* Sign Up Button */}
              <button
                type="submit"
                className="w-full primary_btn !py-3 rounded-md">
                Sign up
              </button>

              {/* Log In Link */}
              <p className="text-center mt-4 light_gray">
                Already have an account?{" "}
                <Link to="/login" className="text-[#9DAE11] hover:underline">
                  Log in
                </Link>
              </p>
            </form>
          </div>
        </div>
      </div>
    </>
  );
}

export default Signup;
