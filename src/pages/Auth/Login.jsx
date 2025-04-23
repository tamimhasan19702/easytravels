/** @format */

import { useState, useEffect } from "react";
import { useForm } from "react-hook-form";
import { Link, useNavigate } from "react-router-dom";
import Header from "../../components/Header";
import { auth, db } from "../../../firebase.config";
import { signInWithEmailAndPassword } from "firebase/auth";
import { doc, getDoc } from "firebase/firestore";
import { useUser } from "../../context/UserContext";
import { motion } from "framer-motion";
import Lottie from "lottie-react";
import Signin from "../../assets/login02.json";

function Login() {
  const [activeTab, setActiveTab] = useState("Traveler");
  const [showPassword, setShowPassword] = useState(false);
  const [firebaseError, setFirebaseError] = useState(null);
  const [isLoading, setIsLoading] = useState(false);

  const { user, login, loading } = useUser();
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

  // Redirect if already authenticated
  useEffect(() => {
    if (!loading && user) {
      navigate("/dashboard");
    }
  }, [user, loading, navigate]);

  const handleTabChange = (tab) => {
    setActiveTab(tab);
    setValue("role", tab === "Agency" ? "agent" : "Traveler");
  };

  const onSubmit = async (data) => {
    try {
      setIsLoading(true);
      setFirebaseError(null);

      // Step 1: Sign in with email and password
      const userCredential = await signInWithEmailAndPassword(
        auth,
        data.email,
        data.password
      );
      const firebaseUser = userCredential.user;

      // Step 2: Refresh token
      await firebaseUser.getIdToken(true);
      console.log("User authenticated:", firebaseUser.uid);

      // Step 3: Fetch user data from Firestore
      const userRef = doc(db, "users", firebaseUser.uid);
      console.log("Fetching user document:", userRef.path);
      const userDoc = await getDoc(userRef);
      if (!userDoc.exists()) {
        throw new Error("User data not found in Firestore.");
      }

      const userData = userDoc.data();
      // Map "Agency" to "agent"
      const storedRole = userData.role === "Agency" ? "agent" : userData.role;
      console.log("Fetched user data:", {
        uid: firebaseUser.uid,
        role: storedRole,
      });

      // Step 4: Verify email and role
      if (userData.email !== data.email) {
        throw new Error("Email does not match the registered user.");
      }
      if (storedRole !== data.role) {
        throw new Error(
          `Role mismatch: You are registered as a ${storedRole}, but you selected ${data.role}.`
        );
      }

      // Step 5: Create user object for context
      const contextUserData = {
        uid: firebaseUser.uid,
        email: data.email,
        role: storedRole,
        fullName: userData.fullName || "",
        phoneNumber: userData.phoneNumber || "",
      };

      // Step 6: Store user in context
      login(contextUserData);

      console.log("User signed in successfully:", firebaseUser.uid);
      navigate("/dashboard");
    } catch (error) {
      console.error("Login error:", error, {
        code: error.code,
        message: error.message,
      });
      if (error.code === "auth/user-not-found") {
        setFirebaseError("No user found with this email.");
      } else if (error.code === "auth/wrong-password") {
        setFirebaseError("Incorrect password. Please try again.");
      } else if (error.code === "auth/invalid-email") {
        setFirebaseError("Please enter a valid email address.");
      } else if (error.code === "permission-denied") {
        setFirebaseError("Insufficient permissions to access user data.");
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
          {/* Left Side: Animation */}
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
                Sign in Form
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

                <div className="flex items-center justify-between mb-6">
                  <div className="flex items-center">
                    <input
                      type="checkbox"
                      id="remember"
                      className="mr-2 h-5 w-5"
                    />
                    <label htmlFor="remember" className="dark_gray">
                      Remember Me
                    </label>
                  </div>
                  <Link
                    to="/forgot-password"
                    className="text-[#9DAE11] text-sm hover:underline">
                    Forgot Password?
                  </Link>
                </div>

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

                <p className="text-center mt-4 light_gray">
                  Don’t have an account?{" "}
                  <Link to="/signup" className="text-[#9DAE11] hover:underline">
                    Sign up here
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

export default Login;
