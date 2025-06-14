/** @format */

import { useState } from "react";
import { useForm } from "react-hook-form";
import { Link, useNavigate } from "react-router-dom";
import Header from "../../components/Header";
import { auth, db } from "../../../firebase.config";
import { createUserWithEmailAndPassword } from "firebase/auth";
import { doc, setDoc } from "firebase/firestore";
import { useUser } from "../../context/UserContext";
import Lottie from "lottie-react";
import Signin from "../../assets/login.json";
import { motion } from "framer-motion";

function Signup() {
  const [activeTab, setActiveTab] = useState("Traveler");
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [firebaseError, setFirebaseError] = useState(null);
  const [isLoading, setIsLoading] = useState(false);

  const { login, loading } = useUser();
  const {
    register,
    handleSubmit,
    formState: { errors },
    setValue,
    watch,
  } = useForm({
    defaultValues: {
      role: "Traveler",
    },
  });

  const navigate = useNavigate();
  const password = watch("password");

  const handleTabChange = (tab) => {
    setActiveTab(tab);
    setValue("role", tab === "Agency" ? "agent" : "Traveler");
  };

  const onSubmit = async (data) => {
    try {
      setIsLoading(true);
      setFirebaseError(null);

      // Create user with email and password
      const userCredential = await createUserWithEmailAndPassword(
        auth,
        data.email,
        data.password
      );
      const user = userCredential.user;

      // Refresh token
      await user.getIdToken(true);
      console.log("User created:", user.uid);

      // Create user document in Firestore
      await setDoc(doc(db, "users", user.uid), {
        uid: user.uid,
        fullName: data.fullName,
        email: data.email,
        phoneNumber: data.phoneNumber,
        role: data.role, // "agent" or "Traveler"
        createdAt: new Date().toISOString(),
      });
      console.log("User document created:", user.uid);

      // Create user object for context
      const userData = {
        uid: user.uid,
        email: data.email,
        role: data.role,
        fullName: data.fullName,
        phoneNumber: data.phoneNumber,
      };

      // Store user in context
      login(userData);
      navigate("/dashboard");
    } catch (error) {
      console.error("Signup error:", error, {
        code: error.code,
        message: error.message,
      });
      if (error.code === "auth/email-already-in-use") {
        setFirebaseError(
          "This email is already in use. Please use a different email."
        );
      } else if (error.code === "auth/invalid-email") {
        setFirebaseError("Please enter a valid email address.");
      } else if (error.code === "auth/weak-password") {
        setFirebaseError("Password should be at least 6 characters.");
      } else if (error.code === "permission-denied") {
        setFirebaseError("Insufficient permissions to create user data.");
      } else {
        setFirebaseError(
          error.message || "An error occurred. Please try again."
        );
      }
    } finally {
      setIsLoading(false);
    }
  };

  if (loading) {
    return <div>Loading...</div>;
  }

  return (
    <>
      <Header />
      <div className="container min-h-screen flex flex-col lg:flex-row items-center justify-center gap-10 px-4">
        <div className="mt-[100px] lg:mt-[0px] flex flex-col lg:flex-row items-center justify-center gap-[100px] px-4">
          <motion.div
            initial={{ opacity: 0, x: -500 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 1.5, ease: "easeInOut" }}
            className="w-full lg:w-1/2 flex items-center justify-center">
            <div className="w-full">
              <Lottie animationData={Signin} loop={true} />
            </div>
          </motion.div>

          {/* Right Side: Form */}
          <div className="w-full lg:w-1/2">
            <motion.div
              initial={{ opacity: 0, x: 500 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ duration: 1.5, ease: "easeInOut" }}
              className="bg-white p-8 rounded-lg shadow_1 w-full max-w-md mx-auto">
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

              {/* Firebase Error */}
              {firebaseError && (
                <p className="text-red-500 text-sm text-center mb-4">
                  {firebaseError}
                </p>
              )}

              {/* Form */}
              <form onSubmit={handleSubmit(onSubmit)}>
                <input type="hidden" {...register("role")} />

                <div className="mb-4">
                  <input
                    type="text"
                    placeholder="Enter your full name"
                    className="w-full p-3 bg_1 rounded-lg light_gray focus:outline-none focus:ring-2 focus:ring-gray"
                    {...register("fullName", {
                      required: "Full name is required",
                    })}
                  />
                  {errors.fullName && (
                    <p className="text-red-500 text-sm mt-1">
                      {errors.fullName.message}
                    </p>
                  )}
                </div>

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

                <div className="mb-4">
                  <input
                    type="tel"
                    placeholder="Phone Number"
                    className="w-full p-3 bg_1 rounded-lg light_gray focus:outline-none focus:ring-2 focus:ring-gray"
                    {...register("phoneNumber", {
                      required: "Phone number is required",
                      pattern: {
                        value: /^\+?[\d\s-]{7,15}$/,
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

                <button
                  type="submit"
                  className="w-full primary_btn !py-3 rounded-md flex items-center justify-center"
                  disabled={isLoading}>
                  {isLoading ? (
                    <>
                      <span className="loader mr-2"></span>
                      Signing up...
                    </>
                  ) : (
                    "Sign up"
                  )}
                </button>

                <p className="text-center mt-4 light_gray">
                  Already have an account?{" "}
                  <Link to="/login" className="text-[#9DAE11] hover:underline">
                    Sign in here
                  </Link>
                </p>
              </form>
            </motion.div>
          </div>
        </div>
      </div>
    </>
  );
}

export default Signup;
