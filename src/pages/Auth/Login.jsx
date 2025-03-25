/** @format */

import { useState } from "react";
import { useForm } from "react-hook-form";
import { Link, useNavigate } from "react-router-dom";
import Header from "../../components/Header";
import { auth, db } from "../../../firebase.config";
import { signInWithEmailAndPassword } from "firebase/auth";
import { doc, getDoc } from "firebase/firestore";
import { useUser } from "../../context/UserContext"; // Import the custom hook

function Login() {
  const [activeTab, setActiveTab] = useState("Traveler");
  const [showPassword, setShowPassword] = useState(false);
  const [firebaseError, setFirebaseError] = useState(null);
  const [isLoading, setIsLoading] = useState(false);

  const { login } = useUser(); // Get login function from context
  const {
    register,
    handleSubmit,
    formState: { errors },
    setValue,
  } = useForm({
    defaultValues: {
      role: "Traveler",
    },
  });
  const navigate = useNavigate();

  const handleTabChange = (tab) => {
    setActiveTab(tab);
    setValue("role", tab);
  };

  const onSubmit = async (data) => {
    try {
      setIsLoading(true);
      setFirebaseError(null);

      // Step 1: Sign in user with email and password
      const userCredential = await signInWithEmailAndPassword(
        auth,
        data.email,
        data.password
      );
      const user = userCredential.user;

      // Step 2: Fetch user data from Firestore
      const userDoc = await getDoc(doc(db, "users", user.uid));
      if (!userDoc.exists()) {
        throw new Error("User data not found in Firestore.");
      }

      const userData = userDoc.data();
      const storedRole = userData.role;

      // Step 3: Verify role
      if (storedRole !== data.role) {
        throw new Error(
          `Role mismatch: You are registered as a ${storedRole}, but you selected ${data.role}.`
        );
      }

      // Step 4: Create user object for context
      const contextUserData = {
        uid: user.uid,
        email: data.email,
        role: storedRole,
        phoneNumber: userData.phoneNumber,
      };

      // Step 5: Store user in context
      login(contextUserData);

      console.log("User signed in successfully:", user.uid);
      navigate("/dashboard");
    } catch (error) {
      if (error.code === "auth/user-not-found") {
        setFirebaseError("No user found with this email.");
      } else if (error.code === "auth/wrong-password") {
        setFirebaseError("Incorrect password. Please try again.");
      } else if (error.code === "auth/invalid-email") {
        setFirebaseError("Please enter a valid email address.");
      } else {
        setFirebaseError(
          error.message || "An error occurred. Please try again."
        );
      }
      console.error("Login error:", error);
    } finally {
      setIsLoading(false);
    }
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
              Sign in Form
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
              <input type="hidden" {...register("role")} />

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

              {/* Sign In Button with Loader */}
              <button
                type="submit"
                className="w-full primary_btn !py-3 rounded-md flex items-center justify-center"
                disabled={isLoading}>
                {isLoading ? (
                  <>
                    <span className="loader mr-2"></span>
                    Signing in...
                  </>
                ) : (
                  "Sign in"
                )}
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
